import axiosInstance from "../core/interceptor";
import { DropOperation } from "../core/interfaces/drop.interface";

export const fetcDropParcelsOperation = async (): Promise<DropOperation> => {
  const parcels = await axiosInstance.get("/");
  return parcels.data;
};
