"use strict";
var $ = require('jquery');
//var Backbone = require('backbone');
var Backbone= require('./backbone.modal.js');
var _=require('lodash');
var Handlebars = require('hbsfy/runtime');
var Obiwang = require('./models');
var Settings = {};
var Notification = {};
var baseViews=require('./baseViews.js');
//#region
Handlebars.registerHelper('ifCond', function (v1, v2, options) {
    if (v1 === v2) {
        return options.fn(this);
    }
    return options.inverse(this);
});
Backbone.$ = $;
//#endregion
/*************************************************All the templates *****************************/
var tpMsgPane = require('./template/settings/message.hbs');
var tpSidebar = require('./template/settings/sidebar.hbs');
var tpGeneral = require('./template/settings/general.hbs');
var tpReply = require('./template/modals/reply.hbs');
var tpChooseMaterial = require('./template/modals/material.hbs');
var tpNotification = require('./template/notification.hbs');
var tpKeyword = require('./template/settings/keyword.hbs');
var tpMaterial = require('./template/settings/replymaterial.hbs');
var tpKeywordSingle=require('./template/settings/keyword_single.hbs');
var tpMaterialSingle = require('./template/settings/replymaterial_single.hbs');
var tpMaterialAdd = require('./template/settings/replymaterial_add.hbs');
var tpContract=require('./template/contract.hbs');
var tpContractSingle=require('./template/contract_single.hbs');
var tpContractEdit=require('./template/modals/contract_edit.hbs');

/*************************************************Views for Notifications *****************************/
/**
     * This handles Notification groups
     */

Notification.Single = Backbone.View.extend({
    templateName: 'notification',
    initialize: function (options) {
        this.model = options.model;
    },
    className: 'js-bb-notification',
    template: tpNotification,
    render: function () {
        var html = this.template(this.model);
        this.$el.html(html);
        return this;
    }
});
Notification.Collection = Backbone.View.extend({
    el: '#notifications',
    initialize: function () {
        var self = this;
        this.render();
        Wholeren.on('urlchange', function () {
            self.clearEverything();
        });
        //shortcut.add("ESC", function () {
        //    // Make sure there isn't currently an open modal, as the escape key should close that first.
        //    // This is a temporary solution to enable closing extra-long notifications, and should be refactored
        //    // into something more robust in future
        //    if ($('.js-modal').length < 1) {
        //        self.clearEverything();
        //    }
        //});
    },
    events: {
        'animationend .js-notification': 'removeItem',
        'webkitAnimationEnd .js-notification': 'removeItem',
        'oanimationend .js-notification': 'removeItem',
        'MSAnimationEnd .js-notification': 'removeItem',
        'click .js-notification.notification-passive .close': 'closePassive',
        'click .js-notification.notification-persistent .close': 'closePersistent'
    },
    render: function () {
        _.each(this.model, function (item) {
            this.renderItem(item);
        }, this);
    },
    renderItem: function (item) {
        var itemView = new Notification.Single({ model: item }),
            height,
            $notification = $(itemView.render().el);
        
        this.$el.append($notification);
        height = $notification.hide().outerHeight(true);
        $notification.animate({ height: height }, 250, function () {
            $(this)
                    .css({ height: "auto" })
                    .fadeIn(250);
        });
    },
    addItem: function (item) {
        this.model.push(item);
        this.renderItem(item);
    },
    clearEverything: function () {
        this.$el.find('.js-notification.notification-passive').parent().remove();
    },
    removeItem: function (e) {
        e.preventDefault();
        var self = e.currentTarget,
            bbSelf = this;
        if (self.className.indexOf('notification-persistent') !== -1) {
            $.ajax({
                type: "DELETE",
                headers: {
                    'X-CSRF-Token': $("meta[name='csrf-param']").attr('content')
                },
                url: '/api/notifications/' + $(self).find('.close').data('id')
            }).done(function (result) {
                /*jshint unused:false*/
                bbSelf.$el.slideUp(250, function () {
                    $(this).show().css({ height: "auto" });
                    $(self).remove();
                });
            });
        } else {
            $(self).slideUp(250, function () {
                $(this)
                        .show()
                        .css({ height: "auto" })
                        .parent()
                        .remove();
            });
        }
    },
    closePassive: function (e) {
        $(e.currentTarget)
                .parent()
                .fadeOut(250)
                .slideUp(250, function () {
            $(this).remove();
        });
    },
    closePersistent: function (e) {
        var self = e.currentTarget,
            bbSelf = this;
        $.ajax({
            type: "DELETE",
            headers: {
                'X-CSRF-Token': $("meta[name='csrf-param']").attr('content')
            },
            url: +'/api/notifications/' + $(self).data('id')
        }).done(function (result) {
            /*jshint unused:false*/
            var height = bbSelf.$('.js-notification').outerHeight(true),
                $parent = $(self).parent();
            bbSelf.$el.css({ height: height });
            
            if ($parent.parent().hasClass('js-bb-notification')) {
                $parent.parent().fadeOut(200, function () {
                    $(this).remove();
                    bbSelf.$el.slideUp(250, function () {
                        $(this).show().css({ height: "auto" });
                    });
                });
            } else {
                $parent.fadeOut(200, function () {
                    $(this).remove();
                    bbSelf.$el.slideUp(250, function () {
                        $(this).show().css({ height: "auto" });
                    });
                });
            }
        });
    }
});
/*************************************************Views for Settings *****************************/
var SettingView = Backbone.View.extend({
    initialize: function (options) {
        $(".settings-content").removeClass('active');
        this.sidebar = new Sidebar({
            el: '.settings-sidebar',
            pane: options.pane,
            model: this.model
        });
        this.listenTo(Wholeren.router, 'route:settings', this.changePane);
        
    },
    changePane: function (pane) {
        if (!pane) {
            return;
        }
        this.sidebar.showContent(pane);
    },
    render: function () {
        this.sidebar.render();
//        if(!this.sidebar.pane)
//        	this.showContent('general');
//        else
//        	this.sidebar.renderPane({});
    }
});

