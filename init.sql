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
insert into lead values('官网在线咨询',NULL,NOW(),NOW());
insert into lead values('官方博客，微博',NULL,NOW(),NOW());
insert into lead values('陈航老师博客，微博',NULL,NOW(),NOW());
insert into lead values('搜索：谷歌',NULL,NOW(),NOW());
insert into lead values('搜索：百度',NULL,NOW(),NOW());
insert into lead values('搜索：Bing',NULL,NOW(),NOW());
insert into lead values('官方微信（厚仁教育科技）',NULL,NOW(),NOW());
insert into lead values('微信：厚仁学术哥 wholerenguru',NULL,NOW(),NOW());
insert into lead values('微信：美国转学 UStransfer',NULL,NOW(),NOW());
insert into lead values('微信：留美导师 USmentor',NULL,NOW(),NOW());
insert into lead values('邮件收到的Newsletter',NULL,NOW(),NOW());
insert into lead values('熟人，朋友推荐',NULL,NOW(),NOW());
insert into lead values('北美校园大使推荐',NULL,NOW(),NOW());
insert into lead values('合作：Moonbbs北美微论坛',NULL,NOW(),NOW());
insert into lead values('合作：洛杉矶华人资讯网',NULL,NOW(),NOW());
insert into lead values('合作：Gesoo',NULL,NOW(),NOW());
insert into lead values('合作：其他机构',NULL,NOW(),NOW());


#LeadLevel
insert into leadlevel values('L1：有互动，且信息完整',NULL,NOW(),NOW());
insert into leadlevel values('L2：有互动，但信息不完整',NULL,NOW(),NOW());
insert into leadlevel values('L0：老客户、二次签约、关系户',NULL,NOW(),NOW());
insert into leadlevel values('L3：无回复',NULL,NOW(),NOW());

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

#收款账户
insert into depositaccount values('北京BEIJING',NULL,NOW(),NOW());
insert into depositaccount values('美国US',NULL,NOW(),NOW());

#人员角色
insert into role values('销售',NULL,NOW(),NOW());
insert into role values('申请',NULL,NOW(),NOW());
insert into role values('市场',NULL,NOW(),NOW());
insert into role values('文书',NULL,NOW(),NOW());
insert into role values('专家',NULL,NOW(),NOW());
insert into role values('人事',NULL,NOW(),NOW());
insert into role values('加州',NULL,NOW(),NOW());
insert into role values('学术',NULL,NOW(),NOW());
	
#服务 TODO: add the recommended price and also base comission
insert into servicetype values('a.澄清','a','Emerg',false,0.9,NULL,NOW(),NOW());
insert into servicetype values('b.申诉','b','Emerg',false,0.9,NULL,NOW(),NOW());
insert into servicetype values('c1.找律师','c1','Emerg',false,0.5,NULL,NOW(),NOW());
insert into servicetype values('c2.带律师的申诉','c2','Emerg',false,0.5,NULL,NOW(),NOW());
insert into servicetype values('d1.紧急服务之cc或语言申请','d1','Emerg',true,0.9,NULL,NOW(),NOW());
insert into servicetype values('d2.紧急服务之高中申请','d2','Emerg',true,0.9,NULL,NOW(),NOW());
insert into servicetype values('d3.紧急服务之大U申请','d3','Emerg',true,0.9,NULL,NOW(),NOW());
insert into servicetype values('e.身份激活','e','Emerg',false,0.5,NULL,NOW(),NOW());
insert into servicetype values('j.$4500省心装(申诉+紧急转)','j','Emerg',true,0.9,NULL,NOW(),NOW());
insert into servicetype values('L.$7000 紧急礼包二','L','Emerg',true,0.82,NULL,NOW(),NOW());
insert into servicetype values('M.$11000, 紧急礼包4，全包','M','Emerg',true,0.85,NULL,NOW(),NOW());
insert into servicetype values('K.$5000正规+转学','K','Emerg',true,0.75,NULL,NOW(),NOW());
insert into servicetype values('i1.CC或语言申请','i1','Transfer',true,0.9,NULL,NOW(),NOW());
insert into servicetype values('i2.高中申请','i2','Transfer',true,0.9,NULL,NOW(),NOW());
insert into servicetype values('i3.大U申请(本或硕)','i3','Transfer',true,0.9,NULL,NOW(),NOW());
insert into servicetype values('i4.国会奖申请','i4','Transfer',true,0.9,NULL,NOW(),NOW());
insert into servicetype values('z.北京所购服务送的cc only申请','z','Transfer',0.9,true,NULL,NOW(),NOW());
insert into servicetype values('p.文书','p','Transfer',true,0.75,NULL,NOW(),NOW());
insert into servicetype values('f1.签证辅导普通','f1','Visa',false,0.9,NULL,NOW(),NOW());
insert into servicetype values('f2.签证辅导VIP','f2','Visa',false,0.9,NULL,NOW(),NOW());
insert into servicetype values('g.签证工具（PAP）','g','Visa',false,0.9,NULL,NOW(),NOW());
insert into servicetype values('h1.学术正轨','h1','Study',false,0.9,NULL,NOW(),NOW());
insert into servicetype values('h2.早起鸟','h2','Study',true,0.6,NULL,NOW(),NOW());
insert into servicetype values('h3.单科辅导','h3','Study',false,0.6,NULL,NOW(),NOW());
insert into servicetype values('h4.托福辅导','h4','Study',false,0.6,NULL,NOW(),NOW());
insert into servicetype values('h5.ASPIRE全套1年','h5','Study',false,0.6,NULL,NOW(),NOW());
insert into servicetype values('h6.ASPIRE全套2年','h6','Study',false,0.6,NULL,NOW(),NOW());
insert into servicetype values('h7.选课辅导','h7','Study',false,0.6,NULL,NOW(),NOW());
insert into servicetype values('薛涌留美预科','薛涌','Study',false,0.9,NULL,NOW(),NOW());
insert into servicetype values('紧急助理','助理','Study',false,0.9,NULL,NOW(),NOW());
insert into servicetype values('选课指导','选课','Study',false,0.9,NULL,NOW(),NOW());

#Service Progress	
#insert into serviceprogress values('W.等待启动',NULL,NOW(),NOW());
#insert into serviceprogress values('A.紧急处理中',NULL,NOW(),NOW());
#insert into serviceprogress values('B.提交进行中',NULL,NOW(),NOW());
#insert into serviceprogress values('C.已交等结果',NULL,NOW(),NOW());
#insert into serviceprogress values('D.服务结束',NULL,NOW(),NOW());
insert into serviceprogress values('0等待启动',NULL,NOW(),NOW());
insert into serviceprogress values('1选校中',NULL,NOW(),NOW());
insert into serviceprogress values('2申请中',NULL,NOW(),NOW());
insert into serviceprogress values('3全部提交',NULL,NOW(),NOW());
insert into serviceprogress values('4完成服务',NULL,NOW(),NOW());
insert into serviceprogress values('X自我放弃X',NULL,NOW(),NOW());
insert into serviceprogress values('**找到我**',NULL,NOW(),NOW());
insert into serviceprogress values('**勿忘我**',NULL,NOW(),NOW());
insert into serviceprogress values('SOS紧急处理中',NULL,NOW(),NOW());
insert into serviceprogress values('交接出去了',NULL,NOW(),NOW());



