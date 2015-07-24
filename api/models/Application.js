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

	decidedDate:{type:'date'},

	applied:{type:'boolean',defaultsTo:false},

  submitDate:{type:'date'},

	newDev:{type:'boolean',defaultsTo:false},

	succeed:{type:'boolean',defaultsTo:false},

  acceptedDate:{type:'date'},

	//appliedSemester:{type:'string', regex:'(spring|summer|fall|winter)201[0-9]'},
	appliedSemester:{type:'date'},
	studentCondition:{type:'string'},
  deadline:{type:'date'},
  studentDecision:{type:'boolean'},

  },
  beforeUpdate:function(attrs,next){
    if (attrs.decided==false){
      delete attrs['decided'];
    }
    if (attrs.decided==true){
     // delete attrs['applied'];
     attrs.decidedDate=new Date();
    }else if (attrs.decided==false){
      attrs.decidedDate=null;
    }
    if (attrs.applied==true){
     // delete attrs['applied'];
     attrs.submitDate=new Date();
    }else if (attrs.applied==false){
      attrs.submitDate=null;
    }
    if (attrs.succeed==true){
      //delete attrs['succeed'];
      attrs.acceptedDate=new Date();
    }else if (attrs.succeed==false){
      attrs.acceptedDate=null;
    }
     next();
  },
};

