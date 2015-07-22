
use wholeren;
CREATE TABLE `realservicetype` (
  `realServiceType` VARCHAR(45) NULL,
  `id` INT NOT NULL AUTO_INCREMENT,
  `createdAt` DATETIME NULL,
  `updatedAt` DATETIME NULL,
  PRIMARY KEY (`id`));

CREATE TABLE `sales2realservicetype` (
  `serviceType` INT(11) NOT NULL,
  `realServiceType` INT(11) NOT NULL,
  `id` INT NOT NULL AUTO_INCREMENT,
  `createdAt` DATETIME NULL,
  `updatedAt` DATETIME NULL,
  PRIMARY KEY (`id`));

ALTER TABLE `servicedetail` 
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
CREATE TABLE `userinservice` (
  `user` INT(11) NULL,
  `serviceDetail` INT(11) NULL,
  `id` INT NOT NULL AUTO_INCREMENT,
  `createdAt` DATETIME NULL,
  `updatedAt` DATETIME NULL,
  PRIMARY KEY (`id`));
select   distinct contract.*,chineseName,teacher,GROUP_CONCAT(distinct service.serviceType SEPARATOR ',') as 'boughservices', country,degree,previousSchool,major,gpa,toefl,sat,gre,otherScore  from contract left join service on service.contract=contract.id left join client on contract.client=client.id left join servicedetail on servicedetail.contract=contract.id left join userinservice u on u.servicedetail=servicedetail.id  where contract.contractSigned is not null  and 1 in (contract.sales1,contract.sales2, contract.teacher, servicedetail.user, u.user) group by contract.id;
select SQL_NO_CACHE  distinct contract.*,chineseName,teacher,GROUP_CONCAT(distinct service.serviceType SEPARATOR ',') as 'boughservices', country,degree,previousSchool,major,gpa,toefl,sat,gre,otherScore  from contract left join service on service.contract=contract.id left join client on contract.client=client.id left join servicedetail on servicedetail.contract=contract.id left join userinservice u on u.servicedetail=servicedetail.id  where contract.contractSigned is not null  group by contract.id;

create index sdc on servicedetail(contract);
create index sc on service(contract);
create index cc on contract(client);
create index sales1 on `contract`(sales1);
create index sales2 on `contract`(sales2);
create index teacher on `contract`(teacher);
create index app_serv on `application`(service);
create index servprogupdate on `servicedetail`(correspondService);


set sql_safe_updates=0;
# delete no use client
delete client from client  left join contract on contract.client=client.id where contract.id is null;
#match by contractkey
update servicedetail inner join contract on contractKey=contract.nameKey and contractKey!='' set servicedetail.contract=contract.id;
#find duplicate client
select * from client inner join client c2 on client.chineseName=c2.chineseName and client.firstName=c2.firstname and client.lastName=c2.lastName and client.id>c2.id;
# match by cname
update servicedetail inner join (
select servicedetail.id,contract.id as cid,count(*) as 'count' from servicedetail inner join client on servicedetail.cName=client.chineseName and servicedetail.cName !='' and servicedetail.cname is not null inner join contract on contract.client=client.id group by servicedetail.cName) as t on t.id=servicedetail.id set servicedetail.contract=cid where count=1;

select * from servicedetail where contract is null;


CREATE TABLE `subrole_handle_salesgroup` (
  `subRole` INT(11) NULL,
  `salesGroup` INT(11) NULL,
  `id` INT NOT NULL AUTO_INCREMENT,
  `createdAt` DATETIME NULL,
  `updatedAt` DATETIME NULL,
  PRIMARY KEY (`id`));

ALTER TABLE `application` 
CHANGE COLUMN `succeed` `succeed` TINYINT(1) NULL DEFAULT 0 ,
ADD COLUMN `decided` TINYINT(1) NULL DEFAULT 0 AFTER `newDev`,
ADD COLUMN `applied` TINYINT(1) NULL DEFAULT 0 AFTER `decided`;