#服务进度
insert into servicestatus values('无',NULL,NOW(),NOW());
insert into servicestatus values('进入服务',NULL,NOW(),NOW());
insert into servicestatus values('选校确定',NULL,NOW(),NOW());
insert into servicestatus values('提交申请',NULL,NOW(),NOW());
insert into servicestatus values('录取佣金',NULL,NOW(),NOW());
insert into servicestatus values('完成服务',NULL,NOW(),NOW());
insert into servicestatus values('文书启动',NULL,NOW(),NOW());
insert into servicestatus values('提交文书',NULL,NOW(),NOW());
insert into servicestatus values('拿到录取',NULL,NOW(),NOW());
#销售角色
insert into salesrole values('紧急销售',0.06,0,NULL,NOW(),NOW());
insert into salesrole values('紧急专家',0.035,0,NULL,NOW(),NOW());
insert into salesrole values('转学销售',0.08,0,NULL,NOW(),NOW());
insert into salesrole values('转学专家',0.035,0,NULL,NOW(),NOW());
#insert into salesrole values('销售之协助签约1级',0.036,0,NULL,NOW(),NOW());
#insert into salesrole values('销售之协助签约2级',0.048,0,NULL,NOW(),NOW());
insert into salesrole values('销售之协助签约1级',0.048,0,NULL,NOW(),NOW());
insert into salesrole values('销售之协助签约2级',0.064,0,NULL,NOW(),NOW());
insert into salesrole values('薛涌销售',0.06,0,NULL,NOW(),NOW());
insert into salesrole values('紧急助理',0.06,0,NULL,NOW(),NOW());
insert into salesrole values('选课指导',0.06,0,NULL,NOW(),NOW());
#insert into salesrole values('紧急协助签约2级',0.06,0,NULL,NOW(),NOW());
#insert into salesrole values('紧急协助签约1级',0.06,0,NULL,NOW(),NOW());
insert into salesrole values('转学协助签约2级',0.032,0,NULL,NOW(),NOW());
insert into salesrole values('转学协助签约1级',0.016,0,NULL,NOW(),NOW());
insert into salesrole values('签证一次辅导&过',0,133,NULL,NOW(),NOW());
insert into salesrole values('签证一次辅导&不过',0,50,NULL,NOW(),NOW());
insert into salesrole values('签证第二次后辅导&不过',0,17,NULL,NOW(),NOW());
insert into salesrole values('签证2次辅活以上辅导&过',0,83,NULL,NOW(),NOW());
insert into salesrole values('助签销售Level1',0.016,0,NULL,NOW(),NOW());
insert into salesrole values('助签销售Level2',0,032,NULL,NOW(),NOW());
insert into salesrole values('申请合作助签Level1',0.015,0,NULL,NOW(),NOW());
insert into salesrole values('申请合作助签Level2',0.035,0,NULL,NOW(),NOW());
insert into salesrole values('独立助签',0.05,0,NULL,NOW(),NOW());
insert into salesrole values('Lead介绍人(陌生)',0.075,0,NULL,NOW(),NOW());
insert into salesrole values('无角色',0,0,NULL,NOW(),NOW());

#后期角色
insert into servrole values('负责老师',NULL,NOW(),NOW());
insert into servrole values('申请全负责老师',NULL,NOW(),NOW());
insert into servrole values('申请老师',NULL,NOW(),NOW());
insert into servrole values('选校专家',NULL,NOW(),NOW());
insert into servrole values('文书全负责老师',NULL,NOW(),NOW());
insert into servrole values('文书专家',NULL,NOW(),NOW());
insert into servrole values('文书编辑',NULL,NOW(),NOW());
insert into servrole values('Native editor',NULL,NOW(),NOW());
insert into servrole values('无角色',NULL,NOW(),NOW());
#文书LEVEL
insert into servlevel values('H1',NULL,NOW(),NOW());
insert into servlevel values('H2',NULL,NOW(),NOW());
insert into servlevel values('U1',NULL,NOW(),NOW());
insert into servlevel values('U2',NULL,NOW(),NOW());
insert into servlevel values('U3',NULL,NOW(),NOW());
insert into servlevel values('U4',NULL,NOW(),NOW());
insert into servlevel values('U5',NULL,NOW(),NOW());
insert into servlevel values('U6',NULL,NOW(),NOW());
insert into servlevel values('UR',NULL,NOW(),NOW());
insert into servlevel values('D1',NULL,NOW(),NOW());
insert into servlevel values('D2',NULL,NOW(),NOW());
insert into servlevel values('D3',NULL,NOW(),NOW());
insert into servlevel values('D4',NULL,NOW(),NOW());
insert into servlevel values('DR',NULL,NOW(),NOW());

#UserLevel
insert into userlevel values('C1',1,NULL,NOW(),NOW());
insert into userlevel values('C2',1,NULL,NOW(),NOW());
insert into userlevel values('C3',1,NULL,NOW(),NOW());

#Notification interval
insert into notifyinterval values(1,'Day 1 ',NULL,NOW(),NOW());
insert into notifyinterval values(3,'Day 3 ',NULL,NOW(),NOW());
insert into notifyinterval values(6,'Day 6 ',NULL,NOW(),NOW());
insert into notifyinterval values(9,'Day 9 ',NULL,NOW(),NOW());
insert into notifyinterval values(15,'Day 15 ',NULL,NOW(),NOW());
insert into notifyinterval values(30,'Day 30 ',NULL,NOW(),NOW());

# Now hard part 服务佣金的lookup table
select id from servicetype where serviceType like 'a%' into @stype;
select id from servrole where servRole ='负责老师' into @srole;
select id from servicestatus where serviceStatus ='进入服务' into @sprogress1;
select id from servicestatus where serviceStatus ='选校确定' into @sprogress2;
select id from servicestatus where serviceStatus ='提交申请' into @sprogress3;
select id from servicestatus where serviceStatus ='录取佣金' into @sprogress4;
select id from servicestatus where serviceStatus ='完成服务' into @sprogress5;
insert into servcomissionlookup values(@stype,@srole,NULL,0,30,@sprogress1,0.5,0,NULL,NOW(),NOW());
insert into servcomissionlookup values(@stype,@srole,NULL,0,30,@sprogress5,0.5,0,NULL,NOW(),NOW());
select id from servicetype where serviceType like 'b%' into @stype;	
insert into servcomissionlookup values(@stype,@srole,NULL,0,100,@sprogress1,0.5,0,NULL,NOW(),NOW());
insert into servcomissionlookup values(@stype,@srole,NULL,0,100,@sprogress5,0.5,0,NULL,NOW(),NOW());
select id from servicetype where serviceType like 'c1%' into @stype;	
insert into servcomissionlookup values(@stype,@srole,NULL,0,50,@sprogress1,0.5,0,NULL,NOW(),NOW());
insert into servcomissionlookup values(@stype,@srole,NULL,0,50,@sprogress5,0.5,0,NULL,NOW(),NOW());
select id from servicetype where serviceType like 'c2%' into @stype;	
insert into servcomissionlookup values(@stype,@srole,NULL,0,50,@sprogress1,0.5,0,NULL,NOW(),NOW());
insert into servcomissionlookup values(@stype,@srole,NULL,0,50,@sprogress5,0.5,0,NULL,NOW(),NOW());
select id from servicetype where serviceType like 'e%' into @stype;	
insert into servcomissionlookup values(@stype,@srole,NULL,0,50,@sprogress1,0.5,0,NULL,NOW(),NOW());
insert into servcomissionlookup values(@stype,@srole,NULL,0,50,@sprogress5,0.5,0,NULL,NOW(),NOW());

