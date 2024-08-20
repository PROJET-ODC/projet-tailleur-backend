/*
  Warnings:

  - You are about to drop the `CommentResponse` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `CommentResponse` DROP FOREIGN KEY `CommentResponse_comment_id_fkey`;

-- DropTable
DROP TABLE `CommentResponse`;

-- CreateTable
CREATE TABLE `comment_responses` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `content` VARCHAR(191) NOT NULL,
    `comment_id` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `comment_responses` ADD CONSTRAINT `comment_responses_comment_id_fkey` FOREIGN KEY (`comment_id`) REFERENCES `comments`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
