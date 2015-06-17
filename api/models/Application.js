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

  appliedDegree:{model:'Degree'},

	writer:{model:'User'},

	service:{model:'ServiceDetail'},

	decided:{type:'boolean',defaultsTo:false},

	applied:{type:'boolean',defaultsTo:false},

  submitDate:{type:'date'},

	newDev:{type:'boolean',defaultsTo:false},

	succeed:{type:'boolean',defaultsTo:false},

  acceptedDate:{type:'date'},

	//appliedSemester:{type:'string', regex:'(spring|summer|fall|winter)201[0-9]'},
	appliedSemester:{type:'date'},
	studentCondition:{type:'string'}


  },
  beforeUpdate:function(attrs,next){
    if (attrs.decided==false){
      delete attrs['decided'];
    }
    if (attrs.applied==true){
     // delete attrs['applied'];
     attrs.submitDate=new Date();
    }
    if (attrs.succeed==true){
      //delete attrs['succeed'];
      attrs.acceptedDate=new Date();
    }
     next();
  },
};

