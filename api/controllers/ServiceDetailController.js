/**
 * ServiceDetailController
 *
 * @description :: Server-side logic for managing Servicedetails
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
function createsql(service,user){
	var sql="select s.service,s.user,s.servRole,s.servLevel, y.serviceProgress as 'progress' ,z.serviceType as 'type' \
		from  serviceprogressupdate y \
		inner join (select u.serviceDetail,max(u.id) as 'mostrecent' from serviceprogressupdate u group by u.serviceDetail) as x on y.id=x.mostrecent \
		right join servicedetail s on s.id=y.serviceDetail  \
		left join service z on s.service=z.id where s.user is not null "
	if(service){
		sql+="and s.service="+service;
	}
	if(user){
		sql+=" and s.user="+user;
	}
	return sql;
}
module.exports = {
	find:function(req,res){
		var serv=req.param('service');
		if(!serv)  return res.json(404,{error:"no service id"});
		var sql=createsql(serv,null);
		Utilfunctions.nativeQuery(sql).then(function(data){
			return res.json(data);
		}).catch(function(err){
			console.log(err);
			return res.json(404,err);
		});
	},
	createorupdate:function(req,res){
		var attribs=req.body;
		if(!attribs.user||!attribs.service) return res.json(404,{error:"no user or service"});
		var tocreate={};
		tocreate['user']=attribs.user;
		tocreate['service']=attribs.service;
		tocreate['servRole']=attribs.servRole;
		tocreate['servLevel']=attribs.servLevel;
		progress=attribs['progress'];
		console.log(progress);
		ServiceDetail.findOne({user:attribs.user,service:attribs.service}).then(function(data){
			data=data||{};
			if(data.id){
				console.log("update detail",data);
				return ServiceDetail.update({id:data.id},tocreate);
			}else{
				console.log("create detail");
				return ServiceDetail.create(tocreate);
			}
		}).then(function(data){
			data=data[0]||data;
			if(progress&&data.id){
				console.log("create progress");
				return ServiceProgressUpdate.create({serviceDetail:data.id,serviceProgress:progress});
			}else{
				console.log("not creating progress ",progress,data);
				return data;
			}
		}).then(function(data){
			var sql=createsql(attribs.service,attribs.user);
			return Utilfunctions.nativeQuery(sql);
		}).then(function(data){
			return res.json(data);
		}).catch(function(err){
			console.log(err);
			res.json(400,{error:err});
		});
	}
	
};

