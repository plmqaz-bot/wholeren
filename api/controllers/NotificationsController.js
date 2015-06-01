/**
 * NotificationsController
 *
 * @description :: Server-side logic for managing Notifications
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
function whoCanView(user){
	if(user.role==1){
		switch(user.rank){
			case 2: return "where contract.salesGroup="+user.subRole;
			case 3: return "";
			case 4: return "";
			default: return "where false";
		}
	}
	 return "where false";
}

module.exports = {
	'find':function(req,res){
	var sql="select notifications.id, contract,client.chineseName, user.nickname, days, reason,notifications.createdAt from notifications inner join contract on notifications.contract=contract.id inner join client on contract.client=client.id inner join user on notifications.user=user.id "+whoCanView(req.session.user);
	    Utilfunctions.nativeQuery(sql).then(function(data){
	        return res.json(data);
	    }).catch(function(err){
            Utilfunctions.errorHandler(err,res,"Get Notifications failed");
	    });
	}	
};

