/**
 * AccountingController
 *
 * @description :: Server-side logic for managing accountings
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
function constructsql(where){
	var sql="select invoice.*,IFNULL(receivedTotal,0)-IFNULL(receivedNontaxable,0)-IFNULL(receivedOther,0)-IFNULL(receivedRemittances,0) as receivedServicepay, sum(IFNULL(serviceinvoice.paidAmount,0))  as servicepay,IFNULL(other,0)+ IFNULL(nontaxable,0)+IFNULL(remittances,0)+sum(IFNULL(serviceinvoice.paidAmount,0)) as totalpay,paymentoption.paymentOption as payment,depositaccount.account  from invoice \
		left join contract on invoice.contract=contract.id \
		left join service on contract.id=service.contract \
		left join client on client.id=contract.client \
		left join serviceinvoice on (invoice.id=serviceinvoice.invoice and service.id=serviceinvoice.service) \
		left join paymentoption on invoice.paymentOption=paymentoption.id \
		left join depositaccount on depositaccount.id=invoice.depositAccount where "+where+" \
		group by invoice.id;";
	return sql;
}
module.exports = {
	find:function(req,res){
		var startDate=parseInt(req.param('startDate'));
		var endDate=parseInt(req.param('endDate'));
		var w=" invoice.createdAt>"+startDate;
		if(endDate){
			w+=" and invoice.createdAt<"+endDate;
		}
		var sql=constructsql(w);
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
		var sql=constructsql(" invoice.id="+id);
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
		var toupdate=Utilfunctions.prepareUpdate(attribs,fields);
		Invoice.update({id:id},toupdate).then(function(data){
			var sql=constructsql(" invoice.id="+id);
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

