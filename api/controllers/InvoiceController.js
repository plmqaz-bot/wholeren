/**
 * InvoiceController
 *
 * @description :: Server-side logic for managing invoices
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
function constructsql(where){
	var sql="select invoice.*,sum(IFNULL(serviceinvoice.paidAmount,0)) as service,sum(IFNULL(serviceinvoice.paidAmount,0))+nontaxable+other as total from \
	 invoice left join contract on contract.id=invoice.contract \
left join service on contract.id=service.contract \
left join serviceinvoice on invoice.id=serviceinvoice.invoice and service.id=serviceinvoice.service \
"+where+" group by invoice.id ;";
return sql;
}
module.exports = {
	find:function(req,res){
		var contract=parseInt(req.param('contract'));
		if(!contract){
			return res.json(400,{error:"no contract number"});
		}
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
	create:function(req,res){
		var attribs=req.body;
		if(!attribs.contract) return res.json(400,{error:"Cannot create empty invoice"});
		var tocreate={};
		tocreate['contract']=attribs.contract;
		Invoice.create(tocreate).then(function(data){
			if(!data) return res.json(404, {error: "fail on create invoice"});
			var sql=constructsql(" where invoice.id="+data.id);
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
	update:function(req,res){
		var id=req.params.id;
		
		if(!id) return res.json(404,{error:"no id"});
		var attribs=req.body;
		var toupdate={};
		if(attribs.nontaxable!=null) toupdate.nontaxable=attribs.nontaxable;
		if(attribs.remittances!=null) toupdate.remittances=attribs.remittances;
		if(attribs.other!=null) toupdate.other=attribs.other;
		if(attribs.receivedTotal!=null) toupdate.receivedTotal=attribs.receivedTotal;
		if(attribs.receivedOther!=null) toupdate.receivedOther=attribs.receivedOther;
		if(attribs.receivedDate!=null) toupdate.receivedDate=attribs.receivedDate;
		if(attribs.paymentOption!=null)toupdate.paymentOption=attribs.paymentOption;
		if(attribs.depositAccount!=null)toupdate.depositAccount=attribs.depositAccount;
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
	destroy:function(req,res){
		var id=req.params.id;
		if(!id) return res.json(404,{error:"no id"});
		// Utilfunctions.nativeQuery("START TRANSACTION").then(function(){
		// 	return ServiceInvoice.destroy({invoice:id});
		// }).then(function(){
		// 	return Invoice.destroy({id:id});
		// }).then(function(data){
		// 	return Utilfunctions.nativeQuery("COMMIT");
		// }).then(function(data){
		// 	return res.json({});
		// }).catch(function(err){
		// 	Utilfunctions.nativeQuery("ROLLBACK");
		// 	console.log(err);
		// 	return res.json(404,{error:"failed to delete ",errObj:err});
		// }).error(function(err){
		// 	Utilfunctions.nativeQuery("ROLLBACK");
		// 	console.log(err);
		// 	return res.json(404,{error:"failed to delete ",errObj:err});
		// })
		ServiceInvoice.destroy({invoice:id}).then(function(){
			return Invoice.destroy({id:id});
		}).then(function(data){
			return res.json({});
		}).catch(function(err){
			console.log(err);
			return res.json(404,{error:"failed to delete ",errObj:err});
		})
	}
};

