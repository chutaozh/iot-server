-- iot_db.iot_client definition

CREATE TABLE `iot_client` (
  `id` int NOT NULL AUTO_INCREMENT,
  `client_no` varchar(16) NOT NULL,
  `client_name` varchar(128) NOT NULL,
  `client_type` int NOT NULL COMMENT '1: 个人客户，2：企业客户',
  `contact` varchar(32) NOT NULL,
  `contact_phone` varchar(11) NOT NULL,
  `contact_province` int DEFAULT NULL,
  `contact_city` int DEFAULT NULL,
  `contact_area` int DEFAULT NULL,
  `contact_street` int DEFAULT NULL,
  `contact_address` varchar(256) DEFAULT NULL,
  `salesman` int NOT NULL,
  `update_id` int NOT NULL,
  `update_time` datetime NOT NULL,
  `create_id` int NOT NULL,
  `create_time` datetime NOT NULL,
  `is_del` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1000 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO iot_db.iot_client
(id, client_no, client_name, client_type, contact, contact_phone, contact_province, contact_city, contact_area, contact_street, contact_address, salesman, update_id, update_time, create_id, create_time, is_del)
VALUES(1000, 'C202410270001', '广州市前端科技有限公司', 2, '张三', '18712345679', 19, 1601, 3633, 63247, '中山路128号', 1000, 1000, '2024-10-27 19:35:23', 1000, '2024-10-27 19:04:50', 0);