# 申请类
select id from servicetype where serviceType like 'd1%' into @stype;	
insert into servcomissionlookup values(@stype,@srole,NULL,50,0,@sprogress1,0.2,0,NULL,NOW(),NOW());
insert into servcomissionlookup values(@stype,@srole,NULL,50,0,@sprogress2,0.2,0,NULL,NOW(),NOW());
insert into servcomissionlookup values(@stype,@srole,NULL,50,0,@sprogress3,0.3,0,NULL,NOW(),NOW());
insert into servcomissionlookup values(@stype,@srole,NULL,50,0,@sprogress4,0.3,0,NULL,NOW(),NOW());
select id from servicetype where serviceType like 'd2%' into @stype;	
insert into servcomissionlookup values(@stype,@srole,NULL,50,0,@sprogress1,0.2,0,NULL,NOW(),NOW());
insert into servcomissionlookup values(@stype,@srole,NULL,50,0,@sprogress2,0.2,0,NULL,NOW(),NOW());
insert into servcomissionlookup values(@stype,@srole,NULL,50,0,@sprogress3,0.3,0,NULL,NOW(),NOW());
insert into servcomissionlookup values(@stype,@srole,NULL,50,0,@sprogress4,0.3,0,NULL,NOW(),NOW());
select id from servicetype where serviceType like 'd3%' into @stype;	
insert into servcomissionlookup values(@stype,@srole,NULL,100,0,@sprogress1,0.2,0,NULL,NOW(),NOW());
insert into servcomissionlookup values(@stype,@srole,NULL,100,0,@sprogress2,0.2,0,NULL,NOW(),NOW());
insert into servcomissionlookup values(@stype,@srole,NULL,100,0,@sprogress3,0.3,0,NULL,NOW(),NOW());
insert into servcomissionlookup values(@stype,@srole,NULL,100,0,@sprogress4,0.3,0,NULL,NOW(),NOW());
select id from servicetype where serviceType like 'i1%' into @stype;	
insert into servcomissionlookup values(@stype,@srole,NULL,50,0,@sprogress1,0.2,0,NULL,NOW(),NOW());
insert into servcomissionlookup values(@stype,@srole,NULL,50,0,@sprogress2,0.2,0,NULL,NOW(),NOW());
insert into servcomissionlookup values(@stype,@srole,NULL,50,0,@sprogress3,0.3,0,NULL,NOW(),NOW());
insert into servcomissionlookup values(@stype,@srole,NULL,50,0,@sprogress4,0.3,0,NULL,NOW(),NOW());
select id from servicetype where serviceType like 'i2%' into @stype;	
insert into servcomissionlookup values(@stype,@srole,NULL,50,0,@sprogress1,0.2,0,NULL,NOW(),NOW());
insert into servcomissionlookup values(@stype,@srole,NULL,50,0,@sprogress2,0.2,0,NULL,NOW(),NOW());
insert into servcomissionlookup values(@stype,@srole,NULL,50,0,@sprogress3,0.3,0,NULL,NOW(),NOW());
insert into servcomissionlookup values(@stype,@srole,NULL,50,0,@sprogress4,0.3,0,NULL,NOW(),NOW());
select id from servicetype where serviceType like 'z%' into @stype;	
insert into servcomissionlookup values(@stype,@srole,NULL,30,0,@sprogress1,0.2,0,NULL,NOW(),NOW());
insert into servcomissionlookup values(@stype,@srole,NULL,30,0,@sprogress2,0.2,0,NULL,NOW(),NOW());
insert into servcomissionlookup values(@stype,@srole,NULL,30,0,@sprogress3,0.3,0,NULL,NOW(),NOW());
insert into servcomissionlookup values(@stype,@srole,NULL,30,0,@sprogress4,0.3,0,NULL,NOW(),NOW());
select id from servicetype where serviceType like 'i3%' into @stype;	
select id from servrole where servRole ='申请全负责老师' into @srole;
insert into servcomissionlookup values(@stype,@srole,NULL,65,0,@sprogress1,0.2,0,NULL,NOW(),NOW());
insert into servcomissionlookup values(@stype,@srole,NULL,65,0,@sprogress2,0.2,0,NULL,NOW(),NOW());
insert into servcomissionlookup values(@stype,@srole,NULL,65,0,@sprogress3,0.3,0,NULL,NOW(),NOW());
insert into servcomissionlookup values(@stype,@srole,NULL,65,0,@sprogress4,0.3,0,NULL,NOW(),NOW());
select id from servrole where servRole ='申请老师' into @srole;
insert into servcomissionlookup values(@stype,@srole,NULL,30,0,@sprogress1,0,50,NULL,NOW(),NOW());
insert into servcomissionlookup values(@stype,@srole,NULL,30,0,@sprogress2,0,100,NULL,NOW(),NOW());
insert into servcomissionlookup values(@stype,@srole,NULL,30,0,@sprogress3,0.7,0,NULL,NOW(),NOW());
insert into servcomissionlookup values(@stype,@srole,NULL,30,0,@sprogress4,0.3,0,NULL,NOW(),NOW());
select id from servrole where servRole ='选校专家' into @srole;
insert into servcomissionlookup values(@stype,@srole,NULL,0,0,@sprogress1,0,60,NULL,NOW(),NOW());
insert into servcomissionlookup values(@stype,@srole,NULL,0,0,@sprogress2,0,60,NULL,NOW(),NOW());
insert into servcomissionlookup values(@stype,@srole,NULL,0,0,@sprogress3,0.7,0,NULL,NOW(),NOW());
insert into servcomissionlookup values(@stype,@srole,NULL,0,0,@sprogress4,0.3,0,NULL,NOW(),NOW());

