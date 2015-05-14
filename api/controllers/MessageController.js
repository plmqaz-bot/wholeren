/**
 * MessageController
 *
 * @description :: Server-side logic for managing messages
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	find:function(req,res){
		var userid=req.session.user.id;
		Message.find({to:userid}).then(function(data){
			return res.json(data);
		}).error(function(err){
			return  Utilfunctions.errorHandler(err,res,"Get Messages failed");
		})
	},
	findOne:function(req,res){
		req.validate({id:'string'});
		var userid=req.session.user.id;
		Message.findOne({id:req.param('id'),or:[{from:userid},{to:userid}]}).then(function(data){
			return res.json(data);
		}).error(function(err){
			return  Utilfunctions.errorHandler(err,res,"Get Messages failed");	
		})
	},
	create:function(req,res){
		var userid=req.session.user.id;
		var toCreate=Utilfunctions.prepareUpdate(req.body,['to','text','subject','replyTo']);
		toCreate['from']=userid;
		Message.create(toCreate).then(function(data){
			return res.json(data);
		}).error(function(err){
			return  Utilfunctions.errorHandler(err,res,"Create Messages failed");		
		})
	}
};

