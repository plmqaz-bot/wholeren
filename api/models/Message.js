/**
* Message.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  	from:{model:'User',required:true},
  	to:{model:'User',required:true},
  	text:{type:'string'},
  	subject:{type:'string'},
  	replyTo:{model:'Message'},
  	read:{type:'boolean',required:true,defaultsTo:false},
  }
};

