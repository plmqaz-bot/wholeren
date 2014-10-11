/**
* ServiceType.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  	serviceType:{type:'string',required:true,unique:true},
  	
  	services:{ collection:'Services', via:'serviceType'},

  	category:{type:'string'}

  }
};

