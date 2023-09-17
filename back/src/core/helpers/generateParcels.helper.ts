import { Item } from "../interfaces/item.interface";
import { Order, OrderItem } from "../interfaces/order.interface";
import { ParcelWithoutTrackingId } from "../interfaces/parcel.interface";
const binPacker = require("bin-packer");

const getUniqueParcelItems = (parcelItems: OrderItem[]): OrderItem[] => {
  const parcelItemIds = parcelItems.map((parcelItem) => parcelItem.item_id);
  const uniqueParcelItemIds = [...new Set(parcelItemIds)];

  const uniqueParcelItems = uniqueParcelItemIds.map((uniqueParcelItemId) => {
    const parcelItemsWithSameId = parcelItems.filter(
      (parcelItem) => parcelItem.item_id === uniqueParcelItemId
    );
    const totalQuantity = parcelItemsWithSameId.reduce(
      (acc, parcelItem) => acc + parcelItem.quantity,
      0
    );
    return { item_id: uniqueParcelItemId, quantity: totalQuantity };
  });

  return uniqueParcelItems;
};

// const getNbOfParcelsInPalette = (
//   parcels: ParcelWithoutTrackingId[],
//   paletteNumber: number
// ): number => {
//   const parcelsInPalette = parcels.filter(
//     (parcel) => parcel.palette_number === paletteNumber
//   );
//   return parcelsInPalette.length;
// };

// const createNewParcel = (
//   orderId: string,
//   paletteNumber: number
// ): ParcelWithoutTrackingId => ({
//   order_id: orderId,
//   items: [],
//   weight: 0,
//   palette_number: paletteNumber,
// });

export const generateParcels = (
  items: Item[],
  orders: Order[]
): ParcelWithoutTrackingId[] => {
  const MAX_PARCEL_WEIGHT = 30;
  // const MAX_PARCELS_IN_PALETTE = 15;

  let parcels: ParcelWithoutTrackingId[] = [];

  orders.forEach((order: Order) => {
    const orderWithWeight = order.items.map((orderItem: OrderItem) => {
      const itemInfo = items.find((item) => item.id === orderItem.item_id);
      const orderItemWeight = parseFloat(itemInfo!.weight);
      return { ...orderItem, weight: orderItemWeight, order_id: order.id };
    });
    const sortedOrderByWeightAsc = orderWithWeight.sort(
      (a, b) => a.weight - b.weight
    );
    const flatSortedOrder = sortedOrderByWeightAsc.flatMap((orderItem, index) =>
      Array(orderItem.quantity).fill({
        ...orderWithWeight[index],
        quantity: 1,
      })
    );

    const sizeOf = (item: any) => item["weight"];
    const result = binPacker.nextFit(
      flatSortedOrder,
      sizeOf,
      MAX_PARCEL_WEIGHT
    );

    result.bins.forEach((parcel: any) => {
      const parcelItems = parcel.map((item: any) => ({
        item_id: item.item_id,
        quantity: item.quantity,
      }));
      const parcelWeight = parcel.reduce(
        (acc: number, item: any) => acc + item.weight,
        0
      );
      const parcelToAdd = {
        order_id: order.id,
        items: parcelItems,
        weight: parcelWeight,
        palette_number: parcel.palette_number,
      };
      parcels.push(parcelToAdd);
    });
  });

  return parcels.map((parcel) => ({
    ...parcel,
    items: getUniqueParcelItems(parcel.items),
  }));
};
