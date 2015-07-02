/**
* PeriodicFunctions.js
*
* @description :: This is collection of function which will be run daily. Mainly used to setup some reminders to sales persons for send emails or remind them to fill in missing data. 
* @docs        :: http://sailsjs.org/#!documentation/models
*/


var moment=require('moment');
module.exports={
	periodicEmailCheck:function(){
		sails.log.info("Notification: 发email 提醒未签约的lead");
		var sql="select distinct client.chineseName,contract.id, contract.createdAt, dayInterval,textNotification,sales1,sales2 from contract inner join client on contract.client=client.id inner join notifyinterval on (Datediff(NOW(),contract.createdAt)=notifyinterval.dayInterval) where contract.contractSigned is null ;";
		Utilfunctions.nativeQuery(sql).then(function(data){
			var promises=[];
			sails.log.info("found ",data.length," reminders");
			if(data){
				data.forEach(function(ele){
					if(ele.sales1){
						var p=Notifications.find({contract:ele.id,days:ele.dayInterval,user:ele.sales1}).then(function(notifi){
							if(notifi.length<1){// Not found
								
								return Notifications.create({contract:ele.id,days:ele.dayInterval,user:ele.sales1,reason:ele.textNotification}).then(function(){
									return User.findOne({id:ele.sales1}).then(function(u){
										if(u){
											return EmailService.sendReminderEmail({email:u.email,nickname:u.nickname,client:ele.chineseName,reason:ele.textNotification}).error(function(err){
												sails.log.error("Error occurred during checking reminders: ",err);
											});	
										}						
									});
								})
							}
						})
						promises.push(p);
					}
					if(ele.sales2){
						var p=Notifications.find({contract:ele.id,days:ele.dayInterval,user:ele.sales2}).then(function(notifi){
							if(notifi.length<1){// Not found
								return Notifications.create({contract:ele.id,days:ele.dayInterval,user:ele.sales2,reason:ele.textNotification}).then(function(){
									return User.findOne({id:ele.sales2}).then(function(u){
										if(u){
											return EmailService.sendReminderEmail({email:u.email,nickname:u.nickname,client:ele.chineseName,reason:ele.textNotification}).error(function(err){
												sails.log.error("Error occurred during checking reminders: ",err);
											});	;	
										}						
									});
								})
							}
						})
						promises.push(p);
					}
				});	
			}
			return Promise.all(promises);
		}).then(function(data){
			sails.log.info("Email notification For 发email 提醒未签约的lead 已完成:"+new Date());
		});
	},
	missingLeadLevel:function(){
		sails.log.info("Notification: 发email 提醒校代 or 渠道 missing leadlevel");
		var today=moment().format('dddd');
		if(today=='Tuesday'||today=='Thursday'){
			var sql="select distinct contract.id,contract.sales1,contract.sales2,client.chineseName from contract left join client on client.id=contract.client where leadLevel is null and (lead=4 or lead=10);";
			Utilfunctions.nativeQuery(sql).then(function(data){
				var promises=[];
				sails.log.info("found ",data.length," contracts from 校代 or 渠道 that does not have leadLevel");
				data=data||[];
				data.forEach(function(ele){
					var reason="Reminder checking on "+today+", and it is missing lead level";
					
					if(ele.sales1){
						var p=Notifications.find({contract:ele.id,user:ele.sales1,reason:reason}).then(function(notifi){
							if(notifi.length<1){// Not found
								return Notifications.create({contract:ele.id,user:ele.sales1,reason:reason}).then(function(){
									return User.findOne({id:ele.sales1}).then(function(u){
										if(u){
											return EmailService.sendReminderEmail({email:u.email,nickname:u.nickname,client:ele.chineseName,reason:reason}).error(function(err){
												sails.log.error("Error occurred during checking reminders: ",err);
											});	
										}						
									});
								})
							}
						})
						promises.push(p);
					}
					if(ele.sales2){
						var p=Notifications.find({contract:ele.id,user:ele.sales2,reason:reason}).then(function(notifi){
							if(notifi.length<1){// Not found
								return Notifications.create({contract:ele.id,user:ele.sales2,reason:reason}).then(function(){
									return User.findOne({id:ele.sales2}).then(function(u){
										if(u){
											return EmailService.sendReminderEmail({email:u.email,nickname:u.nickname,client:ele.chineseName,reason:reason}).error(function(err){
												sails.log.error("Error occurred during checking reminders: ",err);
											});	;	
										}						
									});
								})
							}
						})
						promises.push(p);
					}
				});
				return Promise.all(promises);
			}).then(function(data){
				sails.log.info("Email notification For missing LeadLevel done for :"+new Date());
			}).error(function(err){
				sails.log.info(err);
			})
		}
	},
	afterLeadSign:function(){
		var sql="select distinct contract.id,contract.sales1,contract.sales2,client.chineseName,Datediff(NOW(),contract.contractSigned) as 'diff' from contract left join client on contract.client=client.id left join invoice on invoice.contract=contract.id left join service on service.contract=contract.id where contract.status=5 and (Datediff(NOW(),contract.contractSigned)>=3 and contract.salesGroup=1 or Datediff(NOW(),contract.contractSigned)>=1 and contract.salesGroup!=1) and (contract.teacher is null or invoice.id is null or service.id is null) and contract.createdAt>'2015-05-01';";
		Utilfunctions.nativeQuery(sql).then(function(data){
				var promises=[];
				sails.log.info("found ",data.length," 签约合同但是未填 服务，后期老师，以及费用详细");
				data=data||[];
				data.forEach(function(ele){
					var reason="合同于 "+ele.diff+" 天前签约，但是 服务，后期老师，以及费用详细之中有未填信息。";
					if(ele.sales1){
						var p=Notifications.find({contract:ele.id,days:ele.diff,user:ele.sales1,reason:reason}).then(function(notifi){
							if(notifi.length<1){// Not found
								return Notifications.create({contract:ele.id,days:ele.diff,user:ele.sales1,reason:reason}).then(function(){
									return User.findOne({id:ele.sales1}).then(function(u){
										if(u){
											return EmailService.sendReminderEmail({email:u.email,nickname:u.nickname,client:ele.chineseName,reason:reason}).error(function(err){
												sails.log.error("Error occurred during checking reminders: ",err);
											});	
										}						
									});
								})
							}
						})
						promises.push(p);
					}
					if(ele.sales2){
						var p=Notifications.find({contract:ele.id,days:ele.diff,user:ele.sales2,reason:reason}).then(function(notifi){
							if(notifi.length<1){// Not found
								return Notifications.create({contract:ele.id,days:ele.diff,user:ele.sales2,reason:reason}).then(function(){
									return User.findOne({id:ele.sales2}).then(function(u){
										if(u){
											return EmailService.sendReminderEmail({email:u.email,nickname:u.nickname,client:ele.chineseName,reason:reason}).error(function(err){
												sails.log.error("Error occurred during checking reminders: ",err);
											});	;	
										}						
									});
								})
							}
						})
						promises.push(p);
					}
				});
				return Promise.all(promises);
			}).then(function(data){
				sails.log.info("Email notification For 签约合同的未完成信息 已完成 :"+new Date());
			})
	}
}