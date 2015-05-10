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
        this.model=new Obiwang.Models.simpleModel({id:id},{_url:'/User/'});
        var self=this;
        this.model.fetch().then(function(data){
            self.render();
        }).fail(function(err){
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
Settings.allUsers=main.baseDataView.extend({
    collectionName:'User',
    title:'Users',
    paginator:true,
    renderOptions:{},
    minScreenSize:0,
    filterFields:['email','nickname'],
    templateName:'default',
    constructColumns:function(){
        var self=this;
        var editable=false;
        if(parseInt(this.rank||"1")==3){
            editable=true;
        }
        return Promise.all([util.ajaxGET('/Role/'),util.ajaxGET('/User/'),util.ajaxGET('/UserLevel/')]).spread(function(role,user,level){
            var roleselect=BackgridCells.SelectCell({name:"Role",values:_.map(role,function(e){return [e.role,e.id]})});
            var userselect=BackgridCells.SelectCell({name:"User",values:_.map(user,function(e){return [e.nickname,e.id]})});
            var levelselect=BackgridCells.SelectCell({name:"UserLevel",values:_.map(level,function(e){return [e.userLevel,e.id]})});      
            
            self.columns=[
            {name:'nickname',label:'称呼',editable: false,cell:'string'},
            {name:'firstname',label:'姓',editable:false,cell:'string'},                    
            {name:'lastname',label:'名',editable:false,cell:'string'},
            {name:'email',label:'邮箱',editable:false,cell:'string'},
            {name:'role',label:'职位',editable:editable,cell:roleselect},
            {name:'userLevel',label:'佣金等级',editable:editable,cell:levelselect},
            {name:'rank',label:'职位等级',editable:editable,cell:'number'},
            //{name:'boss',label:'主管',editable:editable,cell:userselect},
            {name:'active',label:'在职',editable:editable,cell:'boolean'}
            ];
            return Promise.resolve({});
        });
    },
    destroy: function () {
        this.$el.removeClass('active');
        this.undelegateEvents();
    },
    afterRender:function(){
        this.$el.attr('id', this.id);
        this.$el.addClass('active');
    },
});
Settings.lookup=main.baseDataView.extend({
    collectionName:'SyncCollection',
    collectionUrl:'/ServComissionLookUp/',
    title:'申请老师Comission机制',
    paginator:true,
    minScreenSize:0,
    renderOptions:{},
    filterFields:['serviceType'],
    templateName:'default',
    constructColumns:function(){
        var self=this;
        var editable=false;
        if(parseInt(this.rank||"1")==3){
            editable=true;
        }
        return Promise.all([util.ajaxGET('/ServiceType/'),util.ajaxGET('/ServRole/'),util.ajaxGET('/ServLevel/'),util.ajaxGET('/ServiceStatus/')]).spread(function(sType,sRole,sLevel,sStatus){
            var sTypeSel=BackgridCells.SelectCell({name:"ServiceType",values:_.map(sType,function(e){return [e.serviceType,e.id]})});
            var sRoleSel=BackgridCells.SelectCell({name:"Service Role",values:_.map(sRole,function(e){return [e.servRole,e.id]})});
            var sLevelSel=BackgridCells.SelectCell({name:"Service Level",values:_.map(sLevel,function(e){return [e.servLevel,e.id]})});
            var sStatusSel=BackgridCells.SelectCell({name:"Service Status",values:_.map(sStatus,function(e){return [e.serviceStatus,e.id]})});
            
            self.columns=[
            {name:'serviceType',label:'服务名称',editable:editable,cell:sTypeSel},
            {name:'servRole',label:'角色名称',editable:editable,cell:sRoleSel},
            {name:'servLevel',label:'文书级别',editable:editable,cell:sLevelSel},                    
            {name:'pricePerCol',label:'每学校佣金',editable:editable,cell:'number'},
            {name:'priceFlat',label:'固定佣金',editable:editable,cell:'number'},
            {name:'serviceStatus',label:'进度',editable:editable,cell:sStatusSel},
            {name:'statusportion',label:'进度佣金百分比',editable:editable,cell:'number'},
            {name:'statusflat',label:'固定进度佣金',editable:editable,cell:'number'},
            {name:'',label:'Delete',cell:BackgridCells.DeleteCell}
            ];
            return Promise.resolve({});
        });
    },
    events:{
        'click  button.button-alt': 'refetch',
        'click .button-add':'addnew'
    },
    destroy: function () {
        this.$el.removeClass('active');
        this.undelegateEvents();
    },
    afterRender:function(){
        this.$el.attr('id', this.id);
        this.$el.addClass('active');
        $('.content').prepend('<div>The Comission is calculated: 佣金=[(每学校佣金*学校#)+固定佣金]*进度佣金百分比+固定进度佣金</div>')
        $('.page-actions').prepend('<button class="button-add">Add New</button>');
    },
    addnew:function(e){
        e.preventDefault();
        var popUpView = new LookupForm({collection:this.collection});
        popUpView.render()
        $('.app').html(popUpView.el);
        // var toAdd=new Obiwang.Models.syncModel({_url:'/ServComissionLookUp/'});
        // var self=this;
        // toAdd.save(null,{
        //     success:function(model){
        //         self.collection.add(toAdd);
        //     },
        //     error:function(model,response){
        //         util.handleRequestError(response);
        //     },
        //     save:false
        // });  
    },
});
var LookupForm=Backbone.Modal.extend({
    prefix:"bbm",
    template: JST['editbox'],
    submitEl: '.ok',
    cancelEl:'.cancel',
    initialize: function (options){
        _.bindAll(this,  'render', 'afterRender');
        var self=this;
        this.render=_.wrap(this.render,function(render){
            render();
            self.afterRender();
        });
        this.collection=options.collection;
        this.model=new Obiwang.Models.syncModel({},{_url:'/ServComissionLookUp/'});
    },
    afterRender:function(){
        var template=_.template('<div class="form-group">\
                <label for="<%= editorId %>">\
                <% if (typeof(titleHTML) !== "undefined"){ %><%= titleHTML %>\
                <% } else { %><%- title %><% } %></label>\
                <div class="controls">\
                <span data-editor></span>\
                <div class="help-inline" data-error></div>\
                <div class="help-block"><%= help %></div>\
                </div>\
            </div>');
        Backbone.Form.Field.template=template;
        var container=this.$el.find('.bbm-modal__section');
        var self=this;
        

        this.form=new Backbone.Form({
            model:this.model,
            schema:{
                servRole:{type:'Select',title:'角色名称',options:new Obiwang.Collections.SimpleCollection([],{url:'/ServRole/'})},
                serviceType:{type:'Select',title:'服务名称',options:new Obiwang.Collections.SimpleCollection([],{url:'/ServiceType/'})},
                servLevel:{type:'Select',title:'文书级别',options:new Obiwang.Collections.SimpleCollection([],{url:'/ServLevel/'})},
                serviceStatus:{type:'Select',title:'进度',options:new Obiwang.Collections.SimpleCollection([],{url:'/ServiceStatus/'})},
                pricePerCol:{type:'Number',title:'每学校佣金'},
                priceFlat:{type:'Number',title:'固定佣金'},
                statusportion:{type:'Number',title:'进度佣金百分比'},
                statusflat:{type:'Number',title:'固定进度佣金'},
            }
        });
        this.form.render();
        container.append(this.form.el);
        return this;
    },
    submit:function(e){
        var self=this;
        var data=this.form.getValue();
        this.model.save(data,{
            save:false,
            success:function(model){
                self.collection.add(model);
            },
            error:function(model,response){
                util.handleRequestError(response);
            },
        })
    },
    checkKey:function(e){
        if (this.active) {
            if (e.keyCode==27) return this.triggerCancel();
        }
    }
});
Settings.hierarchy=main.baseDataView.extend({
    collectionName:'SyncCollection',
    collectionUrl:'/WhoOwnsWho/',
    title:'老师等级机制',
    paginator:true,
    minScreenSize:0,
    renderOptions:{},
    filterFields:['puppet','boss'],
    templateName:'default',
    constructColumns:function(){
        var self=this;
        var editable=false;
        if(parseInt(this.rank||"1")==3){
            editable=true;
        }
        return util.ajaxGET('/User/').then(function(user){
            var userselect=BackgridCells.SelectCell({name:"User",values:_.map(user,function(e){return [e.nickname,e.id]})});
            self.columns=[
                {name:'id',label:'id',editable:false,cell:'integer'},
                {name:'puppet',label:'被偷窥',editable:editable,cell:userselect},
                {name:'boss',label:'主动偷窥',editable:editable,cell:userselect},
            ];
            self.selectFields=[
            {name:'puppet',options:_.map(user,function(e){return [e.nickname,e.id]})},
            {name:'boss',options:_.map(user,function(e){return [e.nickname,e.id]})},
            ];
            return Promise.resolve({});
        });
    },
    events:{
        'click  button.button-alt': 'refetch',
        'click .button-add':'addnew'
    },
    destroy: function () {
        this.$el.removeClass('active');
        this.undelegateEvents();
    },
    afterRender:function(){
        this.$el.attr('id', this.id);
        this.$el.addClass('active');
        $('.page-actions').prepend('<button class="button-add">Add New</button>');
    },
    addnew:function(e){
        e.preventDefault();
        // var popUpView = new LookupForm({collection:this.collection});
        // popUpView.render()
        // $('.app').html(popUpView.el);
        var toAdd=new Obiwang.Models.syncModel(null,{_url:collectionUrl});
        var self=this;
        toAdd.save(null,{
            success:function(model){
                self.collection.add(toAdd);
            },
            error:function(model,response){
                util.handleRequestError(response);
            },
            save:false
        });  
    },
});

Settings.comissionLookup=Settings.hierarchy.extend({
    collectionUrl:'/ComissionLookup/',
    title:'销售佣金设定',
   // filterFields:['puppet','boss'],
    constructColumns:function(){
        var self=this;
        var editable=false;
        if(parseInt(this.rank||"1")==3){
            editable=true;
        }
        return util.ajaxGET('/contract/getAllOptions/').then(function(AllOptions){
            var t=_.map(AllOptions['SalesGroup'],function(e){return [e.salesGroup,e.id]});
            t.push(['任何销售组',0]);
            var salesgroup=BackgridCells.SelectCell({name:"SalesGroup",values:t});
            t=_.map(AllOptions['Lead'],function(e){return [e.lead,e.id]});
            t.push(['Any Lead',0]);
            var lead=BackgridCells.SelectCell({name:"Lead",values:t});
            var leadDetail=lead.extend({
                optionValues:function(){
                    var l=this.model.get('lead')||0;
                    var shrunk=_.where(AllOptions['LeadDetail'],{lead:l});
                    var toadd=_.map(shrunk,function(e){return [e.leadDetail,e.id]});
                    toadd.push(['Any LeadDetail',0]);
                    return [{name:'LeadDetail',values:toadd}];
                }
            });
            
            self.columns=[
                {name:'lead',label:'Lead种类',editable:editable,cell:lead},
                {name:'leadDetail',label:'lead种类细分',editable:editable,cell:leadDetail},
                {name:'salesGroup',label:'销售组',editable:editable,cell:salesgroup},
                {name:'rolename',label:'销售角色',editable:editable,cell:'string'},
                {name:'comission',label:'佣金百分比',editable:editable,cell:Backgrid.NumberCell.extend({decimals:3})},
            ];
            // self.selectFields=[
            // {name:'puppet',options:_.map(user,function(e){return [e.nickname,e.id]})},
            // {name:'boss',options:_.map(user,function(e){return [e.nickname,e.id]})},
            // ];
            return Promise.resolve({});
        });
    },

});
var MenuTitle={
    user:'个人资料',
    allUsers:'UserControl',
    lookup:'Comission机制',
    hierarchy:'老师等级机制',
    comissionLookup:'销售佣金设定'
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