(function() {
	var parse=require('csv-parse');
	var fs=require('fs');
	var Promise=require('bluebird');
	filename='toImport.csv';

	 fs.readFile(filename,'utf8',function(err,data){
	 	if(err) throw err;
	 	parse(data,{comment:'#'},function(err,output){
		 	console.log(output[1][0]);
 		})
	 });
	 function oneline(line){
	 	var contract={};
	 	var client={};
	 	client.chineseName=line[1];
	 	contract.contractCategory=line[2];
	 	contract.createdAt=line[3];
	 	contract.lead=line[4]; // Later get the id;
	 	contract.leadName=line[5];
	 	contract.assistant=line[6]; //Later get user id;
	 	contract.sales=line[7]; //later get user id;
	 	contract.expert=line[8]; // later get user id;
	 	contract.status=line[9]; // later get id of status;
	 	contract.salesFollowup=line[10];
	 	contract.salesRecord=line[11];
	 	contract.leadLevel=line[12]; // later get leadlevel id;
	 	contract.expertContactdate=line[13];
	 	//contract.expertFollowup=line[14];
	 	contract.expertFollowup=line[15];
	 	client.lastName=line[16];
	 	client.firstName=line[17];
	 	contract.originalText=line[18];
	 	client.primaryEmail=line[19];
	 	client.primaryPhone=line[20];
	 	contract.country=line[22]; // later get country id;
	 	contract.validI20=line[23]=='是'?true:false;
	 	contract.previousSchool=line[24];
	 	contract.targetSchool=line[25];
	 	contract.gpa=line[26];
	 	contract.toefl=line[27];
	 	contract.otherScore=line[28];
	 	contract.age=line[29];
	 	contract.degree=line[30]; // later get degree id
	 	contract.diagnose=line[31];
	 	contract.contractSigned:line[32];
	 	contract.contractPaid=line[33];
	 	var Service=line[34]+","+line[35]+","+line[36]+","+line[37]; // Work on service
	 	contract.contractPrice=line[38];
	 	contract.contractDetail=line[39];
	 	contract.endFee=line[40];
	 	contract.paymentOption=line[41]; // later get payment id
	 	contract.endFeeDue=line[42]=='是'?true:false;
	 	contract.teacher=line[43]; // later get user id
	 	getClient(client).then(function(cid){
	 		contract.client=cid;
	 		return getUser(contract.assistant);
	 	}).then(function(assis){
	 		contract.assistant=assis.id;
	 		return getUser(contract.sales);
	 	}).then(function(sale){
	 		contract.sales=sale.id;
	 		return getUser(contract.expert);
	 	}).then(function(exp){
	 		contract.expert=exp.id;
	 		return getUser(contract.teacher);
	 	}).then(function(tea){
	 		contract.teacher=tea.id;
	 		// add this contract
	 		return Contract.create(contract);
	 	}).then(function(cont){
	 		var contractID=cont.id;
	 		return getService(contract.service,contractID);
	 	});
	 };
	 function getClient(client){
	 	var Promise=require('bluebird');
	 	var clientId=null;
	 	var p=new Promise();
	 	Client.find({chineseName:client.chineseName}).then(function(data){
	 		if(data){
	 			return Promise.resolve(data);
	 		}else{
	 			return Client.create(client);
	 		}
	 	}).then(function(data){
	 		p.resolve(data.id);
	 	}).fail(function(err){
	 		console.log(err);
	 		p.reject(err);
	 	});
	 	return p;
	 };
	 function getUser(user){
	 	
	 	var useId=null;
	 	var p=new Promise();
	 	User.find({nickname:user}).then(function(data){
	 		p.resolve(data.id);
	 	}).fail(function(err){
	 		console.log('user not found');
	 		p.reject(err);
	 	});
	 	return p;
	 }
	 function getService(service,contID){
	 	service=service.replace("，",",");
	 	var servs=service.split(",");
	 	var p=new Promise();
	 	var insertPs=[];
	 	var serviceIDs=[];
	 	servs.forEach(function(ele){
	 		var id=findID(ele);
	 		var curPromise=Service.create({contract:contID,serviceType:id}).then(function(s){
	 			serviceID.push(s.id);
	 		}).fail(function(err){
	 			p.reject(err);
	 		});
	 		insertPs.push(curPromise);
	 	});
	 	Promise.all(insertPs).then(function(data){
	 		p.resolve(serviceIDs); 
	 	}).fail(function(err){
	 		p.reject(err);
	 	});
	 	return p;
	 }
	 function findID(servs){
	 	var id=1;
	 	return id;
	 }
	
// 	data='"客户ID
// (WRS019999)",学生中文名,"咨询服务类别
// （单选）","首次咨询日期
// (9/12/2099)","Lead种类
// （单选）",Lead介绍人,"Assistant 
// 前期助理","Sales 
// 销售顾问","Expert 
// 专家","Status
// 签约状态","Sales Follow-up
// 催单跟进记录
// (9-9 电话学生，说考虑)","销售跟进点摘要
// 1. 学生申请学校偏向（地点，专业等）
// 2. 学生遗留问题，需后期老师解答
// 3. 学生特别纠结的地方
// 4. 转学个人愿意（如有）
// 5. 销售给学生的具体建议","Lead Level
// （单选）",转学专家咨询日期,"转学专家咨询建议：
// 1. 学生签约的具体要求
// 2. 学生特点及后期销售跟进建议
// 3. 专家给学生的转学建议具体","紧急专家咨询跟进建议：
// 1. 学生身份是否需澄清？身份怎样？
// 2. 学生签约的具体要求
// 3. 学生特点及跟进建议
// 4. 专家给学生的具体建议","Student Last Name

// English","Student First Name

// English","紧急求助原文
// or
// 转学需求原文","Stu Email
// 学生常用邮箱","Stu Phone
// 学生电话","其它联系方式
// （QQ, WeChat, Skype等）",人在中国还是美国,I-20是否有效,"Previous School
// 原学校","Target School
// 目标学校",GPA,"TOEFL
// 或雅思","Other Score
// 其它分数
// (GRE,GMAT, SSAT,SAT)","Age
// 年龄","Degree
// 就读学位","诊断书
// 放弃治疗原因","Contract Signed On
// 签约日","Paid On
// 付款日","所购服务紧急之：
// （多选请手动填写）",所购服务升学/转学之：,"所购服务签证之：
// （多选请手动填写）","所购服务学术之：
// （多选请手动填写）",签约价 $$,签约价明细,$150 学校申请费,付款方式,是否需收转学尾款,服务负责老师
// WRS010105,杜苑召,紧急服务,11/24/2014,Web电话/网络,NA,"paula3, qi1",qiqi,xiaoya,A. 未签约,11/26 感恩节后去找教授问,,,,,,,,"你好，
// 我是一名来自ASU的本科学生，因为GPA连续两学期低于2.0现在面临被开除的危险。正在寻求解决的办法。请问我该怎么做呢。
// 2014年1月   至   2018年1月
// 成绩过低，还没处分
// 你希望得到那些帮助? 希望能指导我接下去怎么做。。",yuanzhao@asu.edu,4804277366,,,,ASU,,0.92,,,,,,,,,,,,,,,,,'
// parse(data,{comment:'#'},function(err,output){
// 	console.log(output);
// });




})();