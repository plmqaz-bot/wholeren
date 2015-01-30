/**
* Goal.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  	user:{model:'User'},
  	month:{type:'integer'},
  	year:{type:'integer'},
  	transferSaleGoal:{type:'integer'},
  	transferExpGoal:{type:'integer'},
  	emergSaleGoal:{type:'integer'},
  	emergExpGoal:{type:'integer'},
    highSaleGoal:{type:'integer'},
    highExpGoal:{type:'integer'},
    studySaleGoal:{type:'integer'},
    studyExpGoal:{type:'integer'},
  	leadGoal:{type:'integer'},

  }
};

