-- CreateEnum
CREATE TYPE "TransformationType" AS ENUM ('DERIVED', 'IRREVERSIBLE');

-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_userId_fkey";

-- DropForeignKey
ALTER TABLE "Video" DROP CONSTRAINT "Video_userId_fkey";

-- AlterTable
ALTER TABLE "TransformedImage" ADD COLUMN     "type" "TransformationType" NOT NULL DEFAULT 'DERIVED',
ALTER COLUMN "transformation" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "TransformedImage_imageId_idx" ON "TransformedImage"("imageId");

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Video" ADD CONSTRAINT "Video_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
