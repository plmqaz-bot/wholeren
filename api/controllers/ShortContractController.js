/**
 * ShortContractController
 *
 * @description :: Server-side logic for managing shortcontracts
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

// function createsql(where, c1,c2){
// // 	sql="select contract.nameKey,contract.status,contractPaid,contract.id,chineseName,GROUP_CONCAT(distinct s.serviceType SEPARATOR ',') as 'boughtservices', country,contract.degree,previousSchool,major,gpa,toefl,sat,gre,otherScore,sum(IF(servicedetail.id is not null,1,0)) as 'detailcount' \
// // from contract left join subrole_handle_salesgroup ss on ss.salesGroup=contract.salesGroup left join service on service.contract=contract.id left join client on contract.client=client.id left join servicetype s on s.id=service.serviceType left join servicedetail on servicedetail.contract=contract.id left join userinservice u on u.servicedetail=servicedetail.id \
// // where contract.deleted!=1 and contract.status=5 "+where+" group by contract.id;";
// var sql="select contract.nameKey,contract.status,contractPaid,contract.id, country,contract.degree,previousSchool,major,gpa,toefl,sat,gre,otherScore \
// 	from contract left join servicedetail s on s.contract=contract.id left join userinservice u on u.servicedetail=s.id \
// 	where contract.deleted!=1 and contract.status=5  "+where+" "+c1+" "+c2;
// 	return sql;
// }
function createsql(where,user){
	var id=user.id;
	var subRole=user.subRole||0;
	var criteria1="",criteria2="";
	var level1=id+" in (contract.sales1,contract.sales2, contract.expert1, contract.expert2, contract.teacher, s.user, u.user)";
	
	var union=" union \
	select chineseName,pinyin,primaryPhone,primaryEmail,client,nameKey,status,contractPaid,id, country,degree,previousSchool,major,gpa,toefl,sat,gre,otherScore from\
	(select client.chineseName,client.pinyin,client.primaryPhone,client.primaryEmail,contract.client,contract.nameKey,contract.status,contractPaid,contract.id, country,contract.degree,previousSchool,major,gpa,toefl,sat,gre,otherScore,sum(if(s.id is null,0,1)) as 'total'\
	from contract left join client on client.id=contract.client left join servicedetail s on s.contract=contract.id  where contract.deleted!=1 and contract.status=5 "+where+" group by contract.id) as t where t.total=0";
	switch (user.role){
		case 1:
			switch (user.rank){
				case 1: criteria1=" and "+level1;break;
				case 2: criteria1=" and ("+level1+" or ss.subRole="+subRole+")";break;
				case 3: criteria1="";break;
				case 4: criteria1="";break;
				default:criteria1="and false";
			}
		break;
		case 2:
			switch (user.rank){
				case 1: criteria1=" and "+level1;break;
				case 2: criteria1=" and ("+level1+" or sr.subRole="+subRole+" or sr.id is null)";criteria2=union;break;
				case 3: criteria1="";break;
				default: criteria1=" and false";
			}
		break;
		case 3:
			switch (user.rank){
				case 1: criteria1="";break;
				case 2: criteria1="";break;
				case 3: criteria1="";break;
				default: criteria1=" and false";
			}
		break;
		default:restrictions=" and false";
	}
	var sql="select t.*,GROUP_CONCAT(distinct s.serviceType SEPARATOR ',') as 'boughtservices' from (select client.chineseName, client.pinyin, primaryPhone,primaryEmail,contract.client,contract.nameKey,contract.status,contractPaid,contract.id, country,contract.degree,previousSchool,major,gpa,toefl,sat,gre,otherScore \
	from contract left join client on contract.client=client.id left join servicedetail s on s.contract=contract.id left join userinservice u on u.servicedetail=s.id left join subrole_has_realservicetype sr on sr.realServiceType=s.realServiceType \
	where contract.deleted!=1 and contract.status=5  "+where+" "+criteria1+" "+criteria2+") as t left join service on service.contract=t.id left join servicetype s on s.id=service.serviceType group by t.id";
	return sql;
}
function getOne(req,res){
	var id=req.params.id;
	if(!id) return Utilfunctions.errorHandler({error:"No id"},res,"Get short contract  failed");
	var sql=createsql("and contract.id="+id,req.session.user);
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
		// switch (req.session.user.rank){
		// 	case 3:
		// 	sql=createsql(wherequery+"");
		// 	promise=Utilfunctions.nativeQuery(sql);
		// 	break;
		// 	case 2:
		// 	sql=createsql(wherequery+whoCanView(req.session.user));
		// 	promise=Utilfunctions.nativeQuery(sql);
		// 	break;
		// 	default:
		// 	sql=createsql(wherequery+whoCanView(req.session.user));
		// 	promise=Utilfunctions.nativeQuery(sql);
		// }
		var sql=createsql(wherequery,req.session.user);
		promise=Utilfunctions.nativeQuery(sql);
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

