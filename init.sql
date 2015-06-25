use test;
#销售组
truncate salesgroup;
insert into salesgroup values('紧急',1,1,NOW(),NOW());
insert into salesgroup values('转学',1,2,NOW(),NOW());
insert into salesgroup values('升学',1,3,NOW(),NOW());
insert into salesgroup values('高中',1,4,NOW(),NOW());
insert into salesgroup values('其它',1,5,NOW(),NOW());
insert into salesgroup values('后期紧急',2,6,NOW(),NOW());
insert into salesgroup values('后期转升',2,7,NOW(),NOW());
insert into salesgroup values('后期高中',2,8,NOW(),NOW());
insert into salesgroup values('后期辅导',2,9,NOW(),NOW());
insert into salesgroup values('广告',3,10,NOW(),NOW());
insert into salesgroup values('渠道',3,11,NOW(),NOW());
insert into salesgroup values('大客户',1,12,NOW(),NOW());


truncate subrole;
insert into subrole values('高中',1,1,NOW(),NOW());
insert into subrole values('紧急销售',1,2,NOW(),NOW());
insert into subrole values('转升',1,3,NOW(),NOW());
insert into subrole values('大客户',1,4,NOW(),NOW());
insert into subrole values('后期紧急',2,5,NOW(),NOW());
insert into subrole values('后期转升',2,6,NOW(),NOW());
insert into subrole values('后期高中',2,7,NOW(),NOW());
insert into subrole values('后期辅导',2,8,NOW(),NOW());
insert into subrole values('广告',3,9,NOW(),NOW());
insert into subrole values('渠道',3,10,NOW(),NOW());

truncate subrole_handle_salesgroup;
insert into subrole_handle_salesgroup values(1,4,NULL,NOW(),NOW());
insert into subrole_handle_salesgroup values(2,1,NULL,NOW(),NOW());
insert into subrole_handle_salesgroup values(3,2,NULL,NOW(),NOW());
insert into subrole_handle_salesgroup values(3,3,NULL,NOW(),NOW());
insert into subrole_handle_salesgroup values(4,12,NULL,NOW(),NOW());

#文件类型
truncate doctype
insert into doctype values('新人必读',NULL,NOW(),NOW());
insert into doctype values('SOP',NULL,NOW(),NOW());

#合同类型
truncate contractcategory;
insert into contractcategory values('紧急服务',1,NOW(),NOW());
insert into contractcategory values('普通升学',2,NOW(),NOW());
insert into contractcategory values('普通转学',3,NOW(),NOW());
insert into contractcategory values('学术辅导',4,NOW(),NOW());
insert into contractcategory values('文书服务',5,NOW(),NOW());
insert into contractcategory values('签证服务',6,NOW(),NOW());
insert into contractcategory values('国会奖',7,NOW(),NOW());
insert into contractcategory values('合作机构',8,NOW(),NOW());
insert into contractcategory values('其它',9,NOW(),NOW());
insert into contractcategory values('大客户',10,NOW(),NOW());
#insert into contractcategory values('薛涌留美预科',11,NOW(),NOW());
#insert into contractcategory values('ELS',12,NOW(),NOW());
#insert into contractcategory values('中信',13,NOW(),NOW());
#insert into contractcategory values('游学营',14,NOW(),NOW());
#insert into contractcategory values('AHS',15,NOW(),NOW());


#insert into contractcategory values('紧急服务',NULL,NOW(),NOW());
#insert into contractcategory values('社区转学/直升',NULL,NOW(),NOW());
#insert into contractcategory values('高中转学/直升',NULL,NOW(),NOW());
#insert into contractcategory values('大学转学/直升',NULL,NOW(),NOW());
#insert into contractcategory values('研究生/博士申请',NULL,NOW(),NOW());
#insert into contractcategory values('学术辅导',NULL,NOW(),NOW()); # This is now 辅导
#insert into contractcategory values('签证辅导',NULL,NOW(),NOW()); # This is now 辅导
##insert into contractcategory values('薛涌留学预备课程',NULL,NOW(),NOW()); This is in  其他
#insert into contractcategory values('Free Session',NULL,NOW(),NOW());
#insert into contractcategory values('二次签约',NULL,NOW(),NOW());
#insert into contractcategory values('其它',NULL,NOW(),NOW());
#insert into contractcategory values('辅导',NULL,NOW(),NOW());

#销售组和合同类型
truncate group2service;
insert into group2service values(1,1,NULL,NOW(),NOW());
insert into group2service values(1,4,NULL,NOW(),NOW());
insert into group2service values(1,5,NULL,NOW(),NOW());
insert into group2service values(1,8,NULL,NOW(),NOW());
insert into group2service values(2,3,NULL,NOW(),NOW());
insert into group2service values(2,4,NULL,NOW(),NOW());
insert into group2service values(2,5,NULL,NOW(),NOW());
insert into group2service values(2,6,NULL,NOW(),NOW());
insert into group2service values(2,7,NULL,NOW(),NOW());
insert into group2service values(2,8,NULL,NOW(),NOW());
insert into group2service values(3,2,NULL,NOW(),NOW());
insert into group2service values(3,4,NULL,NOW(),NOW());
insert into group2service values(3,5,NULL,NOW(),NOW());
insert into group2service values(3,6,NULL,NOW(),NOW());
insert into group2service values(3,7,NULL,NOW(),NOW());
insert into group2service values(3,8,NULL,NOW(),NOW());
insert into group2service values(4,2,NULL,NOW(),NOW());
insert into group2service values(4,3,NULL,NOW(),NOW());
insert into group2service values(4,4,NULL,NOW(),NOW());
insert into group2service values(4,5,NULL,NOW(),NOW());
insert into group2service values(4,6,NULL,NOW(),NOW());
insert into group2service values(4,7,NULL,NOW(),NOW());
insert into group2service values(4,8,NULL,NOW(),NOW());
insert into group2service values(5,8,NULL,NOW(),NOW());
insert into group2service values(5,9,NULL,NOW(),NOW());
insert into group2service values(5,10,NULL,NOW(),NOW());
insert into group2service values(12,1,NULL,NOW(),NOW());
insert into group2service values(12,2,NULL,NOW(),NOW());
insert into group2service values(12,3,NULL,NOW(),NOW());
insert into group2service values(12,4,NULL,NOW(),NOW());
insert into group2service values(12,5,NULL,NOW(),NOW());
insert into group2service values(12,6,NULL,NOW(),NOW());
insert into group2service values(12,7,NULL,NOW(),NOW());
insert into group2service values(12,8,NULL,NOW(),NOW());
insert into group2service values(12,9,NULL,NOW(),NOW());
insert into group2service values(12,10,NULL,NOW(),NOW());

#Lead
#insert into lead values('Campus校代介绍',NULL,NOW(),NOW());
#insert into lead values('Web电话/网络',NULL,NOW(),NOW());
#insert into lead values('Customer老客户介绍',NULL,NOW(),NOW());
##insert into lead values('Friend熟人介绍',NULL,NOW(),NOW()); # this is in Staff now
#insert into lead values('Staff内部员工介绍',NULL,NOW(),NOW());
##insert into lead values('Free Session',NULL,NOW(),NOW()); # this is in Sec
#insert into lead values('Sec二次签约',NULL,NOW(),NOW());
#insert into lead values('PreSale',NULL,NOW(),NOW());
#insert into lead values('CA',NULL,NOW(),NOW());
#insert into lead values('Partner合作推荐',NULL,NOW(),NOW());
#insert into lead values('官网在线咨询',NULL,NOW(),NOW());
#insert into lead values('官方博客，微博',NULL,NOW(),NOW());
#insert into lead values('陈航老师博客，微博',NULL,NOW(),NOW());
#insert into lead values('搜索：谷歌',NULL,NOW(),NOW());
#insert into lead values('搜索：百度',NULL,NOW(),NOW());
#insert into lead values('搜索：Bing',NULL,NOW(),NOW());
#insert into lead values('官方微信（厚仁教育科技）',NULL,NOW(),NOW());
#insert into lead values('微信：厚仁学术哥 wholerenguru',NULL,NOW(),NOW());
#insert into lead values('微信：美国转学 UStransfer',NULL,NOW(),NOW());
#insert into lead values('微信：留美导师 USmentor',NULL,NOW(),NOW());
#insert into lead values('邮件收到的Newsletter',NULL,NOW(),NOW());
#insert into lead values('熟人，朋友推荐',NULL,NOW(),NOW());
#insert into lead values('北美校园大使推荐',NULL,NOW(),NOW());
#insert into lead values('合作：Moonbbs北美微论坛',NULL,NOW(),NOW());
#insert into lead values('合作：洛杉矶华人资讯网',NULL,NOW(),NOW());
#insert into lead values('合作：Gesoo',NULL,NOW(),NOW());
#insert into lead values('合作：其他机构',NULL,NOW(),NOW());
truncate lead;
insert into lead values('1. 官网',1,NOW(),NOW());
insert into lead values('2. 网络搜索',2,NOW(),NOW());
insert into lead values('3. 微信',3,NOW(),NOW());
insert into lead values('4. 校代介绍',4,NOW(),NOW());
insert into lead values('5. 二次销售',5,NOW(),NOW());
insert into lead values('6. 朋友&员工介绍',6,NOW(),NOW());
#insert into lead values('3. 朋友&员工介绍2',7,NOW(),NOW());
insert into lead values('7. 博客微博',7,NOW(),NOW());
insert into lead values('8. 邮件Newsletter',8,NOW(),NOW());
insert into lead values('9. 学生客户介绍',9,NOW(),NOW());
insert into lead values('10. 渠道机构',10,NOW(),NOW());
insert into lead values('11. 学校refer',11,NOW(),NOW());

