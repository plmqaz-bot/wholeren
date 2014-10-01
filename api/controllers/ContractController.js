/**
 * ContractController
 *
 * @description :: Server-side logic for managing Contracts
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	'getContract':function(req, res){
		Contract.find().exec(function(err,data){
			res.json(data);
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
				console.log(attribs.client);
				Client.update({"id":attribs.client.id},attribs.client,function(err,cc,dd){
					if(err){
						res.json(400,err);
					}
					attribs.client=attribs.client.id;
					Contract.create(attribs).exec(function(err,data){
						if(err){
							res.json(400,err);
						}
						res.json(data);
					});			
				});
			}else{
				Client.create(attribs.client).exec(function(err,client){
					if(err){
						res.json(400,err);
					}
					console.log("client created: ",client);
					attribs.client=client.id;
					Contract.create(attribs).exec(function(err,data){
						if(err){
							res.json(400,err);
						}
						res.json(data);
					});		
					
				});
			}
		}else{
			res.json(400,{"error":"client is necessary to create a contract"});
		}
		

	},
	'updateContract':function(req,res){
		var attribs=req.body;
		if(attribs.id){
			res.json(200);
		}
		if(attribs.client){
			if(attribs.client.id){
				// Update the client
				delete attribs.client["createAt"];
				delete attribs.client["updateAt"];
				Client.update({id:attribs.client.id},attribs.client,function(err,users){
					if(err){
						res.json(400,err);
					}
					console.log("client updated:",client);
					attribs.client=client.id;
					Contract.update({id:attribs.id},attribs,function(err,data){
						if(err){
							res.json(400,err);
						}
						res.json(data);
					});
							
				});
			}else{
				Client.create(attribs.client).done(function(err,client){
					if(err){
						res.json(400,err);
					}
					console.log("client created: ",client);
					attribs.client=client.id;
					delete attribs["createAt"];
					delete attribs["updateAt"];
					Contract.update({id:attribs.id},attribs,function(err,data){
						if(err){
							res.json(400,err);
						}
						res.json(data);
					});					
				});
			}
		}else{
			delete attribs["createAt"];
			delete attribs["updateAt"];
			Contract.update({id:attribs.id},attribs,function(err,data){
				if(err){
					res.json(400,err);
				}
				res.json(data);
			});	
		}

	}
};

