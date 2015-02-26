/**
 * ContractController
 *
 * @description :: Server-side logic for managing Contracts
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var Promise=require('bluebird');
module.exports = {
	'getContract':function(req, res){
		function constructsql(who){
			return "select distinct(contract.id) from contract \
			left join service on contract.id=service.contract \
			left join servicedetail s on s.service=service.id \
			inner join user on (user.id =s.user) where "+who+"\
			union\
			select distinct(contract.id) from contract \
			inner join user on \
			(user.id in (assistant1,assistant2,assistant3,assistant4,sales1,sales2,expert1,expert2,assiscont1,assiscont2,teacher)) where "+who;
		}
		//git preq.session.user={id:1,rank:3};
		var where=req.param('where')||"{}";
		console.log(where);
		where=JSON.parse(where);
		if(!(where.createdAt||{})['>']&&!(where.createdAt||{})['<']) where={};
		var id=req.session.user.id;
		var promise,who;
		console.log(where);
		switch(req.session.user.rank){
			case 3:
			console.log("manager");
			promise=Contract.find(where);
			break;
			case 2:
			var sql=constructsql("user.boss="+id);
			promise=Utilfunctions.nativeQuery(sql).then(function(ids){
				var idarray=ids.map(function(c){return c.id;});
				where['id']=idarray;
				return Contract.find(where);
			});
			break;
			default:
			var sql=constructsql("user.id="+id);
			promise=Utilfunctions.nativeQuery(sql).then(function(ids){
				var idarray=ids.map(function(c){return c.id;});
				where['id']=idarray;
				return Contract.find(where);
			});
		}
		
		if(promise){
			var toReturn=[];
			promise.then(function(conts){
				toReturn=conts;
				console.log("found ", toReturn.length);
				var cId=conts.map(function(e){return e.id;});
				var clientId=conts.map(function(e){return e.client;});
				return Promise.all([ContractCategory.find(),Country.find(),Degree.find(),Lead.find(),LeadLevel.find(),PaymentOption.find(),Status.find(),User.find(),Client.find({id:clientId}),Service.find({contract:cId})]);
			}).then(function(data){
				// manually populate
				var Hashs=[];
				for(var i=0;i<data.length-1;i++){
					Hashs.push(Utilfunctions.makePopulateHash(data[i]));
				}
				// Last hash the service
				Hashs.push(Utilfunctions.makeO2MHash(data[data.length-1],'contract'));
				console.log("manuall hashing",Hashs.length);
				toReturn=toReturn.map(function(ele){
					var r=_.clone(ele);
					if(r.contractCategory) r.contractCategory=Hashs[0][r.contractCategory];
					if(r.country) r.country=Hashs[1][r.country];
					if(r.degree) r.degree=Hashs[2][r.degree];
					if(r.lead) r.lead=Hashs[3][r.lead];
					if(r.leadLevel) r.leadLevel=Hashs[4][r.leadLevel];
					if(r.paymentOption) r.paymentOption=Hashs[5][r.paymentOption];
					if(r.status) r.status=Hashs[6][r.status];
					if(r.assistant) r.assistant=Hashs[7][r.assistant];
					if(r.assisCont1) r.assisCont1=Hashs[7][r.assisCont1];
					if(r.assisCont2) r.assisCont2=Hashs[7][r.assisCont2];
					if(r.expert1) r.expert1=Hashs[7][r.expert1];
					if(r.expert2) r.expert2=Hashs[7][r.expert2];
					if(r.sales1) r.sales1=Hashs[7][r.sales1];
					if(r.sales2) r.sales2=Hashs[7][r.sales2];
					if(r.teacher) r.teacher=Hashs[7][r.teacher];
					if(r.client) r.client=Hashs[8][r.client];
					r.service=Hashs[9][r.id]||[];
					return r;
				});
				return Promise.resolve(toReturn);
			}).then(function(data){
				console.log(data.length);
				return res.json(data);
			}).catch(function(err){
				console.log(err);
				return res.json(400,err)
			});	
		}else{
			res.json(400,'not found');
		}		
	},
	'createContract':function(req,res){
		var saleid=req.session.user.id; // change it to the user's id
		var attribs=req.body;
		attribs['sales1']=saleid;
		if(attribs.client){
			var promise;
			if(attribs.client.id){
				// Update the client
				delete attribs.client["createAt"];
				delete attribs.client["updateAt"];
				delete attribs.client["contract"];
				promise=Client.update({"id":attribs.client.id},attribs.client);
				// Client.update({"id":attribs.client.id},attribs.client,function(err,cc){
				// 	if(err){
				// 		return res.json(400,err);
				// 	}
				// 	attribs.client=attribs.client.id;
				// 	console.log("client updated");
				// 	Contract.create(attribs).exec(function(err,data){
				// 		if(err){
				// 			return res.json(400,err);
				// 		}
				// 		console.log("contract created");
				// 		return res.json(data);
				// 	});			
				// });
			}else if(typeof attribs.client ==="number"){
				promise=Client.findOne({id:attribs.client});
			}else{
				console.log("create client");
				promise=Client.create(attribs);
			}	
			promise.then(function(data){
				if((data||{}).id){
					console.log("got client",data);
					attribs.client=data.id;
					return Contract.create(attribs);
				}else{
					return Promise.reject({error:"failed to create the client"});
				}
			}).then(function(cont){
				console.log("got contract",cont);
				return res.json(cont);	
			}).fail(function(err){
				return res.json(400,err);
			});
				// If client is just number
				// if(typeof attribs.client ==="number"){
				// 	Contract.create(attribs).exec(function(err,data){
				// 		if(err){
				// 			return res.json(400,err);
				// 		}
				// 		console.log("contract created");
				// 		return res.json(data);
				// 	});	
				// }else{
				// 	console.log('creating client');
				// 	Client.query('START TRANSACTION',function(){
				// 		Client.create(attribs.client).then(function(client){
				// 			attribs.client=client.id;
				// 			console.log("client id is ",client.id);
				// 			console.log("creating contract");
				// 			return Contract.create(attribs);
				// 		}).then(function(data){
				// 			console.log("contract created");
				// 			return Client.query('COMMIT',function(){
				// 				return res.json(data);	
				// 			});							 
				// 		}).fail(function(err){
				// 			console.log("error in creating contract");
				// 			return Client.query('ROLLBACK',function(){
				// 				return res.json(400,err);
				// 			});
				// 		});
				// 	});
				// }
			//}
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

			//generateComment(attribs,'sales');
			//generateComment(attribs,'assistant');
			//generateComment(attribs,'assisCont');
			//generateComment(attribs,'expert');
			//generateComment(attribs,'teacher');
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
	getFilters:function(req,res){
		var filter={
			endFee:{type:'bool',text:'已收尾款'},
			endFeeDue:{type:'bool',text:'应收尾款'}
		};
		ContractCategory.find().then(function(data){
			filter.contractCategory={type:'table',text:'咨询服务', value:data};
			return Lead.find();
		}).then(function(data){	
				//contractCategory:{type:'table',text:'咨询服务', value:[{id:[7,8,9],contractCategory:"test"}]},
			filter.lead={type:'table',text:'Lead种类',value:data};
			return res.json(200,filter);
		}).fail(function(err){
			return res.json(404,err);
		});
		
	},
};

