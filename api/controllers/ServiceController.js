/**
 * ServiceController
 *
 * @description :: Server-side logic for managing Services
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var Promise=require('bluebird');
module.exports = {
	'findOne':function(req,res){
		if(!req.params.id){
			return res.json(404,{error:"no service id "});
		}
		var userId=req.session.user.id;
		var promise;
		var sql="select distinct(service.id),client.id as client \
from service left join application on service.id=application.service \
inner join contract on contract.id=service.contract \
inner join status on contract.status=status.id \
inner join client on contract.client=client.id \
where contract.contractsigned is not NULL and (status.status like 'C%' or status.status like 'D%') and service.id="+req.params.id+" ";
		if(req.session.user.rank>1){
			sql+=";";
			promise=Utilfunctions.nativeQuery(sql);
		}else{
			sql+="and (contract.teacher is null or contract.teacher="+userId+"  or application.writer="+userId+" );";
			promise=Utilfunctions.nativeQuery(sql);
		}
		promise.then(function(serv){
			if((serv=serv||[]).length<1) return Promise.reject({error:"not found"});
			var servid=serv[0].id;
			var clientid=serv[0].client;
			return Promise.all([Service.findOne({id:servid}).populateAll(), Client.findOne({id:clientid}),User.find()]);
		}).then(function(data){
			var toReturn=data[0];
			toReturn.contract.client=data[1];
			var allUser=Utilfunctions.makePopulateHash(data[2]);
			toReturn.contract.teacher=allUser[toReturn.contract.teacher];
			toReturn.application=toReturn.application||[];
			toReturn.application.forEach(function(app){
				if(app.writer){
					app.writer=allUser[app.writer];
				}
			});
			return res.json(toReturn);
		}).catch(function(err){
			console.log("error ",err);
			return res.json(404,err);
		});
	},
	'getService':function(req, res){
		function constructsql(where,who){
			return "select service.id ,client.id as client from contract \
			inner join service on contract.id=service.contract \
			inner join status on contract.status=status.id \
			inner join client on contract.client=client.id \
			left join service_serviceteacher__user_serviceteacher_user s on s.service_serviceTeacher=service.id \
			inner join user on (user.id =s.user_serviceTeacher_user) where \
			contract.contractsigned is not NULL and (status.status like 'C%' or status.status like 'D%') "+who+" "+where+"\
			union\
			select service.id, client.id as client from contract \
			inner join status on contract.status=status.id \
			inner join client on contract.client=client.id \
			inner join service on contract.id=service.contract \
			inner join user on \
			(user.id in (assistant1,assistant2,assistant3,assistant4,sales1,sales2,expert1,expert2,assiscont1,assiscont2)) where \
			contract.contractsigned is not NULL and (status.status like 'C%' or status.status like 'D%') "+who+" "+where+";"
		}
		var id=req.session.user.id;
		var where=req.param('where')||{};
		console.log(where);
		where=JSON.parse(where);
		// First find all signed contracts
		var promise;
		var wherequery="";
		if(where.contractSigned){
			if(where.contractSigned['>']){
				wherequery+="and contractsigned>'"+where.contractSigned['>']+"'";
			}
			if(where.contractSigned['<']){
				wherequery+="and contractsigned<'"+where.contractSigned['<']+"'";
			}
		}
		switch (req.session.user.rank){
			case 3:
			sql=constructsql(wherequery,"");
			promise=Utilfunctions.nativeQuery(sql);
			break;
			case 2:
			sql=constructsql(wherequery," and user.boss="+id);
			promise=Utilfunctions.nativeQuery(sql);
			break;
			default:
			sql=constructsql(wherequery," and user.id="+id);
			promise=Utilfunctions.nativeQuery(sql);
		}
		promise.then(function(servIDs){

			if((servIDs=servIDs||[]).length<1) return Promise.reject({error:"no service found for user"});
			var idarray=servIDs.map(function(c){return c.id;});
			console.log("native done",idarray.length);
			var clientIDs=servIDs.map(function(c){return c.client});
			return Promise.all([Service.find({id:idarray}).populate('application').populate('contract'),Client.find({id:clientIDs}),User.find(),ServiceProgress.find(),ServiceType.find()]);
		}).then(function(data){
			// manual populate client
			var allClient=Utilfunctions.makePopulateHash(data[1]);
			var allService=data[0];
			var allUser=Utilfunctions.makePopulateHash(data[2]);
			var allServiceProgress=Utilfunctions.makePopulateHash(data[3]);
			var allServiceType=Utilfunctions.makePopulateHash(data[4]);
			console.log("got all service process populate ",allService.length);
			allService.forEach(function(ele){
				var cid=ele.contract.client||0;
				ele.contract.client=allClient[ele.contract.client];
				ele.serviceType=allServiceType[ele.serviceType];
				ele.serviceProgress=allServiceProgress[ele.serviceProgress];
				ele.serviceTeacher=ele.serviceTeacher.map(function(ele){
					return allUser[ele];
				});
				// populate application writer
				ele.application=ele.application||[];
				ele.application.forEach(function(app){
					if(app.writer){
						app.writer=allUser[app.writer];
					}
				});
			});
			console.log("sending");
			return res.json(allService);
		}).catch(function(err){
			console.log("error occurred text: ",err,";");
			return res.json(404,{error:err});
		});	
		//var sql="select * from service left join contract on service.contract=contract.id left join application on application.service=service.id";
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
			console.log(err);
			return res.json(404,"Error fetching filters");
		});

	},
};

