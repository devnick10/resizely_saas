/*
  Warnings:

  - You are about to drop the column `creditsUsed` on the `TransformedImage` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[imageId,transformationHash]` on the table `TransformedImage` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `transformationHash` to the `TransformedImage` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "TransformedImage_imageId_transformation_key";

-- AlterTable
ALTER TABLE "TransformedImage" DROP COLUMN "creditsUsed",
ADD COLUMN     "transformationHash" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "TransformedImage_imageId_transformationHash_key" ON "TransformedImage"("imageId", "transformationHash");
