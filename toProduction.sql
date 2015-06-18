
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

truncate servicedetail;

select servicedetail.*,user.nickname,u2.nickname from servicedetail left join user on servicedetail.user=user.id left join user u2 on user.role=u2.role and u2.rank=2;

select * from client where chineseName='王淼';


select cName, count(*) from servicedetail inner join client on client.chinesename=cName and client.chineseName!='' where contractKey ='' group by servicedetail.cName;


select * from client where chineseName='令一辉';


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




ALTER TABLE `wholeren`.`application` 
CHANGE COLUMN `succeed` `succeed` TINYINT(1) NULL DEFAULT 0 ,
ADD COLUMN `decided` TINYINT(1) NULL DEFAULT 0 AFTER `newDev`,
ADD COLUMN `applied` TINYINT(1) NULL DEFAULT 0 AFTER `decided`;
CREATE TABLE `wholeren`.`subrole_handle_salesgroup` (
  `subRole` INT(11) NULL,
  `salesGroup` INT(11) NULL,
  `id` INT NOT NULL AUTO_INCREMENT,
  `createdAt` DATETIME NULL,
  `updatedAt` DATETIME NULL,
  PRIMARY KEY (`id`));




ALTER TABLE `wholeren`.`application` 
ADD COLUMN `appliedDegree` INT(11) NULL AFTER `appliedMajor`,
ADD COLUMN `submitDate` DATE NULL AFTER `applied`,
ADD COLUMN `acceptedDate` DATE NULL AFTER `succeed`;

ALTER TABLE `wholeren`.`servicedetail` 
ADD COLUMN `degree` INT(11) NULL AFTER `serviceProgress`,
ADD COLUMN `correspondService` INT(11) NULL AFTER `degree`;


ALTER TABLE `wholeren`.`servcomissionlookup` 
DROP COLUMN `statusflat`,
DROP COLUMN `statusportion`,
DROP COLUMN `serviceStatus`,
DROP COLUMN `priceFlat`,
DROP COLUMN `pricePerCol`,
DROP COLUMN `servRole`,
CHANGE COLUMN `serviceType` `realServiceType` INT(11) NULL DEFAULT NULL ,
ADD COLUMN `degree` INT(11) NULL AFTER `servLevel`,
ADD COLUMN `serviceProgress` INT(11) NULL AFTER `degree`;

ALTER TABLE `wholeren`.`servcomissionlookup` 
ADD COLUMN `score` FLOAT NULL DEFAULT 0 AFTER `serviceProgress`;

