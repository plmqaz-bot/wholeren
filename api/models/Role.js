/**
* Role.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  	role:{type:"string",required:true,unique:true },

  	roleOnUser:{collection:'User',via:'role'},

  	roleOnContract:{collection:'ContractUserRole',via:'activeRole'}
  	
  }
};