#文书单卖
select id from servicestatus where serviceStatus ='文书启动' into @sprogress1;
select id from servicestatus where serviceStatus ='提交文书' into @sprogress2;
select id from servicestatus where serviceStatus ='拿到录取' into @sprogress3;
select id from servicetype where serviceType like 'p%' into @stype;
select id from servrole where servRole ='文书全负责老师' into @srole;
select id from servlevel where servLevel ='D1' into @slevel;
insert into servcomissionlookup values(@stype,@srole,@slevel,0,60,@sprogress1,0.5,0,NULL,NOW(),NOW());
insert into servcomissionlookup values(@stype,@srole,@slevel,0,60,@sprogress2,0.5,0,NULL,NOW(),NOW());
select id from servlevel where servLevel ='D2' into @slevel;
insert into servcomissionlookup values(@stype,@srole,@slevel,0,70,@sprogress1,0.5,0,NULL,NOW(),NOW());
insert into servcomissionlookup values(@stype,@srole,@slevel,0,70,@sprogress2,0.5,0,NULL,NOW(),NOW());
select id from servlevel where servLevel ='D3' into @slevel;
insert into servcomissionlookup values(@stype,@srole,@slevel,0,80,@sprogress1,0.5,0,NULL,NOW(),NOW());
insert into servcomissionlookup values(@stype,@srole,@slevel,0,80,@sprogress2,0.5,0,NULL,NOW(),NOW());
select id from servlevel where servLevel ='D4' into @slevel;
insert into servcomissionlookup values(@stype,@srole,@slevel,0,100,@sprogress1,0.5,0,NULL,NOW(),NOW());
insert into servcomissionlookup values(@stype,@srole,@slevel,0,100,@sprogress2,0.5,0,NULL,NOW(),NOW());
select id from servlevel where servLevel ='DR' into @slevel;
insert into servcomissionlookup values(@stype,@srole,@slevel,0,30,@sprogress1,0.5,0,NULL,NOW(),NOW());
insert into servcomissionlookup values(@stype,@srole,@slevel,0,30,@sprogress2,0.5,0,NULL,NOW(),NOW());
select id from servrole where servRole ='文书专家' into @srole;
select id from servlevel where servLevel ='D1' into @slevel;
insert into servcomissionlookup values(@stype,@srole,@slevel,0,40,@sprogress1,0.5,0,NULL,NOW(),NOW());
insert into servcomissionlookup values(@stype,@srole,@slevel,0,40,@sprogress2,0.5,0,NULL,NOW(),NOW());
select id from servlevel where servLevel ='D2' into @slevel;
insert into servcomissionlookup values(@stype,@srole,@slevel,0,50,@sprogress1,0.5,0,NULL,NOW(),NOW());
insert into servcomissionlookup values(@stype,@srole,@slevel,0,50,@sprogress2,0.5,0,NULL,NOW(),NOW());
select id from servlevel where servLevel ='D3' into @slevel;
insert into servcomissionlookup values(@stype,@srole,@slevel,0,60,@sprogress1,0.5,0,NULL,NOW(),NOW());
insert into servcomissionlookup values(@stype,@srole,@slevel,0,60,@sprogress2,0.5,0,NULL,NOW(),NOW());
select id from servlevel where servLevel ='D4' into @slevel;
insert into servcomissionlookup values(@stype,@srole,@slevel,0,70,@sprogress1,0.5,0,NULL,NOW(),NOW());
insert into servcomissionlookup values(@stype,@srole,@slevel,0,70,@sprogress2,0.5,0,NULL,NOW(),NOW());
select id from servlevel where servLevel ='DR' into @slevel;
insert into servcomissionlookup values(@stype,@srole,@slevel,0,20,@sprogress1,0.5,0,NULL,NOW(),NOW());
insert into servcomissionlookup values(@stype,@srole,@slevel,0,20,@sprogress2,0.5,0,NULL,NOW(),NOW());
select id from servrole where servRole ='文书编辑' into @srole;
select id from servlevel where servLevel ='D1' into @slevel;
insert into servcomissionlookup values(@stype,@srole,@slevel,0,20,@sprogress1,0.5,0,NULL,NOW(),NOW());
insert into servcomissionlookup values(@stype,@srole,@slevel,0,20,@sprogress2,0.5,0,NULL,NOW(),NOW());
select id from servlevel where servLevel ='D2' into @slevel;
insert into servcomissionlookup values(@stype,@srole,@slevel,0,20,@sprogress1,0.5,0,NULL,NOW(),NOW());
insert into servcomissionlookup values(@stype,@srole,@slevel,0,20,@sprogress2,0.5,0,NULL,NOW(),NOW());
select id from servlevel where servLevel ='D3' into @slevel;
insert into servcomissionlookup values(@stype,@srole,@slevel,0,20,@sprogress1,0.5,0,NULL,NOW(),NOW());
insert into servcomissionlookup values(@stype,@srole,@slevel,0,20,@sprogress2,0.5,0,NULL,NOW(),NOW());
select id from servlevel where servLevel ='D4' into @slevel;
insert into servcomissionlookup values(@stype,@srole,@slevel,0,30,@sprogress1,0.5,0,NULL,NOW(),NOW());
insert into servcomissionlookup values(@stype,@srole,@slevel,0,30,@sprogress2,0.5,0,NULL,NOW(),NOW());
select id from servlevel where servLevel ='DR' into @slevel;
insert into servcomissionlookup values(@stype,@srole,@slevel,0,10,@sprogress1,0.5,0,NULL,NOW(),NOW());
insert into servcomissionlookup values(@stype,@srole,@slevel,0,10,@sprogress2,0.5,0,NULL,NOW(),NOW());
select id from servrole where servRole ='Native editor' into @srole;
select id from servlevel where servLevel ='D1' into @slevel;
insert into servcomissionlookup values(@stype,@srole,@slevel,0,40,@sprogress1,0.5,0,NULL,NOW(),NOW());
insert into servcomissionlookup values(@stype,@srole,@slevel,0,40,@sprogress2,0.5,0,NULL,NOW(),NOW());
select id from servlevel where servLevel ='D2' into @slevel;
insert into servcomissionlookup values(@stype,@srole,@slevel,0,50,@sprogress1,0.5,0,NULL,NOW(),NOW());
insert into servcomissionlookup values(@stype,@srole,@slevel,0,50,@sprogress2,0.5,0,NULL,NOW(),NOW());
select id from servlevel where servLevel ='D3' into @slevel;
insert into servcomissionlookup values(@stype,@srole,@slevel,0,60,@sprogress1,0.5,0,NULL,NOW(),NOW());
insert into servcomissionlookup values(@stype,@srole,@slevel,0,60,@sprogress2,0.5,0,NULL,NOW(),NOW());
select id from servlevel where servLevel ='D4' into @slevel;
insert into servcomissionlookup values(@stype,@srole,@slevel,0,70,@sprogress1,0.5,0,NULL,NOW(),NOW());
insert into servcomissionlookup values(@stype,@srole,@slevel,0,70,@sprogress2,0.5,0,NULL,NOW(),NOW());
select id from servlevel where servLevel ='DR' into @slevel;
insert into servcomissionlookup values(@stype,@srole,@slevel,0,20,@sprogress1,0.5,0,NULL,NOW(),NOW());
insert into servcomissionlookup values(@stype,@srole,@slevel,0,20,@sprogress2,0.5,0,NULL,NOW(),NOW());

#所有文书服务

