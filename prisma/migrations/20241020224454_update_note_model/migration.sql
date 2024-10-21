/*
  Warnings:

  - You are about to alter the column `note` on the `notes` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - Made the column `taille` on table `commandes` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `commandes` MODIFY `taille` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `notes` MODIFY `note` INTEGER NOT NULL;
