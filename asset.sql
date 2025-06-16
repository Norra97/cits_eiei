-- ลบตารางเก่า (ถ้ามี)
DROP TABLE IF EXISTS `asset`;

-- สร้างตาราง asset ใหม่
CREATE TABLE `asset` (
    `Assetid` INT AUTO_INCREMENT PRIMARY KEY,
    `Assetname` VARCHAR(100) NOT NULL,
    `Assetdetail` TEXT,
    `Assetcode` VARCHAR(50) NOT NULL,
    `Assetlocation` VARCHAR(100) NOT NULL,
    `Assetimg` VARCHAR(255),
    `Staffaddid` INT NOT NULL,
    `Assetstatus` VARCHAR(20) NOT NULL DEFAULT 'Available',
    `Assettype` VARCHAR(100) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`Staffaddid`) REFERENCES `user`(`userid`),
    FOREIGN KEY (`Assettype`) REFERENCES `asset_type`(`asset_type_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci; 