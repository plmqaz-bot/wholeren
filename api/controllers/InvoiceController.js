/**
 * InvoiceController
 *
 * @description :: Server-side logic for managing invoices
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	find:function(req,res){
		var contract=parseInt(req.param('contract'));
		if(!contract){
			return res.json(400,{error:"no contract number"});
		}
		Invoice.find({contract:contract}).then(function(data){
			return res.json(data);
		}).fail(function(err){
			return res.json(400,{error:err});
		});

	}
};

