CREATE TABLE IF NOT EXISTS `BorrowReq` (
  `Reqid` int(11) NOT NULL AUTO_INCREMENT,
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
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`Reqid`),
  KEY `Assetid` (`Assetid`),
  CONSTRAINT `BorrowReq_ibfk_1` FOREIGN KEY (`Assetid`) REFERENCES `Asset` (`Assetid`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci; 