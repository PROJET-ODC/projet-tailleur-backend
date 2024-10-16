/*
  Warnings:

  - Added the required column `tailleur_id` to the `paiements_articles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `paiements_articles` ADD COLUMN `tailleur_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `paiements_articles` ADD CONSTRAINT `paiements_articles_tailleur_id_fkey` FOREIGN KEY (`tailleur_id`) REFERENCES `tailleurs`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
