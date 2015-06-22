/**
* Servappcomissionlookup.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  	realServiceType:{model:'RealServiceType'},
  	decideH:'float',
  	decideCC:'float',
  	decideU:'float',
  	appliedH:'float',
  	appliedCC:'float',
  	appliedU:'float',
    perAppIfAcceptH:'float',
    perAppIfAcceptCC:'float',
  	perAppIfAcceptU:'float',
    flatIfAppcepted:'float',
    level:'int',
  }
};

