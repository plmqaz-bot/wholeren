/**
 * ComissionController
 *
 * @description :: Server-side logic for managing Comissions
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var Promise=require('bluebird');
module.exports = {
	'getSalesComission':function(req,res){
		//var id=req.session.user.id;
		var id=165;
		console.log(id);
		// var promise;
		// switch(req.session.user.rank){
		// 	case "2":
		// 	promise=User.find({boss:id}).then(function(mypuppets){
		// 		var puppetIDs=mypuppets.map(function(puppet){return puppet.id;});
		// 		var where=JSON.stringify(puppetIDs).replace("[","(").replace("]",")");
		// 		return Promise.resolve(where);
		// 	});
		// 	break;
		// 	default:
		// 	promise=User.find({id:id}).then(function(data){
				
		// 	});
		// }
		var where=req.param('where')||"{}";
		where=JSON.parse(where);
		where=where['contractSigned']||{};
		console.log(where);
		var startdate=where['>']?"'"+Utilfunctions.formatDate(where['>'])+"'":"null";
		var enddate=where['<']?"'"+Utilfunctions.formatDate(where['<'])+"'":"null";

		console.log(startdate);
		console.log(enddate);
		var sql="call SalesComission(0,0,"+startdate+","+enddate+",false);";
		Contract.query(sql,function(err,data){
			if(err){
				console.log(err);
				return res.json(400,err);
			}
			return res.json(data[0]);
		});
		
	},
	'updateSalesComission':function(req,res){
		var attribs=req.body;
		if(attribs==null) return res.json(400,'no attribs');
		if(attribs.user==null||attribs.service==null){
			return res.json(404, 'not valid');
		}
		var toupdate={};
		if(attribs.salesRole) toupdate.salesRole=attribs.salesRole;
		if(attribs.extra) toupdate.extra=attribs.extra;
		toupdate.user=attribs.user;
		toupdate.service=attribs.service;
		console.log(toupdate);
		ContractComission.findOne({user:attribs.user,service:attribs.service}).then(function(data){
			if(data){
				//toupdate.id=data.id
				console.log("updating ",toupdate);
				return ContractComission.update({id:data.id},toupdate);
			}else{
				console.log("creating ",toupdate);
				return ContractComission.create(toupdate);
			}
		}).then(function(data){
			console.log('done');
			var sql="call SalesComission("+toupdate.user+","+toupdate.service+",'2014-01-01','2015-01-01',true);"
			ContractComission.query(sql,function(err,data){
				if(err) return res.json(400,err);
				if(data[0]) return res.json(data[0][0]);
				return res.json({});
				
			});
		}).fail(function(err){
			console.log(err);
			return res.json(400,err);
		});
	},
	'getServiceComission':function(req,res){

	},
	'updateServiceComission':function(req,res){
		var attribs=req.body;
		if(attribs==null) return res.json(404);
		if(attribs.user==null||attribs.service==null||attribs.year==null||attribs.month==null){
			return res.json(404);
		}
		Service.findOne({id:attribs.service}).populate('ServiceType').then(function(data){
			if(data){
				if(data.serviceType.addApplication){
					if(attribs.application){
						return ServiceComission.findOne({user:attribs.user,service:attribs.service,year:attribs.year,month:attribs.month,application:attribs.application});
					}
				}else{
					return ServiceComission.findOne({user:attribs.user,service:attribs.service,year:attribs.year,month:attribs.month});
				}
			}
		}).then(function(data){
			if(data){
				attribs.id=data.id
				return ServiceComission.update(attribs);
			}else{
				return ServiceComission.create(attribs);
			}
		}).then(function(data){
			return res.json(200);
		}).fail(function(err){
			console.log(err);
			return res.json(400,err);
		});
	},
	'getSalesRoles':function(req,res){
		SalesRole.find().then(function(data){
			return res.json(Utilfunctions.backgridHash(data,'salesRole'));
		}).fail(function(err){
			return res.json(404,err);
		});
	}
};

