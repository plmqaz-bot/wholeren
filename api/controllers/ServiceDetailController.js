/**
 * ServiceDetailController
 *
 * @description :: Server-side logic for managing Servicedetails
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
 var Promise=require('bluebird');
function createsql(service,user,option){
	var sql="select s.id,s.service,s.user,s.servRole,s.servLevel, y.serviceProgress as 'progress' ,servicetype.serviceType as 'typetext',z.serviceType as 'originalType',s.serviceType \
		from  serviceprogressupdate y \
		inner join (select u.serviceDetail,max(u.id) as 'mostrecent' from serviceprogressupdate u group by u.serviceDetail) as x on y.id=x.mostrecent \
		right join servicedetail s on s.id=y.serviceDetail  \
		left join service z on s.service=z.id \
		left join servicetype on z.serviceType=servicetype.id where z.serviceType is not null "
	if(service){
		sql+="and s.service="+service;
	}
	if(user){
		sql+=" and s.user="+user;
	}
	if(option){
		sql+=" and "+option;
	}
	return sql;
}
module.exports = {
	find:function(req,res){
		var cont=req.param('contract');
		if(!cont)  return res.json(404,{error:"no contract id"});
		
		//var sql=createsql(cont,null);
		//Utilfunctions.nativeQuery(sql)
		ServiceDetail.find({contract:cont}).then(function(data){
			return res.json(data);
		}).catch(function(err){
            Utilfunctions.errorHandler(err,res,"Find ServiceDetail failed");
		});
	},
	update:function(req,res){
		var id=req.params.id;
		if(!id) return res.json(404,{error:"no id"});
		var attribs=req.body;
		var tocreate={};
		// tocreate['user']=attribs.user;
		// tocreate['service']=attribs.service;
		// tocreate['servRole']=attribs.servRole;
		// tocreate['servLevel']=attribs.servLevel;
		progress=attribs['progress'];
		var tocreate=Utilfunctions.prepareUpdate(attribs,['user','realServiceType','serviceProgress','indate','link']);
		ServiceDetail.update({id:id},tocreate).then(function(data){
			data=data[0]||data;
			if(progress&&data.id){
				console.log("create progress");
				return ServiceProgressUpdate.create({serviceDetail:data.id,serviceProgress:progress});
			}else{
				console.log("not creating progress ",progress,data);
				return data;
			}
		}).then(function(data){
			var sql=createsql(attribs.service,attribs.user,'s.id='+id);
			return ServiceDetail.findOne({id:id});
		}).then(function(data){
			return res.json(data);
		}).catch(function(err){
            Utilfunctions.errorHandler(err,res,"Update Service failed id:"+id);
		});
	},
	createorupdate:function(req,res){
		var attribs=req.body;
		if(!attribs.contract) return res.json(404,{error:"no user or contract"});
		ServiceDetail.create(attribs).then(function(data){
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
		ServiceDetail.destroy({id:id}).then(function(data){
			return res.json({});
		}).fail(function(err){
            Utilfunctions.errorHandler(err,res,"Destroy Service failed");
		});
	}
	
};

