import { ReactElement } from "react";
import { useQuery } from "react-query";

interface FunnyImageProps {
  clickHandler: () => void;
  imageUrl: string;
}

export const FunnyImage = ({
  clickHandler,
  imageUrl,
}: FunnyImageProps): ReactElement => {
  return (
    <img className="image" onClick={() => clickHandler()} src={imageUrl} />
  );
};

export default FunnyImage;
