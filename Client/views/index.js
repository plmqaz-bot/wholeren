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
Backbone.Form.Field.template=_.template('<div class="form-group">\
                <label for="<%= editorId %>"><%- title %></label>\
                <div class="controls">\
                <span data-editor></span>\
                <div class="help-inline" data-error></div>\
                <div class="help-block"><%= help %></div>\
                </div>\
            </div>');

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

module.exports={
        Notification:require('./notification.js'),
        Contract:require('./contract.js'),
        Service:require('./service.js'),
        Market:require('./market'),
        Setting:require('./settings'),
       //User:UserView,
        Auth:require('./authenticate.js'),
        Comission:require('./comission.js'),
        Accounting:Accounting
};