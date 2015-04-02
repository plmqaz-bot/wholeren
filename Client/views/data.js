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
var baseView=require('./base.js')

module.exports={
	/*
	*	extending it need to define collectionName, title
	*   Require options to contain el, renderOptions{date,month,deleted}
	*	optional: paginator and filterFields. 
	*	Also need to define constructColumns and constructTable function
	*/
	baseDataView:baseView.extend({
		templateName:'dateTableView',
		initialize: function (options) {
		_.bindAll(this,'constructColumns','constructTable');
		this.rank=$('#rank').text();
		this.el=options.el;
		if(options.renderOptions)this.renderOptions=options.renderOptions;
		if(options.paginator)this.paginator=options.paginator;
		if(options.filterFields)this.filterFields=options.filterFields;
		if(this.collectionParam){
			this.collection = new Obiwang.Collections[this.collectionName](this.collectionParam);
		}else{
			this.collection = new Obiwang.Collections[this.collectionName]();
		}

		this.render({title:this.title,options:this.renderOptions});
		//$('.page-actions').prepend('<button class="button-add">Add New</button>'); 
		var self=this;
		this.constructColumns().then(function(data){
			self.constructTable();
		}).catch(function(err){
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
			if(this.paginator){
				var paginator = new Backgrid.Extension.Paginator({
						windowSize: 20, // Default is 10
						slideScale: 0.25, // Default is 0.5
						goBackFirstOnSort: false, // Default is true
						collection: this.collection
					});
				$('.table-wrapper').append(paginator.render().el);  
			}
			if(this.filterFields){
				var clientSideFilter = new Backgrid.Extension.ClientSideFilter({
					collection: this.collection,
					placeholder: "Search in the browser",
					// The model fields to search for matches
					fields: this.filterFields,
					// How long to wait after typing has stopped before searching can start
					wait: 150
				});
				$('.table-wrapper').prepend(clientSideFilter.render().el);    
			}
			this.ready=true;
		},
		events: {
			'click  button.button-alt': 'refetch',
			'click  button.button-save': 'save',
		},
		refetch:function(e){
			if(!this.ready) return;
			if(this.renderOptions['date']){
				var startDate=$('#startDate').val();
				var endDate=$('#endDate').val();
				this.collection.setdate({startDate:startDate,endDate:endDate});
			}
			if(this.renderOptions['month']){
				var year=$('#year').val();
        		var month=$('#month').val();
        		this.collection.setdate({year:year,month:month});
			}
			if(this.renderOptions['delete']){
				this.collection.deleted=$('#deleted').checked;
			}			
			this.collection.reset();
			if(this.collection.fullCollection)this.collection.fullCollection.reset();
			this.collection.fetch({reset:true});
		},   
		save:function(e){
			util.saveCSV((this.collection||{}).fullCollection?this.collection.fullCollection:this.collection,this.columns);
		},
	}),
	baseModalDataView:Backbone.Modal.extend({
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
	        if(options.collectionName)this.collectionName=options.collectionName;
	        this.collection=new Obiwang.Collections[this.collectionName]();
			this.constructColumns().then(function(data){
				self.constructTable();
			}).catch(function(err){
				util.handleRequestError(err);
			});
	    },
	    afterRender:function(model){
	    	//var container=this.$el.find('.bbm-modal__section');
	        //container.append('<button class="button-add-invoice">Add New</button>');
			return this;
	    },
	    constructColumns:function(){
	        return Promise.resolve({});
	    },
	    constructTable:function(){
			this.grid=new Backgrid.Grid({columns:this.columns,collection:this.collection});
	        var container=this.$el.find('.bbm-modal__section');
	        container.append(self.grid.render().el);
	        this.collection.fetch({reset:true});
	    },
	    submit: function () {
	        // get text and submit, and also refresh the collection. 
	        this.grid.remove();
	        this.close();
	    },
	    checkKey:function(e){
	        if (this.active) {
	            if (e.keyCode==27) return this.triggerCancel();
	        }
	    }
	})
}

