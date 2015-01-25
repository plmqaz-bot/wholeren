/**
 * NotificationsController
 *
 * @description :: Server-side logic for managing Notifications
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	'find':function(req,res){
	var sql="select notifications.id, client.chineseName, user.nickname, days, reason from notifications inner join contract on notifications.contract=contract.id inner join client on contract.client=client.id inner join user on notifications.user=user.id;";
	    Utilfunctions.nativeQuery(sql).then(function(data){
	        return res.json(data);
	    }).catch(function(err){
	        return res.json(404,err);
	    });
	}	
};

