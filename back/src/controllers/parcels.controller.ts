import { Request, Response } from "express";
import { items } from "../core/data/items.json";
import { orders } from "../core/data/orders.json";
import { ParcelGenerator } from "../core/entities/parcelGenerator.entity";
import { Parcel } from "../core/entities/parcel.entity";
import { Item } from "../core/interfaces/item.interface";
import { OrderItem } from "../core/entities/orderItem.entity";
import { ParcelDto } from "../core/dtos/parcel.dto";
import { OrderItemDto } from "../core/dtos/orderItem.dto";

export const parcelsList = (_: Request, res: Response) => {
  // const parcelsWithoutTrackingId: ParcelWithoutTrackingId[] = generateParcels(
  //   items,
  //   orders
  // );
  // const parcels: Parcel[] = parcelsWithoutTrackingId.map(
  //   (parcel: ParcelWithoutTrackingId) => ({
  //     ...parcel,
  //     tracking_id: generateTrackingCode(),
  //   })
  // );

  // const earnings = parcels.reduce((totalEarnings, parcel) => {
  //   return totalEarnings + calculateEarnings(parcel.weight);
  // }, 0);

  // res.status(200).json({
  //   parcels,
  //   earnings,
  // });
  const parcelPacker = new ParcelGenerator();
  const parcels: Parcel[] = parcelPacker.generateParcels(items, orders);

  let parcelsDto: ParcelDto[] = [];
  let orderItemDto: OrderItemDto[] = [];
  parcels.forEach((parcel: Parcel) => {
    parcel.items.forEach((orderItem: OrderItem) => {
      const itemInfo = items.find(
        (item: Item) => item.id === orderItem.item_id
      );
      const currentOrderItemDto = new OrderItemDto(
        orderItem.item_id,
        orderItem.quantity,
        itemInfo?.name!,
        itemInfo?.weight!
      );
      orderItemDto.push(currentOrderItemDto);
    });
    const currentParcelDto = new ParcelDto(
      parcel.order_id,
      orderItemDto,
      parcel.palette_number,
      parcel.weight,
      Parcel.generateTrackingCode()
    );
    parcelsDto.push(currentParcelDto);
    orderItemDto = [];
  });

  const earnings = parcels.reduce((totalEarnings, parcel: Parcel) => {
    return totalEarnings + Parcel.calculateEarnings(parcel.weight);
  }, 0);

  res.status(200).json({
    parcels: parcelsDto,
    earnings,
  });
};
