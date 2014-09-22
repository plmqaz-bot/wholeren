(function(){
	var $ = require('jquery');
    var Backbone = require('backbone');
    var _ = require('lodash');
    var Handlebars = require('handlebars');
Backbone.$ = $;
global.myApp={
		Views:{},
		Models:{},
        Collections: {},
        notifications:{},
		router:null
    };
    _.extend(myApp, Backbone.Events);
var Router=require('./Router');
var Models=require('./models');
var View=require('./View');
    
var init=function(){
        myApp.router = new Router();
        myApp.notifications = new View.Notification.Collection({ model: [] });
        
	Backbone.history.start({
		pushState:true,
		hashChange:false,
        root: '/admin/'
	});
};
init();
var switched = false;
  var updateTables = function() {
    if (($(window).width() < 767) && !switched ){
      switched = true;
      $("table.responsive").each(function(i, element) {
        splitTable($(element));
      });
      return true;
    }
    else if (switched && ($(window).width() > 767)) {
      switched = false;
      $("table.responsive").each(function(i, element) {
        unsplitTable($(element));
      });
    }
  };
   
  $(window).load(updateTables);
  $(window).on("redraw",function(){switched=false;updateTables();}); // An event to listen for
  $(window).on("resize", updateTables);
   
    
    function splitTable(original)
    {
        original.wrap("<div class='table-wrapper' />");
        
        var copy = original.clone();
        copy.find("td:not(:first-child), th:not(:first-child)").css("display", "none");
        copy.removeClass("responsive");
        
        original.closest(".table-wrapper").append(copy);
        copy.wrap("<div class='pinned' />");
        original.wrap("<div class='scrollable' />");

    setCellHeights(original, copy);
    }
    
    function unsplitTable(original) {
    original.closest(".table-wrapper").find(".pinned").remove();
    original.unwrap();
    original.unwrap();
    }

  function setCellHeights(original, copy) {
    var tr = original.find('tr'),
        tr_copy = copy.find('tr'),
        heights = [];

    tr.each(function (index) {
      var self = $(this),
          tx = self.find('th, td');

      tx.each(function () {
        var height = $(this).outerHeight(true);
        heights[index] = heights[index] || 0;
        if (height > heights[index]) heights[index] = height;
      });

    });

    tr_copy.each(function (index) {
      $(this).height(heights[index]);
    });
  }

}());