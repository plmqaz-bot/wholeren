/**
 * ApplicationFileController
 *
 * @description :: Server-side logic for managing applicationfiles
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	create:function(req,res){
		var userid=req.session.user.id;
		console.log("body is ",req.body);
		var attr=req.body;
		if(!userid) return Utilfunctions.errorHandler(err,res,"no valid user id");
		if(!attr.application) return Utilfunctions.errorHandler(err,res,"no valid application id");
		console.log(sails.config.appPath);
		FileManager.uploadFile(req.file('file'),{userid:userid,category:3}).then(function(data){// category 3 is hidden
			if(!data.id) return Promise.reject("file upload failed");
			return ApplicationFile.create({application:attr.application,file:data.id})
		}).then(function(data){
			return res.json(data);
		}).error(function(err){
		  	return Utilfunctions.errorHandler(err,res,"create database entry failed for uploaded files");
		});
	},
};

