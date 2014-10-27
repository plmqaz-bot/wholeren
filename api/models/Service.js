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

  	progress:{type:'int'},

    serviceTeacher:{model:'User'},

    application:{collection:'Application', via:'service'},

    comment:{collection:'Comment',via:'service'},

    studentDestination:{type:'string'}


  }
};

