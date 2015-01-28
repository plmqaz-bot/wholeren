/**
 * ServiceController
 *
 * @description :: Server-side logic for managing Services
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
 function constructsql(where,who){
			return "select contract.id as 'contract', service.id ,client.id as client,application.id as 'application' from contract \
			inner join service on contract.id=service.contract \
			inner join status on contract.status=status.id \
			inner join client on contract.client=client.id \
			left join servicedetail s on s.service=service.id \
			inner join user on (user.id =s.user) left join application on service.id=application.service where \
			contract.contractsigned is not NULL and (status.status like 'C%' or status.status like 'D%') "+who+" "+where+"\
			union\
			select contract.id as 'contract', service.id, client.id as client,application.id as 'application' from contract \
			inner join status on contract.status=status.id \
			inner join client on contract.client=client.id \
			inner join service on contract.id=service.contract \
			inner join user on \
			(user.id in (assistant1,assistant2,assistant3,assistant4,sales1,sales2,expert1,expert2,assiscont1,assiscont2)) \
			left join application on service.id=application.service where \
			contract.contractsigned is not NULL and (status.status like 'C%' or status.status like 'D%') "+who+" "+where+";"
		}
var Promise=require('bluebird');
module.exports = {
	'findOne':function(req,res){
		if(!req.params.id){
			return res.json(404,{error:"no service id "});
		}
		var userId=req.session.user.id;
		var promise;
		switch(req.session.user.rank){
			case 3:
			promise=Service.find({id:req.params.id});
			break;
			case 2:
			sql=constructsql("and boss="+userId, " and service.id="+req.params.id);
			promise=Utilfunctions.nativeQuery(sql);
			break;
			default:
			sql=constructsql("and user.id="+userId, " and service.id="+req.params.id);
			promise=Utilfunctions.nativeQuery(sql);

		}
		if(req.session.user.rank>1){
			sql=constructsql("and boss="+userId, " and service.id="+req.params.id);
			promise=Utilfunctions.nativeQuery(sql);
		}else{
			
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
			toReturn.application=toReturn.application||[];
			return res.json(toReturn);
		}).catch(function(err){
			console.log("error ",err);
			return res.json(404,err);
		});
	},
	'getService':function(req, res){
		
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
			var idarray=_.uniq(servIDs.map(function(c){return c.id;}));
			var contractarray=_.uniq(servIDs.map(function(c){return c.contract;}));
			var appliarray=_.uniq(servIDs.map(function(c){return c.application;}));
			var clientIDs=_.uniq(servIDs.map(function(c){return c.client}));
			return Promise.all([Service.find({id:idarray}).populate('application'),Client.find({id:clientIDs}),User.find(),ServiceProgress.find(),ServiceType.find(),Contract.find({id:contractarray}),Application.find({id:appliarray})]);
		}).then(function(data){
			// manual populate client
			var allClient=Utilfunctions.makePopulateHash(data[1]);
			var allService=data[0];
			var allUser=Utilfunctions.makePopulateHash(data[2]);
			var allServiceProgress=Utilfunctions.makePopulateHash(data[3]);
			var allServiceType=Utilfunctions.makePopulateHash(data[4]);
			var allContracts=Utilfunctions.makePopulateHash(data[5]);
			var allApp=Utilfunctions.makePopulateHash(data[6]);
			console.log("got all service process populate ",allService.length);
			allService.forEach(function(ele){
				ele.contract=allContracts[ele.contract];
				ele.contract.client=ele.contract.client||0;
				if(allClient[ele.contract.client]){
					ele.contract.client=allClient[ele.contract.client];
				}				
				ele.serviceType=allServiceType[ele.serviceType];
				ele.serviceProgress=allServiceProgress[ele.serviceProgress];
				ele.application=ele.application||[];
				// ele.application=ele.application.map(function(ele){
				// 	var cur=allApp[ele];
				// 	if(cur.writer){
				// 		cur.writer=allUser[cur.writer];
				// 	}
				// 	return cur;
				// });
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

