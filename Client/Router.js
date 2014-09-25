/**
 * New node file
 */
"use strict";
var $ = require('jquery');
var Backbone = require('backbone');
Backbone.$=$;
var View=require('./View');
 Wholeren.Views=require('./baseViews').authViews;
var Router=Backbone.Router.extend({
	routes: {
        'settings(/:pane)/' : 'settings',
        'contract(/:option)/':'contract',
        'register/'        : 'register',
        'signup/'          : 'signup',
        'signin/'          : 'signin',
        'forgotten/'       : 'forgotten',
        'reset/:token/'    : 'reset'
    },
    signup: function () {
        Wholeren.currentView = new Wholeren.Views.Signup({ el: '.js-signup-box' });
    },

    signin: function () {
        Wholeren.currentView = new Wholeren.Views.Login({ el: '.js-login-box' });
    },

    // forgotten: function () {
    //     Wholeren.currentView = new Wholeren.Views.Forgotten({ el: '.js-forgotten-box' });
    // },

    // reset: function (token) {
    //     Wholeren.currentView = new Wholeren.Views.ResetPassword({ el: '.js-reset-box', token: token });
    // },
    settings: function (pane) {
        if (!pane) {
        	
            // Redirect to settings/general if no pane supplied
            this.navigate('/settings/general/', {
                trigger: true,
                replace: true,
            });
            return;
        }
        
        if (!Wholeren.currentView){
            Wholeren.currentView = new View.Setting({ el: '#main', pane: pane });            
        }
// only update the currentView if we don't already have a Settings view
//        if (!Ghost.currentView || !(Ghost.currentView instanceof Ghost.Views.Settings)) {
//            Ghost.currentView = new Ghost.Views.Settings({ el: '#main', pane: pane });
//        }
    },
    contract:function(option){
        if(!option){

            this.navigate('/contract/general/',{trigger:true,replace:true});
            return;
        }
        if(!Wholeren.currentView){
            Wholeren.currentView=new View.Contract({el:'#main',option:option});
        }
    }
	
});
module.exports=Router;