CREATE DATABASE  IF NOT EXISTS `skfruit` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `skfruit`;
-- MySQL dump 10.13  Distrib 8.0.38, for macos14 (x86_64)
--
-- Host: 103.174.102.89    Database: skfruit
-- ------------------------------------------------------
-- Server version	8.0.39-0ubuntu0.22.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `access_config`
--

DROP TABLE IF EXISTS `access_config`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `access_config` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `status` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_access_config_name` (`name`),
  KEY `idx_access_config_status` (`status`),
  KEY `idx_access_config_name_status` (`name`,`status`),
  KEY `idx_access_config_id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `access_config`
--

LOCK TABLES `access_config` WRITE;
/*!40000 ALTER TABLE `access_config` DISABLE KEYS */;
INSERT INTO `access_config` VALUES (26,'Home','inactive','2024-09-21 10:40:32','2024-09-21 10:40:32'),(27,'User','inactive','2024-09-21 10:40:32','2024-09-21 10:40:32'),(28,'Product','inactive','2024-09-21 10:40:32','2024-09-21 10:40:32'),(29,'Account','inactive','2024-09-21 10:40:32','2024-09-21 10:40:32'),(30,'Route','inactive','2024-09-21 10:40:32','2024-09-21 10:40:32'),(31,'Purchase','inactive','2024-09-21 10:40:32','2024-09-21 10:40:32'),(32,'Sale','inactive','2024-09-21 10:40:32','2024-09-21 10:40:32'),(34,'Barcode','inactive','2024-09-21 10:40:32','2024-09-21 10:40:32'),(35,'Receipt','active','2024-09-21 10:40:32','2024-09-21 10:40:32'),(36,'Payment','inactive','2024-09-21 10:40:32','2024-09-21 10:40:32'),(37,'Purchase Report','inactive','2024-09-21 10:40:32','2024-09-21 10:40:32'),(38,'Sale Report','inactive','2024-09-21 10:40:32','2024-09-21 10:40:32'),(39,'Stock Report','inactive','2024-09-21 10:40:32','2024-09-21 10:40:32'),(40,'Khatawani','active','2024-09-21 10:40:32','2024-09-21 10:40:32'),(41,'Daily Report','active','2024-09-21 10:40:32','2024-09-21 10:40:32'),(42,'Receipt Report','active','2024-09-21 10:40:32','2024-09-21 10:40:32'),(43,'Ledger Report','active','2024-09-21 10:40:32','2024-09-21 10:40:32'),(44,'Customer Outstanding','active','2024-09-21 10:40:32','2024-09-21 10:40:32'),(45,'Supplier Outstanding','inactive','2024-09-21 10:40:32','2024-09-21 10:40:32'),(46,'Carate Report','active','2024-09-21 10:40:32','2024-09-21 10:40:32'),(47,'Remainder','active','2024-09-21 10:40:32','2024-09-21 10:40:32'),(48,'Profit Loss Report','inactive','2024-09-21 10:40:32','2024-09-21 10:40:32'),(49,'Supplier Ledger Report','inactive','2024-09-21 10:40:32','2024-09-21 10:40:32'),(51,'Account Ledger Report','inactive','2024-11-16 15:19:50','2024-11-16 15:19:50');
/*!40000 ALTER TABLE `access_config` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `account_group_table`
--

DROP TABLE IF EXISTS `account_group_table`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `account_group_table` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_id` (`id`),
  KEY `idx_name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `account_group_table`
--

LOCK TABLES `account_group_table` WRITE;
/*!40000 ALTER TABLE `account_group_table` DISABLE KEYS */;
INSERT INTO `account_group_table` VALUES (32,'Worker',1,'2024-09-21 10:43:22','2024-09-21 10:43:22'),(33,'Customer',1,'2024-09-21 10:43:22','2024-09-21 10:43:22'),(34,'Supplier',1,'2024-09-21 10:43:22','2024-09-21 10:43:22'),(35,'Bank Account',1,'2024-09-21 10:43:22','2024-09-21 10:43:22');
/*!40000 ALTER TABLE `account_group_table` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `account_table`
--

DROP TABLE IF EXISTS `account_table`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `account_table` (
  `id` int NOT NULL AUTO_INCREMENT,
  `is_ative` tinyint(1) DEFAULT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `address` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `mobile_no` bigint DEFAULT NULL,
  `account_group` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `route_detail` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `prev_balance` bigint DEFAULT NULL,
  `cr_dr_type` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `current_balance` bigint DEFAULT NULL,
  `optional_mobile` bigint DEFAULT NULL,
  `company` varchar(250) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `last_update` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_route_detail` (`route_detail`),
  KEY `idx_name` (`name`),
  KEY `idx_route_detail_name` (`route_detail`,`name`),
  KEY `idx_account_table_name` (`name`),
  KEY `idx_account_group` (`account_group`),
  KEY `idx_current_balance` (`current_balance`),
  KEY `idx_account_filters` (`account_group`,`current_balance`,`route_detail`),
  KEY `idx_account_group_name` (`account_group`,`name`),
  KEY `idx_id` (`id`),
  KEY `idx_mobile_no` (`mobile_no`),
  KEY `idx_name_address_account_group` (`name`,`address`,`account_group`),
  KEY `idx_last_update` (`last_update`),
  KEY `idx_account_group_mobile_no` (`account_group`,`mobile_no`),
  KEY `idx_account_table_group_name_route` (`account_group`,`name`,`route_detail`)
) ENGINE=InnoDB AUTO_INCREMENT=71 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `account_table`
--

LOCK TABLES `account_table` WRITE;
/*!40000 ALTER TABLE `account_table` DISABLE KEYS */;
INSERT INTO `account_table` VALUES (39,1,'DHANRAJ KOKATE','KASHTI',8237300204,'Worker',NULL,0,NULL,'2024-09-21 17:02:07','2024-09-21 17:02:07',0,0,'',NULL),(40,1,'VAIBHAV SHIMNDE ','ADHALGAON',9922676380,'Worker','TEST',0,NULL,'2024-09-21 17:20:59','2024-09-21 17:20:59',0,8888437515,'',NULL),(44,1,'SK AXIS','AXIS',8237300204,'Bank Account',NULL,0,NULL,'2024-09-25 18:40:53','2024-09-25 18:40:53',0,8237300204,'',NULL),(45,1,'YK UNION','UNION ',9860601102,'Bank Account',NULL,0,NULL,'2024-09-25 18:41:30','2024-09-25 18:41:30',0,0,'',NULL),(56,1,'pratmesh jadhav ','pune',0,'Worker','all root',0,NULL,'2024-11-15 16:25:13','2024-11-15 16:25:13',0,0,'',NULL),(58,1,'Prathmesh jadhav','pune',9158733073,'Worker','All root',0,NULL,'2024-12-13 10:39:46','2024-12-13 10:39:46',0,0,'',NULL),(64,1,'santosh chugule','kashti',0,'Worker','MANDAVAGAN',0,NULL,'2024-12-20 16:56:18','2024-12-20 16:56:18',0,0,'',NULL),(69,1,'Sun','NSK',7040040015,'Customer','ठोक वाय्पारी',0,'yes','2024-12-25 10:42:33','2024-12-25 10:42:33',0,0,'PP',NULL),(70,1,'Raj','NSK1',7040040015,'Supplier','Vadgoan root',0,'yes','2024-12-25 10:43:38','2024-12-25 10:43:38',0,0,'DCA',NULL);
/*!40000 ALTER TABLE `account_table` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `admin_access_config`
--

DROP TABLE IF EXISTS `admin_access_config`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin_access_config` (
  `id` int NOT NULL DEFAULT '0',
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `status` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin_access_config`
--

LOCK TABLES `admin_access_config` WRITE;
/*!40000 ALTER TABLE `admin_access_config` DISABLE KEYS */;
INSERT INTO `admin_access_config` VALUES (26,'Home','inactive','2024-09-21 10:40:32','2024-09-21 10:40:32'),(27,'User','inactive','2024-09-21 10:40:32','2024-09-21 10:40:32'),(28,'Product','active','2024-09-21 10:40:32','2024-09-21 10:40:32'),(29,'Account','active','2024-09-21 10:40:32','2024-09-21 10:40:32'),(30,'Route','active','2024-09-21 10:40:32','2024-09-21 10:40:32'),(31,'Purchase','active','2024-09-21 10:40:32','2024-09-21 10:40:32'),(32,'Sale','active','2024-09-21 10:40:32','2024-09-21 10:40:32'),(34,'Barcode','active','2024-09-21 10:40:32','2024-09-21 10:40:32'),(35,'Receipt','active','2024-09-21 10:40:32','2024-09-21 10:40:32'),(36,'Payment','active','2024-09-21 10:40:32','2024-09-21 10:40:32'),(37,'Purchase Report','active','2024-09-21 10:40:32','2024-09-21 10:40:32'),(38,'Sale Report','active','2024-09-21 10:40:32','2024-09-21 10:40:32'),(39,'Stock Report','active','2024-09-21 10:40:32','2024-09-21 10:40:32'),(40,'Khatawani','active','2024-09-21 10:40:32','2024-09-21 10:40:32'),(41,'Daily Report','active','2024-09-21 10:40:32','2024-09-21 10:40:32'),(42,'Receipt Report','active','2024-09-21 10:40:32','2024-09-21 10:40:32'),(43,'Ledger Report','active','2024-09-21 10:40:32','2024-09-21 10:40:32'),(44,'Customer Outstanding','active','2024-09-21 10:40:32','2024-09-21 10:40:32'),(45,'Supplier Outstanding','active','2024-09-21 10:40:32','2024-09-21 10:40:32'),(46,'Carate Report','active','2024-09-21 10:40:32','2024-09-21 10:40:32'),(47,'Remainder','active','2024-09-21 10:40:32','2024-09-21 10:40:32'),(48,'Profit Loss Report','active','2024-09-21 10:40:32','2024-09-21 10:40:32'),(49,'Supplier Ledger Report','active','2024-09-21 10:40:32','2024-09-21 10:40:32'),(51,'Account Ledger Report','active','2024-11-16 15:19:50','2024-11-16 15:19:50');
/*!40000 ALTER TABLE `admin_access_config` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `carate_report`
--

DROP TABLE IF EXISTS `carate_report`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carate_report` (
  `id` int NOT NULL AUTO_INCREMENT,
  `carate_date` date DEFAULT NULL,
  `summary` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `customer_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `in_carate_100` int DEFAULT NULL,
  `in_carate_150` int DEFAULT NULL,
  `in_carate_250` int DEFAULT NULL,
  `in_carate_350` int DEFAULT NULL,
  `out_carate_100` int DEFAULT NULL,
  `out_carate_150` int DEFAULT NULL,
  `out_carate_250` int DEFAULT NULL,
  `out_carate_350` int DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `in_carate_total` int DEFAULT NULL,
  `out_carate_total` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_cr_summary` (`summary`),
  KEY `idx_summary` (`summary`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carate_report`
--

LOCK TABLES `carate_report` WRITE;
/*!40000 ALTER TABLE `carate_report` DISABLE KEYS */;
/*!40000 ALTER TABLE `carate_report` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `carate_user`
--

DROP TABLE IF EXISTS `carate_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carate_user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` varchar(250) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `carate_100` int DEFAULT NULL,
  `carate_150` int DEFAULT NULL,
  `carate_250` int DEFAULT NULL,
  `carate_350` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_user_id` (`user_id`),
  KEY `idx_caretes` (`carate_100`,`carate_150`,`carate_250`,`carate_350`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carate_user`
--

LOCK TABLES `carate_user` WRITE;
/*!40000 ALTER TABLE `carate_user` DISABLE KEYS */;
INSERT INTO `carate_user` VALUES (1,'Sun',0,0,0,0,'2024-12-25 10:42:33','2024-12-25 10:42:33'),(2,'Raj',0,0,0,0,'2024-12-25 10:43:38','2024-12-25 10:43:38');
/*!40000 ALTER TABLE `carate_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_id` (`id`),
  UNIQUE KEY `idx_name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` VALUES (15,'FRUITS','2024-09-21 17:18:28','2024-09-21 17:18:28');
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `footer_config`
--

DROP TABLE IF EXISTS `footer_config`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `footer_config` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `status` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_footer_config_name_status` (`name`,`status`),
  KEY `idx_footer_config_id` (`id`),
  KEY `idx_footer_config_name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `footer_config`
--

LOCK TABLES `footer_config` WRITE;
/*!40000 ALTER TABLE `footer_config` DISABLE KEYS */;
INSERT INTO `footer_config` VALUES (6,'Home','active','2024-09-21 10:52:37','2024-09-21 10:52:37'),(7,'Sale','inactive','2024-09-21 10:52:37','2024-12-15 08:40:15'),(8,'Receipt','active','2024-09-21 10:52:37','2024-09-21 10:52:37'),(9,'Payment','inactive','2024-09-21 10:52:37','2024-12-15 08:40:15'),(10,'Route Sale','active','2024-09-21 10:52:37','2024-09-21 10:52:37');
/*!40000 ALTER TABLE `footer_config` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ledger`
--

DROP TABLE IF EXISTS `ledger`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ledger` (
  `id` int NOT NULL AUTO_INCREMENT,
  `date` date DEFAULT NULL,
  `summary` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `balance` int DEFAULT NULL,
  `out_carate` int DEFAULT NULL,
  `total_balance` int DEFAULT NULL,
  `cash` int DEFAULT NULL,
  `online` float DEFAULT NULL,
  `discount` int DEFAULT NULL,
  `in_carate` int DEFAULT NULL,
  `remaining` int DEFAULT NULL,
  `route` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `customer_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `online_bank` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `added_by` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_ledger_date` (`date`),
  KEY `idx_ledger_route` (`route`),
  KEY `idx_ledger_customer_name` (`customer_name`),
  KEY `idx_ledger_added_by` (`added_by`),
  KEY `idx_ledger_date_route_customer_name_added_by` (`date`,`route`,`customer_name`,`added_by`),
  KEY `idx_ledger_date_route_customer_name` (`date`,`route`,`customer_name`),
  KEY `idx_summary` (`summary`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ledger`
--

LOCK TABLES `ledger` WRITE;
/*!40000 ALTER TABLE `ledger` DISABLE KEYS */;
/*!40000 ALTER TABLE `ledger` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment`
--

DROP TABLE IF EXISTS `payment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment` (
  `p_id` int NOT NULL AUTO_INCREMENT,
  `date` date DEFAULT NULL,
  `from_account` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `to_account` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `comment` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `prev_balance` int DEFAULT NULL,
  `amounr` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `added_by` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cash` bigint DEFAULT NULL,
  `online` bigint DEFAULT NULL,
  `discount` bigint DEFAULT NULL,
  `mobile_no` bigint DEFAULT NULL,
  `supplier_bank_account` varchar(300) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`p_id`),
  KEY `idx_payment_date` (`date`),
  KEY `idx_payment_to_account` (`to_account`),
  KEY `idx_payment_date_to_account` (`date`,`to_account`),
  KEY `idx_p_id` (`p_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment`
--

LOCK TABLES `payment` WRITE;
/*!40000 ALTER TABLE `payment` DISABLE KEYS */;
/*!40000 ALTER TABLE `payment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `category` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `rate` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `w_rate` int DEFAULT NULL,
  `minimum_stock` int DEFAULT NULL,
  `rate_editable` tinyint(1) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_product_id` (`id`),
  KEY `idx_product_category_is_active` (`category`,`is_active`)
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product`
--

LOCK TABLES `product` WRITE;
/*!40000 ALTER TABLE `product` DISABLE KEYS */;
INSERT INTO `product` VALUES (49,'APPLE ','FRUITS','1000',1250,0,0,1,'2024-09-21 17:18:48','2024-09-21 17:18:48'),(50,'BANANA ','FRUITS','250',400,500,1,1,'2024-09-21 17:19:06','2024-09-21 17:19:06'),(51,'ORANGE','FRUITS','1250',1500,0,NULL,1,'2024-09-21 17:19:24','2024-09-21 17:19:24'),(54,'Dragon','FRUITS','800',800,0,1,1,'2024-12-13 10:35:56','2024-12-13 10:35:56'),(55,'Orange','FRUITS','500',520,0,0,1,'2024-12-13 10:43:00','2024-12-13 10:43:00');
/*!40000 ALTER TABLE `product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `purchase`
--

DROP TABLE IF EXISTS `purchase`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `purchase` (
  `id` int NOT NULL AUTO_INCREMENT,
  `date` date DEFAULT NULL,
  `supplier_name` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `gadi_number` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `total_quantity` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `added_by` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `expenses` decimal(12,2) DEFAULT NULL,
  `previous_balance` bigint DEFAULT NULL,
  `current_balance` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_purchase_gadi_number` (`gadi_number`),
  KEY `idx_purchase_date` (`date`),
  KEY `idx_purchase_supplier_name` (`supplier_name`),
  KEY `idx_purchase_id` (`id`),
  KEY `idx_purchase_date_supplier` (`date`,`supplier_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `purchase`
--

LOCK TABLES `purchase` WRITE;
/*!40000 ALTER TABLE `purchase` DISABLE KEYS */;
/*!40000 ALTER TABLE `purchase` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `purchase_product`
--

DROP TABLE IF EXISTS `purchase_product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `purchase_product` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_name` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `bata` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `purchase_id` int DEFAULT NULL,
  `mark` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `purchase_price` int DEFAULT NULL,
  `selling_price` int DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  `unit` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `price` int DEFAULT NULL,
  `orderd_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `p_date` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_purchase_product_bata` (`bata`),
  KEY `idx_purchase_product_purchase_id` (`purchase_id`),
  KEY `idx_p_date` (`p_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `purchase_product`
--

LOCK TABLES `purchase_product` WRITE;
/*!40000 ALTER TABLE `purchase_product` DISABLE KEYS */;
/*!40000 ALTER TABLE `purchase_product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `receipt`
--

DROP TABLE IF EXISTS `receipt`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `receipt` (
  `receipt_id` int NOT NULL AUTO_INCREMENT,
  `date` date DEFAULT NULL,
  `from_account` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `mobile_no` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `note` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `previous_balance` int DEFAULT NULL,
  `deposite` bigint DEFAULT NULL,
  `online_deposite_bank` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `online_deposite` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `discount` float DEFAULT NULL,
  `carate_100` int DEFAULT NULL,
  `carate_150` int DEFAULT NULL,
  `carate_250` int DEFAULT NULL,
  `carate_350` int DEFAULT NULL,
  `deposite_carate_price` int DEFAULT NULL,
  `remaining` bigint DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `added_by` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `validate` varchar(10) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `baki_100` int DEFAULT NULL,
  `baki_150` int DEFAULT NULL,
  `baki_250` int DEFAULT NULL,
  `baki_350` int DEFAULT NULL,
  PRIMARY KEY (`receipt_id`),
  KEY `idx_receipt_date` (`date`),
  KEY `idx_receipt_from_account` (`from_account`),
  KEY `idx_receipt_added_by` (`added_by`),
  KEY `idx_receipt_date_from_account_added_by` (`date`,`from_account`,`added_by`),
  KEY `idx_receipt_id` (`receipt_id`),
  KEY `idx_remaining` (`remaining`),
  KEY `idx_previous_balance` (`previous_balance`),
  KEY `idx_carate_100` (`carate_100`),
  KEY `idx_carate_150` (`carate_150`),
  KEY `idx_carate_250` (`carate_250`),
  KEY `idx_carate_350` (`carate_350`),
  KEY `idx_receipt_receipt_id_from_account` (`receipt_id`,`from_account`),
  KEY `idx_date_added_by` (`date`,`added_by`),
  KEY `idx_validate` (`validate`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `receipt`
--

LOCK TABLES `receipt` WRITE;
/*!40000 ALTER TABLE `receipt` DISABLE KEYS */;
/*!40000 ALTER TABLE `receipt` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `route`
--

DROP TABLE IF EXISTS `route`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `route` (
  `id` int NOT NULL AUTO_INCREMENT,
  `route_name` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `details` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `mobile_no` bigint DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_route_id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `route`
--

LOCK TABLES `route` WRITE;
/*!40000 ALTER TABLE `route` DISABLE KEYS */;
INSERT INTO `route` VALUES (24,'MANDAVAGAN','m',0,1,'2024-09-25 18:34:28','2024-09-25 18:34:28'),(25,'ठोक वाय्पारी','ठो',0,1,'2024-09-27 19:04:03','2024-09-27 19:04:03'),(26,'All root','all',8237300204,1,'2024-10-18 10:19:43','2024-10-18 10:19:43'),(28,'Vadgoan root','v',0,1,'2024-12-13 10:41:02','2024-12-13 10:41:02');
/*!40000 ALTER TABLE `route` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sale_product`
--

DROP TABLE IF EXISTS `sale_product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sale_product` (
  `id` int NOT NULL AUTO_INCREMENT,
  `bill_id` int DEFAULT NULL,
  `bata` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `mark` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `product` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  `rate` int DEFAULT NULL,
  `price` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_sale_product_bata` (`bata`),
  KEY `idx_sale_product_bill_id` (`bill_id`),
  KEY `idx_bata` (`bata`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sale_product`
--

LOCK TABLES `sale_product` WRITE;
/*!40000 ALTER TABLE `sale_product` DISABLE KEYS */;
/*!40000 ALTER TABLE `sale_product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sale_table`
--

DROP TABLE IF EXISTS `sale_table`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sale_table` (
  `bill_no` int DEFAULT NULL,
  `date` date DEFAULT NULL,
  `cust_name` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `address` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `mobile_no` bigint DEFAULT NULL,
  `comment` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `barcode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `amount` int DEFAULT NULL,
  `carate_amount` int DEFAULT NULL,
  `total_amount` int DEFAULT NULL,
  `cash` bigint DEFAULT NULL,
  `online_acc` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `online_amt` int DEFAULT NULL,
  `balance` int DEFAULT NULL,
  `note` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `pre_balance` int DEFAULT NULL,
  `discount` int DEFAULT NULL,
  `route` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `inCarat` int DEFAULT NULL,
  `in_carate_100` int DEFAULT NULL,
  `in_carate_150` int DEFAULT NULL,
  `in_carate_250` int DEFAULT NULL,
  `in_carate_350` int DEFAULT NULL,
  `out_carate_100` int DEFAULT NULL,
  `out_carate_150` int DEFAULT NULL,
  `out_carate_250` int DEFAULT NULL,
  `out_carate_350` int DEFAULT NULL,
  `added_by` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `validate` varchar(10) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `baki_100` int DEFAULT NULL,
  `baki_150` int DEFAULT NULL,
  `baki_250` int DEFAULT NULL,
  `baki_350` int DEFAULT NULL,
  KEY `idx_sale_date` (`date`),
  KEY `idx_sale_route` (`route`),
  KEY `idx_sale_added_by` (`added_by`),
  KEY `idx_sale_date_route_added_by` (`date`,`route`,`added_by`),
  KEY `idx_sale_table_cust_name` (`cust_name`),
  KEY `idx_sale_table_added_by` (`added_by`),
  KEY `idx_sale_table_bill_no` (`bill_no`),
  KEY `idx_sale_filters` (`date`,`cust_name`,`route`,`added_by`,`bill_no`),
  KEY `idx_date_added_by` (`date`,`added_by`),
  KEY `idx_sale_table_date_added_by_cust_name` (`date`,`added_by`,`cust_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sale_table`
--

LOCK TABLES `sale_table` WRITE;
/*!40000 ALTER TABLE `sale_table` DISABLE KEYS */;
/*!40000 ALTER TABLE `sale_table` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stock`
--

DROP TABLE IF EXISTS `stock`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stock` (
  `id` int NOT NULL AUTO_INCREMENT,
  `Date` date DEFAULT NULL,
  `product_name` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Bata` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `purchase` int DEFAULT NULL,
  `sale` int DEFAULT NULL,
  `closing` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `supplier_name` varchar(250) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `gadi_number` varchar(250) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `purchase_id` int DEFAULT NULL,
  `mark` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_stock_purchase_id` (`purchase_id`),
  KEY `idx_stock_date` (`Date`),
  KEY `idx_stock_bata` (`Bata`),
  KEY `idx_stock_product_name` (`product_name`),
  KEY `idx_stock_gadi_number` (`gadi_number`),
  KEY `idx_stock_supplier_name` (`supplier_name`),
  KEY `idx_stock_filters` (`Date`,`Bata`,`product_name`,`gadi_number`,`supplier_name`,`purchase_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stock`
--

LOCK TABLES `stock` WRITE;
/*!40000 ALTER TABLE `stock` DISABLE KEYS */;
/*!40000 ALTER TABLE `stock` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_table`
--

DROP TABLE IF EXISTS `user_table`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_table` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `usertype` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `name` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `password` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `status` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `username` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `route` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `idx_user_table_username` (`username`),
  KEY `idx_user_table_username_password` (`username`,`password`),
  KEY `idx_user_table_id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=104 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_table`
--

LOCK TABLES `user_table` WRITE;
/*!40000 ALTER TABLE `user_table` DISABLE KEYS */;
INSERT INTO `user_table` VALUES (92,'Admin','gaurav','gaurav',NULL,'2024-09-21 11:06:08','2024-09-21 11:06:08','gaurav',NULL),(94,'Admin','deva','deva','Super','2024-09-21 16:41:17','2024-09-21 16:41:17','deva',NULL),(95,'Admin','DHANRAJ KOKATE','DK7512','1','2024-09-21 17:03:16','2024-09-21 17:03:16','DHANRAJ','TEST'),(99,'Admin','poratmesh','123','1','2024-10-18 10:20:03','2024-10-18 10:20:03','123','all root'),(100,'Admin','VAIBHAV SHIMNDE ','2190','1','2024-11-15 09:42:35','2024-11-15 09:42:35','7515','all root'),(102,'User','Prathmesh jadhav','3073','1','2024-12-15 08:38:13','2024-12-15 08:38:13','3073','All root'),(103,'User','santosh chugule','123','1','2024-12-20 16:56:48','2024-12-20 16:56:48','santosh','MANDAVAGAN');
/*!40000 ALTER TABLE `user_table` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-12-25 16:13:56
