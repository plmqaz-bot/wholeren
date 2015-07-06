/**
 * New node file
 */
"use strict";
var Backbone = require('./backbone');
Wholeren.Views=require('./views/');
module.exports=Backbone.Router.extend({
    root:'admin/',
	routes: function(){
        //return {'admin/settings(/:pane)/' : 'settings'};
        var toReturn={};
        /*
        * These are admin routes. 
        */ 
        toReturn[this.root+'settings(/:pane)/']='settings';
        toReturn[this.root+'advancedSettings(/:pane)/' ]= 'advancedSettings',
        toReturn[this.root+'market(/:pane)/']='market',
        toReturn[this.root+'salesSummary(/:pane)/']='salesSummary',
        toReturn[this.root+'contract/(:option)']='contract',
        toReturn[this.root+'service/(:option)']='service',
        toReturn[this.root+'servicelist/(:option)']='servicelist',
        toReturn[this.root+'comission(/:pane)/']='comission',
        toReturn[this.root+'accounting/']='accounting',
        toReturn[this.root+'user/(:option)']='user',
        toReturn[this.root+'register/'        ]= 'register',
        toReturn[this.root+'signup/'          ]= 'signup',
        toReturn[this.root+'signin/'          ]= 'signin',
        toReturn[this.root+'forgotten/'       ]= 'forgotten',
        toReturn[this.root+'reset/:token/'    ]= 'reset'
        return toReturn;
        // }
    },
    signup: function () {
        Wholeren.currentView = new Wholeren.Views.Auth.signup({ el: '.js-signup-box' });
    },

    signin: function () {
        Wholeren.currentView = new Wholeren.Views.Auth.login({ el: '.js-login-box' });
    },

    forgotten: function () {
        Wholeren.currentView = new Wholeren.Views.Auth.forgotten({ el: '.js-forgotten-box' });
    },

    reset: function (token) {
        Wholeren.currentView = new Wholeren.Views.Auth.ResetPassword({ el: '.js-reset-box', token: token });
    },
    settings: function (pane) {
        if (!pane) {
        	
            // Redirect to settings/general if no pane supplied
            this.navigate(this.root+'settings/user/', {
                trigger: true,
                replace: true,
            });
            return;
        }
        Wholeren.currentView = new  Wholeren.Views.Setting({ el: '#main', pane: pane });            
        
        // only update the currentView if we don't already have a Settings view
        //        if (!Ghost.currentView || !(Ghost.currentView instanceof Ghost.Views.Settings)) {
        //            Ghost.currentView = new Ghost.Views.Settings({ el: '#main', pane: pane });
        //        }
    },
    advancedSettings: function (pane) {
        if (!pane) {
            this.navigate(this.root+'advancedSettings/Reminder/', {
                trigger: true,
                replace: true,
            });
            return;
        }
        Wholeren.currentView = new  Wholeren.Views.AdvancedSettings({ el: '#main', pane: pane });            
    },
    market:function(pane){
        if(!pane){
            this.navigate(this.root+'market/general/',{trigger:true,replace:true});
            return;
        }
        Wholeren.currentView=new Wholeren.Views.Market({ el: '#main', pane: pane });
    },
    salesSummary:function(pane){
        if(!pane){
            this.navigate(this.root+'salesSummary/view1/',{trigger:true,replace:true});
            return;
        }
        Wholeren.currentView=new Wholeren.Views.SalesSummary({ el: '#main', pane: pane });
    },
    contract:function(option){

        if(!Wholeren.currentView){
            Wholeren.currentView=new  Wholeren.Views.Contract({el:'.content-view-container',id:option});
        }
    },
    service:function(option){
        if(!Wholeren.currentView){
            Wholeren.currentView=new  Wholeren.Views.Service({el:'.content-view-container',id:option});
        }
    },
    servicelist:function(option){
        if(!Wholeren.currentView){
            Wholeren.currentView=new  Wholeren.Views.ServiceList({el:'.content-view-container',id:option});
        }
    },
    accounting:function(option){
        if(!Wholeren.currentView){
            Wholeren.currentView=new  Wholeren.Views.Accounting({el:'.content-view-container',id:option});
        }
    },
    comission:function(pane){
        if(!pane){
            this.navigate(this.root+'comission/sales/',{trigger:true,replace:true});
            return;
        }
        if(!Wholeren.currentView){
            //Wholeren.currentView=new  Wholeren.Views.Comission[pane]({el:'.content-view-container'});
            Wholeren.currentView=new  Wholeren.Views.Comission({el:'#main',pane:pane});
        }
    },
    // servicecomission:function(option){
    //     if(!Wholeren.currentView){
    //         Wholeren.currentView=new  Wholeren.Views.ServiceComission({el:'.content-view-container',id:option});
    //     }
    // },
    // assiscomission:function(option){
    //     if(!Wholeren.currentView){
    //         Wholeren.currentView=new  Wholeren.Views.AssisComission({el:'.content-view-container',id:option});
    //     }
    // },
    // user:function(option){
    //     if(!Wholeren.currentView){
    //         Wholeren.currentView=new  Wholeren.Views.User({el:'.content-view-container',id:option});
    //     }
    // }
	
});