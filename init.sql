use test;
#合同类型
insert into contractcategory values('社区转学/直升',NULL,NOW(),NOW());
insert into contractcategory values('紧急服务',NULL,NOW(),NOW());
insert into contractcategory values('高中转学/直升',NULL,NOW(),NOW());
insert into contractcategory values('大学转学/直升',NULL,NOW(),NOW());
insert into contractcategory values('研究生/博士申请',NULL,NOW(),NOW());
insert into contractcategory values('学术辅导',NULL,NOW(),NOW());
insert into contractcategory values('签证辅导',NULL,NOW(),NOW());
insert into contractcategory values('薛涌留学预备课程',NULL,NOW(),NOW());
insert into contractcategory values('Free Session',NULL,NOW(),NOW());
insert into contractcategory values('二次签约',NULL,NOW(),NOW());
insert into contractcategory values('其它',NULL,NOW(),NOW());

#Lead
insert into lead values('Campus校代介绍',NULL,NOW(),NOW());
insert into lead values('Web电话/网络',NULL,NOW(),NOW());
insert into lead values('Customer老客户介绍',NULL,NOW(),NOW());
insert into lead values('Friend熟人介绍',NULL,NOW(),NOW());
insert into lead values('Staff内部员工介绍',NULL,NOW(),NOW());
insert into lead values('Free Session',NULL,NOW(),NOW());
insert into lead values('Sec二次签约',NULL,NOW(),NOW());
insert into lead values('PreSale',NULL,NOW(),NOW());
insert into lead values('CA',NULL,NOW(),NOW());


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
insert into degree values('硕士',NULL,NOW(),NOW());
insert into degree values('博士',NULL,NOW(),NOW());

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

#服务
insert into servicetype values('a.澄清','Emerg',NULL,NOW(),NOW());
insert into servicetype values('b.申诉','Emerg',NULL,NOW(),NOW());
insert into servicetype values('c1.找律师','Emerg',NULL,NOW(),NOW());
insert into servicetype values('c2.带律师的申诉','Emerg',NULL,NOW(),NOW());
insert into servicetype values('d1.紧急服务之cc或语言申请','Emerg',NULL,NOW(),NOW());
insert into servicetype values('d2.紧急服务之高中申请','Emerg',NULL,NOW(),NOW());
insert into servicetype values('d3.紧急服务之大U申请','Emerg',NULL,NOW(),NOW());
insert into servicetype values('e.身份激活','Emerg',NULL,NOW(),NOW());
insert into servicetype values('i1.CC或语言申请','Transfer',NULL,NOW(),NOW());
insert into servicetype values('i2.高中申请','Transfer',NULL,NOW(),NOW());
insert into servicetype values('i3.大U申请(本或硕)','Transfer',NULL,NOW(),NOW());
insert into servicetype values('i4.国会奖申请','Transfer',NULL,NOW(),NOW());
insert into servicetype values('z.北京所购服务送的cc only申请','Transfer',NULL,NOW(),NOW());
insert into servicetype values('p.文书','Transfer',NULL,NOW(),NOW());
insert into servicetype values('f1.签证辅导普通','Visa',NULL,NOW(),NOW());
insert into servicetype values('f2.签证辅导VIP','Visa',NULL,NOW(),NOW());
insert into servicetype values('g.签证工具（PAP）','Visa',NULL,NOW(),NOW());
insert into servicetype values('h1.学术正轨','Study',NULL,NOW(),NOW());
insert into servicetype values('h2.早起鸟','Study',NULL,NOW(),NOW());
insert into servicetype values('h3.单科辅导','Study',NULL,NOW(),NOW());
insert into servicetype values('h4.托福辅导','Study',NULL,NOW(),NOW());
insert into servicetype values('h5.ASPIRE全套1年','Study',NULL,NOW(),NOW());
insert into servicetype values('h6.ASPIRE全套2年','Study',NULL,NOW(),NOW());
insert into servicetype values('h7.选课辅导','Study',NULL,NOW(),NOW());