truncate leaddetail;
insert into leaddetail values('在线咨询',1,NULL,NOW(),NOW());
insert into leaddetail values('谷歌',2,NULL,NOW(),NOW());
insert into leaddetail values('百度',2,NULL,NOW(),NOW());
insert into leaddetail values('其他',2,NULL,NOW(),NOW());
insert into leaddetail values('厚仁学术哥',3,NULL,NOW(),NOW());
insert into leaddetail values('留美导师',3,NULL,NOW(),NOW());
insert into leaddetail values('美国转学',3,NULL,NOW(),NOW());
insert into leaddetail values('陈航老师微信',3,NULL,NOW(),NOW());
insert into leaddetail values('厚仁教育科技微信',3,NULL,NOW(),NOW());
insert into leaddetail values('校代',4,NULL,NOW(),NOW());
insert into leaddetail values('presale code',4,NULL,NOW(),NOW());
insert into leaddetail values('服务中的学生再次签约,在服务的学生',5,NULL,NOW(),NOW());
insert into leaddetail values('陌生leads,新介绍lead,新lead',6,NULL,NOW(),NOW());
insert into leaddetail values('Dealmoon北美微论坛',7,NULL,NOW(),NOW());
insert into leaddetail values('洛杉矶华人资讯网',7,NULL,NOW(),NOW());
insert into leaddetail values('Gesoo',7,NULL,NOW(),NOW());
insert into leaddetail values('其他',7,NULL,NOW(),NOW());
insert into leaddetail values('官方微博',8,NULL,NOW(),NOW());
insert into leaddetail values('官方博客',8,NULL,NOW(),NOW());
insert into leaddetail values('陈航老师博客',8,NULL,NOW(),NOW());
insert into leaddetail values('陈航老师微博',8,NULL,NOW(),NOW());
insert into leaddetail values('薛涌留美预科',10,NULL,NOW(),NOW());
insert into leaddetail values('AHS',10,NULL,NOW(),NOW());
insert into leaddetail values('NYIS',10,NULL,NOW(),NOW());
insert into leaddetail values('Feng&Feng律师事务所',10,NULL,NOW(),NOW());
insert into leaddetail values('ELS',10,NULL,NOW(),NOW());
insert into leaddetail values('其它',10,NULL,NOW(),NOW());
	
#LeadLevel
truncate leadlevel;
insert into leadlevel values('L1：有互动，且信息完整',NULL,NOW(),NOW());
insert into leadlevel values('L2：有互动，但信息不完整',NULL,NOW(),NOW());
insert into leadlevel values('L0：老客户、二次签约、关系户',NULL,NOW(),NOW());
insert into leadlevel values('L3：无回复',NULL,NOW(),NOW());

#签约状态
truncate status;
insert into status values('A. 无效-联系不上',1,NOW(),NOW());
insert into status values('B. 未咨询-约咨询前&中',2,NOW(),NOW());
insert into status values('C. 付费咨询-无法推服务',3,NOW(),NOW());
#insert into status values('C1. 退款',NULL,NOW(),NOW());
#insert into status values('C2. 签约未付款',NULL,NOW(),NOW());
insert into status values('D.未签约-咨询后跟进',4,NOW(),NOW());
insert into status values('E. WIP-进入服务',5,NOW(),NOW());
insert into status values('F. 放弃治疗',6,NOW(),NOW());
insert into status values('G. 公益完结',7,NOW(),NOW());
#insert into status values('H. 未联系上',NULL,NOW(),NOW());

#国家
truncate country;
insert into country values('中国',NULL,NOW(),NOW());
insert into country values('美国',NULL,NOW(),NOW());

#就读学位
truncate degree;
insert into degree values('无学校',1,NOW(),NOW());
insert into degree values('高中',2,NOW(),NOW());
insert into degree values('社区',3,NOW(),NOW());
insert into degree values('语言',4,NOW(),NOW());
insert into degree values('本科',5,NOW(),NOW());
insert into degree values('硕士',6,NOW(),NOW());# 硕博
insert into degree values('博士',7,NOW(),NOW());# 硕博
insert into degree values('小学',8,NOW(),NOW());
insert into degree values('初中',9,NOW(),NOW());
#insert into degree values('硕博',NULL,NOW(),NOW());
#付款方式
truncate paymentoption;
insert into paymentoption values('中国汇款',NULL,NOW(),NOW());
insert into paymentoption values('美国汇款',NULL,NOW(),NOW());
insert into paymentoption values('BrainTree',NULL,NOW(),NOW());
insert into paymentoption values('Paypal',NULL,NOW(),NOW());

#收款账户
truncate depositaccount;
insert into depositaccount values('北京BEIJING',NULL,NOW(),NOW());
insert into depositaccount values('美国US',NULL,NOW(),NOW());

#人员角色
truncate role;
insert into role values('销售',1,NOW(),NOW());
insert into role values('申请',2,NOW(),NOW());
insert into role values('市场',3,NOW(),NOW());
#insert into role values('文书',NULL,NOW(),NOW());
#insert into role values('专家',NULL,NOW(),NOW());
insert into role values('人事',6,NOW(),NOW());
#insert into role values('加州',NULL,NOW(),NOW());
insert into role values('学术',8,NOW(),NOW());


	
#服务 TODO: add the recommended price and also base comission
truncate servicetype;
#紧急
insert into servicetype values('a.澄清','a','Emerg',false,0.9,1,NOW(),NOW());
insert into servicetype values('b.申诉','b','Emerg',false,0.9,2,NOW(),NOW());
insert into servicetype values('c1.找律师上厅','c1','Emerg',false,0.5,3,NOW(),NOW());
insert into servicetype values('c2.律师参与的申诉','c2','Emerg',false,0.5,4,NOW(),NOW());
insert into servicetype values('d0.紧急服务之高中申请2所，10天','d0','Emerg',true,0.9,5,NOW(),NOW());
insert into servicetype values('d.紧急服务之普通申请3所，7天','d','Emerg',true,0.9,6,NOW(),NOW());
insert into servicetype values('d1.紧急服务之CC申请2所，7天','d1','Emerg',true,0.9,7,NOW(),NOW());
insert into servicetype values('d2.紧急服务之硕士申请3所，50天','d2','Emerg',true,0.9,8,NOW(),NOW());
insert into servicetype values('d3.加申学校','d3','Emerg',true,0.9,20,NOW(),NOW());
insert into servicetype values('e.身份激活','e','Emerg',false,0.5,9,NOW(),NOW());
insert into servicetype values('f.签证辅导紧急','f','Emerg',false,0.9,10,NOW(),NOW());
insert into servicetype values('g.签证工具（PAP）','g','Emerg',false,0.9,11,NOW(),NOW());
insert into servicetype values('h.学术正规辅导','h','Emerg',false,0.9,12,NOW(),NOW());
insert into servicetype values('i.后续二次转学','i','Emerg',true,0.9,13,NOW(),NOW());
insert into servicetype values('pack1:b+d，申诉+紧急转学','pack1','Emerg',false,0.9,14,NOW(),NOW());
insert into servicetype values('pack2:a,b,d1/d2,e,f,g','pack2','Emerg',false,0.9,15,NOW(),NOW());
insert into servicetype values('pack3:h与i服务打包','pack3','Emerg',false,0.9,16,NOW(),NOW());
insert into servicetype values('pack4:所有服务打包','pack4','Emerg',false,0.9,17,NOW(),NOW());
insert into servicetype values('pack5:b+d1/d2-研究生','pack5','Emerg',false,0.9,18,NOW(),NOW());
insert into servicetype values('pack6:d1,i-研究生','pack6','Emerg',false,0.9,19,NOW(),NOW());
#insert into servicetype values('pack7:a,b,d1/d2,e,f,g-研究生','pack7','Emerg',false,0.9,20,NOW(),NOW());
#insert into servicetype values('pack8:h与i服务打包-研究生','pack8','Emerg',false,0.9,21,NOW(),NOW());
#insert into servicetype values('pack9:所有服务打包-研究生','pack9','Emerg',false,0.9,22,NOW(),NOW());

