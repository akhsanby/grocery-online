/*
  Warnings:

  - A unique constraint covering the columns `[order_id]` on the table `histories` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[transaction_id]` on the table `histories` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `histories_order_id_key` ON `histories`(`order_id`);

-- CreateIndex
CREATE UNIQUE INDEX `histories_transaction_id_key` ON `histories`(`transaction_id`);
