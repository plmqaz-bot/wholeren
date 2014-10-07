/**
* Service.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {  	
  	//contract:{model:'Contract',via:'service'},

    serviceTeacher:{collection:'User',via:'service'}
  }
};

