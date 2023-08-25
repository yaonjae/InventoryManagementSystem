/*
  Warnings:

  - You are about to drop the column `maxQuantity` on the `stock` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `products` ADD COLUMN `maxQuantity` INTEGER NOT NULL DEFAULT 100;

-- AlterTable
ALTER TABLE `stock` DROP COLUMN `maxQuantity`;
