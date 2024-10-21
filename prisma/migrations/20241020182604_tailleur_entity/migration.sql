-- CreateTable
CREATE TABLE `status_likes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `status_id` INTEGER NOT NULL,
    `compte_id` INTEGER NOT NULL,

    INDEX `status_likes_compte_id_fkey`(`compte_id`),
    INDEX `status_likes_status_id_fkey`(`status_id`),
    UNIQUE INDEX `status_likes_status_id_compte_id_key`(`status_id`, `compte_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `status_likes` ADD CONSTRAINT `status_likes_compte_id_fkey` FOREIGN KEY (`compte_id`) REFERENCES `comptes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `status_likes` ADD CONSTRAINT `status_likes_status_id_fkey` FOREIGN KEY (`status_id`) REFERENCES `status`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
