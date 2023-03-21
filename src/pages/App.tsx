import ImageChoice from "@/components/ImageChoice";
import { useState } from "react";
import { useQuery } from "react-query";
import { getImages, voteForImage } from ".";
import { getRandomIntInclusive, getTwoRandomIntsInRange } from "./utils";

export const App = () => {
  const { data } = useQuery("posts", getImages);
  console.log(data);

  const set = () => {
    const [randomNumber1, randomNumber2] = getTwoRandomIntsInRange(0, 3);

    return {
      left: {
        imageUrl: data[randomNumber1].image_url,
        clickHandler: (e) => imageClickHandler(e),
      },
      right: {
        imageUrl: data[randomNumber2].image_url,
        clickHandler: (e) => imageClickHandler(e),
      },
    };
  };

  const [images, setImages] = useState(set());

  const [nums, setNums] = useState(getTwoRandomIntsInRange(0, 3));

  const imageClickHandler = (e) => {
    //shuffle nums
    voteForImage(e);
    setImages(set());
  };

  return (
    <div>
      <ImageChoice images={images} />
    </div>
  );
};

export default App;
