-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 16, 2025 at 05:42 PM
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
(2, 'NongNat', 'Nanyang', 'K49', 'Dorm Sirinya', '1752679682829-479944407.jpg', 2, 'Disable', 'Homeless', '2025-06-13 09:35:29', '2025-07-16 15:28:02'),
(3, 'March', 'Zing', 'Cr1', 'Dorm Nat', '1752679688721-744153630.jpg', 3, 'Broken', 'Vehicle', '2025-06-16 07:55:27', '2025-07-16 15:28:08'),
(4, 'Laptop', 'CPU : AMD Ryzen AI 9 HX 375\r\nRAM : 32GB DDR5\r\nSSD : 1TB PCIe 4/NVMe M.2 SSD\r\nMONITOR : 16\" WQXGA (2560x1600) IPS 240Hz\r\nGPU : Nvidia GeForce RTX5080 16GB GDDR7', 'L1', 'MFU', '1752679696309-657351902.jpg', 3, 'Borrowing', 'Computer', '2025-06-16 09:04:20', '2025-07-16 15:28:29'),
(5, 'Olympus', 'Olympus EM5 Matk iii + lens kit 12-40mm', 'C1', 'MFU', 'olympus.jpg', 15, 'Available', 'Camera', '2025-06-16 20:30:14', '2025-07-15 07:54:36'),
(6, 'Projector Samsung', 'SP-LSP3BLAXXT\r\nResolution: 1920 x 1080\r\nScreen Size: 30~100\'\r\nBrightness (LED Lumen): 550 LED Lumen (Peak)\r\nAudio: Dolby Atmos', 'P1', 'MFU', 'projector.jpg', 15, 'Borrowing', 'Projector', '2025-06-18 08:29:45', '2025-07-16 14:54:43'),
(7, 'iPad', 'iPad Air M3 11 inch', 'iPD1', 'MFU', 'iPad.jpg', 15, 'Available', 'Mobile', '2025-06-18 08:55:37', '2025-07-16 05:37:40'),
(9, 'Calculator', 'เครื่องคิดเลข Casio FX-991EX สีชมพู', 'Cal1', 'MFU', '1752650914495-920467306.jpg', 20, 'Available', 'Calculator', '2025-07-16 07:04:38', '2025-07-16 07:28:34'),
(10, 'Power Strip', 'ปลั๊กพ่วง Toshino 5 ช่อง ยาว 3 เมตร มาตรฐาน มอก. รองรับไฟ, 2300 Watt 10A', 'PS1', 'MFU', '1752651182704-328780218.jpg', 20, 'Borrowing', '', '2025-07-16 07:33:02', '2025-07-16 14:54:41');

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
(7, 5, 'Approved', 'KPKurumi', '2025-06-18 14:46:50', 'Approved borrow request by Ssella'),
(8, 6, 'Approved', 'Norra', '2025-06-20 17:40:29', 'Approved borrow request by Ssella'),
(9, 2, 'Approved', 'August', '2025-06-20 17:54:51', 'Approved borrow request by Ssella');

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
(18, 'Mobile', '2025-06-18 08:55:29', '2025-06-18 08:55:29'),
(19, 'Calculator', '2025-07-16 07:04:20', '2025-07-16 07:04:20');

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
(34, 6, 'Ssella', '2025-06-20', '2025-06-22', 'Returned', 'Norra', NULL, 'ดูหนังเด็ดๆ', 'Out Site', '2025-06-20 10:40:00', '2025-06-20 10:55:23'),
(35, 2, 'Ssella', '2025-06-20', '2025-06-21', 'Returned', 'KP', 'mai hai', 'Request Rejected', 'In Site', '2025-06-20 10:51:03', '2025-06-20 10:55:32'),
(36, 2, 'Ssella', '2025-06-20', '2025-06-21', 'Returned', 'August', NULL, 'เดินจงกลม', 'In Site', '2025-06-20 10:52:47', '2025-06-20 10:55:32'),
(37, 3, 'Norra97', '2025-06-22', '2025-06-23', 'Returned', NULL, NULL, 'เนียนเข้าแก๊ง civic', 'In Site', '2025-06-21 17:58:34', '2025-06-21 18:03:49'),
(38, 2, 'Norra97', '2025-06-22', '2025-06-23', 'Returned', 'KPKurumi', NULL, 'ยืมตัวไปพูดฮั่นแน๊', 'In Site', '2025-06-21 18:04:12', '2025-06-26 10:26:39'),
(39, 4, 'Ssella', '2025-06-26', '2025-06-27', 'Returned', 'Norra97', NULL, 'ตัดงาน', 'Out Site', '2025-06-26 12:31:09', '2025-07-01 10:29:59'),
(40, 7, 'Ssella', '2025-07-15', '2025-07-14', 'Reject', 'Norra97', 'ไม่พร้อม', 'เล่นเกม', 'Out Site', '2025-07-14 07:08:49', '2025-07-14 07:10:08'),
(41, 3, 'Ssella', '2025-07-15', '2025-07-19', 'Returned', 'Norra97', NULL, 'จ๊วดๆค้าบ', 'Out Site', '2025-07-14 09:34:13', '2025-07-14 10:52:46'),
(42, 7, 'Ssella', '2025-07-15', '2025-07-14', 'Returned', 'Norra97', NULL, 'เล่นเกม', 'Out Site', '2025-07-14 10:41:05', '2025-07-14 10:52:47'),
(43, 2, 'Ssella', '2025-07-16', '2025-07-17', 'Returned', 'Norra97', NULL, 'ตัดหญ้า', 'In Site', '2025-07-14 10:49:11', '2025-07-14 10:52:48'),
(44, 3, 'Ssella', '2025-07-14', '2025-07-14', 'Returned', 'Norra97', NULL, 'ซิ่งๆค้าบ', 'Out Site', '2025-07-14 10:53:35', '2025-07-15 07:54:34'),
(45, 5, 'Ssella', '2025-07-14', '2025-07-16', 'Returned', 'Norra97', NULL, 'ถ่ายวิว', 'Out Site', '2025-07-14 10:58:11', '2025-07-15 07:54:36'),
(46, 7, 'Ssella', '2025-07-16', '2025-07-17', 'Returned', 'Norra97', NULL, 'ตีป้อมจ้า', 'Out Site', '2025-07-15 06:02:05', '2025-07-16 05:37:40'),
(47, 7, 'Kt', '2025-07-16', '2025-07-18', 'Returned', 'Norra97', NULL, 'เล่น grow a garden', 'Out Site', '2025-07-15 07:35:19', '2025-07-16 06:01:57'),
(48, 2, 'Nat', '2025-07-16', '2025-07-17', 'Returned', 'Norra97', NULL, 'พาตัวเองไปกินชาบู', 'Out Site', '2025-07-15 09:24:05', '2025-07-16 06:02:00'),
(49, 3, 'Nat', '2025-07-15', '2025-07-17', 'Reject', 'Norra97', 'ทดสอบระบบ', 'ขับไปกินหมูกระทะหน้าราดพัด', 'Out Site', '2025-07-15 09:29:35', '2025-07-15 09:33:23'),
(50, 6, 'Nat', '2025-07-15', '2025-07-16', 'Reject', 'Norra97', 'ทดสอบระบบ', 'ดูหนังจ้า', 'Out Site', '2025-07-15 09:31:43', '2025-07-15 09:33:28'),
(51, 5, 'Nat', '2025-07-15', '2025-07-19', 'Reject', 'Norra97', 'ทดสอบระบบ', 'ฝึกถ่ายรูป', 'Out Site', '2025-07-15 09:32:55', '2025-07-15 09:33:34'),
(52, 2, 'Ssella', '2025-07-15', '2025-07-16', 'Reject', 'Norra97', 'ขอนานๆกว่านี้', 'ขัดห้องน้ำ', 'Out Site', '2025-07-15 09:35:43', '2025-07-15 09:41:53'),
(53, 6, 'Ssella', '2025-07-16', '2025-07-17', 'Returned', 'Norra97', NULL, 'ดูละครคุณธรรม', 'Out Site', '2025-07-16 05:36:37', '2025-07-16 05:44:36'),
(54, 4, 'Ssella', '2025-07-16', '2025-07-26', 'Returned', 'Norra97', NULL, 'ตัดงาน Pr', 'Out Site', '2025-07-16 05:41:27', '2025-07-16 06:02:02'),
(55, 10, 'Kt', '2025-07-16', '2025-07-17', 'Approved', 'Norra97', NULL, 'เอาไปต่อดูหนัง', 'Out Site', '2025-07-16 07:54:49', '2025-07-16 14:54:41'),
(56, 6, 'Kt', '2025-07-16', '2025-07-17', 'Approved', 'Norra97', NULL, 'เอาไปดูหนัง', 'Out Site', '2025-07-16 07:55:00', '2025-07-16 14:54:43'),
(57, 4, 'Ssella', '2025-07-16', '2025-07-19', 'RePending', 'Norra97', 'เทส', 'ดูซีรีส์', 'Out Site', '2025-07-16 14:56:19', '2025-07-16 15:30:00'),
(58, 4, 'Ssella', '2025-07-16', '2025-07-18', 'RePending', 'Norra97', 'Other', 'ดูละครไทย', 'Out Site', '2025-07-16 15:04:39', '2025-07-16 15:24:51'),
(59, 4, 'Ssella', '2025-07-16', '2025-07-24', 'Returned', 'Norra97', 'เช็คอีกรอบครับ', 'เทสระบบ', 'Out Site', '2025-07-16 15:16:03', '2025-07-16 15:25:26'),
(60, 4, 'Ssella', '2025-07-16', '2025-07-26', 'RePending', 'Norra97', 'Missing equipment', 'เทส', 'Out Site', '2025-07-16 15:27:32', '2025-07-16 15:34:19');

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
  `useremail` varchar(255) NOT NULL,
  `google_id` varchar(64) DEFAULT NULL,
  `picture` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`userid`, `username`, `password`, `role`, `phonenum`, `department`, `useremail`, `google_id`, `picture`) VALUES
