/**
 * ShortContractController
 *
 * @description :: Server-side logic for managing shortcontracts
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

function createsql(where){
	sql="select contract.nameKey,contract.status,contractPaid,contract.id,chineseName,teacher,GROUP_CONCAT(distinct s.serviceType SEPARATOR ',') as 'boughtservices', country,degree,previousSchool,major,gpa,toefl,sat,gre,otherScore\
	from contract left join service on service.contract=contract.id left join client on contract.client=client.id left join servicetype s on s.id=service.serviceType \
	where contract.contractSigned is not null "+where+" group by contract.id;";
	return sql;
}
function whoCanView(user){
	return "";
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
				wherequery+="and (contractsigned>'"+where.contractSigned['>']+"') ";
			}
			if(where.contractSigned['<']){
				wherequery+="and (contractsigned<'"+where.contractSigned['<']+"') ";
			}
		}
		switch (req.session.user.rank){
			case 3:
			sql=createsql(wherequery+"");
			promise=Utilfunctions.nativeQuery(sql);
			break;
			case 2:
			sql=createsql(wherequery+" and (user.id="+id+" or u.id="+id+" or u2.id="+id+" or w.boss="+id+")");
			promise=Utilfunctions.nativeQuery(sql);
			break;
			default:
			sql=createsql(wherequery+" and (user.id="+id+" or u.id="+id+" or u2.id="+id+" or w.boss="+id+")");
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

