/*!999999\- enable the sandbox mode */
-- MariaDB dump 10.19  Distrib 10.6.18-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: skfruit
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
-- Table structure for table `access_config`
--

DROP TABLE IF EXISTS `access_config`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `access_config` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_access_config_name` (`name`),
  KEY `idx_access_config_status` (`status`),
  KEY `idx_access_config_name_status` (`name`,`status`),
  KEY `idx_access_config_id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `access_config`
--

LOCK TABLES `access_config` WRITE;
/*!40000 ALTER TABLE `access_config` DISABLE KEYS */;
 INSERT INTO `access_config` VALUES (26,'home','inactive','2024-09-21 10:40:32','2024-09-21 10:40:32'),(27,'User','active','2024-09-21 10:40:32','2024-09-21 10:40:32'),(28,'Product','active','2024-09-21 10:40:32','2024-09-21 10:40:32'),(29,'Account','active','2024-09-21 10:40:32','2024-09-21 10:40:32'),(30,'Route','active','2024-09-21 10:40:32','2024-09-21 10:40:32'),(31,'Purchase','active','2024-09-21 10:40:32','2024-09-21 10:40:32'),(32,'Sale','active','2024-09-21 10:40:32','2024-09-21 10:40:32'),(33,'Vehicle','inactive','2024-09-21 10:40:32','2024-09-21 10:40:32'),(34,'Barcode','active','2024-09-21 10:40:32','2024-09-21 10:40:32'),(35,'Receipt','active','2024-09-21 10:40:32','2024-09-21 10:40:32'),(36,'Payment','active','2024-09-21 10:40:32','2024-09-21 10:40:32'),(37,'Purchase Report','active','2024-09-21 10:40:32','2024-09-21 10:40:32'),(38,'Sale Report','active','2024-09-21 10:40:32','2024-09-21 10:40:32'),(39,'Stock Report','active','2024-09-21 10:40:32','2024-09-21 10:40:32'),(40,'Khatawani','active','2024-09-21 10:40:32','2024-09-21 10:40:32'),(41,'Daily Report','active','2024-09-21 10:40:32','2024-09-21 10:40:32'),(42,'Receipt Report','active','2024-09-21 10:40:32','2024-09-21 10:40:32'),(43,'Ledger Report','active','2024-09-21 10:40:32','2024-09-21 10:40:32'),(44,'Customer Outstanding','active','2024-09-21 10:40:32','2024-09-21 10:40:32'),(45,'Supplier Outstanding','active','2024-09-21 10:40:32','2024-09-21 10:40:32'),(46,'Carate Report','active','2024-09-21 10:40:32','2024-09-21 10:40:32'),(47,'Remainder','active','2024-09-21 10:40:32','2024-09-21 10:40:32'),(48,'Profit Loss Report','active','2024-09-21 10:40:32','2024-09-21 10:40:32'),(49,'Supplier Ledger Report','active','2024-09-21 10:40:32','2024-09-21 10:40:32'),(50,'Route Sale','active','2024-09-21 10:40:32','2024-09-21 10:40:32');
