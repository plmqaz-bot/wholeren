/**
 * ServiceController
 *
 * @description :: Server-side logic for managing Services
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	'getService':function(req, res){
		var id=req.session.user.id;
		// First find all signed contracts
		var promise;
		switch (req.session.user.rank){
			case "3":
			promise=Contract.find({contractSigned:{'!':null}});
			break;
			case "2":
			promise=User.find({boss:id}).then(function(mypuppets){
				var puppetIDs=mypuppets.map(function(puppet){return puppet.id});
				return Contract.find({contractSigned:{'!':null},teacher:{'$in':puppetIDs}});
			});
			break;
			default:
			promise=Contract.find({contractSigned:{'!':null},or:[{teacher:id},{teacher:null}]});
		}
		promise.then(function(conts){
			var conIDs=conts.map(function(c){return c.id;});
			console.log(conIDs);
			return Service.find({contract:conIDs}).populateAll();
		}).then(function(data){
			return res.json(data);
		}).fail(function(err){
			return res.json({error:err});
		});	
		//var sql="select * from service left join contract on service.contract=contract.id left join application on application.service=service.id";
	},
};

