/*
  Warnings:

  - You are about to alter the column `montantTotal` on the `commande_articles` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - You are about to alter the column `prix` on the `detail_commande_articles` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - You are about to alter the column `montant` on the `paiements` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - You are about to alter the column `montant` on the `paiements_articles` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - You are about to alter the column `prix` on the `stocks` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.

*/
-- AlterTable
ALTER TABLE `commande_articles` MODIFY `montantTotal` DECIMAL(10, 2) NOT NULL;

-- AlterTable
ALTER TABLE `detail_commande_articles` MODIFY `prix` DECIMAL(10, 2) NOT NULL;

-- AlterTable
ALTER TABLE `paiements` MODIFY `montant` DECIMAL(10, 2) NOT NULL;

-- AlterTable
ALTER TABLE `paiements_articles` MODIFY `montant` DECIMAL(10, 2) NOT NULL;

-- AlterTable
ALTER TABLE `stocks` MODIFY `prix` DECIMAL(10, 2) NOT NULL;
