import { ReactElement } from "react";
import { useQuery } from "react-query";

interface FunnyImageProps {
  clickHandler: (e) => void;
  imageUrl: string;
}

export const FunnyImage = ({
  clickHandler,
  imageUrl,
}: FunnyImageProps): ReactElement => {
  return (
    <img className="image" onClick={(e) => clickHandler(e)} src={imageUrl} />
  );
};

export default FunnyImage;