#升学t
insert into servicetype values('t1.普通中学升/转学服务','t1','Study',false,0.9,23,NOW(),NOW());
insert into servicetype values('t.普通本科升学','t','Study',false,0.9,24,NOW(),NOW());
insert into servicetype values('t2.普通硕士升学','t2','Study',false,0.9,25,NOW(),NOW());
insert into servicetype values('t3.普通艺术类本科升学','t3','Study',false,0.9,26,NOW(),NOW());
insert into servicetype values('t4.普通艺术类硕士升学','t4','Study',false,0.9,27,NOW(),NOW());
insert into servicetype values('t5.VIP本科升学','t5','Study',false,0.9,28,NOW(),NOW());
insert into servicetype values('t6.VIP硕士升学','t6','Study',false,0.9,29,NOW(),NOW());
insert into servicetype values('t7.普通CC申请','t7','Study',false,0.9,30,NOW(),NOW());
insert into servicetype values('t8.普通语言项目申请','t8','Study',false,0.9,31,NOW(),NOW());
insert into servicetype values('tpack1.“早起鸟”+ 硕士升学服务','tpack1','Study',false,0.9,32,NOW(),NOW());
insert into servicetype values('tpack2.“早起鸟”+ 本科升学服务','tpack2','Study',false,0.9,33,NOW(),NOW());
insert into servicetype values('tpack3.“早起鸟”+ 高中升/转学服务','tpack3','Study',false,0.9,34,NOW(),NOW());
insert into servicetype values('tpack4.“早起鸟”+ VIP硕士升学服务','tpack4','Study',false,0.9,35,NOW(),NOW());
insert into servicetype values('tpack5.“早起鸟”+ VIP本科升学服务','tpack5','Study',false,0.9,36,NOW(),NOW());
insert into servicetype values('tpack6.“早起鸟”+高中升转学学服务+大学升学','tpack6','Study',false,0.9,37,NOW(),NOW());
insert into servicetype values('tpack7.“早起鸟”+高中名校连升服务+大学升学','tpack7','Study',false,0.9,38,NOW(),NOW());

#转学i
insert into servicetype values('i1.高中名校连升项目服务','i1','Study',false,0.9,39,NOW(),NOW());
insert into servicetype values('i0.普通本科转学','i0','Study',false,0.9,40,NOW(),NOW());
insert into servicetype values('i2.普通研究生转学','i2','Study',false,0.9,41,NOW(),NOW());
insert into servicetype values('i3.普通艺术类本科转学','i3','Study',false,0.9,42,NOW(),NOW());
insert into servicetype values('i4.普通艺术类研究生转学','i4','Study',false,0.9,43,NOW(),NOW());
insert into servicetype values('i5.VIP高中转学','i5','Study',false,0.9,44,NOW(),NOW());
insert into servicetype values('i6.VIP本科转学','i6','Study',false,0.9,45,NOW(),NOW());
insert into servicetype values('i7.VIP研究生转学','i7','Study',false,0.9,46,NOW(),NOW());
insert into servicetype values('ipack1.“早起鸟”+ 本科转学服务','ipack1','Study',false,0.9,47,NOW(),NOW());
insert into servicetype values('ipack2.“早起鸟”+ 硕士转学服务','ipack2','Study',false,0.9,48,NOW(),NOW());
insert into servicetype values('ipack13.“早起鸟”+ 高中名校连升服务','ipack3','Study',false,0.9,49,NOW(),NOW());
insert into servicetype values('ipack14.“早起鸟”+ VIP本科转学服务','ipack4','Study',false,0.9,50,NOW(),NOW());
insert into servicetype values('ipack15.“早起鸟”+ VIP硕士转学服务','ipack5','Study',false,0.9,51,NOW(),NOW());

#文书服务p
insert into servicetype values('p1.普通Essay修改','p1','Study',false,0.9,52,NOW(),NOW());
insert into servicetype values('p2.普通文书服务','p2','Study',false,0.9,53,NOW(),NOW());
insert into servicetype values('p3.VIP文书服务','p3','Study',false,0.9,54,NOW(),NOW());
#国会奖j
insert into servicetype values('j1.铜奖奖状$2,000','j1','Study',false,0.9,55,NOW(),NOW());
insert into servicetype values('j2.银奖奖状$4,000','j2','Study',false,0.9,56,NOW(),NOW());
insert into servicetype values('j3.金奖奖状$6,000','j3','Study',false,0.9,57,NOW(),NOW());
insert into servicetype values('j4.铜奖奖牌$6,000','j4','Study',false,0.9,58,NOW(),NOW());
insert into servicetype values('j5.银奖奖牌$12,000','j5','Study',false,0.9,59,NOW(),NOW());
insert into servicetype values('j6.金奖奖牌$24,000','j6','Study',false,0.9,60,NOW(),NOW());
#签证f&g
insert into servicetype values('f1.签证辅导普通-非紧急','f1','Visa',false,0.9,61,NOW(),NOW());
#学术辅导h
#insert into servicetype values('h.学术正轨','h','Study',false,0.9,64,NOW(),NOW());
insert into servicetype values('h2.早起鸟','h2','Study',true,0.6,65,NOW(),NOW());
insert into servicetype values('h3.单科辅导','h3','Study',false,0.6,66,NOW(),NOW());
insert into servicetype values('h4.托福辅导','h4','Study',false,0.6,67,NOW(),NOW());
insert into servicetype values('h5.ASPIRE全套1年','h5','Study',false,0.6,68,NOW(),NOW());
insert into servicetype values('h6.ASPIRE全套2年','h6','Study',false,0.6,69,NOW(),NOW());
insert into servicetype values('h7.SAT辅导','h7','Study',false,0.6,70,NOW(),NOW());
insert into servicetype values('h8.学术写作辅导','h8','Study',false,0.6,71,NOW(),NOW());
insert into servicetype values('h9.非全年学术辅导','h9','Study',false,0.6,72,NOW(),NOW());
insert into servicetype values('h10.作品集辅导','h10','Study',false,0.6,73,NOW(),NOW());
insert into servicetype values('h11.选课辅导','h11','Study',false,0.6,74,NOW(),NOW());
#合作机构k
insert into servicetype values('k.薛涌留美预科','k','Study',false,0.9,75,NOW(),NOW());
insert into servicetype values('k1.AHS','k1','Study',false,0.9,76,NOW(),NOW());
insert into servicetype values('k2.ELS','k2','Study',false,0.9,77,NOW(),NOW());
#大客户项目L
insert into servicetype values('L.中信项目','L','Transfer',true,0.9,78,NOW(),NOW());
insert into servicetype values('L1.游学营','L1','Transfer',true,0.9,79,NOW(),NOW());
#其它M
insert into servicetype values('M1.夏校申请','M1','Transfer',true,0.9,80,NOW(),NOW());
insert into servicetype values('ap.录取结果申诉','ap','Transfer',true,0.9,81,NOW(),NOW());
insert into servicetype values('pc.付费咨询','pc','Transfer',true,0.9,82,NOW(),NOW());
insert into servicetype values('is.选校','is','Transfer',true,0.9,83,NOW(),NOW());
insert into servicetype values('面试收费','m','Transfer',true,0.9,84,NOW(),NOW());


