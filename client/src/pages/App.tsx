import ImageChoice from "@/components/ImageChoice";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { getImages, voteForImage } from ".";
import { getTwoRandomIntsInRange } from "../utils";

export interface ImageChoiceObject {
  left: {
    imageUrl: string;
    clickHandler: () => void;
  };
  right: {
    imageUrl: string;
    clickHandler: () => void;
  };
}

export const App = () => {
  const { data } = useQuery("images", getImages);

  const createImageObject = (): ImageChoiceObject => {
    const [randomIndex1, randomIndex2] = getTwoRandomIntsInRange(
      0,
      data.length - 1
    );

    const imageUrl1 = data[randomIndex1].image_url;
    const imageUrl2 = data[randomIndex2].image_url;

    return {
      left: {
        imageUrl: imageUrl1,
        clickHandler: () => imageClickHandler(imageUrl1),
      },
      right: {
        imageUrl: imageUrl2,
        clickHandler: () => imageClickHandler(imageUrl2),
      },
    };
  };

  //initially set images to undefined to keep in sync with SSR
  const [images, setImages] = useState<undefined | ImageChoiceObject>();

  //immediately set images on page load after SSR is sync'd
  useEffect(() => {
    setImages(createImageObject());
  }, []);

  const imageClickHandler = (imageUrl: string) => {
    //vote for selected image
    voteForImage(imageUrl);
    //shuffle images for next cycle
    setImages(createImageObject());
  };

  return <div>{images && <ImageChoice images={images} />}</div>;
};

export default App;
