/*
  Warnings:

  - Added the required column `cost` to the `Cart` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productName` to the `Cart` table without a default value. This is not possible if the table is not empty.
  - Added the required column `supplierName` to the `Cart` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `cart` ADD COLUMN `cost` INTEGER NOT NULL,
    ADD COLUMN `productName` VARCHAR(191) NOT NULL,
    ADD COLUMN `supplierName` VARCHAR(191) NOT NULL;
