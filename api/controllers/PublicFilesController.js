/**
 * PublicFilesController
 *
 * @description :: Server-side logic for managing Publicfiles
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var Promise=require('bluebird');
var fs=require('fs');
var path=require('path');
module.exports = {
	create:function(req,res){
		var userid=req.session.user.id;
		console.log("body is ",req.body);
		if(!userid) return res.json(401, 'no valid user id');
		console.log(sails.config.appPath);
		FileManager.uploadFile(req.file('file'),{userid:userid,category:req.body.category}).then(function(data){
			return res.json(data);
		}).error(function(err){
		  	return Utilfunctions.errorHandler(err,res,"create database entry failed for uploaded files");
		});
	},
	find:function(req,res){
		PublicFiles.find({or:[{fileCategory:{'!':3}},{fileCategory:null}]}).then(function(data){
			return res.ok(data);
		}).error(function(err){
			return Utilfunctions.errorHandler(err,res,"Get list of files failed");
		});
	},
	getFile:function(req,res){
		req.validate({
	    	id: 'string'
	 	});
	 	FileManager.download(req.params.id,res).error(function(err){
	 		return Utilfunctions.errorHandler(err,res,"download file failed");
	 	})
	},
	destroy:function(req,res){
		req.validate({id:'string'});
		PublicFiles.findOne(req.param('id')).then(function(file){
			if(!file) return Promise.resolve();
			var dirname=sails.config.filePath+file.path;
			return FileManager.delete(dirname).then(function(){
				return PublicFiles.destroy(req.param('id'));
			});
		}).then(function(){
			return res.json({message:"success"});
		}).error(function(err){
				Utilfunctions.errorHandler(err,res,"deleting file content failed, maybe file is in use");  
		});
	},
	update:function(req,res){
		req.validate({id:'string'});
		var toUp=Utilfunctions.prepareUpdate(req.body,['fileCategory','role']);
		PublicFiles.update(req.param('id'),toUp).then(function(file){
			if(file.length>0){
				return res.json(file[0]);
			}
			return res.json(401,"Not found");
		}).error(function(err){
			return Utilfunctions.errorHandler(err,res,"Update failed");
		});
	}
};

