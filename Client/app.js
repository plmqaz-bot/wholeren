(function(){
	var $ = require('jquery');
    var Backbone = require('backbone');
    var _ = require('lodash');
    var Handlebars = require('handlebars');
Backbone.$ = $;
global.Wholeren={
		Views:{},
		Models:{},
        Collections: {},
        notifications:{},
		router:null
    };
    _.extend(Wholeren, Backbone.Events);
var Router=require('./Router');
var Models=require('./models');
var View=require('./View');
    
var init=function(){
        Wholeren.router = new Router();
        Wholeren.notifications = new View.Notification.Collection({ model: [] });
                
	Backbone.history.start({
		pushState:true,
		hashChange:false,
        root: '/admin/'
	});
};
init();

}());