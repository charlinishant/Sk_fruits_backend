-- MySQL dump 10.13  Distrib 8.0.37, for Linux (x86_64)
--
-- Host: localhost    Database: skfruit
-- ------------------------------------------------------
-- Server version       8.0.37-0ubuntu0.24.04.1

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
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

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
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `account_table`
--

DROP TABLE IF EXISTS `account_table`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `account_table` (
  `id` int NOT NULL AUTO_INCREMENT,
  `is_ative` tinyint(1) DEFAULT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `address` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `mobile_no` bigint DEFAULT NULL,
  `account_group` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `route_detail` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
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
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `carate_bill`
--

DROP TABLE IF EXISTS `carate_bill`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carate_bill` (
  `id` int NOT NULL AUTO_INCREMENT,
  `bill_id` int DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `carate_100` int DEFAULT NULL,
  `carate_150` int DEFAULT NULL,
  `carate_250` int DEFAULT NULL,
  `carate_350` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_id` (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_bill_id` (`bill_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

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
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

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
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `carates`
--

DROP TABLE IF EXISTS `carates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carates` (
  `id` int NOT NULL AUTO_INCREMENT,
  `carates` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

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
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `driverRoute`
--

DROP TABLE IF EXISTS `driverRoute`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `driverRoute` (
  `id` int NOT NULL AUTO_INCREMENT,
  `driver_name` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `route` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `trip_date` date DEFAULT NULL,
  `vehicle_no` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `footer_config`
--

DROP TABLE IF EXISTS `footer_config`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `footer_config` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `status` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_footer_config_name_status` (`name`,`status`),
  KEY `idx_footer_config_id` (`id`),
  KEY `idx_footer_config_name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

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
  `route` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `customer_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
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
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

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
  `mobile_no` bigint DEFAULT NULL,
  `cash` int DEFAULT NULL,
  `online` int DEFAULT NULL,
  `discount` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `added_by` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`p_id`),
  KEY `idx_payment_date` (`date`),
  KEY `idx_payment_to_account` (`to_account`),
  KEY `idx_payment_date_to_account` (`date`,`to_account`),
  KEY `idx_p_id` (`p_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

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
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

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
  `expenses` decimal(12,2) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `added_by` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_purchase_gadi_number` (`gadi_number`),
  KEY `idx_purchase_date` (`date`),
  KEY `idx_purchase_supplier_name` (`supplier_name`),
  KEY `idx_purchase_id` (`id`),
  KEY `idx_purchase_date_supplier` (`date`,`supplier_name`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

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
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

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
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

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
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

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
  PRIMARY KEY (`id`),
  KEY `idx_stock_purchase_id` (`purchase_id`),
  KEY `idx_stock_date` (`Date`),
  KEY `idx_stock_bata` (`Bata`),
  KEY `idx_stock_product_name` (`product_name`),
  KEY `idx_stock_gadi_number` (`gadi_number`),
  KEY `idx_stock_supplier_name` (`supplier_name`),
  KEY `idx_stock_filters` (`Date`,`Bata`,`product_name`,`gadi_number`,`supplier_name`,`purchase_id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `supplier_outstanding`
--

DROP TABLE IF EXISTS `supplier_outstanding`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `supplier_outstanding` (
  `id` int NOT NULL AUTO_INCREMENT,
  `supplier_name` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `remaining_paid` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_supplier_outstanding_id` (`id`),
  KEY `idx_supplier_name` (`supplier_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `test`
--

DROP TABLE IF EXISTS `test`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `test` (
  `id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

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
) ENGINE=InnoDB AUTO_INCREMENT=92 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `vehicle`
--

DROP TABLE IF EXISTS `vehicle`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vehicle` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `vehicle_no` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;


insert into skfruit.access_config(name,status) values('home','active'),('User','active'),('Product','active'),('Account','active'),('Route','active'),('Purchase','active'),('Sale','active'),('Vehicle','active'),('Barcode','active'),('Receipt','active'),('Payment','active'),('Purchase Report','active'),('Sale Report','active'),('Stock Report','active'),('Khatawani','active'),('Daily Report','active'),('Receipt Report','active'),('Ledger Report','active'),('Customer Outstanding','active'),('Supplier Outstanding','active'),('Carate Report','active'),('Remainder','active'),('Profit Loss Report','active'),('Supplier Ledger Report','active'),('Route Sale','active');

insert into skfruit.account_group_table(name,is_active) values('Worker',1),('Customer',1),('Supplier',1),('Bank Account',1);

insert into skfruit.footer_config(name,status) values('Home','active'),('Sale','active'),('Receipt','active'),('Payment','active'),('Route Sale','active');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-07-28 10:29:14sss
