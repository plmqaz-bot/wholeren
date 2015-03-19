/**
 * UserController
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	'updateUser':function(req,res){
		var attribs=req.body;
		var r=attribs['rank'];
		if(r&&r>=req.session.user.rank){
			return res.json(404,"cann not set rank higher than yourself");
		}
		delete attribs['password'];
		User.update({id:req.params.id},attribs).then(function(data){
			console.log("User updated: ",data);
			return res.json(data);
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
                bcrypt.compare(attribs.password,ppl.password,function(err,valid){
                	if(err) return res.json(400,'cannot compare password');
                    if(!valid) return res.json(400,'password incorrect');
                    console.log("update",attribs.newpassword);
					return User.update({id:id},{password:attribs.newpassword}).then(function(data){
						if(data){
							return res.json(data);
						}else{
							return res.json(400,{error:"update failed"});
						}
					})	
				});		
			}).fail(function(err){
            	return Utilfunctions.errorHandler(err,res,"Change User password failed id:"+id);
			});
		}else{
			return res.json(400,{error:"new passwords don't match"});
		}
	}
};

