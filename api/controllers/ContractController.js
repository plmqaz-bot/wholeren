/**
 * ContractController
 *
 * @description :: Server-side logic for managing Contracts
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	'getContract':function(req, res){
		Contract.find().populate('client').exec(function(err,data){
			return res.json(data);
		});	
		
	},
	'createContract':function(req,res){
		console.log(req.body);
		var attribs=req.body;
		if(attribs.client){
			if(attribs.client.id){
				// Update the client
				delete attribs.client["createAt"];
				delete attribs.client["updateAt"];
				Client.update({"id":attribs.client.id},attribs.client,function(err,cc){
					if(err){
						return res.json(400,err);
					}
					attribs.client=attribs.client.id;
					Contract.create(attribs).exec(function(err,data){
						if(err){
							return res.json(400,err);
						}
						return res.json(data);
					});			
				});
			}else{
				console.log('creating client');
				Client.create(attribs.client).exec(function(err,client){
					if(err){
						return res.json(400,err);
					}
					console.log("client created: ",client);
					attribs.client=client.id;
					Contract.create(attribs).exec(function(err,data){
						if(err){
							return res.json(400,err);
						}
						return res.json(data);
					});		
					
				});
			}
		}else{
			return res.json(400,{"error":"client is necessary to create a contract"});
		}
		

	},
	'updateContract':function(req,res){
		var attribs=req.body;

		if(attribs.client){
			if(attribs.client.id){
				// Update the client
				delete attribs.client["createAt"];
				delete attribs.client["updateAt"];
				Client.update({id:attribs.client.id},attribs.client,function(err,obj){
					if(err){
						return res.json(400,err);
					}
					//console.log("client updated:",obj);
					attribs.client=attribs.client.id;
					//console.log(attribs);
					Contract.update({id:req.params.id},attribs,function(err,data){
						if(err){
							return res.json(400,err);
						}
						console.log("contract updated: ",data);
						return res.json(data);
					});
							
				});
			}else{
				Client.create(attribs.client).exec(function(err,client){
					if(err){
						return res.json(400,err);
					}
					//console.log("client created: ",client);
					attribs.client=client.id;
					delete attribs["createAt"];
					delete attribs["updateAt"];
					Contract.update({id:req.params.id},attribs,function(err,data){
						if(err){
							return res.json(400,err);
						}
						console.log("contract updated: ",data);
						return res.json(data);
					});					
				});
			}
		}else{
			delete attribs["createAt"];
			delete attribs["updateAt"];
			Contract.update({id:req.params.id},attribs,function(err,data){
				if(err){
					return res.json(400,err);
				}
				return res.json(data);
			});	
		}

	}
};

