var Backbone=require('../backbone');
var _=require('lodash');
var $=require('../jquery');
var Backgrid=require('./backgrid')(_,Backbone);
Backgrid=require('./backgrid-text-cell')(_,Backgrid);
Backgrid=require('./backgrid-responsiveGrid')($,_,Backbone,Backgrid);
//Backgrid=require('./backgrid-select2-cell')(this,_,Backgrid);
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
              var mValue=model.get(isSelect['name']);
              if(Object.prototype.toString.call( mValue )==='[object Array]'){
                var toReturn=false;
                var modelFieldString=_.map(mValue,function(mv){
                  return (_.find(isSelect['options'],function(e){if(e[1]==mv) return true;})||[""])[0];
                }).join();
                if(!m(modelFieldString,value)) return false;
              }else{
                var item=(_.find(isSelect['options'],function(e){if(e[1]==mValue) return true;})||[""])[0];
                if(!m(item,value)) return false;
              }              
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
Backgrid.Extension.SimpleClientFilter=Backgrid.Extension.ClientSideFilter.extend({
  selectFields:[],
  makeMatcher: function (query) {
      var regexp = this.makeRegExp(query);
      return function (model) {
        var keys = this.fields || model.keys();
        for (var i = 0, l = keys.length; i < l; i++) {
          var key=keys[i];
          var isSelect=_.find(this.selectFields,{name:key});
          var fieldTestString="";
          if(isSelect){
              var mValue=model.get(key);
              if(Object.prototype.toString.call( mValue )==='[object Array]'){
                fieldTestString=_.map(mValue,function(mv){
                  return (_.find(isSelect['options'],function(e){if(e[1]==mv) return true;})||[""])[0];
                }).join();
              }else{
                fieldTestString=(_.find(isSelect['options'],function(e){if(e[1]==mValue) return true;})||[""])[0];
              }              
            }else{
              fieldTestString=model.get(key);                
            }
          if (regexp.test(fieldTestString + "")) return true;
        }
        return false;
      };
    }
});
module.exports=Backgrid;