#紧急打包
truncate servicetypegroup;
insert into servicetypegroup values(14,2,NULL,NOW(),NOW());
insert into servicetypegroup values(14,6,NULL,NOW(),NOW());
insert into servicetypegroup values(15,1,NULL,NOW(),NOW());
insert into servicetypegroup values(15,2,NULL,NOW(),NOW());
insert into servicetypegroup values(15,7,NULL,NOW(),NOW());
insert into servicetypegroup values(15,8,NULL,NOW(),NOW());
insert into servicetypegroup values(15,9,NULL,NOW(),NOW());
insert into servicetypegroup values(15,10,NULL,NOW(),NOW());
insert into servicetypegroup values(15,11,NULL,NOW(),NOW());
insert into servicetypegroup values(16,12,NULL,NOW(),NOW());
insert into servicetypegroup values(16,13,NULL,NOW(),NOW());
insert into servicetypegroup values(17,1,NULL,NOW(),NOW());
insert into servicetypegroup values(17,2,NULL,NOW(),NOW());
insert into servicetypegroup values(17,3,NULL,NOW(),NOW());
insert into servicetypegroup values(17,4,NULL,NOW(),NOW());
insert into servicetypegroup values(17,6,NULL,NOW(),NOW());
insert into servicetypegroup values(17,7,NULL,NOW(),NOW());
insert into servicetypegroup values(17,8,NULL,NOW(),NOW());
insert into servicetypegroup values(17,9,NULL,NOW(),NOW());
insert into servicetypegroup values(17,10,NULL,NOW(),NOW());
insert into servicetypegroup values(17,11,NULL,NOW(),NOW());
insert into servicetypegroup values(17,12,NULL,NOW(),NOW());
insert into servicetypegroup values(17,13,NULL,NOW(),NOW());
insert into servicetypegroup values(18,2,NULL,NOW(),NOW());
insert into servicetypegroup values(18,7,NULL,NOW(),NOW());
insert into servicetypegroup values(18,8,NULL,NOW(),NOW());
insert into servicetypegroup values(19,7,NULL,NOW(),NOW());
#升学打包
insert into servicetypegroup values(32,65,NULL,NOW(),NOW());
insert into servicetypegroup values(32,25,NULL,NOW(),NOW());
insert into servicetypegroup values(33,65,NULL,NOW(),NOW());
insert into servicetypegroup values(33,24,NULL,NOW(),NOW());
insert into servicetypegroup values(34,65,NULL,NOW(),NOW());
insert into servicetypegroup values(34,23,NULL,NOW(),NOW());
insert into servicetypegroup values(35,65,NULL,NOW(),NOW());
insert into servicetypegroup values(35,29,NULL,NOW(),NOW());
insert into servicetypegroup values(36,65,NULL,NOW(),NOW());
insert into servicetypegroup values(36,28,NULL,NOW(),NOW());
insert into servicetypegroup values(37,65,NULL,NOW(),NOW());
insert into servicetypegroup values(37,23,NULL,NOW(),NOW());
insert into servicetypegroup values(37,24,NULL,NOW(),NOW());
insert into servicetypegroup values(38,65,NULL,NOW(),NOW());
insert into servicetypegroup values(38,39,NULL,NOW(),NOW());
insert into servicetypegroup values(38,24,NULL,NOW(),NOW());
#转学打包	
insert into servicetypegroup values(47,65,NULL,NOW(),NOW());
insert into servicetypegroup values(47,40,NULL,NOW(),NOW());
insert into servicetypegroup values(48,65,NULL,NOW(),NOW());
insert into servicetypegroup values(48,41,NULL,NOW(),NOW());
insert into servicetypegroup values(49,65,NULL,NOW(),NOW());
insert into servicetypegroup values(49,39,NULL,NOW(),NOW());
insert into servicetypegroup values(50,65,NULL,NOW(),NOW());
insert into servicetypegroup values(50,45,NULL,NOW(),NOW());
insert into servicetypegroup values(51,65,NULL,NOW(),NOW());
insert into servicetypegroup values(51,46,NULL,NOW(),NOW());

#合同类型--服务类别
truncate category2service;
insert into category2service values(1,1,NULL,NOW(),NOW());
insert into category2service values(1,2,NULL,NOW(),NOW());
insert into category2service values(1,3,NULL,NOW(),NOW());
insert into category2service values(1,4,NULL,NOW(),NOW());
insert into category2service values(1,5,NULL,NOW(),NOW());
insert into category2service values(1,6,NULL,NOW(),NOW());
insert into category2service values(1,7,NULL,NOW(),NOW());
insert into category2service values(1,8,NULL,NOW(),NOW());
insert into category2service values(1,9,NULL,NOW(),NOW());
insert into category2service values(1,10,NULL,NOW(),NOW());
insert into category2service values(1,11,NULL,NOW(),NOW());
insert into category2service values(1,12,NULL,NOW(),NOW());
insert into category2service values(1,13,NULL,NOW(),NOW());
insert into category2service values(1,14,NULL,NOW(),NOW());
insert into category2service values(1,15,NULL,NOW(),NOW());
insert into category2service values(1,16,NULL,NOW(),NOW());
insert into category2service values(1,17,NULL,NOW(),NOW());
insert into category2service values(1,18,NULL,NOW(),NOW());
insert into category2service values(1,19,NULL,NOW(),NOW());
insert into category2service values(1,20,NULL,NOW(),NOW());
insert into category2service values(1,53,NULL,NOW(),NOW());
#insert into category2service values(1,21,NULL,NOW(),NOW());
#insert into category2service values(1,22,NULL,NOW(),NOW());

insert into category2service values(2,23,NULL,NOW(),NOW());
insert into category2service values(2,24,NULL,NOW(),NOW());
insert into category2service values(2,25,NULL,NOW(),NOW());
insert into category2service values(2,26,NULL,NOW(),NOW());
insert into category2service values(2,27,NULL,NOW(),NOW());
insert into category2service values(2,28,NULL,NOW(),NOW());
insert into category2service values(2,29,NULL,NOW(),NOW());
insert into category2service values(2,30,NULL,NOW(),NOW());
insert into category2service values(2,31,NULL,NOW(),NOW());
insert into category2service values(2,32,NULL,NOW(),NOW());
insert into category2service values(2,33,NULL,NOW(),NOW());
insert into category2service values(2,34,NULL,NOW(),NOW());
insert into category2service values(2,35,NULL,NOW(),NOW());
insert into category2service values(2,36,NULL,NOW(),NOW());
insert into category2service values(2,37,NULL,NOW(),NOW());
insert into category2service values(2,38,NULL,NOW(),NOW());

insert into category2service values(3,39,NULL,NOW(),NOW());
insert into category2service values(3,40,NULL,NOW(),NOW());
insert into category2service values(3,41,NULL,NOW(),NOW());
insert into category2service values(3,42,NULL,NOW(),NOW());
insert into category2service values(3,43,NULL,NOW(),NOW());
insert into category2service values(3,44,NULL,NOW(),NOW());
insert into category2service values(3,45,NULL,NOW(),NOW());
insert into category2service values(3,46,NULL,NOW(),NOW());
insert into category2service values(3,47,NULL,NOW(),NOW());
insert into category2service values(3,48,NULL,NOW(),NOW());
insert into category2service values(3,49,NULL,NOW(),NOW());
insert into category2service values(3,50,NULL,NOW(),NOW());
insert into category2service values(3,51,NULL,NOW(),NOW());

insert into category2service values(5,52,NULL,NOW(),NOW());
insert into category2service values(5,53,NULL,NOW(),NOW());
insert into category2service values(5,54,NULL,NOW(),NOW());

insert into category2service values(7,55,NULL,NOW(),NOW());
insert into category2service values(7,56,NULL,NOW(),NOW());
insert into category2service values(7,57,NULL,NOW(),NOW());
insert into category2service values(7,58,NULL,NOW(),NOW());
insert into category2service values(7,59,NULL,NOW(),NOW());
insert into category2service values(7,60,NULL,NOW(),NOW());

#insert into servicetype values('f.签证辅导VIP-紧急','f','Visa',false,0.9,62,NOW(),NOW());
#insert into servicetype values('g. 签证工具（PAP）','g','Visa',false,0.9,63,NOW(),NOW());

insert into category2service values(6,61,NULL,NOW(),NOW());
insert into category2service values(6,10,NULL,NOW(),NOW());
insert into category2service values(6,11,NULL,NOW(),NOW());

#insert into category2service values(4,64,NULL,NOW(),NOW());
insert into category2service values(4,65,NULL,NOW(),NOW());
insert into category2service values(4,66,NULL,NOW(),NOW());
insert into category2service values(4,67,NULL,NOW(),NOW());
insert into category2service values(4,68,NULL,NOW(),NOW());
insert into category2service values(4,69,NULL,NOW(),NOW());
insert into category2service values(4,70,NULL,NOW(),NOW());
insert into category2service values(4,71,NULL,NOW(),NOW());
insert into category2service values(4,72,NULL,NOW(),NOW());
insert into category2service values(4,73,NULL,NOW(),NOW());
insert into category2service values(4,74,NULL,NOW(),NOW());

insert into category2service values(8,75,NULL,NOW(),NOW());
insert into category2service values(8,76,NULL,NOW(),NOW());
insert into category2service values(8,77,NULL,NOW(),NOW());

insert into category2service values(10,78,NULL,NOW(),NOW());
insert into category2service values(10,79,NULL,NOW(),NOW());

insert into category2service values(9,80,NULL,NOW(),NOW());
insert into category2service values(9,81,NULL,NOW(),NOW());
insert into category2service values(9,82,NULL,NOW(),NOW());
insert into category2service values(9,83,NULL,NOW(),NOW());

# RealServiceType
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

# ServiceType to RealServiceType

insert into sales2realservicetype values(1,1)
insert into sales2realservicetype values(2,2)
insert into sales2realservicetype values(3,3)
insert into sales2realservicetype values(4,3)
insert into sales2realservicetype values(5,4)
insert into sales2realservicetype values(6,4)
insert into sales2realservicetype values(7,4)
insert into sales2realservicetype values(8,4)
insert into sales2realservicetype values(9,5)
insert into sales2realservicetype values(10,6)
insert into sales2realservicetype values(11,7)
insert into sales2realservicetype values(12,8)
insert into sales2realservicetype values(13,12)
insert into sales2realservicetype values(13,13)
insert into sales2realservicetype values(13,15)
insert into sales2realservicetype values(20,4)
insert into sales2realservicetype values(23,12)
insert into sales2realservicetype values(23,13)
insert into sales2realservicetype values(23,15)
insert into sales2realservicetype values(52,15)
insert into sales2realservicetype values(53,15)
insert into sales2realservicetype values(54,15)
insert into sales2realservicetype values(55,21)
insert into sales2realservicetype values(56,21)
insert into sales2realservicetype values(57,21)
insert into sales2realservicetype values(58,21)
insert into sales2realservicetype values(59,21)
insert into sales2realservicetype values(60,21)
insert into sales2realservicetype values(61,6)
insert into sales2realservicetype values(65,11)
insert into sales2realservicetype values(65,14)
insert into sales2realservicetype values(66,9)
insert into sales2realservicetype values(67,10)






















