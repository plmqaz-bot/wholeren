/**
 * StaticLinkController
 *
 * @description :: Server-side logic for managing staticlinks
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	create:function(req,res){
		var userid=req.session.user.id;
		var attr=req.body;
		attr.user=userid;
		StaticLink.create(attr).then(function(data){
			return res.json(data);
		}).error(function(err){
			return Utilfunctions.errorHandler(err,res,"Create Link failed");
		})
	}
};