ALTER TABLE `application` 
ADD COLUMN `appliedDegree` INT(11) NULL AFTER `appliedMajor`,
ADD COLUMN `submitDate` DATE NULL AFTER `applied`,
ADD COLUMN `acceptedDate` DATE NULL AFTER `succeed`;

ALTER TABLE `servicedetail` 
ADD COLUMN `degree` INT(11) NULL AFTER `serviceProgress`,
ADD COLUMN `correspondService` INT(11) NULL AFTER `degree`;


ALTER TABLE `servcomissionlookup` 
DROP COLUMN `statusflat`,
DROP COLUMN `statusportion`,
DROP COLUMN `serviceStatus`,
DROP COLUMN `priceFlat`,
DROP COLUMN `pricePerCol`,
DROP COLUMN `servRole`,
CHANGE COLUMN `serviceType` `realServiceType` INT(11) NULL DEFAULT NULL ,
ADD COLUMN `degree` INT(11) NULL AFTER `servLevel`,
ADD COLUMN `serviceProgress` INT(11) NULL AFTER `degree`;

ALTER TABLE `servcomissionlookup` 
ADD COLUMN `score` FLOAT NULL DEFAULT 0 AFTER `serviceProgress`;


CREATE TABLE `servappcomissionlookup` (
  `realServiceType` INT(11) NULL,
  `decidedScore` FLOAT NULL,
  `appliedScore` FLOAT NULL,
  `acceptedScore` FLOAT NULL,
  `acceptedFlat` FLOAT NULL,
  `id` INT NOT NULL AUTO_INCREMENT,
  `createdAt` DATETIME NULL,
  `updatedAt` DATETIME NULL,
  PRIMARY KEY (`id`));


ALTER TABLE `application` 
ADD COLUMN `decidedDate` DATE NULL AFTER `decided`;

ALTER TABLE `servicedetail` 
ADD COLUMN `level` INT NULL AFTER `degree`;


ALTER TABLE `servappcomissionlookup` 
CHANGE COLUMN `decidedScore` `decideH` FLOAT NULL DEFAULT NULL ,
CHANGE COLUMN `appliedScore` `decideCC` FLOAT NULL DEFAULT NULL ,
CHANGE COLUMN `acceptedScore` `decideU` FLOAT NULL DEFAULT NULL ,
CHANGE COLUMN `acceptedFlat` `appliedH` FLOAT NULL DEFAULT NULL ,
ADD COLUMN `appliedCC` FLOAT NULL AFTER `appliedH`,
ADD COLUMN `appliedU` FLOAT NULL AFTER `appliedCC`,
ADD COLUMN `perAppIfAccept` FLOAT NULL AFTER `appliedU`;

ALTER TABLE `servappcomissionlookup` 
CHANGE COLUMN `perAppIfAccept` `perAppIfAcceptH` FLOAT NULL DEFAULT NULL ,
ADD COLUMN `perAppIfAcceptCC` FLOAT NULL AFTER `perAppIfAcceptH`,
ADD COLUMN `perAppIfAcceptU` FLOAT NULL AFTER `perAppIfAcceptCC`;
ALTER TABLE `servappcomissionlookup` 
ADD COLUMN `flatIfAccepted` FLOAT NULL AFTER `updatedAt`,
ADD COLUMN `level` INT NULL AFTER `flatIfAccepted`;
ALTER TABLE `servappcomissionlookup` 
CHANGE COLUMN `flatIfAccepted` `flatIfAccepted` FLOAT NULL DEFAULT NULL AFTER `perAppIfAcceptU`,
CHANGE COLUMN `level` `level` INT(11) NULL DEFAULT NULL AFTER `flatIfAccepted`;

set sql_safe_updates=0;
update servicedetail set correspondService=id where realServicetype=12;
truncate serviceprogressupdate;
insert into serviceprogressupdate 
select id,2,NULL,indate,indate from servicedetail;
insert into serviceprogressupdate 
select id,serviceProgress,NULL,now(),now()from servicedetail;




