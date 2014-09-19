var handlebars=require('sails/node_modules/express-handlebars/node_modules/handlebars');
	
	handlebars.registerHelper('testhelper',function(data){
		return "FOO"+data;
	});
	

