var Backgrid=require('./backgrid-paginator.js');
var util=require('./util');
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