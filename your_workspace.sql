-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: localhost    Database: your_workspace
-- ------------------------------------------------------
-- Server version	8.0.36

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
-- Table structure for table `quotes`
--

DROP TABLE IF EXISTS `quotes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `quotes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `quote` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `quotes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quotes`
--

LOCK TABLES `quotes` WRITE;
/*!40000 ALTER TABLE `quotes` DISABLE KEYS */;
INSERT INTO `quotes` VALUES (10,59,'It?s not whether you get knocked down, it?s whether you get up.','2025-06-28 18:19:04'),(11,60,'It?s not whether you get knocked down, it?s whether you get up.','2025-06-28 18:19:04'),(12,48,'Success is not in what you have, but who you are.','2025-06-28 18:19:04'),(13,57,'Do something today that your future self will thank you for.','2025-06-28 18:19:04'),(14,47,'Don?t let yesterday take up too much of today.','2025-06-28 18:19:04'),(15,46,'Success is not in what you have, but who you are.','2025-06-28 18:19:04'),(16,42,'The best way to get started is to quit talking and begin doing.','2025-06-28 18:19:04'),(17,40,'Great things never come from comfort zones.','2025-06-28 18:19:04'),(25,62,'heyyy work hard u got this','2025-06-29 07:45:22');
/*!40000 ALTER TABLE `quotes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=63 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (40,'Vedant','vedant.gode@gmail.com','cac2d8a2f1d0bbe6b2e2ad03fab2622622ecd302b2f0dbccaf842b121f7d4f2a'),(42,'Shama','shama.gode@gmail.com','2992fab6439dcce48f9c47a4dc3f394c7f40d0c3e2d651a1e1bb3aeba7d0bce9'),(46,'Jyoti','jyoti.gode@gmail.com','c81df62902ac189de7827c73de108c84b6650d0c2121aca56c58a131bea41a42'),(47,'hello_kitty','hello.kitty@gmail.com','99f2bdf9942653ab32d9dfa0b43c72c3fbbb9679450fd965c590c224897b848a'),(48,'Dinesh ','dinesh.gode@gmail.com','eefc46820490f50d789f77ce9c689b064de5b199a72f63c24b0ed4c55dac3495'),(57,'Disha','disha.gode@gmail.com','7e20f1bec8e925fa6eedba18f9d0c7ede9c3e9929e44917303c06197198dca9f'),(59,'a','a@gmail.com','e351959bb58dfbb89901bf27c4657a616b9ce7d782a702df1bd3c4ac8dd3f9ba'),(60,'d','d@gmail.com','cac2d8a2f1d0bbe6b2e2ad03fab2622622ecd302b2f0dbccaf842b121f7d4f2a'),(61,'Ved','ved@gmail.com','823f73713b2f3a2a2ab7eeb63d264988feea0e2108a673cbf3b36cc03a88c404'),(62,'DJ','DJ@gmail.com','a3651eb64659de31a242460d1445e64b2712719496eca6a0d324173557059115');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-29 19:09:01
