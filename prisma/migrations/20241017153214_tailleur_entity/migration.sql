/*
  Warnings:

  - You are about to drop the column `tailleurId` on the `posts` table. All the data in the column will be lost.
  - Added the required column `notifier_id` to the `notifications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tailleur_id` to the `posts` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `posts` DROP FOREIGN KEY `posts_tailleurId_fkey`;

-- AlterTable
ALTER TABLE `notifications` ADD COLUMN `notifier_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `posts` DROP COLUMN `tailleurId`,
    ADD COLUMN `tailleur_id` INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX `notifications_notifier_id_fkey` ON `notifications`(`notifier_id`);

-- CreateIndex
CREATE INDEX `posts_tailleur_id_fkey` ON `posts`(`tailleur_id`);

-- AddForeignKey
ALTER TABLE `posts` ADD CONSTRAINT `posts_tailleur_id_fkey` FOREIGN KEY (`tailleur_id`) REFERENCES `tailleurs`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_notifier_id_fkey` FOREIGN KEY (`notifier_id`) REFERENCES `comptes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
