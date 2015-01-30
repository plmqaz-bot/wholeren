/**
* UserLevel.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  	userLevel:{type:'string',unique:true},

  	userComission:{type:'float',required:true,defaultsTo:1}
  }
};

