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
var JST=require('../JST');
Backbone.$=$;
Backbone.Form.editors.DatePicker =Backbone.Form.editors.Text.extend({
    render: function() {
        // Call the parent's render method
        Backbone.Form.editors.Text.prototype.render.call(this);
        // Then make the editor's element a datepicker.
        this.$el.datepicker({
            format: 'yyyy-mm-dd',
            autoclose: true,
            weekStart: 1
        });

        return this;
    },

    // The set value must correctl
    setValue: function(value) {
        var d=new Date(value);
        if(isNaN(d.getTime())){
            this.$el.val("");    
        }else{
            this.$el.val(d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate());
        }        
    }
});
Wholeren.baseView= Backbone.View.extend({
        templateName: "widget",

        template: function (data) {
            return JST[this.templateName](data);
        },

        templateData: function () {
            if (this.model) {
                return this.model.toJSON();
            }

            if (this.collection) {
                return this.collection.toJSON();
            }

            return {};
        },

        render: function () {
            if (_.isFunction(this.beforeRender)) {
                this.beforeRender();
            }

            this.$el.html(this.template(this.templateData()));

            if (_.isFunction(this.afterRender)) {
                this.afterRender();
            }

            return this;
        },
        addSubview: function (view) {
            if (!(view instanceof Backbone.View)) {
                throw new Error("Subview must be a Backbone.View");
            }
            this.subviews = this.subviews || [];
            this.subviews.push(view);
            return view;
        },

        // Removes any subviews associated with this view
        // by `addSubview`, which will in-turn remove any
        // children of those views, and so on.
        removeSubviews: function () {
            var children = this.subviews;

            if (!children) {
                return this;
            }

            _(children).invoke("remove");

            this.subviews = [];
            return this;
        },

        // Extends the view's remove, by calling `removeSubviews`
        // if any subviews exist.
        remove: function () {
            if (this.subviews) {
                this.removeSubviews();
            }
            return Backbone.View.prototype.remove.apply(this, arguments);
        }
    });
var UserView=Wholeren.baseView.extend({
    templateName:'dateTableView',
    initialize: function (options) {
        this.rank=$('#rank').text();
        this.el=options.el;
        this.collection = new Obiwang.Collections['User']();
        this.render({title:"Services"});
        var self=this;
        this.collection.fetch().done(function(){
            return Promise.all([util.ajaxGET('/Role/'),util.ajaxGET('/User/'),util.ajaxGET('/UserLevel/')]).spread(function(role,user,level){
            var roleselect=Backgrid.SelectCell.extend({
                optionValues:function(){
                    var selection=_.map(role,function(e){return [e.role,e.id]});
                    return [{name:"Role",values:selection}];
                },
                formatter:_.extend({}, Backgrid.SelectFormatter.prototype, {
                    toRaw: function (formattedValue, model) {
                      return formattedValue == null ? null: parseInt(formattedValue);
                    }
                })
            });
            var userselect=Backgrid.SelectCell.extend({
                optionValues:function(){
                    var selection=_.map(user,function(e){return [e.nickname,e.id]});
                    return [{name:"User",values:selection}];
                },
                formatter:_.extend({}, Backgrid.SelectFormatter.prototype, {
                    toRaw: function (formattedValue, model) {
                      return formattedValue == null ? null: parseInt(formattedValue);
                    }
                })
            });
            var levelselect=Backgrid.SelectCell.extend({
                optionValues:function(){
                    var selection=_.map(level,function(e){return [e.userLevel,e.id]});
                    return [{name:"UserLevel",values:selection}];
                },
                formatter:_.extend({}, Backgrid.SelectFormatter.prototype, {
                    toRaw: function (formattedValue, model) {
                      return formattedValue == null ? null: parseInt(formattedValue);
                    }
                })
            });
            var booleanCell=Backgrid.BooleanCell.extend({
                formatter:{
                    fromRaw:function(modelValue){
                        if(modelValue==true) return true;
                        return false;
                    },
                    toRaw:function(formattedValue,model){
                        return formattedValue =="true" ?true:false;
                    }
                }
            });
            var columns=[
            {name:'nickname',label:'称呼',editable: false,cell:'string'},
            {name:'firstname',label:'姓',editable:false,cell:'string'},                    
            {name:'lastname',label:'名',editable:false,cell:'string'},
            {name:'email',label:'邮箱',editable:false,cell:'string'},
            {name:'role',label:'职位',cell:roleselect},
            {name:'userLevel',label:'佣金等级',cell:levelselect},
            {name:'rank',label:'职位等级',cell:'number'},
            {name:'boss',label:'主管',cell:userselect},
            {name:'active',label:'在职',cell:'boolean'}
            ];
            self.columns=columns;
            self.grid=new Backgrid.Extension.ResponsiveGrid({columns:columns,collection:self.collection,columnsToPin:1,minScreenSize:4000});
            //ResposiveGrid
            //self.grid=new Backgrid.Grid({columns:columns,collection:self.collection});
            $('.table-wrapper').append(self.grid.render().el);             
        });
        }).fail(function(err){
            console.log(err);
        });
        
    },   
    save:function(e){
        util.saveCSV((this.collection||{}).fullCollection?this.collection.fullCollection:this.collection,this.columns);
    }
    });
