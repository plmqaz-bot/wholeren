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
var base=require('./base');

var CommentView=base.extend({
    tagName:'li',
    template: JST['commentSingle'],
    events: {
      "dblclick .view"  : "edit",
      "click a.destroy" : "clear",
      "keypress .editComment"  : "updateOnEnter",
      "blur .editComment"      : "close"
    },
    initialize: function() {
      this.listenTo(this.model, 'change', this.render);
      this.listenTo(this.model, 'destroy', this.remove);
    },
    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      this.input = this.$('.editComment');
      return this;
    },
    edit: function() {
      this.$el.addClass("editing");
      this.input.focus();
    },
    clear: function() {
      this.model.destroy();
    },
    updateOnEnter: function(e) {
      if (e.keyCode == 13) this.close();
    },
    close: function() {
      var value = this.input.val();
      if (!value) {
        this.clear();
      } else {
        this.model.save({comment: value});
        this.$el.removeClass("editing");
      }
    },
});
module.exports=Backbone.Modal.extend({
    viewContainer:'.app',
    //el: $("#todoapp"),
    template: JST['comment'],
    cancelEl: '.cancel',
    submitEl: '.ok',
    prefix:'small-bbm',
    events: {
      "keypress #new-todo":  "createOnEnter",
    },
    initialize: function(option) {
        this.cid=option.cid;
        this.sid=option.sid;
        this.aid=option.aid;
        this.Todos=new Obiwang.Collections.SimpleCollection([],{url:'/Comment/'});
        if(this.cid){
            this.Todos.setGetParameter({contract:this.cid});
        }else if(this.sid){
            this.Todos.setGetParameter({service:this.sid});
        }else if(this.aid){
            this.Todos.setGetParameter({application:this.aid});
        }else{
            return;
        }

      this.listenTo(this.Todos, 'add', this.addOne);
      //this.listenTo(this.Todos, 'all', this.render);   
      _.bindAll(this, "addAll");   
    },
    renderAll:function(){
        this.render();
        this.afterRender();
        return this;
    },
    afterRender:function(){
      this.input = this.$("#new-todo");
      this.main = $('#main');
      var self=this;
      this.Todos.fetch();
    },
    addOne: function(todo) {
      var view = new CommentView({model: todo});
      var toa=view.render().el;
      this.$el.find("#todo-list").append(toa);
    },
    addAll: function() {
      this.Todos.each(this.addOne, this);
    },
    createOnEnter: function(e) {
      if (e.keyCode != 13) return;
      if (!this.$("#new-todo").val()) return;
      if(this.cid){
        this.Todos.create({comment: this.$("#new-todo").val(),contract:this.cid});
      }
      if(this.sid){
        this.Todos.create({comment: this.$("#new-todo").val(),service:this.sid});
      }
      if(this.aid){
        this.Todos.create({comment: this.$("#new-todo").val(),application:this.aid});
      }
      this.$("#new-todo").val("");
    },
    clickOutside:function(){
        return;
    },
    checkKey:function(e){
        if (this.active) {
            if (e.keyCode==27) return this.triggerCancel();
        }
    }
});