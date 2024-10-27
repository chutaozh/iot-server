-- iot_db.iot_address_province definition

CREATE TABLE `iot_address_province` (
  `id` mediumint unsigned NOT NULL,
  `name` varchar(30) NOT NULL DEFAULT '' COMMENT '省份名称',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COMMENT='省份表';




INSERT INTO iot_db.iot_address_province (id,name) VALUES
	 (1,'北京市'),
	 (2,'上海市'),
	 (3,'天津市'),
	 (4,'重庆市'),
	 (5,'河北省'),
	 (6,'山西省'),
	 (7,'河南省'),
	 (8,'辽宁省'),
	 (9,'吉林省'),
	 (10,'黑龙江省');
INSERT INTO iot_db.iot_address_province (id,name) VALUES
	 (11,'内蒙古省'),
	 (12,'江苏省'),
	 (13,'山东省'),
	 (14,'安徽省'),
	 (15,'浙江省'),
	 (16,'福建省'),
	 (17,'湖北省'),
	 (18,'湖南省'),
	 (19,'广东省'),
	 (20,'广西省');
INSERT INTO iot_db.iot_address_province (id,name) VALUES
	 (21,'江西省'),
	 (22,'四川省'),
	 (23,'海南省'),
	 (24,'贵州省'),
	 (25,'云南省'),
	 (26,'西藏省'),
	 (27,'陕西'),
	 (28,'甘肃省'),
	 (29,'青海省'),
	 (30,'宁夏省');
INSERT INTO iot_db.iot_address_province (id,name) VALUES
	 (31,'新疆省'),
	 (32,'台湾省'),
	 (52993,'港澳特别行政区');
