var mailer=require('nodemailer');
var Promise=require('bluebird');
function sendMail(transport,emailObj){
	var toReturn=Promise.defer();
	if(sails.config.sendFakeEmail){
		// Do not send email
		sails.log.info('Sending fake email', emailObj);
		return Promise.resolve();
	}
	transport.sendMail(emailObj,function(err,responseStatus){
		if(err){
			toReturn.reject(err);
		}else{
			toReturn.resolve(responseStatus);
		}
	});
	return toReturn.promise;
}
module.exports={
	'sendWelcomeEmail':function(options){
		var email=mailer.createTransport({
		service:"Gmail",
		auth:sails.config.emailAuth
		});
		return sendMail(email,{
		to : options.email,
		from : "obama@whitehouse.gov",
		subject : "Thanks for registering",
		html:"Dear "+options.nickname+"<br> Thank you for registering, please wait for a manager to activate your account."
		});
	},
	'sendEmail':function(emailObj){
		var email=mailer.createTransport({
		service:"Gmail",
		auth:sails.config.emailAuth
		});
		return sendMail(email,emailObj);
	},
	'sendReminderEmail':function(options){
		var email=mailer.createTransport({
		service:"Gmail",
		auth:sails.config.emailAuth
		});

		return sendMail(email,{
			to : options.email,
			//to : 'han.lai321@gmail.com',
			from : "obama@whitehouse.gov",
			subject : "Reminder: 该发邮件啦亲！",
			//html:"亲爱的敬爱的销售老师："+options.nickname+"<br> 您的学生，"+options.client+" 又到了该您发邮件的时候啦。 提醒原因 "+options.reason+"!";
			html:"亲爱的敬爱的销售老师："+options.nickname+"<br> 您的学生，"+options.client+" 需要您的注意。 提醒原因 "+options.reason+"!"
		});
		
		
	}
}