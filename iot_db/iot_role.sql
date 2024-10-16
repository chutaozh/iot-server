-- iot_db.iot_role definition

CREATE TABLE `iot_role` (
  `id` int NOT NULL AUTO_INCREMENT,
  `role_name` varchar(16) NOT NULL,
  `remark` varchar(256) DEFAULT NULL,
  `update_id` int NOT NULL,
  `update_time` datetime NOT NULL,
  `create_id` int NOT NULL,
  `create_time` datetime NOT NULL,
  `is_del` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1000 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;