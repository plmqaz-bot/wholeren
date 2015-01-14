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
		}).catch(function(err){
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
		}).catch(function(err){
			console.log(err);
			return res.json(400,err);
		});
	},
	'getServiceComission':function(req,res){
		var id=165;
		var year=parseInt(req.param('year'));
		var month=parseInt(req.param('month'));
		if(isNaN(year)||isNaN(month)||year<1969||year>2100||month<1||month>12) return json(400,{error:"invalid year and month"});
		console.log(year);
		console.log(month);
		var sql="call ServiceComission(0,0,"+year+","+month+",false);";
		Utilfunctions.nativeQuery(sql).then(function(data){
			return res.json(data[0]);
		}).catch(function(err){
			console.log(err);
			return res.json(400,err);
		});	
	},
	'updateServiceComission':function(req,res){
		var attribs=req.body;
		attribs.year=parseInt(attribs.year);
		attribs.month=parseInt(attribs.month)
		if(attribs==null) return res.json(404,{error:"not enough parameters"});
		if(attribs.user==null||attribs.service==null||attribs.year==null||attribs.month==null){
			return res.json(404,{error:"not enough parameters"});
		}		
		if(isNaN(attribs.year)||isNaN(attribs.month)||attribs.year<1969||attribs.year>2100||attribs.month<1||attribs.month>12) return json(400,{error:"invalid year and month"});
		var toupdate={service:attribs.service,user:attribs.user,year:attribs.year,month:attribs.month};
		if(attribs.servRole!=null) toupdate.servRole=attribs.servRole;
		if(attribs.servLevel!=null) toupdate.servLevel=attribs.servLevel;
		if(attribs.startprogress!=null) toupdate.startprogress=attribs.startprogress;
		if(attribs.endprogress!=null) toupdate.endprogress=attribs.endprogress;
		if(attribs.extra!=null) toupdate.extra=attribs.extra;
		
		ServiceComission.findOne({service:toupdate.service,user:toupdate.user,year:toupdate.year,month:toupdate.month}).then(function(data){
			if(data){
				console.log("updating",toupdate,data.id);
				return ServiceComission.update({id:data.id},toupdate);
			}else{
				console.log("creating ",toupdate);
				return ServiceComission.create(toupdate);
			}
		}).then(function(data){
			console.log('done');

			var sql="call ServiceComission("+toupdate.user+","+toupdate.service+","+attribs.year+","+attribs.month+",true);"
			return Utilfunctions.nativeQuery(sql);
		}).then(function(data){
			console.log(data);
				if(data[0]) return res.json(data[0][0]);
				return res.json({});				
		}).catch(function(err){
			console.log(err);
			return res.json(400,err);
		});
	},
	'getSalesRoles':function(req,res){
		SalesRole.find().then(function(data){
			return res.json(Utilfunctions.backgridHash(data,'salesRole'));
		}).catch(function(err){
			return res.json(404,err);
		});
	},
	'getServiceRoles':function(req,res){
		ServRole.find().then(function(data){
			return res.json(Utilfunctions.backgridHash(data,'servRole'));
		}).catch(function(err){
			return res.json(404,err);
		})
	},
	'getServiceLevel':function(req,res){
		var role=parseInt(req.param('role'));
		var type=parseInt(req.param('type'));
		if(isNaN(role)||isNaN(type))return res.json([["No level",null]]);
		Utilfunctions.nativeQuery('select distinct(servlevel.servLevel),servlevel.id from servcomissionlookup s inner join servlevel on s.servlevel=servlevel.id where s.servRole='+role+' and s.serviceType='+type+';').then(function(data){
			if(data.length<1) return res.json([["No level",null]]);
			return res.json(Utilfunctions.backgridHash(data,'servLevel'));
		}).catch(function(err){
			console.log(err);
			return res.json(404,err);
		});
	},
	'getServiceStatus':function(req,res){
		var role=parseInt(req.param('role'));
		var type=parseInt(req.param('type'));
		if(isNaN(role)||isNaN(type))return res.json([["No Status",null]]);
		Utilfunctions.nativeQuery('select distinct(servicestatus.serviceStatus),servicestatus.id from servcomissionlookup s inner join servicestatus on s.serviceStatus=servicestatus.id where s.servRole='+role+' and s.serviceType='+type+';').then(function(data){
			if(data.length<1) return res.json([["No Status",null]]);
			return res.json(Utilfunctions.backgridHash(data,'serviceStatus'));
		}).catch(function(err){
			console.log(err);
			return res.json(404,err);
		});
	}
};

