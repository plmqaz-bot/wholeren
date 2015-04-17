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
var Sidebar=require('./sidebar');
var base=require('./base');

var Market={};
Market.general=main.basePaneView.extend({
    templateName:'default',
    renderOptions:{month:true},
    events: {
        'click .button-alt':'refetch',
        'click .button-save':'save'
    },
    requrestUrl:'general',
    initialize:function(options){
        main.basePaneView.prototype.initialize.apply(this,arguments);
        this.render({title:this.title,options:this.renderOptions});
    },
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
    requrestUrl:'contractOfSaleAndExpert'
});
Market.view2=Market.general.extend({
    requrestUrl:'MonthlyChange'
});
Market.view3=main.baseDataView.extend({
    title:'每月销量',
    paginator:true,
    collectionName:'General',
    renderOptions:{month:true},
    collectionParam:{url:'/Market/MonthlyGoal/',model:Backbone.Model.extend({url:'/MonthlyGoal/'})},
    templateName:'default',
    constructColumns:function(){
         this.columns=[
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
        return Promise.resolve({});
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
Market.view4=Market.view3.extend({
    title:'Sales Role ',
    renderOptions:{},
    collectionParam:{url:'/SalesRole/'},
    constructColumns:function(){
        this.columns=[
        {name:'salesRole',label:'角色名称',editable:false,cell:'string'},
        {name:'comissionPercent',label:'佣金百分比',cell:Backgrid.NumberCell.extend({decimals:3})},
        {name:'flatComission',label:'非百分比佣金',cell:'number'}
        ];

        return Promise.resolve({});
     },
     refetch:function(e){
        this.collection.setdate({year:null,month:null});
        this.collection.reset();
        if(this.collection.fullCollection)this.collection.fullCollection.reset();
        this.collection.fetch({reset:true});
    },
});
Market.view5=Market.view4.extend({
    title:'Service Type Comission',
    collectionParam:{url:'/ServiceType/'},
    constructColumns:function(){
        this.UL=new Obiwang.Collections['UserLevel']();
        var grid2=new Backgrid.Grid({columns:[{name:'userLevel',label:'老师等级',editable:false,cell:'string'},
        {name:'userComission',label:'等级佣金百分比',cell:'number'}],collection:this.UL});
        $('.table-wrapper').append(grid2.render().el);
        this.UL.fetch();
        this.columns=[
        {name:'serviceType',label:'服务名称',editable:false,cell:'string'},
        {name:'category',label:'类型',editable:false,cell:'string'},
        {name:'comission',label:'百分比佣金',cell:Backgrid.NumberCell.extend({decimals:3})}
        ];

        return Promise.resolve({});
    },
    afterRender:function(){

        this.$el.attr('id', this.id);
        this.$el.addClass('active');
     },
});
Market.view6=Market.view4.extend({
    title:'Notifications',
    collectionParam:{url:'/Notifications/'},
    constructColumns:function(){
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
        this.columns=[
        {name:'chineseName',label:'客户名字',editable:false,cell:'string'},
        {name:'days',label:'天数',editable:false,cell:'integer'},
        {name:'nickname',label:'销售名字',editable:false,cell:'string'},
        {name:'reason',label:'提醒理由',editable:false,cell:'string'},
        {name:'createdAt',label:'生成日期',editable:false,cell:'date'},
        {name:'',label:'跳转',editable:false,cell:RedirectCell},
        {name:'',label:'Delete',editable:false,cell:DeleteCell}
        ];
        return Promise.resolve({});
     },
});
var MarketTitle={
    'general':'General',
    'view1':'总结',
    'view2':'月份收入',
    'view3':'月份销售目标',
    'view4':'销售专家佣金调整',
    'view5':'服务佣金',
    'view6':'提醒'
}
var MarketView=base.extend({
    initialize: function (options) {
        $(".settings-content").removeClass('active');
        this.sidebar = new Sidebar({
            el: '.settings-sidebar',
            pane: options.pane,
            submenu:'market',
            MenuViews:Market,
            MenuTitle:MarketTitle
        });
        this.render();
        this.listenTo(Wholeren.router, 'route:market', this.changePane);
        
    },
    changePane: function (pane) {
        if (!pane) {
            return;
        }
        this.sidebar.showContent(pane);
    },
    render: function () {
        this.sidebar.render({title:'Market'});
    }
});

module.exports=MarketView;