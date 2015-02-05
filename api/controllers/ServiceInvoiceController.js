/**
 * ServiceInvoiceController
 *
 * @description :: Server-side logic for managing serviceinvoices
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
function constructsql(where,on){
	var sql="select service.id as service, invoice.id as invoice,serviceinvoice.paidAmount,p1.paid,service.price,servicetype.serviceType from contract \
	left join invoice on contract.id=invoice.contract \
	left join service on contract.id=service.contract \
	left join servicetype on service.serviceType=servicetype.id \
	left join serviceinvoice on invoice.id=serviceinvoice.invoice and service.id=serviceinvoice.service \
	left join \
	(select s1.service, IFNULL(sum(s1.paidAmount),0) as paid from service \
	inner join serviceinvoice s1 on (s1.service=service.id and "+on+") \
	where service.id is not null \
	group by service.id) as p1 on p1.service=service.id \
	where "+where+";";
	return sql;
}
module.exports = {
	find:function(req,res){
		var invoice=parseInt(req.param('invoice'));
		if(!invoice){
			return res.json(400,{error:"no invoice number"});
		}
		var sql=constructsql("invoice.id="+invoice,"s1.invoice!="+invoice);
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
		var sql=constructsql("serviceinvoice.id="+id,"s1.id!="+id);
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
		if(!attribs.service||!attribs.invoice||attribs.id) return res.json(400,{error:"Cannot create empty service invoice"});
		var tocreate={};
		tocreate['service']=attribs.service;
		tocreate['invoice']=attribs.invoice;
		if(attribs.paidAmount!=null) tocreate.paidAmount=attribs.paidAmount;
		Invoice.create(tocreate).then(function(data){
			if(!data) return res.json(404, {error: "fail on create invoice"});
			var sql=constructsql("serviceinvoice.id="+data.id,"s1.id!="+data.id);
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
		if(attribs.paidAmount!=null) tocreate.paidAmount=attribs.paidAmount;
		Invoice.update({id:id},toupdate).then(function(data){
			var sql=constructsql("serviceinvoice.id="+data.id,"s1.id!="+data.id);
			return Utilfunctions.nativeQuery(sql);
		}).then(function(data){
			if(!data)return res.json({});
			if(data.length<1)return res.json({});
			return res.json(data[0]);
		}).catch(function(err){
			console.log(err);
			return res.json(404,err);
		});
	}
		
};

