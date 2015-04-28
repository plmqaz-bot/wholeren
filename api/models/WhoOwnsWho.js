/**
* WhoOwnsWho.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  	puppet:{model:'User',required:true,defaultsTo:0},
  	boss:{model:'User',required:true,defaultsTo:0}
  }
};

