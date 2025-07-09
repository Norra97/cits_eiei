-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jul 08, 2025 at 05:30 PM
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
-- Database: `pro`
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
(2, 'NongNat', 'Nanyang', 'K49', 'Dorm Sirinya', '1749807328999.jpg', 2, 'Available', 'Homeless', '2025-06-13 09:35:29', '2025-07-02 14:10:47'),
(3, 'March', 'Zing', 'Cr1', 'Dorm Nat', '1750060527474.jpg', 3, 'Available', 'Vehicle', '2025-06-16 07:55:27', '2025-06-20 15:08:07'),
(4, 'Laptop', 'CPU : AMD Ryzen AI 9 HX 375\r\nRAM : 32GB DDR5\r\nSSD : 1TB PCIe 4/NVMe M.2 SSD\r\nMONITOR : 16\" WQXGA (2560x1600) IPS 240Hz\r\nGPU : Nvidia GeForce RTX5080 16GB GDDR7', 'L1', 'MFU', '1750064660723.jpg', 3, 'Available', 'Computer', '2025-06-16 09:04:20', '2025-07-02 14:05:32'),
(5, 'Olympus', 'Olympus EM5 Matk iii + lens kit 12-40mm', 'C1', 'MFU', '1750105814178.jpg', 15, 'Available', 'Camera', '2025-06-16 20:30:14', '2025-06-18 08:09:14'),
(6, 'Projector Samsung', 'SP-LSP3BLAXXT\r\nResolution: 1920 x 1080\r\nScreen Size: 30~100\'\r\nBrightness (LED Lumen): 550 LED Lumen (Peak)\r\nAudio: Dolby Atmos', 'P1', 'MFU', '1750235385363.png', 15, 'Available', 'Projector', '2025-06-18 08:29:45', '2025-06-18 08:29:45'),
(7, 'iPad', 'iPad Air M3 11 inch', 'iPD1', 'MFU', '1750236937156.png', 15, 'Available', 'Mobile', '2025-06-18 08:55:37', '2025-06-18 08:55:37');

-- --------------------------------------------------------

--
-- Table structure for table `assethistory`
--

