/**
 * ContractController
 *
 * @description :: Server-side logic for managing Contracts
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var Promise=require('bluebird');
function constructsql(who){
	return "select distinct(contract.id) from contract \
	left join service on contract.id=service.contract \
	left join servicedetail s on s.service=service.id \
	inner join user on (user.id =s.user) \
	left join subrole_handle_salesgroup ss on ss.salesGroup=contract.salesGroup \
	left join whoownswho w on w.puppet=user.id \
	where "+who+"\
	union\
	select distinct(contract.id) from contract \
	inner join user on \
	(user.id in (assistant1,assistant2,assistant3,assistant4,sales1,sales2,expert1,expert2,assiscont1,assiscont2,teacher)) \
	left join subrole_handle_salesgroup ss on ss.salesGroup=contract.salesGroup \
	left join whoownswho w on w.puppet=user.id \
	where "+who;
}
function whoCanView(user,where){
	var restrictions=""
	var id =user.id;
	if(user.role==1){
		switch (user.rank){
			case 1: var restrictions="user.id ="+id;break;
			case 2: var restrictions="(user.id ="+id+" or ss.subRole="+user.subRole+")";break;
		}
	}
	if(user.role==3){ // Marketing
		switch (user.rank){
			case 1: var restrictions= "false";break;
		}
	}
	if(restrictions!=""){
		var sql=constructsql(restrictions);
		promise=Utilfunctions.nativeQuery(sql).then(function(ids){
			console.log("Establish the ids that the user can view");
			var idarray=ids.map(function(c){return c.id;});
			where['id']=idarray;
			return Contract.find(where);
		});
	}else{
		promise=Contract.find(where);
	}
	return promise;
}

var findOne=function(req,res,id){
		return Contract.findOne({id:id}).populate('client').then(function(data){
			console.log("look for "+id)
			if(data){
				if(data.client) {
					data.clientName=data.client['chineseName'];
					//data.client=data.client.id;
				}	
				return res.json(data);
			}else{
				return Promise.reject("contract does not exist!!");
			}			
		}).catch(function(err){
			Utilfunctions.errorHandler(err,res,"Find Contract failed");
		});
	}
module.exports = {
	'findOne':function(req,res){
		var id=req.params.id;
		return findOne(req,res,id);
	},
	'getContract':function(req, res){

		//git preq.session.user={id:1,rank:3};
		var where=req.param('where')||"{}";
		console.log(where);
		where=JSON.parse(where);
		if(!(where.createdAt||{})['>']&&!(where.createdAt||{})['<']) where={};
		if(!where.deleted){
			where.deleted=false;
		}else{
			where.deleted=true;
		}
		var id=req.session.user.id;
		var promise,who;
		console.log(where);
		promise=whoCanView(req.session.user,where);
		// switch(req.session.user.rank){
		// 	case 3:
		// 	console.log("manager");
		// 	promise=Contract.find(where);
		// 	break;
		// 	case 2:
		// 	var sql=constructsql(" (user.id ="+id+")");
		// 	promise=Utilfunctions.nativeQuery(sql).then(function(ids){
		// 		var idarray=ids.map(function(c){return c.id;});
		// 		where['id']=idarray;
		// 		return Contract.find(where);
		// 	});
		// 	break;
		// 	default:
		// 	var sql=constructsql(" (user.id ="+id+")");
		// 	promise=Utilfunctions.nativeQuery(sql).then(function(ids){
		// 		var idarray=ids.map(function(c){return c.id;});
		// 		where['id']=idarray;
		// 		return Contract.find(where);
		// 	});
		// }
		
		if(promise){
			var toReturn=[];
			promise.then(function(conts){
				toReturn=conts;
				console.log("found ", toReturn.length);
				var cId=conts.map(function(e){return e.id;});
				var clientId=conts.map(function(e){return e.client;});
				return Promise.all([Client.find({id:clientId}),Service.find({contract:cId})]);
			}).then(function(data){
				// manually populate
				var Hashs=[];
				Hashs.push(Utilfunctions.makePopulateHash(data[0]));
				// Last hash the service
				Hashs.push(Utilfunctions.makeO2MHash(data[1],'contract'));
				//console.log("manuall hashing",Hashs.length);
				 toReturn=toReturn.map(function(ele){
				 	var r=ele;
				 	if(r.client){
				 		r.client=Hashs[0][r.client]||{};
				 		r.clientName=r.client['chineseName'];
				 	} 
				 	var services=Hashs[1][r.id]||[];
				 	var totalprice=0;
				 	for(var i=0;i<services.length;i++){
				 		totalprice+=services[i].price||0;
				 	}
				 	r.price=r.price||totalprice;
				// 	r.service=Hashs[9][r.id]||[];
				 	return r;
				 });
				return Promise.resolve(toReturn);
			}).then(function(data){
				console.log(data.length);
				return res.json(data);
			}).catch(function(err){
            	Utilfunctions.errorHandler(err,res,"Find Contract failed");
			});	
		}else{
			res.json(400,'not found');
		}		
	},
	'createContract':function(req,res){
		var saleid=req.session.user.id; // change it to the user's id
		var attribs=req.body;
		attribs['sales1']=saleid;
		delete attribs["_url"];
		if(attribs.client){
			var promise;
			if(attribs.client.id){
				// Update the client
				delete attribs.client["createdAt"];
				delete attribs.client["updatedAt"];
				delete attribs.client["contract"];
				delete attribs.client["_url"];
				console.log("update client",attribs.client);
				promise=Client.update({id:attribs.client.id},attribs.client);
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
				promise=Client.create(attribs.client);
			}	
			promise.then(function(data){
				data=(data||{});
				data=(data[0]||data);
				if(data.id){
					console.log("got client",data);
					attribs.client=data.id;
					return Contract.create(attribs);
				}else{
					console.log("data is ",data);
					return Promise.reject({error:"failed to create the client"});
				}
			}).then(function(cont){
				console.log("got contract",cont);
				return findOne(req,res,cont.id);
				//return res.json(cont);	
			}).fail(function(err){
            	Utilfunctions.errorHandler(err,res,"Import User failed");
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
						return findOne(req,res,req.params.id);
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
						return findOne(req,res,req.params.id);
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
//			delete attribs["createAt"];
			delete attribs["updateAt"];
			console.log(attribs);
			Contract.update({id:req.params.id},attribs,function(err,data){
				if(err){
					return res.json(400,err);
				}
				return findOne(req,res,req.params.id);
			});	
		}
		/**Disabled**/
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
		}).fail(function(err){
            Utilfunctions.errorHandler(err,res,"Generate Comment failed");
		});
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
			LeadDetail:function(dt){
				LeadDetail.find().exec(dt);
			},
			LeadLevel:function(dt){
				LeadLevel.find().exec(dt);
			},
			PaymentOption:function(dt){
				PaymentOption.find().exec(dt);
			},
			Status:function(dt){
				Status.find().exec(dt);
			},
			SalesGroup:function(dt){
				SalesGroup.find({department:1}).exec(dt);
			},
			Group2Service:function(dt){
				Group2Service.find().populate('contractCategory').exec(dt);
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
	'destroy':function(req,res){
		var id=req.params.id;
		if(!id){
			return res.json(404,{error:"no contract id to update"});
		}
		Contract.findOne({id:id}).then(function(data){
			if(data.id){
				console.log(data.deleted);
				if(data.deleted==true){
					console.log("it is true, change it to false");
					return Contract.update({id:id},{deleted:false});
				}else{
					return Contract.update({id:id},{deleted:true});
				}
			}else{
				return Promise.reject({error:"not found"});
			}
		}).then(function(data){
			return res.json(data);
		}).fail(function(err){
			Utilfunctions.errorHandler(err,res,"Delete failed");
		});
	}
};
