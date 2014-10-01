/**
* Contract.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    contractCategory:{model:'ContractCategory',required:true,defaultsTo:1},

  	client:{model:'Client',required:true,defaultsTo:1},

  	service:{collection:'Service',via:'contract',dominate:true},
  	
  	lead:{model:'Lead'},
  	
  	leadName:{type:"string"},
  	
  	leadLevel:{model:"LeadLevel"},

  	status:{model:"Status"},
  	
  	salesFollowup:{type:"string"},
  	
  	salesRecord:{type:"string"},
  	
  	expertFollowup:{type:"string"},
  	
  	originalText:{type:"string"},
  	
  	country:{model:"Country",required:true,defaultsTo:1},
  	
  	validI20:{type:"boolean",required:true,defaultsTo: 'true'},
  	
  	gpa:{type:"float"},

  	toefl:{type:"float"},

  	age:{type:"int"},

    otherScore:{type:"string"},

  	degree:{model:"Degree",required:true,defaultsTo:1},

  	diagnose:{type:"string"},

  	contractSigned:{type:"date"},

  	contractPaid:{type:"date"},

  	contractPrice:{type:"float"},

  	contractDetail:{type:"string"},

  	previousSchool:{type:"string"},

    targetSchool:{type:"string"}, 

  	applicationFeePaid:{type:"boolean",required:true,defaultsTo:'false'},

  	paymentOption:{model:"PaymentOption"},

    contractUserRole:{collection:'ContractUserRole',via:'contract'},

    endFee:{type:"boolean",defaultsTo:"false"}
  },
};

