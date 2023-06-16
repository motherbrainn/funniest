// pages/api/post/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";

// POST /api/post
// Required fields in body: title
// Optional fields in body: content

// export default async function handle(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   const { title, content } = req.body;

//   const result = await prisma.funny_images.create({
//     data: {
//       image_url: "www.cool.com",
//     },
//   });
//   res.json(result);
// }
