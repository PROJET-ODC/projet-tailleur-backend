/*
  Warnings:

  - Added the required column `libelle` to the `couleurs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `couleurs` ADD COLUMN `libelle` VARCHAR(191) NOT NULL;