(14, 'Norra97', '$2b$10$mi9U/yqATUaVmC7tyoMgQuMHK2tbw.o0li7ARCFbopN5Z8kgeYqqm', 2, '0647424652', 'สำนักวิชาเทคโนโลยีดิจิทัลประยุกต์', '6531501064@lamduan.mfu.ac.th', '101908288636754790514', '/images/google_14.jpg'),
(15, 'Kt', '$2b$10$Cf3MR/4If4Bo6oLQPxe2VuI60R3P9sZkr0OzPRDd3NQhyNGbyWf5q', 1, '0886072800', 'สำนักวิชานิติศาสตร์', '6531205025@lamduan.mfu.ac.th', NULL, NULL),
(17, 'Nat', '$2b$10$NwS5RMMMqZwOye3XWgVRS.V2nahpS9gsC9O0e8yR00zNXVIch/DIu', 1, '0910070761', 'สำนักวิชาอุตสาหกรรมเกษตร', '6531501146@lamduan.mfu.ac.th', NULL, NULL),
(18, 'adm1', '$2b$10$p3iAZj7iVqs7q7b8BM3xM.W0eNp7S2WhYg9wVSCSoHcwx4DtVjCpG', 2, '0878788891', 'ศูนย์เทคโนโลยีสารสนเทศ', '9931501064@lamduan.mfu.ac.th', NULL, NULL),
(19, 'Norrax', '$2b$10$/W576T0Mt0UMF/Khf9ymQeW4tixvMzUv9w8KP2VvEZ7zYB6iauQFS', 1, '0888888888', 'ศูนย์เทคโนโลยีสารสนเทศ', '6987654321@lamduan.mfu.ac.th', NULL, NULL),
(24, 'Ssella', '$2b$10$4oKvXOk9IfRH0YZAZykmPOPxEEbORyfgcoRBXyAQrYaIGjRgxWgHq', 1, '0932744094', 'สำนักวิชาการจัดการ', '6531205024@lamduan.mfu.ac.th', NULL, NULL),
(25, 'awm', '$2b$10$I6Kp2Qe1NojncpDkWnuVLOKfSi9Edc..Nbbi/7mGs7aB/FLS4kO5i', 3, '0888899988', 'ส่วนการเงินและบัญชี', '6631501064@lamduan.mfu.ac.th', NULL, NULL),
(27, 'Naruto', '$2b$10$dW5Utdpj8ecYIzr7K9Qei.93psPyYhLKidVgrOBuPa7T0Boy1S6A2', 3, '0909854765', 'ศูนย์เทคโนโลยีสารสนเทศ', '6731501064@lamduan.mfu.ac.th', NULL, NULL),
(54, 'Norraphat Jantawong', '', 1, 'external', 'external', 'norraphat1196@gmail.com', '110077719172909518902', '/images/google_54.jpg');

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
  MODIFY `Assetid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `assethistory`
--
ALTER TABLE `assethistory`
  MODIFY `HistoryID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `asset_type`
--
ALTER TABLE `asset_type`
  MODIFY `asset_type_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `borrowreq`
--
ALTER TABLE `borrowreq`
  MODIFY `Reqid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=61;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `userid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=55;

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
