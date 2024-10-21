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















/*
  Correction de la migration pour rendre les colonnes `categorie` et `tailleurId` non-nullables,
  en veillant à ce que toutes les lignes existantes aient des valeurs valides.
*/

-- Vérifier si les colonnes `categorie` et `tailleurId` contiennent des valeurs NULL et les corriger avant d'appliquer la modification.
-- UPDATE posts
-- SET categorie = 'IMAGE'
-- WHERE categorie IS NULL;

-- UPDATE posts
-- SET tailleurId = 1
-- WHERE tailleurId IS NULL;

-- -- DropForeignKey
-- ALTER TABLE `posts` DROP FOREIGN KEY `posts_tailleurId_fkey`;

-- -- AlterTable : Rendre les colonnes `categorie` et `tailleurId` non-nullables
-- ALTER TABLE `posts` MODIFY `categorie` ENUM('IMAGE', 'VIDEO') NOT NULL,
--     MODIFY `tailleurId` INTEGER NOT NULL;

-- -- AddForeignKey : Restaurer la contrainte de clé étrangère
-- ALTER TABLE `posts` ADD CONSTRAINT `posts_tailleurId_fkey` FOREIGN KEY (`tailleurId`) REFERENCES `tailleurs`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- -- RenameIndex : Renommer l'index pour correspondre à la nouvelle contrainte
-- ALTER TABLE `posts` RENAME INDEX `posts_tailleurId_fkey` TO `posts_tailleur_id_fkey`;
