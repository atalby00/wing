import { Item } from "../interfaces/item.interface";
import { Order } from "../interfaces/order.interface";
import { OrderItem } from "./orderItem.entity";
import { OrderItemWithWeight } from "./orderItemWithWeight.entity";
import { Parcel } from "./parcel.entity";

export class ParcelGenerator {
  private MAX_PARCEL_WEIGHT = 30;

  private getUniqueParcelItems(parcelItems: OrderItem[]): OrderItem[] {
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
      return new OrderItem(uniqueParcelItemId, totalQuantity);
    });

    return uniqueParcelItems;
  }

  private isPaletteCapacityReached(
    parcels: Parcel[],
    paletteNumber: number
  ): boolean {
    const MAX_PARCELS_IN_PALETTE = 15;
    const parcelsInPalette = parcels.filter(
      (parcel) => parcel.palette_number === paletteNumber
    );
    return parcelsInPalette.length === MAX_PARCELS_IN_PALETTE;
  }

  private mapOrderItemsToOrderItemsWithWeight(
    items: Item[],
    order: Order
  ): OrderItemWithWeight[] {
    return order.items.map((orderItem: OrderItem): OrderItemWithWeight => {
      const itemInfo = items.find((item) => item.id === orderItem.item_id);
      const itemWeight = parseFloat(itemInfo!.weight);
      return new OrderItemWithWeight(
        orderItem.item_id,
        orderItem.quantity,
        itemWeight
      );
    });
  }

  private sortOrderItemsByWeightAsc(
    orderItemWithWeight: OrderItemWithWeight[]
  ): OrderItemWithWeight[] {
    return orderItemWithWeight.sort((a, b) => a.item_weight - b.item_weight);
  }

  private flattenOrderItemsWithWeightByQuantity(
    orderItem: OrderItemWithWeight[]
  ) {
    return orderItem.flatMap((orderItem) => {
      return Array(orderItem.quantity).fill(
        new OrderItemWithWeight(orderItem.item_id, 1, orderItem.item_weight)
      );
    });
  }

  private packOrderItemsWithWeight(
    orderItem: OrderItemWithWeight[],
    maxParcelWeight: number
  ) {
    let parcels: OrderItemWithWeight[][] = [];
    let parcel: OrderItemWithWeight[] = [];

    orderItem.reduce((totalParcelWeight, item, index) => {
      const isLastItem = index === orderItem.length - 1;
      const currentParcelWeight = totalParcelWeight + item.item_weight;

      if (currentParcelWeight > maxParcelWeight) {
        parcels.push(parcel);
        const newParcel = [item];
        if (isLastItem) {
          parcels.push(newParcel);
        } else {
          parcel = newParcel;
        }
        return item.item_weight;
      }

      parcel.push(item);
      if (isLastItem) {
        parcels.push(parcel);
      }
      return currentParcelWeight;
    }, 0);

    return parcels;
  }

  private createParcel(
    orderId: string,
    paletteNumber: number,
    orderItem: OrderItemWithWeight[]
  ): Parcel {
    const parcelItems: OrderItemWithWeight[] = orderItem.map(
      (item: OrderItemWithWeight) =>
        new OrderItemWithWeight(item.item_id, item.quantity, item.item_weight)
    );
    const parcelWeight = orderItem.reduce(
      (acc: number, item: any) => acc + item.item_weight,
      0
    );
    return new Parcel(orderId, parcelItems, paletteNumber, parcelWeight);
  }

  public generateParcels(items: Item[], orders: Order[]) {
    let parcels: Parcel[] = [];
    let paletteNumber = 1;

    orders.forEach((order: Order) => {
      const orderItemWithWeight: OrderItemWithWeight[] =
        this.mapOrderItemsToOrderItemsWithWeight(items, order);

      const sortedOrderItemsByWeightAsc: OrderItemWithWeight[] =
        this.sortOrderItemsByWeightAsc(orderItemWithWeight);

      const flattenedSortedOrderItemsWithWeight: OrderItemWithWeight[] =
        this.flattenOrderItemsWithWeightByQuantity(sortedOrderItemsByWeightAsc);

      const packedOrderItemsWithWeight: OrderItemWithWeight[][] =
        this.packOrderItemsWithWeight(
          flattenedSortedOrderItemsWithWeight,
          this.MAX_PARCEL_WEIGHT
        );

      packedOrderItemsWithWeight.forEach((orderItem: OrderItemWithWeight[]) => {
        const ispaletteNumberCapacityReached = this.isPaletteCapacityReached(
          parcels,
          paletteNumber
        );
        if (ispaletteNumberCapacityReached) paletteNumber++;

        const parcel = this.createParcel(order.id, paletteNumber, orderItem);
        parcels.push(parcel);
      });
    });

    const parcelsWithUniqueItems: Parcel[] = parcels.map((parcel: Parcel) => ({
      ...parcel,
      items: this.getUniqueParcelItems(parcel.items),
    }));

    return parcelsWithUniqueItems;
  }
}
