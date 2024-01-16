/*
  Warnings:

  - You are about to drop the column `history_id` on the `products` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `products` DROP FOREIGN KEY `products_history_id_fkey`;

-- AlterTable
ALTER TABLE `products` DROP COLUMN `history_id`;

-- CreateTable
CREATE TABLE `_HistoryToProduct` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_HistoryToProduct_AB_unique`(`A`, `B`),
    INDEX `_HistoryToProduct_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_HistoryToProduct` ADD CONSTRAINT `_HistoryToProduct_A_fkey` FOREIGN KEY (`A`) REFERENCES `histories`(`history_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_HistoryToProduct` ADD CONSTRAINT `_HistoryToProduct_B_fkey` FOREIGN KEY (`B`) REFERENCES `products`(`product_id`) ON DELETE CASCADE ON UPDATE CASCADE;
