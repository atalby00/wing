import { Item } from "../interfaces/item.interface";
import {
  Order,
  OrderItem,
  OrderItemWithWeight,
} from "../interfaces/order.interface";
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

const isPaletteCapacityReached = (
  parcels: ParcelWithoutTrackingId[],
  paletteNumber: number
): boolean => {
  const MAX_PARCELS_IN_PALETTE = 15;
  const parcelsInPalette = parcels.filter(
    (parcel) => parcel.palette_number === paletteNumber
  );
  return parcelsInPalette.length === MAX_PARCELS_IN_PALETTE;
};

const mapOrderItemsToOrderItemsWithWeight = (
  items: Item[],
  order: Order
): OrderItemWithWeight[] => {
  return order.items.map((orderItem: OrderItem) => {
    const itemInfo = items.find((item) => item.id === orderItem.item_id);
    const itemWeight = parseFloat(itemInfo!.weight);
    return { ...orderItem, item_weight: itemWeight };
  });
};

const sortOrderItemsByWeightAsc = (
  orderItemsWithWeight: OrderItemWithWeight[]
) => {
  return orderItemsWithWeight.sort((a, b) => a.item_weight - b.item_weight);
};

const flattenOrderItemsWithWeightByQuantity = (
  orderItemsWithWeight: OrderItemWithWeight[]
) => {
  return orderItemsWithWeight.flatMap((orderItem) => {
    return Array(orderItem.quantity).fill({
      ...orderItem,
      quantity: 1,
    });
  });
};

const packOrderItemsWithWeight = (
  orderItemsWithWeight: OrderItemWithWeight[],
  maxParcelWeight: number
) => {
  const packByProperty = (item: OrderItemWithWeight) => item.item_weight;
  const packedItemsWithWeight = binPacker.nextFit(
    orderItemsWithWeight,
    packByProperty,
    maxParcelWeight
  );
  return packedItemsWithWeight.bins;
};

const createParcel = (
  orderId: string,
  paletteNumber: number,
  orderItemsWithWeight: OrderItemWithWeight[]
): ParcelWithoutTrackingId => {
  const parcelItems: OrderItem[] = orderItemsWithWeight.map(
    (item: OrderItemWithWeight) => ({
      item_id: item.item_id,
      quantity: item.quantity,
    })
  );
  const parcelWeight = orderItemsWithWeight.reduce(
    (acc: number, item: any) => acc + item.item_weight,
    0
  );
  return {
    order_id: orderId,
    items: parcelItems,
    weight: parcelWeight,
    palette_number: paletteNumber,
  };
};

export const generateParcels = (
  items: Item[],
  orders: Order[]
): ParcelWithoutTrackingId[] => {
  const MAX_PARCEL_WEIGHT = 30;

  let parcelsWithoutTracking: ParcelWithoutTrackingId[] = [];
  let paletteNumber = 1;

  orders.forEach((order: Order) => {
    const orderItemsWithWeight: OrderItemWithWeight[] =
      mapOrderItemsToOrderItemsWithWeight(items, order);

    const sortedOrderItemsByWeightAsc: OrderItemWithWeight[] =
      sortOrderItemsByWeightAsc(orderItemsWithWeight);

    const flattenedSortedOrderItems: OrderItemWithWeight[] =
      flattenOrderItemsWithWeightByQuantity(sortedOrderItemsByWeightAsc);

    const packedOrderItemsWithWeight: OrderItemWithWeight[][] =
      packOrderItemsWithWeight(flattenedSortedOrderItems, MAX_PARCEL_WEIGHT);

    packedOrderItemsWithWeight.forEach(
      (orderItemsWithWeight: OrderItemWithWeight[]) => {
        const paletteCapacityReached = isPaletteCapacityReached(
          parcelsWithoutTracking,
          paletteNumber
        );
        if (paletteCapacityReached) paletteNumber++;

        const parcelWithoutTranckingId = createParcel(
          order.id,
          paletteNumber,
          orderItemsWithWeight
        );
        parcelsWithoutTracking.push(parcelWithoutTranckingId);
      }
    );
  });

  const parcelsWithUniqueItems: ParcelWithoutTrackingId[] =
    parcelsWithoutTracking.map((parcel: ParcelWithoutTrackingId) => ({
      ...parcel,
      items: getUniqueParcelItems(parcel.items),
    }));

  return parcelsWithUniqueItems;
};
