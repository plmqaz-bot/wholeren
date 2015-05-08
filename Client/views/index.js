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
            format: 'dd/mm/yyyy',
            autoclose: true,
            weekStart: 1
        });

        return this;
    },

    // The set value must correctl
    setValue: function(value) {
        var d=moment(value);
        if(isNaN(d.format('MM/DD/YYYY'))){
            this.$el.val("");    
        }else{
            this.$el.val(d.format('MM/DD/YYYY'));
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

module.exports={
        Notification:require('./notification.js'),
        Contract:require('./contract.js'),
        Service:require('./service.js'),
        Market:require('./market'),
        Setting:require('./settings'),
       //User:UserView,
        Auth:require('./authenticate.js'),
        Comission:require('./comission.js'),
        Accounting:require('./accounting.js')
};