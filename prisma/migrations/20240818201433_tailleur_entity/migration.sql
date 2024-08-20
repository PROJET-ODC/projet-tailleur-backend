/*
  Warnings:

  - You are about to drop the `commandes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `paiements` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `taille_posts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tailles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tissu_posts` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `bloquers` DROP FOREIGN KEY `bloquers_blocked_id_fkey`;

-- DropForeignKey
ALTER TABLE `bloquers` DROP FOREIGN KEY `bloquers_blocker_id_fkey`;

-- DropForeignKey
ALTER TABLE `clients` DROP FOREIGN KEY `clients_compte_id_fkey`;

-- DropForeignKey
ALTER TABLE `commandes` DROP FOREIGN KEY `commandes_compte_id_fkey`;

-- DropForeignKey
ALTER TABLE `commandes` DROP FOREIGN KEY `commandes_post_id_fkey`;

-- DropForeignKey
ALTER TABLE `comments` DROP FOREIGN KEY `comments_compte_id_fkey`;

-- DropForeignKey
ALTER TABLE `comments` DROP FOREIGN KEY `comments_post_id_fkey`;

-- DropForeignKey
ALTER TABLE `favoris` DROP FOREIGN KEY `favoris_compte_id_fkey`;

-- DropForeignKey
ALTER TABLE `follows` DROP FOREIGN KEY `follows_followed_id_fkey`;

-- DropForeignKey
ALTER TABLE `follows` DROP FOREIGN KEY `follows_follower_id_fkey`;

-- DropForeignKey
ALTER TABLE `likes` DROP FOREIGN KEY `likes_compte_id_fkey`;

-- DropForeignKey
ALTER TABLE `messages` DROP FOREIGN KEY `messages_messaged_id_fkey`;

-- DropForeignKey
ALTER TABLE `messages` DROP FOREIGN KEY `messages_messager_id_fkey`;

-- DropForeignKey
ALTER TABLE `mesures` DROP FOREIGN KEY `mesures_compte_id_fkey`;

-- DropForeignKey
ALTER TABLE `notes` DROP FOREIGN KEY `notes_noted_id_fkey`;

-- DropForeignKey
ALTER TABLE `notes` DROP FOREIGN KEY `notes_noter_id_fkey`;

-- DropForeignKey
ALTER TABLE `notifications` DROP FOREIGN KEY `notifications_compte_id_fkey`;

-- DropForeignKey
ALTER TABLE `paiements` DROP FOREIGN KEY `paiements_commande_id_fkey`;

-- DropForeignKey
ALTER TABLE `reports` DROP FOREIGN KEY `reports_reported_id_fkey`;

-- DropForeignKey
ALTER TABLE `reports` DROP FOREIGN KEY `reports_reporter_id_fkey`;

-- DropForeignKey
ALTER TABLE `taille_posts` DROP FOREIGN KEY `taille_posts_post_id_fkey`;

-- DropForeignKey
ALTER TABLE `taille_posts` DROP FOREIGN KEY `taille_posts_taille_id_fkey`;

-- DropForeignKey
ALTER TABLE `tailleurs` DROP FOREIGN KEY `tailleurs_compte_id_fkey`;

-- DropForeignKey
ALTER TABLE `tissu_posts` DROP FOREIGN KEY `tissu_posts_post_id_fkey`;

-- DropForeignKey
ALTER TABLE `tissu_posts` DROP FOREIGN KEY `tissu_posts_stock_id_fkey`;

-- DropForeignKey
ALTER TABLE `vendeurs` DROP FOREIGN KEY `vendeurs_compte_id_fkey`;

-- AlterTable
ALTER TABLE `comptes` MODIFY `bio` VARCHAR(191) NULL,
    MODIFY `credit` INTEGER NOT NULL DEFAULT 0,
    ALTER COLUMN `updatedAt` DROP DEFAULT;

-- DropTable
DROP TABLE `commandes`;

-- DropTable
DROP TABLE `paiements`;

-- DropTable
DROP TABLE `taille_posts`;

-- DropTable
DROP TABLE `tailles`;

-- DropTable
DROP TABLE `tissu_posts`;
