/**
* ContractUserRole.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  	user:{model:'User',required:true},

  	//contract:{model:'Contract',required:true},

  	service:{model:'Service',required:true},

  	salesRole:{model:'SalesRole'},

  	extra:{type:'float'}
  }
};

