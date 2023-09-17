import { Request, Response } from "express";
import { items } from "../core/data/items.json";
import { orders } from "../core/data/orders.json";
import {
  calculateEarnings,
  generateParcels,
  generateTrackingCode,
} from "../core/helpers/generateParcels.helper";
import {
  Parcel,
  ParcelWithoutTrackingId,
} from "../core/interfaces/parcel.interface";

export const parcelsList = (_: Request, res: Response) => {
  const parcelsWithoutTrackingId: ParcelWithoutTrackingId[] = generateParcels(
    items,
    orders
  );
  const parcels: Parcel[] = parcelsWithoutTrackingId.map(
    (parcel: ParcelWithoutTrackingId) => ({
      ...parcel,
      tracking_id: generateTrackingCode(),
    })
  );

  const earnings = parcels.reduce((totalEarnings, parcel) => {
    return totalEarnings + calculateEarnings(parcel.weight);
  }, 0);

  res.status(200).json({
    parcels,
    earnings,
  });
};
