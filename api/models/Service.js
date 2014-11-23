/**
* Service.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {  	
  	contract:{model:'Contract'},

  	serviceType:{model:'ServiceType'},

  	serviceStatus:{model:'ServiceStatus'},

  	progress:{type:'int'},

    serviceTeacher:{model:'User'},

    application:{collection:'Application', via:'service'},

    comment:{collection:'Comment',via:'service'},

    studentDestination:{type:'string'},

	step1:{type:'date'},

	step2:{type:'date'},
  }
};

