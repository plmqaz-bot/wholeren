/**
 * ServiceController
 *
 * @description :: Server-side logic for managing Services
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var Promise=require('bluebird');
module.exports = {
	'getService':function(req, res){
		var id=req.session.user.id;
		var where=req.param('where')||{};
		console.log(where);
		where=JSON.parse(where);
		// First find all signed contracts
		var promise;
		if(req.session.user.rank<3&&(req.session.user.role!=2&&req.session.user.role!=4)){
			return res.json(404, {error:"not authorized"});
		}
		switch (req.session.user.rank){
			case "3":
			promise=Contract.find({or:[{contractSigned:{'!':null}},{status:[3,4,5,6]}]}).where(where);
			break;
			case "2":
			promise=Contract.find({or:[{contractSigned:{'!':null}},{status:[3,4,5,6]}]}).where(where);
			break;
			// case "2":
			// promise=User.find({boss:id}).then(function(mypuppets){
			// 	var puppetIDs=mypuppets.map(function(puppet){return puppet.id});
			// 	return Contract.find({contractSigned:{'!':null},teacher:puppetIDs}).where(where);
			// });
			// break;
			default:
			promise=Contract.find({or:[{contractSigned:{'!':null}},{status:[3,4,5,6]}],or:[{teacher:id},{teacher:null}]}).where(where);
		}
		promise.then(function(conts){
			console.log(conts);
			var conIDs=conts.map(function(c){return c.id;});
			var clientIDs=conts.map(function(c){return c.client});
			console.log(conIDs);
			return Promise.all([Service.find({contract:conIDs}).populateAll(),Client.find({id:clientIDs}),User.find()]);
		}).then(function(data){
			// manual populate client
			var allClient=Utilfunctions.makePopulateHash(data[1]);
			var allService=data[0];
			var allUser=Utilfunctions.makePopulateHash(data[2]);
			console.log(data);
			allService.forEach(function(ele){
				var cid=ele.contract.client||0;
				ele.contract.client=allClient[ele.contract.client];
				if(ele.contract.teacher){
					ele.contract.teacher=allUser[ele.contract.teacher];
				}
			});
			return res.json(allService);
		}).fail(function(err){
			return res.json({error:err});
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

	}
};

