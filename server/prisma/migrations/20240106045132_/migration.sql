/*
  Warnings:

  - You are about to drop the `_historytoproduct` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_historytoproduct` DROP FOREIGN KEY `_HistoryToProduct_A_fkey`;

-- DropForeignKey
ALTER TABLE `_historytoproduct` DROP FOREIGN KEY `_HistoryToProduct_B_fkey`;

-- DropTable
DROP TABLE `_historytoproduct`;

-- CreateTable
CREATE TABLE `histories_on_products` (
    `product_id` INTEGER NOT NULL,
    `history_id` INTEGER NOT NULL,
    `assignedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `assignedBy` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`product_id`, `history_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `histories_on_products` ADD CONSTRAINT `histories_on_products_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products`(`product_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `histories_on_products` ADD CONSTRAINT `histories_on_products_history_id_fkey` FOREIGN KEY (`history_id`) REFERENCES `histories`(`history_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
