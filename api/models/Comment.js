/**
* Comment.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  	comment:{type:"string"},
  	contract:{model:"Contract"},
  	service:{model:'Service'},
  	application:{model:'Application'}
  }
};

