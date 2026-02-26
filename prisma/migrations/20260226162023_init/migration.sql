/*
  Warnings:

  - You are about to drop the column `name` on the `Room` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[room_name]` on the table `Room` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `room_name` to the `Room` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Room_name_key";

-- AlterTable
ALTER TABLE "Room" DROP COLUMN "name",
ADD COLUMN     "room_name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Room_room_name_key" ON "Room"("room_name");
