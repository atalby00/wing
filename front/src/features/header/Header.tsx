import { Card } from "flowbite-react";
import { FC } from "react";

interface HeaderProps {
  earnings: number | null;
  totalItems: number | undefined;
  nbPalettes: number;
}

export const Header: FC<HeaderProps> = ({
  earnings,
  totalItems,
  nbPalettes,
}) => {
  return (
    <div className="flex flex-row flex-wrap gap-3 mb-5 mt-3">
      <Card className="flex-1">
        <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white text-center">
          Rémunération de l'opération
        </h5>
        <p className="font-normal text-gray-700 dark:text-gray-400 text-center text-lg">
          {earnings} €
        </p>
      </Card>
      <Card className="flex-1">
        <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white text-center">
          Nombre de produits à envoyer
        </h5>
        <p className="font-normal text-gray-700 dark:text-gray-400 text-center text-lg">
          {totalItems}
        </p>
      </Card>
      <Card className="flex-1">
        <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white text-center">
          Nombre de palettes utilisées
        </h5>
        <p className="font-normal text-gray-700 dark:text-gray-400 text-center text-lg">
          {nbPalettes}
        </p>
      </Card>
    </div>
  );
};
