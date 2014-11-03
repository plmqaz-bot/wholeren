/**
 * ServiceController
 *
 * @description :: Server-side logic for managing Services
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	'getService':function(req, res){
		var id=1;
		//var sql="select * from service left join contract on service.contract=contract.id left join application on application.service=service.id";
		Service.find({
			or:[
			{serviceTeacher:id},
			{serviceTeacher:null}
			],
			contract:{'>':0}
		}).populateAll().exec(function(err,data){
			// data.forEach(function(item){
			// 	if(item.services){
			// 		item.services.forEach(ele){
			// 			var id=ele.id;
			// 			Services.findOne({id:id}).populateAll().exec(function{
							
			// 			});
			// 		}
			// 	}
			// });
			return res.json(data);
		});	
		
	},
};

