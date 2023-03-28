const express = require("express");
const cron = require("node-cron");
const app = express();
const port = 4000;
const { GiphyFetch } = require("@giphy/js-fetch-api");

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const giphyApiKey = process.env["GIPHY_API_KEY"];

const gf = new GiphyFetch(giphyApiKey);

cron.schedule("59 23 * * *", async () => {
  //run job at 11:59 PM every day
  cronJob();
});

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

const numberOfItemsToDrop = async (percentageOfImagesToDrop) => {
  let amountToDrop = 0;
  try {
    const totalNumberOfRecords = await prisma.funny_images.count();
    amountToDrop =
      totalNumberOfRecords -
      Math.round(totalNumberOfRecords) * percentageOfImagesToDrop;
  } catch (e) {
    console.log(e);
  }
  return amountToDrop;
};

const cronJob = async () => {
  const amountToDrop = await numberOfItemsToDrop(0.7);
  const imageThreshold = 200;
  await dropImages(amountToDrop);
  await addImages(imageThreshold, 0);
};

const addImages = async (imageThreshold, offset) => {
  const gf = new GiphyFetch(giphyApiKey);

  //check how many images are currently persisted
  const numberOfCurrentlyPersistedImages = await prisma.funny_images.count();

  if (numberOfCurrentlyPersistedImages < imageThreshold) {
    const { data } = await gf.trending({ rating: "pg-13", offset, limit: 50 });

    const newImages = data.map((image) => {
      const imageUrl = image.images.fixed_width.url;
      return { image_url: imageUrl };
    });

    await prisma.funny_images.createMany({
      data: newImages,
      skipDuplicates: true,
    });

    //keep adding images until we reach threshold
    let newOffset = offset + 50;
    addImages(imageThreshold, newOffset);
  }
  return;
};

const dropImages = async (amountToDrop) => {
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
};

app.get("/", async (req, res) => {
  cronJob();
  res.send("done");
});

app.get("/dropAll", async (req, res) => {
  await dropAll();
  res.send("done");
});

app.get("/createImages", async (req, res) => {
  await createImages();
  res.send("done");
});

app.get("/test", async (req, res) => {
  const { data } = await gf.trending({ offset, limit: 50 });
  res.send("done");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
