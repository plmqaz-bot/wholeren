use test;
#合同类型
insert into contractcategory values('紧急服务',NULL,NOW(),NOW());
insert into contractcategory values('社区转学/直升',NULL,NOW(),NOW());
insert into contractcategory values('高中转学/直升',NULL,NOW(),NOW());
insert into contractcategory values('大学转学/直升',NULL,NOW(),NOW());
insert into contractcategory values('研究生/博士申请',NULL,NOW(),NOW());
insert into contractcategory values('学术辅导',NULL,NOW(),NOW()); # This is now 辅导
insert into contractcategory values('签证辅导',NULL,NOW(),NOW()); # This is now 辅导
#insert into contractcategory values('薛涌留学预备课程',NULL,NOW(),NOW()); This is in  其他
insert into contractcategory values('Free Session',NULL,NOW(),NOW());
insert into contractcategory values('二次签约',NULL,NOW(),NOW());
insert into contractcategory values('其它',NULL,NOW(),NOW());
insert into contractcategory values('辅导',NULL,NOW(),NOW());

#Lead
insert into lead values('Campus校代介绍',NULL,NOW(),NOW());
insert into lead values('Web电话/网络',NULL,NOW(),NOW());
insert into lead values('Customer老客户介绍',NULL,NOW(),NOW());
#insert into lead values('Friend熟人介绍',NULL,NOW(),NOW()); # this is in Staff now
insert into lead values('Staff内部员工介绍',NULL,NOW(),NOW());
#insert into lead values('Free Session',NULL,NOW(),NOW()); # this is in Sec
insert into lead values('Sec二次签约',NULL,NOW(),NOW());
insert into lead values('PreSale',NULL,NOW(),NOW());
insert into lead values('CA',NULL,NOW(),NOW());
insert into lead values('Partner合作推荐',NULL,NOW(),NOW());

#LeadLevel
insert into leadlevel values('L1：有互动，且信息完整',NULL,NOW(),NOW());
insert into leadlevel values('L2：有互动，但信息不完整',NULL,NOW(),NOW());
insert into leadlevel values('L0：老客户、二次签约、关系户',NULL,NOW(),NOW());

#签约状态
insert into status values('A. 未签约',NULL,NOW(),NOW());
insert into status values('B. 放弃治疗',NULL,NOW(),NOW());
insert into status values('C. WIP',NULL,NOW(),NOW());
insert into status values('C1. 退款',NULL,NOW(),NOW());
insert into status values('C2. 签约未付款',NULL,NOW(),NOW());
insert into status values('D. Done',NULL,NOW(),NOW());
insert into status values('F. 放弃并转至其他服务',NULL,NOW(),NOW());
insert into status values('G. 公益完结',NULL,NOW(),NOW());
insert into status values('H. 未咨询',NULL,NOW(),NOW());

#国家
insert into country values('中国',NULL,NOW(),NOW());
insert into country values('美国',NULL,NOW(),NOW());

#就读学位
insert into degree values('高中',NULL,NOW(),NOW());
insert into degree values('社区',NULL,NOW(),NOW());
insert into degree values('语言',NULL,NOW(),NOW());
insert into degree values('本科',NULL,NOW(),NOW());
insert into degree values('硕士',NULL,NOW(),NOW());# 硕博
insert into degree values('博士',NULL,NOW(),NOW());# 硕博
insert into degree values('硕博',NULL,NOW(),NOW());
#付款方式
insert into paymentoption values('中国汇款',NULL,NOW(),NOW());
insert into paymentoption values('美国汇款',NULL,NOW(),NOW());
insert into paymentoption values('BrainTree',NULL,NOW(),NOW());
insert into paymentoption values('Paypal',NULL,NOW(),NOW());

#人员角色
insert into role values('销售',NULL,NOW(),NOW());
insert into role values('申请',NULL,NOW(),NOW());
insert into role values('市场',NULL,NOW(),NOW());
insert into role values('文书',NULL,NOW(),NOW());
insert into role values('专家',NULL,NOW(),NOW());

