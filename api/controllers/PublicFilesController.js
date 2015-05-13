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
		req.file('file').upload({
		  dirname: path.resolve(sails.config.appPath, sails.config.filePath)
		},function (err, uploadedFiles) {
		  if (err) return Utilfunctions.errorHandler(err,res,"file upload filed");
		  if(uploadedFiles.length===0){
		  	return Utilfunctions.errorHandler({},res,"no file is uploaded");
		  }
		  //console.log("uploaded file : ",uploadedFiles);
		  var promises=_.map(uploadedFiles,function(f){
		  	console.log(f.fd);
		  	f.fd=path.basename(f.fd);
		  	console.log(f.fd);
		  	return PublicFiles.create({uploadedBy:userid,filename:f.filename,path:f.fd,category:req.body.category}).then(function(data){
		  		return {filename:data.filename,status:'success',detail:f};
		  	}).error(function(err){
		  		console.log(err);
		  		return {filename:f.filename,status:'failed',detail:f};
		  	})
		  });
		  Promise.all(promises).then(function(data){
		  	return res.json(data);
		  }).error(function(err){
		  	return Utilfunctions.errorHandler(err,res,"create database entry failed for uploaded files");
		  })
		});
	},
	getFile:function(req,res){
		req.validate({
	    	id: 'string'
	 	});
	 	PublicFiles.findOne(req.param('id')).then(function(file){
	 		if(!file) return Utilfunctions.errorHandler({},res,"file not found");
	 		if(!file.path) return Utilfunctions.errorHandler({},res,"file entry is found but file is damaged");
	 		var SkipperDisk=require('skipper-disk');
	 		var fileAdapter=new SkipperDisk();
	 		fileAdapter.read(require('path').resolve(sails.config.appPath, sails.config.filePath,file.path)).on('error',function(err){
	 			return Utilfunctions.errorHandler(err,res,"File reading failed");
	 		}).pipe(res);
	 	});
	},
	destroy:function(req,res){
		req.validate({id:'string'});
		PublicFiles.destroy(req.param('id')).then(function(file){
			console.log(file);
			if(file.length<1) return res.json({message:"success"});
			if(!file[0].path) return res.json({message:"success"});
			console.log(sails.config.filePath+file[0].path);
			fs.unlink(sails.config.filePath+file[0].path, function(error, clients){
	            if(error) return Utilfunctions.errorHandler(error,res,"deleting file content failed, maybe file is in use");  
	            return res.json({message:"success"});
        	});
		})
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

