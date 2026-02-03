-- MySQL dump 10.13  Distrib 9.4.0, for macos15.4 (arm64)
--
-- Host: localhost    Database: gameHubDB
-- ------------------------------------------------------
-- Server version	9.4.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `awards`
--

DROP TABLE IF EXISTS `awards`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `awards` (
  `id` int NOT NULL AUTO_INCREMENT,
  `description` varchar(100) NOT NULL,
  `value` tinyint NOT NULL,
  `medal` tinyint NOT NULL,
  `trophy` tinyint NOT NULL,
  `others` varchar(100) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `admin_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_award` (`admin_id`),
  CONSTRAINT `fk_award` FOREIGN KEY (`admin_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `awards`
--

LOCK TABLES `awards` WRITE;
/*!40000 ALTER TABLE `awards` DISABLE KEYS */;
INSERT INTO `awards` VALUES (6,'1000 reais',1,0,0,'sla','2025-10-02 08:37:54.601619','2025-10-02 08:37:54.601619',18),(7,'2000 reais',1,0,0,'num sei','2025-10-02 08:57:46.327326','2025-10-02 08:58:12.441869',18),(8,'Premio de teste criado pelo react',1,0,0,'100 reais','2025-10-28 16:09:53.892957','2025-10-28 16:09:53.892957',18);
/*!40000 ALTER TABLE `awards` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `awards_championship`
--

DROP TABLE IF EXISTS `awards_championship`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `awards_championship` (
  `id` int NOT NULL AUTO_INCREMENT,
  `award_id` int DEFAULT NULL,
  `championship_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_d575f7792a4d65cc337c9e4208d` (`award_id`),
  KEY `FK_f03b7e3e8da06f6973d23b25a58` (`championship_id`),
  CONSTRAINT `FK_d575f7792a4d65cc337c9e4208d` FOREIGN KEY (`award_id`) REFERENCES `awards` (`id`),
  CONSTRAINT `FK_f03b7e3e8da06f6973d23b25a58` FOREIGN KEY (`championship_id`) REFERENCES `championship` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=68 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `awards_championship`
--

LOCK TABLES `awards_championship` WRITE;
/*!40000 ALTER TABLE `awards_championship` DISABLE KEYS */;
INSERT INTO `awards_championship` VALUES (37,6,21),(43,6,NULL),(44,7,NULL),(53,7,16),(59,7,22),(61,6,22),(62,6,17),(65,6,23),(66,8,17),(67,7,17);
/*!40000 ALTER TABLE `awards_championship` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `championship`
--

DROP TABLE IF EXISTS `championship`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `championship` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `admin_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_76f91953588d3bf5b9f83ae5736` (`admin_id`),
  CONSTRAINT `FK_76f91953588d3bf5b9f83ae5736` FOREIGN KEY (`admin_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `championship`
--

LOCK TABLES `championship` WRITE;
/*!40000 ALTER TABLE `championship` DISABLE KEYS */;
INSERT INTO `championship` VALUES (16,'Juliam championship','2025-01-01','2025-01-02','2025-09-15 15:42:11.211834','2025-10-20 14:31:53.000000',18),(17,'Campeonatinho do ju2','2029-09-01','2029-09-02','2025-10-01 15:49:06.389413','2025-10-30 13:28:24.000000',18),(18,'Nome','2025-10-01','2025-10-11','2025-10-01 18:51:30.609540','2025-10-01 18:51:30.609540',18),(19,'Julianchip','2025-10-18','2025-10-25','2025-10-01 18:53:00.451082','2025-10-01 18:53:00.451082',18),(20,'teste','2025-10-01','2025-10-01','2025-10-01 18:53:47.011767','2025-10-01 18:53:47.011767',18),(21,'pfvr da certo','2025-10-02','2025-10-10','2025-10-02 08:38:44.813229','2025-10-02 08:38:44.813229',18),(22,'Teste com awards2','2025-10-02','2025-10-31','2025-10-02 13:17:44.423053','2025-10-20 15:57:40.000000',18),(23,'teste do juju','2029-02-16','2029-02-17','2025-10-30 10:40:22.291793','2025-10-30 10:40:22.291793',18);
/*!40000 ALTER TABLE `championship` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gamers`
--

DROP TABLE IF EXISTS `gamers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gamers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `team` int DEFAULT NULL,
  `shirtNumber` int NOT NULL,
  `score` int DEFAULT '0',
  `user_id` int NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  KEY `FK_d2760c804b63fc197ff864c9e9f` (`team`),
  KEY `FK_2fda9eafac598498eb03a49548f` (`user_id`),
  CONSTRAINT `FK_2fda9eafac598498eb03a49548f` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FK_d2760c804b63fc197ff864c9e9f` FOREIGN KEY (`team`) REFERENCES `teams` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gamers`
--

LOCK TABLES `gamers` WRITE;
/*!40000 ALTER TABLE `gamers` DISABLE KEYS */;
INSERT INTO `gamers` VALUES (3,NULL,17,50000,17,'2025-09-16 09:11:04.194711','2025-10-30 15:19:50.559586'),(4,NULL,18,800,18,'2025-09-17 13:09:51.252521','2025-10-30 15:19:50.563177'),(5,5,19,50075,19,'2025-09-17 13:10:37.404123','2025-10-30 11:09:49.000000'),(6,NULL,20,799,20,'2025-09-17 15:23:59.493344','2025-10-30 15:19:50.565184'),(7,NULL,19,50000,21,'2025-10-09 16:24:45.189943','2025-10-30 15:19:50.566189'),(8,19,5,50000,22,'2025-10-10 10:49:02.003744','2025-10-10 10:50:08.000000'),(9,20,9,50000,23,'2025-10-10 10:52:33.486068','2025-10-10 10:53:46.000000'),(10,NULL,17,50020,24,'2025-10-20 14:33:50.359632','2025-10-30 15:19:50.567416'),(11,NULL,17,0,25,'2025-10-27 10:47:37.183192','2025-10-30 15:19:50.568571'),(12,22,15,50000,26,'2025-10-30 09:57:57.001530','2025-10-30 10:03:48.000000'),(13,NULL,15,300,27,'2025-10-30 10:44:52.218850','2025-10-30 15:19:50.569666'),(14,NULL,15,0,31,'2025-10-30 11:16:14.346681','2025-10-30 11:16:14.346681'),(15,NULL,15,0,32,'2025-10-30 11:16:52.006141','2025-10-30 11:16:52.006141'),(16,23,15,50000,33,'2025-10-30 15:25:24.868729','2025-10-30 15:31:14.000000');
/*!40000 ALTER TABLE `gamers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `logs`
--

DROP TABLE IF EXISTS `logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `action` varchar(100) NOT NULL,
  `description` text,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  KEY `FK_70c2c3d40d9f661ac502de51349` (`user_id`),
  CONSTRAINT `FK_70c2c3d40d9f661ac502de51349` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `logs`
--

LOCK TABLES `logs` WRITE;
/*!40000 ALTER TABLE `logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `matches`
--

DROP TABLE IF EXISTS `matches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `matches` (
  `id` int NOT NULL AUTO_INCREMENT,
  `team1` int DEFAULT NULL,
  `team2` int DEFAULT NULL,
  `winner` int DEFAULT NULL,
  `championship` int DEFAULT NULL,
  `status` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `scoreTeam1` int DEFAULT NULL,
  `scoreTeam2` int DEFAULT NULL,
  `matchDate` datetime DEFAULT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  KEY `FK_75e4010c66d5c7755b8108f82e3` (`team1`),
  KEY `FK_7f184209af2ff0645f5bf9f2303` (`team2`),
  KEY `FK_46e1e87306e725e0a115d9e326a` (`winner`),
  KEY `FK_3647c2fbff6f054cce68d5ca13c` (`championship`),
  CONSTRAINT `FK_3647c2fbff6f054cce68d5ca13c` FOREIGN KEY (`championship`) REFERENCES `championship` (`id`),
  CONSTRAINT `FK_46e1e87306e725e0a115d9e326a` FOREIGN KEY (`winner`) REFERENCES `teams` (`id`),
  CONSTRAINT `FK_75e4010c66d5c7755b8108f82e3` FOREIGN KEY (`team1`) REFERENCES `teams` (`id`),
  CONSTRAINT `FK_7f184209af2ff0645f5bf9f2303` FOREIGN KEY (`team2`) REFERENCES `teams` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `matches`
--

LOCK TABLES `matches` WRITE;
/*!40000 ALTER TABLE `matches` DISABLE KEYS */;
INSERT INTO `matches` VALUES (7,5,6,6,16,'finished',NULL,'2025-09-29 16:46:20.323085','2025-09-30 10:11:38.396446'),(11,9,10,NULL,16,'finished','2 - 1','2025-09-30 11:30:55.005984','2025-10-20 10:11:44.000000'),(12,11,13,NULL,17,'playing','0 - 1','2025-09-30 11:31:01.682917','2025-10-30 09:52:02.000000'),(13,NULL,14,14,16,'pending','3 - 2','2025-09-30 11:31:10.136187','2025-10-30 15:20:31.336089'),(14,15,16,NULL,17,'finished','2 - 0','2025-09-30 11:31:25.128671','2025-10-20 10:12:23.000000'),(15,5,12,NULL,16,'finished',NULL,'2025-09-30 11:31:38.805842','2025-10-20 15:58:38.000000'),(16,5,16,NULL,17,'pending',NULL,'2025-09-30 11:32:05.247926','2025-10-01 15:58:25.959715'),(17,15,16,NULL,16,'pending',NULL,'2025-09-30 11:32:09.484115','2025-09-30 11:32:09.484115'),(18,5,6,NULL,22,'pending',NULL,'2025-10-03 10:49:28.430877','2025-10-03 10:49:28.430877'),(19,10,5,NULL,22,'pending',NULL,'2025-10-03 17:23:15.048779','2025-10-03 17:23:15.048779'),(20,10,5,NULL,22,'pending',NULL,'2025-10-03 17:24:29.193233','2025-10-03 17:24:29.193233'),(21,10,5,NULL,22,'finished',NULL,'2025-10-03 17:25:52.900361','2025-10-03 17:25:52.900361'),(22,NULL,6,6,22,'pending','3 - 3','2025-10-06 11:12:02.764321','2025-10-30 15:20:45.264473'),(23,10,NULL,NULL,17,'pending','0 - 2','2025-10-06 17:25:24.222219','2025-10-30 15:20:31.338345'),(24,5,10,NULL,21,'pending',NULL,'2025-10-07 16:52:02.727581','2025-10-07 16:52:02.727581'),(25,6,5,NULL,22,'finished',NULL,'2025-10-07 17:26:48.680402','2025-10-07 17:26:48.680402');
/*!40000 ALTER TABLE `matches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `metrics`
--

DROP TABLE IF EXISTS `metrics`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `metrics` (
  `id` int NOT NULL AUTO_INCREMENT,
  `quantity` int NOT NULL,
  `type` varchar(50) NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `description` text,
  `match_id` int NOT NULL,
  `gamer_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_match` (`match_id`),
  KEY `fk_gamer` (`gamer_id`),
  CONSTRAINT `fk_gamer` FOREIGN KEY (`gamer_id`) REFERENCES `gamers` (`id`),
  CONSTRAINT `fk_match` FOREIGN KEY (`match_id`) REFERENCES `matches` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `metrics`
--

LOCK TABLES `metrics` WRITE;
/*!40000 ALTER TABLE `metrics` DISABLE KEYS */;
INSERT INTO `metrics` VALUES (1,1,'gol','2025-10-28 17:13:07.934742','Fez um golaço',7,5),(2,1,'gol','2025-10-28 17:52:07.527789','Teste direto pelo front agora',13,3),(3,1,'gol','2025-10-28 17:55:16.399485','teste',13,4),(4,1,'gol','2025-10-28 17:55:35.152463','teste',13,6),(5,1,'gol','2025-10-28 17:55:56.888222','teste222',13,11),(6,1,'gol','2025-10-28 17:56:45.045982','testetadsdas',13,11),(7,1,'gol','2025-10-28 17:57:51.900825','dkaodkaso',13,4),(8,1,'gol','2025-10-28 17:58:36.670873','teste',13,6),(9,1,'gol','2025-10-28 17:58:57.637647','dasdas',13,4),(10,1,'gol','2025-10-28 18:00:23.336069','ultimo teste',13,6),(11,1,'gol','2025-10-28 18:02:38.357173','juju',13,6),(12,1,'falta','2025-10-28 18:03:01.771069','faltou odio',13,3),(13,2,'falta','2025-10-29 14:56:44.898614','teste',22,3),(14,4,'cartao amarelo','2025-10-29 14:56:52.599396','teste',22,6),(15,4,'defesa','2025-10-29 14:57:47.941695','teste',23,4),(16,3,'assistencia','2025-10-29 14:58:16.888644','etste',23,4),(17,7,'chute ao gol','2025-10-29 14:58:25.282552','teste',23,3),(18,1,'cartao vermelho','2025-10-29 14:58:42.404639','teste',22,3),(19,1,'gol','2025-10-30 11:07:46.720693','teste',19,5),(20,2,'gol','2025-10-30 11:08:27.261492','testee',19,5),(21,2,'gol','2025-10-30 11:09:00.274396','testeee',19,5),(22,1,'defesa','2025-10-30 11:09:49.177853','tresdte',19,5);
/*!40000 ALTER TABLE `metrics` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `type` varchar(50) NOT NULL,
  `gamer_id` int DEFAULT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `read` tinyint NOT NULL DEFAULT '1',
  `description` text,
  `team_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_notifications_user` (`user_id`),
  KEY `fk_notifications_gamer` (`gamer_id`),
  KEY `fk_team` (`team_id`),
  CONSTRAINT `fk_notifications_gamer` FOREIGN KEY (`gamer_id`) REFERENCES `gamers` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_notifications_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_team` FOREIGN KEY (`team_id`) REFERENCES `teams` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES (1,18,'team_accept',9,'2025-10-22 16:50:07.263000',1,'Jogador quer entrar no seu time',NULL),(2,23,'accept',4,'2025-10-24 17:14:38.891000',1,'Sua solicitação foi aceita!',NULL),(3,23,'decline',4,'2025-10-27 08:44:49.511000',1,'Sua solicitação foi recusada!',NULL),(4,23,'accept',4,'2025-10-27 10:30:59.001000',1,'Sua solicitação foi aceita!',NULL),(5,18,'team_accept',11,'2025-10-27 10:56:33.590000',1,'',NULL),(6,25,'accept',4,'2025-10-27 10:57:40.167000',1,'Sua solicitação foi aceita!',NULL),(7,18,'team_accept',11,'2025-10-27 13:25:50.895000',1,'',NULL),(9,18,'team_accept',11,'2025-10-27 13:42:50.238000',1,'',NULL),(10,18,'team_accept',11,'2025-10-27 13:43:50.325000',1,'',NULL),(17,25,'accept',4,'2025-10-27 13:54:05.420759',1,'Sua solicitação foi aceita!',NULL),(18,18,'team_accept',11,'2025-10-27 13:55:23.282764',1,'',NULL),(19,25,'accept',4,'2025-10-27 13:55:38.336541',1,'Sua solicitação foi aceita!',NULL),(20,18,'team_accept',11,'2025-10-27 14:02:15.350613',1,'',NULL),(21,25,'accept',4,'2025-10-27 14:04:01.383132',1,'Sua solicitação foi aceita!',NULL),(22,18,'team_accept',13,'2025-10-30 10:45:41.162522',1,'',NULL),(23,27,'decline',4,'2025-10-30 10:45:58.094596',1,'Sua solicitação foi recusada!',NULL),(24,18,'team_accept',13,'2025-10-30 10:46:20.884216',1,'',NULL),(25,27,'accept',4,'2025-10-30 10:46:31.025654',1,'Sua solicitação foi aceita!',NULL);
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `teams`
--

DROP TABLE IF EXISTS `teams`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `teams` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `gamer_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `gamer_id` (`gamer_id`),
  CONSTRAINT `gamer_id` FOREIGN KEY (`gamer_id`) REFERENCES `gamers` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `teams`
--

LOCK TABLES `teams` WRITE;
/*!40000 ALTER TABLE `teams` DISABLE KEYS */;
INSERT INTO `teams` VALUES (5,'time do ju24','','2025-09-16 14:17:20.940352','2025-10-30 15:12:11.776140',3),(6,'time do ju2444','','2025-09-16 16:20:58.111679','2025-10-30 15:12:37.319382',4),(8,'novo time do Julian','','2025-09-30 11:09:34.015229','2025-10-30 15:13:26.566250',4),(9,'Time vencedor','','2025-09-30 11:09:46.320167','2025-10-30 15:13:26.569832',4),(10,'Corintia','','2025-09-30 11:09:51.358472','2025-10-30 15:13:26.571701',4),(11,'Flamengooo','','2025-09-30 11:09:55.326719','2025-10-30 15:13:26.573007',4),(12,'ainn sao paulo','','2025-09-30 11:10:02.435225','2025-10-30 15:13:26.574325',4),(13,'Falta muito time ainda','','2025-09-30 11:10:15.035555','2025-10-30 15:13:26.575202',4),(14,'time do iago','','2025-09-30 11:10:23.236671','2025-10-30 15:13:26.576034',4),(15,'Pior time','','2025-09-30 11:10:27.381552','2025-10-30 15:13:26.576780',4),(16,'Pior timede tidis','','2025-09-30 11:16:44.021973','2025-10-30 15:13:26.577584',4),(17,'Teste pfvr funciona eu imploro','','2025-10-09 15:14:21.610719','2025-10-30 15:13:26.578321',5),(19,'teste julian vai vincular','','2025-10-10 10:50:08.447445','2025-10-30 15:13:37.430088',8),(20,'Time do gamehub2','','2025-10-10 10:53:46.760235','2025-10-30 15:13:37.433454',9),(22,'Time de teste pro novo input ','','2025-10-30 10:03:48.553412','2025-10-30 15:13:37.434509',12),(23,'teste do s3','uploads/2025/10/5d2925df-867f-45a5-a7ed-292332a4628c.jpeg','2025-10-30 15:31:14.287335','2025-10-30 15:31:14.287335',16);
/*!40000 ALTER TABLE `teams` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `profile` varchar(50) NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `password` varchar(255) NOT NULL,
  `is_active` tinyint NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_97672ac88f789774dd47f7c8be` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (17,'Julian','julian.teste@teste.com','gamer','2025-09-10 13:50:18.419504','2025-10-09 14:54:14.372633','$argon2id$v=19$m=19456,t=2,p=1$9aiEDFS7UAz/eJHgEo2kVQ$UC0F4Isp+Z+xpIvDVgVAa5hhq3Luf1MP28izKnviV0c',1),(18,'Julian 2','jujuba@gmail.com','admin','2025-09-12 13:59:12.221336','2025-09-17 14:57:42.224325','$argon2id$v=19$m=19456,t=2,p=1$gi80dOZH1JJV/ZGvThZaNA$9bg4d7+maZFS2+WaZKIBRE9M7GXiI3Orj4gnMOe2I8c',1),(19,'Julian Editado3','jujuba2@editado.com','gamer','2025-09-12 13:59:30.494175','2025-10-16 17:10:09.821345','123456',1),(20,'Julian 4','jujuba23@gmail.com','gamer','2025-09-12 13:59:37.226658','2025-09-17 14:57:42.229076','$argon2id$v=19$m=19456,t=2,p=1$To/GliwEKg8VbMjVDF+omQ$V5MmeKoLscK4+/vkwIhremhgBdZU7hODr0neVWB1pLg',0),(21,'Julian coach','julian@gmail.com','gamer','2025-10-09 15:16:54.978888','2025-10-09 15:16:54.978888','$argon2id$v=19$m=19456,t=2,p=1$J2W+7+YTw4z9w9KeFaVqXQ$X8j8sg1rSu4jVmWGdSBHJUz+gU6/H6qd8TfKkoGVy8Y',1),(22,'JUlian vai criar time','jujuba5@gmail.com','gamer','2025-10-10 10:48:52.997648','2025-10-10 10:48:52.997648','$argon2id$v=19$m=19456,t=2,p=1$KHV2j8TMI6YNOPZm4RTXOA$c1Am61boB50ZMyexJo4w3lRFrt2JtYiC0WWojfdhcOc',1),(23,'Perfil oficial do Julian2','julianofc@gmail.com','gamer','2025-10-10 10:52:30.846448','2025-10-21 13:53:09.000000','$argon2id$v=19$m=19456,t=2,p=1$JyVQszfbJxdvjoLY9XJIgQ$OIVkyMfaBx/blPECUHwtppR9WZh/+xQJrgocXNetqRU',1),(24,'Julian novo','juliannovo@gmail.com','gamer','2025-10-20 14:33:41.099453','2025-10-20 14:33:41.099453','$argon2id$v=19$m=19456,t=2,p=1$jqWxZEnaKOD5byMtXvqMCg$lpl0bu5JUOcSuHeNNuh1edFrY1kTAGvHEAWEi8OsUUg',1),(25,'Julian novo gamer sem time','juliangamer@gmail.com','gamer','2025-10-27 10:47:27.200894','2025-10-27 10:47:27.200894','$argon2id$v=19$m=19456,t=2,p=1$5bWgzFCBRZttQ+lcPMOL5A$Yqjn7kD2XKlh/Y2qLgScZspPGpRJ2q514xM7/p58Y+E',1),(26,'teste','teste@gmail.com','gamer','2025-10-30 09:57:52.413682','2025-10-30 09:57:52.413682','$argon2id$v=19$m=19456,t=2,p=1$ZoUG72guwcVtkITddHl1rw$TEGZLlcayRGdvN0RcYPorxpHipNmqk810kA5sIYBr0M',1),(27,'mamae','mamae@gmail.com','gamer','2025-10-30 10:44:48.751353','2025-10-30 10:54:11.000000','$argon2id$v=19$m=19456,t=2,p=1$qtvPSk49EFtzwiXEH/mvfA$LoeBoG3Z9IsJ1RMSKlv+pKDxqvLgUqk667O0Zp3IQSA',1),(28,'teste23232','testePfvr@gmail.com','gamer','2025-10-30 11:10:24.808717','2025-10-30 11:10:24.808717','$argon2id$v=19$m=19456,t=2,p=1$X6HPSFFcOWMjfHHitGUoUA$Ez8j2iY6nntZkYYNV6vFOV8RiuhK2zhQs/KAPrPsG9Q',1),(29,'dsaasddsadsaasddsa','emailfuncional@gmail.com','gamer','2025-10-30 11:13:05.002833','2025-10-30 11:13:05.002833','$argon2id$v=19$m=19456,t=2,p=1$/CkKSzzSvMPCG6bi11a0JQ$oUiAZ9kgS4zvpJ1uis81azU8shzLugxoIrbNQ5Ks3BQ',1),(30,'Ihulllll','ihul@gmail.com','gamer','2025-10-30 11:14:39.843820','2025-10-30 11:14:39.843820','$argon2id$v=19$m=19456,t=2,p=1$ffMaAi8OzzMkIly61M/z2g$gszPTNF+ZSQOwI5UlFheh05NwEJeLxQ2rL1av6xAWeM',1),(31,'pfvr funciona','funciona@gmail.com','gamer','2025-10-30 11:16:07.847218','2025-10-30 11:16:07.847218','$argon2id$v=19$m=19456,t=2,p=1$sRB7nsGxwa8lDjO6iJF+OQ$rIWbM/cXg0ZRg7WAPDdpHZllorevIje0lM7OauS1QSE',1),(32,'agora vai','agrvai@gmail.com','gamer','2025-10-30 11:16:48.663407','2025-10-30 11:16:48.663407','$argon2id$v=19$m=19456,t=2,p=1$0x+SkJeKCsQlP1M5KlSfqg$zJyTL5W1jltziqr2o4XhaFV8X2EELP5udrsn6WiCVC0',1),(33,'Teste com bucket','s3@gmail.com','gamer','2025-10-30 15:25:18.614765','2025-10-30 15:25:18.614765','$argon2id$v=19$m=19456,t=2,p=1$8y8/dVLLbOyXvWSpxf71yg$6JOXoVpfS0OnM0rdsf5SdqDfCrnvkLlOYbfCCNcwiec',1);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'gameHubDB'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-30 15:40:03