#Category To Service



#insert into servicetypegroup values(1,)
#Service Progress	
#insert into serviceprogress values('W.等待启动',NULL,NOW(),NOW());
#insert into serviceprogress values('A.紧急处理中',NULL,NOW(),NOW());
#insert into serviceprogress values('B.提交进行中',NULL,NOW(),NOW());
#insert into serviceprogress values('C.已交等结果',NULL,NOW(),NOW());
#insert into serviceprogress values('D.服务结束',NULL,NOW(),NOW());
truncate serviceprogress;
insert into serviceprogress values('0.0 等待启动',1,NOW(),NOW());
insert into serviceprogress values('1.0该进程开始',2,NOW(),NOW());
insert into serviceprogress values('-1.1签订选校单',3,NOW(),NOW());
insert into serviceprogress values('-1.2全部提交',4,NOW(),NOW());
insert into serviceprogress values('2.0该进程完成',5,NOW(),NOW());
insert into serviceprogress values('6.0自我放弃',6,NOW(),NOW());
insert into serviceprogress values('0.1勿忘我',7,NOW(),NOW());
insert into serviceprogress values('**找到我**',8,NOW(),NOW());
insert into serviceprogress values('SOS紧急处理中',9,NOW(),NOW());
insert into serviceprogress values('3.0交接出去了',10,NOW(),NOW());



#服务进度
truncate servicestatus;
insert into servicestatus values('无',1,NOW(),NOW());
insert into servicestatus values('进入服务',2,NOW(),NOW());
insert into servicestatus values('选校确定',3,NOW(),NOW());
insert into servicestatus values('提交申请',4,NOW(),NOW());
insert into servicestatus values('录取佣金',5,NOW(),NOW());
insert into servicestatus values('完成服务',6,NOW(),NOW());
insert into servicestatus values('文书启动',7,NOW(),NOW());
insert into servicestatus values('提交文书',8,NOW(),NOW());
insert into servicestatus values('拿到录取',9,NOW(),NOW());
#销售角色
truncate salesrole;
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
-- insert into servrole values('负责老师',1,NOW(),NOW());
-- insert into servrole values('申请全负责老师',2,NOW(),NOW());
-- insert into servrole values('申请老师',3,NOW(),NOW());
-- insert into servrole values('选校专家',4,NOW(),NOW());
-- insert into servrole values('文书全负责老师',5,NOW(),NOW());
-- insert into servrole values('文书专家',6,NOW(),NOW());
-- insert into servrole values('文书编辑',7,NOW(),NOW());
-- insert into servrole values('Native editor',8,NOW(),NOW());
-- insert into servrole values('无角色',9,NOW(),NOW());
truncate servrole;
insert into servrole values('负责老师',1,NOW(),NOW());
insert into servrole values('专家老师',2,NOW(),NOW());
insert into servrole values('助理',3,NOW(),NOW());
insert into servrole values('文书',4,NOW(),NOW());
insert into servrole values('文书编辑',5,NOW(),NOW());
insert into servrole values('无角色',9,NOW(),NOW());
#文书LEVEL
truncate servlevel;
insert into servlevel values('H1',1,NOW(),NOW());
insert into servlevel values('H2',2,NOW(),NOW());
insert into servlevel values('U1',3,NOW(),NOW());
insert into servlevel values('U2',4,NOW(),NOW());
insert into servlevel values('U3',5,NOW(),NOW());
insert into servlevel values('U4',6,NOW(),NOW());
insert into servlevel values('U5',7,NOW(),NOW());
insert into servlevel values('U6',8,NOW(),NOW());
insert into servlevel values('UR',9,NOW(),NOW());
insert into servlevel values('D1',10,NOW(),NOW());
insert into servlevel values('D2',11,NOW(),NOW());
insert into servlevel values('D3',12,NOW(),NOW());
insert into servlevel values('D4',13,NOW(),NOW());
insert into servlevel values('DR',14,NOW(),NOW());

#UserLevel
truncate userlevel;
insert into userlevel values('C1',1,NULL,NOW(),NOW());
insert into userlevel values('C2',1,NULL,NOW(),NOW());
insert into userlevel values('C3',1,NULL,NOW(),NOW());

#Notification interval
truncate notifyinterval;
insert into notifyinterval values(1,'Day 1 ',NULL,NOW(),NOW());
insert into notifyinterval values(3,'Day 3 ',NULL,NOW(),NOW());
insert into notifyinterval values(6,'Day 6 ',NULL,NOW(),NOW());
insert into notifyinterval values(9,'Day 9 ',NULL,NOW(),NOW());
insert into notifyinterval values(15,'Day 15 ',NULL,NOW(),NOW());
insert into notifyinterval values(30,'Day 30 ',NULL,NOW(),NOW());
#Comission Lookup
insert into comissionlookup values('sales',NULL,NULL,1,0.03,0,NULL,NOW(),NOW());
insert into comissionlookup values('sales',NULL,NULL,2,0.05,0,NULL,NOW(),NOW());
insert into comissionlookup values('sales',NULL,NULL,3,0.05,0,NULL,NOW(),NOW());
insert into comissionlookup values('sales',NULL,NULL,4,0.05,0,NULL,NOW(),NOW());
insert into comissionlookup values('sales',NULL,NULL,5,0.05,0,NULL,NOW(),NOW());
insert into comissionlookup values('expert',NULL,NULL,1,0.02,0,NULL,NOW(),NOW());
insert into comissionlookup values('expert',NULL,NULL,2,0.035,0,NULL,NOW(),NOW());
insert into comissionlookup values('expert',NULL,NULL,3,0.035,0,NULL,NOW(),NOW());
insert into comissionlookup values('expert',NULL,NULL,4,0.035,0,NULL,NOW(),NOW());
insert into comissionlookup values('expert',NULL,NULL,5,0.035,0,NULL,NOW(),NOW());
insert into comissionlookup values('sales',NULL,NULL,1,0.05,1,NULL,NOW(),NOW());
insert into comissionlookup values('sales',NULL,NULL,2,0.08,1,NULL,NOW(),NOW());
insert into comissionlookup values('sales',NULL,NULL,3,0.08,1,NULL,NOW(),NOW());
insert into comissionlookup values('sales',NULL,NULL,4,0.08,1,NULL,NOW(),NOW());
insert into comissionlookup values('sales',NULL,NULL,5,0.08,1,NULL,NOW(),NOW());



# Now hard part 服务佣金的lookup table
truncate servcomissionlookup;
insert into servcomissionlookup values(1,NULL,NULL,2,1.5,NULL,NOW(),NOW());
insert into servcomissionlookup values(1,NULL,NULL,5,3,NULL,NOW(),NOW());
insert into servcomissionlookup values(2,NULL,NULL,2,5,NULL,NOW(),NOW());
insert into servcomissionlookup values(2,NULL,NULL,5,10,NULL,NOW(),NOW());
insert into servcomissionlookup values(3,NULL,NULL,2,2.5,NULL,NOW(),NOW());
insert into servcomissionlookup values(3,NULL,NULL,5,5,NULL,NOW(),NOW());
insert into servcomissionlookup values(4,NULL,NULL,2,5,NULL,NOW(),NOW());
insert into servcomissionlookup values(4,NULL,NULL,4,10,NULL,NOW(),NOW());
insert into servcomissionlookup values(4,NULL,NULL,5,10,NULL,NOW(),NOW());
insert into servcomissionlookup values(5,NULL,NULL,2,2.5,NULL,NOW(),NOW());
insert into servcomissionlookup values(5,NULL,NULL,5,5,NULL,NOW(),NOW());
insert into servcomissionlookup values(6,NULL,NULL,2,2.5,NULL,NOW(),NOW());
insert into servcomissionlookup values(6,NULL,NULL,5,5,NULL,NOW(),NOW());
insert into servcomissionlookup values(7,NULL,NULL,2,2.5,NULL,NOW(),NOW());
insert into servcomissionlookup values(7,NULL,NULL,5,5,NULL,NOW(),NOW());
insert into servcomissionlookup values(17,NULL,NULL,2,1.5,NULL,NOW(),NOW());
insert into servcomissionlookup values(17,NULL,NULL,5,3,NULL,NOW(),NOW());
insert into servcomissionlookup values(13,NULL,NULL,2,5,NULL,NOW(),NOW());
insert into servcomissionlookup values(13,NULL,NULL,5,10,NULL,NOW(),NOW());
insert into servcomissionlookup values(22,NULL,NULL,2,2.5,NULL,NOW(),NOW());
insert into servcomissionlookup values(22,NULL,NULL,5,5,NULL,NOW(),NOW());
insert into servcomissionlookup values(14,NULL,NULL,2,2.5,NULL,NOW(),NOW());
insert into servcomissionlookup values(14,NULL,NULL,5,5,NULL,NOW(),NOW());
insert into servcomissionlookup values(18,NULL,NULL,2,2.5,NULL,NOW(),NOW());
insert into servcomissionlookup values(18,NULL,NULL,5,5,NULL,NOW(),NOW());
insert into servcomissionlookup values(21,NULL,NULL,2,6,NULL,NOW(),NOW());
insert into servcomissionlookup values(21,NULL,NULL,5,12,NULL,NOW(),NOW());
	#i, p now
