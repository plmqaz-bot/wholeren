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
module.exports=Backbone.View.extend({
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

	render: function (options) {
		if (_.isFunction(this.beforeRender)) {
			this.beforeRender();
		}
		if(options){
			this.$el.html(this.template(options));
		}else{
			this.$el.html(this.template(this.templateData()));			
		}
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

