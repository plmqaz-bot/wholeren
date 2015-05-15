use wholeren;
CREATE TABLE `doctype` (
  `docType` VARCHAR(45) NOT NULL,
  `id` INT NOT NULL AUTO_INCREMENT,
  `createdAt` DATETIME NULL,
  `updatedAt` DATETIME NULL,
  UNIQUE INDEX `docType_UNIQUE` (`docType` ASC),
  PRIMARY KEY (`id`)
)DEFAULT CHARACTER SET = utf8;

ALTER TABLE `publicfiles` 
ADD COLUMN `role` INT(11) NULL AFTER `fileCategory`;

CREATE TABLE `staticlink` (
  `name` VARCHAR(45),
  `fileCategory` INT(11) NULL,
  `user` INT(11) NOT NULL,
  `role` INT(11) NULL,
  `link` VARCHAR(512) NULL,
  `id` INT NOT NULL AUTO_INCREMENT,
  `createdAt` DATETIME NULL,
  `updatedAt` DATETIME NULL,
  PRIMARY KEY (`id`))DEFAULT CHARACTER SET = utf8;

ALTER TABLE `user` 
ADD COLUMN `dropbox` VARCHAR(255) NULL AFTER `userLevel`,
ADD COLUMN `evernote` VARCHAR(255) NULL AFTER `dropbox`,
ADD COLUMN `address` VARCHAR(45) NULL AFTER `evernote`,
ADD COLUMN `city` VARCHAR(45) NULL AFTER `address`,
ADD COLUMN `state` VARCHAR(45) NULL AFTER `city`,
ADD COLUMN `zipcode` INT NULL AFTER `state`,
ADD COLUMN `bio` VARCHAR(512) NULL AFTER `zipcode`;

SET NAMES 'utf8';
SET CHARACTER SET utf8;

insert into doctype values('新人必读',NULL,NOW(),NOW());
insert into doctype values('SOP',NULL,NOW(),NOW());

CREATE TABLE `subrole` (
  `roleName` VARCHAR(45) NOT NULL,
  `role` INT(11) NULL,
  `id` INT NOT NULL AUTO_INCREMENT,
  `createdAt` DATETIME NULL,
  `updatedAt` DATETIME NULL,
  PRIMARY KEY (`id`)
)DEFAULT CHARACTER SET = utf8;

CREATE TABLE `wholeren`.`message` (
  `from` INT(11) NOT NULL,
  `to` INT(11) NOT NULL,
  `subject` VARCHAR(45) NULL,
  `text` VARCHAR(512) NULL,
  `replyTo` INT(11) NULL,
  `read` TINYINT NOT NULL DEFAULT 0,
  `id` INT NOT NULL AUTO_INCREMENT,
  `createdAt` DATETIME NULL,
  `updatedAt` DATETIME NULL,
  PRIMARY KEY (`id`));

ALTER TABLE `user` 
ADD COLUMN `subRole` INT(11) NULL AFTER `role`;
insert into subrole values('高中',1,NULL,NOW(),NOW());
insert into subrole values('紧急销售',1,NULL,NOW(),NOW());
insert into subrole values('转升',1,NULL,NOW(),NOW());
insert into subrole values('大客户',1,NULL,NOW(),NOW());
insert into subrole values('紧急申请',2,NULL,NOW(),NOW());
insert into subrole values('大申请',2,NULL,NOW(),NOW());
insert into subrole values('转学',2,NULL,NOW(),NOW());
insert into subrole values('文书',2,NULL,NOW(),NOW());
insert into subrole values('广告',3,NULL,NOW(),NOW());
insert into subrole values('渠道',3,NULL,NOW(),NOW());


ALTER TABLE `userlevel` 
ADD COLUMN `baseSalary` FLOAT NULL DEFAULT 0 AFTER `userComission`;