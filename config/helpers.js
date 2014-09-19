var handlebars=require('handlebars');
	
	handlebars.registerHelper('testhelper',function(data){
		return "FOO"+data;
	});
	

