/**
* Client.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

  	firstName:{type:'string',required:true},

  	lastName:{type:'string',required:true},

    chineseName:{type:'string',required:true},

  	primaryPhone:{type:'string',required:true},

  	secondaryPhone:{type:'string'},

  	primaryEmail:{type:'email',required:true},

  	secondaryEmail:{type:'email'},

    otherInfo:{type:'string'},

  	contract:{collection:'Contract',via:'client'}
  }
};

