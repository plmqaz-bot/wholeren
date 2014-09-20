/**
* Degree.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    degree : { type: 'string',required:true  },
    contracts:{
    	collection:'Contract',
    	via:'degree'
    }
  }
};

