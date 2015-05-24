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
        for(var i=0,l=queryfields.length;i<l;i++){ //Every fields test need to be true
          if(queryfields[i].length>0){
            var pair=queryfields[i].split(':');
            if(pair.length<2) return false;
            var key=pair[0],value=pair[1];
            var isSelect=_.find(this.selectFields,{label:key});
            if(isSelect){
              var item=(_.find(isSelect['options'],function(e){if(e[1]==model.get(isSelect['name'])) return true;})||[""])[0];
              if(!m(item,value)) return false;
            }else{
              var columnfield=_.find(this.columns,{label:key});
              if(columnfield){
                if(!m(model.get(columnfield['name']+""),value)) return false;
              }else{
                return false;
              }                
            }
          }                 
        }
        return true;
      };
      function m(master,slave){
        if(slave=='null'){
          if((master||"").length==0) return true;
          else return false;
        }else if(slave=='!null'){
          if((master||"").length==0) return false;
          else return true;
        }else{
          if((master||"").indexOf(slave)<0) return false;
          else return true;
        }
      }
    },
});
module.exports=Backgrid;