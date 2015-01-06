/**
 * ComissionController
 *
 * @description :: Server-side logic for managing Comissions
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var Promise=require('bluebird');
module.exports = {
	'getSalesComission':function(req,res){
		var id=req.session.user.id;
		var promise;
		switch(req.session.user.rank){
			case "2":
			promise=User.find({boss:id}).then(function(mypuppets){
				var puppetIDs=mypuppets.map(function(puppet){return puppet.id;});
				var where=JSON.stringify(puppetIDs).replace("[","(").replace("]",")");
				return Promise.resolve(where);
			});
			break;
			default:
			promise=User.find({id:id});
		}
		promise.then(function(data){
			var sql="";
		});
	},
	'updateSalesComission':function(req,res){
		var attribs=req.body;
		if(attribs==null) return res.json(404);
		if(attribs.user==null||attribs.service==null){
			return res.json(404);
		}
		ContractComission.findOne({user:attribs.user,service:attribs.service}).then(function(data){
			if(data){
				attribs.id=data.id
				return ContractComission.update(attribs);
			}else{
				return ContractComission.create(attribs);
			}
		}).then(function(data){
			return res.json(200);
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
	}
};

