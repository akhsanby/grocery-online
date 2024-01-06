/*
  Warnings:

  - You are about to drop the column `item_details` on the `histories` table. All the data in the column will be lost.
  - You are about to drop the column `payment_detail` on the `histories` table. All the data in the column will be lost.
  - Added the required column `product_id` to the `histories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transaction_detail` to the `histories` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `histories` DROP COLUMN `item_details`,
    DROP COLUMN `payment_detail`,
    ADD COLUMN `product_id` INTEGER NOT NULL,
    ADD COLUMN `transaction_detail` TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE `histories` ADD CONSTRAINT `histories_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products`(`product_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
