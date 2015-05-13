/**
* StaticLink.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  	name:{type:'string'},
  	fileCategory:{model:'DocType'},
  	user:{model:'User',required:true},
  	role:{model:'Role'},
  	link:{type:'string'},
  }
};

