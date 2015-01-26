/**
 * ServiceDetailController
 *
 * @description :: Server-side logic for managing Servicedetails
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	find:function(req,res){
		var serv=req.param('service');
		if(!serv)  return res.json(404,{error:"no service id"});
		var sql="select * from servicedetail s left join serviceprogressupdate u on s.id=u.serviceDetail where s.service="+serv+" group by s.id order by u.createdAt limit 1";
		Utilfunctions.nativeQuery(sql).then(function(data){
			return res.json(data);
		}).catch(function(err){
			console.log(err);
			return res.json(404,err);
		});
	},
	findOne:function(req,res){
		var id=req.param.id;
		if(!id) return res.json(404,{error:"no id"});
		var sql="select s.*,u.serviceProgress from servicedetail s left join serviceprogressupdate u on s.id=u.serviceDetail where s.id="+serv+" group by s.id order by u.createdAt limit 1";
		Utilfunctions.nativeQuery(sql).then(function(data){
			return res.json(data);
		}).catch(function(err){
			console.log(err);
			return res.json(404,err);
		});
	},
	update:function(req,res){
		var id=req.param.id;
		if(!id) return res.json(404,{error:"no id"});
		var attribs=req.body;
		var progress=attribs['progress']
		delete attribs['progress'];
		var promise;
		if(progress){
			promise=ServiceProgressUpdate.create({serviceDetail:id,serviceProgress:progress});
		}else{
			promise=ServiceDetail.update({id:id},attribs);
		}
		promise.then(function(data){
			var sql="select s.*,u.serviceProgress from servicedetail s left join serviceprogressupdate u on s.id=u.serviceDetail where s.id="+serv+" group by s.id order by u.createdAt limit 1";
			return Utilfunctions.nativeQuery(sql);
		}).then(function(data){
			return res.json(data);
		}).catch(function(err){
			console.log(err);
			return res.json(404,err);
		});
	}
	
};