var Sidebar = Backbone.View.extend({
    initialize: function (options) {
    	
    	this.el=options.el;
        this.render();

        this.menu = this.$('.settings-menu');
    },
    models: {},
    events: {
        'click .settings-menu li': 'switchPane'
    },
    render: function () {
//    	for (item in this.$el){
//    		alert(item+" "+this.$el[item]);
//    	}
    	//this.el.html(tpSidebar());
    
        //$(this.el).html("bb");
        var ml = tpSidebar({});
        if (ml[0] != '<') {
            ml = ml.substring(1);
        }
        this.$el.html('');
       this.$el.html(ml);
    	return this;
    },
    switchPane: function (e) {
        e.preventDefault();
        var item = $(e.currentTarget),
            id = item.find('a').attr('href').substring(1);
        
        this.showContent(id);
    },

    showContent: function (id) {
        
        
        var self = this,
            model;
        Wholeren.router.navigate('/settings/' + id + '/');
        //myApp.trigger('urlchange');
        if (this.pane && id === this.pane.id) {
            return;
        }
        if(this.pane)
        this.pane.destroy();
        this.setActive(id);
        var toDisplay=Settings[id];
        if(toDisplay){
        	this.pane =new toDisplay({ el: '.settings-content' }); 
        }else{
        	this.pane=new Settings.Pane({ el: '.settings-content' });
        }
        this.pane.render();
        
//
//        if (!this.models.hasOwnProperty(this.pane.options.modelType)) {
//            model = this.models[this.pane.options.modelType] = new Ghost.Models[this.pane.options.modelType]();
//            model.fetch().then(function () {
//                self.renderPane(model);
//            });
//        } else {
//            model = this.models[this.pane.options.modelType];
//            self.renderPane(model);
//        }
    },

    renderPane: function (model) {
        this.pane.model = model;
        this.pane.render();
    },

    setActive: function (id) {
    	this.menu = this.$('.settings-menu');
        this.menu.find('li').removeClass('active');
        var submenu= this.menu.find('.submenu');
        for (var i = 0; i < submenu.length; i++) {
            submenu[i].style.display = 'none';
        }
        this.menu.find('a[href=#' + id + ']').parent().addClass('active');
        var ind = id.indexOf('_');
        var frameID;
        //It is a submenu, first make the submenu display
        if (ind > 0) {
            frameID= id.substring(0, ind);
        } else {
            frameID = id;
        }
        if (this.menu.find('#' + frameID).length>0) {
            this.menu.find('#' + frameID)[0].style.display = 'block';
        } 
        
    }
});
Settings.Pane = Backbone.View.extend({
    destroy: function () {
        this.$el.removeClass('active');
        this.undelegateEvents();
    },
    
    render: function () {
        this.$el.hide();
        this.$el.html("Selected pane does not exist");
        this.$el.fadeIn(300);
    },
    afterRender: function () {
    	
        this.$el.attr('id', this.id);
        this.$el.addClass('active');
    },
    saveSuccess: function (model, response, options) {
        /*jshint unused:false*/
//        Ghost.notifications.clearEverything();
//        Ghost.notifications.addItem({
//            type: 'success',
//            message: 'Saved',
//            status: 'passive'
//        });
    },
    saveError: function (model, xhr) {
        /*jshint unused:false*/
//        Ghost.notifications.clearEverything();
//        Ghost.notifications.addItem({
//            type: 'error',
//            message: Ghost.Views.Utils.getRequestErrorMessage(xhr),
//            status: 'passive'
//        });
    },
    validationError: function (message) {
//        Ghost.notifications.clearEverything();
//        Ghost.notifications.addItem({
//            type: 'error',
//            message: message,
//            status: 'passive'
//        });
    }
});
 
