-- iot_db.iot_role definition

CREATE TABLE `iot_role` (
  `id` int NOT NULL AUTO_INCREMENT,
  `role_type` int NOT NULL DEFAULT '3' COMMENT '1：系统管理员，2：管理员，3：普通用户',
  `role_name` varchar(16) NOT NULL,
  `remark` varchar(256) DEFAULT NULL,
  `update_id` int NOT NULL,
  `update_time` datetime NOT NULL,
  `create_id` int NOT NULL,
  `create_time` datetime NOT NULL,
  `is_del` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1000 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;