"use strict";
var $ = require('jquery');
//var Backbone = require('backbone');
var Backbone= require('../assets/js/backbone.modal.js');
var _=require('lodash');
var Handlebars = require('hbsfy/runtime');
var Obiwang = require('./models');
var Settings = {};
var Notification = {};
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
var tpContractSingle=require('./template/contract_single.hbs')

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
        myApp.on('urlchange', function () {
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
        this.listenTo(myApp.router, 'route:settings', this.changePane);
        
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
        myApp.router.navigate('/settings/' + id + '/');
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
    // ### General settings
 Settings.general = Settings.Pane.extend({
    id: "general",
//    events: {
//        'click .button-save': 'saveSettings',
//        'click .js-modal-logo': 'showLogo',
//        'click .js-modal-cover': 'showCover'
//    },
    render: function () {
        var ml = tpGeneral();
        
        this.$el.html(ml);
        this.$el.attr('id', this.id);
        this.$el.addClass('active');
    }
});

Settings.messages = Settings.Pane.extend({
    id: "messages",
    initialize: function (options) {
        if (options.collection) {
            this.collection = options.collection;
        } else if (!this.collection || this.collection.length < 1) {
            this.collection = new Obiwang.Collections.Message();
            this.collection.fetch({ reset: true });
        }
        
        this.collection.on("reset", this.render, this);
    },
    events: {
        'click .messages a': 'renderReply',
        'click button': 'addReply'
    },
    render: function () {
        var self = this;
        var data = self.collection?self.collection.toJSON():{};
        var ml = tpMsgPane({ message: data });
        if (ml[0] != '<') {
            ml = ml.substring(1);
        }
        self.$el.html(ml);
        self.$el.attr('id', this.id);
        self.$el.addClass('active');
        console.log(this.collection);
    },
    renderReply: function (e) {
        e.preventDefault();
        var self = this;
        var item = $(e.currentTarget);
        var msgID = item.attr('href').substring(1);
        var thisRow = item.parent().parent();
        
        if (!thisRow.hasClass('active')) {
            thisRow.addClass('active');
            
            //Now render the replies
            this.renderReplyAfterElement({id:msgID,element:thisRow});
        } else {
            //Remove all previous replies
            this.$('table').find('.reply').remove();
            thisRow.removeClass('active');
        }
    },
    renderReplyAfterElement: function (options){
        //Remove all previous replies
        this.$('table').find('.reply').remove();
        self = this;
        this.replyCollection = new Obiwang.Collections.ReplyMessage({ id: options.id });
        this.replyCollection.fetch().done(function (data) {
            self.replyCollection.each(function (item) {
                var jitem = item.toJSON();
                var ele = '<tr class="reply"><td></td><td>' + jitem.ToUserName + '</td><td>' + jitem.Content + '</td><td></td></tr>';
                var toInsert = $('<div/>').html(ele).contents();
                toInsert.insertAfter(options.element);
            });
        });
        myApp.notifications.clearEverything();
        myApp.notifications.addItem({
            type: 'error',
            message: "test message",
            status: 'passive'
        });
    },
    addReply: function (e) {
        e.preventDefault();
        var item = $(e.currentTarget);
        var msgID = item.attr('id').substring(1);
        var thisRow = item.parent().parent();
        var popUpView;
        if (thisRow.hasClass('active')) {
            popUpView = new Settings.ReplyView({view:this,id:msgID,element:thisRow});
        } else { 
            popUpView = new Settings.ReplyView({});
        }
        $('.app').html(popUpView.render().el);
    }
});
Settings.ReplyView = Backbone.Modal.extend({
    initialize: function (options){
        this.parentView = options.view;
        this.replyTo = options.id;
        this.insertTo = options.element;
    }, 
    template: tpReply,
    cancelEl: '.cancel',
    submitEl: '.ok',
    submit: function () {
        // get text and submit, and also refresh the collection. 
        var content = $('.reply-content').val();
        var msg = new Obiwang.Models.Message({ Content: content, replyTo: this.replyTo });
        msg.url='/api/replyMessage/';
        msg.save();
        if (this.parentView) { 
            this.parentView.renderReplyAfterElement({id:this.replyTo,element:this.insertTo});
        }
    }
});
Settings.keywordreply = Settings.Pane.extend({
    id: "keywordreply",
    singleTemplate:tpKeywordSingle,
    initialize: function (options) {
        if (options.collection) {
            this.collection = options.collection;
        } else if (!this.collection || this.collection.length < 1) {
            this.collection = new Obiwang.Collections.Keyword();
            this.collection.fetch({ reset: true });
        }
        this.render();
        this.collection.on("reset", this.renderCollection, this);
    },
    events: {
        'click  button.regular': 'chooseReply',
        'click  button.member': 'chooseReply',
        'click img.remove' :'removeKeyword'
    },
    removeKeyword: function (e){
        var item = $(e.currentTarget);
        var msgID = item.parent().attr('href').substring(1);
        this.collection.get(msgID).destroy();
        },
    render: function () {
        var self = this;
        var ml = tpKeyword();
        if (ml[0] != '<') {
            ml = ml.substring(1);
        }
        self.$el.html(ml);
        self.$el.attr('id', this.id);
        self.$el.addClass('active');
    },
    renderCollection: function (){
        // Remove all keywords
        var toRemove = $('.keywords > tr').not('#header');
        toRemove.remove();
    	var headrow=$('#header');
    	var self=this;
    	this.collection.forEach(function(item){
    		var ele = self.singleTemplate(item.toJSON());
            var toInsert = $('<div/>').html(ele).contents();
            toInsert.insertAfter(headrow);
    	});    	
    },
    renderSingle: function (id) {
        var thisrow = $('#' + id);
        if (this.length<1){
        	return;
        }
        var self = this;
        var thiskeyword = new Obiwang.Models.Keyword({ idKeywordReply: id });
        thiskeyword.fetch().done(function () {
            thisrow.empty();
            thisrow.replaceWith(self.singleTemplate(thiskeyword.toJSON()));
        });
    },
    chooseReply: function (e){
        e.preventDefault();
        var item = $(e.currentTarget);
        var type = item.attr('class');
        
        var msgID = item.attr('name').substring(1);
        var thismodel = this.collection.get(msgID);
        //var thisRow = item.parent().parent();
        var popUpView = new Settings.ChooseReply({view:this,id:msgID,type:type,model:thismodel});
        //if (thisRow.hasClass('active')) {
        //    popUpView = new Settings.ChooseReply({ view: this, id: msgID, element: thisRow });
       // } else {
           
        //}
        popUpView.getMaterial().done(function () { 
            $('.app').html(popUpView.render().el);
        });
        
    }
});
Settings.ChooseReply = Backbone.Modal.extend({
    viewContainer:'.app',
    initialize: function (options) {
        this.parentView = options.view;
        this.keywordId = options.id;
        this.Type = options.type;
        this.model=options.model;
    },
    getMaterial: function (){
        this.collection = new Obiwang.Collections.ReplyMaterial();
        return this.collection.fetch();
        
    },
    events: {
        'click  button.choose-reply-material': 'setReply'
    },
    template: tpChooseMaterial,
    cancelEl: '.cancel',
    submitEl: '.ok',
    setReply: function (e){
        e.preventDefault();
        var item = $(e.currentTarget);
        var thisrow = item.parent().parent();
        if (thisrow.hasClass('selected')) {
            thisrow.removeClass('selected');
        } else {
            thisrow.addClass('selected');
        }
    },
    submit: function () {
    	var self=this;
        // get text and submit, and also refresh the collection. 
        var thisrow = $('.selected');
        var materialId;
        if (thisrow.length<1) { 
            materialId=-1;
        }else{
        	materialId= thisrow.attr('id').substring(1);
        }
        if (this.Type == 'regular') {
            this.model.RegularReply = { idReplyMaterial: materialId };
        } else {
            this.model.MemberReply = { idReplyMaterial: materialId };
        }
        this.model.save().done(function () { 
        	self.parentView.renderSingle(self.keywordId);
        });
    }
});

Settings.replymaterial = Settings.Pane.extend({
    id: "replymaterial",
    singleTemplate: tpMaterialSingle,
    initialize: function (options) {
        if (options.collection) {
            this.collection = options.collection;
        } else if (!this.collection || this.collection.length < 1) {
            this.collection = new Obiwang.Collections.ReplyMaterial();
            this.collection.fetch({ reset: true });
        }
        this.render();
        this.collection.on("reset", this.renderCollection, this);
    },
    events:{
        'click button.expand': 'expand',
        'click img.remove' : 'removeMaterial'
    },
    removeMaterial: function (e) {
        var item = $(e.currentTarget);
        var msgID = item.parent().attr('href').substring(1);
        this.collection.get(msgID).destroy();
    },
    expand:function(){
    	//this.renderSingle(1);
    },
    render: function () {
        var self = this;
        var ml = tpMaterial();
        if (ml[0] != '<') {
            ml = ml.substring(1);
        }
        self.$el.html(ml);
        self.$el.attr('id', this.id);
        self.$el.addClass('active');
        console.log(this.collection);
    },
    renderCollection: function () {
        // Remove all keywords
        var toRemove = $('.materials > tr').not('#header');
        toRemove.remove();
        var headrow = $('#header');
        var self = this;
        this.collection.forEach(function (item) {
            var ele = self.singleTemplate(item.toJSON());
            var toInsert = $('<div/>').html(ele).contents();
            toInsert.insertAfter(headrow);
        });
    },
    renderSingle: function (id) {
        var thisrow = $('#' + id);
        var self=this;
        if (thisrow.length<1){
        	// add a row
        }else{
	        var thismat= new Obiwang.Models.ReplyMaterial({ idReplyMaterial: id });
	        thismat.fetch().done(function () {
	            thisrow.empty();
	            thisrow.replaceWith(self.singleTemplate(thismat.toJSON()));
	        });
    	}
    }
});
Settings.replymaterial_add = Settings.Pane.extend({
    id: "replymaterial_add",
    template: tpMaterialAdd,
    events: {
        'change select#MsgType ': 'switchtype',
    },
    switchtype: function (){
        $('.details').removeClass('active');
        var sel = $('select#MsgType').val();
        var activeField = $('#for-' + sel);
        activeField.addClass('active');
    },
    render: function () {
        var ml = this.template();
        if (ml[0] != '<') {
            ml = ml.substring(1);
        }        
        this.$el.html(ml);
        this.$el.attr('id', this.id);
        this.$el.addClass('active');
            
    }   
});
var ContractView=Backbone.View.extend({

    id: "contracts",
        initialize: function (options) {
            // if (options.collection) {
            //     this.collection = options.collection;
            // } else if (!this.collection || this.collection.length < 1) {
            //     this.collection = new Obiwang.Collections.Message();
            //     this.collection.fetch({ reset: true });
            // }
            
            // this.collection.on("reset", this.render, this);
            this.render();
        },
        render: function () {
             var self = this;
            // var data = self.collection?self.collection.toJSON():{};
            // var ml = tpMsgPane({ message: data });
            // if (ml[0] != '<') {
            //     ml = ml.substring(1);
            // }
            self.$el.html(tpContract());
            self.$el.attr('id', this.id);
            self.$el.addClass('active');
            console.log(this.collection);
        },

});
module.exports={
		Setting:SettingView,
		Sidebar:Sidebar,
        Panes: Settings,
        Notification:Notification,
        Contract:ContractView
};