insert into servcomissionlookup values(12,NULL,NULL,2,5,NULL,NOW(),NOW());
insert into servcomissionlookup values(12,NULL,NULL,3,5,NULL,NOW(),NOW());
insert into servcomissionlookup values(12,NULL,NULL,4,5,NULL,NOW(),NOW());
insert into servcomissionlookup values(12,NULL,NULL,5,5,NULL,NOW(),NOW());
insert into servcomissionlookup values(15,1,NULL,2,5,NULL,NOW(),NOW());
insert into servcomissionlookup values(15,1,NULL,4,5,NULL,NOW(),NOW());
insert into servcomissionlookup values(15,1,NULL,5,10,NULL,NOW(),NOW());
insert into servcomissionlookup values(15,2,NULL,2,10,NULL,NOW(),NOW());
insert into servcomissionlookup values(15,2,NULL,4,10,NULL,NOW(),NOW());
insert into servcomissionlookup values(15,2,NULL,5,20,NULL,NOW(),NOW());
insert into servcomissionlookup values(15,3,NULL,2,15,NULL,NOW(),NOW());
insert into servcomissionlookup values(15,3,NULL,4,15,NULL,NOW(),NOW());
insert into servcomissionlookup values(15,3,NULL,5,30,NULL,NOW(),NOW());

#Now the service comission from applications
insert into servappcomissionlookup values(12,1,0,1,3,1,3,0,1,1,0,NULL,NULL,NOW(),NOW());
insert into servappcomissionlookup values(15,0,0,0,0,0,0,0,0,0,5,1,NULL,NOW(),NOW());
insert into servappcomissionlookup values(15,0,0,0,0,0,0,0,0,0,10,2,NULL,NOW(),NOW());
insert into servappcomissionlookup values(15,0,0,0,0,0,0,0,0,0,15,3,NULL,NOW(),NOW());

set @stype=1; #a
select id from servrole where servRole ='负责老师' into @srole;
select id from servicestatus where serviceStatus ='进入服务' into @sprogress1;
select id from servicestatus where serviceStatus ='选校确定' into @sprogress2;
select id from servicestatus where serviceStatus ='提交申请' into @sprogress3;
select id from servicestatus where serviceStatus ='录取佣金' into @sprogress4;
select id from servicestatus where serviceStatus ='完成服务' into @sprogress5;
insert into servcomissionlookup values(@stype,@srole,NULL,0,30,@sprogress1,0.5,0,NULL,NOW(),NOW());
insert into servcomissionlookup values(@stype,@srole,NULL,0,30,@sprogress5,0.5,0,NULL,NOW(),NOW());
set @stype=2; #b
insert into servcomissionlookup values(@stype,@srole,NULL,0,100,@sprogress1,0.5,0,NULL,NOW(),NOW());
insert into servcomissionlookup values(@stype,@srole,NULL,0,100,@sprogress5,0.5,0,NULL,NOW(),NOW());
set @stype=3; #c1	
insert into servcomissionlookup values(@stype,@srole,NULL,0,50,@sprogress1,0.5,0,NULL,NOW(),NOW());
insert into servcomissionlookup values(@stype,@srole,NULL,0,50,@sprogress5,0.5,0,NULL,NOW(),NOW());
set @stype=4; #c2
insert into servcomissionlookup values(@stype,@srole,NULL,0,50,@sprogress1,0.5,0,NULL,NOW(),NOW());
insert into servcomissionlookup values(@stype,@srole,NULL,0,50,@sprogress5,0.5,0,NULL,NOW(),NOW());
set @stype=9; #e
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
create index sdc on servicedetail(contract);
create index sc on service(contract);
create index cc on contract(client);
create index sales1 on `contract`(sales1);
create index sales2 on `contract`(sales2);
create index teacher on `contract`(teacher);
create index app_serv on `application`(service);
create index servprogupdate on `servicedetail`(correspondService);
DROP PROCEDURE IF EXISTS PerUserSignRate;
delimiter ;;
create PROCEDURE PerUserSignRate (uid int, month int, year int)
COMMENT ''
BEGIN
#declare @lastM  date;
set @lastM=LastMonthEnd(year,month);
#declare thisM date;
set @thisM=ThisMonthEnd(year,month);
select user.id ,user.nickname,
紧急销售咨询量,紧急销售签约量,紧急销售签约额,
转学销售咨询量,转学销售签约量,转学销售签约额,
升学销售咨询量,升学销售签约量,升学销售签约额,
高中销售咨询量,高中销售签约量,高中销售签约额,
大客户销售咨询量,大客户销售签约量,大客户销售签约额,
其他销售咨询量,其他销售签约量,其他销售签约额,
紧急专家咨询量,紧急专家签约量,紧急专家签约额,
转学专家咨询量,转学专家签约量,转学专家签约额, 
升学专家咨询量,升学专家签约量,升学专家签约额, 
高中专家咨询量,高中专家签约量,高中专家签约额,
大客户专家咨询量,大客户专家签约量,大客户专家签约额,
其他专家咨询量,其他专家签约量,其他专家签约额,
IFNULL(紧急销售签约量,0)+IFNULL(紧急专家签约量,0) as '紧急签约量',
IFNULL(转学销售签约量,0)+IFNULL(转学专家签约量,0) as '转学签约量',
IFNULL(升学销售签约量,0)+IFNULL(升学专家签约量,0) as '升学签约量',
IFNULL(高中销售咨询量,0)+IFNULL(高中专家咨询量,0) as '高中签约量',
IFNULL(大客户销售咨询量,0)+IFNULL(大客户专家咨询量,0) as '大客户签约量',
IFNULL(其他销售咨询量,0)+IFNULL(其他专家咨询量,0) as '其他签约量',
#(IFNULL(紧急销售签约量,0)+IFNULL(紧急专家签约量,0))/(IFNULL(紧急销售咨询量,0)+IFNULL(紧急专家咨询量,0)) as '紧急签约率',
#(IFNULL(转学销售签约量,0)+IFNULL(转学专家签约量,0))/(IFNULL(转学销售咨询量,0)+IFNULL(转学专家咨询量,0)) as '转学签约率',
(IFNULL(转学销售签约量,0)+IFNULL(紧急销售签约量,0)+IFNULL(升学销售签约量,0)+IFNULL(高中销售签约量,0)+IFNULL(大客户销售签约量,0)+IFNULL(其他销售签约量,0))/(IFNULL(转学销售咨询量,0)+IFNULL(升学销售咨询量,0)+IFNULL(紧急销售咨询量,0)+IFNULL(高中销售咨询量,0)+IFNULL(大客户销售咨询量,0)+IFNULL(其他销售咨询量,0)) as '销售签约率',
(IFNULL(转学专家签约量,0)+IFNULL(紧急专家签约量,0)+IFNULL(升学专家签约量,0)+IFNULL(高中专家签约量,0)+IFNULL(大客户专家签约量,0)+IFNULL(其他专家签约量,0))/(IFNULL(转学专家咨询量,0)+IFNULL(升学专家咨询量,0)+IFNULL(紧急专家咨询量,0)+IFNULL(高中专家咨询量,0)+IFNULL(大客户专家咨询量,0)+IFNULL(其他销售咨询量,0)) as '专家签约率',
#IFNULL(紧急销售签约额,0)+IFNULL(转学销售签约额,0)+IFNULL(高中销售签约额,0)+IFNULL(学术销售签约额,0) as '销售签约额',
#IFNULL(紧急专家签约量,0)+IFNULL(转学专家签约量,0)+IFNULL(高中专家签约额,0)+IFNULL(学术专家签约额,0) as '专家签约额'
IFNULL(紧急专家签约量,0)+IFNULL(转学专家签约量,0)+IFNULL(升学专家签约量,0)+IFNULL(高中专家签约额,0)+IFNULL(其他专家签约额,0)+IFNULL(紧急销售签约额,0)+IFNULL(转学销售签约额,0)+IFNULL(升学销售签约额,0)+IFNULL(高中销售签约额,0)+IFNULL(其他销售签约额,0) as '签约额'
from user left join
(select user.id,sum(IF(c.salesGroup=1, 1,0)) as '紧急销售咨询量',
sum(IF(c.salesGroup=2,1,0)) as '转学销售咨询量',
sum(IF(c.salesGroup=3,1,0)) as '升学销售咨询量',
sum(IF(c.salesGroup=4 ,1,0)) as '高中销售咨询量',
sum(IF(c.salesGroup=12 ,1,0)) as '大客户销售咨询量',
sum(IF(c.salesGroup=5,1,0)) as '其他销售咨询量'
from user 
left join contract c on user.id in (c.sales1,c.sales2) 
where (uid in (0,user.id)) and c.createdAt between @lastM and @thisM group by user.id) as t1 on user.id=t1.id
left join
(select user.id,
sum(IF(c.salesGroup=1,1,0)) as '紧急销售签约量',
sum(IF(c.salesGroup=1,ifnull(contractPrice,sumPrice(c.id)),0)) as '紧急销售签约额',
sum(IF(c.salesGroup=2,1,0)) as '转学销售签约量',
sum(IF(c.salesGroup=2,ifnull(contractPrice,sumPrice(c.id)),0)) as '转学销售签约额',
sum(IF(c.salesGroup=3,1,0)) as '升学销售签约量',
sum(IF(c.salesGroup=3,ifnull(contractPrice,sumPrice(c.id)),0)) as '升学销售签约额',
sum(IF(c.salesGroup=4,1,0)) as '高中销售签约量',
sum(IF(c.salesGroup=4,ifnull(contractPrice,sumPrice(c.id)),0)) as '高中销售签约额',
sum(IF(c.salesGroup=12,1,0)) as '大客户销售签约量',
sum(IF(c.salesGroup=12,ifnull(contractPrice,sumPrice(c.id)),0)) as '大客户销售签约额',
sum(IF(c.salesGroup=5,1,0)) as '其他销售签约量',
sum(IF(c.salesGroup=5,ifnull(contractPrice,sumPrice(c.id)),0)) as '其他销售签约额'
from user 
left join contract c on user.id in (c.sales1,c.sales2) 
where (uid in (0,user.id)) and c.contractSigned between @lastM and @thisM and status=5 group by user.id) as t2 on user.id=t2.id
left join
(select user.id,sum(IF(c.salesGroup=1, 1,0)) as '紧急专家咨询量',
sum(IF(c.salesGroup=2,1,0)) as '转学专家咨询量',
sum(IF(c.salesGroup=3,1,0)) as '升学专家咨询量',
sum(IF(c.salesGroup=4 ,1,0)) as '高中专家咨询量',
sum(IF(c.salesGroup=12,1,0)) as '大客户专家咨询量',
sum(IF(c.salesGroup=5,1,0)) as '其他专家咨询量'
from user 
left join contract c on user.id in (c.expert1,c.expert2) 
where (uid in (0,user.id)) and c.createdAt between @lastM and @thisM group by user.id) as t3 on user.id=t3.id
left join
(select user.id,
sum(IF(c.salesGroup=1,1,0)) as '紧急专家签约量',
sum(IF(c.salesGroup=1,ifnull(contractPrice,sumPrice(c.id)),0)) as '紧急专家签约额',
sum(IF(c.salesGroup=2,1,0)) as '转学专家签约量',
sum(IF(c.salesGroup=2,ifnull(contractPrice,sumPrice(c.id)),0)) as '转学专家签约额',
sum(IF(c.salesGroup=3,1,0)) as '升学专家签约量',
sum(IF(c.salesGroup=3,ifnull(contractPrice,sumPrice(c.id)),0)) as '升学专家签约额',
sum(IF(c.salesGroup=4,1,0)) as '高中专家签约量',
sum(IF(c.salesGroup=4,ifnull(contractPrice,sumPrice(c.id)),0)) as '高中专家签约额',
sum(IF(c.salesGroup=12,1,0)) as '大客户专家签约量',
sum(IF(c.salesGroup=12,ifnull(contractPrice,sumPrice(c.id)),0)) as '大客户专家签约额',
sum(IF(c.salesGroup=5,1,0)) as '其他专家签约量',
sum(IF(c.salesGroup=5,ifnull(contractPrice,sumPrice(c.id)),0)) as '其他专家签约额'
from user 
left join contract c on user.id in (c.expert1,c.expert2) 
where (uid in (0,user.id)) and c.contractSigned between @lastM and @thisM and status=5 group by user.id) as t4 on user.id=t4.id
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
DateInRange(c.contractSigned,year,month) and status=5 group by lead.id) as t2 on t1.id=t2.id;
END;;
delimiter ;

