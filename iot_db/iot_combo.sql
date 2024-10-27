-- iot_db.iot_combo definition

CREATE TABLE `iot_combo` (
  `id` int NOT NULL AUTO_INCREMENT,
  `combo_no` varchar(16) NOT NULL,
  `combo_name` varchar(128) NOT NULL,
  `combo_period` int NOT NULL,
  `combo_capacity` int NOT NULL,
  `combo_type` int NOT NULL COMMENT '1：流量包，2：短信包',
  `standard_tariff` decimal(10,2) NOT NULL,
  `sales_price` decimal(10,2) NOT NULL,
  `status` int NOT NULL COMMENT '0：待定，1：上架，2：下架',
  `remark` varchar(512) DEFAULT NULL,
  `update_id` int NOT NULL,
  `update_time` datetime NOT NULL,
  `create_id` int NOT NULL,
  `create_time` datetime NOT NULL,
  `is_del` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1000 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


INSERT INTO iot_db.iot_combo
(id, combo_no, combo_name, combo_period, combo_capacity, combo_type, standard_tariff, sales_price, status, remark, update_id, update_time, create_id, create_time, is_del)
VALUES(1000, 'TC202410250001', '联通-10G年卡', 360, 10240, 1, 10.00, 15.00, 1, '联通年卡套餐10G', 1000, '2024-10-25 23:39:03', 1000, '2024-10-25 23:39:03', '0');
INSERT INTO iot_db.iot_combo
(id, combo_no, combo_name, combo_period, combo_capacity, combo_type, standard_tariff, sales_price, status, remark, update_id, update_time, create_id, create_time, is_del)
VALUES(1001, 'TC202410250002', '电信-100G月卡', 30, 102400, 1, 9.99, 16.99, 1, '电信月卡套餐100G', 1000, '2024-10-25 23:42:44', 1000, '2024-10-25 23:42:44', '0');