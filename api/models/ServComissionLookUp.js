/**
* ServComissionLookUp.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  	realServiceType:{model:'RealServiceType',required:true},

  	servLevel:{type:'int'},

    degree:{model:'Degree'},

  	//pricePerApplication:{type:'float',required:true},

  	//pricePerApplicationAfterAccept:{type:'float',required:true},

  	serviceProgress:{model:'ServiceProgress',required:true},

    score:'float'
  	// statusportion:{type:'float'},

  	// statusflat:{type:'float'}

  }
};

