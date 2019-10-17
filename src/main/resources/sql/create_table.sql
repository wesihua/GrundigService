/*
  该文件为数据库建表语句备份,添加建表语句格式请统一
  说明：系统表前缀为：t_sys_  业务表前缀：t_yx_
*/

CREATE TABLE t_sys_job_type  (
  id int(11) NOT NULL AUTO_INCREMENT 	  comment '工种id',
  name varchar(50) NOT NULL 			  comment '工种名称',
  level int(11) NOT NULL DEFAULT 1 		  comment '工种级别 1:一级，2:二级',
  parent_id int(11) NOT NULL DEFAULT 0 	  comment '父级id,根级为0',
  create_time datetime NOT NULL 		  comment '创建时间',
  create_user int(11) NULL 				  comment '创建人',
  update_time datetime NULL 			  comment '更新时间',
  update_user int(11) NULL				  comment '更新人',
  PRIMARY KEY (id)
) comment='工种表';

CREATE TABLE t_sys_dictionary  (
  id int(11) NOT NULL AUTO_INCREMENT 	  comment '字典id',
  type varchar(30) NOT NULL				  comment '字典种类',
  code varchar(30) NOT NULL 			  comment '字典值',
  name varchar(50) 						  comment '字典名称',
  sort int(11) NOT NULL DEFAULT 1 		  comment '排序',
  create_time datetime NOT NULL 		  comment '创建时间',
  create_user int(11) NULL 				  comment '创建人',
  update_time datetime NULL 			  comment '更新时间',
  update_user int(11) NULL 				  comment '更新人',
  PRIMARY KEY (id)
) comment='字典表';

CREATE TABLE t_sys_role  (
  id int(11) NOT NULL AUTO_INCREMENT      comment '角色id',
  name varchar(50) NOT NULL               comment '角色名称',
  description varchar(200)                comment '描述',
  create_time datetime NOT NULL           comment '创建时间',
  create_user int(11) NULL                comment '创建人',
  update_time datetime NULL               comment '更新时间',
  update_user int(11) NULL                comment '更新人',
  PRIMARY KEY (id)
) comment='角色表';

CREATE TABLE t_sys_menu  (
  id int(11) NOT NULL AUTO_INCREMENT      comment '菜单id',
  name varchar(50) NOT NULL               comment '菜单名称',
  path varchar(200) NULL                  comment '路径url',
  type int(11) NOT NULL DEFAULT 1         comment '菜单类型 0:文件夹，1:链接',
  parent_id int(11) NOT NULL DEFAULT 0    comment '父级id,根级为0',
  order int(11) NOT NULL DEFAULT 100		comment '菜单顺序',
  create_time datetime NOT NULL           comment '创建时间',
  create_user int(11) NULL                comment '创建人',
  update_time datetime NULL               comment '更新时间',
  update_user int(11) NULL                comment '更新人',
  PRIMARY KEY (id)
) comment='菜单表';

CREATE TABLE t_sys_role_menu  (
  id int(11) NOT NULL AUTO_INCREMENT      comment 'id',
  role_id int(11) NOT NULL                comment '角色id',
  menu_id int(11) NOT NULL                comment '菜单id',
  create_time datetime NOT NULL           comment '创建时间',
  create_user int(11) NULL                comment '创建人',
  update_time datetime NULL               comment '更新时间',
  update_user int(11) NULL                comment '更新人',
  PRIMARY KEY (id)
) comment='角色-菜单关联表';

CREATE TABLE t_sys_user  (
  id int(11) NOT NULL AUTO_INCREMENT		comment '用户id',
  user_name varchar(50) NOT NULL			comment '用户名',
  password varchar(50) NOT NULL				comment '密码',
  real_name varchar(50)	NULL				comment '真实姓名',
  role_id int(11) NULL						comment '所属角色',
  scope int(11) NULL DEFAULT 0				comment '用户所属平台范围 0:全部,1:pc,2:app',
  create_time datetime NOT NULL				comment '创建时间',
  create_user int(11) NULL					comment '创建人',
  update_time datetime NULL					comment '更新时间',
  update_user int(11) NULL					comment '更新人',
  PRIMARY KEY (id)
) comment='用户表';

