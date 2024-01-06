/*
  Warnings:

  - You are about to drop the `payment_types` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `items` to the `histories` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `payment_types` DROP FOREIGN KEY `payment_types_history_id_fkey`;

-- AlterTable
ALTER TABLE `histories` ADD COLUMN `items` TEXT NOT NULL;

-- DropTable
DROP TABLE `payment_types`;
