/**
 * UserInServiceController
 *
 * @description :: Server-side logic for managing Userinservices
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	find:function(req,res){
		var serviceDetailId=req.param('serviceDetail');
		if(!serviceDetailId) return res.json(404,{error:"no id"});
		UserInService.find({serviceDetail:serviceDetailId}).then(function(data){
			return res.json(data);
		}).catch(function(err){
	            Utilfunctions.errorHandler(err,res,"Find User failed");
		});
		
	}
};

