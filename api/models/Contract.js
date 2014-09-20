/**
* Contract.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  	serviceType:{type:"string"},

  	client:{model:'Client',required:true},

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

  	degree:{model:"Degree",required:true},

  	diagnose:{type:"string"},

  	contractSigned:{type:"datetime"},

  	contractPaid:{type:"datetime"},

  	contractPrice:{type:"float"},

  	contractDetail:{type:"string"},

  	previousSchool:{type:"string"},

  	applicationFeePaid:{type:"boolean",required:true,defaultsTo:'false'},

  	paymentOption:{model:"PaymentOption"},
  },
  getSalesListByUser:function(id){

  }
};