#服务 TODO: add the recommended price and also base comission
insert into servicetype values('a.澄清','Emerg',false,0.9,NULL,NOW(),NOW());
insert into servicetype values('b.申诉','Emerg',false,0.9,NULL,NOW(),NOW());
insert into servicetype values('c1.找律师','Emerg',false,0.5,NULL,NOW(),NOW());
insert into servicetype values('c2.带律师的申诉','Emerg',false,0.5,NULL,NOW(),NOW());
insert into servicetype values('d1.紧急服务之cc或语言申请','Emerg',true,0.9,NULL,NOW(),NOW());
insert into servicetype values('d2.紧急服务之高中申请','Emerg',true,0.9,NULL,NOW(),NOW());
insert into servicetype values('d3.紧急服务之大U申请','Emerg',true,0.9,NULL,NOW(),NOW());
insert into servicetype values('e.身份激活','Emerg',false,0.5,NULL,NOW(),NOW());
insert into servicetype values('j.$4500省心装(申诉+紧急转)','Emerg',true,0.9,NULL,NOW(),NOW());
insert into servicetype values('L.$7000 紧急礼包二','Emerg',true,0.82,NULL,NOW(),NOW());
insert into servicetype values('M.$11000, 紧急礼包4，全包','Emerg',true,0.85,NULL,NOW(),NOW());
insert into servicetype values('K.$5000正规+转学','Emerg',true,0.75,NULL,NOW(),NOW());
insert into servicetype values('i1.CC或语言申请','Transfer',true,0.9,NULL,NOW(),NOW());
insert into servicetype values('i2.高中申请','Transfer',true,0.9,NULL,NOW(),NOW());
insert into servicetype values('i3.大U申请(本或硕)','Transfer',true,0.9,NULL,NOW(),NOW());
insert into servicetype values('i4.国会奖申请','Transfer',true,0.9,NULL,NOW(),NOW());
insert into servicetype values('z.北京所购服务送的cc only申请','Transfer',0.9,true,NULL,NOW(),NOW());
insert into servicetype values('p.文书','Transfer',true,0.75,NULL,NOW(),NOW());
insert into servicetype values('f1.签证辅导普通','Visa',false,0.9,NULL,NOW(),NOW());
insert into servicetype values('f2.签证辅导VIP','Visa',false,0.9,NULL,NOW(),NOW());
insert into servicetype values('g.签证工具（PAP）','Visa',false,0.9,NULL,NOW(),NOW());
insert into servicetype values('h1.学术正轨','Study',false,0.9,NULL,NOW(),NOW());
insert into servicetype values('h2.早起鸟','Study',true,0.6,NULL,NOW(),NOW());
insert into servicetype values('h3.单科辅导','Study',false,0.6,NULL,NOW(),NOW());
insert into servicetype values('h4.托福辅导','Study',false,0.6,NULL,NOW(),NOW());
insert into servicetype values('h5.ASPIRE全套1年','Study',false,0.6,NULL,NOW(),NOW());
insert into servicetype values('h6.ASPIRE全套2年','Study',false,0.6,NULL,NOW(),NOW());
insert into servicetype values('h7.选课辅导','Study',false,0.6,NULL,NOW(),NOW());
insert into servicetype values('薛涌留美预科','Study',false,0.9,NULL,NOW(),NOW());
insert into servicetype values('紧急助理','Study',false,0.9,NULL,NOW(),NOW());
insert into servicetype values('选课指导','Study',false,0.9,NULL,NOW(),NOW());


#服务进度
insert into servicestatus values('W.等待启动',NULL,NOW(),NOW());
insert into servicestatus values('A.紧急处理中',NULL,NOW(),NOW());
insert into servicestatus values('B.提交进行中',NULL,NOW(),NOW());
insert into servicestatus values('C.已交等结果',NULL,NOW(),NOW());
insert into servicestatus values('D.服务结束',NULL,NOW(),NOW());

#销售角色
insert into salesrole values('紧急销售',0.06,0,NULL,NOW(),NOW());
insert into salesrole values('紧急专家',0.035,0,NULL,NOW(),NOW());
insert into salesrole values('转学销售',0.08,0,NULL,NOW(),NOW());
insert into salesrole values('转学专家',0.035,0,NULL,NOW(),NOW());
insert into salesrole values('紧急销售之协助签约1级',0.036,0,NULL,NOW(),NOW());
insert into salesrole values('紧急销售之协助签约2级',0.048,0,NULL,NOW(),NOW());
insert into salesrole values('转学销售之协助签约1级',0.048,0,NULL,NOW(),NOW());
insert into salesrole values('转学销售之协助签约2级',0.064,0,NULL,NOW(),NOW());
insert into salesrole values('薛涌销售',0.06,0,NULL,NOW(),NOW());
insert into salesrole values('紧急助理',0.06,0,NULL,NOW(),NOW());
insert into salesrole values('选课指导',0.06,0,NULL,NOW(),NOW());
insert into salesrole values('紧急协助签约2级',0.06,0,NULL,NOW(),NOW());
insert into salesrole values('紧急协助签约1级',0.06,0,NULL,NOW(),NOW());
insert into salesrole values('转学协助签约2级',0.06,0,NULL,NOW(),NOW());
insert into salesrole values('转学协助签约1级',0.06,0,NULL,NOW(),NOW());
insert into salesrole values('签证一次辅导&过',0.06,0,NULL,NOW(),NOW());
insert into salesrole values('签证一次辅导&不过',0.06,0,NULL,NOW(),NOW());
insert into salesrole values('签证第二次后辅导&不过',0.06,0,NULL,NOW(),NOW());
insert into salesrole values('签证2次辅活以上辅导&过',0.06,0,NULL,NOW(),NOW());
insert into salesrole values('无角色',0,0,NULL,NOW(),NOW());

