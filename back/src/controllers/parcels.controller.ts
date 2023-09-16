import { Request, Response } from "express";

export const parcelsList = async (_: Request, res: Response) => {
  res.status(200).json();
};
