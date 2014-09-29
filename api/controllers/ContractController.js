/**
 * ContractController
 *
 * @description :: Server-side logic for managing Contracts
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	'getContract':function(req, res){
		Contract.find({degree:1}).exec(function(err,data){
			console.log('user is 1'+req.session.user);
			console.log(err);
			console.log(data);
			res.json(data);
		});	
		
	}
};

