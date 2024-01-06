/*
  Warnings:

  - You are about to drop the column `order_id` on the `histories` table. All the data in the column will be lost.
  - You are about to drop the column `total_amount` on the `histories` table. All the data in the column will be lost.
  - You are about to drop the column `transaction_status` on the `histories` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `histories_order_id_key` ON `histories`;

-- AlterTable
ALTER TABLE `histories` DROP COLUMN `order_id`,
    DROP COLUMN `total_amount`,
    DROP COLUMN `transaction_status`;
