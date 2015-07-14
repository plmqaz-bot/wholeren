/**
 * UserController
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
Promise=require('bluebird');
module.exports = {
	'update':function(req,res){
		var attribs=req.body;
		var r=attribs['rank'];
		if(r&&r>=req.session.user.rank){
			return res.json(404,"cann not set rank higher than yourself");
		}
		console.log(attribs['currentRole']!=undefined,req.params.id,req.session.user.id)
		if(attribs['currentRole']!==undefined&&req.params.id==req.session.user.id){
			var activeRole=attribs.currentRole;
			User.findOne({id:req.params.id}).then(function(u){
				if(activeRole==0){
					req.session.user.role=u.role;
					req.session.user.subRole=u.subRole;
					req.session.user.rank=u.rank;
					sails.log.info("User role is changed to primary Role" ,req.session.user);
				}else if(activeRole==1){
					if(u.secondaryRole&&u.secondarySubRole&&u.secondaryRank){
						req.session.user.role=u.secondaryRole;
						req.session.user.subRole=u.secondarySubRole;
						req.session.user.rank=u.secondaryRank;
						sails.log.info("User role is changed to secondary Role");
					}
				}	
			})
			
		}
		delete attribs['currentRole'];
		delete attribs['password'];
		User.update({id:req.params.id},attribs).then(function(data){
			console.log("User updated: ",data[0].toJSON());
			return res.json(data[0].toJSON());
		}).fail(function(err){
			return Utilfunctions.errorHandler(err,res,"Update user failed. id:"+req.params.id);
		});					
	},
	'changepw':function(req,res){
		var bcrypt=require('bcrypt');
		var attribs=req.body;
		var id=req.session.user.id;
		//var id=211;
		console.log(id,attribs);
		if(attribs.newpassword==attribs.ne2password){
			console.log("new password match ");        
			User.findOne({id:id}).then(function(ppl){
				if(!ppl){
                    return res.json(400,'no user found');
                }
                var promise=Promise.defer();
                bcrypt.compare(attribs.password,ppl.password,function(err,valid){
                	if(err) return promise.reject('cannot compare password');
                    if(!valid) return promise.reject('password incorrect');
                    console.log("update",attribs.newpassword);
					User.update({id:id},{password:attribs.newpassword}).then(function(data){
						if(data.length>0){
							return promise.resolve(data[0]);
						}else{
							return promise.reject("update failed");
						}
					}).fail(function(err){
						promise.reject(err);
					});	
				});
				return promise.promise;		
			}).then(function(data){
				return res.json(data);
			}).fail(function(err){
            	return Utilfunctions.errorHandler(err,res,"Change User password failed id:"+id);
			}).error(function(err){
            	return Utilfunctions.errorHandler(err,res,"Change User password failed id:"+id);
			});
		}else{
			return res.json(400,{error:"new passwords don't match"});
		}
	},
	'find':function(req,res){
		var active=req.param('active');
		var where={active:true};
		if(req.session.user.rank>=3){
			if(active!=undefined){
				where={active:(active==='true')};
			}
		}
		User.find(where).then(function(data){
			return res.json(data);
		}).fail(function(err){
			return Utilfunctions.errorHandler(err,res,"Get All Users failed");
		});
	}
};

