const express = require("express");
const cron = require("node-cron");
const app = express();
const port = 4000;
const { GiphyFetch } = require("@giphy/js-fetch-api");

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const giphyApiKey = process.env["GIPHY_API_KEY"];

const gf = new GiphyFetch(giphyApiKey);

const getRandomIntInclusive = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
};

cron.schedule(
  "0 0 * * *",
  async () => {
    try {
      //run job at midnight PST every day
      //add some error handling
      console.log(`running at ${Date.now()}`);
      cronJob();
    } catch (e) {
      console.log("error", e);
    }
  },
  {
    scheduled: true,
    timezone: "America/Los_Angeles",
  }
);

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
  await addImages(imageThreshold);
};

const addImages = async (imageThreshold) => {
  const gf = new GiphyFetch(giphyApiKey);

  const searchString = "funny, trending, dogs";

  const {
    pagination: { total_count: totalCount },
  } = await gf.search(searchString, { limit: 1 });

  //4999 is max offset from API
  const maxOffset = totalCount > 4999 ? 4999 : totalCount;

  //giphy search returns results in consistent order. use random offset to get randomized new images
  const randomOffset = getRandomIntInclusive(0, maxOffset);

  //check how many images are currently persisted
  const numberOfCurrentlyPersistedImages = await prisma.funny_images.count();

  if (numberOfCurrentlyPersistedImages < imageThreshold) {
    const { data } = await gf.search(searchString, {
      limit: 50,
      offset: randomOffset,
    });

    const newImages = data.map((image) => {
      const imageUrl = image.images.downsized_large.url;
      return { image_url: imageUrl };
    });

    await prisma.funny_images.createMany({
      data: newImages,
      skipDuplicates: true,
    });

    //keep adding images until we reach threshold
    addImages(imageThreshold);
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
