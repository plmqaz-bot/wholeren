/**
 * UserController
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	'getAllUser':function(req,res){
		// calculate count
		User.find().populateAll().then(function(data){
			return res.json(data);
		});
	},
	'updateUser':function(req,res){
		var attribs=req.body;
		var r=attribs['rank'];
		if(r>=req.session.usr.rank){
			return res.json(404,"cann not set rank higher than yourself");
		}
		User.update({id:req.params.id},attribs,function(err,data){
			if(err){
				return res.json(400,err);
			}
			console.log("User updated: ",data);
			return res.json(data);
		});					
	}
};

