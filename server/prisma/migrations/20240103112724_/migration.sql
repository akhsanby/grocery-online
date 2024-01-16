/*
  Warnings:

  - Made the column `order_id` on table `histories` required. This step will fail if there are existing NULL values in that column.
  - Made the column `transaction_id` on table `histories` required. This step will fail if there are existing NULL values in that column.
  - Made the column `transaction_status` on table `histories` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `histories` MODIFY `order_id` VARCHAR(100) NOT NULL,
    MODIFY `transaction_id` VARCHAR(100) NOT NULL,
    MODIFY `transaction_status` VARCHAR(20) NOT NULL;
