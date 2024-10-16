/*
  Warnings:

  - You are about to drop the column `tailleur_id` on the `posts` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `posts` DROP FOREIGN KEY `posts_tailleur_id_fkey`;

-- AlterTable
ALTER TABLE `posts` DROP COLUMN `tailleur_id`,
    ADD COLUMN `tailleurId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `posts` ADD CONSTRAINT `posts_tailleurId_fkey` FOREIGN KEY (`tailleurId`) REFERENCES `tailleurs`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
