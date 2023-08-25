/*
  Warnings:

  - Added the required column `cost` to the `Stock` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `stock` ADD COLUMN `cost` INTEGER NOT NULL;
