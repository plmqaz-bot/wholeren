var Backgrid=require('./backgrid/index.js');
var util=require('./util');
var _=require('lodash');
module.exports={
	DeleteCell:Backgrid.Cell.extend({
    template: _.template("<a>Delete/Undelete</a>"),
    events: {
      "click a": "deleteRow"
    },
    deleteRow: function (e) {
      e.preventDefault();
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
    return Backgrid.SelectCell.extend({
      
      optionValues:function(){
        return [options];
      },
      formatter:_.extend({}, Backgrid.SelectFormatter.prototype, {
        toRaw: function (formattedValue, model) {
          return formattedValue == null ? null: parseInt(formattedValue);
        }
      })
    });
  }

};