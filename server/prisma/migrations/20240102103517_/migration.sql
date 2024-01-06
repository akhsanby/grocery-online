/*
  Warnings:

  - You are about to drop the column `order_id` on the `histories` table. All the data in the column will be lost.
  - You are about to drop the column `payment_url` on the `histories` table. All the data in the column will be lost.
  - Added the required column `payment_detail` to the `histories` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `histories` DROP COLUMN `order_id`,
    DROP COLUMN `payment_url`,
    ADD COLUMN `payment_detail` TEXT NOT NULL;
