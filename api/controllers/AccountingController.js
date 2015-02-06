/**
 * AccountingController
 *
 * @description :: Server-side logic for managing accountings
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
function constructsql(where){
	var sql="select invoice.*,sum(IFNULL(serviceinvoice.paidAmount,0)) as service,IFNULL(sum(serviceinvoice.paidAmount),0)+nontaxable+other as total from contract \
	left join invoice on contract.id=invoice.contract \
	left join service on contract.id=service.contract \
	left join serviceinvoice on invoice.id=serviceinvoice.invoice and service.id=serviceinvoice.service \
	"+where+" group by invoice.id ;";
	return sql;
}
module.exports = {
	find:function(req,res){
		var where=req.param('where')||"{}";
		console.log(where);
		where=JSON.parse(where);
		if(!where.start&&where.end) return res.json(400,{error:" no start date"});
		var sql=constructsql("where contract.id="+contract);
		Utilfunctions.nativeQuery(sql).then(function(data){
			return res.json(data);
		}).catch(function(err){
			console.log(err);
			return res.json(404,err);
		});
	},
	findOne:function(req,res){
		var id=req.params.id;
		if(!id) return res.json(404,{error:"no id"});
		var sql=constructsql("where invoice.id="+id);
		Utilfunctions.nativeQuery(sql).then(function(data){
			if(!data)return res.json({});
			if(data.length<1)return res.json({});
			return res.json(data[0]);
		}).catch(function(err){
			console.log(err);
			return res.json(404,err);
		});
	},
	update:function(req,res){
		var id=req.params.id;
		if(!id) return res.json(404,{error:"no id"});
		var attribs=req.body;
		var fields=['receivedRemittances','receivedTotal','receivedNontaxable','receivedOther','receivedDate'];
		var toupdate=Utilfunctions.receivedRemittances(attribs,fields);
		Invoice.update({id:id},toupdate).then(function(data){
			var sql=constructsql(" where invoice.id="+id);
			return Utilfunctions.nativeQuery(sql);
		}).then(function(data){
			if(!data)return res.json({});
			if(data.length<1)return res.json({});
			return res.json(data[0]);
		}).catch(function(err){
			console.log(err);
			return res.json(404,err);
		});
	},
};

