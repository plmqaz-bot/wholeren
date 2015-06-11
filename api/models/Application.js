/**
* Application.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
	collageName:{type:'string'},

	appliedMajor:{type:'string'},

	writer:{model:'User'},

	service:{model:'ServiceDetail'},

	decided:{type:'boolean',defaultsTo:false},

	applied:{type:'boolean',defaultsTo:false},

	newDev:{type:'boolean',defaultsTo:false},

	succeed:{type:'boolean',defaultsTo:false},

	//appliedSemester:{type:'string', regex:'(spring|summer|fall|winter)201[0-9]'},
	appliedSemester:{type:'date'},
	studentCondition:{type:'string'}


  },
  beforeUpdate:function(attrs,next){
    if (attrs.decided==false){
      delete attrs['decided'];
    }
    if (attrs.applied==false){
      delete attrs['applied'];
    }
    if (attrs.succeed==false){
      delete attrs['succeed'];
    }
     next();
  },
};

