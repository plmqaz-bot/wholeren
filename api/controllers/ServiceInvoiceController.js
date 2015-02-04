/**
 * ServiceInvoiceController
 *
 * @description :: Server-side logic for managing serviceinvoices
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	find:function(req,res){
		var invoice=parseInt(req.param('invoice'));
		if(!invoice){
			return res.json(400,{error:"no invoice number"});
		}
		ServiceInvoice.find({invoice:invoice}).then(function(data){
			return res.json(data);
		}).fail(function(err){
			return res.json(400,{error:err});
		});
	}
		
};

