// pages/api/post/index.ts

import prisma from "../../../../lib/prisma";

// POST /api/post
// Required fields in body: title
// Optional fields in body: content
export default async function handle(req, res) {
  const { imageUrl } = req.body;
  console.log("url", imageUrl);

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
