/*
  Warnings:

  - Made the column `bio` on table `comptes` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `comptes` MODIFY `bio` VARCHAR(191) NOT NULL,
    ALTER COLUMN `credit` DROP DEFAULT,
    MODIFY `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE `tailleurs` ADD CONSTRAINT `tailleurs_compte_id_fkey` FOREIGN KEY (`compte_id`) REFERENCES `comptes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `clients` ADD CONSTRAINT `clients_compte_id_fkey` FOREIGN KEY (`compte_id`) REFERENCES `comptes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `mesures` ADD CONSTRAINT `mesures_compte_id_fkey` FOREIGN KEY (`compte_id`) REFERENCES `comptes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reports` ADD CONSTRAINT `reports_reported_id_fkey` FOREIGN KEY (`reported_id`) REFERENCES `comptes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reports` ADD CONSTRAINT `reports_reporter_id_fkey` FOREIGN KEY (`reporter_id`) REFERENCES `comptes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notes` ADD CONSTRAINT `notes_noted_id_fkey` FOREIGN KEY (`noted_id`) REFERENCES `comptes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notes` ADD CONSTRAINT `notes_noter_id_fkey` FOREIGN KEY (`noter_id`) REFERENCES `comptes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bloquers` ADD CONSTRAINT `bloquers_blocked_id_fkey` FOREIGN KEY (`blocked_id`) REFERENCES `comptes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bloquers` ADD CONSTRAINT `bloquers_blocker_id_fkey` FOREIGN KEY (`blocker_id`) REFERENCES `comptes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `follows` ADD CONSTRAINT `follows_followed_id_fkey` FOREIGN KEY (`followed_id`) REFERENCES `comptes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `follows` ADD CONSTRAINT `follows_follower_id_fkey` FOREIGN KEY (`follower_id`) REFERENCES `comptes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `messages` ADD CONSTRAINT `messages_messaged_id_fkey` FOREIGN KEY (`messaged_id`) REFERENCES `comptes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `messages` ADD CONSTRAINT `messages_messager_id_fkey` FOREIGN KEY (`messager_id`) REFERENCES `comptes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comments` ADD CONSTRAINT `comments_compte_id_fkey` FOREIGN KEY (`compte_id`) REFERENCES `comptes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comments` ADD CONSTRAINT `comments_post_id_fkey` FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `favoris` ADD CONSTRAINT `favoris_compte_id_fkey` FOREIGN KEY (`compte_id`) REFERENCES `comptes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `likes` ADD CONSTRAINT `likes_compte_id_fkey` FOREIGN KEY (`compte_id`) REFERENCES `comptes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_compte_id_fkey` FOREIGN KEY (`compte_id`) REFERENCES `comptes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `vendeurs` ADD CONSTRAINT `vendeurs_compte_id_fkey` FOREIGN KEY (`compte_id`) REFERENCES `comptes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
