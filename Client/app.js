(function(){
	var $ = require('./jquery');
    var Backbone = require('./backbone');
    var _ = require('lodash');
    var Handlebars = require('handlebars');
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
var View=require('./views/index.js');
    
    
var init=function(){
        Wholeren.router = new Router();
        Wholeren.notifications = new View.Notification.collection({ model: [] });
          Wholeren.Views=View;
    Wholeren.Models=Models;      
	Backbone.history.start({
		pushState:true,
		hashChange:false,
        root: '/'
	});
    Wholeren.initPageAnimations();
};
Wholeren.hideToggles=function(){
    $('[data-toggle]').each(function () {
            var toggle = $(this).data('toggle');
            $(this).parent().children(toggle + ':visible').fadeOut(150);
        });

        // Toggle active classes on menu headers
        $('[data-toggle].active').removeClass('active');
}
Wholeren.initPageAnimations=function(){
    $('[data-toggle]').each(function () {
            var toggle = $(this).data('toggle');
            $(this).parent().children(toggle).hide();
        });
    $('[data-toggle]').on('click',function(e){
        e.preventDefault();
        e.stopPropagation();
        var $this = $(this),
                toggle = $this.data('toggle'),
                isAlreadyActive = $this.is('.active');
                Wholeren.hideToggles();
            if (!isAlreadyActive) {
                $this.toggleClass('active');
                $(this).parent().children(toggle).toggleClass('open').fadeToggle(150);
            }
    });
};
init();

}());