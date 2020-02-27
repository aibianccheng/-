CREATE TABLE `product_info` (
	`product_id` VARCHAR ( 32 ) NOT NULL,
	`product_name` VARCHAR ( 64 ) NOT NULL COMMENT '商品名称',
	`product_price` DECIMAL ( 8,2 ) NOT NULL COMMENT '商品价格',
	`product_price` DECIMAL ( 8,2 ) NOT NULL COMMENT '商品原价',
	`product_imgurl` VARCHAR ( 512 ) COMMENT '商品图片',
	`product_detailsimgurl` VARCHAR ( 512 ) COMMENT '商品详情图片',
	`product_remark` VARCHAR ( 64 ) COMMENT '商品评论或备注',
	`create_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
	`update_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '修改时间',
	`product_clickrate` INT COMMENT '点击率',
	`product_buyrate` INT COMMENT '购买率',
	`product_stock` INT(11) NOT NULL COMMENT '库存',
	`product_ishot` TINYINT(3) default '0' COMMENT '商品是否热卖，0正常1热卖',
	`product_isnew` TINYINT(3) default '0' COMMENT '商品是否新品，0正常1新品',
	`product_discount` FLOAT(1,1) COMMENT '商品折扣', 
	`product_description` VARCHAR ( 64 ) COMMENT '商品描述',
	`product_icon` VARCHAR ( 512 ) COMMENT '商品小图',
	`product_status` TINYINT(3) default '0' COMMENT '商品状态，0正常1下架',
	`category_id` `category_id` INT NOT NULL,
	`category_type` INT(11) NOT NULL COMMENT '类目编号',
	PRIMARY KEY ( `product_id` ) 
) COMMENT '商品表';
CREATE TABLE `product_category` (
	`category_id` INT NOT NULL auto_increment,
	`category_name` VARCHAR ( 64 ) NOT NULL COMMENT '类目名称',
	`category_type` INT NOT NULL COMMENT '类目编号',
	`create_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
	`update_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '修改时间',
	PRIMARY KEY ( `category_id` ),
	UNIQUE KEY `uqe_category_type` ( `category_type` ) 
) COMMENT '类目表';
CREATE TABLE `order_master` (
	`order_id` VARCHAR ( 32 ) NOT NULL,
	`buyer_name` VARCHAR ( 32 ) NOT NULL COMMENT '买家名字',
	`buyer_phone` VARCHAR ( 32 ) NOT NULL COMMENT '买家电话',
	`buyer_address` VARCHAR ( 128 ) NOT NULL COMMENT '买家地址',
	`buyer_openid` VARCHAR ( 64 ) NOT NULL COMMENT '买家微信openid',
	`order_amount` DECIMAL ( 8, 2 ) NOT NULL COMMENT '订单总金额',
	`order_status` TINYINT ( 3 ) NOT NULL DEFAULT '0' COMMENT '订单状态，默认0新下单',
	`pay_status` TINYINT ( 3 ) NOT NULL DEFAULT '0' COMMENT '支付状态，默认0未支付',
	`create_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
	`update_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '修改时间',
	PRIMARY KEY ( `order_id` ),
	KEY `idx_buyer_openid` ( `buyer_openid` ) 
) COMMENT '订单表';
CREATE TABLE `order_detail` (
	`detail_id` VARCHAR ( 32 ) NOT NULL,
	`order_id` VARCHAR ( 32 ) NOT NULL,
	`product_id` VARCHAR ( 32 ) NOT NULL,
	`product_name` VARCHAR ( 64 ) NOT NULL COMMENT '商品名称',
	`product_price` DECIMAL ( 8,2 ) NOT NULL COMMENT '商品价格',
	`product_quantity` INT NOT NULL COMMENT '商品数量',
	`product_icon` VARCHAR ( 512 ) COMMENT '商品小图',
	`create_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
	`update_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '修改时间',
	PRIMARY KEY ( `detail_id` ),
    KEY `idx_order_id` ( `order_id` ) 
) COMMENT '订单详情表';

CREATE TABLE `home_banners`(
    `banner_id` VARCHAR(32) NOT NULL,
	`banner_name` VARCHAR(64) NOT NULL COMMENT '轮播图名',
	`banner_imgurl` VARCHAR(512) COMMENT '轮播图片',
	`banner_click` VARCHAR(512) COMMENT '轮播图跳转地址',
	`banner_seq` INT NOT NULL COMMENT '轮播图排序',
	PRIMARY KEY (`banner_id`)
) COMMENT '首页轮播图';

CREATE TABLE `product_standard`(
    `standard_id` VARCHAR(32) NOT NULL,
	`product_id` VARCHAR ( 32 ) NOT NULL,
	`standard_imgurl` VARCHAR(512) COMMENT '商品规格图片',
	`standard_remark` VARCHAR(512) COMMENT '商品评论或备注',
	`standard_status` TINYINT ( 3 ) NOT NULL DEFAULT '0' COMMENT '商品规格状态，默认0在线',
	PRIMARY KEY (`standard_id`),
	KEY `idx_product_id` ( `product_id` ) 
) COMMENT '商品规格'