/*!40000 ALTER TABLE `access_config` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `account_group_table`
--

DROP TABLE IF EXISTS `account_group_table`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `account_group_table` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp(),
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
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `account_table` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `is_ative` tinyint(1) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `address` varchar(50) DEFAULT NULL,
  `mobile_no` bigint(20) DEFAULT NULL,
  `account_group` varchar(50) DEFAULT NULL,
  `route_detail` varchar(255) DEFAULT NULL,
  `prev_balance` bigint(20) DEFAULT NULL,
  `cr_dr_type` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp(),
  `current_balance` bigint(20) DEFAULT NULL,
  `optional_mobile` bigint(20) DEFAULT NULL,
  `company` varchar(250) DEFAULT NULL,
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
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `account_table`
--

LOCK TABLES `account_table` WRITE;
/*!40000 ALTER TABLE `account_table` DISABLE KEYS */;
INSERT INTO `account_table` VALUES (39,1,'DHANRAJ KOKATE','KASHTI',8237300204,'Worker',NULL,0,NULL,'2024-09-21 17:02:07','2024-09-21 17:02:07',0,0,'',NULL),(40,1,'VAIBHAV SHIMNDE ','ADHALGAON',9922676380,'Worker','TEST',0,NULL,'2024-09-21 17:20:59','2024-09-21 17:20:59',0,8888437515,'',NULL),(42,1,'SOMNATH ADSUL','PARGAON',0,'Customer','MANDAVGAN',75204,'no','2024-09-25 18:35:26','2024-09-25 18:35:26',106882,0,'',NULL),(43,1,'PARVZE BATH','SOPUR KASHMIR',0,'Supplier',NULL,0,NULL,'2024-09-25 18:39:49','2024-09-25 18:39:49',96950,0,'GMB SONS',NULL),(44,1,'SK AXIS','AXIS',8237300204,'Bank Account',NULL,0,NULL,'2024-09-25 18:40:53','2024-09-25 18:40:53',0,8237300204,'',NULL),(45,1,'YK UNION','UNION ',9860601102,'Bank Account',NULL,0,NULL,'2024-09-25 18:41:30','2024-09-25 18:41:30',0,0,'',NULL),(46,1,'SAVATA FRUIT SUPPLIER','ALL INDIA',0,'Supplier','',100000,'yes','2024-09-25 18:42:29','2024-09-25 18:42:29',6000000,0,'SAVATA FRUIT',NULL),(47,1,'firoz bagwan','indapur',0,'Customer','ठोक वाय्पारी',0,'yes','2024-09-27 19:14:55','2024-09-27 19:14:55',0,0,'',NULL),(48,1,'sb samir ','rashin',0,'Customer','ठोक वाय्पारी',1000,'yes','2024-09-27 19:21:34','2024-09-27 19:21:34',1000,0,'sb fruit',NULL),(49,1,'dhanraj ','kashti',8237300204,'Customer','ठोक वाय्पारी',1000,'yes','2024-09-30 18:28:55','2024-09-30 18:28:55',900,9960607512,'dk','2024-10-01'),(50,1,'firoz ','indapur',0,'Customer','ठोक वाय्पारी',1000,'no','2024-10-18 10:16:05','2024-10-18 10:16:05',1000,0,'bagwan',NULL),(51,1,'poratmesh','pune',3073,'Worker',NULL,0,NULL,'2024-10-18 10:18:04','2024-10-18 10:18:04',0,0,'',NULL);
/*!40000 ALTER TABLE `account_table` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `carate_bill`
--

DROP TABLE IF EXISTS `carate_bill`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `carate_bill` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `bill_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `carate_100` int(11) DEFAULT NULL,
  `carate_150` int(11) DEFAULT NULL,
  `carate_250` int(11) DEFAULT NULL,
  `carate_350` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_id` (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_bill_id` (`bill_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carate_bill`
--

LOCK TABLES `carate_bill` WRITE;
/*!40000 ALTER TABLE `carate_bill` DISABLE KEYS */;
/*!40000 ALTER TABLE `carate_bill` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `carate_report`
--

DROP TABLE IF EXISTS `carate_report`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `carate_report` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `carate_date` date DEFAULT NULL,
  `summary` varchar(100) DEFAULT NULL,
  `customer_name` varchar(100) DEFAULT NULL,
  `in_carate_100` int(11) DEFAULT NULL,
  `in_carate_150` int(11) DEFAULT NULL,
  `in_carate_250` int(11) DEFAULT NULL,
  `in_carate_350` int(11) DEFAULT NULL,
  `out_carate_100` int(11) DEFAULT NULL,
  `out_carate_150` int(11) DEFAULT NULL,
  `out_carate_250` int(11) DEFAULT NULL,
  `out_carate_350` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `in_carate_total` int(11) DEFAULT NULL,
  `out_carate_total` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_cr_summary` (`summary`),
  KEY `idx_summary` (`summary`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carate_report`
--

LOCK TABLES `carate_report` WRITE;
/*!40000 ALTER TABLE `carate_report` DISABLE KEYS */;
INSERT INTO `carate_report` VALUES (25,'2024-09-28','sale(2)','SOMNATH ADSUL',0,0,0,0,1,2,0,0,'2024-09-27 18:45:34','2024-09-27 18:45:34',0,400),(27,'2024-09-28','sale(5)','SOMNATH ADSUL',0,1,2,3,21,4,2,26,'2024-09-27 18:58:09','2024-09-27 18:58:09',1700,12300),(28,'2024-09-29','sale(7)','Deshmane Sir',0,0,0,0,62,0,0,0,'2024-09-29 12:04:08','2024-09-29 12:04:08',0,6200),(29,'2024-09-29','Receipt(1)','Deshmane Sir',0,0,0,0,0,0,0,0,'2024-09-29 12:09:19','2024-09-29 12:09:19',0,0),(30,'2024-10-01','Receipt(2)','dhanraj ',1,0,0,0,0,0,0,0,'2024-09-30 18:59:02','2024-09-30 18:59:02',100,0),(31,'2024-10-01','Receipt(3)','Deshmane Sir',0,0,0,0,0,0,0,0,'2024-09-30 18:59:31','2024-09-30 18:59:31',0,0),(32,'2024-10-10','sale(10)','SOMNATH ADSUL',5,0,0,0,1,0,0,0,'2024-10-09 18:49:30','2024-10-09 18:49:30',500,100),(35,'2024-09-28','sale(4)','SOMNATH ADSUL',3,2,2,0,0,1,2,3,'2024-10-09 19:06:25','2024-10-09 19:06:25',1100,1700),(36,'2024-10-18','sale(13)','SOMNATH ADSUL',0,0,0,0,0,0,0,0,'2024-10-18 11:07:42','2024-10-18 11:07:42',0,0),(38,'2024-09-21','sale(1)','Deshmane Sir',0,0,0,0,0,0,0,0,'2024-10-18 12:03:33','2024-10-18 12:03:33',0,0);
/*!40000 ALTER TABLE `carate_report` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `carate_user`
--

DROP TABLE IF EXISTS `carate_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `carate_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` varchar(250) DEFAULT NULL,
  `carate_100` int(11) DEFAULT NULL,
  `carate_150` int(11) DEFAULT NULL,
  `carate_250` int(11) DEFAULT NULL,
  `carate_350` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_user_id` (`user_id`),
  KEY `idx_caretes` (`carate_100`,`carate_150`,`carate_250`,`carate_350`)
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carate_user`
--

LOCK TABLES `carate_user` WRITE;
/*!40000 ALTER TABLE `carate_user` DISABLE KEYS */;
INSERT INTO `carate_user` VALUES (36,'Deshmane Sir',63,2,0,0,'2024-09-21 16:34:53','2024-09-21 16:34:53'),(37,'DHANRAJ KOKATE',0,0,0,0,'2024-09-21 17:02:07','2024-09-21 17:02:07'),(38,'VAIBHAV SHIMNDE ',0,0,0,0,'2024-09-21 17:20:59','2024-09-21 17:20:59'),(39,'SOMNATH ADSUL',17,9,4,46,'2024-09-25 18:35:26','2024-09-25 18:35:26'),(40,'PARVZE BATH',0,0,0,0,'2024-09-25 18:39:49','2024-09-25 18:39:49'),(41,'SK AXIS',0,0,0,0,'2024-09-25 18:40:53','2024-09-25 18:40:53'),(42,'YK UNION',0,0,0,0,'2024-09-25 18:41:30','2024-09-25 18:41:30'),(43,'SAVATA FRUIT SUPPLIER',0,0,0,0,'2024-09-25 18:42:29','2024-09-25 18:42:29'),(44,'firoz bagwan',1,2,4,8,'2024-09-27 19:14:55','2024-09-27 19:14:55'),(45,'sb samir ',5,3,3,5,'2024-09-27 19:21:34','2024-09-27 19:21:34'),(46,'dhanraj ',0,0,0,0,'2024-09-30 18:28:55','2024-09-30 18:28:55'),(47,'firoz ',1,2,24,821,'2024-10-18 10:16:05','2024-10-18 10:16:05'),(48,'poratmesh',0,0,0,0,'2024-10-18 10:18:04','2024-10-18 10:18:04');
/*!40000 ALTER TABLE `carate_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `carates`
--

DROP TABLE IF EXISTS `carates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `carates` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `carates` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carates`
--

LOCK TABLES `carates` WRITE;
/*!40000 ALTER TABLE `carates` DISABLE KEYS */;
/*!40000 ALTER TABLE `carates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `category` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp(),
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
INSERT INTO `category` VALUES (14,'TEST','2024-09-21 16:16:13','2024-09-21 16:16:13'),(15,'FRUITS','2024-09-21 17:18:28','2024-09-21 17:18:28');
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `driverRoute`
--

DROP TABLE IF EXISTS `driverRoute`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `driverRoute` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `driver_name` varchar(50) DEFAULT NULL,
  `route` varchar(50) DEFAULT NULL,
  `trip_date` date DEFAULT NULL,
  `vehicle_no` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `driverRoute`
--

LOCK TABLES `driverRoute` WRITE;
/*!40000 ALTER TABLE `driverRoute` DISABLE KEYS */;
/*!40000 ALTER TABLE `driverRoute` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `footer_config`
--

DROP TABLE IF EXISTS `footer_config`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `footer_config` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `status` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
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
INSERT INTO `footer_config` VALUES (6,'Home','active','2024-09-21 10:52:37','2024-09-21 10:52:37'),(7,'Sale','active','2024-09-21 10:52:37','2024-09-21 10:52:37'),(8,'Receipt','active','2024-09-21 10:52:37','2024-09-21 10:52:37'),(9,'Payment','active','2024-09-21 10:52:37','2024-09-21 10:52:37'),(10,'Route Sale','active','2024-09-21 10:52:37','2024-09-21 10:52:37');
/*!40000 ALTER TABLE `footer_config` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ledger`
--

DROP TABLE IF EXISTS `ledger`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ledger` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `date` date DEFAULT NULL,
  `summary` varchar(50) DEFAULT NULL,
  `balance` int(11) DEFAULT NULL,
  `out_carate` int(11) DEFAULT NULL,
  `total_balance` int(11) DEFAULT NULL,
  `cash` int(11) DEFAULT NULL,
  `online` float DEFAULT NULL,
  `discount` int(11) DEFAULT NULL,
  `in_carate` int(11) DEFAULT NULL,
  `remaining` int(11) DEFAULT NULL,
  `route` varchar(255) DEFAULT NULL,
  `customer_name` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp(),
  `online_bank` varchar(100) DEFAULT NULL,
  `added_by` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_ledger_date` (`date`),
  KEY `idx_ledger_route` (`route`),
  KEY `idx_ledger_customer_name` (`customer_name`),
  KEY `idx_ledger_added_by` (`added_by`),
  KEY `idx_ledger_date_route_customer_name_added_by` (`date`,`route`,`customer_name`,`added_by`),
  KEY `idx_ledger_date_route_customer_name` (`date`,`route`,`customer_name`),
  KEY `idx_summary` (`summary`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ledger`
--

LOCK TABLES `ledger` WRITE;
/*!40000 ALTER TABLE `ledger` DISABLE KEYS */;
INSERT INTO `ledger` VALUES (25,'2024-09-28','Sale(2)',1920,400,90674,0,0,0,0,90674,'MANDAVGAN','SOMNATH ADSUL','2024-09-27 18:45:34','2024-09-27 18:45:34','','DHANRAJ KOKATE'),(27,'2024-09-28','Sale(5)',1920,12300,92594,2000,590,4,1700,90000,'MANDAVGAN','SOMNATH ADSUL','2024-09-27 18:58:09','2024-09-27 18:58:09','YK UNION','DHANRAJ KOKATE'),(28,'2024-09-29','Sale(7)',2040,6200,9240,41520,4500,4500,0,9240,'TEST','Deshmane Sir','2024-09-29 12:04:08','2024-09-29 12:04:08','YK UNION','DHANRAJ KOKATE'),(29,'2024-09-29','Receipt(1)',9240,0,-96270,4500,101010,0,0,-96270,'TEST','Deshmane Sir','2024-09-29 12:09:19','2024-09-29 12:09:19','YK UNION','DHANRAJ KOKATE'),(30,'2024-10-01','Receipt(2)',1000,0,900,0,0,0,100,900,'ठोक वाय्पारी','dhanraj ','2024-09-30 18:59:02','2024-09-30 18:59:02','','DHANRAJ KOKATE'),(31,'2024-10-01','Receipt(3)',-96270,0,-96303,0,33,0,0,-96303,'TEST','Deshmane Sir','2024-09-30 18:59:31','2024-09-30 18:59:31','SK AXIS','DHANRAJ KOKATE'),(32,'2024-10-10','Sale(10)',1500,100,91500,0,0,0,500,91500,'MANDAVGAN','SOMNATH ADSUL','2024-10-09 18:49:30','2024-10-09 18:49:30','','DHANRAJ KOKATE'),(33,'2024-10-18','Sale(13)',9600,0,106882,0,0,0,0,106882,'MANDAVGAN','SOMNATH ADSUL','2024-10-18 11:07:42','2024-10-18 11:07:42','','poratmesh');
/*!40000 ALTER TABLE `ledger` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment`
--

DROP TABLE IF EXISTS `payment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `payment` (
  `p_id` int(11) NOT NULL AUTO_INCREMENT,
  `date` date DEFAULT NULL,
  `from_account` varchar(50) DEFAULT NULL,
  `to_account` varchar(50) DEFAULT NULL,
  `comment` varchar(100) DEFAULT NULL,
  `prev_balance` int(11) DEFAULT NULL,
  `amounr` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp(),
  `added_by` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cash` bigint(20) DEFAULT NULL,
  `online` bigint(20) DEFAULT NULL,
  `discount` bigint(20) DEFAULT NULL,
  `mobile_no` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`p_id`),
  KEY `idx_payment_date` (`date`),
  KEY `idx_payment_to_account` (`to_account`),
  KEY `idx_payment_date_to_account` (`date`,`to_account`),
  KEY `idx_p_id` (`p_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment`
--

LOCK TABLES `payment` WRITE;
/*!40000 ALTER TABLE `payment` DISABLE KEYS */;
INSERT INTO `payment` VALUES (1,'2024-10-09','SK AXIS','SAVATA FRUIT SUPPLIER','today iam paying yo',2735000,2700000,'2024-10-09 18:16:47','2024-10-09 18:16:47','DHANRAJ KOKATE',4000,30000,1000,0),(2,'2024-10-18','SK AXIS','PARVZE BATH','gc',996959,96950,'2024-10-18 11:26:07','2024-10-18 11:26:07','poratmesh',100000,800009,0,0),(3,'2024-10-20','YK UNION','SAVATA FRUIT SUPPLIER','test',8996480,6000000,'2024-10-20 16:07:24','2024-10-20 16:07:24','gaurav',6480,1990000,1000000,0);
/*!40000 ALTER TABLE `payment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `product` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  `category` varchar(50) DEFAULT NULL,
  `rate` varchar(50) DEFAULT NULL,
  `w_rate` int(11) DEFAULT NULL,
  `minimum_stock` int(11) DEFAULT NULL,
  `rate_editable` tinyint(1) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_product_id` (`id`),
  KEY `idx_product_category_is_active` (`category`,`is_active`)
) ENGINE=InnoDB AUTO_INCREMENT=54 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product`
--

LOCK TABLES `product` WRITE;
/*!40000 ALTER TABLE `product` DISABLE KEYS */;
INSERT INTO `product` VALUES (49,'APPLE ','FRUITS','1000',1250,0,NULL,1,'2024-09-21 17:18:48','2024-09-21 17:18:48'),(50,'BANANA ','FRUITS','250',400,500,1,1,'2024-09-21 17:19:06','2024-09-21 17:19:06'),(51,'ORANGE','FRUITS','1250',1500,0,NULL,1,'2024-09-21 17:19:24','2024-09-21 17:19:24'),(53,'KV','FRUITS','1500',1750,0,NULL,1,'2024-09-21 17:19:59','2024-09-21 17:19:59');
/*!40000 ALTER TABLE `product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `purchase`
--

DROP TABLE IF EXISTS `purchase`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `purchase` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `date` date DEFAULT NULL,
  `supplier_name` varchar(50) DEFAULT NULL,
  `gadi_number` varchar(50) DEFAULT NULL,
  `total_quantity` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp(),
  `added_by` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `expenses` decimal(12,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_purchase_gadi_number` (`gadi_number`),
  KEY `idx_purchase_date` (`date`),
  KEY `idx_purchase_supplier_name` (`supplier_name`),
  KEY `idx_purchase_id` (`id`),
  KEY `idx_purchase_date_supplier` (`date`,`supplier_name`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `purchase`
--

LOCK TABLES `purchase` WRITE;
/*!40000 ALTER TABLE `purchase` DISABLE KEYS */;
INSERT INTO `purchase` VALUES (9,'2024-09-21','TEST','DUMMY-1429',10010,'2024-09-21 16:19:52','2024-09-21 16:19:52','gaurav',10),(12,'2024-09-26','SAVATA FRUIT SUPPLIER','s2025-551',2735000,'2024-09-25 19:04:16','2024-09-25 19:04:16','gaurav',250000),(13,'2024-09-30','PARVZE BATH','s2024_10',996959,'2024-09-30 09:31:57','2024-09-30 09:31:57','DHANRAJ KOKATE',51741),(14,'2024-10-18','SAVATA FRUIT SUPPLIER','s2024-11',3832760,'2024-10-18 11:06:04','2024-10-18 11:06:04','poratmesh',12000),(15,'2024-10-18','SAVATA FRUIT SUPPLIER','s2024_52',105020,'2024-10-18 11:31:38','2024-10-18 11:31:38','poratmesh',5020),(16,'2024-10-20','SAVATA FRUIT SUPPLIER','DUMMY-1429',1000,'2024-10-20 15:19:27','2024-10-20 15:19:27','gaurav',0),(17,'2024-10-20','SAVATA FRUIT SUPPLIER','DUMMY-1429',2357700,'2024-10-20 15:23:17','2024-10-20 15:23:17','gaurav',354500);
/*!40000 ALTER TABLE `purchase` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `purchase_product`
--

DROP TABLE IF EXISTS `purchase_product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `purchase_product` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product_name` varchar(50) DEFAULT NULL,
  `bata` varchar(50) DEFAULT NULL,
  `purchase_id` int(11) DEFAULT NULL,
  `mark` varchar(50) DEFAULT NULL,
  `purchase_price` int(11) DEFAULT NULL,
  `selling_price` int(11) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `unit` varchar(50) DEFAULT NULL,
  `price` int(11) DEFAULT NULL,
  `orderd_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp(),
  `p_date` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_purchase_product_bata` (`bata`),
  KEY `idx_purchase_product_purchase_id` (`purchase_id`),
  KEY `idx_p_date` (`p_date`)
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `purchase_product`
--

LOCK TABLES `purchase_product` WRITE;
/*!40000 ALTER TABLE `purchase_product` DISABLE KEYS */;
INSERT INTO `purchase_product` VALUES (17,'TEST','TEST',9,'test',100,120,100,'किलो',10000,'2024-09-21 16:19:46','2024-09-21 16:19:46','2024-09-21'),(24,'APPLE ','S59222',11,'SK APPLE',1050,1920,1100,'बॉक्स',1155000,'2024-09-25 19:03:33','2024-09-25 19:03:33','2024-09-26'),(25,'APPLE ','S59223',11,'SK RED',950,1500,1400,'बॉक्स',1330000,'2024-09-25 19:04:05','2024-09-25 19:04:05','2024-09-26'),(26,'APPLE ','4661',13,'fresh f',1000,1340,120,'बॉक्स',120000,'2024-09-30 07:53:31','2024-09-30 07:53:31','2024-09-30'),(27,'APPLE ','4662',13,'fresh f',900,1240,27,'बॉक्स',24300,'2024-09-30 07:54:03','2024-09-30 07:54:03','2024-09-30'),(28,'APPLE ','4663',13,'fresh f',500,840,34,'बॉक्स',17000,'2024-09-30 07:55:36','2024-09-30 07:55:36','2024-09-30'),(29,'APPLE ','4664',13,'L71',950,1320,71,'बॉक्स',67450,'2024-09-30 07:56:04','2024-09-30 07:56:04','2024-09-30'),(30,'APPLE ','4665',13,'L29',850,1190,29,'बॉक्स',24650,'2024-09-30 07:56:45','2024-09-30 07:56:45','2024-09-30'),(31,'APPLE ','4666',13,'L72',930,1300,72,'बॉक्स',66960,'2024-09-30 08:38:56','2024-09-30 08:38:56','2024-09-30'),(32,'APPLE ','4667',13,'L66',850,1190,66,'बॉक्स',56100,'2024-09-30 08:39:26','2024-09-30 08:39:26','2024-09-30'),(35,'APPLE ','4669',13,'L29',750,1090,29,'बॉक्स',21750,'2024-09-30 08:41:56','2024-09-30 08:41:56','2024-09-30'),(36,'APPLE ','4670',13,'L9',420,760,9,'बॉक्स',3780,'2024-09-30 08:43:26','2024-09-30 08:43:26','2024-09-30'),(37,'APPLE ','4671',13,'L96',950,1290,96,'बॉक्स',91200,'2024-09-30 08:44:11','2024-09-30 08:44:11','2024-09-30'),(38,'APPLE ','4672',13,'L43',900,1240,43,'बॉक्स',38700,'2024-09-30 08:44:45','2024-09-30 08:44:45','2024-09-30'),(39,'APPLE ','4673',13,'L6',500,860,6,'बॉक्स',3000,'2024-09-30 08:45:12','2024-09-30 08:45:12','2024-09-30'),(40,'APPLE ','4674',13,'L17',300,640,17,'बॉक्स',5100,'2024-09-30 08:46:16','2024-09-30 08:46:16','2024-09-30'),(41,'APPLE ','4675',13,'L46',930,1290,46,'बॉक्स',42780,'2024-09-30 08:46:39','2024-09-30 08:46:39','2024-09-30'),(42,'APPLE ','4676',13,'L19NAK',1,650,19,'बॉक्स',19,'2024-09-30 08:47:48','2024-09-30 08:47:48','2024-09-30'),(43,'APPLE ','4677',13,'L79',930,1300,79,'बॉक्स',73470,'2024-09-30 08:55:02','2024-09-30 08:55:02','2024-09-30'),(44,'APPLE ','4678',13,'L123',1000,1270,123,'बॉक्स',123000,'2024-09-30 08:55:30','2024-09-30 08:55:30','2024-09-30'),(45,'APPLE ','4679',13,'L40',920,1340,40,'बॉक्स',36800,'2024-09-30 08:55:54','2024-09-30 08:55:54','2024-09-30'),(46,'APPLE ','4680',13,'GMB',1050,1260,101,'बॉक्स',106050,'2024-09-30 08:56:51','2024-09-30 08:56:51','2024-09-30'),(47,'APPLE ','4681',13,'L109',550,890,109,'बॉक्स',59950,'2024-09-30 08:57:38','2024-09-30 08:57:38','2024-09-30'),(48,'APPLE ','4682',13,'F25',300,640,8,'बॉक्स',2400,'2024-09-30 08:57:59','2024-09-30 08:57:59','2024-09-30'),(49,'APPLE ','4683',13,'F25',300,640,7,'बॉक्स',2100,'2024-09-30 08:58:13','2024-09-30 08:58:13','2024-09-30'),(50,'APPLE ','4668',13,'L13',800,1140,13,'बॉक्स',10400,'2024-09-30 09:12:02','2024-09-30 09:12:02','2024-09-30'),(53,'APPLE ','5502',14,'525',6,5,5,'यूनिट',30,'2024-10-18 10:22:21','2024-10-18 10:22:21','2024-10-18'),(56,'ORANGE','sn200',14,'sk',1250,1500,50,'बॉक्स',62500,'2024-10-18 11:04:12','2024-10-18 11:04:12','2024-10-18'),(57,'ORANGE','sn201',14,'skk',1200,1500,100,'बॉक्स',120000,'2024-10-18 11:04:39','2024-10-18 11:04:39','2024-10-18'),(58,'BANANA ','k51515',15,'bhbg',100,220,1000,'कॅरेट',100000,'2024-10-18 11:31:33','2024-10-18 11:31:33','2024-10-18'),(59,'BANANA ','testr',16,'test',100,120,10,'बॉक्स',1000,'2024-10-20 15:18:42','2024-10-20 15:18:42','2024-10-20'),(60,'BANANA ','123',17,'132',120,150,10,'यूनिट',1200,'2024-10-20 15:19:58','2024-10-20 15:19:58','2024-10-20'),(61,'ORANGE','123',17,'123',200,250,10,'बॉक्स',2000,'2024-10-20 15:20:26','2024-10-20 15:20:26','2024-10-20'),(62,'KV','123',17,'Dreagon ',100000,120000,20,'पेटी',2000000,'2024-10-20 15:22:10','2024-10-20 15:22:10','2024-10-20'),(63,'BANANA ','Mk',18,'Dummy',120,140,12,'किलो',1440,'2024-10-20 15:30:59','2024-10-20 15:30:59','2024-10-20');
/*!40000 ALTER TABLE `purchase_product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `receipt`
--

DROP TABLE IF EXISTS `receipt`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `receipt` (
  `receipt_id` int(11) NOT NULL AUTO_INCREMENT,
  `date` date DEFAULT NULL,
  `from_account` varchar(50) DEFAULT NULL,
  `mobile_no` varchar(50) DEFAULT NULL,
  `note` varchar(50) DEFAULT NULL,
  `previous_balance` int(11) DEFAULT NULL,
  `deposite` bigint(20) DEFAULT NULL,
  `online_deposite_bank` varchar(50) DEFAULT NULL,
  `online_deposite` varchar(50) DEFAULT NULL,
  `discount` float DEFAULT NULL,
  `carate_100` int(11) DEFAULT NULL,
  `carate_150` int(11) DEFAULT NULL,
  `carate_250` int(11) DEFAULT NULL,
  `carate_350` int(11) DEFAULT NULL,
  `deposite_carate_price` int(11) DEFAULT NULL,
  `remaining` bigint(20) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp(),
  `added_by` varchar(255) DEFAULT NULL,
  `validate` varchar(10) DEFAULT NULL,
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
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `receipt`
--

LOCK TABLES `receipt` WRITE;
/*!40000 ALTER TABLE `receipt` DISABLE KEYS */;
INSERT INTO `receipt` VALUES (1,'2024-09-29','Deshmane Sir','7040040015','',9240,4500,'YK UNION','101010',0,0,0,0,0,0,-96270,'2024-09-29 12:09:19','2024-09-29 12:09:19','DHANRAJ KOKATE','Pending'),(2,'2024-10-01','dhanraj ','8237300204','',1000,0,'','0',0,1,0,0,0,100,900,'2024-09-30 18:59:02','2024-09-30 18:59:02','DHANRAJ KOKATE','Pending'),(3,'2024-10-01','Deshmane Sir','7040040015','',-96270,0,'SK AXIS','33',0,0,0,0,0,0,-96303,'2024-09-30 18:59:31','2024-09-30 18:59:31','DHANRAJ KOKATE','Pending');
/*!40000 ALTER TABLE `receipt` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `route`
--

DROP TABLE IF EXISTS `route`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `route` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `route_name` varchar(50) DEFAULT NULL,
  `details` varchar(50) DEFAULT NULL,
  `mobile_no` bigint(20) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_route_id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `route`
--

LOCK TABLES `route` WRITE;
/*!40000 ALTER TABLE `route` DISABLE KEYS */;
INSERT INTO `route` VALUES (23,'MANDAVGAN','0',0,1,'2024-09-25 18:33:13','2024-09-25 18:33:13'),(24,'MANDAVAGAN','DFF',0,1,'2024-09-25 18:34:28','2024-09-25 18:34:28'),(25,'ठोक वाय्पारी','ठो',0,1,'2024-09-27 19:04:03','2024-09-27 19:04:03'),(26,'all root','all',8237300204,1,'2024-10-18 10:19:43','2024-10-18 10:19:43');
/*!40000 ALTER TABLE `route` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sale_product`
--

DROP TABLE IF EXISTS `sale_product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sale_product` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `bill_id` int(11) DEFAULT NULL,
  `bata` varchar(50) DEFAULT NULL,
  `mark` varchar(50) DEFAULT NULL,
  `product` varchar(50) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `rate` int(11) DEFAULT NULL,
  `price` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_sale_product_bata` (`bata`),
  KEY `idx_sale_product_bill_id` (`bill_id`),
  KEY `idx_bata` (`bata`)
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sale_product`
--

LOCK TABLES `sale_product` WRITE;
/*!40000 ALTER TABLE `sale_product` DISABLE KEYS */;
INSERT INTO `sale_product` VALUES (35,1,'S59222','SK APPLE','APPLE ',4,1950,7800,'2024-09-25 19:11:51','2024-09-25 19:11:51'),(36,1,'K24','SK','TEST',1,50,50,'2024-09-25 19:12:45','2024-09-25 19:12:45'),(37,1,'S59223','SK RED','APPLE ',4,1950,7800,'2024-09-25 19:13:05','2024-09-25 19:13:05'),(38,2,'S59222','SK APPLE','APPLE ',1,1920,1920,'2024-09-27 18:45:25','2024-09-27 18:45:25'),(39,3,'S59222','SK APPLE','APPLE ',1,1920,1920,'2024-09-27 18:45:58','2024-09-27 18:45:58'),(40,4,'S59222','SK APPLE','APPLE ',1,1920,1920,'2024-09-27 18:46:25','2024-09-27 18:46:25'),(41,5,'S59222','SK APPLE','APPLE ',1,1920,1920,'2024-09-27 18:48:14','2024-09-27 18:48:14'),(42,6,'S59222','SK APPLE','APPLE ',1,1920,1920,'2024-09-27 19:17:30','2024-09-27 19:17:30'),(43,6,'test2','test2','TEST',1,12,12,'2024-09-27 19:17:41','2024-09-27 19:17:41'),(44,7,'Test','test','TEST',1,120,120,'2024-09-29 12:02:13','2024-09-29 12:02:13'),(45,7,'S59222','SK APPLE','APPLE ',1,1920,1920,'2024-09-29 12:03:02','2024-09-29 12:03:02'),(46,8,'S59222','SK APPLE','APPLE ',1,1920,1920,'2024-09-30 18:46:47','2024-09-30 18:46:47'),(47,9,'4661','fresh f','APPLE ',1,1340,1340,'2024-10-09 18:45:10','2024-10-09 18:45:10'),(48,10,'S59223','SK RED','APPLE ',1,1500,1500,'2024-10-09 18:48:56','2024-10-09 18:48:56'),(49,11,'S59223','SK RED','APPLE ',1,1500,1500,'2024-10-09 20:01:48','2024-10-09 20:01:48'),(50,12,'4662','fresh f','APPLE ',3,1000,3000,'2024-10-18 10:46:39','2024-10-18 10:46:39'),(51,12,'S59222','SK APPLE','APPLE ',3,1000,3000,'2024-10-18 10:46:48','2024-10-18 10:46:48'),(52,12,'S59223','SK RED','APPLE ',3,1000,3000,'2024-10-18 10:48:10','2024-10-18 10:48:10'),(53,13,'sn200','sk','ORANGE',4,1200,4800,'2024-10-18 11:06:27','2024-10-18 11:06:27'),(54,13,'sn201','skk','ORANGE',4,1200,4800,'2024-10-18 11:07:09','2024-10-18 11:07:09');
/*!40000 ALTER TABLE `sale_product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sale_table`
--

DROP TABLE IF EXISTS `sale_table`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sale_table` (
  `bill_no` int(11) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `cust_name` varchar(50) DEFAULT NULL,
  `address` varchar(50) DEFAULT NULL,
  `mobile_no` bigint(20) DEFAULT NULL,
  `comment` varchar(50) DEFAULT NULL,
  `barcode` varchar(50) DEFAULT NULL,
  `amount` int(11) DEFAULT NULL,
  `carate_amount` int(11) DEFAULT NULL,
  `total_amount` int(11) DEFAULT NULL,
  `cash` bigint(20) DEFAULT NULL,
  `online_acc` varchar(50) DEFAULT NULL,
  `online_amt` int(11) DEFAULT NULL,
  `balance` int(11) DEFAULT NULL,
  `note` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp(),
  `pre_balance` int(11) DEFAULT NULL,
  `discount` int(11) DEFAULT NULL,
  `route` varchar(50) DEFAULT NULL,
  `inCarat` int(11) DEFAULT NULL,
  `in_carate_100` int(11) DEFAULT NULL,
  `in_carate_150` int(11) DEFAULT NULL,
  `in_carate_250` int(11) DEFAULT NULL,
  `in_carate_350` int(11) DEFAULT NULL,
  `out_carate_100` int(11) DEFAULT NULL,
  `out_carate_150` int(11) DEFAULT NULL,
  `out_carate_250` int(11) DEFAULT NULL,
  `out_carate_350` int(11) DEFAULT NULL,
  `added_by` varchar(255) DEFAULT NULL,
  `validate` varchar(10) DEFAULT NULL,
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
INSERT INTO `sale_table` VALUES (1,'2024-09-21','Deshmane Sir','Jalalpur',7040040015,'',NULL,0,0,1000,0,'',0,1000,'','2024-09-21 16:44:33','2024-09-21 16:44:33',1000,0,'TEST',0,0,0,0,0,0,0,0,0,'gaurav','Pending'),(1,'2024-09-26','SOMNATH ADSUL','PARGAON',0,'',NULL,15650,18650,90854,1000,'SK AXIS',1050,88754,'','2024-09-25 19:21:18','2024-09-25 19:21:18',75204,50,'MANDAVGAN',14100,111,2,1,20,110,2,0,8,'gaurav','Pending'),(2,'2024-09-28','SOMNATH ADSUL','PARGAON',0,'',NULL,1920,400,90674,0,'',0,90674,'','2024-09-27 18:45:34','2024-09-27 18:45:34',88754,0,'MANDAVGAN',0,1,2,0,0,0,0,0,0,'DHANRAJ KOKATE','Verified'),(4,'2024-09-28','SOMNATH ADSUL','PARGAON',0,'',NULL,1920,1700,92594,1000,'YK UNION',900,90674,'','2024-09-27 18:47:54','2024-09-27 18:47:54',90674,20,'MANDAVGAN',1100,0,1,2,3,3,2,2,0,'DHANRAJ KOKATE','Pending'),(5,'2024-09-28','SOMNATH ADSUL','PARGAON',0,'',NULL,1920,12300,92594,2000,'YK UNION',590,90000,'','2024-09-27 18:58:09','2024-09-27 18:58:09',90674,4,'MANDAVGAN',1700,21,4,2,26,0,1,2,3,'DHANRAJ KOKATE','Pending'),(7,'2024-09-29','Deshmane Sir','Jalalpur',7040040015,'',NULL,2040,6200,9240,41520,'YK UNION',4500,9240,'','2024-09-29 12:04:08','2024-09-29 12:04:08',1000,4500,'TEST',0,62,0,0,0,0,0,0,0,'DHANRAJ KOKATE','Pending'),(10,'2024-10-10','SOMNATH ADSUL','PARGAON',0,'',NULL,1500,100,91500,0,'',0,91500,'','2024-10-09 18:49:30','2024-10-09 18:49:30',90000,0,'MANDAVGAN',500,1,0,0,0,5,0,0,0,'DHANRAJ KOKATE','Pending'),(13,'2024-10-18','SOMNATH ADSUL','PARGAON',0,'',NULL,9600,0,106882,0,'',0,106882,'','2024-10-18 11:07:42','2024-10-18 11:07:42',97282,0,'MANDAVGAN',0,0,0,0,0,0,0,0,0,'poratmesh','Pending');
/*!40000 ALTER TABLE `sale_table` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stock`
--

DROP TABLE IF EXISTS `stock`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `stock` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `Date` date DEFAULT NULL,
  `product_name` varchar(50) DEFAULT NULL,
  `Bata` varchar(50) DEFAULT NULL,
  `purchase` int(11) DEFAULT NULL,
  `sale` int(11) DEFAULT NULL,
  `closing` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp(),
  `supplier_name` varchar(250) DEFAULT NULL,
  `gadi_number` varchar(250) DEFAULT NULL,
  `purchase_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_stock_purchase_id` (`purchase_id`),
  KEY `idx_stock_date` (`Date`),
  KEY `idx_stock_bata` (`Bata`),
  KEY `idx_stock_product_name` (`product_name`),
  KEY `idx_stock_gadi_number` (`gadi_number`),
  KEY `idx_stock_supplier_name` (`supplier_name`),
  KEY `idx_stock_filters` (`Date`,`Bata`,`product_name`,`gadi_number`,`supplier_name`,`purchase_id`)
) ENGINE=InnoDB AUTO_INCREMENT=68 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stock`
--

LOCK TABLES `stock` WRITE;
/*!40000 ALTER TABLE `stock` DISABLE KEYS */;
INSERT INTO `stock` VALUES (21,'2024-09-21','TEST','TEST',100,1,99,'2024-09-21 16:19:46','2024-09-21 16:19:46',NULL,NULL,1),(28,'2024-09-26','APPLE ','S59222',1100,15,1085,'2024-09-25 19:03:33','2024-09-25 19:03:33',NULL,NULL,11),(29,'2024-09-26','APPLE ','S59223',1400,3,1397,'2024-09-25 19:04:05','2024-09-25 19:04:05',NULL,NULL,11),(54,'2024-09-30','APPLE ','4668',13,0,13,'2024-09-30 09:12:02','2024-09-30 09:12:02','PARVZE BATH','s2024_10',13),(62,'2024-10-18','BANANA ','k51515',1000,0,1000,'2024-10-18 11:31:33','2024-10-18 11:31:33','SAVATA FRUIT SUPPLIER','s2024_52',15),(63,'2024-10-20','BANANA ','testr',10,0,10,'2024-10-20 15:18:42','2024-10-20 15:18:42','SAVATA FRUIT SUPPLIER','DUMMY-1429',16),(64,'2024-10-20','BANANA ','123',10,0,10,'2024-10-20 15:19:58','2024-10-20 15:19:58','SAVATA FRUIT SUPPLIER','DUMMY-1429',17),(65,'2024-10-20','ORANGE','123',10,0,10,'2024-10-20 15:20:26','2024-10-20 15:20:26','SAVATA FRUIT SUPPLIER','DUMMY-1429',17),(66,'2024-10-20','KV','123',20,0,20,'2024-10-20 15:22:10','2024-10-20 15:22:10','SAVATA FRUIT SUPPLIER','DUMMY-1429',17),(67,'2024-10-20','BANANA ','Mk',12,0,12,'2024-10-20 15:30:59','2024-10-20 15:30:59',NULL,NULL,18);
/*!40000 ALTER TABLE `stock` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `supplier_outstanding`
--

DROP TABLE IF EXISTS `supplier_outstanding`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `supplier_outstanding` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `supplier_name` varchar(50) DEFAULT NULL,
  `remaining_paid` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_supplier_outstanding_id` (`id`),
  KEY `idx_supplier_name` (`supplier_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `supplier_outstanding`
--

LOCK TABLES `supplier_outstanding` WRITE;
/*!40000 ALTER TABLE `supplier_outstanding` DISABLE KEYS */;
/*!40000 ALTER TABLE `supplier_outstanding` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `test`
--

DROP TABLE IF EXISTS `test`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `test` (
  `id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `test`
--

LOCK TABLES `test` WRITE;
/*!40000 ALTER TABLE `test` DISABLE KEYS */;
/*!40000 ALTER TABLE `test` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_table`
--

DROP TABLE IF EXISTS `user_table`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_table` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `usertype` varchar(50) DEFAULT NULL,
  `name` varchar(50) DEFAULT NULL,
  `password` varchar(50) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp(),
  `username` varchar(50) DEFAULT NULL,
  `route` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `idx_user_table_username` (`username`),
  KEY `idx_user_table_username_password` (`username`,`password`),
  KEY `idx_user_table_id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=100 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_table`
--

LOCK TABLES `user_table` WRITE;
/*!40000 ALTER TABLE `user_table` DISABLE KEYS */;
INSERT INTO `user_table` VALUES (92,'Admin','gaurav','gaurav',NULL,'2024-09-21 11:06:08','2024-09-21 11:06:08','gaurav',NULL),(94,'Admin','deva','deva','Super','2024-09-21 16:41:17','2024-09-21 16:41:17','deva',NULL),(95,'Admin','DHANRAJ KOKATE','DK7512','1','2024-09-21 17:03:16','2024-09-21 17:03:16','DHANRAJ','TEST'),(99,'Admin','poratmesh','123','1','2024-10-18 10:20:03','2024-10-18 10:20:03','123','all root');
/*!40000 ALTER TABLE `user_table` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vehicle`
--

DROP TABLE IF EXISTS `vehicle`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `vehicle` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  `vehicle_no` varchar(50) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vehicle`
--

LOCK TABLES `vehicle` WRITE;
/*!40000 ALTER TABLE `vehicle` DISABLE KEYS */;
/*!40000 ALTER TABLE `vehicle` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-10-22  3:00:02
