import { ReactElement } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";

interface FunnyImageProps {
  clickHandler: () => void;
  imageUrl: string;
}

export const FunnyImage = ({
  clickHandler,
  imageUrl,
}: FunnyImageProps): ReactElement => {
  const mobile = useMediaQuery("(min-width:600px)");

  return (
    <div>
      <img
        className="image clickable funny-img"
        onClick={() => clickHandler()}
        src={imageUrl}
        alt="funny-image"
        height={mobile ? 500 : 150}
        width={mobile ? 500 : 150}
      />
    </div>
  );
};

export default FunnyImage;