/**************************************************** Accounting ******************************************************/
var Accounting=Wholeren.baseView.extend({
    templateName:'dateTableView',
    ready:true,
    initialize: function (options) {
        this.rank=$('#rank').text();
        this.el=options.el;
        this.collection = new Obiwang.Collections['TimeRangeGeneral']();
        this.collection.setUrl('/Accounting/');
        this.render({title:"Accounting"});
        var matchCell=Backgrid.Cell.extend({
            template: _.template("<a>Match</a>"),
            events: {
              "click a": "match"
            },
            match: function (e) {
              e.preventDefault();
              var toupdate={};
              toupdate.receivedNontaxable=this.model.get('nontaxable');
              toupdate.receivedRemittances=this.model.get('remittances');
              toupdate.receivedOther=this.model.get('other');
              toupdate.receivedTotal=this.model.get('totalpay');
              this.model.save(toupdate,{save:false});
            },
            render: function () {
              this.$el.html(this.template());
              this.delegateEvents();
              return this;
            }
        });
        var columns=[
        {name:'createdAt',label:'收款日期',editable:false,cell:'date'},
        {name:'servicepay',label:'服务收款',editable:false,cell:'number'},
        {name:'nontaxable',label:'时进时出',editable:false,cell:'number'},
        {name:'remittances',label:'银行费用',editable:false,cell:'number'},
        {name:'other',label:'其他',editable:false,cell:'number'},
        {name:'totalpay',label:'收款金额',editable: false,cell:'number'},
        {name:'account',label:'收款账户',editable: false,cell:'string'},
        {name:'',label:'Match',cell:matchCell},
        {name:'receiveDate',label:'实际收款日期',cell:'date'},
        {name:'receivedServicepay',label:'实收服务金额',editable:false,cell:'number'},
        {name:'receivedNontaxable',label:'实收时进时出',cell:'number'},
        {name:'receivedRemittances',label:'实收银行费用',cell:'number'},
        {name:'receivedOther',label:'实收其他',cell:'number'},
        {name:'receivedTotal',label:'实收金额',cell:'number'}
        ];
        var grid=new Backgrid.Grid({columns:columns,collection:this.collection});
        $('.table-wrapper').append(grid.render().el);
        var paginator = new Backgrid.Extension.Paginator({
        windowSize: 20, // Default is 10
        slideScale: 0.25, // Default is 0.5
        goBackFirstOnSort: false, // Default is true
        collection: this.collection
        });
        $('.table-wrapper').append(paginator.render().el);        
    },
    events: {
    'click  button.button-alt': 'refetch',
    'click a.page':'switchPage'
    },    
    refetch:function(e){
        if(!this.ready) return;
        var startDate=$('#startDate').val();
        var endDate=$('#endDate').val();
        this.collection.setdate({startDate:startDate,endDate:endDate});
        this.collection.reset();
        if(this.collection.fullCollection)this.collection.fullCollection.reset();
        this.collection.fetch({reset:true});
    }, 
});
/************************************************ Market VIEW *****************************************************/

