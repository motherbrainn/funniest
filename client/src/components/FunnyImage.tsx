import next from "next";
import { ReactElement } from "react";
import Image from "next/image";

interface FunnyImageProps {
  clickHandler: () => void;
  imageUrl: string;
}

export const FunnyImage = ({
  clickHandler,
  imageUrl,
}: FunnyImageProps): ReactElement => {
  return (
    <Image
      className="image clickable"
      onClick={() => clickHandler()}
      src={imageUrl}
      alt="funny-image"
      width={500}
      height={500}
    />
  );
};

export default FunnyImage;
