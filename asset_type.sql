-- สร้างตาราง asset_type
CREATE TABLE IF NOT EXISTS `asset_type` (
    `asset_type_id` INT AUTO_INCREMENT PRIMARY KEY,
    `asset_type_name` VARCHAR(100) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- เพิ่มข้อมูลเริ่มต้น (ถ้าต้องการ)
INSERT INTO `asset_type` (`asset_type_name`) VALUES 
('Computer'),
('Printer'),
('Projector'),
('Camera'),
('Audio Equipment'); 