SET @stype=0;
select id from servrole where servRole ='文书全负责老师' into @srole;
select id from servlevel where servLevel ='H1' into @slevel;
insert into servcomissionlookup values(@stype,@srole,@slevel,0,50,@sprogress1,0.3,0,NULL,NOW(),NOW());
insert into servcomissionlookup values(@stype,@srole,@slevel,0,50,@sprogress2,0.4,0,NULL,NOW(),NOW());
insert into servcomissionlookup values(@stype,@srole,@slevel,0,50,@sprogress3,0.3,0,NULL,NOW(),NOW());
select id from servlevel where servLevel ='H2' into @slevel;
insert into servcomissionlookup values(@stype,@srole,@slevel,0,100,@sprogress1,0.3,0,NULL,NOW(),NOW());
insert into servcomissionlookup values(@stype,@srole,@slevel,0,100,@sprogress2,0.4,0,NULL,NOW(),NOW());
insert into servcomissionlookup values(@stype,@srole,@slevel,0,100,@sprogress3,0.3,0,NULL,NOW(),NOW());
select id from servlevel where servLevel ='U1' into @slevel;
insert into servcomissionlookup values(@stype,@srole,@slevel,0,70,@sprogress1,0.3,0,NULL,NOW(),NOW());
insert into servcomissionlookup values(@stype,@srole,@slevel,0,70,@sprogress2,0.4,0,NULL,NOW(),NOW());
insert into servcomissionlookup values(@stype,@srole,@slevel,0,70,@sprogress3,0.3,0,NULL,NOW(),NOW());
select id from servlevel where servLevel ='U2' into @slevel;
insert into servcomissionlookup values(@stype,@srole,@slevel,0,140,@sprogress1,0.3,0,NULL,NOW(),NOW());
insert into servcomissionlookup values(@stype,@srole,@slevel,0,140,@sprogress2,0.4,0,NULL,NOW(),NOW());
insert into servcomissionlookup values(@stype,@srole,@slevel,0,140,@sprogress3,0.3,0,NULL,NOW(),NOW());
select id from servlevel where servLevel ='U3' into @slevel;
insert into servcomissionlookup values(@stype,@srole,@slevel,0,200,@sprogress1,0.3,0,NULL,NOW(),NOW());
insert into servcomissionlookup values(@stype,@srole,@slevel,0,200,@sprogress2,0.4,0,NULL,NOW(),NOW());
insert into servcomissionlookup values(@stype,@srole,@slevel,0,200,@sprogress3,0.3,0,NULL,NOW(),NOW());
select id from servlevel where servLevel ='U4' into @slevel;
insert into servcomissionlookup values(@stype,@srole,@slevel,0,300,@sprogress1,0.3,0,NULL,NOW(),NOW());
insert into servcomissionlookup values(@stype,@srole,@slevel,0,300,@sprogress2,0.4,0,NULL,NOW(),NOW());
insert into servcomissionlookup values(@stype,@srole,@slevel,0,300,@sprogress3,0.3,0,NULL,NOW(),NOW());
select id from servlevel where servLevel ='U5' into @slevel;
insert into servcomissionlookup values(@stype,@srole,@slevel,0,400,@sprogress1,0.3,0,NULL,NOW(),NOW());
insert into servcomissionlookup values(@stype,@srole,@slevel,0,400,@sprogress2,0.4,0,NULL,NOW(),NOW());
insert into servcomissionlookup values(@stype,@srole,@slevel,0,400,@sprogress3,0.3,0,NULL,NOW(),NOW());
select id from servlevel where servLevel ='U6' into @slevel;
insert into servcomissionlookup values(@stype,@srole,@slevel,0,500,@sprogress1,0.3,0,NULL,NOW(),NOW());
insert into servcomissionlookup values(@stype,@srole,@slevel,0,500,@sprogress2,0.4,0,NULL,NOW(),NOW());
insert into servcomissionlookup values(@stype,@srole,@slevel,0,500,@sprogress3,0.3,0,NULL,NOW(),NOW());
select id from servlevel where servLevel ='UR' into @slevel;
insert into servcomissionlookup values(@stype,@srole,@slevel,0,30,@sprogress1,0.3,0,NULL,NOW(),NOW());
insert into servcomissionlookup values(@stype,@srole,@slevel,0,30,@sprogress2,0.4,0,NULL,NOW(),NOW());
insert into servcomissionlookup values(@stype,@srole,@slevel,0,30,@sprogress3,0.3,0,NULL,NOW(),NOW());
select id from servrole where servRole ='文书专家' into @srole;
select id from servlevel where servLevel ='H1' into @slevel;
insert into servcomissionlookup values(@stype,@srole,@slevel,0,35,@sprogress1,0.3,0,NULL,NOW(),NOW());
insert into servcomissionlookup values(@stype,@srole,@slevel,0,35,@sprogress2,0.4,0,NULL,NOW(),NOW());
insert into servcomissionlookup values(@stype,@srole,@slevel,0,35,@sprogress3,0.3,0,NULL,NOW(),NOW());
select id from servlevel where servLevel ='H2' into @slevel;
insert into servcomissionlookup values(@stype,@srole,@slevel,0,70,@sprogress1,0.3,0,NULL,NOW(),NOW());
insert into servcomissionlookup values(@stype,@srole,@slevel,0,70,@sprogress2,0.4,0,NULL,NOW(),NOW());
insert into servcomissionlookup values(@stype,@srole,@slevel,0,70,@sprogress3,0.3,0,NULL,NOW(),NOW());
select id from servlevel where servLevel ='U1' into @slevel;
insert into servcomissionlookup values(@stype,@srole,@slevel,0,49,@sprogress1,0.3,0,NULL,NOW(),NOW());
insert into servcomissionlookup values(@stype,@srole,@slevel,0,49,@sprogress2,0.4,0,NULL,NOW(),NOW());
insert into servcomissionlookup values(@stype,@srole,@slevel,0,49,@sprogress3,0.3,0,NULL,NOW(),NOW());
select id from servlevel where servLevel ='U2' into @slevel;
insert into servcomissionlookup values(@stype,@srole,@slevel,0,98,@sprogress1,0.3,0,NULL,NOW(),NOW());
insert into servcomissionlookup values(@stype,@srole,@slevel,0,98,@sprogress2,0.4,0,NULL,NOW(),NOW());
insert into servcomissionlookup values(@stype,@srole,@slevel,0,98,@sprogress3,0.3,0,NULL,NOW(),NOW());
select id from servlevel where servLevel ='U3' into @slevel;
insert into servcomissionlookup values(@stype,@srole,@slevel,0,140,@sprogress1,0.3,0,NULL,NOW(),NOW());
insert into servcomissionlookup values(@stype,@srole,@slevel,0,140,@sprogress2,0.4,0,NULL,NOW(),NOW());
insert into servcomissionlookup values(@stype,@srole,@slevel,0,140,@sprogress3,0.3,0,NULL,NOW(),NOW());
select id from servlevel where servLevel ='U4' into @slevel;
insert into servcomissionlookup values(@stype,@srole,@slevel,0,210,@sprogress1,0.3,0,NULL,NOW(),NOW());
insert into servcomissionlookup values(@stype,@srole,@slevel,0,210,@sprogress2,0.4,0,NULL,NOW(),NOW());
insert into servcomissionlookup values(@stype,@srole,@slevel,0,210,@sprogress3,0.3,0,NULL,NOW(),NOW());
select id from servlevel where servLevel ='U5' into @slevel;
insert into servcomissionlookup values(@stype,@srole,@slevel,0,280,@sprogress1,0.3,0,NULL,NOW(),NOW());
insert into servcomissionlookup values(@stype,@srole,@slevel,0,280,@sprogress2,0.4,0,NULL,NOW(),NOW());
insert into servcomissionlookup values(@stype,@srole,@slevel,0,280,@sprogress3,0.3,0,NULL,NOW(),NOW());
select id from servlevel where servLevel ='U6' into @slevel;
insert into servcomissionlookup values(@stype,@srole,@slevel,0,350,@sprogress1,0.3,0,NULL,NOW(),NOW());
insert into servcomissionlookup values(@stype,@srole,@slevel,0,350,@sprogress2,0.4,0,NULL,NOW(),NOW());
insert into servcomissionlookup values(@stype,@srole,@slevel,0,350,@sprogress3,0.3,0,NULL,NOW(),NOW());
select id from servlevel where servLevel ='UR' into @slevel;
insert into servcomissionlookup values(@stype,@srole,@slevel,0,21,@sprogress1,0.3,0,NULL,NOW(),NOW());
insert into servcomissionlookup values(@stype,@srole,@slevel,0,21,@sprogress2,0.4,0,NULL,NOW(),NOW());
insert into servcomissionlookup values(@stype,@srole,@slevel,0,21,@sprogress3,0.3,0,NULL,NOW(),NOW());
select id from servrole where servRole ='文书编辑' into @srole;
select id from servlevel where servLevel ='H1' into @slevel;
insert into servcomissionlookup values(@stype,@srole,@slevel,0,15,@sprogress1,0.3,0,NULL,NOW(),NOW());
insert into servcomissionlookup values(@stype,@srole,@slevel,0,15,@sprogress2,0.4,0,NULL,NOW(),NOW());
insert into servcomissionlookup values(@stype,@srole,@slevel,0,15,@sprogress3,0.3,0,NULL,NOW(),NOW());
select id from servlevel where servLevel ='H2' into @slevel;
insert into servcomissionlookup values(@stype,@srole,@slevel,0,30,@sprogress1,0.3,0,NULL,NOW(),NOW());
insert into servcomissionlookup values(@stype,@srole,@slevel,0,30,@sprogress2,0.4,0,NULL,NOW(),NOW());
insert into servcomissionlookup values(@stype,@srole,@slevel,0,30,@sprogress3,0.3,0,NULL,NOW(),NOW());
select id from servlevel where servLevel ='U1' into @slevel;
insert into servcomissionlookup values(@stype,@srole,@slevel,0,21,@sprogress1,0.3,0,NULL,NOW(),NOW());
insert into servcomissionlookup values(@stype,@srole,@slevel,0,21,@sprogress2,0.4,0,NULL,NOW(),NOW());
insert into servcomissionlookup values(@stype,@srole,@slevel,0,21,@sprogress3,0.3,0,NULL,NOW(),NOW());
select id from servlevel where servLevel ='U2' into @slevel;
insert into servcomissionlookup values(@stype,@srole,@slevel,0,42,@sprogress1,0.3,0,NULL,NOW(),NOW());
insert into servcomissionlookup values(@stype,@srole,@slevel,0,42,@sprogress2,0.4,0,NULL,NOW(),NOW());
insert into servcomissionlookup values(@stype,@srole,@slevel,0,42,@sprogress3,0.3,0,NULL,NOW(),NOW());
select id from servlevel where servLevel ='U3' into @slevel;
insert into servcomissionlookup values(@stype,@srole,@slevel,0,60,@sprogress1,0.3,0,NULL,NOW(),NOW());
insert into servcomissionlookup values(@stype,@srole,@slevel,0,60,@sprogress2,0.4,0,NULL,NOW(),NOW());
insert into servcomissionlookup values(@stype,@srole,@slevel,0,60,@sprogress3,0.3,0,NULL,NOW(),NOW());
select id from servlevel where servLevel ='U4' into @slevel;
insert into servcomissionlookup values(@stype,@srole,@slevel,0,90,@sprogress1,0.3,0,NULL,NOW(),NOW());
insert into servcomissionlookup values(@stype,@srole,@slevel,0,90,@sprogress2,0.4,0,NULL,NOW(),NOW());
insert into servcomissionlookup values(@stype,@srole,@slevel,0,90,@sprogress3,0.3,0,NULL,NOW(),NOW());
select id from servlevel where servLevel ='U5' into @slevel;
insert into servcomissionlookup values(@stype,@srole,@slevel,0,120,@sprogress1,0.3,0,NULL,NOW(),NOW());
insert into servcomissionlookup values(@stype,@srole,@slevel,0,120,@sprogress2,0.4,0,NULL,NOW(),NOW());
insert into servcomissionlookup values(@stype,@srole,@slevel,0,120,@sprogress3,0.3,0,NULL,NOW(),NOW());
select id from servlevel where servLevel ='U6' into @slevel;
insert into servcomissionlookup values(@stype,@srole,@slevel,0,150,@sprogress1,0.3,0,NULL,NOW(),NOW());
insert into servcomissionlookup values(@stype,@srole,@slevel,0,150,@sprogress2,0.4,0,NULL,NOW(),NOW());
insert into servcomissionlookup values(@stype,@srole,@slevel,0,150,@sprogress3,0.3,0,NULL,NOW(),NOW());
select id from servlevel where servLevel ='UR' into @slevel;
insert into servcomissionlookup values(@stype,@srole,@slevel,0,9,@sprogress1,0.3,0,NULL,NOW(),NOW());
insert into servcomissionlookup values(@stype,@srole,@slevel,0,9,@sprogress2,0.4,0,NULL,NOW(),NOW());
insert into servcomissionlookup values(@stype,@srole,@slevel,0,9,@sprogress3,0.3,0,NULL,NOW(),NOW());

