/*
  Warnings:

  - You are about to drop the `Status` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Status` DROP FOREIGN KEY `Status_tailleur_id_fkey`;

-- DropTable
DROP TABLE `Status`;

-- CreateTable
CREATE TABLE `status` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `files` JSON NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `duration` VARCHAR(191) NOT NULL,
    `viewNb` INTEGER NOT NULL,
    `tailleur_id` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `status` ADD CONSTRAINT `status_tailleur_id_fkey` FOREIGN KEY (`tailleur_id`) REFERENCES `tailleurs`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
