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

module.exports={
	baseView:Backbone.View.extend({
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
    }),
}

