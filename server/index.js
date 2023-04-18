const express = require("express");
const Cron = require("croner");
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

Cron(
  "0 0 * * *",
  async () => {
    try {
      //run job at midnight PST every day
      //add some error handling
      console.log(`running at ${Date().toString()}`);
      cronJob();
    } catch (e) {
      console.log("error", e);
    }
  },
  { timezone: "America/Los_Angeles" }
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
  await persistNewImages(data);
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
  await addImages(imageThreshold, true);
  await resetVotes();
};

const resetVotes = async () => {
  await prisma.funny_images.updateMany({
    where: {
      votes: {
        gt: 0,
      },
    },
    data: {
      votes: 0,
    },
  });
};

//get top images
const getTopImages = async (numberOfTopImages) =>
  await prisma.funny_images.findMany({
    orderBy: [{ votes: "desc" }],
    take: numberOfTopImages,
  });

const getRelatedImages = async (imageId, numberOfRelatedImages) => {
  return await gf.related(imageId, {
    limit: numberOfRelatedImages,
  });
};

const persistNewImages = async (data) => {
  const newImages = data.map((image) => {
    const imageUrl = image.images.downsized_large.url;
    const imageId = image.id;
    return { image_url: imageUrl, image_id: imageId };
  });

  await prisma.funny_images.createMany({
    data: newImages,
    skipDuplicates: true,
  });
};

const addImages = async (imageThreshold, addRelatedImages) => {
  const gf = new GiphyFetch(giphyApiKey);

  let numberOfCurrentlyPersistedImages;

  //only add related images on first iteration, it gets too messy with recursion otherwise
  if (addRelatedImages === true) {
    const relatedSearchLimit = Math.floor((1 / 10) * imageThreshold);

    //retrieve top 5 images
    const topImages = await getTopImages(5);

    //get related images
    for (image of topImages) {
      //check how many total images are return from search string before doing real search at scale
      const {
        pagination: { total_count: totalCount },
      } = await getRelatedImages(image.image_id, 1);

      //150 is max offset from API
      const maxOffset = totalCount > 150 ? 150 : totalCount;

      //giphy returns results in consistent order. use random offset to get randomized new images
      const randomOffset = getRandomIntInclusive(0, maxOffset);

      const { data } = await getRelatedImages(
        image.image_id,
        relatedSearchLimit,
        {
          offset: randomOffset,
        }
      );

      await persistNewImages(data);

      // //check how many images are currently persisted, if above threshold, break
      numberOfCurrentlyPersistedImages = await prisma.funny_images.count();

      if (numberOfCurrentlyPersistedImages > imageThreshold) {
        break;
      }
    }
  } else {
    numberOfCurrentlyPersistedImages = await prisma.funny_images.count();
  }

  //check if we are still under threshold, if we are, add more images, unrelated to last top images
  if (numberOfCurrentlyPersistedImages < imageThreshold) {
    const searchString = "funny, trending, dogs, meme";
    const searchOptions = { lang: "en", rating: "pg" };

    //check how many total images are return from search string before doing real search at scale
    const {
      pagination: { total_count: totalCount },
    } = await gf.search(searchString, { limit: 1, ...searchOptions });

    //4999 is max offset from API
    const maxOffset = totalCount > 4999 ? 4999 : totalCount;

    //giphy search returns results in consistent order. use random offset to get randomized new images
    const randomOffset = getRandomIntInclusive(0, maxOffset);

    const { data } = await gf.search(searchString, {
      limit: 50,
      offset: randomOffset,
      ...searchOptions,
    });
    await persistNewImages(data);

    //keep adding images until we reach threshold, only add related images on first iteration
    addImages(imageThreshold, false);
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
  const searchString = "funny, trending, dogs, meme";
  const searchOptions = { lang: "en", rating: "pg" };
  const { data } = await gf.search(searchString, {
    limit: 1,
    ...searchOptions,
  });
  console.log(data[0].id);
  res.send("done");
});

app.get("/related", async (req, res) => {
  // const { data: gifs } = await gf.related("mUrBX1TF0kCRi", { limit: 10 });
  // console.log(gifs);
  console.log(await getRelatedImages("mUrBX1TF0kCRi", 2));
  //console.log(await getTopImages(5));
  res.send("done");
});

app.get("/resetVotes", async (req, res) => {
  await resetVotes();
  res.send("done");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
