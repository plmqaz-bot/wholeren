/**
 * New node file
 */
"use strict";
var $ = require('jquery');
var Backbone = require('backbone');
Backbone.$=$;
var View=require('./View');

var Router=Backbone.Router.extend({
	routes: {
        'settings(/:pane)/' : 'settings',
        
    },
    settings: function (pane) {
        if (!pane) {
        	
            // Redirect to settings/general if no pane supplied
            this.navigate('/settings/general/', {
                trigger: true,
                replace: true,
            });
            return;
        }
        
        if (!myApp.currentView){
            myApp.currentView = new View.Setting({ el: '#main', pane: pane });            
        }
// only update the currentView if we don't already have a Settings view
//        if (!Ghost.currentView || !(Ghost.currentView instanceof Ghost.Views.Settings)) {
//            Ghost.currentView = new Ghost.Views.Settings({ el: '#main', pane: pane });
//        }
    }
	
});
module.exports=Router;