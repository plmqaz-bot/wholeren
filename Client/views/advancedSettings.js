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
var Dropzone=require('dropzone');


var MenuTitle={
	'Reminder':'销售提醒',
	'SalesComissionLookUp':'销售佣金设置',
	'MonthlyGoal':'销售每月目标',
	'TableEditor':'其他设置'
}
var AdvancedSettings={
	Reminder:main.baseDataView.extend({
	    paginator:true,
	    title:'Notifications',
	    renderOptions:{nofield:true},
    	templateName:'default',
    	collectionName:'SimplePageCollection',
    	minScreenSize:0,
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
	    destroy: function () {
	        this.$el.removeClass('active');
	        this.undelegateEvents();
	    },
	    afterRender:function(){
	        this.$el.attr('id', this.id);
	        this.$el.addClass('active');
	    },
	}),
	SalesComissionLookUp:main.baseDataView.extend({
	    collectionName:'SimplePageCollection',
	    collectionUrl:'/ComissionLookup/',
	    title:'销售佣金设定',
	    filterFields:['rolename'],
	    paginator:true,
	    minScreenSize:0,
	    renderOptions:{nofield:true},
	    templateName:'default',
	     constructColumns:function(){
	        var self=this;
	        var editable=false;
	        if(parseInt(this.rank||"1")>=3){
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
	                {name:'alone',label:'是否独立',editable:editable,cell:'boolean'},
	                {name:'rolename',label:'销售角色',editable:editable,cell:'string'},
	                {name:'comission',label:'佣金百分比',editable:editable,cell:Backgrid.NumberCell.extend({decimals:3})},
	                {name:'',label:'Delete',cell:BackgridCells.DeleteCell}
	            ];
	            // self.selectFields=[
	            // {name:'puppet',options:_.map(user,function(e){return [e.nickname,e.id]})},
	            // {name:'boss',options:_.map(user,function(e){return [e.nickname,e.id]})},
	            // ];
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
	    newModel:function(){
        	return new Obiwang.Models.syncModel(null,{_url:'/Application/'});
    	},
	    // addnew:function(e){
	    //     e.preventDefault();
	    //     // var popUpView = new LookupForm({collection:this.collection});
	    //     // popUpView.render()
	    //     // $('.app').html(popUpView.el);
	    //     var toAdd=new Obiwang.Models.syncModel(null,{_url:this.collectionUrl});
	    //     var self=this;
	    //     toAdd.save(null,{
	    //         success:function(model){
	    //             self.collection.add(toAdd);
	    //         },
	    //         error:function(model,response){
	    //             util.handleRequestError(response);
	    //         },
	    //         save:false
	    //     });  
	    // },
	}),
	MonthlyGoal:main.baseDataView.extend({
	    title:'每月销量',
	    paginator:true,
	    collectionName:'General',
	    minScreenSize:0,
	    renderOptions:{month:true},
	    collectionParam:{url:'/Market/MonthlyGoal/'},
	    templateName:'default',
	    constructColumns:function(){
	         this.columns=[
	        {name:'nickname',label:'老师名字',editable:false,cell:'string'},
	        {name:'goal',label:'目标金额',cell:'number'}
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
	}),
	TableEditor:main.basePaneView.extend({
	    templateName:'dateTableView',
	    title:'表格修改',
	    initialize: function (options) {
	        this.rank=$('#rank').text();
	        this.render({title:this.title,options:this.renderOptions});
	    },
	    destroy: function () {
	        this.$el.removeClass('active');
	        this.undelegateEvents();
	    },
	    afterRender:function(){
	        this.$el.attr('id', this.id);
	        this.$el.addClass('active');
	    },
	})
};
var AdvancedSettingsView = base.extend({
    initialize: function (options) {
        $(".settings-content").removeClass('active');
        this.sidebar = new Sidebar({
            el: '.settings-sidebar',
            pane: options.pane,
            submenu:'advancedSettings',
            MenuViews:AdvancedSettings,
            MenuTitle:MenuTitle
        });
        this.render();
        this.listenTo(Wholeren.router, 'route:advancedSettings', this.changePane);
        
    },
    changePane: function (pane) {
        if (!pane) {
            return;
        }
        this.sidebar.showContent(pane);
    },
    render: function () {
        this.sidebar.render({title:'Advanced Settings'});

    }
});
module.exports=AdvancedSettingsView;