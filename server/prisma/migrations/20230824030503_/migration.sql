-- AlterTable
ALTER TABLE `cart` ADD COLUMN `orderDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `receiveDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);