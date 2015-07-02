/**
* ApplicationFile.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  	description:'string',
  	file:{model:'PublicFiles'},
  	application:{model:'Application'}
  }
};

