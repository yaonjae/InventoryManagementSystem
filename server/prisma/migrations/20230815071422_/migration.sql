/*
  Warnings:

  - You are about to alter the column `quantity` on the `products` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `products` MODIFY `quantity` INTEGER NOT NULL;
