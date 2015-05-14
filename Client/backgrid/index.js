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
      var queryfields=query.split('&');
      return function (model) {
        var keys = this.fields || model.keys();
        // for (var i = 0, l = keys.length; i < l; i++) {
        // 	var isSelect=_.find(this.selectFields,{name:keys[i]});
        // 	if(isSelect){ //If it is a select
        // 		var item=(_.find(isSelect['options'],function(e){if(e[1]==model.get(keys[i])) return true;})||[])[0];
				    // if(regexp.test(item)) return true;
        // 	}else{
        // 		if (regexp.test(model.get(keys[i]) + "")) return true;
        // 	}
        // }
        //var result=true;
        for(var i=0,l=queryfields.length;i<l;i++){ //Every fields test need to be true
          if(queryfields[i].length>0){
            var pair=queryfields[i].split(':');
            if(pair.length<2) return false;
            var key=pair[0],value=pair[1];
            var isSelect=_.find(this.selectFields,{label:key});
            if(isSelect){
              var item=(_.find(isSelect['options'],function(e){if(e[1]==model.get(isSelect['name'])) return true;})||[""])[0];
              if(item.indexOf(value)<0) return false;
            }else{
              var columnfield=_.find(this.columns,{label:key});
              if(columnfield){
                if((model.get(columnfield['name'])+"").indexOf(value)<0) return false;  
              }else{
                return false;
              }                
            }
          }                 
        }
        return true;
      };
    },
});
module.exports=Backgrid;