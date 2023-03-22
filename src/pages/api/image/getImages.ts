import prisma from "../../../../lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function getAllImages(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const images = await prisma.funny_images.findMany();
  res.json(images);
}
