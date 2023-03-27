const express = require("express");
const cron = require("node-cron");
const app = express();
const port = 4000;
const { GiphyFetch } = require("@giphy/js-fetch-api");

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const giphyApiKey = process.env["GIPHY_API_KEY"];

const gf = new GiphyFetch(giphyApiKey);

// cron.schedule("*/2 * * * * *", async () => {
//   const gf = new GiphyFetch(giphyApiKey);
//   const { data } = await gf.random({ tag: "beer" });
//   const imageUrl = data.images.fixed_width.url;

//   await prisma.funny_images.create({
//     data: {
//       image_url: imageUrl,
//     },
//   });
// });

const count = async () => {
  const test = await prisma.funny_images.count({});
  return test;
};

const dropAll = async () => {
  await prisma.funny_images.deleteMany({});
};

const createImages = async () => {
  const { data } = await gf.search("funny", {
    limit: 50,
  });

  const newImages = data.map((image) => {
    const imageUrl = image.images.fixed_width.url;
    return { image_url: imageUrl };
  });

  await prisma.funny_images.createMany({
    data: newImages,
    skipDuplicates: true,
  });
};

const dropImages = async (percentageOfImagesToDrop) => {
  //drop bottom 70%
  const amountToDrop =
    Math.round(await prisma.funny_images.count()) * percentageOfImagesToDrop;

  const result = await prisma.funny_images.findMany({
    orderBy: [{ votes: "desc" }],
  });
  const imagesToDrop = result.slice(amountToDrop).map((image) => image.id);

  try {
    await prisma.funny_images.deleteMany({
      where: {
        id: {
          in: imagesToDrop,
        },
      },
    });
  } catch (e) {
    console.log(e);
  }

  const gf = new GiphyFetch(giphyApiKey);
  const { data } = await gf.search("funny", {
    limit: 50,
  });

  const newImages = data.map((image) => {
    const imageUrl = image.images.fixed_width.url;
    return { image_url: imageUrl };
  });

  await prisma.funny_images.createMany({
    data: newImages,
    skipDuplicates: true,
  });

  return amountToDrop;
};

app.get("/", async (req, res) => {
  const test = await dropImages(0.7);
  res.send(JSON.stringify(test));
});

app.get("/dropAll", async (req, res) => {
  await dropAll();
  res.send("done");
});

app.get("/createImages", async (req, res) => {
  await createImages();
  res.send("done");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
