import { ReactElement } from "react";
import FunnyImage from "./FunnyImage";

interface ImagesInterface {
  images: {
    left: {
      imageUrl: string;
      clickHandler: (e) => void;
    };
    right: {
      imageUrl: string;
      clickHandler: (e) => void;
    };
  };
}

const ImageChoice = ({ images }: ImagesInterface): ReactElement => {
  return (
    <div className="image-container">
      <FunnyImage
        clickHandler={(e) => images.left.clickHandler(e)}
        imageUrl={images.left.imageUrl}
      />
      <FunnyImage
        clickHandler={(e) => images.right.clickHandler(e)}
        imageUrl={images.right.imageUrl}
      />
    </div>
  );
};

export default ImageChoice;
