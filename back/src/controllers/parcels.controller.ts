import { Request, Response } from "express";
import { items } from "../core/data/items.json";
import { orders } from "../core/data/orders.json";
import { generateParcels } from "../core/helpers/generateParcels.helper";

export const parcelsList = async (_: Request, res: Response) => {
  const parcelsWithoutTrackingId = generateParcels(items, orders);
  res.status(200).json(parcelsWithoutTrackingId);
};
