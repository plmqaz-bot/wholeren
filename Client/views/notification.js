"use strict";
var _=require('lodash');
var Promise=require('bluebird');
var moment=require('moment');
var $ = require('../jquery');
var Backgrid=require('../backgrid');
var Backbone= require('../backbone');
var Obiwang = require('../models');
var validator=require('../validator.js');
var util=require('../util');
var BackgridCells=require('../backgrid.cell.js');
var Backform=require('../backform');
var JST=require('../JST');

var base=require('./base.js');
var Notification={};
Notification.single=base.extend({
    	templateName: 'notification',
	    initialize: function (options) {
	        this.model = options.model;
	    },
	    className: 'js-bb-notification',
	    render: function () {
	        var html = this.template(this.model);
	        this.$el.html(html);
	        return this;
	    }
	});
Notification.collection=base.extend({
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
	        var itemView = new Notification.single({ model: item }),
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
module.exports=Notification;
