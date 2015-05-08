var Backbone=require('../backbone');
var _=require('lodash');
var $=require('../jquery');
var Backgrid=require('./backgrid')(_,Backbone);
Backgrid=require('./backgrid-text-cell')(_,Backgrid);
Backgrid=require('./backgrid-responsiveGrid')($,_,Backbone,Backgrid);
Backgrid=require('./backgrid-paginator')(_,Backbone,Backgrid);
Backgrid=require('./backgrid-filter')(_,Backbone,Backgrid,require('lunr'));
Backgrid=require('./backgrid-moment-cell')(_,Backgrid,require('moment'));
Backgrid.Extension.AlmightyFilter=Backgrid.Extension.ClientSideFilter.extend({
	selectFields:[],
	makeMatcher: function (query) {
      var regexp = this.makeRegExp(query);
      return function (model) {
        var keys = this.fields || model.keys();
        for (var i = 0, l = keys.length; i < l; i++) {
        	var isSelect=_.find(this.selectFields,{name:keys[i]});
        	if(isSelect){ //If it is a select
        		var item=(_.find(isSelect['options'],function(e){if(e[1]==model.get(keys[i])) return true;})||[])[0];
				if(regexp.test(item)) return true;
        	}else{
        		if (regexp.test(model.get(keys[i]) + "")) return true;
        	}
          }
        return false;
      };
    },
});
module.exports=Backgrid;