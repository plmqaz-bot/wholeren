(function(){
	var $ = require('jquery');
    var Backbone = require('backbone');
    var _ = require('lodash');
    var Handlebars = require('handlebars');
Backbone.$ = $;
global.myApp={
		Views:{},
		Models:{},
        Collections: {},
        notifications:{},
		router:null
    };
    _.extend(myApp, Backbone.Events);
var Router=require('./Router');
var Models=require('./models');
var View=require('./View');
    
var init=function(){
        myApp.router = new Router();
        myApp.notifications = new View.Notification.Collection({ model: [] });
        
	Backbone.history.start({
		pushState:true,
		hashChange:false,
        root: '/admin/'
	});
};
init();

}());