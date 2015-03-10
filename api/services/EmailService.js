var mailer=require('nodemailer');
var Promise=require('bluebird');
function sendMail(transport,emailObj){
	var toReturn=Promise.defer();
	transport.sendMail(emailObj,function(err,responseStatus){
		if(err){
			toReturn.reject(err);
		}else{
			toReturn.resolve(responseStatus);
		}
	});
	return toReturn;
}
module.exports={
	'sendWelcomeEmail':function(options){
		var email=mailer.createTransport({
		service:"Gmail",
		auth:sails.config.emailAuth
		});
		sendMail(email,{
		to : options.email,
		from : "obama@whitehouse.gov",
		subject : "Thanks for registering",
		html:"Dear "+options.nickname+"<br> Thank you for registering, please wait for a manager to activate your account."
		}).then(function(response){
			console.log(response);
		}).fail(function(err){
			console.log(err);
		});
	}
}