#Now create some views for summary information
# This is the monthly Information. 
create or replace view MonthlySummary as 
(select 
IF(DAY(c.createdAt)>23,MONTH(c.createdAt)%12+1,MONTH(c.createdAt)) as 'M',
IF(DAY(c.createdAt)>23,YEAR(c.createdAt)+FLOOR(MONTH(c.createdAt)/12),YEAR(c.createdAt)) as 'Y',
sum(contractPrice) as '总收入',
count(*) as '总咨询量',
sum(IF(status.status like 'C%' or status.status like 'D%',1,0)) as '总签约量',
sum(IF(contractcategory.contractCategory like '%紧急%',1,0)) as '紧急咨询量',
sum(IF(contractcategory.contractCategory like '%紧急%' and (status.status like 'C%' or status.status like 'D%'),1,0))  as '紧急签约量',
sum(IF(contractcategory.contractCategory like '%紧急%' and (status.status like 'C%' or status.status like 'D%'),contractPrice,0))  as '紧急签约额',
sum(IF(contractcategory.contractCategory like '%转学%',1,0)) as '转学咨询量',
sum(IF(contractcategory.contractCategory like '%转学%' and (status.status like 'C%' or status.status like 'D%'),1,0))  as '转学签约量',
sum(IF(contractcategory.contractCategory like '%转学%' and (status.status like 'C%' or status.status like 'D%'),contractPrice,0))  as '转学签约额'
from contract c
left join contractcategory on c.contractCategory=contractcategory.id
left join status on c.status=status.id
group by M,Y) ;

create or replace view FullSummary as
select CONCAT(m1.M,'/',m1.Y) as 'Time',
m1.总收入,
(m1.总收入-m2.总收入)/m2.总收入 as '收入月增长率',
m1.总咨询量,
(m1.总咨询量-m2.总咨询量)/m2.总咨询量 as '咨询量月增长率',
m1.总签约量,
m1.总收入/m1.总签约量 as '平均签约价',
m1.紧急咨询量,
(m1.紧急咨询量-m2.紧急咨询量)/m2.紧急咨询量 as '紧急咨询量月增长率',
m1.紧急签约量,
m1.紧急签约额,
m1.紧急签约量/m1.紧急咨询量 as '紧急签约率',
m1.转学咨询量,
(m1.转学咨询量-m2.转学咨询量)/m2.转学咨询量 as '转学咨询量月增长率',
m1.转学签约量,
m1.转学签约额,
m1.转学签约量/m1.转学咨询量 as '转学签约率'
 from MonthlySummary m1 left join MonthlySummary m2 on m1.M=(m2.M%12+1) and m1.Y=m2.Y+FLOOR(m2.M/12);

 
# SALES COMISSION whole table or single 
DROP PROCEDURE IF EXISTS SalesComission;
delimiter ;;
create PROCEDURE SalesComission (uid int,sid int, start date, end date,single bool)
COMMENT ''
BEGIN
select user.id as "user",service.id as "service",contract.id as "contract",user.nickname,servicetype.serviceType,service.price,contractcomission.salesRole,salesrole.comissionPercent,salesrole.flatComission,servicetype.comission,contractcomission.extra,service.price*salesrole.comissionPercent*servicetype.comission+contractcomission.extra+salesrole.flatComission as "final" from user 
inner join contract on (contract.sales=user.id or contract.assistant=user.id or contract.assisCont=user.id or contract.expert=user.id)
inner join service on (service.contract=contract.id)
left join contractcomission on (user.id=contractcomission.user and service.id=contractcomission.service)
left join salesrole on (contractcomission.salesRole=salesrole.id)
left join servicetype on (service.serviceType=servicetype.id)
where ((single=false and (user.id=uid or uid=0 or user.boss=uid) and (service.id=sid or sid=0)) or (single=true and user.id=uid and service.id=sid))
 and (contract.contractSigned>start or start is null) and (contract.contractSigned<end or end is null);
END;;
delimiter ;

