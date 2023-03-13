import { ReactElement } from "react";
import FunnyImage from "./Image";

const ImageChoice = (): ReactElement => {
  return (
    <div className="image-container">
      <FunnyImage
        clickHandler={() => console.log("image 1")}
        imageUrl="https://media.tenor.com/images/1d73fd5b39730fd356b482128eb3746a/tenor.gif"
      />
      <FunnyImage
        clickHandler={() => console.log("image 2")}
        imageUrl="https://media.tenor.com/images/6e45dbbc34d8427ffcc322024c73f8fc/tenor.gi"
      />
    </div>
  );
};

export default ImageChoice;
