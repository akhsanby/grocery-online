/*
  Warnings:

  - You are about to drop the column `callback_payment` on the `histories` table. All the data in the column will be lost.
  - You are about to drop the column `items` on the `histories` table. All the data in the column will be lost.
  - Added the required column `order_id` to the `histories` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `histories` DROP COLUMN `callback_payment`,
    DROP COLUMN `items`,
    ADD COLUMN `order_id` VARCHAR(100) NOT NULL;
