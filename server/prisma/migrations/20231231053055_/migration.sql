/*
  Warnings:

  - Added the required column `callback_payment` to the `histories` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `histories` ADD COLUMN `callback_payment` TEXT NOT NULL,
    ADD COLUMN `updated_at` DATETIME(3) NULL;
