/**
* ContactInfo.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  	primaryCell:{type:'string'},
  	secondaryEmail:{type:'email'},
  	skype:'string',
  	qq:'string',
  	wechat:'string',
  	parentPhone:'string',
  	parentEmail:'string',
    emergencyContact:'string',
  	otherContact:'string',
  	service:{model:'ServiceDetail'},
  	client:{model:'Client'}
  }
};