CREATE TABLE t_yx_company  (
  id int(11) NOT NULL AUTO_INCREMENT      comment '企业id',
  name varchar(100) NOT NULL              comment '企业名称',
  code varchar(50) NULL                   comment '组织机构代码',                       
  industry varchar(100) NULL              comment '所属行业',
  address varchar(255) NULL               comment '企业地址',
  contact_name varchar(30) NULL           comment '联系人',
  contact_phone varchar(20) NULL          comment '联系电话',
  description varchar(255) NULL           comment '备注',
  credit_number varchar(50) NULL COMMENT '企业信用代码',
  bank varchar(50) NULL COMMENT '开户行',
  bank_account varchar(20) NULL COMMENT '银行卡号',
  create_time datetime NOT NULL           comment '创建时间',
  create_user int(11) NULL                comment '创建人',
  update_time datetime NULL               comment '更新时间',
  update_user int(11) NULL                comment '更新人',
  PRIMARY KEY (id)
) comment='企业表';

CREATE TABLE t_yx_worker (
  id int(11) NOT NULL AUTO_INCREMENT COMMENT '主键',
  name varchar(50) NOT NULL COMMENT '姓名',
  photo varchar(100) DEFAULT NULL COMMENT '头像',
  sex int(11) DEFAULT NULL COMMENT '性别0：男；1：女',
  age int(11) DEFAULT NULL COMMENT '年龄，由身份证号计算得出',
  telephone varchar(50) NOT NULL COMMENT '手机号',
  idcard varchar(50) DEFAULT NULL COMMENT '身份证号',
  birthday date NULL COMMENT '出生日期',
  birthplace_code int(11) NULL COMMENT '籍贯',
  work_year int(11) DEFAULT NULL COMMENT '工作年限',
  marital_status int(11) NULL COMMENT '婚姻状况0:未婚;1:已婚;2:离异;3:丧偶;',
  workplace_code int(11) NULL COMMENT '工作地区',
  expect_salary int(11) NULL COMMENT '期望薪水:可选',
  work_status int(11) NULL COMMENT '工作状态0:找工作中;1:已工作;',
  nation int(11) NULL COMMENT '民族:可选',
  position varchar(50) DEFAULT NULL COMMENT '职位',
  address varchar(50) DEFAULT NULL COMMENT '通讯地址',
  language_level int(11) DEFAULT NULL COMMENT '语言能力：可选',
  work_expect varchar(100) DEFAULT NULL COMMENT '工作意向',
  email varchar(100) DEFAULT NULL COMMENT '电子邮箱',
  title varchar(50) DEFAULT NULL COMMENT '职称',
  night_work int(11) COMMENT '是否接受夜班 0:否,1:是',
  degree int(1) NULL COMMENT '最高学历',
  profile varchar(500) NULL COMMENT '个人简介',
  description varchar(500) NULL COMMENT '备注',
  bank varchar(50) NULL COMMENT '开户行',
  bank_account varchar(20) NULL COMMENT '银行卡号',
  souce int(11) DEFAULT NULL COMMENT '来源 0:app,1:pc,2:导入,3:二维码',
  jobtype_name varchar(255) NULL COMMENT '用来存放工种名称，防止翻译影响查询速度',
  create_time datetime NOT NULL COMMENT '创建时间',
  create_user int(11) DEFAULT NULL COMMENT '创建人',
  update_time datetime DEFAULT NULL COMMENT '更新时间',
  update_user int(11) DEFAULT NULL COMMENT '更新人',
  PRIMARY KEY (id) USING BTREE,
  UNIQUE KEY index_unique_idcard (idcard)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT COMMENT='人才信息表';
ALTER TABLE t_yx_worker ADD INDEX index_telephone (telephone);
ALTER TABLE t_yx_worker ADD INDEX index_title (title);
ALTER TABLE t_yx_worker ADD INDEX index_name (name);
ALTER TABLE t_yx_worker ADD INDEX index_create_user (create_user);
ALTER TABLE t_yx_worker ADD INDEX index_create_time (create_time);

CREATE TABLE t_yx__worker_education (
  id int(11) NOT NULL AUTO_INCREMENT COMMENT '主键',
  worker_id int(11) NOT NULL COMMENT '工人id',
  degree int(11) NOT NULL COMMENT '学历',
  school varchar(100) NOT NULL COMMENT '学校名称',
  description varchar(255) NOT NULL COMMENT '描述',
  begin_time datetime DEFAULT NULL COMMENT '开始时间',
  end_time datetime DEFAULT NULL COMMENT '结束时间',
  discipline varchar(100) DEFAULT NULL COMMENT '专业名称',
  create_user int(11) NULL COMMENT '创建人',
  create_time datetime NOT NULL COMMENT '创建时间',
  update_user int(11) DEFAULT NULL COMMENT '修改人',
  update_time datetime DEFAULT NULL COMMENT '修改时间',
  PRIMARY KEY (id) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT COMMENT='人才-教育经历表';
ALTER TABLE t_yx__worker_education ADD INDEX index_worker_id (worker_id);

CREATE TABLE t_yx__worker_experience (
  id int(11) NOT NULL AUTO_INCREMENT COMMENT '主键',
  worker_id int(11) NOT NULL COMMENT '工人id',
  company varchar(100) NOT NULL COMMENT '公司名称',
  position varchar(50) DEFAULT NULL COMMENT '职位',
  industry varchar(50) DEFAULT NULL COMMENT '行业',
  salary int(11) DEFAULT NULL COMMENT '月工资',
  begin_time datetime DEFAULT NULL COMMENT '开始时间',
  end_time datetime DEFAULT NULL COMMENT '结束时间',
  description varchar(255) DEFAULT NULL COMMENT '工作内容',
  create_user int(11) NULL COMMENT '创建人',
  create_time datetime NOT NULL COMMENT '创建时间',
  update_user int(11) DEFAULT NULL COMMENT '修改人',
  update_time datetime DEFAULT NULL COMMENT '修改时间',
  PRIMARY KEY (id) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT COMMENT='人才-工作经历表';
ALTER TABLE t_yx__worker_experience ADD INDEX index_worker_id (worker_id);
ALTER TABLE t_yx__worker_experience ADD INDEX index_company (company);

CREATE TABLE t_yx__worker_jobtype (
  id int(11) NOT NULL AUTO_INCREMENT COMMENT '主键',
  worker_id int(11) NOT NULL COMMENT '工人id',
  first_id int(11) NOT NULL COMMENT '工种一级id',
  second_id int(11) NOT NULL COMMENT '工种二级id',
  PRIMARY KEY (id) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT COMMENT='人才-工种关联表';
ALTER TABLE t_yx__worker_jobtype ADD INDEX index_worker_id (worker_id);
ALTER TABLE t_yx__worker_jobtype ADD INDEX index_first_second_id (first_id,second_id);

CREATE TABLE t_yx_demand (
  id int(11) NOT NULL AUTO_INCREMENT COMMENT '主键',
  demand_number varchar(50) DEFAULT NULL COMMENT '需求单号',
  company_id int(11) NOT NULL COMMENT '企业id',
  state int(1) NOT NULL COMMENT '状态  0：待处理；1：处理中；2：已签约；3：已结束',
  description varchar(500) DEFAULT NULL COMMENT '备注说明',
  other_treatment varchar(500) DEFAULT NULL COMMENT '其他待遇',
  undertake_time datetime DEFAULT NULL COMMENT '接单时间',
  undertake_user int(11) DEFAULT NULL COMMENT '接单人',
  close_time datetime DEFAULT NULL COMMENT '关单时间',
  close_status int(1) DEFAULT NULL COMMENT '关单状态',
  close_user int(11) DEFAULT NULL COMMENT '关单人',
  close_reason varchar(255) DEFAULT NULL COMMENT '关单原因',
  create_user int(11) NOT NULL COMMENT '创建人、录单人',
  create_time datetime NOT NULL COMMENT '创建时间、录单时间',
  update_user int(11) DEFAULT NULL COMMENT '修改人',
  update_time datetime DEFAULT NULL COMMENT '修改时间',
  PRIMARY KEY (id)
) COMMENT='企业需求单表';
ALTER TABLE t_yx_demand ADD INDEX index_company_id (company_id);
ALTER TABLE t_yx_demand ADD INDEX index_state (state);
ALTER TABLE t_yx_demand ADD INDEX index_undertake_user (undertake_user);
ALTER TABLE t_yx_demand ADD INDEX index_create_time (create_time);

CREATE TABLE t_yx_demand_job (
  id int(11) NOT NULL AUTO_INCREMENT COMMENT '主键',
  demand_id int(11) NOT NULL COMMENT '需求单id',
  job_type_id int(11) NOT NULL COMMENT '用工工种id',
  worker_count int(11) NOT NULL COMMENT '用工人数',
  salary varchar(50) COMMENT '月薪',
  require_time date COMMENT '到岗时间',
  work_area int(11) COMMENT '工作地区code',
  gender int(11) DEFAULT NULL COMMENT '性别要求',
  age varchar(50) DEFAULT NULL COMMENT '年龄要求',
  degree int(11) DEFAULT NULL COMMENT '学历要求',
  major varchar(50) NULL COMMENT '专业要求',
  requirement varchar(255) DEFAULT NULL COMMENT '用工要求',
  create_user int(11) NOT NULL COMMENT '创建人',
  create_time datetime NOT NULL COMMENT '创建时间',
  update_user int(11) DEFAULT NULL COMMENT '修改人',
  update_time datetime DEFAULT NULL COMMENT '修改时间',
  PRIMARY KEY (id)
) COMMENT='订单工人表';
ALTER TABLE t_yx_demand_job ADD INDEX index_create_time (create_time);
ALTER TABLE t_yx_demand_job ADD INDEX index_demand_id (demand_id);

CREATE TABLE t_yx_demand_order (
  id int(11) NOT NULL AUTO_INCREMENT,
  demand_id int(11) DEFAULT NULL COMMENT '需求单id',
  order_number varchar(50) DEFAULT NULL COMMENT '订单号',
  worker_count int(11) DEFAULT 0 COMMENT '工人人数',
  operator_user int(11) DEFAULT NULL COMMENT '经手人',
  customer varchar(50) DEFAULT NULL COMMENT '客户负责人',
  total_income varchar(20) DEFAULT '0.0' COMMENT '订单收入总额',
  confirm_state int(11) DEFAULT 0 COMMENT '确认状态 0:待确认，1:被驳回，2：已确认',
  confirm_user int(11) NULL COMMENT '确认人',
  confirm_time datetime NULL COMMENT '确认时间',
  reject_reason varchar(255) NULL COMMENT '驳回原因',
  description varchar(255) DEFAULT NULL COMMENT '备注',
  create_user int(11) NOT NULL COMMENT '创建人',
  create_time datetime NOT NULL COMMENT '创建时间',
  update_time datetime DEFAULT NULL COMMENT '修改时间',
  update_user int(11) DEFAULT NULL COMMENT '修改人',
  PRIMARY KEY (id)
) COMMENT='订单表';
ALTER TABLE t_yx_demand_order ADD INDEX index_demand_id (demand_id);
ALTER TABLE t_yx_demand_order ADD INDEX index_create_time (create_time);

CREATE TABLE t_yx_order_worker (
  id int(11) NOT NULL AUTO_INCREMENT COMMENT '主键',
  demand_job_id int(11) NOT NULL COMMENT '需求单工种id',
  worker_id int(11) NOT NULL COMMENT '工人id',
  order_id int(11) DEFAULT NULL COMMENT '订单id',
  sign_salary int(11) COMMENT '签约薪水',
  business_income varchar(20) DEFAULT '0.0' COMMENT '业务收入',
  collect_user_income varchar(50) DEFAULT '0.0' COMMENT '采集人员收入',
  undertake_user_income varchar(50) DEFAULT '0.0' COMMENT '接单人员收入',
  arrive_work_time datetime COMMENT '到岗时间',
  description varchar(255) DEFAULT NULL COMMENT '备注',
  create_user int(11) NOT NULL COMMENT '创建人',
  create_time datetime NOT NULL COMMENT '创建时间',
  update_user int(11) DEFAULT NULL COMMENT '修改人',
  update_time datetime DEFAULT NULL COMMENT '修改时间',
  PRIMARY KEY (id)
) COMMENT='订单_签约人工表';

ALTER TABLE t_yx_order_worker ADD INDEX index_create_time (create_time);
ALTER TABLE t_yx_order_worker ADD INDEX index_demand_jobtype_id (demand_job_id);
ALTER TABLE t_yx_order_worker ADD INDEX index_order_id (order_id);
ALTER TABLE t_yx_order_worker ADD INDEX index_worker_id (worker_id);

-- 更改sql
ALTER TABLE t_yx_worker ADD COLUMN agent varchar(30) NULL COMMENT '代理人' AFTER souce;