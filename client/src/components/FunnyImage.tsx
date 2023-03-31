import { ReactElement } from "react";

interface FunnyImageProps {
  clickHandler: () => void;
  imageUrl: string;
}

export const FunnyImage = ({
  clickHandler,
  imageUrl,
}: FunnyImageProps): ReactElement => {
  return (
    <img
      className="image clickable"
      onClick={() => clickHandler()}
      src={imageUrl}
    />
  );
};

export default FunnyImage;
