/*
  Warnings:

  - Added the required column `items_detail` to the `histories` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `histories` ADD COLUMN `items_detail` TEXT NOT NULL;
