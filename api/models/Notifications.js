/**
* Notifications.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  	contract:{model:'Contract'},

  	days:{type:'integer'},

  	user:{model:'User'},

  	reason:{type:'string'}
  }
};

