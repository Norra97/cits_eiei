-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 16, 2025 at 10:47 AM
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
(2, 'NongNat', 'Nanyang', '49', 'Dorm Sirinya', '1749807328999.jpg', 2, 'Available', 'Homeless', '2025-06-13 09:35:29', '2025-06-16 08:22:39'),
(3, 'March', 'Zing', '2011', 'Dorm Nat', '1750060527474.jpg', 3, 'Available', 'Vehicle', '2025-06-16 07:55:27', '2025-06-16 08:01:15');

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
(17, 'Vehicle', '2025-06-16 07:55:15', '2025-06-16 07:55:15');

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
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `borrowreq`
--

INSERT INTO `borrowreq` (`Reqid`, `Assetid`, `Borrowname`, `Borrowdate`, `ReturnDate`, `Status`, `lectname`, `Comment`, `created_at`, `updated_at`) VALUES
(1, 2, 'Norra97', '2025-06-16', '2025-06-19', 'Returned', 'Ssella', NULL, '2025-06-16 07:24:26', '2025-06-16 07:39:02'),
(2, 2, 'Ssella', '2025-06-20', '2025-06-21', 'Returned', 'Norrax', NULL, '2025-06-16 07:37:47', '2025-06-16 07:39:02'),
(6, 2, 'Ssella', '2025-06-16', '2025-06-23', 'Returned', 'Ssella', NULL, '2025-06-16 08:11:02', '2025-06-16 08:22:39');

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
(1, 'Nat', '12345', 1, '0910070761', 'IT', '6531501146@lamduan.mfu.ac.th'),
(2, 'Norra97', '254609', 2, '0647424652', 'IT', '6531501064@lamduan.mfu.ac.th'),
(3, 'Ssella', '22122546', 3, '0932744094', 'สำนักวิชาการจัดการ', '6531205024@lamduan.mfu.ac.th');

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
  MODIFY `Assetid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `asset_type`
--
ALTER TABLE `asset_type`
  MODIFY `asset_type_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `borrowreq`
--
ALTER TABLE `borrowreq`
  MODIFY `Reqid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `userid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `borrowreq`
--
ALTER TABLE `borrowreq`
  ADD CONSTRAINT `BorrowReq_ibfk_1` FOREIGN KEY (`Assetid`) REFERENCES `asset` (`Assetid`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
