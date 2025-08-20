/*
  Warnings:

  - You are about to drop the column `message` on the `Chat` table. All the data in the column will be lost.
  - Added the required column `type` to the `Chat` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Chat" DROP COLUMN "message",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "height" DOUBLE PRECISION,
ADD COLUMN     "points" JSONB,
ADD COLUMN     "radius" DOUBLE PRECISION,
ADD COLUMN     "type" TEXT NOT NULL,
ADD COLUMN     "width" DOUBLE PRECISION,
ADD COLUMN     "x1" DOUBLE PRECISION,
ADD COLUMN     "x2" DOUBLE PRECISION,
ADD COLUMN     "y1" DOUBLE PRECISION,
ADD COLUMN     "y2" DOUBLE PRECISION;
