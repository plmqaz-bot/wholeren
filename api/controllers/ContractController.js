/**
 * ContractController
 *
 * @description :: Server-side logic for managing Contracts
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	'getContract':function(req, res){
		Contract.find().populateAll().exec(function(err,data){
			// data.forEach(function(item){
			// 	if(item.services){
			// 		item.services.forEach(ele){
			// 			var id=ele.id;
			// 			Services.findOne({id:id}).populateAll().exec(function{
							
			// 			});
			// 		}
			// 	}
			// });
			return res.json(data);
		});	
		
	},
	'createContract':function(req,res){
		var attribs=req.body;
		if(attribs.client){
			if(attribs.client.id){
				// Update the client
				delete attribs.client["createAt"];
				delete attribs.client["updateAt"];
				delete attribs.client["contract"];
				Client.update({"id":attribs.client.id},attribs.client,function(err,cc){
					if(err){
						return res.json(400,err);
					}
					attribs.client=attribs.client.id;
					console.log("client updated");
					Contract.create(attribs).exec(function(err,data){
						if(err){
							return res.json(400,err);
						}
						console.log("contract created");
						return res.json(data);
					});			
				});
			}else{
				// If client is just number
				if(typeof attribs.client ==="number"){
					Contract.create(attribs).exec(function(err,data){
						if(err){
							return res.json(400,err);
						}
						console.log("contract created");
						return res.json(data);
					});	
				}else{
					console.log('creating client');
					Client.transaction().create(attribs.client).done(function(err,client){
						if(err){
							return client.rollback(function(err){
								console.log('create client failed');
								res.json(400,err);
							})							 
						}
						attribs.client=client.id;
						Contract.create(attribs).exec(function(err,data){
						if(err){
							return client.rollback(function(){
								console.log('create contract failed');
								return res.json(400,err);
							});							
						}
						console.log("contract created");
						return res.json(data);
					});
					})
					Client.create(attribs.client).exec(function(err,client){
					if(err){
						return res.json(400,err);
					}
					console.log("client created: ");
					attribs.client=client.id;
					Contract.create(attribs).exec(function(err,data){
						if(err){
							return res.json(400,err);
						}
						console.log("contract created");
						return res.json(data);
					});		
					
				});
			}
			}
		}else{
			return res.json(400,{"error":"client is necessary to create a contract"});
		}
	},
	'updateContract':function(req,res){
		var attribs=req.body;
		if(!req.params.id){
			return res.json(404,{error:"no contract id to update"});
		}
		console.log('update contract');
		if(attribs.client){
			if(attribs.client.id){
				// Update the client
				delete attribs.client["createAt"];
				delete attribs.client["updateAt"];
				delete attribs.client["contract"];
				Client.update({id:attribs.client.id},attribs.client,function(err,obj){
					if(err){
						return res.json(400,err);
					}
					//console.log("client updated:",obj);
					attribs.client=attribs.client.id;
					console.log(attribs);
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

	},
	getAllOptions:function(req,res){
		var toReturn={};
		async.auto({
			ContractCategory:function(dt){
				ContractCategory.find().exec(dt);
			},
			Country:function(dt){
				Country.find().exec(dt);
			},
			Degree:function(dt){
				Degree.find().exec(dt);
			},
			Lead:function(dt){
				Lead.find().exec(dt);
			},
			LeadLevel:function(dt){
				LeadLevel.find().exec(dt);
			},
			PaymentOption:function(dt){
				PaymentOption.find().exec(dt);
			},
			Status:function(dt){
				Status.find().exec(dt);
			}
		},function(err,results){
			if(err){return res.json(404,err);}
			return res.json(200,results);
		});

	}
};

