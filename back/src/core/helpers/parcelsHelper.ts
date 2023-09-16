import { Item } from "../interfaces/item.interface";
import { Order, OrderItem } from "../interfaces/order.interface";
import { ParcelWithoutTrackingId } from "../interfaces/parcel.interface";

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

const getNbOfParcelsInPalette = (
  parcels: ParcelWithoutTrackingId[],
  paletteNumber: number
): number => {
  const parcelsInPalette = parcels.filter(
    (parcel) => parcel.palette_number === paletteNumber
  );
  return parcelsInPalette.length;
};

const createNewParcel = (
  orderId: string,
  paletteNumber: number
): ParcelWithoutTrackingId => ({
  order_id: orderId,
  items: [],
  weight: 0,
  palette_number: paletteNumber,
});

export const generateParcels = (
  items: Item[],
  orders: Order[]
): ParcelWithoutTrackingId[] => {
  const MAX_PARCEL_WEIGHT = 30;
  const MAX_PARCELS_IN_PALETTE = 15;

  let parcels: ParcelWithoutTrackingId[] = [];
  let totalParcelWeight = 0;
  let paletteNumber = 1;
  let currentParcel = createNewParcel(orders[0].id, paletteNumber);

  orders.forEach((order: Order) => {
    order.items.forEach((orderItem: OrderItem) => {
      const itemInfo = items.find((item) => item.id === orderItem.item_id);
      const orderItemWeight = parseFloat(itemInfo!.weight) * orderItem.quantity;

      if (orderItemWeight > MAX_PARCEL_WEIGHT) {
        for (let i = 0; i < orderItem.quantity; i++) {
          const nbOfParcelsInPalette = getNbOfParcelsInPalette(
            parcels,
            paletteNumber
          );
          if (nbOfParcelsInPalette === MAX_PARCELS_IN_PALETTE) {
            paletteNumber++;
          }

          const newParcel = createNewParcel(order.id, paletteNumber);
          newParcel.items.push(orderItem);
          newParcel.weight = parseFloat(itemInfo!.weight);

          parcels.push(newParcel);
        }
      } else if (orderItemWeight + totalParcelWeight > MAX_PARCEL_WEIGHT) {
        const currentParcelItems = getUniqueParcelItems(currentParcel.items);
        currentParcel.items = currentParcelItems;
        parcels.push(currentParcel);

        totalParcelWeight = 0;

        const nbOfParcelsInPalette = getNbOfParcelsInPalette(
          parcels,
          paletteNumber
        );
        if (nbOfParcelsInPalette === MAX_PARCELS_IN_PALETTE) {
          paletteNumber++;
        }
        currentParcel = createNewParcel(order.id, paletteNumber);
        currentParcel.items.push(orderItem);
      } else {
        totalParcelWeight = totalParcelWeight + orderItemWeight;
        currentParcel.items.push(orderItem);
        currentParcel.weight = totalParcelWeight;
      }
    });
  });

  return parcels;
};
