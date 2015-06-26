/**
 * ShortContractController
 *
 * @description :: Server-side logic for managing shortcontracts
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

function createsql(where){
	sql="select contract.nameKey,contract.status,user.nickname as teacher,contractPaid,contract.id,chineseName,GROUP_CONCAT(distinct s.serviceType SEPARATOR ',') as 'boughtservices', country,contract.degree,previousSchool,major,gpa,toefl,sat,gre,otherScore\
	from contract left join service on service.contract=contract.id left join client on contract.client=client.id left join servicetype s on s.id=service.serviceType left join user on contract.teacher=user.id left join servicedetail on servicedetail.contract=contract.id left join userinservice u on u.servicedetail=servicedetail.id\
	where contract.deleted!=1 and contract.status=5 "+where+" group by contract.id;";
	return sql;
}
function whoCanView(user){
	var id=user.id;
	switch (user.role){
		case 1:
			switch (user.rank){
				case 1: restrictions="user.id ="+id;break;
				case 2: restrictions="(user.id ="+id+" or ss.subRole="+user.subRole+")";break;
				case 3: restrictions="";break;
				case 4: restrictions="";break;
				default:restrictions="false";
			}
		break;
		case 2:
			switch (user.rank){
				case 1: restrictions="user.id ="+id;break;
				case 2: restrictions="user.id ="+id;break;
				case 3: restrictions="";
				default: restrictions="false";
			}
		break;
		case 3:
			switch (user.rank){
				case 1: restrictions="false";break;
				case 2: restrictions="";break;
				case 3: restrictions="";
				default: restrictions="false";
			}
		break;
		default:restrictions="false";
	}
	return "and "+id+" in (contract.sales1,contract.sales2, contract.expert1, contract.expert2, contract.teacher, servicedetail.user, u.user)";
}
function getOne(req,res){
	var id=req.params.id;
	if(!id) return Utilfunctions.errorHandler({error:"No id"},res,"Get short contract  failed");
	var sql=createsql("and contract.id="+id);
	return Utilfunctions.nativeQuery(sql).then(function(data){
		if((data=data||[]).length<1) return Promise.reject({error:"not found"});
		return res.json(data[0]);
	}).catch(function(err){
        Utilfunctions.errorHandler(err,res,"Find short contract failed id:"+req.params.id);
	});
}
module.exports = {
	findOne:function(req,res){
		return getOne(req,res);
	},
	find:function(req,res){
		var id=req.session.user.id;
		var where=req.param('where')||{};
		console.log(where);
		where=JSON.parse(where);
		// First find all signed contracts
		var promise;
		var wherequery="";
		if(where.contractSigned){
			if(where.contractSigned['>']){
				wherequery+="and (contractSigned>'"+where.contractSigned['>']+"' or contractSigned is null) ";
			}
			if(where.contractSigned['<']){
				wherequery+="and (contractSigned<'"+where.contractSigned['<']+"' or contractSigned is null) ";
			}
		}
		switch (req.session.user.rank){
			case 3:
			sql=createsql(wherequery+"");
			promise=Utilfunctions.nativeQuery(sql);
			break;
			case 2:
			sql=createsql(wherequery+whoCanView(req.session.user));
			promise=Utilfunctions.nativeQuery(sql);
			break;
			default:
			sql=createsql(wherequery+whoCanView(req.session.user));
			promise=Utilfunctions.nativeQuery(sql);
		}
		promise.then(function(data){
			return res.json(data);
		}).catch(function(err){
            Utilfunctions.errorHandler(err,res,"Find short contract failed");
		});
	},
	update:function(req,res){
		var id=req.params.id;
		if(!id) return Utilfunctions.errorHandler({error:"No id"},res,"Get short contract  failed");
		var attribs=req.body;
		delete attribs["createAt"];
		delete attribs["updateAt"];
		var contractUpdate=Utilfunctions.prepareUpdate(attribs,['country','gpa','gre','toefl','sat','otherScore','degree','previousSchool','major']);
		Contract.update({id:id},contractUpdate).then(function(data){
			return getOne(req,res);
		}).catch(function(err){
            Utilfunctions.errorHandler(err,res,"Find short contract failed");
		});
	},
	destroy:function(req,res){
		var id=req.params.id;
		if(!id) return Utilfunctions.errorHandler({error:"No id"},res,"Get short contract  failed");
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