ALTER TABLE `comissionlookup` 
ADD COLUMN `alone` TINYINT NOT NULL DEFAULT 0 ;

ALTER TABLE `application` 
ADD COLUMN `deadline` DATE NULL DEFAULT NULL AFTER `studentCondition`;

ALTER TABLE `servicedetail` 
ADD COLUMN `effectiveSemester` DATE NULL DEFAULT NULL AFTER `namekey`,
ADD COLUMN `semesterType` VARCHAR(45) NULL DEFAULT NULL AFTER `effectiveSemester`;


CREATE TABLE `contactinfo` (
  `primaryCell` VARCHAR(45) NULL,
  `secondaryCell` VARCHAR(45) NULL,
  `skype` VARCHAR(45) NULL,
  `qq` VARCHAR(45) NULL,
  `wechat` VARCHAR(45) NULL,
  `parentPhone` VARCHAR(45) NULL,
  `parentEmail` VARCHAR(45) NULL,
  `emergencyContact` VARCHAR(45) NULL,
  `id` INT NOT NULL AUTO_INCREMENT,
  `createdAt` DATETIME NULL,
  `updatedAt` DATETIME NULL,
  PRIMARY KEY (`id`));

ALTER TABLE `contactinfo` 
ADD COLUMN `service` INT(11) NULL AFTER `updatedAt`,
ADD COLUMN `client` INT(11) NULL AFTER `service`;

CREATE TABLE `applicationfile` (
  `description` VARCHAR(45) NULL,
  `file` INT(11) NULL,
  `application` INT(11) NULL);

ALTER TABLE `applicationfile` 
ADD COLUMN `createdAt` DATETIME NULL AFTER `application`,
ADD COLUMN `updatedAt` DATETIME NULL AFTER `createdAt`;
ALTER TABLE `applicationfile` 
ADD COLUMN `id` INT NOT NULL AUTO_INCREMENT AFTER `application`,
ADD PRIMARY KEY (`id`);

CREATE TABLE `subrole_has_realservicetype` (
  `realServiceType` INT(11) NULL,
  `subRole` INT(11) NULL,
  `id` INT NOT NULL AUTO_INCREMENT,
  `createdAt` DATETIME NULL,
  `updatedAt` DATETIME NULL,
  PRIMARY KEY (`id`));



ALTER TABLE `wholeren`.`contactinfo` 
CHANGE COLUMN `secondaryCell` `secondaryEmail` VARCHAR(45) NULL DEFAULT NULL ;

ALTER TABLE `wholeren`.`client` 
ADD COLUMN `pinyin` VARCHAR(45) NULL AFTER `lastName`;




ALTER TABLE `wholeren`.`user` 
ADD COLUMN `secondaryRole` INT NULL AFTER `subRole`,
ADD COLUMN `secondarySubRole` INT NULL AFTER `secondaryRole`,
ADD COLUMN `secondaryRank` INT NULL AFTER `rank`;


ALTER TABLE `wholeren`.`contactinfo` 
ADD COLUMN `otherContact` VARCHAR(45) NULL AFTER `emergencyContact`;

ALTER TABLE `wholeren`.`contract` 
ADD COLUMN `gmat` FLOAT NULL AFTER `age`;


CREATE TABLE `wholeren`.`visainfo` (
  `serviceDetail` INT NOT NULL,
  `visaProgress` VARCHAR(45) NULL,
  `Result` VARCHAR(45) NULL,
  `ResultComment` VARCHAR(45) NULL,
  `endDate` DATE NULL,
  `secondDate` DATE NULL,
  `secondResult` VARCHAR(45) NULL,
  `secondResultComment` VARCHAR(45) NULL,
  `thirdDate` DATE NULL,
  `thirdResult` VARCHAR(45) NULL,
  `id` INT NOT NULL AUTO_INCREMENT,
  `createdAt` DATETIME NULL,
  `updatedAt` DATETIME NULL,
  PRIMARY KEY (`id`));

