/*!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19  Distrib 10.6.18-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: ProjetTailleur
-- ------------------------------------------------------
-- Server version	10.6.18-MariaDB-0ubuntu0.22.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `CommentResponse`
--

DROP TABLE IF EXISTS `CommentResponse`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `CommentResponse` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `content` varchar(191) NOT NULL,
  `comment_id` int(11) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  KEY `CommentResponse_comment_id_fkey` (`comment_id`),
  CONSTRAINT `CommentResponse_comment_id_fkey` FOREIGN KEY (`comment_id`) REFERENCES `comments` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1500004 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CommentResponse`
--

LOCK TABLES `CommentResponse` WRITE;
/*!40000 ALTER TABLE `CommentResponse` DISABLE KEYS */;
INSERT INTO `CommentResponse` VALUES (1500001,'Merci beaucoup !',1400001,'2024-08-19 12:41:44.259','2024-08-19 12:41:44.259'),(1500002,'Nous allons vous contacter.',1400002,'2024-08-19 12:41:44.259','2024-08-19 12:41:44.259'),(1500003,'Visitez notre boutique en ligne.',1400003,'2024-08-19 12:41:44.259','2024-08-19 12:41:44.259');
/*!40000 ALTER TABLE `CommentResponse` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Status`
--

DROP TABLE IF EXISTS `Status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Status` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `files` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`files`)),
  `description` varchar(191) NOT NULL,
  `duration` varchar(191) NOT NULL,
  `viewNb` int(11) NOT NULL,
  `tailleur_id` int(11) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  KEY `Status_tailleur_id_fkey` (`tailleur_id`),
  CONSTRAINT `Status_tailleur_id_fkey` FOREIGN KEY (`tailleur_id`) REFERENCES `tailleurs` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1100004 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Status`
--

LOCK TABLES `Status` WRITE;
/*!40000 ALTER TABLE `Status` DISABLE KEYS */;
INSERT INTO `Status` VALUES (1100001,'{\"images\": [\"status1.jpg\", \"status2.jpg\"]}','Nouvelle collection de boubous','24h',50,300001,'2024-08-19 12:41:44.192','2024-08-19 12:41:44.192'),(1100002,'{\"videos\": [\"promo.mp4\"]}','Promo spéciale Korité','24h',100,300002,'2024-08-19 12:41:44.192','2024-08-19 12:41:44.192'),(1100003,'{\"images\": [\"tailleur1.jpg\"]}','Tenue traditionnelle disponible','24h',75,300003,'2024-08-19 12:41:44.192','2024-08-19 12:41:44.192');
/*!40000 ALTER TABLE `Status` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `_prisma_migrations`
--

DROP TABLE IF EXISTS `_prisma_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) NOT NULL,
  `checksum` varchar(64) NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) NOT NULL,
  `logs` text DEFAULT NULL,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `applied_steps_count` int(10) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_prisma_migrations`
--

LOCK TABLES `_prisma_migrations` WRITE;
/*!40000 ALTER TABLE `_prisma_migrations` DISABLE KEYS */;
INSERT INTO `_prisma_migrations` VALUES ('73cae14e-b65c-45c7-b2ea-6bbfe1e303b0','a9aedbeaee981b22de3532ceed408bb658bbb4268ccd5a32fabb9405551886f0','2024-08-19 12:41:24.814','20240819124124_tailleur_entity',NULL,NULL,'2024-08-19 12:41:24.100',1);
/*!40000 ALTER TABLE `_prisma_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `article_unites`
--

DROP TABLE IF EXISTS `article_unites`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `article_unites` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `prix` int(11) NOT NULL,
  `article_id` int(11) NOT NULL,
  `unite_id` int(11) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  KEY `article_unites_article_id_fkey` (`article_id`),
  KEY `article_unites_unite_id_fkey` (`unite_id`),
  CONSTRAINT `article_unites_article_id_fkey` FOREIGN KEY (`article_id`) REFERENCES `articles` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `article_unites_unite_id_fkey` FOREIGN KEY (`unite_id`) REFERENCES `unites` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=206 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `article_unites`
--

LOCK TABLES `article_unites` WRITE;
/*!40000 ALTER TABLE `article_unites` DISABLE KEYS */;
INSERT INTO `article_unites` VALUES (201,3000,950001,101,'2024-08-21 16:17:43.235','2024-08-21 16:17:43.235'),(202,5000,950002,102,'2024-08-21 16:17:43.235','2024-08-21 16:17:43.235'),(203,2000,950002,103,'2024-08-21 16:17:43.235','2024-08-21 16:17:43.235'),(204,4500,950003,101,'2024-08-21 16:17:43.235','2024-08-21 16:17:43.235'),(205,2500,950004,102,'2024-08-21 16:17:43.235','2024-08-21 16:17:43.235');
/*!40000 ALTER TABLE `article_unites` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `articles`
--

DROP TABLE IF EXISTS `articles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `articles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `libelle` varchar(191) NOT NULL,
  `etat` enum('DELETE','ACTIF') NOT NULL,
  `image` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`image`)),
  `description` varchar(191) NOT NULL,
  `prix` decimal(65,30) NOT NULL,
  `qte` int(11) NOT NULL,
  `slug` varchar(191) NOT NULL,
  `categorie_id` int(11) NOT NULL,
  `vendeur_id` int(11) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `articles_slug_key` (`slug`),
  KEY `articles_categorie_id_fkey` (`categorie_id`),
  KEY `articles_vendeur_id_fkey` (`vendeur_id`),
  CONSTRAINT `articles_categorie_id_fkey` FOREIGN KEY (`categorie_id`) REFERENCES `categories` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `articles_vendeur_id_fkey` FOREIGN KEY (`vendeur_id`) REFERENCES `vendeurs` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=950006 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `articles`
--

LOCK TABLES `articles` WRITE;
/*!40000 ALTER TABLE `articles` DISABLE KEYS */;
INSERT INTO `articles` VALUES (950001,'Tissu Wax Africain','ACTIF','[\"tissu_wax.jpg\"]','Tissu wax coloré et vibrant, parfait pour des vêtements traditionnels et modernes.',30.000000000000000000000000000000,100,'tissu-wax-africain',111111,770002,'2024-08-21 16:17:43.200','2024-08-21 16:17:43.200'),(950002,'Bazin Riche','ACTIF','[\"bazin_riche.jpg\"]','Tissu bazin richement décoré, souvent utilisé pour des tenues formelles et cérémonielles.',50.000000000000000000000000000000,50,'bazin-riche',222222,770002,'2024-08-21 16:17:43.200','2024-08-21 16:17:43.200'),(950003,'Tissu Kente','ACTIF','[\"tissu_kente.jpg\"]','Tissu Kente d\'Afrique de l\'Ouest avec des motifs géométriques traditionnels.',40.000000000000000000000000000000,75,'tissu-kente',333333,770003,'2024-08-21 16:17:43.200','2024-08-21 16:17:43.200'),(950004,'Tissu Batik','ACTIF','[\"tissu_batik.jpg\"]','Tissu Batik avec des motifs artisanaux colorés, idéal pour des vêtements élégants.',35.000000000000000000000000000000,60,'tissu-batik',111111,770002,'2024-08-21 16:17:43.200','2024-08-21 16:17:43.200'),(950005,'Tissu Ankara','ACTIF','[\"tissu_ankara.jpg\"]','Tissu Ankara avec des motifs vibrants, parfait pour des robes et des costumes traditionnels.',45.000000000000000000000000000000,80,'tissu-ankara',222222,770001,'2024-08-21 16:17:43.200','2024-08-21 16:17:43.200');
/*!40000 ALTER TABLE `articles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bloquers`
--

DROP TABLE IF EXISTS `bloquers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `bloquers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `blocker_id` int(11) NOT NULL,
  `blocked_id` int(11) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `bloquers_blocker_id_blocked_id_key` (`blocker_id`,`blocked_id`),
  KEY `bloquers_blocked_id_fkey` (`blocked_id`),
  CONSTRAINT `bloquers_blocked_id_fkey` FOREIGN KEY (`blocked_id`) REFERENCES `comptes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `bloquers_blocker_id_fkey` FOREIGN KEY (`blocker_id`) REFERENCES `comptes` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=800008 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bloquers`
--

LOCK TABLES `bloquers` WRITE;
/*!40000 ALTER TABLE `bloquers` DISABLE KEYS */;
INSERT INTO `bloquers` VALUES (800001,200003,200001,'2024-08-19 12:41:44.140','2024-08-19 12:41:44.140'),(800002,200001,200002,'2024-08-19 12:41:44.140','2024-08-19 12:41:44.140'),(800003,200003,200002,'2024-08-19 12:41:44.140','2024-08-19 12:41:44.140'),(800004,200002,200003,'2024-08-20 10:07:52.402','2024-08-20 10:07:52.402'),(800006,200002,200001,'2024-08-20 10:09:26.932','2024-08-20 10:09:26.932');
/*!40000 ALTER TABLE `bloquers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `libelle` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=333334 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (111111,'Accessoires','2024-08-19 12:41:44.338','2024-08-19 12:41:44.338'),(222222,'Vêtements Modernes','2024-08-19 12:41:44.338','2024-08-19 12:41:44.338'),(333333,'Vêtements Traditionnels','2024-08-19 12:41:44.338','2024-08-19 12:41:44.338');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clients`
--

DROP TABLE IF EXISTS `clients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `clients` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `compte_id` int(11) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `clients_compte_id_key` (`compte_id`),
  CONSTRAINT `clients_compte_id_fkey` FOREIGN KEY (`compte_id`) REFERENCES `comptes` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=400005 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clients`
--

LOCK TABLES `clients` WRITE;
/*!40000 ALTER TABLE `clients` DISABLE KEYS */;
INSERT INTO `clients` VALUES (400001,200001,'2024-08-19 12:41:44.086','2024-08-19 12:41:44.086'),(400002,200003,'2024-08-19 12:41:44.086','2024-08-19 12:41:44.086'),(400003,200002,'2024-08-19 12:41:44.086','2024-08-19 12:41:44.086'),(400004,200004,'2024-08-21 12:13:11.202','2024-08-21 12:13:11.202');
/*!40000 ALTER TABLE `clients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `commande_articles`
--

DROP TABLE IF EXISTS `commande_articles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `commande_articles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `etat` enum('TERMINER','EN_ATTENTE') NOT NULL,
  `numero` varchar(191) NOT NULL,
  `montantTotal` decimal(65,30) NOT NULL,
  `tailleur_id` int(11) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  KEY `commande_articles_tailleur_id_fkey` (`tailleur_id`),
  CONSTRAINT `commande_articles_tailleur_id_fkey` FOREIGN KEY (`tailleur_id`) REFERENCES `tailleurs` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1900006 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `commande_articles`
--

LOCK TABLES `commande_articles` WRITE;
/*!40000 ALTER TABLE `commande_articles` DISABLE KEYS */;
INSERT INTO `commande_articles` VALUES (1900001,'EN_ATTENTE','CA12345',25000.000000000000000000000000000000,300001,'2024-08-19 12:41:44.325','2024-08-19 12:41:44.325'),(1900002,'EN_ATTENTE','CA12346',30000.000000000000000000000000000000,300002,'2024-08-19 12:41:44.325','2024-08-19 12:41:44.325'),(1900003,'EN_ATTENTE','CA12347',15000.000000000000000000000000000000,300003,'2024-08-19 12:41:44.325','2024-08-19 12:41:44.325'),(1900004,'EN_ATTENTE','CA12348',35000.000000000000000000000000000000,300002,'2024-08-19 12:41:44.325','2024-08-19 12:41:44.325'),(1900005,'EN_ATTENTE','CA12349',25000.000000000000000000000000000000,300002,'2024-08-19 12:41:44.325','2024-09-19 12:41:44.325');
/*!40000 ALTER TABLE `commande_articles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `comments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `content` varchar(191) NOT NULL,
  `post_id` int(11) NOT NULL,
  `compte_id` int(11) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  KEY `comments_post_id_fkey` (`post_id`),
  KEY `comments_compte_id_fkey` (`compte_id`),
  CONSTRAINT `comments_compte_id_fkey` FOREIGN KEY (`compte_id`) REFERENCES `comptes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `comments_post_id_fkey` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1400004 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
INSERT INTO `comments` VALUES (1400001,'Très belle collection !',1200001,200001,'2024-08-19 12:41:44.246','2024-08-19 12:41:44.246'),(1400002,'Je veux commander cette tenue.',1200002,200002,'2024-08-19 12:41:44.246','2024-08-19 12:41:44.246'),(1400003,'Où puis-je acheter cela ?',1200003,200003,'2024-08-19 12:41:44.246','2024-08-19 12:41:44.246');
/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comptes`
--

DROP TABLE IF EXISTS `comptes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `comptes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(191) NOT NULL,
  `password` varchar(191) NOT NULL,
  `role` varchar(191) NOT NULL,
  `etat` varchar(191) NOT NULL,
  `identifiant` varchar(191) NOT NULL,
  `bio` varchar(191) NOT NULL,
  `credit` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `comptes_email_key` (`email`),
  UNIQUE KEY `comptes_identifiant_key` (`identifiant`),
  UNIQUE KEY `comptes_user_id_key` (`user_id`),
  CONSTRAINT `comptes_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=200008 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comptes`
--

LOCK TABLES `comptes` WRITE;
/*!40000 ALTER TABLE `comptes` DISABLE KEYS */;
INSERT INTO `comptes` VALUES (200001,'aissatou.sow@example.sn','$2a$10$mnc/nJJ3P5wFtBS79BmnQuVZuLr2FZxjDH4hPd/2f2pJgTfAiMv3i','client','actif','ASow123','Passionnée de mode',10000,100001,'2024-08-19 12:41:44.057','2024-08-19 12:41:44.057'),(200002,'oumar.ndiaye@example.sn','$2a$10$mnc/nJJ3P5wFtBS79BmnQuVZuLr2FZxjDH4hPd/2f2pJgTfAiMv3i','tailleur','actif','ONdiaye789','Créateur de tenues modernes',15000,100002,'2024-08-19 12:41:44.057','2024-08-19 12:41:44.057'),(200003,'fatou.ba@example.sn','$2a$10$mnc/nJJ3P5wFtBS79BmnQuVZuLr2FZxjDH4hPd/2f2pJgTfAiMv3i','client','actif','FBa321','Amatrice de boubous traditionnels',8000,100003,'2024-08-19 12:41:44.057','2024-08-19 12:41:44.057'),(200004,'aissatousow@example.com','$2a$10$mnc/nJJ3P5wFtBS79BmnQuVZuLr2FZxjDH4hPd/2f2pJgTfAiMv3i','client','actif','Aissatou_Sow','Je suis une passionnée de mode et de design.',0,100004,'2024-08-21 12:13:11.199','2024-08-21 12:13:11.199'),(200005,'mamadou.diop@example.com','$2a$10$mnc/nJJ3P5wFtBS79BmnQuVZuLr2FZxjDH4hPd/2f2pJgTfAiMv3i','vendeur','actif','MamadouD123','Vendeur expérimenté basé à Dakar',5000,100005,'2024-08-21 12:47:56.181','2024-08-21 12:47:56.181'),(200006,'aminata.ndiaye@example.com','$2a$10$mnc/nJJ3P5wFtBS79BmnQuVZuLr2FZxjDH4hPd/2f2pJgTfAiMv3i','vendeur','actif','AminataN456','Client régulier avec un excellent crédit',23,100006,'2024-08-21 12:47:56.181','2024-08-21 12:47:56.181'),(200007,'ibrahima.sarr@example.com','$2a$10$mnc/nJJ3P5wFtBS79BmnQuVZuLr2FZxjDH4hPd/2f2pJgTfAiMv3i','vendeur','actif','IbrahimaS789','Tailleur de renommée internationale',45,100007,'2024-08-21 12:47:56.181','2024-08-21 12:47:56.181');
/*!40000 ALTER TABLE `comptes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `couleur_articles`
--

DROP TABLE IF EXISTS `couleur_articles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `couleur_articles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `article_id` int(11) NOT NULL,
  `couleur_id` int(11) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  KEY `couleur_articles_article_id_fkey` (`article_id`),
  KEY `couleur_articles_couleur_id_fkey` (`couleur_id`),
  CONSTRAINT `couleur_articles_article_id_fkey` FOREIGN KEY (`article_id`) REFERENCES `articles` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `couleur_articles_couleur_id_fkey` FOREIGN KEY (`couleur_id`) REFERENCES `couleurs` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `couleur_articles`
--

LOCK TABLES `couleur_articles` WRITE;
/*!40000 ALTER TABLE `couleur_articles` DISABLE KEYS */;
/*!40000 ALTER TABLE `couleur_articles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `couleurs`
--

DROP TABLE IF EXISTS `couleurs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `couleurs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `couleurs`
--

LOCK TABLES `couleurs` WRITE;
/*!40000 ALTER TABLE `couleurs` DISABLE KEYS */;
/*!40000 ALTER TABLE `couleurs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `detail_commande_articles`
--

DROP TABLE IF EXISTS `detail_commande_articles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `detail_commande_articles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `qte` int(11) NOT NULL,
  `prix` decimal(65,30) NOT NULL,
  `article_id` int(11) NOT NULL,
  `commande_id` int(11) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  KEY `detail_commande_articles_article_id_fkey` (`article_id`),
  KEY `detail_commande_articles_commande_id_fkey` (`commande_id`),
  CONSTRAINT `detail_commande_articles_article_id_fkey` FOREIGN KEY (`article_id`) REFERENCES `articles` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `detail_commande_articles_commande_id_fkey` FOREIGN KEY (`commande_id`) REFERENCES `commande_articles` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12506 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `detail_commande_articles`
--

LOCK TABLES `detail_commande_articles` WRITE;
/*!40000 ALTER TABLE `detail_commande_articles` DISABLE KEYS */;
INSERT INTO `detail_commande_articles` VALUES (12500,2,60.000000000000000000000000000000,950001,1900001,'2024-08-20 11:00:00.000','2024-08-20 11:00:00.000'),(12501,1,50.000000000000000000000000000000,950002,1900003,'2024-08-20 11:05:00.000','2024-08-20 11:05:00.000'),(12502,3,120.000000000000000000000000000000,950003,1900002,'2024-08-20 11:10:00.000','2024-08-20 11:10:00.000'),(12503,4,140.000000000000000000000000000000,950004,1900001,'2024-08-20 11:15:00.000','2024-08-20 11:15:00.000'),(12504,5,225.000000000000000000000000000000,950002,1900002,'2024-08-20 11:20:00.000','2024-08-20 11:20:00.000'),(12505,3,456.000000000000000000000000000000,950002,1900003,'2024-08-20 11:20:00.000','2024-08-20 11:20:00.000');
/*!40000 ALTER TABLE `detail_commande_articles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `favoris`
--

DROP TABLE IF EXISTS `favoris`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `favoris` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `compte_id` int(11) NOT NULL,
  `post_id` int(11) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  KEY `favoris_post_id_fkey` (`post_id`),
  KEY `favoris_compte_id_fkey` (`compte_id`),
  CONSTRAINT `favoris_compte_id_fkey` FOREIGN KEY (`compte_id`) REFERENCES `comptes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `favoris_post_id_fkey` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1600004 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `favoris`
--

LOCK TABLES `favoris` WRITE;
/*!40000 ALTER TABLE `favoris` DISABLE KEYS */;
INSERT INTO `favoris` VALUES (1600001,200001,1200002,'2024-08-19 12:41:44.280','2024-08-19 12:41:44.280'),(1600002,200002,1200003,'2024-08-19 12:41:44.280','2024-08-19 12:41:44.280'),(1600003,200003,1200001,'2024-08-19 12:41:44.280','2024-08-19 12:41:44.280');
/*!40000 ALTER TABLE `favoris` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `follows`
--

DROP TABLE IF EXISTS `follows`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `follows` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `status` enum('FOLLOWED','UNFOLLOWED') NOT NULL,
  `follower_id` int(11) NOT NULL,
  `followed_id` int(11) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `follows_follower_id_followed_id_key` (`follower_id`,`followed_id`),
  KEY `follows_followed_id_fkey` (`followed_id`),
  CONSTRAINT `follows_followed_id_fkey` FOREIGN KEY (`followed_id`) REFERENCES `comptes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `follows_follower_id_fkey` FOREIGN KEY (`follower_id`) REFERENCES `comptes` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=900004 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `follows`
--

LOCK TABLES `follows` WRITE;
/*!40000 ALTER TABLE `follows` DISABLE KEYS */;
INSERT INTO `follows` VALUES (900001,'FOLLOWED',200001,200002,'2024-08-19 12:41:44.153','2024-08-19 12:41:44.153'),(900002,'FOLLOWED',200002,200003,'2024-08-19 12:41:44.153','2024-08-19 12:41:44.153'),(900003,'FOLLOWED',200003,200001,'2024-08-19 12:41:44.153','2024-08-19 12:41:44.153');
/*!40000 ALTER TABLE `follows` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `likes`
--

DROP TABLE IF EXISTS `likes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `likes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `etat` enum('LIKE','DISLIKE') NOT NULL,
  `compte_id` int(11) NOT NULL,
  `post_id` int(11) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  KEY `likes_post_id_fkey` (`post_id`),
  KEY `likes_compte_id_fkey` (`compte_id`),
  CONSTRAINT `likes_compte_id_fkey` FOREIGN KEY (`compte_id`) REFERENCES `comptes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `likes_post_id_fkey` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1700004 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `likes`
--

LOCK TABLES `likes` WRITE;
/*!40000 ALTER TABLE `likes` DISABLE KEYS */;
INSERT INTO `likes` VALUES (1700001,'LIKE',200001,1200001,'2024-08-19 12:41:44.297','2024-08-19 12:41:44.297'),(1700002,'LIKE',200002,1200002,'2024-08-19 12:41:44.297','2024-08-19 12:41:44.297'),(1700003,'LIKE',200003,1200003,'2024-08-19 12:41:44.297','2024-08-19 12:41:44.297');
/*!40000 ALTER TABLE `likes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `messages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `texte` varchar(191) NOT NULL,
  `messager_id` int(11) NOT NULL,
  `messaged_id` int(11) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  KEY `messages_messager_id_fkey` (`messager_id`),
  KEY `messages_messaged_id_fkey` (`messaged_id`),
  CONSTRAINT `messages_messaged_id_fkey` FOREIGN KEY (`messaged_id`) REFERENCES `comptes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `messages_messager_id_fkey` FOREIGN KEY (`messager_id`) REFERENCES `comptes` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1000006 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messages`
--

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
INSERT INTO `messages` VALUES (1000001,'Merci pour la commande !',200001,200002,'2024-08-19 12:41:44.173','2024-08-19 12:41:44.173'),(1000002,'Quand est-ce que ma commande sera prête ?',200003,200001,'2024-08-19 12:41:44.173','2024-08-19 12:41:44.173'),(1000003,'Je suis disponible pour un rendez-vous',200002,200003,'2024-08-19 12:41:44.173','2024-08-19 12:41:44.173'),(1000004,'Bonjour, comment ça va ?',200002,200003,'2024-08-19 12:42:20.884','2024-08-19 12:42:20.884'),(1000005,'tout va bien ?',200002,200003,'2024-08-19 12:44:09.620','2024-08-19 12:44:09.620');
/*!40000 ALTER TABLE `messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mesures`
--

DROP TABLE IF EXISTS `mesures`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `mesures` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `compte_id` int(11) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `mesures_compte_id_key` (`compte_id`),
  CONSTRAINT `mesures_compte_id_fkey` FOREIGN KEY (`compte_id`) REFERENCES `comptes` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=500004 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mesures`
--

LOCK TABLES `mesures` WRITE;
/*!40000 ALTER TABLE `mesures` DISABLE KEYS */;
INSERT INTO `mesures` VALUES (500001,200001,'2024-08-19 12:41:44.100','2024-08-19 12:41:44.100'),(500002,200002,'2024-08-19 12:41:44.100','2024-08-19 12:41:44.100'),(500003,200003,'2024-08-19 12:41:44.100','2024-08-19 12:41:44.100');
/*!40000 ALTER TABLE `mesures` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notes`
--

DROP TABLE IF EXISTS `notes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `notes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `note` varchar(191) NOT NULL,
  `noter_id` int(11) NOT NULL,
  `noted_id` int(11) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `notes_noter_id_noted_id_key` (`noter_id`,`noted_id`),
  KEY `notes_noted_id_fkey` (`noted_id`),
  CONSTRAINT `notes_noted_id_fkey` FOREIGN KEY (`noted_id`) REFERENCES `comptes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `notes_noter_id_fkey` FOREIGN KEY (`noter_id`) REFERENCES `comptes` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=700004 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notes`
--

LOCK TABLES `notes` WRITE;
/*!40000 ALTER TABLE `notes` DISABLE KEYS */;
INSERT INTO `notes` VALUES (700001,'Très satisfait',200003,200001,'2024-08-19 12:41:44.127','2024-08-19 12:41:44.127'),(700002,'Travail excellent',200002,200003,'2024-08-19 12:41:44.127','2024-08-19 12:41:44.127'),(700003,'À recommander',200001,200002,'2024-08-19 12:41:44.127','2024-08-19 12:41:44.127');
/*!40000 ALTER TABLE `notes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `notifications` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `content` varchar(191) NOT NULL,
  `compte_id` int(11) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  KEY `notifications_compte_id_fkey` (`compte_id`),
  CONSTRAINT `notifications_compte_id_fkey` FOREIGN KEY (`compte_id`) REFERENCES `comptes` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1800004 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES (1800001,'Nouvelle collection disponible !',200001,'2024-08-19 12:41:44.312','2024-08-19 12:41:44.312'),(1800002,'Votre commande est prête.',200002,'2024-08-19 12:41:44.312','2024-08-19 12:41:44.312'),(1800003,'Suivi de commande disponible.',200003,'2024-08-19 12:41:44.312','2024-08-19 12:41:44.312');
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `paiements_articles`
--

DROP TABLE IF EXISTS `paiements_articles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `paiements_articles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `montant` decimal(65,30) NOT NULL,
  `commande_id` int(11) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `tailleur_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `paiements_articles_commande_id_fkey` (`commande_id`),
  CONSTRAINT `paiements_articles_commande_id_fkey` FOREIGN KEY (`commande_id`) REFERENCES `commande_articles` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1232 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `paiements_articles`
--

LOCK TABLES `paiements_articles` WRITE;
/*!40000 ALTER TABLE `paiements_articles` DISABLE KEYS */;
INSERT INTO `paiements_articles` VALUES (1231,30000.000000000000000000000000000000,1900002,'2024-08-22 15:40:10.090','2024-08-22 15:40:10.090',300001);
/*!40000 ALTER TABLE `paiements_articles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `posts`
--

DROP TABLE IF EXISTS `posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `posts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `content` varchar(191) NOT NULL,
  `title` varchar(191) NOT NULL,
  `files` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`files`)),
  `count` int(11) NOT NULL,
  `shareNb` int(11) NOT NULL,
  `viewNb` int(11) NOT NULL,
  `tailleur_id` int(11) NOT NULL,
  `status` enum('PUBLIE','PAS_PUBLIE','ARCHIVE') NOT NULL,
  `categorie` enum('IMAGE','VIDEO') NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  KEY `posts_tailleur_id_fkey` (`tailleur_id`),
  CONSTRAINT `posts_tailleur_id_fkey` FOREIGN KEY (`tailleur_id`) REFERENCES `tailleurs` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1200004 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `posts`
--

LOCK TABLES `posts` WRITE;
/*!40000 ALTER TABLE `posts` DISABLE KEYS */;
INSERT INTO `posts` VALUES (1200001,'Découvrez notre nouvelle collection','Nouvelle Collection','{\"images\": [\"collection1.jpg\"]}',5,10,100,300001,'PUBLIE','IMAGE','2024-08-19 12:41:44.210','2024-08-19 12:41:44.210'),(1200002,'Promo spéciale sur les boubous','Promo Korité','{\"videos\": [\"korite_promo.mp4\"]}',3,15,120,300002,'PUBLIE','VIDEO','2024-08-19 12:41:44.210','2024-08-19 12:41:44.210'),(1200003,'Tenue traditionnelle sénégalaise','Boubou Traditionnel','{\"images\": [\"boubou1.jpg\"]}',7,20,80,300003,'PUBLIE','IMAGE','2024-08-19 12:41:44.210','2024-08-19 12:41:44.210');
/*!40000 ALTER TABLE `posts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reports`
--

DROP TABLE IF EXISTS `reports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `reports` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `motif` varchar(191) NOT NULL,
  `reporter_id` int(11) NOT NULL,
  `reported_id` int(11) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `reports_reporter_id_reported_id_key` (`reporter_id`,`reported_id`),
  KEY `reports_reported_id_fkey` (`reported_id`),
  CONSTRAINT `reports_reported_id_fkey` FOREIGN KEY (`reported_id`) REFERENCES `comptes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `reports_reporter_id_fkey` FOREIGN KEY (`reporter_id`) REFERENCES `comptes` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=600004 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reports`
--

LOCK TABLES `reports` WRITE;
/*!40000 ALTER TABLE `reports` DISABLE KEYS */;
INSERT INTO `reports` VALUES (600001,'Non-respect du délai de livraison',200003,200001,'2024-08-19 12:41:44.113','2024-08-19 12:41:44.113'),(600002,'Produit non conforme',200002,200001,'2024-08-19 12:41:44.113','2024-08-19 12:41:44.113'),(600003,'Communication difficile',200001,200003,'2024-08-19 12:41:44.113','2024-08-19 12:41:44.113');
/*!40000 ALTER TABLE `reports` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stocks`
--

DROP TABLE IF EXISTS `stocks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `stocks` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `prix` decimal(65,30) NOT NULL,
  `qte` int(11) NOT NULL,
  `article_id` int(11) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  KEY `stocks_article_id_fkey` (`article_id`),
  CONSTRAINT `stocks_article_id_fkey` FOREIGN KEY (`article_id`) REFERENCES `articles` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stocks`
--

LOCK TABLES `stocks` WRITE;
/*!40000 ALTER TABLE `stocks` DISABLE KEYS */;
/*!40000 ALTER TABLE `stocks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tags`
--

DROP TABLE IF EXISTS `tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tags` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `libelle` varchar(191) NOT NULL,
  `post_id` int(11) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  KEY `tags_post_id_fkey` (`post_id`),
  CONSTRAINT `tags_post_id_fkey` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1300004 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tags`
--

LOCK TABLES `tags` WRITE;
/*!40000 ALTER TABLE `tags` DISABLE KEYS */;
INSERT INTO `tags` VALUES (1300001,'Boubou',1200001,'2024-08-19 12:41:44.229','2024-08-19 12:41:44.229'),(1300002,'Korité',1200002,'2024-08-19 12:41:44.229','2024-08-19 12:41:44.229'),(1300003,'Tradition',1200003,'2024-08-19 12:41:44.229','2024-08-19 12:41:44.229');
/*!40000 ALTER TABLE `tags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tailleurs`
--

DROP TABLE IF EXISTS `tailleurs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tailleurs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `compte_id` int(11) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `tailleurs_compte_id_key` (`compte_id`),
  CONSTRAINT `tailleurs_compte_id_fkey` FOREIGN KEY (`compte_id`) REFERENCES `comptes` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=300004 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tailleurs`
--

LOCK TABLES `tailleurs` WRITE;
/*!40000 ALTER TABLE `tailleurs` DISABLE KEYS */;
INSERT INTO `tailleurs` VALUES (300001,200002,'2024-08-19 12:41:44.070','2024-08-19 12:41:44.070'),(300002,200001,'2024-08-19 12:41:44.070','2024-08-19 12:41:44.070'),(300003,200003,'2024-08-19 12:41:44.070','2024-08-19 12:41:44.070');
/*!40000 ALTER TABLE `tailleurs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `unites`
--

DROP TABLE IF EXISTS `unites`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `unites` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `libelle` varchar(191) NOT NULL,
  `categorie_id` int(11) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  KEY `unites_categorie_id_fkey` (`categorie_id`),
  CONSTRAINT `unites_categorie_id_fkey` FOREIGN KEY (`categorie_id`) REFERENCES `categories` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=106 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `unites`
--

LOCK TABLES `unites` WRITE;
/*!40000 ALTER TABLE `unites` DISABLE KEYS */;
INSERT INTO `unites` VALUES (101,'Mètre',222222,'2024-08-21 16:17:43.221','2024-08-21 16:17:43.221'),(102,'Yard',111111,'2024-08-21 16:17:43.221','2024-08-21 16:17:43.221'),(103,'Pièce',222222,'2024-08-21 16:17:43.221','2024-08-21 16:17:43.221'),(104,'Rouleau',111111,'2024-08-21 16:17:43.221','2024-08-21 16:17:43.221'),(105,'Set',333333,'2024-08-21 16:17:43.221','2024-08-21 16:17:43.221');
/*!40000 ALTER TABLE `unites` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `lastname` varchar(191) NOT NULL,
  `firstname` varchar(191) NOT NULL,
  `phone` varchar(191) NOT NULL,
  `city` varchar(191) NOT NULL,
  `picture` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_phone_key` (`phone`)
) ENGINE=InnoDB AUTO_INCREMENT=100008 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (100001,'Sow','Aissatou','773332211','Dakar','aissatou_sow.jpg','2024-08-19 12:41:44.040','2024-08-19 12:41:44.040'),(100002,'Ndiaye','Oumar','778887766','Thiès','oumar_ndiaye.jpg','2024-08-19 12:41:44.040','2024-08-19 12:41:44.040'),(100003,'Bâ','Fatou','775554433','Saint-Louis','fatou_ba.jpg','2024-08-19 12:41:44.040','2024-08-19 12:41:44.040'),(100004,'Sow','Aissatou','770643383','Dakar1','http://example.com/picture.jpg','2024-08-21 12:13:11.194','2024-08-21 12:13:11.194'),(100005,'diop','mamadou','773356788','Dakar','mamadou_diop.jpg','2024-08-21 12:47:33.685','2024-08-21 12:47:33.685'),(100006,'Ndiaye','aminata','778823566','Thiès','aminata_Ndiaye.jpg','2024-08-21 12:47:33.685','2024-08-21 12:47:33.685'),(100007,'sarr','ibrahima','775523433','Saint-Louis','ibrahima_sarr.jpg','2024-08-21 12:47:33.685','2024-08-21 12:47:33.685');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vendeurs`
--

DROP TABLE IF EXISTS `vendeurs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `vendeurs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `compte_id` int(11) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `vendeurs_compte_id_key` (`compte_id`),
  CONSTRAINT `vendeurs_compte_id_fkey` FOREIGN KEY (`compte_id`) REFERENCES `comptes` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=770004 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vendeurs`
--

LOCK TABLES `vendeurs` WRITE;
/*!40000 ALTER TABLE `vendeurs` DISABLE KEYS */;
INSERT INTO `vendeurs` VALUES (770001,200005,'2024-08-21 12:50:08.639','2024-08-21 12:50:08.639'),(770002,200006,'2024-08-21 12:50:08.639','2024-08-21 12:50:08.639'),(770003,200007,'2024-08-21 12:50:08.639','2024-08-21 12:50:08.639');
/*!40000 ALTER TABLE `vendeurs` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-08-22 17:13:03
