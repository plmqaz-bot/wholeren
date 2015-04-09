/**
 * New node file
 */
"use strict";
var Backbone = require('./backbone');
Wholeren.Views=require('./views/');
module.exports=Backbone.Router.extend({
	routes: {
        'settings(/:pane)/' : 'settings',
        'market(/:pane)/':'market',
        'contract/(:option)':'contract',
        'service/(:option)':'service',
        'comission(/:pane)/':'comission',
        'accounting/':'accounting',
        'user/(:option)':'user',
        'register/'        : 'register',
        'signup/'          : 'signup',
        'signin/'          : 'signin',
        'forgotten/'       : 'forgotten',
        'reset/:token/'    : 'reset'
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
        Wholeren.currentView = new Wholeren.Views.ResetPassword({ el: '.js-reset-box', token: token });
    },
    settings: function (pane) {
        if (!pane) {
        	
            // Redirect to settings/general if no pane supplied
            this.navigate('/settings/user/', {
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
    market:function(pane){
        if(!pane){
            this.navigate('/market/general/',{trigger:true,replace:true});
            return;
        }
        Wholeren.currentView=new Wholeren.Views.Market({ el: '#main', pane: pane });
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
    accounting:function(option){
        if(!Wholeren.currentView){
            Wholeren.currentView=new  Wholeren.Views.Accounting({el:'.content-view-container',id:option});
        }
    },
    comission:function(pane){
        if(!pane){
            this.navigate('/comission/sales/',{trigger:true,replace:true});
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