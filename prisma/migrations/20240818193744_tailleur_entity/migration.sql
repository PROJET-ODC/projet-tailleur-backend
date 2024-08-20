/*
  Warnings:

  - Added the required column `tailleur_id` to the `stocks` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `stocks` ADD COLUMN `tailleur_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `stocks` ADD CONSTRAINT `stocks_tailleur_id_fkey` FOREIGN KEY (`tailleur_id`) REFERENCES `tailleurs`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
