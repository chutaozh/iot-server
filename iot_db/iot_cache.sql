-- iot_db.iot_cache definition

CREATE TABLE `iot_cache` (
  `id` varchar(100) NOT NULL,
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `cache_type` int NOT NULL COMMENT '1：验证码，2：token',
  `create_time` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;