const express = require("express");
const cron = require("node-cron");
const app = express();
const port = 4000;
const { GiphyFetch } = require("@giphy/js-fetch-api");

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const giphyApiKey = process.env["GIPHY_API_KEY"];

cron.schedule("*/2 * * * * *", async () => {
  const gf = new GiphyFetch(giphyApiKey);
  const { data } = await gf.random({ tag: "beer" });
  const imageUrl = data.images.fixed_width.url;

  await prisma.funny_images.create({
    data: {
      image_url: imageUrl,
    },
  });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
