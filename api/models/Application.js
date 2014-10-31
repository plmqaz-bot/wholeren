/**
* Application.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
	collageName:{type:'string'},

	writer:{model:'User'},

	service:{model:'Service'},

	newDev:{type:'boolean',defaultsTo:false},

	succeed:{type:'boolean',defaultsTo:false},

	appliedSemester:{type:'string'},

	studentCondition:{type:'string'},

	step1:{type:'string'},

	step2:{type:'string'},
  }
};

