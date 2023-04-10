/*
  Warnings:

  - A unique constraint covering the columns `[image_id]` on the table `funny_images` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `image_id` to the `funny_images` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "funny_images" ADD COLUMN     "image_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "funny_images_image_id_key" ON "funny_images"("image_id");
