/*
  Warnings:

  - Added the required column `maxQuantity` to the `Cart` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `cart` ADD COLUMN `maxQuantity` INTEGER NOT NULL;
