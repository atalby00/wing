import { Item } from "../interfaces/item.interface";
import { Order, OrderItem } from "../interfaces/order.interface";
import {
  ParcelItem,
  ParcelWithoutTracking,
} from "../interfaces/parcel.interface";

/** Décommenter le code ci-dessous afin d'utiliser bin-packer pour grouper les colis */
// const binPacker = require("bin-packer");

/**
 * Cette fonction prend une liste d'articles de colis et renvoie une liste d'articles de colis uniques.
 * @example [{item_id: "1", quantity: 2, weight: 2, name: "Article 1"}, {item_id: "1", quantity: 1, weight: 2, name: "Article 1"}] => [{item_id: "1", quantity: 3, weight: 2, name: "Article 1"}]
 * @param {ParcelItem[]} parcelItems - La liste d'articles de colis à traiter.
 * @returns {ParcelItem[]} La liste d'articles de colis uniques.
 */
const getUniqueParcelItems = (parcelItems: ParcelItem[]): ParcelItem[] => {
  const itemIds = parcelItems.map((parcelItem) => parcelItem.item_id);
  const uniqueItemIds = [...new Set(itemIds)];

  const uniqueParcelItems = uniqueItemIds.map((itemId: string) => {
    const itemsWithSameId = parcelItems.filter(
      (parcelItem: ParcelItem) => parcelItem.item_id === itemId
    );
    const totalQuantity = itemsWithSameId.reduce(
      (acc, parcelItem) => acc + parcelItem.quantity,
      0
    );
    return {
      item_id: itemId,
      quantity: totalQuantity,
      name: itemsWithSameId[0].name,
      weight: itemsWithSameId[0].weight,
    };
  });

  return uniqueParcelItems;
};

/**
 * Cette fonction vérifie si la capacité maximale de la palette est atteinte.
 * @param {ParcelWithoutTracking[]} parcels - La liste de colis déjà créés.
 * @param {number} paletteNumber - Le numéro de la palette à vérifier.
 * @returns {boolean} True si la capacité maximale de la palette est atteinte, sinon false.
 */
const checkPaletteCapacityReached = (
  parcels: ParcelWithoutTracking[],
  paletteNumber: number
): boolean => {
  const MAX_PARCELS_IN_PALETTE = 15;
  const parcelsInPalette = parcels.filter(
    (parcel) => parcel.palette_number === paletteNumber
  );
  return parcelsInPalette.length === MAX_PARCELS_IN_PALETTE;
};

/**
 * Cette fonction prend une commande et une liste d'articles et renvoie une liste d'articles de colis en rajoutant
 * le poids et le nom de l'article à chaque article de la commande.
 * @example [{item_id: "1", quantity: 2}, {item_id: "2", quantity: 1}] => [{item_id: "1", quantity: 2, weight: 2, name: "Article 1"}, {item_id: "2", quantity: 1, weight: 1, name: "Article 2"}]
 * @param {Item[]} items - La liste d'articles disponibles.
 * @param {Order} order - La commande à traiter.
 * @returns {ParcelItem[]} La liste d'articles de colis correspondant à la commande.
 */
const mapOrderItemsToParcelItems = (
  items: Item[],
  order: Order
): ParcelItem[] => {
  return order.items.map((orderItem: OrderItem) => {
    const itemInfo = items.find((item) => item.id === orderItem.item_id);
    const itemWeight = parseFloat(itemInfo!.weight);
    return { ...orderItem, weight: itemWeight, name: itemInfo!.name };
  });
};

/**
 * Cette fonction trie une liste d'articles de colis par poids croissant.
 * @example [{weight: 2}, {weight: 1}] => [{weight: 1}, {weight: 2}]
 * @param {ParcelItem[]} parcelItems - La liste d'articles de colis à trier.
 * @returns {ParcelItem[]} La liste d'articles de colis triée par poids croissant.
 */
const sortParcelItemsByWeightAsc = (
  parcelItems: ParcelItem[]
): ParcelItem[] => {
  return parcelItems.sort((a, b) => a.weight - b.weight);
};

/**
 * Cette fonction "aplatit" une liste d'articles de colis groupés par poids en une liste d'articles individuels de quantité 1.
 * @example [{item_id: "1", quantity: 2}, {item_id: "2", quantity: 1}] => [{item_id: "1", quantity: 1}, {item_id: "1", quantity: 1}, {item_id: "2", quantity: 1}]
 * @param {ParcelItem[]} parcelItems - La liste d'articles individuels à grouper en colis.
 * @param {number} maxParcelWeight - Le poids maximum autorisé pour chaque colis.
 * @returns {ParcelItem[][]} La liste de colis.
 */
const flattenParcelItems = (parcelItems: ParcelItem[]): ParcelItem[] => {
  return parcelItems.flatMap((item: ParcelItem) => {
    return Array(item.quantity).fill({
      ...item,
      quantity: 1,
    });
  });
};

