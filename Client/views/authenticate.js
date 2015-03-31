"use strict";
var $ = require('./backgrid.fixedheader.js');
require('jquery-ui');
$=require('./bootstrap-modal.js')($);
//var Backbone = require('backbone');
//var Backgrid=require('./backgrid-paginator.js');
//var Backgrid=require('./backgrid-filter.js');
var Backgrid=require('./backgrid-text-cell.js');
var Backbone= require('./backbone.modal.js');
var _=require('lodash');
var Obiwang = require('./models');
var validator=require('./validator.js');
var util=require('./util');
var JST=require('./JST');
var Promise=require('bluebird');
var BackgridCells=require('./backgrid.cell.js');
require('backbone-forms');
var Backform=require('./backform');
Backbone.$=$;
var base=require('./base.js');

module.exports={
	login:base.baseView.extend({
	    initialize: function () {
	        this.render();
	    },

	    templateName: "signin",


	    events: {
	        'submit #login': 'submitHandler'
	    },

	    afterRender: function () {
	        var self = this;
	        this.$el.css({"opacity": 0}).animate({"opacity": 1}, 500, function () {
	            self.$("[name='email']").focus();
	        });
	    },

	    submitHandler: function (event) {
	        event.preventDefault();
	        var email = this.$el.find('.email').val(),
	            password = this.$el.find('.password').val(),
	            redirect = '/admin/contract/',
	            validationErrors = [];
	            $.ajax({
	                url: '/admin/doSignin/',
	                type: 'POST',
	                headers: {
	                    'X-CSRF-Token': $("meta[name='csrf-param']").attr('content')
	                },
	                data: {
	                    email: email,
	                    password: password,
	                    redirect: redirect
	                },
	                success: function (msg) {
	                    var sucessMsg={responseText:"success, please wait to be redirected",redirect:'/admin/contract/',delay:1};
	                    util.handleRequestSuccess(sucessMsg);
	                    //util.handleRequestSuccess(msg);
	                    //window.location.href = msg.redirect;
	                },
	                error: function (xhr) {
	                    Wholeren.notifications.clearEverything();
	                    Wholeren.notifications.addItem({
	                        type: 'error',
	                        message: util.getRequestErrorMessage(xhr),
	                        status: 'passive'
	                    });
	                }
	            });

	    }
	}),
	signup:base.baseView.extend({

        initialize: function () {
            this.submitted = "no";
            this.render();
            this.roles=new Obiwang.Collections['Role']();
            _.bindAll(this,'renderRole');
            var self=this;
            this.roles.fetch().done(function(){
                self.renderRole();
            }).fail(function(err){
                console.log(err);
            });
            //this.roles.on('reset',this.renderRole);
        },

        templateName: "signup",

        events: {
            'submit #signup': 'submitHandler'
        },

        afterRender: function () {
            var self = this;

            this.$el
                .css({"opacity": 0})
                .animate({"opacity": 1}, 500, function () {
                    self.$("[name='name']").focus();
                });
        },
        renderRole:function(roles){
            var select=$('.role').find('option').remove().end();
            this.roles.forEach(function(ele){
                var item=ele.toJSON();
                var toAdd=$('<option>', { value : item.id }).text(item['role']);
                select.append(toAdd);
            });
        },
        submitHandler: function (event) {
            event.preventDefault();
            var nickname = this.$('.nickname').val(),
                firstname = this.$('.firstname').val(),
                lastname = this.$('.lastname').val(),
                email = this.$('.email').val(),
                password = this.$('.password').val(),
                role=this.$('.role').val(),
                validationErrors = [],
                self = this;

            if (!validator.isLength(nickname, 1)) {
                validationErrors.push("Please enter a nickname.");
            }
            if (!validator.isLength(firstname, 1)) {
                validationErrors.push("Please enter a firstname.");
            }
            if (!validator.isLength(lastname, 1)) {
                validationErrors.push("Please enter a lastname.");
            }

            if (!validator.isEmail(email)) {
                validationErrors.push("Please enter a correct email address.");
            }

            if (!validator.isLength(password, 0)) {
                validationErrors.push("Please enter a password");
            }

            if (!validator.equals(this.submitted, "no")) {
                validationErrors.push("Wholeren is signing you up. Please wait...");
            }

            if (validationErrors.length) {
                validator.handleErrors(validationErrors);
            } else {
                this.submitted = "yes";
                $.ajax({
                    url: '/admin/doSignup/',
                    type: 'POST',
                    headers: {
                        'X-CSRF-Token': $("meta[name='csrf-param']").attr('content')
                    },
                    data: {
                        nickname: nickname,
                        firstname: firstname,
                        lastname: lastname,
                        email: email,
                        password: password,
                        role:role
                    },
                    success: function (msg) {
                        var sucessMsg={responseText:"success, please wait for your account to be activated",redirect:'/admin/signin/'};
                        util.handleRequestSuccess(sucessMsg);
                        //window.location.href = '/admin/signin/';
                    },
                    error: function (xhr) {
                        self.submitted = "no";
                        Wholeren.notifications.clearEverything();
                        Wholeren.notifications.addItem({
                            type: 'error',
                            message: xhr.responseText,
                            status: 'passive'
                        });
                    }
                });
            }
        }
    }),
	forgotten:Wholeren.baseView.extend({
	    templateName: "forgotten",
	    initialize: function () {
	                this.render();
	    },
	    afterRender: function () {
	        var self = this;
	        this.$el.css({"opacity": 0}).animate({"opacity": 1}, 500, function () {
	            self.$("[name='email']").focus();
	        });
	    },
	    events: {
	        'submit #forgotten': 'submitHandler'
	    },
	    submitHandler: function (event) {
	            event.preventDefault();

	            var email = this.$el.find('.email').val(),
	                validationErrors = [];

	            if (!validator.isEmail(email)) {
	                validationErrors.push("Please enter a correct email address.");
	            }

	            if (validationErrors.length) {
	                validator.handleErrors(validationErrors);
	            } else {
	                $.ajax({
	                    url: '/admin/forgotten/',
	                    type: 'POST',
	                    headers: {
	                        'X-CSRF-Token': $("meta[name='csrf-param']").attr('content')
	                    },
	                    data: {
	                        email: email
	                    },
	                    success: function (msg) {
	                        window.location.href = msg.redirect;
	                    },
	                    error: function (xhr) {
	                        util.handleRequestError(xhr);
	                    }
	                });
	            }
	        }
	});
}
