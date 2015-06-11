var Backgrid=require('./backgrid');
var util=require('./util');
var _=require('lodash');

var BCEditor=Backgrid.BooleanCellEditor.extend({
  tagName:"div",
  attributes: {
    tabIndex: -1,
  },
  events:{
    "mousedown": function () {
      this.mouseDown = true;
    },
    "blur": "enterOrExitEditMode",
    "mouseup": function () {
      this.mouseDown = false;
    },
    "click ": "saveOrCancel",
    "click input": "saveOrCancel",
   // "change2":"saveOrCancel",
    "keydown": "saveOrCancel"
  },
  changeVal:function(e){
    e.preventDefault();
    e.stopPropagation();
    var model = this.model;
    var val = this.formatter.fromRaw(model.get(this.column.get("name")), model);
    this.trigger("change2",this.model);
  },
   render: function () {
    var model = this.model;
    var val = this.formatter.fromRaw(model.get(this.column.get("name")), model);
    var editable = Backgrid.callByNeed(this.column.editable(), this.column, model);
    this.$el.empty();
    if(val!=null){
      this.$el.css({'background-color':'inherit',width:20,height:20,});
      var cb=$("<input>", {
        tabIndex: -1,
        type: "checkbox",
        checked: val,
        disabled: !editable
      });
      this.$el.append(cb);
    }else{
      this.$el.css({'background-color':'grey',width:20,height:20,});
    }
    return this;
  },
  saveOrCancel: function (e) {
    var model = this.model;
    var column = this.column;
    var formatter = this.formatter;
    var command = new Backgrid.Command(e);
    // skip ahead to `change` when space is pressed
    if (command.passThru() && e.type != "click") return true;
    if (command.cancel()) {
      e.stopPropagation();
      model.trigger("backgrid:edited", model, column, command);
    }

    var $el = this.$el;
    if (command.save() || command.moveLeft() || command.moveRight() || command.moveUp() ||
        command.moveDown()) {
      e.preventDefault();
      e.stopPropagation();
      var val=null;
      if(this.$('input').length>0){
       val = formatter.toRaw($el.prop("checked"), model);
      }
      model.set(column.get("name"), val);
      model.trigger("backgrid:edited", model, column, command);
    }
    else if (e.type == "change") {
      var val=null;
      if(this.$('input').length>0){
       val = formatter.toRaw($el.prop("checked"), model);
      }
    }else if (e.type=="click"){
      e.stopPropagation();
      var val=null;
      if(this.$('input').length>0){
        val = this.formatter.fromRaw(model.get(this.column.get("name")), model);
      }
      var editable = Backgrid.callByNeed(this.column.editable(), this.column, model);
      if(editable){
        // if(val==null){ //Next is true
        //   this.$el.css({"background-color":"inherit"});
        //   var cb=$("<input>", {
        //     tabIndex: -1,
        //     type: "checkbox",
        //     checked: true,
        //   });
        //   this.$el.append(cb);
        // }else if(val){ // Next is false
        //   this.$('input[type="checkbox"]').prop("checked",false);
        // }else{
        //   this.$el.empty();
        //   this.$el.css({"background-color":"black"});
        // }
        switch (val){
          case null: val=true;break;
          case true: val=false;break;
          case false: val=null;break;
        }
        model.set(column.get("name"), val);
        this.render();
      }

      $el.focus();
    }
  }
});

module.exports={
	DeleteCell:Backgrid.Cell.extend({
    template: _.template("<a>Delete/Undelete</a>"),
    events: {
      "click a": "deleteRow"
    },
    deleteRow: function (e) {
      e.preventDefault();
      if (confirm("Are you sure to delete (or recover) this row?") != true) {
        return;
      }
      this.model.destroy({
        success:function(model){
          Wholeren.notifications.addItem({
            type: 'success',
            message: "Delete/Undelete Successful",
            status: 'passive'
          });
        },
        error:function(response){
          util.handleRequestError(response);
        },
        wait:true
      });
    },
    render: function () {
      this.$el.html(this.template());
      this.delegateEvents();
      return this;
    }
  }),
  UpdateCell:Backgrid.Cell.extend({
    template: _.template("<a>Update</a>"),
    events: {
      "click": "update"
    },
    update: function (e) {
      e.preventDefault();
      this.model.save().then(function(model){
        Wholeren.notifications.addItem({
          type: 'success',
          message: "Update Successful",
          status: 'passive'
        });
      }).fail(function(response){
        util.handleRequestError(response);
      });
    },
    render: function () {
      this.$el.html(this.template());
      this.delegateEvents();
      return this;
    }
  }),
  Cell:Backgrid.Cell.extend({
    cellText:'',
    events:{
     "click a":"action",
   },
   action:function(e){

   },
   render: function () {
    this.$el.html('<a>'+this.cellText+'</a>');
    this.delegateEvents();
    return this;
  }
  }),
  SelectCell:function(options){
    options=options||{};
    var touse=_.clone(options.values||[]);
    if(options.nullable!=false){
      touse.push(["unknown",null]);
    }
    return Backgrid.SelectCell.extend({
      optionValues:function(){
        return touse;
      },
      formatter:_.extend({}, Backgrid.SelectFormatter.prototype, {
        toRaw: function (formattedValue, model) {
          return formattedValue == null ? null: parseInt(formattedValue);
        }
      })
    },{
      _touse:touse
    });
  },
  MomentCell:Backgrid.Extension.MomentCell.extend({
    formatter:_.extend(Backgrid.Extension.MomentFormatter,{displayFormat:'MM/DD/YYYY',displayInUTC: false})
  }),
  BooleanCell:Backgrid.BooleanCell.extend({
    editor: BCEditor,
    render: function () {
      this.$el.empty();
      var model = this.model, column = this.column;
      var editable = Backgrid.callByNeed(column.editable(), column, model);
      var value=this.formatter.fromRaw(model.get(column.get("name")), model);
      if(value!=null){
        var di=$('<div>',{
          class:'togable',
          width:20,
          height:20,
        });
        var cb=$("<input>", {
          tabIndex: -1,
          type: "checkbox",
          checked: this.formatter.fromRaw(model.get(column.get("name")), model),
          disabled: !editable
        });
        di.append(cb);
        this.$el.append(di);
      }else{
        var di=$("<div>")
        di.css({"background-color":'grey',width:20,height:20})
        this.$el.append(di);
      }
      this.delegateEvents();
      return this;
    }
  })

};