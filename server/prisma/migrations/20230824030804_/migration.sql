/*
  Warnings:

  - You are about to drop the column `orderDate` on the `cart` table. All the data in the column will be lost.
  - You are about to drop the column `receiveDate` on the `cart` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `cart` DROP COLUMN `orderDate`,
    DROP COLUMN `receiveDate`;
