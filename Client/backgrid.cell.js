var Backgrid=require('./backgrid-paginator.js');
var util=require('./util');
var _=require('lodash');
module.exports={
	DeleteCell:Backgrid.Cell.extend({
            template: _.template("<a>Delete</a>"),
            events: {
              "click a": "deleteRow"
            },
            deleteRow: function (e) {
              e.preventDefault();
              this.model.destroy({
                success:function(model){
                    Wholeren.notifications.addItem({
                        type: 'success',
                        message: "Delete Successful",
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
			"click button":"action",
		},
		action:function(e){

		},
		render: function () {
              this.$el.html('<button>'+this.cellText+'</button>');
              this.delegateEvents();
              return this;
        }
	})

};