/**
* Invoice.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  	contract:{model:'Contract'},

  	nontaxable:{type:'float',defaultsTo:0},

  	remittances:{type:'float',defaultsTo:0},

  	other:{type:'float',defaultsTo:0},

  	receivedTotal:{type:'float',defaultsTo:0},

  	receivedNontaxable:{type:'float',defaultsTo:0},

  	receivedOther:{type:'float',defaultsTo:0},

    receivedRemittances:{type:'float',defaultsTo:0},

  	receivedDate:{type:'Date'},

    depositAccount:{model:'DepositAccount'},

    paymentOption:{model:'PaymentOption'}

  }
};

