/**
 * ContractController
 *
 * @description :: Server-side logic for managing Contracts
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var Promise=require('bluebird');
module.exports = {
	'getContract':function(req, res){
		var id=req.session.user.id;
		var promise;
		switch(req.session.user.rank){
			case "3":
			promise=Contract.find().populateAll();
			break;
			case "2":
			promise=User.find({boss:id}).then(function(mypuppets){
				var puppetIDs=mypuppets.map(function(puppet){return puppet.id;});
				return Contract.find({or:[{expert:puppetIDs},{sales:puppetIDs},{teacher:puppetIDs},{assistant:puppetIDs},{assisCont:puppetIDs},{assistant:null,assisCont:null,expert:null,sales:null}]}).populateAll();
			});
			break;
			default:
			promise=Contract.find({
				or:[
				{expert:id},
				{sales:id},
				{teacher:id},
				{assistant:id},
				{assisCont:id},
				{assistant:null,assisCont:null,expert:null,sales:null}
				]
			}).populateAll();
		}
		if(promise){
			promise.then(function(data){return res.json(data);}).fail(function(err){return res.json(400,err)});	
		}else{
			res.json(400,'not found');
		}		
	},
	'createContract':function(req,res){
		var saleid=1; // change it to the user's id
		var attribs=req.body;
		attribs['sales']=saleid;
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
					// Client.transaction().create(attribs.client).done(function(err,client){
					// 	if(err){
					// 		return client.rollback(function(err){
					// 			console.log('create client failed');
					// 			res.json(400,err);
					// 		})							 
					// 	}
					// 	attribs.client=client.id;
					// 	Contract.create(attribs).exec(function(err,data){
					// 	if(err){
					// 		return client.rollback(function(){
					// 			console.log('create contract failed');
					// 			return res.json(400,err);
					// 		});							
					// 	}
					// 	console.log("contract created");
					// 	return res.json(data);
					// });
					// })
					Client.query('START TRANSACTION',function(){
						Client.create(attribs.client).then(function(client){
							attribs.client=client.id;
							return Contract.create(attribs);
						}).then(function(data){
							Client.query('COMMIT');
							return res.json(data);
						},function(err){
							console.log("error in creating contract");
							Client.query('ROLLBACK');
							return res.json(400,err);
						});
					});
					
					// Client.create(attribs.client).exec(function(err,client){
					// if(err){
					// 	return res.json(400,err);
					// }
					// console.log("client created: ");
					// attribs.client=client.id;
					// Contract.create(attribs).exec(function(err,data){
					// 	if(err){
					// 		return res.json(400,err);
					// 	}
					// 	console.log("contract created");
					// 	return res.json(data);
					// });		
					
					// });
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

				delete attribs.client["contract"];
				delete attribs.client["createAt"];
				delete attribs.client["updateAt"];
				Client.update({id:attribs.client.id},attribs.client,function(err,obj){
					if(err){
						return res.json(400,err);
					}
					//console.log("client updated:",obj);
					attribs.client=attribs.client.id;
					console.log(attribs);
					if(attribs['service']){
						return privateUpdateService(attribs['service'],req.params.id,res);
					}
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
			}else{
				Client.create(attribs.client).exec(function(err,client){
					if(err){
						return res.json(400,err);
					}
					//console.log("client created: ",client);
					attribs.client=client.id;
					if(attribs['service']){
						return privateUpdateService(attribs['service'],req.params.id,res);
					}
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
			if(attribs['service']){
				return privateUpdateService(attribs['service'],req.params.id,res);
			}

			generateComment(attribs,'sales');
			generateComment(attribs,'assistant');
			generateComment(attribs,'assisCont');
			generateComment(attribs,'expert');
			generateComment(attribs,'teacher');
			delete attribs["createAt"];
			delete attribs["updateAt"];
			Contract.update({id:req.params.id},attribs,function(err,data){
				if(err){
					return res.json(400,err);
				}
				return res.json(data);
			});	
		}
	function generateComment(attrs,field){
		if(!attrs[field])return;
		var updateValue=attrs[field];
		var oldValue="EMPTY";
		var newValue="";
		Contract.findOne({id:req.params.id}).populate(field).then(function(data){
			oldValue=data.sales?data.sales.nickname:"";
			var newUserid=updateValue.id?updateValue.id:updateValue;
			return User.findOne({id:newUserid});
		}).then(function(data){
			newValue=data.nickname;
			return Comment.create({comment:req.session.user.nickname+" has changed "+field+" from "+oldValue+" to "+newValue, contract:req.params.id});
		}).fail(function(err){console.log(err);});
	};
	function privateUpdateService(attrs,id,res){
		 // update service separatly
    var serviceAttrs=attrs;// This should be arry of service to add [transfer,study...]
    console.log(attrs);
    if(!serviceAttrs) return next();
    var toAdd=[]; // Will store the id of serviceTypes that need to be created. 
    var toKeep=[]; // This store the service id that already exist. 
    var toDel=[]; // Will store the id of services that should be deleted from contract;
    var contractId=id;
    var serviceTeacherid="";

    var types;
    var def=ServiceType.find();
    var exist;
    var def2=Contract.findOne({id:contractId}).populate('service');
    console.log("before find",contractId);
    Promise.all([def,def2]).spread(function(types,contract){
    	var teacher=contract.teacher||{};
    	serviceTeacherid=teacher.id||null;
        contract.service.forEach(function(item){
        var curServiceTypeid=item.serviceType;
        var curServiceType=_.find(types,function(type){return type.id==curServiceTypeid})||{};
        console.log(curServiceType.serviceType);
        if(curServiceType.serviceType){
          var overlap=false;
          serviceAttrs=_.reject(serviceAttrs,function(serv){
              if(serv==curServiceType.serviceType||serv==curServiceTypeid){// If the service type overlaps with the service to add, then don't do anything 
                overlap=true;
                return true;
              }else{
                return false;
              }
          });
          if(overlap){
            toKeep.push(item.id);
          }else{ // Not overlap, so this service need to be deleted
            toDel.push(item.id);
          }
        }else{
          toDel.push(item.id);
        }
      });
    }).then(function(){
      console.log("to add service type are ", serviceAttrs);
      console.log("to keep service id are ", toKeep);
      console.log("to del service are ",toDel);
      var createTasks=[];
      serviceAttrs.forEach(function(ele){
      	// Add service, set the id to the contract. 
      	console.log({serviceType:ele,contract:contractId,serviceTeacher:serviceTeacherid});
      	createTasks.push(Service.create({serviceType:ele,contract:contractId,serviceTeacher:serviceTeacherid}));
      });
      return Promise.all(createTasks);
    }).then(function(){// delete these service-contract association
    	var deleteTasks=[];
    	toDel.forEach(function(ele){
    		deleteTasks.push(Service.update({id:ele},{contract:-contractId}));
    	});
    	return Promise.all(deleteTasks);
    }).then(function(){
    	res.json(200);
    }).error(function(err){console.log(err);res.json(400,err);});  
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

	},
	
};

