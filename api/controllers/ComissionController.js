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
		var start=req.param('startdate');
		var end=req.param('enddate');
		var startdate=start?"'"+Utilfunctions.formatDate(start)+"'":"null";
		var enddate=end?"'"+Utilfunctions.formatDate(end)+"'":"null";
		console.log(startdate);
		console.log(enddate);
		var sql="call SalesComission(0,0,"+startdate+","+enddate+",false);";
		Utilfunctions.nativeQuery(sql).then(function(data){
			return res.json(data[0]);
		}).error(function(err){
			console.log(err);
			return res.json(400,err);
		});		
	},
	'updateSalesComission':function(req,res){
		var attribs=req.body;
		if(attribs==null) return res.json(400,'no attribs');
		if(attribs.user==null||attribs.service==null){
			return res.json(404, 'not valid');
		}
		var toupdate={};
		if(attribs.salesRole!=null) toupdate.salesRole=attribs.salesRole;
		if(attribs.extra!=null) toupdate.extra=attribs.extra;
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
		var id=165;
		var year=req.param('year');
		var month=req.param('month');
		var year=year?"'"+Utilfunctions.formatDate(year)+"'":"null";
		var month=month?"'"+Utilfunctions.formatDate(month)+"'":"null";
		console.log(year);
		console.log(month);
		var sql="call ServiceComission(0,0,"+year+","+month+",false);";
		Utilfunctions.nativeQuery(sql).then(function(data){
			return res.json(data[0]);
		}).error(function(err){
			console.log(err);
			return res.json(400,err);
		});	
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
		}).error(function(err){
			console.log(err);
			return res.json(400,err);
		});
	},
	'getSalesRoles':function(req,res){
		SalesRole.find().then(function(data){
			return res.json(Utilfunctions.backgridHash(data,'salesRole'));
		}).error(function(err){
			return res.json(404,err);
		});
	},
	'getServiceRoles':function(req,res){
		ServRole.find().then(function(data){
			return res.json(Utilfunctions.backgridHash(data,'servRole'));
		}).error(function(err){
			return res.json(404,err);
		})
	},
	'getServiceLevel':function(req,res){
		var role=JSON.parse(req.param('role'));
		var type=JSON.parse(req.param('type'));
		if(role==null||type==null)return res.json([["No level",null]]);
		Utilfunctions.nativeQuery('select distinct(servlevel.servLevel),servlevel.id from servcomissionlookup s inner join servlevel on s.servlevel=servlevel.id where s.servRole='+role+' and s.serviceType='+type+';').then(function(data){
			if(data.length<1) return res.json([["No level",null]]);
			return res.json(Utilfunctions.backgridHash(data,'servLevel'));
		}).error(function(err){
			console.log(err);
			return res.json(404,err);
		});
	},
	'getServiceStatus':function(req,res){
		var role=JSON.parse(req.param('role'));
		var type=JSON.parse(req.param('type'));
		if(role==null||type==null)return res.json([["No Status",null]]);
		Utilfunctions.nativeQuery('select distinct(servicestatus.serviceStatus),servicestatus.id from servcomissionlookup s inner join servicestatus on s.serviceStatus=servicestatus.id where s.servRole='+role+' and s.serviceType='+type+';').then(function(data){
			if(data.length<1) return res.json(404,{error:"No status to choose"});
			return res.json(Utilfunctions.backgridHash(data,'serviceStatus'));
		}).error(function(err){
			console.log(err);
			return res.json(404,err);
		});
	}
};

