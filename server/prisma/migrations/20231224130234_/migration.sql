/*
  Warnings:

  - You are about to drop the `checkouts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `histories` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `checkouts` DROP FOREIGN KEY `checkouts_cart_id_fkey`;

-- DropForeignKey
ALTER TABLE `checkouts` DROP FOREIGN KEY `checkouts_history_id_fkey`;

-- DropForeignKey
ALTER TABLE `checkouts` DROP FOREIGN KEY `checkouts_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `histories` DROP FOREIGN KEY `histories_user_id_fkey`;

-- DropTable
DROP TABLE `checkouts`;

-- DropTable
DROP TABLE `histories`;
