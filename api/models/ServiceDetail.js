/**
* ServiceDetail.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    service:{model:'Service'},
  	contract:{model:'Contract',required:true},
  	user:{model:'User'},
  	//assist:{model:'User'},
  	realServiceType:{model:'RealServiceType'},
  	serviceProgress:{model:'ServiceProgress',required:true,defaultsTo:1},
    degree:{model:'Degree'},
    correspondService:{model:'ServiceDetail'},
    level:{type:'int'},
  	indate:{type:'date'},
  	link:{type:'string'},
  	contractKey:{type:'string'},
  	cName:{type:'string'},
  	namekey:{type:'string'},
    deleted:{type:'boolean',defaultsTo:false}
  },
  beforeUpdate:function(attrs,next){
    if (attrs.serviceProgress==2){
      attrs.indate=new Date();
    }
    if(attrs.serviceProgress){
      ServiceProgressUpdate.create({serviceDetail:id,serviceProgress:attrs.serviceProgress});
    }
    next();
  },
  beforeCreate:function(attrs,next){
    if(attrs.serviceProgress){
      ServiceProgressUpdate.create({serviceDetail:id,serviceProgress:attrs.serviceProgress});
    }    
    next();
  }
};

