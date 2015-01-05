/**
* Role.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  	role:{type:"string",required:true,unique:true },
  	percent:{type:"number",required:true,defaultsTo:0},
  	flat:{type:"number",required:true,defaultsTo:0},	
  }
};

