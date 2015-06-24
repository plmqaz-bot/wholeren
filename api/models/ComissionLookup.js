/**
* Comissionlookup.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  	rolename:{type:'string'},
  	lead:{model:'Lead'},
  	leadDetail:{model:'LeadDetail'},
  	salesGroup:{model:'SalesGroup'},
  	comission:{type:'float'},
  	alone:{type:'boolean'}
  }
};

