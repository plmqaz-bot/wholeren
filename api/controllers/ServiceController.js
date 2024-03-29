/**
 * ServiceController
 *
 * @description :: Server-side logic for managing Services
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
 function constructsql(where,who){
			return "select distinct cli.chineseName as 'matchedcName',client.chineseName,u.nickname,service.*,c.contractSigned, servicetype.serviceType as 'type',servicetype.addApplication, c.gpa,c.toefl,c.sat,c.gre,c.otherScore, c.degree, c.targetSchoolDegree , c.major, c.previousSchool,c.endFee \
			from service \
			left join contract c on c.id=service.contract \
			left join client on c.client=client.id \
			left join client cli on cli.id=service.client \
			left join serviceprogress on service.serviceProgress=serviceprogress.id \
			left join servicetype on service.serviceType=servicetype.id \
			left join servicedetail s on s.service=service.id \
			left join degree on c.degree=degree.id \
			left join degree d on c.targetSchoolDegree=d.id \
			left join user on \
			(user.id in (assistant1,assistant2,assistant3,assistant4,sales1,sales2,expert1,expert2,assiscont1,assiscont2)) \
			left join user u on c.teacher=u.id \
			left join user u2 on s.user=u2.id \
			left join whoownswho w on (w.puppet=user.id or w.puppet=u2.id or w.puppet=u.id) where (service.generated or c.createdAt>'2015-05-01') and \
			 service.id is not null "+who+" "+where+";"
		}
var Promise=require('bluebird');
module.exports = {
	'findOne':function(req,res){
		if(!req.params.id){
			return res.json(404,{error:"no service id "});
		}
		var userId=req.session.user.id;
		switch(req.session.user.rank){
			case 3:
			sql=constructsql("", " and service.id="+req.params.id);	
			break;
			case 2:
			sql=constructsql("and (user.id="+userId+" or u.id="+userId+" or u2.id="+userId+" or w.boss="+userId+")", " and service.id="+req.params.id);
			break;
			default:
			sql=constructsql("and (user.id="+userId+" or u.id="+userId+" or u2.id="+userId+" or w.boss="+userId+")", " and service.id="+req.params.id);
		}
		Utilfunctions.nativeQuery(sql).then(function(serv){
			if((serv=serv||[]).length<1) return Promise.reject({error:"not found"});
			return res.json(serv[0]);
		}).catch(function(err){
            Utilfunctions.errorHandler(err,res,"Find Service failed id:"+req.params.id);
		});
	},
	'find':function(req, res){
		var id=req.session.user.id;
		var where=req.param('where')||{};
		console.log(where);
		where=JSON.parse(where);
		// First find all signed contracts
		var promise;
		var wherequery="";
		if(where.contractSigned){
			if(where.contractSigned['>']){
				wherequery+="and (contractsigned>'"+where.contractSigned['>']+"' or service.indate>'"+where.contractSigned['>']+"') ";
			}
			if(where.contractSigned['<']){
				wherequery+="and (contractsigned<'"+where.contractSigned['<']+"' or service.indate<'"+where.contractSigned['<']+"') ";
			}
		}
		switch (req.session.user.rank){
			case 3:
			sql=constructsql(wherequery,"");
			promise=Utilfunctions.nativeQuery(sql);
			break;
			case 2:
			sql=constructsql(wherequery,"and (user.id="+id+" or u.id="+id+" or u2.id="+id+" or w.boss="+id+")");
			promise=Utilfunctions.nativeQuery(sql);
			break;
			default:
			sql=constructsql(wherequery,"and (user.id="+id+" or u.id="+id+" or u2.id="+id+" or w.boss="+id+")");
			promise=Utilfunctions.nativeQuery(sql);
		}
		promise.then(function(servIDs){
			if((servIDs=servIDs||[]).length<1) return Promise.reject({error:"no service found for user"});
			console.log("found ",servIDs.length);
			return res.json(servIDs);
		//	var idarray=_.uniq(servIDs.map(function(c){return c.id;}));
		//	var contractarray=_.uniq(servIDs.map(function(c){return c.contract;}));
		//	var appliarray=_.uniq(servIDs.map(function(c){return c.application;}));
		//	var clientIDs=_.uniq(servIDs.map(function(c){return c.client}));
		//	return Promise.all([Service.find({id:idarray}).populate('application'),Client.find({id:clientIDs}),User.find(),ServiceProgress.find(),ServiceType.find(),Contract.find({id:contractarray}),Application.find({id:appliarray})]);
		// }).then(function(data){
		// 	// manual populate client
		// 	var allClient=Utilfunctions.makePopulateHash(data[1]);
		// 	var allService=data[0];
		// 	var allUser=Utilfunctions.makePopulateHash(data[2]);
		// 	var allServiceProgress=Utilfunctions.makePopulateHash(data[3]);
		// 	var allServiceType=Utilfunctions.makePopulateHash(data[4]);
		// 	var allContracts=Utilfunctions.makePopulateHash(data[5]);
		// 	var allApp=Utilfunctions.makePopulateHash(data[6]);
		// 	console.log("got all service process populate ",allService.length);
		// 	allService.forEach(function(ele){
		// 		ele.contract=allContracts[ele.contract];
		// 		ele.contract.client=ele.contract.client||0;
		// 		if(allClient[ele.contract.client]){
		// 			ele.contract.client=allClient[ele.contract.client];
		// 		}				
		// 		ele.serviceType=allServiceType[ele.serviceType];
		// 		ele.serviceProgress=allServiceProgress[ele.serviceProgress];
		// 		ele.application=ele.application||[];
		// 		// ele.application=ele.application.map(function(ele){
		// 		// 	var cur=allApp[ele];
		// 		// 	if(cur.writer){
		// 		// 		cur.writer=allUser[cur.writer];
		// 		// 	}
		// 		// 	return cur;
		// 		// });
		// 	});
		// 	console.log("sending");
		// 	return res.json(allService);
		}).catch(function(err){
            Utilfunctions.errorHandler(err,res,"Find Service failed");
		});	
		//var sql="select * from service left join contract on service.contract=contract.id left join application on application.service=service.id";
	},
	'update':function(req,res){
		var attribs=req.body;
		var id=req.params.id;
		var cid=null;
		delete attribs["createAt"];
		delete attribs["updateAt"];
		var serviceUpdate=Utilfunctions.prepareUpdate(attribs,['serviceProgress','step1','step2','studentDestination','link','cName','contractKey']);
		if(serviceUpdate['step1']){
			serviceUpdate['step1']=new Date(serviceUpdate['step1']);
		}
		if(serviceUpdate['step2']){
			serviceUpdate['step2']=new Date(serviceUpdate['step2']);
		}
		var contractUpdate=Utilfunctions.prepareUpdate(attribs,['gpa','gre','toefl','sat','otherScore','degree','previousSchool','major','targetSchoolDegree']);
		console.log("here");
		var promise=Service.findOne({id:id}).then(function(data){
			if(data.contract){
				cid=data.contract;
				return Contract.update({id:data.contract},contractUpdate);
			}else{
				//return Promise.reject({error:"Contract not found"});	
				return Promise.resolve({});	
			}
		}).then(function(d){
			return Service.update({id:id},serviceUpdate);
		}).then(function(data){

			sql=constructsql("", " and service.id="+req.params.id);
			return Utilfunctions.nativeQuery(sql);
		}).then(function(serv){
			//if((serv=serv||[]).length<1) return Promise.reject({error:"not found"});
			return res.json(serv[0]||{});
		}).catch(function(err){
            Utilfunctions.errorHandler(err,res,"Find Service failed id:"+req.params.id);
		});
	},
	'getFilters':function(req,res){
		
		ServiceType.find().then(function(data){
			var semisters=['spring','summer','fall','winter'];
			var applied=[];
			var now=new Date().getFullYear();
			semisters.forEach(function(ele){
				applied.push({id:ele+now,"application.appliedSemester":ele+now});
				applied.push({id:ele+(now+1),"application.appliedSemester":ele+(now+1)});
			});
			var filter={
				serviceType:{type:'table',text:'服务类型', value:data},
				"application.appliedSemester":{type:'table',text:'申请入读学期',value:applied},
			};
			return res.json(200,filter);
		}).fail(function(err){
            Utilfunctions.errorHandler(err,res,"Get Service filters failed");
		});

	},
};

