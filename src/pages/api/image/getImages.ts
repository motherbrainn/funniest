import prisma from "../../../../lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

//split out functionality from route to use directly in getStaticProps
export const getAllImages = async () => {
  const images = await prisma.funny_images.findMany();
  return JSON.parse(JSON.stringify(images));
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const jsonData = await getAllImages();
  res.status(200).json(jsonData);
}
