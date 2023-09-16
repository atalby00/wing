import { Item } from "../interfaces/item.interface";
import { Order, OrderItem } from "../interfaces/order.interface";
import { ParcelWithoutTrackingId } from "../interfaces/parcel.interface";

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

      if (totalParcelWeight + orderItemWeight <= MAX_PARCEL_WEIGHT) {
        totalParcelWeight = totalParcelWeight + orderItemWeight;
        currentParcel = {
          ...currentParcel,
          weight: totalParcelWeight,
          items: [...currentParcel.items, orderItem],
        };
      } else {
        parcels = [...parcels, currentParcel];

        const nbOfParcelsInPalette = getNbOfParcelsInPalette(
          parcels,
          paletteNumber
        );
        if (nbOfParcelsInPalette === MAX_PARCELS_IN_PALETTE) {
          paletteNumber++;
        }

        currentParcel = createNewParcel(order.id, paletteNumber);
      }
    });
  });

  return parcels;
};