#select id from servicestatus where serviceStatus ='无' into @sprogress1;
#insert into servcomissionlookup values(0,0,0,0,9,@sprogress1,0,0,NULL,NOW(),NOW());

##############################################MARKET VIEWS #################################################
# as Sales or Expert, percent if sign every month

DROP PROCEDURE IF EXISTS PerUserSignRate;
delimiter ;;
create PROCEDURE PerUserSignRate (uid int, month int, year int)
COMMENT ''
BEGIN
select user.id ,user.nickname,
紧急销售咨询量,紧急销售签约量,紧急销售签约额,
转学销售咨询量,转学销售签约量,转学销售签约额,
高中销售咨询量,高中销售签约量,高中销售签约额,
学术销售咨询量,学术销售签约量,学术销售签约额,
紧急专家咨询量,紧急专家签约量,紧急专家签约额,
转学专家咨询量,转学专家签约量,转学专家签约额, 
高中专家咨询量,高中专家签约量,高中专家签约额,
学术专家咨询量,学术专家签约量,学术专家签约额,
IFNULL(紧急销售签约量,0)+IFNULL(紧急专家签约量,0) as '紧急签约量',
IFNULL(转学销售签约量,0)+IFNULL(转学专家签约量,0) as '转学签约量',
IFNULL(高中销售咨询量,0)+IFNULL(高中专家咨询量,0) as '高中签约量',
IFNULL(学术销售咨询量,0)+IFNULL(学术专家咨询量,0) as '学术签约量',
#(IFNULL(紧急销售签约量,0)+IFNULL(紧急专家签约量,0))/(IFNULL(紧急销售咨询量,0)+IFNULL(紧急专家咨询量,0)) as '紧急签约率',
#(IFNULL(转学销售签约量,0)+IFNULL(转学专家签约量,0))/(IFNULL(转学销售咨询量,0)+IFNULL(转学专家咨询量,0)) as '转学签约率',
(IFNULL(转学销售签约量,0)+IFNULL(紧急销售签约量,0)+IFNULL(高中销售签约量,0)+IFNULL(学术销售签约量,0))/(IFNULL(转学销售咨询量,0)+IFNULL(紧急销售咨询量,0)+IFNULL(高中销售咨询量,0)+IFNULL(学术销售咨询量,0)) as '销售签约率',
(IFNULL(转学专家签约量,0)+IFNULL(紧急专家签约量,0)+IFNULL(高中专家签约量,0)+IFNULL(学术专家签约量,0))/(IFNULL(转学专家咨询量,0)+IFNULL(紧急专家咨询量,0)+IFNULL(高中专家咨询量,0)+IFNULL(学术销售咨询量,0)) as '专家签约率',
#IFNULL(紧急销售签约额,0)+IFNULL(转学销售签约额,0)+IFNULL(高中销售签约额,0)+IFNULL(学术销售签约额,0) as '销售签约额',
#IFNULL(紧急专家签约量,0)+IFNULL(转学专家签约量,0)+IFNULL(高中专家签约额,0)+IFNULL(学术专家签约额,0) as '专家签约额'
IFNULL(紧急专家签约量,0)+IFNULL(转学专家签约量,0)+IFNULL(高中专家签约额,0)+IFNULL(学术专家签约额,0) +IFNULL(紧急销售签约额,0)+IFNULL(转学销售签约额,0)+IFNULL(高中销售签约额,0)+IFNULL(学术销售签约额,0) as '签约额'
from user left join
(select user.id,sum(IF(cc.contractCategory like '%紧急%',1,0)) as '紧急销售咨询量',
sum(IF(cc.contractCategory like '%转学%' and cc.contractCategory not like '%高中%',1,0)) as '转学销售咨询量',
sum(IF(cc.contractCategory like '%高中%' ,1,0)) as '高中销售咨询量',
sum(IF(cc.contractCategory like '%学术%' ,1,0)) as '学术销售咨询量'
from user 
left join contract c on user.id in (c.sales1,c.sales2) 
left join contractcategory cc on c.contractCategory=cc.id
where (uid in (0,user.id)) and DateInRange(c.createdAt,year,month) group by user.id) as t1 on user.id=t1.id
left join
(select user.id,
sum(IF(cc.contractCategory like '%紧急%',1,0)) as '紧急销售签约量',
sum(IF(cc.contractCategory like '%紧急%',contractPrice,0)) as '紧急销售签约额',
sum(IF(cc.contractCategory like '%转学%' and cc.contractCategory not like '%高中%',1,0)) as '转学销售签约量',
sum(IF(cc.contractCategory like '%转学%' and cc.contractCategory not like '%高中%',contractPrice,0)) as '转学销售签约额',
sum(IF(cc.contractCategory like '%高中%',1,0)) as '高中销售签约量',
sum(IF(cc.contractCategory like '%高中%',contractPrice,0)) as '高中销售签约额',
sum(IF(cc.contractCategory like '%学术%',1,0)) as '学术销售签约量',
sum(IF(cc.contractCategory like '%学术%',contractPrice,0)) as '学术销售签约额'
from user 
left join contract c on user.id in (c.sales1,c.sales2) 
left join contractcategory cc on c.contractCategory=cc.id
where (uid in (0,user.id)) and DateInRange(c.contractSigned,year,month) group by user.id) as t2 on user.id=t2.id
left join
(select user.id,sum(IF(cc.contractCategory like '%紧急%',1,0)) as '紧急专家咨询量',
sum(IF(cc.contractCategory like '%转学%' and cc.contractCategory not like '%高中%',1,0)) as '转学专家咨询量',
sum(IF(cc.contractCategory like '%高中%' ,1,0)) as '高中专家咨询量',
sum(IF(cc.contractCategory like '%学术%' ,1,0)) as '学术专家咨询量'
from user 
left join contract c on user.id in (c.expert1,c.expert2) 
left join contractcategory cc on c.contractCategory=cc.id
where (uid in (0,user.id)) and DateInRange(c.createdAt,year,month) group by user.id) as t3 on user.id=t3.id
left join
(select user.id,
sum(IF(cc.contractCategory like '%紧急%',1,0)) as '紧急专家签约量',
sum(IF(cc.contractCategory like '%紧急%',contractPrice,0)) as '紧急专家签约额',
sum(IF(cc.contractCategory like '%转学%' and cc.contractCategory not like '%高中%',1,0)) as '转学专家签约量',
sum(IF(cc.contractCategory like '%转学%' and cc.contractCategory not like '%高中%',contractPrice,0)) as '转学专家签约额',
sum(IF(cc.contractCategory like '%高中%',1,0)) as '高中专家签约量',
sum(IF(cc.contractCategory like '%高中%',contractPrice,0)) as '高中专家签约额',
sum(IF(cc.contractCategory like '%学术%',1,0)) as '学术专家签约量',
sum(IF(cc.contractCategory like '%学术%',contractPrice,0)) as '学术专家签约额'
from user 
left join contract c on user.id in (c.expert1,c.expert2) 
left join contractcategory cc on c.contractCategory=cc.id
where (uid in (0,user.id)) and DateInRange(c.contractSigned,year,month) group by user.id) as t4 on user.id=t4.id
where not(t1.id is null and t2.id is null and t3.id is null and t4.id is null);
END;;
delimiter ;




