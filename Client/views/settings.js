"use strict";
var _=require('lodash');
var Promise=require('bluebird');
var moment=require('moment');
var $ = require('jquery');
require('jquery-ui');
$=require('../bootstrap-modal.js')($);
var Backgrid=require('../backgrid-text-cell.js');
var Backbone= require('../backbone.modal.js');
var Obiwang = require('../models');
var validator=require('../validator.js');
var util=require('../util');
var BackgridCells=require('../backgrid.cell.js');
require('backbone-forms');
var Backform=require('../backform');
Backbone.$=$;
var JST=require('../JST');
var main=require('./data.js');
var base=require('./base');
var Sidebar=require('./sidebar');

var Settings={};
    // ### General settings
Settings.user=main.basePaneView.extend({
    id: 'user',
    templateName:'settingUser',
    events: {
        'click .button-save': 'saveUser',
        'click .button-change-password': 'changePassword',
    },
    initialize:function(option){
        var id=parseInt($('#userid').text())||null;
        this.model=new Obiwang.Models.simpleModel({id:id,_url:'/User/'});
        var self=this;
        this.model.fetch().then(function(data){
            self.render();
        });
    },

    afterRender: function () {
        this.$el.attr('id', this.id);
        this.$el.addClass('active');
    },
    saveUser: function () {
            var self = this,
                firstName = this.$('#user-firstname').val(),
                lastName = this.$('#user-lastname').val(),
                nickname = this.$('#user-nickname').val(),
                email = this.$('#user-email').val(),
                phone = this.$('#user-phone').val(),
                skype = this.$('#user-skype').val(),
                bio=this.$('#user-bio').val(),
                validationErrors = [];

            if (!validator.isLength(firstName, 0, 150)) {
                validationErrors.push({message: "Name is too long", el: $('#user-name')});
            }
            if (!validator.isLength(lastName, 0, 150)) {
                validationErrors.push({message: "Name is too long", el: $('#user-name')});
            }
            if (!validator.isLength(nickname, 0, 150)) {
                validationErrors.push({message: "Name is too long", el: $('#user-name')});
            }
            if (!validator.isLength(bio, 0, 200)) {
                validationErrors.push({message: "Bio is too long", el: $('#user-bio')});
            }

            if (!validator.isEmail(email)) {
                validationErrors.push({message: "Please supply a valid email address", el: $('#user-email')});
            }

            if (validationErrors.length) {
                validator.handleErrors(validationErrors);
            } else {

                this.model.save({
                    'firstname':             firstName,
                    'lastname':             lastName,
                    'nickname':             nickname,
                    'email':            email,
                    'phone':         phone,
                    'skype':          skype,
                    'bio':              bio
                }, {
                    patch:true,
                    success: this.saveSuccess,
                    error: this.saveError
                }).then(function () {
                    self.render();
                });
            }
    },
    changePassword: function (event) {
            event.preventDefault();
            var self = this,
                oldPassword = this.$('#user-password-old').val(),
                newPassword = this.$('#user-password-new').val(),
                ne2Password = this.$('#user-new-password-verification').val(),
                validationErrors = [];

            if (!validator.equals(newPassword, ne2Password)) {
                validationErrors.push("Your new passwords do not match");
            }

            if (!validator.isLength(newPassword, 5)) {
                validationErrors.push("Your password is not long enough. It must be at least 8 characters long.");
            }

            if (validationErrors.length) {
                validator.handleErrors(validationErrors);
            } else {
                $.ajax({
                    url: '/user/changepw/',
                    type: 'POST',
                    headers: {
                        'X-CSRF-Token': $("meta[name='csrf-param']").attr('content')
                    },
                    data: JSON.stringify({
                        password: oldPassword,
                        newpassword: newPassword,
                        ne2password: ne2Password
                    }),
                    success: function (msg) {
                        Wholeren.notifications.addItem({
                            type: 'success',
                            message: "password change succeed",
                            status: 'passive',
                            id: 'success-98'
                        });
                        self.$('#user-password-old, #user-password-new, #user-new-password-verification').val('');
                    },
                    error: function (xhr) {
                        Wholeren.notifications.addItem({
                            type: 'error',
                            message: util.handleRequestError(xhr),
                            status: 'passive'
                        });
                    }
                }).then(function () {
                    self.render();
                });
            }
    },
});
var MenuTitle={
    user:'个人资料'
}



var SettingView = base.extend({
    initialize: function (options) {
        $(".settings-content").removeClass('active');
        this.sidebar = new Sidebar({
            el: '.settings-sidebar',
            pane: options.pane,
            submenu:'settings',
            MenuViews:Settings,
            MenuTitle:MenuTitle
        });
        this.render();
        this.listenTo(Wholeren.router, 'route:settings', this.changePane);
        
    },
    changePane: function (pane) {
        if (!pane) {
            return;
        }
        this.sidebar.showContent(pane);
    },
    render: function () {
        this.sidebar.render({title:'Settings'});

    }
});

module.exports=SettingView;