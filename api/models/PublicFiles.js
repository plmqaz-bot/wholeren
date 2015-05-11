/**
* PublicFiles.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  	filename:{type:'string',required:true},
  	path:{type:'string',required:true},
  	uploadedBy:{model:'User',required:true},
  	fileCategory:{type:'int',defaultsTo:1}
  }
};