var Sidebar = Wholeren.baseView.extend({
    //templateName:'marketSidebar',
    //submenu:'market',
    initialize: function (options) {
        
        this.el=options.el;
        this.templateName=options.templateName;
        this.submenu=options.submenu;
        this.MenuViews=options.MenuViews;
        this.render();

        this.menu = this.$('.settings-menu');
    },
    models: {},
    events: {
        'click .settings-menu li': 'switchPane'
    },
    render: function () {
        var ml = this.template();
        if (ml[0] != '<') {
            ml = ml.substring(1);
        }
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
        Wholeren.router.navigate('/'+this.submenu+'/' + id + '/');
        //myApp.trigger('urlchange');
        if (this.pane && id === this.pane.id) {
            return;
        }
        if(this.pane)
        this.pane.destroy();
        this.setActive(id);
        var toDisplay=this.MenuViews[id];
        if(toDisplay){
            this.pane =new toDisplay({ el: '.settings-content' }); 
        }else{
            this.pane=new this.MenuViews.Pane({ el: '.settings-content' });
        }
        this.pane.render();
        this.pane.afterRender();
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
var Market={};
Market.Pane = Wholeren.baseView.extend({
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
    }
});

Market.general=Market.Pane.extend({
    templateName:'default',
    id:"general",
    events: {
        'click .button-alt':'refetch',
        'click .button-save':'save'
    },
    requrestUrl:'general',
    refetch:function(){
        var month=$('#month').val()||'';
        var year=$('#year').val()||'';
        if(month.length<0||year.length<0) return;
        var query="month="+month+"&year="+year;
        $('.content').html("");
        var self=this;
        $.ajax({
                url: '/market/'+self.requrestUrl+'/?'+query,
                type: 'GET',
                headers: {
                    'X-CSRF-Token': $("meta[name='csrf-param']").attr('content')
                },
                success: function (msg) {
                    self.result=msg;
                    self.displayQuery(msg);
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
    },
    save:function(e){
        var col=new Backbone.Collection(this.result);
        util.saveCSV(col);
    },
    render: function () {
         var ml = this.template();
         if (ml[0] != '<') {
             ml = ml.substring(1);
         }
        this.$el.html(ml);
        this.refetch();
    },
    displayQuery:function(data){

        var tab=$('<table/>');
        if(!data) return;
        var keys=_.keys(data[0]);
        var headline=$('<tr/>');
        keys.forEach(function(ele){
            var attr=$('<th/>').text(ele);
            headline.append(attr);
        });
        tab.append(headline);
        //Now insert every row
        data.forEach(function(row){
            var curRow=$('<tr/>');
            keys.forEach(function(key){
                curRow.append($('<td/>').text(row[key]));
            });
            tab.append(curRow);
        });
        $('.content').html(tab);
    },
    afterRender: function () {
        this.$el.attr('id', this.id);
        this.$el.addClass('active');
    }

});

Market.view1=Market.general.extend({
    id:'view1',
    requrestUrl:'contractOfSaleAndExpert'
});
Market.view2=Market.general.extend({
    id:'view2',
    requrestUrl:'MonthlyChange'
});
Market.view3=Market.Pane.extend({
    id:'view3',
    title:'Monthly Goal',
    url:'/Market/MonthlyGoal/',
    templateName:'default',
    initialize:function(options){
        this.rank=$('#rank').text();
        this.el=options.el;
        this.collection = new Obiwang.Collections['General']({url:this.url,model:Backbone.Model.extend({url:'/MonthlyGoal/'})});
        this.render();
    },
    events: {
        'click .button-alt':'refetch',
        'click .button-save':'save'
    },
    save:function(e){
        util.saveCSV((this.collection||{}).fullCollection?this.collection.fullCollection:this.collection,this.columns);
    },
    render: function () {
         var ml = this.template({title:this.title});
         if (ml[0] != '<') {
             ml = ml.substring(1);
         }
        this.$el.html(ml);
    },
    afterRender:function(){
        var self=this;
        var columns=[
        {name:'nickname',label:'老师名字',editable:false,cell:'string'},
        {name:'transferSaleGoal',label:'转学销售目标',cell:'integer'},
        {name:'transferExpGoal',label:'转学专家目标',cell:'integer'},
        {name:'emergSaleGoal',label:'紧急销售目标',cell:'integer'},
        {name:'emergExpGoal',label:'紧急专家目标',cell:'integer'},
        {name:'highSaleGoal',label:'高中销售目标',cell:'integer'},
        {name:'highExpGoal',label:'高中专家目标',cell:'integer'},
        {name:'studySaleGoal',label:'学术销售目标',cell:'integer'},
        {name:'studyExpGoal',label:'学术专家目标',cell:'integer'},
        {name:'leadGoal',label:'lead',cell:'integer'},
        ];

        this.columns=columns;
        this.grid=new Backgrid.Grid({columns:columns,collection:self.collection});
        $('.content').append(this.grid.render().el);      
        var paginator = new Backgrid.Extension.Paginator({
            windowSize: 20, // Default is 10
            slideScale: 0.25, // Default is 0.5
            goBackFirstOnSort: false, // Default is true
            collection: self.collection
            });
        $('.content').append(paginator.render().el);  
        this.$el.attr('id', this.id);
        this.$el.addClass('active');
     },
    refetch:function(e){
        var year=$('#year').val();
        var month=$('#month').val();
        this.collection.setdate({year:year,month:month});
        this.collection.reset();
        if(this.collection.fullCollection)this.collection.fullCollection.reset();
        this.collection.fetch({reset:true});
    },
});
Market.view4=Market.view3.extend({
    id:'view4',
    title:'Sales Role ',
    url:'/SalesRole/',
    afterRender:function(){
        var self=this;
        var columns=[
        {name:'salesRole',label:'角色名称',editable:false,cell:'string'},
        {name:'comissionPercent',label:'佣金百分比',cell:Backgrid.NumberCell.extend({decimals:3})},
        {name:'flatComission',label:'非百分比佣金',cell:'number'}
        ];
        this.columns=columns;
        this.grid=new Backgrid.Grid({columns:columns,collection:self.collection});
        $('.content').append(this.grid.render().el);      
        var paginator = new Backgrid.Extension.Paginator({
            windowSize: 20, // Default is 10
            slideScale: 0.25, // Default is 0.5
            goBackFirstOnSort: false, // Default is true
            collection: self.collection
            });
        $('.content').append(paginator.render().el);  
        this.$el.attr('id', this.id);
        this.$el.addClass('active');
     },
     refetch:function(e){
        this.collection.setdate({year:"",month:""});
        this.collection.reset();
        if(this.collection.fullCollection)this.collection.fullCollection.reset();
        this.collection.fetch({reset:true});
    },
});
Market.view5=Market.view4.extend({
    id:'view5',
    title:'Service Type Comission',
    url:'/ServiceType/',
    afterRender:function(){
        var self=this;
        var columns=[
        {name:'serviceType',label:'服务名称',editable:false,cell:'string'},
        {name:'category',label:'类型',editable:false,cell:'string'},
        {name:'comission',label:'百分比佣金',cell:Backgrid.NumberCell.extend({decimals:3})}
        ];
        this.columns=columns;
        this.grid=new Backgrid.Grid({columns:columns,collection:self.collection});
        $('.content').append(this.grid.render().el);      
        var paginator = new Backgrid.Extension.Paginator({
            windowSize: 20, // Default is 10
            slideScale: 0.25, // Default is 0.5
            goBackFirstOnSort: false, // Default is true
            collection: self.collection
            });
        $('.content').append(paginator.render().el);  
        this.UL=new Obiwang.Collections['UserLevel']();
        var grid2=new Backgrid.Grid({columns:[{name:'userLevel',label:'老师等级',editable:false,cell:'string'},
        {name:'userComission',label:'等级佣金百分比',cell:'number'}],collection:self.UL});
        $('.content').append(grid2.render().el);
        this.UL.fetch();
        this.$el.attr('id', this.id);
        this.$el.addClass('active');
     },
});
Market.view6=Market.view4.extend({
    id:'view6',
    title:'Notifications',
    url:'/Notifications/',
    afterRender:function(){
        var self=this;
        var DeleteCell = BackgridCells.DeleteCell;
        var RedirectCell=Backgrid.Cell.extend({
            render: function () {
              var id=this.model.get('contract');
              this.$el.html('<a href="/admin/contract/'+id+'">Link</a>');
              this.delegateEvents();
              return this;
            }
        });
        var columns=[
        {name:'chineseName',label:'客户名字',editable:false,cell:'string'},
        {name:'days',label:'天数',editable:false,cell:'integer'},
        {name:'nickname',label:'销售名字',editable:false,cell:'string'},
        {name:'reason',label:'提醒理由',editable:false,cell:'string'},
        {name:'createdAt',label:'生成日期',editable:false,cell:'date'},
        {name:'',label:'跳转',editable:false,cell:RedirectCell},
        {name:'',label:'Delete',editable:false,cell:DeleteCell}
        ];
        this.columns=columns;
        this.grid=new Backgrid.Grid({columns:columns,collection:self.collection});
        $('.content').append(this.grid.render().el);      
        var paginator = new Backgrid.Extension.Paginator({
            windowSize: 20, // Default is 10
            slideScale: 0.25, // Default is 0.5
            goBackFirstOnSort: false, // Default is true
            collection: self.collection
            });
        $('.content').append(paginator.render().el);  
        this.$el.attr('id', this.id);
        this.$el.addClass('active');
     },
});
var MarketView=Wholeren.baseView.extend({
    initialize: function (options) {
        $(".settings-content").removeClass('active');
        this.sidebar = new Sidebar({
            el: '.settings-sidebar',
            pane: options.pane,
            model: this.model,
            templateName:'marketSidebar',
            submenu:'market',
            MenuViews:Market
        });
        this.listenTo(Wholeren.router, 'route:market', this.changePane);
        
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
//          this.showContent('general');
//        else
//          this.sidebar.renderPane({});
    }
});
/******************************************Views for Settings*************************************/


var Settings={};
Settings.Pane = Wholeren.baseView.extend({
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
            Wholeren.notifications.clearEverything();
            Wholeren.notifications.addItem({
                type: 'success',
                message: 'Saved',
                status: 'passive'
            });
        },
        saveError: function (model, xhr) {
            /*jshint unused:false*/
            Wholeren.notifications.clearEverything();
            Wholeren.notifications.addItem({
                type: 'error',
                message: util.handleRequestError(xhr),
                status: 'passive'
            });
        },
        validationError: function (message) {
            Wholeren.notifications.clearEverything();
            Wholeren.notifications.addItem({
                type: 'error',
                message: message,
                status: 'passive'
            });
        }
});
    // ### General settings
Settings.general = Settings.Pane.extend({
    id: "general",
    templateName:"settingGeneral",
    afterRender: function () {
        this.$el.attr('id', this.id);
        this.$el.addClass('active');
    }
});
Settings.user=Settings.Pane.extend({
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
    render:function(){
        var ml = this.template(this.model.toJSON());
         if (ml[0] != '<') {
             ml = ml.substring(1);
         }
        this.$el.html(ml);
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

var SettingView = Backbone.View.extend({
    initialize: function (options) {
        $(".settings-content").removeClass('active');
        this.sidebar = new Sidebar({
            el: '.settings-sidebar',
            pane: options.pane,
            model: this.model,
            templateName:'settingSidebar',
            submenu:'settings',
            MenuViews:Settings
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

    }
});
module.exports={
		Sidebar:Sidebar,
        Panes: Settings,
        Notification:require('./notification.js'),
        Contract:require('./contract.js'),
        Service:require('./service.js'),
        Market:MarketView,
        Setting:SettingView,
        User:UserView,
        Auth:require('./authenticate.js'),
        Comission:require('./comission.js'),
        Accounting:Accounting
};