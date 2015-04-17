/**
 * Category2ServiceController
 *
 * @description :: Server-side logic for managing category2services
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	find:function(req,res){
		Category2Service.find().populate('serviceType').then(function(data){
			return res.json(data);
		}).fail(function(err){
			return Utilfunctions.errorHandler(err,res,"Get All Relationship between contracttype and service type failed");
		});
	}
};

