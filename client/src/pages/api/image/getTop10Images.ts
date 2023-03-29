import prisma from "../../../../lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const images = await prisma.funny_images.findMany({
    orderBy: [{ votes: "desc" }],
    take: 10,
  });

  res.status(200).json(images);
}
