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
var CommentModalView=require('./comment');

var Accounting=main.baseDataView.extend({
    collectionName:'TimeRangeGeneral',
    collectionUrl:'/Accounting/',
	title:'Accounting',
	paginator:true,
	//filterFields:['clientName','contractCategory','lead','leadName','status','major','country','degree'],
	renderOptions:{date:true},
    ready:true,
    constructColumns:function(){
    	var self=this;
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
        this.columns=[
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
        return Promise.resolve({});
        
	},   
});

module.exports=Accounting;