# Sign rate for Lead
DROP PROCEDURE IF EXISTS LeadSignRate;
delimiter ;;
create PROCEDURE LeadSignRate (month int, year int)
COMMENT ''
BEGIN
select *,紧急签约量/紧急咨询量 as '紧急签约率',
转学签约量/转学咨询量 as '转学签约率'
from
(SELECT lead.id,lead.lead, sum(IF(contractCategory=8,1,0)) as '紧急咨询量',
sum(IF(contractCategory in (7,9,10,11),1,0)) as '转学咨询量'
FROM contract c left join lead on c.lead=lead.id where 
DateInRange(c.createdAt,year,month) group by lead.id) as t1
left join
(SELECT lead.id,
sum(IF(contractCategory=8,1,0)) as '紧急签约量', 
sum(IF(contractCategory=8 ,contractPrice,0)) as '紧急签约额',
sum(IF(contractCategory in (7,9,10,11),1,0)) as '转学签约量',
sum(IF(contractCategory in (7,9,10,11),contractPrice,0)) as '转学签约额'
FROM contract c left join lead on c.lead=lead.id where 
DateInRange(c.contractSigned,year,month) group by lead.id) as t2 on t1.id=t2.id;
END;;
delimiter ;

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

DROP function IF EXISTS DateInRange;
DELIMITER $$
CREATE FUNCTION DateInRange (targetDate date,year int, month int) 
RETURNS boolean
DETERMINISTIC
BEGIN 
  DECLARE dist boolean;
  SET dist = targetDate between SUBDATE(DATE_FORMAT(STR_TO_DATE(CONCAT(year,'-',month),'%Y-%m'),'%Y-%m-22'),INTERVAL 1 MONTH) and DATE_FORMAT(STR_TO_DATE(CONCAT(year,'-',month),'%Y-%m'),'%Y-%m-21');
  RETURN dist;
END$$
DELIMITER ;

