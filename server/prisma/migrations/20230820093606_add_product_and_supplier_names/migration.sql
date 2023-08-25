/*
  Warnings:

  - Added the required column `productName` to the `Stock` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `Stock` table without a default value. This is not possible if the table is not empty.
  - Added the required column `supplierName` to the `Stock` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `stock` ADD COLUMN `productName` VARCHAR(191) NOT NULL,
    ADD COLUMN `quantity` INTEGER NOT NULL,
    ADD COLUMN `supplierName` VARCHAR(191) NOT NULL;
