/**
 * StudentController
 *
 * @description :: Server-side logic for managing students
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	allclient:function(req,res){
		res.render('getallclient', {
	        currentUser:req.session.user
    	});
	}
};

