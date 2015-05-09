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
		if(req.session.user.rank>2){
			id=0;
		}
		var year=parseInt(req.param('year'));
		var month=parseInt(req.param('month'));
		if(isNaN(year)||isNaN(month)||year<1969||year>2100||month<1||month>12) return res.json(400,{error:"invalid year and month"});
		var sql="call SalesComission("+id+","+year+","+month+");";
		Promise.all([Utilfunctions.nativeQuery(sql),ComissionLookup.find()]).spread(function(data,cl){
			var comission=data[0];
			var curUser='';
			var goal=0;
			var toReturn = _.map(comission,function(ele){
				if(curUser!=ele['nickname']){
					curUser=ele['nickname'];
					goal=ele['goal'];
				}
				
				var towardGoal=Math.max(ele['contractPrice'],ele['altPrice'])/ele['UserCount'];
				ele.amountBeforeGoal=Math.min(towardGoal,goal);
				ele.amountAfterGoal=Math.max(towardGoal-goal,0);
				ele.goal=goal=Math.max(goal-towardGoal,0);
				// if(towardGoal<goal){
				// 	var amountBeforeGoal=towardGoal;
				// 	var amountAfterGoal=0;
				// 	goal=goal-towardGoal;
				// }else{
				// 	var amountBeforeGoal=goal;
				// 	var amountAfterGoal=towardGoal-goal;
				// 	goal=0;
				// }
				if((cl||[]).length>0){
					ele.percent=(_.max(cl,function(e){
						if(e.rolename==ele['role']&&e.salesGroup==ele.salesGroup){
							return e.comission;
						}
						return 0;
					})||{}).comission;
				}
				ele.comission=ele.percent*ele.amountAfterGoal*ele.UserCount+0.01*ele.amountBeforeGoal;
				return ele;
			});
			return res.json(toReturn);
		}).catch(function(err){
            Utilfunctions.errorHandler(err,res,"Getting SailesComission failed");
		});		
	},
	'updateSalesComission':function(req,res){
		var attribs=req.body;
		if(attribs==null) return res.json(400,'no attribs');
		if(attribs.user==null||attribs.service==null){
			console.log(attribs);
			return res.json(404, 'not valid');
		}
		var toupdate=Utilfunctions.prepareUpdate(attribs,['salesRole','extra','user','service']);
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
			var sql="call SalesComission("+toupdate.user+","+toupdate.service+",null,null,true);"
			ContractComission.query(sql,function(err,data){
				if(err) return res.json(400,err);
				console.log(data);
				if(data[0]) return res.json(data[0][0]);
				return res.json({});
				
			});
		}).catch(function(err){
            Utilfunctions.errorHandler(err,res,"Update SailesComission failed user: "+attribs.user+" service: "+attribs.service);
		});
	},
	'getServiceComission':function(req,res){
		var id=req.session.user.id;
		if(req.session.user.rank>2){
			id=0;
		}
		var year=parseInt(req.param('year'));
		var month=parseInt(req.param('month'));
		if(isNaN(year)||isNaN(month)||year<1969||year>2100||month<1||month>12) return res.json(400,{error:"invalid year and month"});
		console.log(year);
		console.log(month);
		var sql="call ServiceComission("+id+",0,"+year+","+month+",false);";
		Utilfunctions.nativeQuery(sql).then(function(data){
			return res.json(data[0]);
		}).catch(function(err){
            Utilfunctions.errorHandler(err,res,"Get ServiceComission Failed.");
		});	
	},
	'updateServiceComission':function(req,res){
		var attribs=req.body;
		attribs.year=parseInt(attribs.year);
		attribs.month=parseInt(attribs.month)		
		if(isNaN(attribs.year)||isNaN(attribs.month)||attribs.year<1969||attribs.year>2100||attribs.month<1||attribs.month>12) return json(400,{error:"invalid year and month"});
		if(attribs==null) return res.json(404,{error:"not enough parameters"});
		if(attribs.user==null||attribs.service==null||attribs.year==null||attribs.month==null){
			return res.json(404,{error:"not enough parameters"});
		}
		var field=['service','user','year','month','servRole','servLevel','startprogress','endprogress','extra'];
		var toupdate={service:attribs.service,user:attribs.user,year:attribs.year,month:attribs.month};
		if(attribs.servRole!=null) toupdate.servRole=attribs.servRole;
		 toupdate.servLevel=attribs.servLevel;
		 toupdate.startprogress=attribs.startprogress;
		 toupdate.endprogress=attribs.endprogress;
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
            Utilfunctions.errorHandler(err,res,"Update ServiceComission Failed.");
		});
	},
	'getAssistantComission':function(req,res){
		var id=req.session.user.id;
		if(req.session.user.rank>2){
			id=0;
		}
		var year=parseInt(req.param('year'));
		var month=parseInt(req.param('month'));
		if(isNaN(year)||isNaN(month)||year<1969||year>2100||month<1||month>12) return res.json(400,{error:"invalid year and month"});
		var sql="call AssistantComission("+id+",0,"+year+","+month+",false);";
		Utilfunctions.nativeQuery(sql).then(function(data){
			return res.json(data[0]);
		}).catch(function(err){
            Utilfunctions.errorHandler(err,res,"Get AssistantComission Failed");
		});	
	},
	'getSalesRoles':function(req,res){
		SalesRole.find().then(function(data){
			return res.json(Utilfunctions.backgridHash(data,'salesRole'));
		}).catch(function(err){
            Utilfunctions.errorHandler(err,res,"Sales Role Failed");
		});
	},
	'getServiceRoles':function(req,res){
		ServRole.find().then(function(data){
			return res.json(Utilfunctions.backgridHash(data,'servRole'));
		}).catch(function(err){
            Utilfunctions.errorHandler(err,res,"Service Role Failed");
		})
	},
	'getServiceLevel':function(req,res){
		Utilfunctions.nativeQuery('select s.servRole, s.serviceType,s.servLevel as "lid",s.serviceStatus as "sid", servlevel.servLevel,servicestatus.serviceStatus from servcomissionlookup s left join servlevel on s.servlevel=servlevel.id inner join servicestatus on s.serviceStatus=servicestatus.id;').then(function(data){
			if(data.length<1) return res.json([["No level",null]]);
			//return res.json(Utilfunctions.backgridHash(data,'servLevel'));
			return res.json(data);
		}).catch(function(err){
            Utilfunctions.errorHandler(err,res,"Service Level Failed");
		});
	},
};

