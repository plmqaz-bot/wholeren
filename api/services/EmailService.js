
// var email=require('node_mailer');
// var config={
// 	host:"smtp.snedgrid.net",
// 	port:25
// };
// module.exports={
// 	'send':function(){
// 	email.send({  
// 		host : "localhost",              // smtp server hostname
// 		port : "25",                     // smtp server port
// 		domain : "localhost",            // domain used by client to identify itself to server
// 		to : "han.lai321@gmail.com",
// 		from : "obama@whitehouse.gov",
// 		subject : "node_mailer test email",
// 		template : "view/email.handlebars",   // path to template name
// 		data : {
// 			"username": "Billy Bob",
// 		},
// 		authentication : "login",        // auth login is supported; anything else is no auth
// 		username : "dXNlcm5hbWU=",       // Base64 encoded username
// 		password : "cGFzc3dvcmQ="       // Base64 encoded password
// 		},
// 		function(err, result){  
// 			if(err){ console.log(err); }
// 		});
// 	}
// }