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
var main=require('./data');
var base=require('./base');
var Sidebar=require('./sidebar');

var sales=main.baseDataView.extend({
    collectionName:'Comission',
    collectionUrl:'/SalesComission/',
    title:'销售佣金列表',
    paginator:true,
    renderOptions:{month:true},
    templateName:'default',
    constructColumns:function(){
        var self=this;
        return util.ajaxGET('/salesGroup/').then(function(data){
            var myselect=BackgridCells.SelectCell({name:'销售组',values:_.map(data,function(e){return [e.salesGroup,e.id]})});
            self.columns=[
            {name:'chineseName',label:'学生名字',editable:false,cell:'string'},
            {name:'nickname',label:'销售名字',editable: false,cell:'string'},
            {name:'UserCount',label:'老师人数',editable:false,cell:'integer'},
            {name:'contractSigned',label:'签约时间',editable:false,cell:'date'},
            {name:'contractPrice',label:'签约金额',editable:false,cell:'number'},
            {name:'altPrice',label:'服务总价',editable:false,cell:'number'},
            {name:'amountBeforeGoal',label:'完成目标金额',editable:false,cell:'number'},
            {name:'goal',label:'离目标还剩',editable:false,cell:'number'},
            {name:'amountAfterGoal',label:'超过目标金额',editable: false,cell:'number'},
            {name:'role',label:'销售/专家',editable:false,cell:'string'},
            {name:'salesGroup',label:'销售组',editable:false,cell:myselect},
            {name:'percent',label:'超过目标佣金百分比',editable: false,cell:Backgrid.NumberCell.extend({decimals:3})},
            {name:'comission',label:'合同佣金',editable:false,cell:'number'},
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

var teacher=main.baseDataView.extend({
    collectionName:'Comission',
    collectionUrl:'/ServiceComission/',
    title:'申请老师佣金列表',
    paginator:true,
    renderOptions:{month:true},
    cache:{},
    templateName:'default',
    constructColumns:function(){
        var self=this;
        return Promise.all([util.ajaxGET('/ServiceComission/roles/'),util.ajaxGET('/ServiceComission/level/')]).spread(function(roles,data){
            var roleselect=BackgridCells.SelectCell({name:'Roles',values:roles});
            var levelselect=roleselect.extend({
                optionValues:function(){
                    var cell=this;
                    var role=this.model.get('servRole')||0;
                    var type=this.model.get('type')||0;
                    self.cache[role]=self.cache[role]||[];
                    self.cache[role][type]=self.cache[role][type]||[];
                    self.cache[role][type]["level"]=self.cache[role][type]["level"]||[];
                    if(self.cache[role][type]["level"].length<1){                     
                        var shrunk=_.where(data,{servRole:role,serviceType:type});
                        var shrunk2=_.where(data,{servRole:role,serviceType:0}).forEach(function(e){
                            shrunk.push(e);
                        });
                        var unique=_.uniq(shrunk,false,function(e){return e.lid;});
                        self.cache[role][type]["level"]=_.map(unique,function(e){return [e.servLevel,e.lid]});                         
                    }
                    var toadd=self.cache[role][type]["level"].slice(0);//clone it
                    toadd.push(["No Level",null]);
                    cell._optionValues=[{name:10,values:toadd}];
                    return cell._optionValues;                    
                }
            });
            var statusselect=roleselect.extend({
                optionValues:function(){
                    var cell=this;
                    var role=this.model.get('servRole')||0;
                    var type=this.model.get('type')||0;
                    self.cache[role]=self.cache[role]||[];
                    self.cache[role][type]=self.cache[role][type]||[];
                    self.cache[role][type]["status"]=self.cache[role][type]["status"]||[];
                    if(self.cache[role][type]["status"].length<1){
                        var shrunk=_.where(data,{servRole:role,serviceType:type});
                        var shrunk2=_.where(data,{servRole:role,serviceType:0}).forEach(function(e){
                            shrunk.push(e);
                        });
                        var unique=_.uniq(shrunk,false,function(e){return e.sid;});
                        self.cache[role][type]["status"]=_.map(unique,function(e){return [e.serviceStatus,e.sid]});
                    }
                    var toadd=self.cache[role][type]["status"].slice(0);//clone it
                    toadd.push(["No Status",null]);
                    cell._optionValues=[{name:10,values:toadd}];
                    return cell._optionValues;
                } 
            });
            self.columns=[
                {name:'chineseName',label:'用户名字',editable:false,cell:'string'},
                {name:'nickname',label:'老师名字',editable: false,cell:'string'},
                {name:'serviceType',label:'服务类型',editable: false,cell:'string'},
                {name:'contractPaid',label:'付款时间',editable:false,cell:'Date'},
                {name:'servRole',label:'老师任务',editable:false,cell:roleselect},
                {name:'servLevel',label:'文书level',editable:false,cell:levelselect},
                {name:'startprogress',label:'月初进度',editable:false,cell:statusselect},
                {name:'endprogress',label:'月末进度',editable:false,cell:statusselect},
               // {name:'extra',label:'Extra',cell:'number'},
                {name:'startComission',label:'月初佣金',editable: false,cell:'number'},
                {name:'endComission',label:'月末佣金',editable: false,cell:'number'},
                {name:'monthlyComission',label:'本月佣金',editable:false,cell:'number'},
                // {name:'final',label:'佣金',cell:'number'}
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
var assis=main.baseDataView.extend({
    collectionName:'Comission',
    collectionUrl:'/AssistantComission/',
    title:'申请老师佣金列表',
    paginator:true,
    renderOptions:{month:true},
    templateName:'default',
    constructColumns:function(){
        this.columns=[{name:'chineseName',label:'客户名字',editable: false,cell:'string'},
        //{name:'contract',label:'Contract',editable:false,cell:'string'},
        {name:'user',label:'User',editable: false,cell:'string'},
        {name:'createdAt',label:'咨询时间',editable:false,cell:'Date'},
        {name:'contractPaid',label:'付款时间',editable:false,cell:'Date'},
        {name:'email',label:'邮件数',editable: false,cell:'number'},
        {name:'comission',label:'佣金',editable: false,cell:'number'},
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

var ComissionTitle={
    'sales':'销售佣金',
    'teacher':'申请老师佣金',
    'assis':'助理佣金',
}
var Comission={
    'sales':sales,
    'teacher':teacher,
    'assis':assis
}
var ComissionView=base.extend({
    initialize: function (options) {
        $(".settings-content").removeClass('active');
        this.sidebar = new Sidebar({
            el: '.settings-sidebar',
            pane: options.pane,
            submenu:'comission',
            MenuViews:Comission,
            MenuTitle:ComissionTitle
        });
        this.render();
        this.listenTo(Wholeren.router, 'route:comission', this.changePane);
        
    },
    changePane: function (pane) {
        if (!pane) {
            return;
        }
        this.sidebar.showContent(pane);
    },
    render: function () {
        this.sidebar.render({title:'Comission'});
    }
});
module.exports=ComissionView;
// module.exports={
//     'sales':SalesComissionView,
//     'service':ServiceComissionView,
//     'assis':AssisComissionView
// };