/**
 * Group2ServiceController
 *
 * @description :: Server-side logic for managing Group2services
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	find:function(req,res){
		Group2Service.find().populate('contractCategory').then(function(data){
			return res.json(data);
		}).fail(function(err){
			return Utilfunctions.errorHandler(err,res,"Get All Relationship between group and contracttype failed");
		});
	}	
};

