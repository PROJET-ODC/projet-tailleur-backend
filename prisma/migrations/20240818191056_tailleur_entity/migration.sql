/*
  Warnings:

  - You are about to drop the column `qte` on the `articles` table. All the data in the column will be lost.
  - Added the required column `qte` to the `article_unites` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `article_unites` ADD COLUMN `qte` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `articles` DROP COLUMN `qte`;
