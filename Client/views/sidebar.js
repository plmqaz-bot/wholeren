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

var baseView=require('./base.js');

var Sidebar = baseView.extend({
    templateName:'marketSidebar',
    //submenu:'market',
    initialize: function (options) {
        this.el=options.el;
        this.submenu=options.submenu;
        this.MenuViews=options.MenuViews;
        this.MenuTitle=options.MenuTitle;
        //this.render();
        this.menu = this.$('.settings-menu');
    },
    models: {},
    events: {
        'click .settings-menu li': 'switchPane'
    },
    render: function (options) {
        var ml = this.template(options);
        if (ml[0] != '<') {
            ml = ml.substring(1);
        }
        this.$el.html(ml);
        var container=this.$('.settings-menu>ul')
        for(var key in this.MenuTitle){
            if (this.MenuTitle.hasOwnProperty(key)){
                container.append('<li class="general"><a href="#'+key+'">'+this.MenuTitle[key]+'</a></li>');
            }
        }
        return this;
    },
    switchPane: function (e) {
        e.preventDefault();
        var item = $(e.currentTarget),
            id = item.find('a').attr('href').substring(1);
        
        this.showContent(id);
    },

    showContent: function (id) {
        
        
        var self = this,
            model;
        Wholeren.router.navigate(Wholeren.router.root+this.submenu+'/' + id + '/');
        //myApp.trigger('urlchange');
        if (this.pane && id === this.pane.id) {
            return;
        }
        if(this.pane){
            this.pane.destroy();
            if(_.isFunction(this.pane.cleanup)){
                this.pane.cleanup();
            }
        }
        this.setActive(id);
        var toDisplay=this.MenuViews[id];
        if(toDisplay){
            this.pane =new toDisplay({ el: '.settings-content' }); 
        }else{
            this.pane=new this.MenuViews.Pane({ el: '.settings-content' });
        }
        //this.pane.render();
        //this.pane.afterRender();
    },

    renderPane: function (model) {
        this.pane.model = model;
        this.pane.render();
    },

    setActive: function (id) {
        this.menu = this.$('.settings-menu');
        this.menu.find('li').removeClass('active');
        var submenu= this.menu.find('.submenu');
        for (var i = 0; i < submenu.length; i++) {
            submenu[i].style.display = 'none';
        }
        this.menu.find('a[href=#' + id + ']').parent().addClass('active');
        var ind = id.indexOf('_');
        var frameID;
        //It is a submenu, first make the submenu display
        if (ind > 0) {
            frameID= id.substring(0, ind);
        } else {
            frameID = id;
        }
        if (this.menu.find('#' + frameID).length>0) {
            this.menu.find('#' + frameID)[0].style.display = 'block';
        } 
        
    }
});

module.exports=Sidebar;