# SALES COMISSION whole table or single 
DROP PROCEDURE IF EXISTS SalesComission;
delimiter ;;
create PROCEDURE SalesComission (uid int,sid int, year int, month int,single bool)
COMMENT ''
BEGIN
select client.chineseName, contract.contractPaid,user.id as "user",service.id as "service",contract.id as "contract",user.nickname,servicetype.serviceType,service.price,r.realPaid,contractcomission.salesRole,salesrole.comissionPercent,salesrole.flatComission,servicetype.comission,contractcomission.extra,IFNULL(r.realPaid,0)*salesrole.comissionPercent*userlevel.userComission*servicetype.comission+contractcomission.extra+salesrole.flatComission as "final" from user 
inner join contract on (contract.sales1=user.id or contract.assisCont1=user.id or contract.expert1=user.id or contract.sales2=user.id or contract.assisCont2=user.id or contract.expert2=user.id)
inner join client on contract.client=client.id
inner join service on (service.contract=contract.id)
left join contractcomission on (user.id=contractcomission.user and service.id=contractcomission.service)
left join salesrole on (contractcomission.salesRole=salesrole.id)
left join servicetype on (service.serviceType=servicetype.id)
left join userlevel on (user.userlevel=userlevel.id)
left join 
(select serviceinvoice.service, IFNULL(paidAmount,0)/totalpay*(IFNULL(invoice.receivedTotal,0)-IFNULL(invoice.receivedNontaxable,0)-IFNULL(invoice.receivedOther,0)-IFNULL(invoice.receivedRemittances,0)) as realPaid from serviceinvoice 
left join
(select invoice.id,sum(IFNULL(paidAmount,0)) as totalpay from invoice
left join serviceinvoice on serviceinvoice.invoice=invoice.id
group by invoice.id) as t on serviceinvoice.invoice=t.id
left join invoice on serviceinvoice.invoice=invoice.id
group by serviceinvoice.service) as r on r.service=service.id
where ((single=false and (user.id=uid or uid=0 or user.boss=uid) and (service.id=sid or sid=0)) or (single=true and user.id=uid and service.id=sid))
 and ((year is null or month is null) or (DateInRange(contract.contractPaid,year,month)));
END;;
delimiter ;

# SERVICE COMISSION
DROP PROCEDURE IF EXISTS ServiceComission;
delimiter ;;
create PROCEDURE ServiceComission (uid int,sid int, year int, month int,single bool)
COMMENT ''
BEGIN
SELECT  client.chineseName,contract.contractPaid,service.id as "service" ,contract.id as "contract", user.id as "user",user.nickname,servicetype.serviceType, service.servicetype as "type", st.servRole,st.servLevel, p2.serviceProgress as 'startprogress', p1.serviceProgress as 'endprogress',
IFNULL((select  ((count(*)*s1.pricePerCol)+s1.priceFlat)*s1.statusportion+s1.statusflat from application where application.service=service.id),0) as "startComission",
IFNULL((select  ((count(*)*s2.pricePerCol)+s2.priceFlat)*s2.statusportion+s2.statusflat from application where application.service=service.id),0) as "endComission",
(select IFNULL(((count(*)*s2.pricePerCol)+s2.priceFlat)*s2.statusportion+s2.statusflat,0)-IFNULL(((count(*)*s1.pricePerCol)+s1.priceFlat)*s1.statusportion+s1.statusflat,0) from application where application.service=service.id) as "monthlyComission"
FROM service 
inner join contract on service.contract=contract.id
inner join client on contract.client=client.id
inner join servicedetail st on st.service=service.id
inner join user on st.user=user.id
inner join servicetype on service.serviceType=servicetype.id
left join serviceprogress on service.serviceProgress=serviceprogress.id
left join (select serviceDetail,max(id) as 'curMonth' from serviceprogressupdate where createdAt <=DATE_FORMAT(STR_TO_DATE(CONCAT(year,'-',month),'%Y-%m'),'%Y-%m-21')  group by serviceDetail) as x on x.serviceDetail=st.id
left join (select serviceDetail,max(id) as 'lastMonth' from serviceprogressupdate where createdAt <=SUBDATE(DATE_FORMAT(STR_TO_DATE(CONCAT(year,'-',month),'%Y-%m'),'%Y-%m-21'),INTERVAL 1 MONTH)  group by serviceDetail) as y on y.serviceDetail=st.id
left join serviceprogressupdate p1 on x.curMonth=p1.id
left join serviceprogressupdate p2 on y.lastMonth=p2.id
left join servcomissionlookup s1 on (((s1.serviceType=service.serviceType and s1.servLevel=st.servLevel and servicetype.serviceType  like 'p%') or (servicetype.serviceType not like 'p%' and ((s1.serviceType=0 and s1.servLevel=st.servLevel) or s1.serviceType=service.serviceType))) and s1.serviceStatus=p2.serviceProgress and s1.servRole=st.servRole)
left join servcomissionlookup s2 on (((s2.serviceType=service.serviceType and s2.servLevel=st.servLevel and servicetype.serviceType  like 'p%') or (servicetype.serviceType not like 'p%' and ((s2.serviceType=0 and s2.servLevel=st.servLevel) or s2.serviceType=service.serviceType))) and s2.serviceStatus=p1.serviceProgress and s2.servRole=st.servRole)
where contract.contractPaid is not NULL and serviceprogress.serviceProgress not like 'D%' and ((single=false and (user.id=uid or uid=0 or user.boss=uid) and (service.id=sid or sid=0)) or (single=true and user.id=uid and service.id=sid));
END;;
delimiter ;


DROP PROCEDURE IF EXISTS AssistantComission;
delimiter ;;
create PROCEDURE AssistantComission (uid int,cid int, year int, month int,single bool)
COMMENT ''
BEGIN
select A.*,client.chineseName,count(*) as "email", count(*)*10 as "comission" from 
(select contract.id as "contract", user.nickname as "user",contract.client,contract.createdAt,contract.contractPaid from contract inner join user on (contract.assistant1=user.id)where ((year is null or month is null) or (DateInRange(contract.contractPaid,year,month)))
and ((single=false and (user.id=uid or uid=0 or user.boss=uid) and (contract.id=cid or cid=0)) or (single=true and user.id=uid and contract.id=cid))
union all
select contract.id as "contract", user.nickname as "user",contract.client,contract.createdAt,contract.contractPaid from contract inner join user on (contract.assistant2=user.id)where ((year is null or month is null) or (DateInRange(contract.contractPaid,year,month)))
and ((single=false and (user.id=uid or uid=0 or user.boss=uid) and (contract.id=cid or cid=0)) or (single=true and user.id=uid and contract.id=cid))
union all
select contract.id as "contract", user.nickname as "user",contract.client,contract.createdAt,contract.contractPaid from contract inner join user on (contract.assistant3=user.id)where ((year is null or month is null) or (DateInRange(contract.contractPaid,year,month)))
and ((single=false and (user.id=uid or uid=0 or user.boss=uid) and (contract.id=cid or cid=0)) or (single=true and user.id=uid and contract.id=cid))
union all
select contract.id as "contract", user.nickname as "user",contract.client,contract.createdAt,contract.contractPaid from contract inner join user on (contract.assistant4=user.id)where ((year is null or month is null) or (DateInRange(contract.contractPaid,year,month)))
and ((single=false and (user.id=uid or uid=0 or user.boss=uid) and (contract.id=cid or cid=0)) or (single=true and user.id=uid and contract.id=cid))) A 
inner join client on A.client=client.id
group by A.contract,A.user;
END;;
delimiter ;