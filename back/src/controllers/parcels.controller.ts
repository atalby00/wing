import { Request, Response } from "express";
import { items } from "../core/data/items.json";
import { orders } from "../core/data/orders.json";
import { generateParcels } from "../core/helpers/generateParcels.helper";

/** Décommenter le code ci-dessous pour extraire les tracking_id de l'API random.org */
// import axios from "axios";

/** Commenter le code ci-dessous et décommenter le code ci-dessus pour extraire les tracking_id de l'API random.org */
import { generateTrackingCode } from "../core/helpers/generateTrackingCode.helper";

import { calculateEarnings } from "../core/helpers/calculateEarnings.helper";
import {
  Parcel,
  ParcelWithoutTracking,
} from "../core/interfaces/parcel.interface";

export const parcelsList = async (_: Request, res: Response) => {
  const parcelsWithoutTrackingId: ParcelWithoutTracking[] = generateParcels(
    items,
    orders
  );

  /** Décommenter le code ci-dessous pour extraire les tracking_id de l'API random.org */
  /** Ne pas oublier de décommenter l'import de la librairie axios qui se trouve au début de ce fichier  */
  // const parcels: Parcel[] = await Promise.all(
  //   parcelsWithoutTrackingId.map(async (parcel: ParcelWithoutTracking) => {
  //     const trackingId = await axios.get(
  //       "https://www.random.org/integers/?num=1&min=100000000&max=110000000&col=1&base=10&format=plain&rnd=new"
  //     );
  //     return {
  //       ...parcel,
  //       tracking_id: trackingId.data,
  //     };
  //   })
  // );

  //* Commenter le code ci-dessous et décommenter le code ci-dessous pour extraire les tracking_id de l'API random.org */
  const parcels: Parcel[] = parcelsWithoutTrackingId.map(
    (parcel: ParcelWithoutTracking) => {
      return {
        ...parcel,
        tracking_id: generateTrackingCode(),
      };
    }
  );

  const earnings = parcels.reduce((totalEarnings, parcel) => {
    return totalEarnings + calculateEarnings(parcel.weight);
  }, 0);

  res.status(200).json({
    parcels,
    earnings,
  });
};
