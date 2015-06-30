var Promise=require('bluebird');
var fs=require('fs');
var path=require('path');
module.exports={
	uploadFile:function(fileObj,options){
		var promise=Promise.defer();
		var uploader=options['userid'];
		var category=options['category'];
		var role=options['role'];
		fileObj.upload({
		  dirname: path.resolve(sails.config.appPath, sails.config.filePath)
		},function (err, uploadedFiles) {
			if (err) return promise.reject(err);
			if(uploadedFiles.length===0){
				return promise.reject({error:'no file uploaded'});
			}
			//console.log("uploaded file : ",uploadedFiles);
			var toUpload=uploadedFiles[0];
	  		toUpload.fd=path.basename(toUpload.fd);
		  	PublicFiles.create({uploadedBy:uploader,filename:toUpload.filename,path:toUpload.fd,fileCategory:category,role:role}).then(function(data){
		  		promise.resolve(data);
		  	});
		});
		return promise.promise;
	},
	download:function(id,res){
		var promise=Promise.defer();
		PublicFiles.findOne(id).then(function(file){
	 		if(!file) return promise.reject({error:'File not found'});
	 		if(!file.path) return promise.reject({error:'"file entry is found but file is damaged"'});
	 		var SkipperDisk=require('skipper-disk');
	 		var fileAdapter=new SkipperDisk();
	 		var dirname=require('path').resolve(sails.config.appPath, sails.config.filePath,file.path);
	 		console.log(dirname)
	 		fileAdapter.read(dirname)
	 		.on('error',function(err){
	 			promise.reject({error:"File reading failed"});
	 		})
	 		.on('finish',function(data){
	 			promise.resolve(data);
	 		}).pipe(res);
	 	});
	 	return promise.promise;
	},
	delete:function(filename){
		var promise=Promise.defer();
		fs.unlink(filename, function(error, clients){
	        if(error){
	        	if(error.code=='ENOENT'){ // File Not found, then it is deleted hahaha
	        		return promise.resolve();
	        	}else{
	        		return promise.reject({error:"deleting file content failed, maybe file is in use"});  		
	        	}	        	
	        } 
	        return promise.resolve();
		})
		return promise.promise;
	}
}