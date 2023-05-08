/*
  Warnings:

  - You are about to drop the column `contents` on the `Banzzack` table. All the data in the column will be lost.
  - Added the required column `content` to the `Banzzack` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Banzzack" DROP COLUMN "contents",
ADD COLUMN     "content" TEXT NOT NULL;
