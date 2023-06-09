import { ImageChoiceObject } from "@/pages/ImageContainer";
import styled from "@emotion/styled";
import { useMediaQuery } from "@mui/material";
import { ReactElement, useState } from "react";
import FunnyImage from "./FunnyImage";

export interface ImageChoiceProps {
  images: ImageChoiceObject;
}

enum Side {
  LEFT = "left",
  RIGHT = "right",
}

const ImageChoice = ({ images }: ImageChoiceProps): ReactElement => {
  const [leftImageLoaded, setLeftImageLoaded] = useState(false);
  const [rightImageLoaded, setRightImageLoaded] = useState(false);

  const mobile = useMediaQuery("(min-width:600px)");

  const StyledImageContainer = styled("div")({
    display: leftImageLoaded && rightImageLoaded ? "flex" : "none",
    flexDirection: mobile ? "row" : "column",
  });

  const handleClick = (side: Side) => {
    side === "left" ? images.left.clickHandler() : images.right.clickHandler();
    setRightImageLoaded(false);
  };

  return (
    <div>
      <StyledImageContainer className="image-container">
        <FunnyImage
          clickHandler={() => handleClick(Side.LEFT)}
          imageUrl={images.left.imageUrl}
          imageLoadCallback={() => setLeftImageLoaded(true)}
        />
        <FunnyImage
          clickHandler={() => handleClick(Side.RIGHT)}
          imageUrl={images.right.imageUrl}
          imageLoadCallback={() => setRightImageLoaded(true)}
        />
      </StyledImageContainer>
    </div>
  );
};

export default ImageChoice;
