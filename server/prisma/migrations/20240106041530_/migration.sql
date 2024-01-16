/*
  Warnings:

  - You are about to drop the column `product_id` on the `histories` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `histories` DROP FOREIGN KEY `histories_product_id_fkey`;

-- AlterTable
ALTER TABLE `histories` DROP COLUMN `product_id`;

-- AlterTable
ALTER TABLE `products` ADD COLUMN `history_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_history_id_fkey` FOREIGN KEY (`history_id`) REFERENCES `histories`(`history_id`) ON DELETE SET NULL ON UPDATE CASCADE;
