-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jun 13, 2025 at 11:47 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `Pro`
--

-- --------------------------------------------------------

--
-- Table structure for table `asset`
--

CREATE TABLE `asset` (
  `Assetid` int(11) NOT NULL,
  `Assetname` varchar(100) NOT NULL,
  `Assetdetail` text DEFAULT NULL,
  `Assetcode` varchar(50) NOT NULL,
  `Assetlocation` varchar(100) NOT NULL,
  `Assetimg` varchar(255) DEFAULT NULL,
  `Staffaddid` int(11) NOT NULL,
  `Assetstatus` varchar(20) NOT NULL DEFAULT 'Available',
  `Assettype` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `asset`
--

INSERT INTO `asset` (`Assetid`, `Assetname`, `Assetdetail`, `Assetcode`, `Assetlocation`, `Assetimg`, `Staffaddid`, `Assetstatus`, `Assettype`, `created_at`, `updated_at`) VALUES
(2, 'CPU', 'I8', '2', 'C5', '1749807328999.jpg', 2, 'Available', 'Computer', '2025-06-13 09:35:29', '2025-06-13 09:35:29');

-- --------------------------------------------------------

--
-- Table structure for table `asset_type`
--

CREATE TABLE `asset_type` (
  `asset_type_id` int(11) NOT NULL,
  `asset_type_name` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `asset_type`
--

INSERT INTO `asset_type` (`asset_type_id`, `asset_type_name`, `created_at`, `updated_at`) VALUES
(6, 'Computer', '2025-06-13 08:39:05', '2025-06-13 08:39:05'),
(7, 'Printer', '2025-06-13 08:39:05', '2025-06-13 08:39:05'),
(8, 'Projector', '2025-06-13 08:39:05', '2025-06-13 08:39:05'),
(9, 'Camera', '2025-06-13 08:39:05', '2025-06-13 08:39:05'),
(10, 'Audio Equipment', '2025-06-13 08:39:05', '2025-06-13 08:39:05'),
(11, 'คอมพิวเตอร์', '2025-06-13 09:25:54', '2025-06-13 09:25:54'),
(12, 'เครื่องพิมพ์', '2025-06-13 09:25:54', '2025-06-13 09:25:54'),
(13, 'เฟอร์นิเจอร์', '2025-06-13 09:25:54', '2025-06-13 09:25:54'),
(14, 'อุปกรณ์สำนักงาน', '2025-06-13 09:25:54', '2025-06-13 09:25:54'),
(15, 'อุปกรณ์อิเล็กทรอนิกส์', '2025-06-13 09:25:54', '2025-06-13 09:25:54');

-- --------------------------------------------------------

--
-- Table structure for table `BorrowReq`
--

CREATE TABLE `BorrowReq` (
  `BorrowReqId` int(11) NOT NULL,
  `Assetid` int(11) DEFAULT NULL,
  `Borrowdate` date DEFAULT NULL,
  `ReturnDate` date DEFAULT NULL,
  `lectname` varchar(255) DEFAULT NULL,
  `Borrowname` varchar(255) DEFAULT NULL,
  `Status` enum('Pending','RePending','Approved','Disapproved','Reject','Returned') DEFAULT 'Pending',
  `comment` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `userid` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` int(11) NOT NULL,
  `phonenum` varchar(20) DEFAULT NULL,
  `department` varchar(255) DEFAULT NULL,
  `useremail` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`userid`, `username`, `password`, `role`, `phonenum`, `department`, `useremail`) VALUES
(1, 'Nat', '12345', 1, '09999999999', 'สำนักวิชาศิลปศาสตร์', '6531501146@lamduan.mfu.ac.th'),
(2, 'adm1', '12345', 2, '0911111111111', 'ศูนย์เครื่องมือวิทยาศาสตร์และเทคโนโลยี', '6531501148@lamduan.mfu.ac.th'),
(4, 'adm2', '12345', 3, '0911111111111', 'ศูนย์เครื่องมือวิทยาศาสตร์และเทคโนโลยี', '6531501149@lamduan.mfu.ac.th'),
(5, 'Nim', '12345', 1, '0987654321', 'สำนักวิชาจีนวิทยา', '6531501123@lamduan.mfu.ac.th'),
(6, 'Nig', '12345', 1, '091111111', 'สำนักวิชาศิลปศาสตร์', '6531501111@lamduan.mfu.ac.th');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `asset`
--
ALTER TABLE `asset`
  ADD PRIMARY KEY (`Assetid`);

--
-- Indexes for table `asset_type`
--
ALTER TABLE `asset_type`
  ADD PRIMARY KEY (`asset_type_id`);

--
-- Indexes for table `BorrowReq`
--
ALTER TABLE `BorrowReq`
  ADD PRIMARY KEY (`BorrowReqId`),
  ADD KEY `Assetid` (`Assetid`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`userid`),
  ADD UNIQUE KEY `useremail` (`useremail`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `asset`
--
ALTER TABLE `asset`
  MODIFY `Assetid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `asset_type`
--
ALTER TABLE `asset_type`
  MODIFY `asset_type_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `BorrowReq`
--
ALTER TABLE `BorrowReq`
  MODIFY `BorrowReqId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `userid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `BorrowReq`
--
ALTER TABLE `BorrowReq`
  ADD CONSTRAINT `borrowreq_ibfk_1` FOREIGN KEY (`Assetid`) REFERENCES `Asset` (`Assetid`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