#Now create some views for summary information
# This is the monthly Information. 
create or replace view MonthlySummary as 
(select 
IF(DAY(c.createdAt)>23,MONTH(c.createdAt)%12+1,MONTH(c.createdAt)) as 'M',
IF(DAY(c.createdAt)>23,YEAR(c.createdAt)+FLOOR(MONTH(c.createdAt)/12),YEAR(c.createdAt)) as 'Y',
FORMAT(sum(ifnull(contractPrice,sumPrice(c.id))),2) as '总收入',
count(*) as '总咨询量',
sum(IF(c.status =5,1,0)) as '总签约量',
sum(IF(c.salesGroup=1,1,0)) as '紧急咨询量',
sum(IF(c.salesGroup=1 and c.status =5,1,0))  as '紧急签约量',
sum(IF(c.salesGroup=1 and c.status =5,ifnull(contractPrice,sumPrice(c.id)),0))  as '紧急签约额',
sum(IF(c.salesGroup=2,1,0)) as '转学咨询量',
sum(IF(c.salesGroup=2 and c.status =5,1,0))  as '转学签约量',
sum(IF(c.salesGroup=2 and c.status =5,ifnull(contractPrice,sumPrice(c.id)),0))  as '转学签约额'
from contract c
#left join contractcategory on c.contractCategory=contractcategory.id
#left join status on c.status=status.id
group by M,Y) ;

create or replace view FullSummary as
select STR_TO_DATE(CONCAT(m1.Y,'-',m1.M,'-22'),'%Y-%m-%d') as 'Time',
m1.总收入,
FORMAT((m1.总收入-m2.总收入)/m2.总收入,2) as '收入月增长率',
m1.总咨询量,
(m1.总咨询量-m2.总咨询量)/m2.总咨询量 as '咨询量月增长率',
m1.总签约量,
FORMAT(m1.总收入/m1.总签约量,2) as '平均签约价',
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
 from MonthlySummary m1 left join MonthlySummary m2 on m1.M=(m2.M%12+1) and m1.Y=m2.Y+FLOOR(m2.M/12) order by Time;

DROP function IF EXISTS DateInRange;
DELIMITER $$
CREATE FUNCTION DateInRange (targetDate date,year int, month int) 
RETURNS boolean
DETERMINISTIC
BEGIN 
  DECLARE dist boolean;
  SET dist = targetDate between LastMonthEnd(year,month) and ThisMonthEnd(year,month);
  RETURN dist;
END$$
DELIMITER ;

DROP function IF EXISTS LastMonthEnd;
DELIMITER $$
CREATE FUNCTION LastMonthEnd (year int, month int) 
RETURNS date
DETERMINISTIC
BEGIN 
  DECLARE dist date;
  SET dist=SUBDATE(DATE_FORMAT(STR_TO_DATE(CONCAT(year,'-',month),'%Y-%m'),'%Y-%m-23'),INTERVAL 1 MONTH);
  RETURN dist;
END$$
DELIMITER ;

DROP function IF EXISTS ThisMonthEnd;
DELIMITER $$
CREATE FUNCTION ThisMonthEnd (year int, month int) 
RETURNS date
DETERMINISTIC
BEGIN 
  DECLARE dist date;
  SET dist=DATE_FORMAT(STR_TO_DATE(CONCAT(year,'-',month),'%Y-%m'),'%Y-%m-23');
  RETURN dist;
