/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#/documentation/reference/sails.config/sails.config.bootstrap.html
 */
var later=require('later');
var Promise=require('bluebird');
module.exports.bootstrap = function(cb) {
/*************************also schedule *****************************************/

// later.date.localTime();
// var textSched = later.parse.text('at 00:01am every day');
// var everymin=later.parse.text('every minute');
// var t=later.setInterval(logtime,everymin);
// console.log("start");s
// function logtime(){
//     console.log(new Date());
// }
setInterval(function () {
	console.log("Hello");
	var sql="select chineseName,contract.id, contract.createdAt, dayInterval,textNotification,sales1,sales2 from contract inner join client on contract.client=client.id inner join notifyinterval on (Datediff(NOW(),contract.createdAt)=notifyinterval.dayInterval);";
	Utilfunctions.nativeQuery(sql).then(function(data){
		var promises=[];
		if(data){
			data.forEach(function(ele){
				if(ele.sales1){
					var p=Notifications.create({contract:ele.id,days:ele.dayInterval,user:ele.sales1,reason:ele.textNotification});
					promises.push(p);
				}
				if(ele.sales2){
					var p=Notifications.create({contract:ele.id,days:ele.dayInterval,user:ele.sales1,reason:ele.textNotification});
					promises.push(p);
				}
			});	
		}
		return Promise.all(promises);
	}).then(function(data){
		console.log("notification done");
	}).fail(function(err){
		console.log(err);
	});
}, 1000*60*60*24);
  // It's very important to trigger this callback method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
  cb();
};
