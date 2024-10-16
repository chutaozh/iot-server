-- iot_db.iot_user definition

CREATE TABLE `iot_user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_name` varchar(16) NOT NULL,
  `account` varchar(16) NOT NULL,
  `password` varchar(256) NOT NULL,
  `status` int NOT NULL COMMENT '0：禁用，1：启用',
  `update_id` int NOT NULL,
  `update_time` datetime NOT NULL,
  `create_id` int NOT NULL,
  `create_time` datetime NOT NULL,
  `is_del` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1000 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO iot_db.iot_user
(user_name, account, password, status, update_id, update_time, create_id, create_time, is_del)
VALUES('系统管理员', 'admin', '0192023a7bbd73250516f069df18b500', 1, 0, NOW(), 0, NOW(), 0);