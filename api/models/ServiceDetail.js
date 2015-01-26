/**
* ServiceDetail.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  	service:{model:'Service',required:true},
  	user:{model:'User'},
  	servRole:{model:'ServRole'},
    servLevel:{model:'ServLevel'},
  }
};

