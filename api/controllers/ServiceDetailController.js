/**
 * ServiceDetailController
 *
 * @description :: Server-side logic for managing Servicedetails
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
 var Promise=require('bluebird');
function createsql(where,user,options){
	options=options||"";
	var uid=user.id;
	if(user.role==1||user.role==2){
		if (user.rank<=2){
			where=where+" and "+uid+" in (user.id,u2.id) ";
		}	
	}else if(user.role==3){
		if(user.rank<2){
			where ="and false";
		}
	}
	var sql="select servicedetail.*,contract.client,client.primaryPhone,client.primaryEmail from servicedetail inner join (select distinct servicedetail.cName,servicedetail.id,servicedetail.contract  from servicedetail left join user on servicedetail.user=user.id left join user u2 on user.role=u2.role and u2.rank>1 where true "+where+") as viewable on viewable.cName=servicedetail.cName or viewable.contract=servicedetail.contract left join contract on servicedetail.contract=contract.id left join client on contract.client=client.id where servicedetail.deleted!=1 "+options+";"
	//var sql="select distinct servicedetail.* from servicedetail left join user on servicedetail.user=user.id left join user u2 on user.role=u2.role and u2.rank>1 where true "+where+";"
	return sql;
}
function getOne(req,res){
	var id=req.params.id;
	if(!id) return Utilfunctions.errorHandler({error:"No id"},res,"Get Service Detail failed");
	var sql=createsql("and servicedetail.id="+id,req.session.user,"and servicedetail.id="+id);
	return Utilfunctions.nativeQuery(sql).then(function(data){
		if((data=data||[]).length<1) return Promise.reject({error:"not found"});
		return res.json(data[0]);
	}).catch(function(err){
        Utilfunctions.errorHandler(err,res,"Find service failed id:"+req.params.id);
	});
}
module.exports = {
	findOne:function(req,res){
		return getOne(req,res);
	},
	find:function(req,res){
		var cont=req.param('contract');
		if(!cont) {
			var where=req.param('where')||"{}";
			where=JSON.parse(where);
			// First find all signed contracts
			var promise;
			var wherequery="";
			if(where.indate){
				if(where.indate['>']){
					wherequery+="and (indate>'"+where.indate['>']+"') ";
				}
				if(where.contractSigned['<']){
					wherequery+="and (indate<'"+where.indate['<']+"') ";
				}
			}
 			Utilfunctions.nativeQuery(createsql(wherequery,req.session.user)).then(function(data){
 				return res.json(data);
 			}).catch(function(err){
	            Utilfunctions.errorHandler(err,res,"Find ServiceDetail failed");
			});
		}else{
			ServiceDetail.find({contract:cont,deleted:false}).then(function(data){
				return res.json(data);
			}).catch(function(err){
	            Utilfunctions.errorHandler(err,res,"Find ServiceDetail failed");
			});
		} 	
		//var sql=createsql(cont,null);
		//Utilfunctions.nativeQuery(sql)
		
	},
	update:function(req,res){
		var id=req.params.id;
		if(!id) return res.json(404,{error:"no id"});
		var attribs=req.body;
		console.log(attribs);
		var tocreate={};
		// tocreate['user']=attribs.user;
		// tocreate['service']=attribs.service;
		// tocreate['servRole']=attribs.servRole;
		// tocreate['servLevel']=attribs.servLevel;
		var tocreate=Utilfunctions.prepareUpdate(attribs,['user','realServiceType','serviceProgress','indate','link','contractKey','semesterType','effectiveSemester','level','correspondService']);
		 console.log(tocreate,id);
		 ServiceDetail.update({id:id},tocreate).then(function(data){
		 	data=data[0]||data;
	 	    if(tocreate['serviceProgress']){
		        return ServiceProgressUpdate.create({serviceDetail:id,serviceProgress:tocreate['serviceProgress']});
		    }
		 	if(tocreate['realServiceType']==12){
		 		console.log("This is i");
		 		return  ServiceDetail.update({id:id},{correspondService:id});
		 	}else{
				console.log("not creating progress ",data);
				return Promise.resolve(data);
			}
		 }).then(function(data){
			console.log("update successful, now get this");
			//var sql=createsql(attribs.service,attribs.user,'s.id='+id);
			return ServiceDetail.findOne({id:id});
		}).then(function(data){
			console.log(data);
			return getOne(req,res);
		}).catch(function(err){
            Utilfunctions.errorHandler(err,res,"Update Service failed id:"+id);
		});
	},
	createorupdate:function(req,res){
		var attribs=req.body;
		if(!attribs.contract) return res.json(404,{error:"no user or contract"});
		ServiceDetail.create(attribs).then(function(data){
			if(attribs['serviceProgress']){
		        ServiceProgressUpdate.create({serviceDetail:data.id,serviceProgress:attribs['serviceProgress']});
		    }
		    return res.json(data);
		}).error(function(err){
            Utilfunctions.errorHandler(err,res,"Create ServiceDetail failed");
		})
		// var tocreate=Utilfunctions.prepareUpdate(attribs,['user','service','servRole','servLevel','serviceType']);
		// progress=attribs['progress'];
		// console.log(progress);
		// ServiceDetail.findOne({user:attribs.user,service:attribs.service}).then(function(data){
		// 	data=data||{};
		// 	if(data.id){
		// 		console.log("update detail",data);
		// 		return ServiceDetail.update({id:data.id},tocreate);
		// 	}else{
		// 		console.log("create detail");
		// 		return ServiceDetail.create(tocreate);
		// 	}
		// }).then(function(data){
		// 	data=data[0]||data;
		// 	if(progress&&data.id){
		// 		console.log("create progress");
		// 		return ServiceProgressUpdate.create({serviceDetail:data.id,serviceProgress:progress});
		// 	}else{
		// 		console.log("not creating progress ",progress,data);
		// 		return Promise.resolve(data);
		// 	}
		// }).then(function(data){
		// 	console.log("create sql to retrieve the row", data);
		// 	var sql=createsql(attribs.service,attribs.user,'s.id='+data.id);
		// 	return Utilfunctions.nativeQuery(sql);
		// }).then(function(data){
		// 	data=data[0]||data;
		// 	return res.json(data);
		// }).catch(function(err){
  //           Utilfunctions.errorHandler(err,res,"Create ServiceDetail failed");
		// });
	},
	destroy:function(req,res){
		console.log("destroy");
		var id=req.params.id;
		if(!id) return res.json(404,{error:"no id"});
		ServiceDetail.findOne({id:id}).then(function(data){
			if(data.id){
				console.log(data.deleted);
				if(data.deleted==true){
					console.log("it is true, change it to false");
					return ServiceDetail.update({id:id},{deleted:false});
				}else{
					return ServiceDetail.update({id:id},{deleted:true});
				}
			}else{
				return Promise.reject({error:"not found"});
			}
		}).then(function(data){
			return res.json(data);
		}).fail(function(err){
			Utilfunctions.errorHandler(err,res,"Delete failed");
		});
	}
	
};

