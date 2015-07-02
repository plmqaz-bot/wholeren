/**
 * ShortServiceController
 *
 * @description :: Server-side logic for managing Services, this is only used on choose service in Contract View.
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

 module.exports={
 	find:function(req,res){
 		var contractId=req.param('contract');
 		if(!contractId) return Utilfunctions.errorHandler({error:"No Contract ID!"},res,"Find Service failed no id:");
 		Service.find({contract:contractId}).then(function(data){
 			return res.json(data);
 		}).fail(function(err){
            return Utilfunctions.errorHandler(err,res,"Find Service Invoice failed");
		});

 	},
 	create:function(req,res){
 		var attribs=req.body;
		if(!attribs['contract']) return Utilfunctions.errorHandler({error:"No Contract ID!"},res,"Find Service failed no id:");
 		Service.create(attribs).then(function(data){
 			return res.json(data);
 		}).fail(function(err){
 			return Utilfunctions.errorHandler(err,res,"Create Service Invoice failed");
 		})
 	},
 	update:function(req,res){
 		var attribs=req.body;
		var id=req.params.id;
 		var toUpdate=Utilfunctions.prepareUpdate(attribs,['serviceType','price']);
 		Service.update({id:id},toUpdate).then(function(data){
 			if(data.length<1){
 				return Utilfunctions.errorHandler({error:"Update failed, the Id is not found :"+id},res,"Update failed, the Id is not found :"+id);
 			}else{
 				data=data[0];
 				var cid=data.contract;
 				if(toUpdate['price']){
					var sql="select client.chineseName,contract.id,contract.lead,sum(service.price) as 'total' from contract left join service on service.contract=contract.id left join client on client.id=contract.client where contract.id="+cid+";"
					Utilfunctions.nativeQuery(sql).then(function(c){
						c=(c||[])[0];
						if(c.lead==4||c.lead==10){
							console.log('lead');
							var reason="亲爱的敬爱的校代管理层：<br> 您的学生，"+c.chineseName+" 需要您的注意。 提醒原因:\n <br> 校代leads状态发生变化. \n<br> 当前价格为： "+c.total+"\n<br>";
							return EmailService.sendEmail({
								to : "Channel@wholeren.com",
								//to : 'han.lai321@gmail.com',
								from : "obama@whitehouse.gov",
								subject : "Reminder: ",
								//html:"亲爱的敬爱的销售老师："+options.nickname+"<br> 您的学生，"+options.client+" 又到了该您发邮件的时候啦。 提醒原因 "+options.reason+"!";
								html:reason
							}); 
						}
					}).error(function(err){
						sails.log.error('Email failed to send');
					});
 				}
 				return res.json(data);
 			}
 		}).fail(function(err){
 			return Utilfunctions.errorHandler(err,res,"Update Service  failed");
 		})
 	},
 	destroy:function(req,res){
 		var id=req.params.id;
 		Service.destroy({id:id}).then(function(data){
 			return res.json({});
 		}).fail(function(err){
 			return Utilfunctions.errorHandler(err,res,"Delete Service failed");
 		});
 	}
 }