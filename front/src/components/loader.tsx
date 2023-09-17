import { FC } from "react";
import { ClipLoader } from "react-spinners";

interface ILoader {
  color?: string;
  size?: number;
}

const Loader: FC<ILoader> = ({ color, size }) => {
  return (
    <ClipLoader color={color || "#fe83b6"} loading={true} size={size || 50} />
  );
};

export default Loader;
