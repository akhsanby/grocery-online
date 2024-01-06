/*
  Warnings:

  - Added the required column `payment_url` to the `histories` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `histories` ADD COLUMN `payment_url` TEXT NOT NULL;