/**
 * Cette fonction regroupe une liste d'articles individuels en colis en fonction de leur poids, en veillant à ne pas dépasser le poids maximum de colis.
 * @example Si maxParcelWeight = 3 : [{item_id: "1", quantity: 1, weight: 2}, {item_id: "1", quantity: 1, weight: 1}, {item_id: "2", quantity: 1, weight: 1}] => [[{item_id: "1", quantity: 1, weight: 2}, {item_id: "1", quantity: 1, weight: 1}], [{item_id: "2", quantity: 1, weight: 1}]]
 * @param {ParcelItem[]} parcelItems - La liste d'articles individuels à grouper en colis.
 * @param {number} maxParcelWeight - Le poids maximum autorisé pour chaque colis.
 * @returns {ParcelItem[][]} La liste de colis.
 */
const packParcelItems = (
  parcelItems: ParcelItem[],
  maxParcelWeight: number
) => {
  let parcelItemPacks: ParcelItem[][] = [];
  let currentPack: ParcelItem[] = [];

  parcelItems.reduce((totalParcelWeight, item, index) => {
    const isLastItem = index === parcelItems.length - 1;
    const currentParcelWeight = totalParcelWeight + item.weight;

    if (currentParcelWeight > maxParcelWeight) {
      parcelItemPacks.push(currentPack);
      const newPack = [item];
      if (isLastItem) {
        parcelItemPacks.push(newPack);
      } else {
        currentPack = newPack;
      }
      return item.weight;
    }

    currentPack.push(item);
    if (isLastItem) {
      parcelItemPacks.push(currentPack);
    }
    return currentParcelWeight;
  }, 0);

  return parcelItemPacks;
};

/** Décommenter le code ci-dessous et commenter le code ci-dessus afin d'utiliser bin-packer pour grouper les colis */
/** Ne pas oublier de décommenter l'import de bin-packer qui se trouve au début de ce fichier */
// const packParcelItems = (
//   parcelItems: ParcelItem[],
//   maxParcelWeight: number
// ): ParcelItem[][] => {
//   const packItemsByProperty = (item: ParcelItem) => item.weight;
//   const packedParcelItems = binPacker.nextFit(
//     parcelItems,
//     packItemsByProperty,
//     maxParcelWeight
//   );
//   return packedParcelItems.bins;
// };

/**
 * Cette fonction prend un identifiant de commande, un numéro de palette et une liste d'articles de colis et renvoie un objet de colis.
 * @param {string} orderId - L'identifiant de la commande.
 * @param {number} paletteNumber - Le numéro de la palette.
 * @param {ParcelItem[]} parcelItems - La liste d'articles de colis.
 * @returns {ParcelWithoutTracking} L'objet de colis.
 */
/** Commenter le code ci-dessous afin d'utiliser la librairie bin-packer pour grouper les colis */
const createParcel = (
  orderId: string,
  paletteNumber: number,
  parcelItems: ParcelItem[]
): ParcelWithoutTracking => {
  const parcelWeight = parcelItems.reduce(
    (acc: number, item: any) => acc + item.weight,
    0
  );
  return {
    order_id: orderId,
    items: parcelItems,
    weight: parcelWeight,
    palette_number: paletteNumber,
  };
};

/**
 * Cette fonction génère une liste de colis à partir des commandes et des articles.
 * @param {Item[]} items - La liste d'articles disponibles.
 * @param {Order[]} orders - La liste de commandes à traiter.
 * @returns {ParcelWithoutTracking[]} La liste de colis générée.
 */
export const generateParcels = (
  items: Item[],
  orders: Order[]
): ParcelWithoutTracking[] => {
  const MAX_PARCEL_WEIGHT = 30;

  let parcelsWithoutTracking: ParcelWithoutTracking[] = [];
  let paletteNumber = 1;

  orders.forEach((order: Order) => {
    const parcelItem: ParcelItem[] = mapOrderItemsToParcelItems(items, order);

    const sortedParcelItems: ParcelItem[] =
      sortParcelItemsByWeightAsc(parcelItem);

    const flattenedSortedParcelItems: ParcelItem[] =
      flattenParcelItems(sortedParcelItems);

    const parcelItemPacks: ParcelItem[][] = packParcelItems(
      flattenedSortedParcelItems,
      MAX_PARCEL_WEIGHT
    );

    parcelItemPacks.forEach((parcelItems: ParcelItem[]) => {
      const isPaletteCapacityReached = checkPaletteCapacityReached(
        parcelsWithoutTracking,
        paletteNumber
      );
      if (isPaletteCapacityReached) paletteNumber++;

      const newParcel: ParcelWithoutTracking = createParcel(
        order.id,
        paletteNumber,
        parcelItems
      );
      parcelsWithoutTracking.push(newParcel);
    });
  });

  const parcelsWithUniqueItems: ParcelWithoutTracking[] =
    parcelsWithoutTracking.map((parcel: ParcelWithoutTracking) => ({
      ...parcel,
      items: getUniqueParcelItems(parcel.items),
    }));

  return parcelsWithUniqueItems;
};
