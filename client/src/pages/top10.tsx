import Link from "next/link";
import { useQuery } from "react-query";

const getTop10Images = async () => {
  const data = await fetch(`/api/image/getTop10Images`, {
    method: "GET",
  }).then((response) => response.json());

  return data;
};

interface ImageType {
  id: number;
  createdAt: string;
  image_url: string;
  vote: number;
}

export const Top10 = () => {
  const { data } = useQuery("top10Images", getTop10Images);

  return (
    <div
      style={{
        margin: "3rem",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <h2>today's top 10 images in the world</h2>
      {data && (
        <ul style={{ listStyleType: "none" }}>
          {data.map((image: ImageType) => (
            <li key={image.id} className="top-image">
              <img className="image" src={image.image_url} />
            </li>
          ))}
        </ul>
      )}

      <footer>
        <Link href="/" style={{ textDecoration: "underline" }}>
          home
        </Link>
      </footer>
    </div>
  );
};

export default Top10;
