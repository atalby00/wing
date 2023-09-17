import { useEffect, useState } from "react";
import { fetcDropParcelsOperation } from "../services/parcel.service";
import { Parcel } from "../core/interfaces/parcel.interface";

interface useFetchParcelsReturn {
  parcels: Parcel[] | null;
  earnings: number | null;
  getNbPaletes: () => number;
  getParcelsFromPalette: (paletteNumber: number) => Parcel[] | undefined;
}

export const useFetchParcels = (): useFetchParcelsReturn => {
  const [parcels, setParcels] = useState<Parcel[] | null>(null);
  const [earnings, setEarnings] = useState<number | null>(null);

  const getNbPaletes = () => {
    const paletteList = parcels?.map((parcel) => parcel.palette_number);
    const nbPalette = [...new Set(paletteList)].length;
    return nbPalette;
  };

  const getParcelsFromPalette = (paletteNumber: number) => {
    const paletteList = parcels?.filter(
      (parcel) => parcel.palette_number === paletteNumber
    );
    return paletteList;
  };

  useEffect(() => {
    const getParcels = async () => {
      const { parcels, earnings } = await fetcDropParcelsOperation();
      setParcels(parcels);
      setEarnings(earnings);
    };
    getParcels();
  }, []);

  return {
    parcels,
    earnings,
    getNbPaletes,
    getParcelsFromPalette,
  };
};