CREATE TABLE `assethistory` (
  `HistoryID` int(11) NOT NULL,
  `Assetid` int(11) NOT NULL,
  `Action` varchar(50) NOT NULL,
  `ActionBy` varchar(100) NOT NULL,
  `ActionDate` datetime NOT NULL,
  `Details` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `assethistory`
--

INSERT INTO `assethistory` (`HistoryID`, `Assetid`, `Action`, `ActionBy`, `ActionDate`, `Details`) VALUES
(1, 4, 'Approved', 'Ssella', '2025-06-17 03:05:25', 'Approved borrow request by Ssella'),
(2, 4, 'Rejected', 'Nat', '2025-06-17 03:18:29', 'Request rejected by Nat'),
(3, 5, 'Approved', 'Ssella', '2025-06-17 03:57:12', 'Approved borrow request by Ssella'),
(4, 2, 'Approved', 'Ssella', '2025-06-17 03:57:59', 'Approved borrow request by Ssella'),
(5, 3, 'Approved', 'JingJok', '2025-06-17 03:59:37', 'Approved borrow request by Ssella'),
(6, 2, 'Approved', 'Norra97', '2025-06-18 14:18:35', 'Approved borrow request by Ssella'),
(7, 5, 'Approved', 'KPKurumi', '2025-06-18 14:46:50', 'Approved borrow request by Ssella');

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
(1, 'Computer', '2025-06-13 08:39:05', '2025-06-14 14:37:36'),
(2, 'Printer', '2025-06-13 08:39:05', '2025-06-14 14:37:39'),
(3, 'Projector', '2025-06-13 08:39:05', '2025-06-14 14:37:42'),
(4, 'Camera', '2025-06-13 08:39:05', '2025-06-14 14:37:45'),
(5, 'Audio Equipment', '2025-06-13 08:39:05', '2025-06-14 14:37:47'),
(6, 'Homeless', '2025-06-14 14:37:02', '2025-06-14 14:37:49'),
(7, 'Vehicle', '2025-06-16 07:55:15', '2025-06-16 09:56:39'),
(18, 'Mobile', '2025-06-18 08:55:29', '2025-06-18 08:55:29');

-- --------------------------------------------------------

--
-- Table structure for table `borrowreq`
--

CREATE TABLE `borrowreq` (
  `Reqid` int(11) NOT NULL,
  `Assetid` int(11) NOT NULL,
  `Borrowname` varchar(255) NOT NULL,
  `Borrowdate` date NOT NULL,
  `ReturnDate` date NOT NULL,
  `Status` enum('Pending','Approved','Reject','RePending','Returned') NOT NULL DEFAULT 'Pending',
  `lectname` varchar(255) DEFAULT NULL,
  `Comment` text DEFAULT NULL,
  `Activity` text DEFAULT NULL,
  `UsageType` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `borrowreq`
--

INSERT INTO `borrowreq` (`Reqid`, `Assetid`, `Borrowname`, `Borrowdate`, `ReturnDate`, `Status`, `lectname`, `Comment`, `Activity`, `UsageType`, `created_at`, `updated_at`) VALUES
(13, 3, 'Ssella', '2025-06-17', '2025-06-22', 'Returned', 'Norrax', NULL, 'ซิ่งจ๊วด', 'Out Site', '2025-06-16 19:20:17', '2025-06-16 19:48:22'),
(14, 4, 'Ssella', '2025-06-17', '2025-06-30', 'Returned', 'Ssella', NULL, 'เล่นวาโร', 'Out Site', '2025-06-16 19:48:44', '2025-06-16 20:06:38'),
(19, 4, 'Ssella', '2025-06-17', '2025-06-18', 'Reject', 'Nat', NULL, 'เล่นเกม', 'In Site', '2025-06-16 20:14:14', '2025-06-16 20:18:29'),
(20, 2, 'Ssella', '2025-06-17', '2025-06-23', 'Returned', 'August', NULL, 'Request Rejected', 'In Site', '2025-06-16 20:20:35', '2025-06-16 20:58:31'),
(21, 2, 'Ssella', '2025-06-17', '2025-06-24', 'Returned', 'KP', 'เอาไปตัดหญ้าดีกว่าครับ', 'Request Rejected', 'In Site', '2025-06-16 20:22:36', '2025-06-16 20:58:31'),
(28, 5, 'Ssella', '2025-06-17', '2025-06-18', 'Returned', 'Ssella', NULL, 'ถ่ายสาว', 'Out Site', '2025-06-16 20:56:54', '2025-06-16 20:57:38'),
(29, 2, 'Ssella', '2025-06-17', '2025-06-18', 'Returned', 'Ssella', NULL, 'พาคนแก่ข้ามถนน', 'In Site', '2025-06-16 20:57:55', '2025-06-16 20:58:31'),
(30, 3, 'Ssella', '2025-06-17', '2025-06-19', 'Returned', 'JingJok', NULL, 'จ๊วดในมอ', 'In Site', '2025-06-16 20:59:18', '2025-06-16 21:00:00'),
(31, 2, 'Ssella', '2025-06-18', '2025-06-20', 'Returned', 'Norra97', NULL, 'เลี้ยงแมว', 'Out Site', '2025-06-18 07:18:17', '2025-06-18 07:28:24'),
(32, 3, 'Ssella', '2025-06-18', '2025-06-19', 'Reject', 'น้องนัด', 'ไม่ให้ครับ รถจะพังแล้ว', 'Request Rejected', 'Out Site', '2025-06-18 07:34:47', '2025-06-18 07:35:11'),
(33, 5, 'Ssella', '2025-06-18', '2025-06-20', 'Returned', 'KPKurumi', NULL, 'ถ่ายวิว', 'Out Site', '2025-06-18 07:44:59', '2025-06-18 08:09:14'),
(38, 5, 'Nat', '2025-06-20', '2025-06-24', 'Reject', 'adm1', 'ไม่ให้', 'wow', 'In Site', '2025-06-20 14:09:05', '2025-06-20 14:09:35'),
(39, 3, 'Nat', '2025-06-20', '2025-06-30', 'Returned', NULL, NULL, 'go to big C', 'Out Site', '2025-06-20 14:15:48', '2025-06-20 14:47:44'),
(40, 3, 'Nat', '2025-06-21', '2025-06-30', 'Returned', NULL, NULL, 'ซิ่ง', 'Out Site', '2025-06-20 14:52:33', '2025-06-20 14:53:36'),
(41, 3, 'Nat', '2025-06-28', '2025-06-30', 'Returned', NULL, NULL, 'หนีไก่', 'Out Site', '2025-06-20 14:56:53', '2025-06-20 15:05:58'),
(42, 3, 'Nat', '2025-06-21', '2025-06-24', 'Returned', NULL, NULL, 'hop', 'In Site', '2025-06-20 15:00:20', '2025-06-20 15:01:02'),
(43, 3, 'Nat', '2025-06-25', '2025-06-30', 'Approved', NULL, NULL, 'ad', 'In Site', '2025-06-22 20:00:01', '2025-06-22 20:01:06'),
(44, 2, 'Nat', '2025-06-23', '2025-06-25', 'Reject', 'adm1', 'ไม่ให้หรอก', 'ตัดหญ่า', 'In Site', '2025-06-23 08:06:36', '2025-06-23 08:28:20'),
(45, 3, 'Nat', '2025-06-24', '2025-06-23', 'Approved', NULL, NULL, 'ซิ่ง', 'Out Site', '2025-06-23 08:07:27', '2025-06-23 08:25:55');

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
(14, 'Norra97', '$2b$10$jY5tib74n6saJC0F5Qz.huy6HiGAWuyxS/QmKm6PcIxbxZNtGNJAC', 1, '0647424652', 'สำนักวิชาเทคโนโลยีดิจิทัลประยุกต์', '6531501064@lamduan.mfu.ac.th'),
(15, 'Ssella', '$2b$10$0Kg9ZbpvLNdcZ28pMMhGEecYbNG3uiLA/oWdY7GCSLJJs6Ln6Lxf.', 1, '0932744094', 'สำนักวิชาการจัดการ', '6531205024@lamduan.mfu.ac.th'),
(16, 'Naruto', '$2b$10$SzyReSRfVPGed77uQzbxpeRmajbz7YzKjag8LjvgFxpntwqJD5rLS', 3, '0898765432', 'สำนักวิชาทันตแพทยศาสตร์', '6531501068@lamduan.mfu.ac.th'),
(17, 'Nat', '$2b$10$BLzsICfRs3jR03ogKw8Km.c3ZhYcZ2ENFdi2O1ecSlwPgidNEPToG', 1, '09111827461', 'สำนักวิชาศิลปศาสตร์', '6571234416@lamduan.mfu.ac.th'),
(18, 'adm1', '$2b$10$XBbAcI8169cUDFYowGPqouktmAJZSJtykqYdrsDH.HQ5CkeBCgQHG', 2, '9835517254', 'สำนักวิชาศิลปศาสตร์', '6514231745@lamduan.mfu.ac.th'),
(19, 'adm2', '$2b$10$bn4VXtsJFXJVmS/HrfYJPeLLsFcewT9Xm4Wj.sQtQQr6pf11Nld86', 3, '90817748281', 'สำนักวิชาศิลปศาสตร์', '0736182236@lamduan.mfu.ac.th'),
(20, 'Mar', '$2b$10$nPjlvvmntuIaqXG7qfGiXeLlG7ZRBViE7q.dne5RdvmuZYu.JZUh6', 1, '0974462518', 'สำนักวิชาพยาบาลศาสตร์', '6531648725@lamduan.mfu.ac.th');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `asset`
--
ALTER TABLE `asset`
  ADD PRIMARY KEY (`Assetid`);

--
-- Indexes for table `assethistory`
--
ALTER TABLE `assethistory`
  ADD PRIMARY KEY (`HistoryID`),
  ADD KEY `Assetid` (`Assetid`);

--
-- Indexes for table `asset_type`
--
ALTER TABLE `asset_type`
  ADD PRIMARY KEY (`asset_type_id`);

--
-- Indexes for table `borrowreq`
--
ALTER TABLE `borrowreq`
  ADD PRIMARY KEY (`Reqid`),
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
  MODIFY `Assetid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `assethistory`
--
ALTER TABLE `assethistory`
  MODIFY `HistoryID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `asset_type`
--
ALTER TABLE `asset_type`
  MODIFY `asset_type_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `borrowreq`
--
ALTER TABLE `borrowreq`
  MODIFY `Reqid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `userid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `assethistory`
--
ALTER TABLE `assethistory`
  ADD CONSTRAINT `assethistory_ibfk_1` FOREIGN KEY (`Assetid`) REFERENCES `asset` (`Assetid`);

--
-- Constraints for table `borrowreq`
--
ALTER TABLE `borrowreq`
  ADD CONSTRAINT `BorrowReq_ibfk_1` FOREIGN KEY (`Assetid`) REFERENCES `asset` (`Assetid`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
