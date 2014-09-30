/**
 * ContractController
 *
 * @description :: Server-side logic for managing Contracts
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	'getContract':function(req, res){
		Contract.find().exec(function(err,data){
			res.json(data);
		});	
		
	},
	'createContract':function(req,res){
		console.log(req.body);
		req.body.client=1;
		Contract.create(req.body).exec(function(err,data){
			console.log(err);
			res.json(data);
		});

	},
	'updateContract':function(req,res){
		console.log(req.body);
		console.log(req.params);
		console.log(req.query);

	}
};

