/*
  Warnings:

  - You are about to drop the column `items_details` on the `histories` table. All the data in the column will be lost.
  - Added the required column `item_details` to the `histories` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `histories` DROP COLUMN `items_details`,
    ADD COLUMN `item_details` TEXT NOT NULL;
