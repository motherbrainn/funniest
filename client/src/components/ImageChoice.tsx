import { ImageChoiceObject } from "@/pages/ImageContainer";
import { ReactElement } from "react";
import FunnyImage from "./FunnyImage";

export interface ImageChoiceProps {
  images: ImageChoiceObject;
}

const ImageChoice = ({ images }: ImageChoiceProps): ReactElement => {
  return (
    <div className="image-container">
      <FunnyImage
        clickHandler={() => images.left.clickHandler()}
        imageUrl={images.left.imageUrl}
      />
      <FunnyImage
        clickHandler={() => images.right.clickHandler()}
        imageUrl={images.right.imageUrl}
      />
    </div>
  );
};

export default ImageChoice;
