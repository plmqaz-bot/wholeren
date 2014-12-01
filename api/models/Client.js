/**
* Client.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var uuid = require('node-uuid');
module.exports = {

  attributes: {
    id:{type: 'integer',
    autoIncrement: true,
    primaryKey: true,
    unique: true},

  	firstName:{type:'string'},

  	lastName:{type:'string'},

    chineseName:{type:'string',required:true},

  	primaryPhone:{type:'string'},

  	secondaryPhone:{type:'string'},

  	primaryEmail:{type:'string'},

  	secondaryEmail:{type:'email'},

    otherInfo:{type:'string'},

  	contract:{collection:'Contract',via:'client'},

    publicKey:{type:'string',unique:true},
  },
  beforeCreate: function (attrs, next) {
    attrs.publicKey=uuid.v1();
    next();
  },
};

