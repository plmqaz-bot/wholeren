/**
 * ServiceTypeGroupController
 *
 * @description :: Server-side logic for managing Servicetypegroups
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	find:function(req,res){
		ServiceTypeGroup.find().populate('serviceType').then(function(data){
			return res.json(data);
		}).fail(function(err){
			return Utilfunctions.errorHandler(err,res,"Get All Relationship between Service package and service failed");
		});
	}
};

