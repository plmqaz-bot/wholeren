/**
* ServiceType.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  	serviceType:{type:'string',required:true,unique:true},
  	
  	//service:{ collection:'Service', via:'serviceType'},
	  alias:{type:'string',required:true,unique:true},

  	category:{type:'string',required:true,defaultsTo:'Transfer',enum:['Transfer','Emerg','Study','Visa']}, // Only be Transfer, Emerg, Study, Visa

  	addApplication:{type:'boolean',required:true,defaultsTo:false},

  	comission:{type:'float',required:true,defaultsTo:0},

  	//price:{type:'float',defaultsTo:0},

    //contractCategory:{model:'ContractCategory'},

  }
};

