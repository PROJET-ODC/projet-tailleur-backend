/*
  Warnings:

  - Made the column `categorie` on table `posts` required. This step will fail if there are existing NULL values in that column.
  - Made the column `tailleurId` on table `posts` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `posts` DROP FOREIGN KEY `posts_tailleurId_fkey`;

-- AlterTable
ALTER TABLE `posts` MODIFY `categorie` ENUM('IMAGE', 'VIDEO') NOT NULL,
    MODIFY `tailleurId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `posts` ADD CONSTRAINT `posts_tailleurId_fkey` FOREIGN KEY (`tailleurId`) REFERENCES `tailleurs`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `posts` RENAME INDEX `posts_tailleurId_fkey` TO `posts_tailleur_id_fkey`;
