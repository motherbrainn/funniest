import prisma from "../../../../lib/prisma";

export default async function getAllImages(req, res) {
  const images = await prisma.funny_images.findMany();
  res.json(images);
}
