/**
* ServiceComission.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  	service:{model:'Service'},
  	user:{model:'User'},
  	startprogress:{model:'ServiceStatus'},
  	endprogress:{model:'ServiceStatus'},
  	year:{type:'int'},
  	month:{type:'int'},
  	extra:{type:'float'}
  }
};