END$$
DELIMITER ;
# SALES COMISSION whole table or single 
-- DROP PROCEDURE IF EXISTS SalesComission;
-- delimiter ;;
-- create PROCEDURE SalesComission (uid int,sid int, year int, month int,single bool)
-- COMMENT ''
-- BEGIN
-- select client.chineseName, contract.contractPaid,user.id as "user",service.id as "service",contract.id as "contract",user.nickname,servicetype.serviceType,service.price,r.realPaid,contractcomission.salesRole,salesrole.comissionPercent,salesrole.flatComission,servicetype.comission,contractcomission.extra,IFNULL(r.realPaid,0)*salesrole.comissionPercent*userlevel.userComission*servicetype.comission+contractcomission.extra+salesrole.flatComission as "final" from user 
-- inner join contract on (contract.sales1=user.id or contract.assisCont1=user.id or contract.expert1=user.id or contract.sales2=user.id or contract.assisCont2=user.id or contract.expert2=user.id)
-- inner join client on contract.client=client.id
-- inner join service on (service.contract=contract.id)
-- left join contractcomission on (user.id=contractcomission.user and service.id=contractcomission.service)
-- left join salesrole on (contractcomission.salesRole=salesrole.id)
-- left join servicetype on (service.serviceType=servicetype.id)
-- left join userlevel on (user.userlevel=userlevel.id)
-- left join 
-- (select serviceinvoice.service, IFNULL(paidAmount,0)/totalpay*(IFNULL(invoice.receivedTotal,0)-IFNULL(invoice.receivedNontaxable,0)-IFNULL(invoice.receivedOther,0)-IFNULL(invoice.receivedRemittances,0)) as realPaid from serviceinvoice 
-- left join
-- (select invoice.id,sum(IFNULL(paidAmount,0)) as totalpay from invoice
-- left join serviceinvoice on serviceinvoice.invoice=invoice.id
-- group by invoice.id) as t on serviceinvoice.invoice=t.id
-- left join invoice on serviceinvoice.invoice=invoice.id
-- group by serviceinvoice.service) as r on r.service=service.id
-- left join whoownswho w on w.puppet=user.id
-- where ((single=false and (user.id=uid or uid=0 or w.boss=uid) and (service.id=sid or sid=0)) or (single=true and user.id=uid and service.id=sid))
--  and ((year is null or month is null) or (DateInRange(contract.contractPaid,year,month)));
-- END;;
-- delimiter ;

drop function if exists countUser;
delimiter ;;
create function countUser(sales1 int,sales2 int ,expert1 int,expert2 int) returns int deterministic
begin
 return 0+if(sales1 is null,0,1)+if(sales2 is null,0,1)+if(expert1 is null,0,1)+if(expert2 is null,0,1);
end;;
delimiter ;
drop function if exists salesRole;
delimiter ;;
create function salesRole(id int, sales1 int,sales2 int ,expert1 int,expert2 int) returns varchar(30) 
begin
declare role varchar(30);
SET role='';
if sales1=id or sales2=id then
SET role='sales';
elseif expert1=id or expert2=id then 
SET role='expert';
end if;
 return role;
end;;
delimiter ;

drop function if exists sumPrice;
delimiter ;;
create function sumPrice(id int)
RETURNS DECIMAL(10,2)
DETERMINISTIC
begin
	declare var_name decimal(10,2);
    set var_name=0;
	select sum(IFNULL(service.price,0)) into var_name from contract left join service on contract.id=service.contract where contract.id=id ;
    return var_name;
end;;
delimiter ;

DROP PROCEDURE IF EXISTS SalesComission;
delimiter ;;
create PROCEDURE SalesComission (uid int, year int, month int)
BEGIN
select client.chineseName, contract.id as 'contract',contract.salesGroup, contract.lead, salesRole(user.id,sales1,sales2,expert1,expert2) as 'role',contract.leadDetail, contract.contractPrice, sum(service.price) as 'altPrice',contract.contractSigned,user.nickname,countUser(sales1,sales2,expert1,expert2) as 'UserCount',IFNULL(s.goal,0) as 'goal' from contract 
inner join client on contract.client=client.id
inner join user on user.id in (contract.sales1,contract.sales2,contract.expert1,contract.expert2) 
left join salescomissiongoal s on (s.year=year and s.month=month and user.id=s.user)
left join service on service.contract=contract.id
left join whoownswho w on w.puppet=user.id
where contractSigned is not null and deleted!=1 and (uid=user.id or uid=w.boss or uid=0) and (DateInRange(contract.contractSigned,year,month)) group by contract.id,user.id order by user.nickname, contractSigned ;
END;;
delimiter ;

# SERVICE COMISSION


DROP PROCEDURE IF EXISTS ServiceComission;
delimiter ;;
create PROCEDURE ServiceComission (uid int, year int, month int)
COMMENT ''
BEGIN
set @year=year;
set @month=month;
set @uid=uid;
select sql_no_cache main.*, main.decidedH*ifnull(s.decideH,0)+main.decidedCC*ifnull(s.decideCC,0)+main.decidedU*ifnull(s.decideU,0) as'decidedScore',
main.appliedH*s.appliedH+main.appliedCC*s.appliedCC+main.appliedU*s.appliedU as'appliedScore',
if(anyBeforeThisMonthAccept,main.appliedH*s.perAppIfAcceptH+main.appliedCC*s.perAppIfAcceptCC+main.appliedU*s.perAppIfAcceptU,
if(anyThisMonthAccept,main.totalH*s.perAppIfAcceptH+main.totalCC*s.perAppIfAcceptCC+main.totalU*s.perAppIfAcceptU,0)) as 'acceptedScore'
from (select  t1.*, user.nickname,
sum(if(DateInRange(application.decidedDate,@year,@month) and appliedDegree=2,1,0)) as 'decidedH',
sum(if(DateInRange(application.submitDate,@year,@month) and appliedDegree=2,1,0)) as 'appliedH',
sum(if(applied and appliedDegree=2,1,0)) as 'totalH',
sum(if(DateInRange(application.decidedDate,@year,@month) and appliedDegree in (3,4),1,0)) as 'decidedCC',
sum(if(DateInRange(application.submitDate,@year,@month)and appliedDegree in (3,4),1,0)) as 'appliedCC',
sum(if(applied and appliedDegree in (3,4),1,0)) as 'totalCC',
sum(if(DateInRange(application.decidedDate,@year,@month) and appliedDegree in (5,6),1,0)) as 'decidedU',
sum(if(DateInRange(application.submitDate,@year,@month) and appliedDegree in (5,6),1,0)) as 'appliedU',
sum(if(applied and appliedDegree in (5,6),1,0)) as 'totalU',
if(sum(if(succeed and application.acceptedDate<LastMonthEnd(@year,@month),1,0))>0,1,0) as 'anyBeforeThisMonthAccept',
if(sum(if(succeed and DateInRange(application.acceptedDate,@year,@month),1,0))>0,1,0) as 'anyThisMonthAccept',
sp1.serviceProgress as 'curProgress',sp2.serviceProgress as 'lastProgress',ifnull(ss1.score,0) as 'curScore',ifnull(ss2.score,0) as 'lastScore', ifnull(ss1.score,0)-ifnull(ss2.score,0) as 'thisMonthScore'
from (select servicedetail.*,max(if(sp.createdAt<ThisMonthEnd(@year,@month),sp.id,null)) as 'curMonth',max(if(sp.createdAt<LastMonthEnd(@year,@month),sp.id,null)) as 'lastMonth' from 
serviceprogressupdate sp  inner join servicedetail on servicedetail.id=sp.serviceDetail where @uid in (user,0) and servicedetail.deleted!=1 group by servicedetail.id) as t1 
left join serviceprogressupdate sp1 on sp1.id=curMonth
left join serviceprogressupdate sp2 on sp2.id=lastMonth
left join servcomissionlookup ss1 on ss1.realServiceType=t1.realServiceType and sp1.serviceProgress=ss1.serviceProgress and (t1.level=ss1.servLevel or t1.level is null)
left join servcomissionlookup ss2 on ss2.realServiceType=t1.realServiceType and sp2.serviceProgress=ss2.serviceProgress and (t1.level=ss2.servLevel or t1.level is null)
left join contract on t1.contract=contract.id
left join application on (t1.correspondService=application.service)
inner join user on t1.user=user.id where contract.deleted!=1 or contract.deleted is null group by t1.id) as main
left join servappcomissionlookup s on s.realServiceType=main.realServiceType and (s.level=main.level or main.level is null)
where ((main.decidedH+main.appliedH+main.decidedCC+main.appliedCC+main.decidedU+main.appliedU+main.anyThisMonthAccept!=0) or curProgress!=lastProgress) ;
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




set sql_safe_updates=0;
# If the chinese name and the contract is unique, then it must be it. 
update servicedetail inner join (
select servicedetail.id,count(*) as 'count',contract.id as 'cid' from servicedetail inner join client on  servicedetail.cName=client.chineseName and ifnull(servicedetail.cName,'')!='' inner join contract on client.id=contract.client and contract.status=5 and contract.deleted=0 group by servicedetail.id) as a on a.id=servicedetail.id set contract=cid where count=1;
# If the contractKey is unique, then it must be it. 
update servicedetail inner join (
select servicedetail.id,count(*) as 'count',contract.id as 'cid' from servicedetail  inner join contract on servicedetail.contractKey=contract.nameKey and and ifnull(servicedetail.contractKey,'')!='' and contract.status=5 and contract.deleted=0 group by servicedetail.id) as a on a.id=servicedetail.id set contract=cid where count=1;
#update contractsinged
update contract inner join servicedetail on servicedetail.contract=contract.id set contractSigned=indate where status=5 and (contractSigned is null or contractSigned='0000-00-00' or contractSigned<'2000-01-01')and indate is not null;

