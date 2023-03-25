-- CreateTable
CREATE TABLE "funny_images" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "image_url" TEXT NOT NULL,
    "votes" INTEGER DEFAULT 0,

    CONSTRAINT "funny_images_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "funny_images_image_url_key" ON "funny_images"("image_url");

