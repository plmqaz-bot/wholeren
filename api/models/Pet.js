/**
* Pet.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
	breed: 'string',
    type: 'string',
    name: 'string',

    // Add a reference to User
    owner: {
      collection: 'People',
      via:'pets'
    }
  }
};