var ContractView=Backbone.View.extend({

    id: "contracts",
    singleTemplate:tpContractSingle,
        initialize: function (options) {
            if (options.collection) {
                this.collection = options.collection;
            } else if (!this.collection || this.collection.length < 1) {
                this.collection = new Obiwang.Collections.Contract();
                this.collection.fetch({ reset: true });
            }
            this.render();
            this.collection.on("reset", this.renderCollection, this);
        },
        events: {
        'click  button.button-add': 'editView',
        },
        render: function () {
             var self = this;
             var data = self.collection?self.collection.toJSON():{};
             var ml = tpContract();
             if (ml[0] != '<') {
                 ml = ml.substring(1);
             }
            self.$el.html(ml);
        },
        renderCollection: function (){
        // Remove all keywords
        var toRemove = $('.Contracts > tr').not('#header');
        toRemove.remove();
        var headrow=$('#header');
        var self=this;
        this.collection.forEach(function(item){
            var ele = self.singleTemplate(item.toJSON());
            var toInsert = $('<div/>').html(ele).contents();
            toInsert.insertAfter(headrow);
        });     
        },
        editView: function(){
            var popUpView = new ContractEdit({view:this});
            $('.app').html(popUpView.render().el);
        }

        
       

});
var ContractEdit = Backbone.Modal.extend({
    viewContainer:'.app',
    initialize: function (options){
        this.parentView = options.view;
        this.model={};
        if(options.model){
            this.model=options.model;
        }else{
            this.model=new Obiwang.Models.Contract();
        }
        var col=new Obiwang.Collections.ContractCategory();
        col.fetch({reset:true});
        col.on('reset',this.renderSelect,this);

        col=new Obiwang.Collections.Country();
        col.fetch({reset:true});
        col.on('reset',this.renderSelect,this);

        col=new Obiwang.Collections.Degree();
        col.fetch({reset:true});
        col.on('reset',this.renderSelect,this);

        col=new Obiwang.Collections.Lead();
        col.fetch({reset:true});
        col.on('reset',this.renderSelect,this);

        col=new Obiwang.Collections.LeadLevel();
        col.fetch({reset:true});
        col.on('reset',this.renderSelect,this);

        col=new Obiwang.Collections.PaymentOption();
        col.fetch({reset:true});
        col.on('reset',this.renderSelect,this);

        col=new Obiwang.Collections.Status();
        col.fetch({reset:true});
        col.on('reset',this.renderSelect,this);
    }, 
    template: tpContractEdit,
    cancelEl: '.cancel',
    submitEl: '.ok',
    events:{
        "change select:not([id^='client.'])":"selectionChanged",
        "change input:not([id^='client.'])":"inputChanged",
        "change #client\\.firstName,#client\\.lastName,#client\\.chinesename":"refreshClientID",
        "change select[id^='client.']":"refreshClientInfo"
    },
    selectionChanged:function(e){
        var field=$(e.currentTarget);
        var selected=$("option:selected",field).val();
       // var value=$("option:selected",field).text();
        var id=field.attr('id');
        var data={};
        if(selected=='true'||selected=='false'){
            data[id]=selected;
            this.model.set(data);
        }else{

            data[id]=selected;
            this.model.set(data);
            
            //data[id]={};
            //data[id]['id']=selected;
            //data[id][id]=value;
            
        }
        
    },
    renderSelect:function(collection){
        var col=collection;
        var tableName=collection.name;        
        col.forEach(function(item){
            var ele=item.toJSON();
            console.log(ele);
            $('#'+tableName).append($('<option>', { value : ele.id }).text(ele[tableName])); 
        });  
    },
    refreshClientID:function(){
        var firstname=$("#client\\.firstName").val();
        var lastname=$("#client\\.lastName").val();
        var chinesename=$('#client\\.chineseName').val();
        var where='';
        if(firstname){
            where+='&firstName='+firstname;
        }
        if(lastname){
            where+='&lastName='+lastname;
        }
        if(chinesename){
            where+='&chineseName='+chinesename;
        }
        $.ajax({
            url: '/client/find?'+where,
            type: 'GET',
            headers: {
                'X-CSRF-Token': $("meta[name='csrf-param']").attr('content')
            },
            success: function (clients) {
                var theSel=$('#client\\.id').find('option').remove().end();
                theSel.append('<option></option>');
                console.log(clients);
                clients.forEach(function(entry){
                    theSel.append('<option value="'+entry.id+'">'+entry.primaryEmail+'</option>');
                });

                
            },
            error: function (xhr) {
                console.log('error');
            }
        });
    },
    refreshClientInfo:function(e){
        var field=$(e.currentTarget);
        var selected=$("option:selected",field).val();
       // var value=$("option:selected",field).text();
        var client=new Obiwang.Models['Client']({id:selected});
        var self=this;
        client.fetch({
            reset: true,
            success: function (mod, response, options) {
                self.model.set('client',mod);
                //$('#client\\.firstName').val(mod.get('firstName'));
                //$('#client\\.lastName').val(mod.get('lastName'));
                //$('#client\\.chineseName').val(mod.get('chineseName'));
                $('#client\\.primaryEmail').val(mod.get('primaryEmail'));
                $('#client\\.secondaryEmail').val(mod.get('secondaryEmail'));
                $('#client\\.primaryPhone').val(mod.get('primaryPhone'));
                $('#client\\.secondaryPhone').val(mod.get('secondaryPhone'));
                $('#client\\.otherInfo').val(mod.get('otherInfo'));
            },
            error: function (collection, response, options) {
                console.log('error fetch');
            }
        });
        
                
        
    },
    inputChanged:function(e){
        var field=$(e.currentTarget);
        var id=field.attr('id');
        var value=field.val();
            
        var sub=id.indexOf('.');
        if(sub>0){
            //It is not attribute, it is nested attribute.
            var nested=id.substring(0,sub);
            var obj=this.model.get(nested);
            data={};

            var attr=id.substring(sub+1);
            data[attr]=value;
            if(obj){
                obj.set(data);
            }else{
                var modelName=nested.charAt(0).toUpperCase() + nested.slice(1);
                this.model.set(nested,new Obiwang.Models[modelName]());
                this.model.get(nested).set(data);
            }

        }else{
            var data={};
            data[id] = value;
            this.model.set(data);
        }
    },
    submit: function () {
        // get text and submit, and also refresh the collection. 
        var content = $('.reply-content').val();
        var cli=this.model.get('client');
        if(cli){
            cli.save({},{
            success:function(d,xhr,options){console.log(xhr)},
            error:function(model,response,options){
                console.log(response.responseText);
            }
            });
        }
        this.model.save({},{success:function(d){console.log(d)},error:function(model,response){console.log(response.responseText);}});
        //var msg = new Obiwang.Models.Message({ Content: content, replyTo: this.replyTo });
       // msg.url='/api/replyMessage/';
       // msg.save();
       // if (this.parentView) { 
            //this.parentView.renderReplyAfterElement({id:this.replyTo,element:this.insertTo});
       // }
    }
});
module.exports={
		Setting:SettingView,
		Sidebar:Sidebar,
        Panes: Settings,
        Notification:Notification,
        Contract:ContractView

};