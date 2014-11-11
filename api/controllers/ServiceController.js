/**
 * ServiceController
 *
 * @description :: Server-side logic for managing Services
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	'getService':function(req, res){
		var id=req.session.user.id;
		switch (req.session.user.rank){
			case "2":
			Service.find({contract:{'>':0}}).populateAll().exec(function(err,data){
				if(err) return res.json({error:err});
				return res.json(data);
			});	
			break;
			case "1":
			Service.find({
				or:[{serviceTeacher:id},{serviceTeacher:null}],
				contract:{'>':0}
			}).populateAll().exec(function(err,data){
				if(err) return res.json({error:err});
				return res.json(data);
			});	
		}
		//var sql="select * from service left join contract on service.contract=contract.id left join application on application.service=service.id";
	},
};

