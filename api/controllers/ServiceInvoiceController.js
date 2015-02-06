/**
 * ServiceInvoiceController
 *
 * @description :: Server-side logic for managing serviceinvoices
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
 var Promise=require('bluebird');
function constructsql(where,on){
	var sql="select s.id,service.id as service, invoice.id as invoice,s.paidAmount,p1.paid,service.price,servicetype.serviceType \
	from invoice \
	left join contract on contract.id=invoice.contract \
	left join service on contract.id=service.contract \
	left join servicetype on service.serviceType=servicetype.id \
	left join serviceinvoice s on invoice.id=s.invoice and service.id=s.service \
	left join  \
	(select s.service, sum(IFNULL(s.paidAmount,0)) as paid from invoice \
	left join contract on invoice.contract=contract.id \
	left join service on contract.id=service.contract \
	inner join serviceinvoice s on (s.service=service.id and s.invoice=invoice.id)\
	where "+on+"\
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
		var sql=constructsql("invoice.id="+invoice,"invoice.id!="+invoice);
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
		var sql=constructsql("s.id="+id,"s.id!="+id);
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
		console.log("create serviceinvoice");
		tocreate['service']=attribs.service;
		tocreate['invoice']=attribs.invoice;
		var promises=[]
		if(attribs.paidAmount!=null) tocreate.paidAmount=attribs.paidAmount;
		promises.push(ServiceInvoice.create(tocreate));
		if(attribs.price!=null) promises.push(Service.update({id:attribs.service},{price:attribs.price}));
		Promise.all(promises).spread(function(data){
			if(!data) return res.json(404, {error: "fail on create invoice"});
			var sql=constructsql("s.id="+data.id,"s.id!="+data.id);
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
		var promises=[];
		console.log("update serviceinvoice");
		if(attribs.paidAmount!=null) {
			promises.push(ServiceInvoice.update({id:id},{paidAmount:attribs.paidAmount}));
		}
		if(attribs.price!=null){
			var promise=ServiceInvoice.findOne({id:id}).then(function(data){
				if((data||{})['service']){
					return Service.update({id:data['service']},{price:attribs.price});
				}
			});
			promises.push(promise);
		}
		Promise.all(promises).then(function(data){
			var sql=constructsql("s.id="+id,"s.id!="+id);
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

