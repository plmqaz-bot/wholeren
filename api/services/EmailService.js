var mailer=require('nodemailer');

module.exports={
	'send':function(){
	var email=mailer.createTransport({
	service:"Gmail",
	auth:sails.config.emailAuth
	});
	email.sendMail({
		to : "han.lai321@gmail.com",
		from : "obama@whitehouse.gov",
		subject : "node_mailer test email",
		html:"test",
		text:"test2",
		},
		function(err, responseStatus){  
		if (err) {
            console.log(err);
          } else {
            console.log(responseStatus.message);
          }
		});
	}
}