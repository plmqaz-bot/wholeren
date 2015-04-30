/**
 * ShortServiceController
 *
 * @description :: Server-side logic for managing Services, this is only used on choose service in Contract View.
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

 module.exports={
 	find:function(req,res){
 		var contractId=req.param('contract');
 		if(!contractId) return Utilfunctions.errorHandler({error:"No Contract ID!"},res,"Find Service failed no id:");
 		Service.find({contract:contractId}).then(function(data){
 			return res.json(data);
 		}).fail(function(err){
            return Utilfunctions.errorHandler(err,res,"Find Service Invoice failed");
		});

 	},
 	update:function(req,res){
 		var attribs=req.body;
		var id=req.params.id;
 		var toUpdate=Utilfunctions.prepareUpdate(attribs,['serviceType','price']);
 		Service.update({id:id},toUpdate).then(function(data){
 			if(data.length<1){
 				return Utilfunctions.errorHandler({error:"Update failed, the Id is not found :"+id},res,"Update failed, the Id is not found :"+id);
 			}else{
 				res.json(data[0]);
 			}
 		}).fail(function(err){
 			return Utilfunctions.errorHandler(err,res,"Update Service  failed");
 		})
 	},
 	destroy:function(req,res){
 		var id=req.params.id;
 		Service.destroy({id:id}).then(function(data){
 			return res.json({});
 		}).fail(function(err){
 			return Utilfunctions.errorHandler(err,res,"Delete Service failed");
 		});
 	}
 }