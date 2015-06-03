use wholeren;
CREATE TABLE `wholeren`.`realservicetype` (
  `realServiceType` VARCHAR(45) NULL,
  `id` INT NOT NULL AUTO_INCREMENT,
  `createdAt` DATETIME NULL,
  `updatedAt` DATETIME NULL,
  PRIMARY KEY (`id`));

CREATE TABLE `wholeren`.`sales2realservicetype` (
  `serviceType` INT(11) NOT NULL,
  `realServiceType` INT(11) NOT NULL,
  `id` INT NOT NULL AUTO_INCREMENT,
  `createdAt` DATETIME NULL,
  `updatedAt` DATETIME NULL,
  PRIMARY KEY (`id`));

ALTER TABLE `wholeren`.`servicedetail` 
DROP COLUMN `servLevel`,
DROP COLUMN `servRole`,
CHANGE COLUMN `serviceType` `realServiceType` INT(11) NULL DEFAULT NULL ,
CHANGE COLUMN `id` `id` INT(11) NOT NULL ,
ADD COLUMN `assis` INT(11) NULL AFTER `realServiceType`,
ADD COLUMN `serviceProgress` INT(11) NOT NULL DEFAULT 1 AFTER `assis`,
ADD COLUMN `indate` DATE NULL AFTER `serviceProgress`,
ADD COLUMN `link` VARCHAR(225) NULL AFTER `indate`,
ADD COLUMN `contractKey` VARCHAR(45) NULL AFTER `link`,
ADD COLUMN `cName` VARCHAR(45) NULL AFTER `contractKey`;
ALTER TABLE `wholeren`.`servicedetail` 
ADD COLUMN `namekey` VARCHAR(45) NULL AFTER `cName`;
ALTER TABLE `wholeren`.`servicedetail` 
ADD COLUMN `contract` INT(11) NULL FIRST;
insert into realservicetype values('a',1,NOW(),NOW());
insert into realservicetype values('b',2,NOW(),NOW());
insert into realservicetype values('c',3,NOW(),NOW());
insert into realservicetype values('d',4,NOW(),NOW());
insert into realservicetype values('e',5,NOW(),NOW());
insert into realservicetype values('f',6,NOW(),NOW());
insert into realservicetype values('g',7,NOW(),NOW());
insert into realservicetype values('h',8,NOW(),NOW());
insert into realservicetype values('hs',9,NOW(),NOW());
insert into realservicetype values('ht',10,NOW(),NOW());
insert into realservicetype values('hb',11,NOW(),NOW());
insert into realservicetype values('i',12,NOW(),NOW());
insert into realservicetype values('is',13,NOW(),NOW());
insert into realservicetype values('ib',14,NOW(),NOW());
insert into realservicetype values('p',15,NOW(),NOW());
insert into realservicetype values('z',17,NOW(),NOW());
insert into realservicetype values('ap',18,NOW(),NOW());
insert into realservicetype values('hv',19,NOW(),NOW());
insert into realservicetype values('vip',20,NOW(),NOW());
insert into realservicetype values('ghj',21,NOW(),NOW());
insert into realservicetype values('ic',22,NOW(),NOW());
insert into realservicetype values('pc',23,NOW(),NOW());