-- iot_db.iot_log definition

CREATE TABLE `iot_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `log_type` int NOT NULL COMMENT '1：登录日志，2: 操作日志，3：错误日志',
  `log_info` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `log_source` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `create_id` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `create_time` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1000 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;