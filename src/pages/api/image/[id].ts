// pages/api/post/[id].ts

import prisma from "../../../../lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

// DELETE /api/post/:id
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // const postId = req.query.id;
  const postId = "test";
  if (req.method === "DELETE") {
    const post = await prisma.funny_images.delete({
      where: { id: parseInt(postId) },
    });
    res.json(post);
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`
    );
  }
}
