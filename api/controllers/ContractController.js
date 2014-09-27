/**
 * ContractController
 *
 * @description :: Server-side logic for managing Contracts
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	'getContract':function(req, res){
		Contract.find({'id':2}).exec(function(err,data){
			console.log('user is '+req.session.user);
			res.json(data);
		});
	}
};

