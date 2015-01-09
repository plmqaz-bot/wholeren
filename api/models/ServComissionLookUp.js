/**
* ServComissionLookUp.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  	serviceType:{model:'ServiceType',required:true},

  	servRole:{model:'ServRole',required:true},

  	servLevel:{model:'ServLevel'},

  	pricePerCol:{type:'float',required:true},

  	priceFlat:{type:'float',required:true},

  	serviceStatus:{model:'ServiceStatus',required:true},

  	statusportion:{type:'float'},

  	statusflat:{type:'float'}
  }
};

