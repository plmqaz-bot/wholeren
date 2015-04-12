/**
* ServiceTypeGroup.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  	groupService:{model:'Service',required:true},
  	service:{model:'Service',required:true}
  }
};

