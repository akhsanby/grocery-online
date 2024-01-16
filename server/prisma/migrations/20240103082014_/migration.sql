-- AlterTable
ALTER TABLE `histories` ADD COLUMN `order_id` VARCHAR(100) NULL,
    ADD COLUMN `transaction_id` VARCHAR(100) NULL,
    ADD COLUMN `transaction_status` VARCHAR(20) NULL;
