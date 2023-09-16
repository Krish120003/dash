/*
  Warnings:

  - You are about to drop the column `Radius` on the `Location` table. All the data in the column will be lost.
  - Added the required column `radius` to the `Location` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Location" DROP CONSTRAINT "Location_userId_fkey";

-- AlterTable
ALTER TABLE "Location" DROP COLUMN "Radius";
ALTER TABLE "Location" ADD COLUMN     "radius" FLOAT8 NOT NULL;

-- CreateTable
CREATE TABLE "Layout" (
    "id" STRING NOT NULL,
    "userId" STRING NOT NULL,
    "name" STRING NOT NULL,
    "layoutData" STRING NOT NULL,
    "locationId" STRING,

    CONSTRAINT "Layout_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Layout" ADD CONSTRAINT "Layout_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Layout" ADD CONSTRAINT "Layout_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;
