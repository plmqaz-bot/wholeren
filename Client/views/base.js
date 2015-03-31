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

var baseView=Backbone.View.extend({
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

module.exports={
	baseView:baseView,
	baseDataView:baseView.extend({
		templateName:'dateTableView',
	    initialize: function (options) {
	    	_.bindAll(this,'constructColumns','constructTable');
	        this.rank=$('#rank').text();
	        this.el=options.el;
	        this.collection = new Obiwang.Collections[options.collectionName]();
	        this.render({title:options.title});
	        //$('.page-actions').prepend('<button class="button-add">Add New</button>'); 
	        var self=this;
	        this.constructColumns.then(function(data){
	        	self.constructTable();
	        }).fail(function(err){
	        	util.handleRequestError(err);
	        });
	    },
	    constructColumns:function(){
	    	this.columns=[];
	    	return Promise.resolve({});
	    },
	    constructTable:function(){
            this.grid=new Backgrid.Extension.ResponsiveGrid({columns:this.columns,collection:this.collection,columnsToPin:1,minScreenSize:4000});
            //ResposiveGrid
            //self.grid=new Backgrid.Grid({columns:columns,collection:self.collection});
            $('.table-wrapper').append(this.grid.render().el);
             var paginator = new Backgrid.Extension.Paginator({
                    windowSize: 20, // Default is 10
                    slideScale: 0.25, // Default is 0.5
                    goBackFirstOnSort: false, // Default is true
                    collection: this.collection
                    });
            $('.table-wrapper').append(paginator.render().el);  
            var clientSideFilter = new Backgrid.Extension.ClientSideFilter({
                collection: this.collection,
                placeholder: "Search in the browser",
                // The model fields to search for matches
                fields: ['clientName','contractCategory','lead','leadName','status','major','country','degree'],
                // How long to wait after typing has stopped before searching can start
                wait: 150
            });
            $('.table-wrapper').prepend(clientSideFilter.render().el);    
	    },
	    events: {
	    'click  button.button-alt': 'refetch',
	    'click  button.button-save': 'save',
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
	    save:function(e){
	        util.saveCSV((this.collection||{}).fullCollection?this.collection.fullCollection:this.collection,this.columns);
	    },
	})
}

