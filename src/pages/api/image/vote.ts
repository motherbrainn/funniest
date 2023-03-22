import prisma from "../../../../lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { imageUrl } = req.body;

  const result = await prisma.funny_images.update({
    where: {
      image_url: imageUrl,
    },
    data: {
      votes: { increment: 1 },
    },
  });
  res.json(result);
}
