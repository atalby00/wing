import { FC } from "react";
import { Parcel } from "../../core/interfaces/parcel.interface";
import { Accordion } from "../../components/accordion";
import { Table, Badge } from "flowbite-react";

interface ParcelListProps {
  parcels: Parcel[] | undefined;
}

export const ParcelList: FC<ParcelListProps> = ({ parcels }) => {
  return (
    <div className="pb-3">
      {parcels?.map((parcel, index) => (
        <div className="mb-5" key={index}>
          <Accordion title={`Colis ${index + 1}`}>
            <div className="flex flex-row justify-between mb-3">
              <Badge size="lg" color="gray">
                Poids total du colis :{" "}
                <strong>{parcel.weight.toFixed(1)} kg</strong>
              </Badge>
              <Badge size="lg">
                Code de tracking : <strong>{parcel.tracking_id}</strong>
              </Badge>
            </div>
            <Table>
              <Table.Head>
                <Table.HeadCell>Identifiant de commande</Table.HeadCell>
                <Table.HeadCell>Identifiant du produit</Table.HeadCell>
                <Table.HeadCell>Nom</Table.HeadCell>
                <Table.HeadCell>Poids (kg)</Table.HeadCell>
                <Table.HeadCell>Quantité</Table.HeadCell>
              </Table.Head>
              {parcel.items.map((item) => (
                <Table.Body className="divide-y" key={item.item_id}>
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {parcel.order_id}
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {item.item_id}
                    </Table.Cell>
                    <Table.Cell>{item.name}</Table.Cell>
                    <Table.Cell>{item.weight}</Table.Cell>
                    <Table.Cell>{item.quantity}</Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
            </Table>
          </Accordion>
        </div>
      ))}
    </div>
  );
};
