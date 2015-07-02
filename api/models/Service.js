/**
* Service.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {  	
    client:{model:'Client'},
    cName:{type:'string'},
    lName:{type:'string'},
    fName:{type:'string'},
    namekey:{type:'string'},
    contractKey:{type:'string'},
    generated:{type:'boolean',defaultsTo:false},
    indate:{type:'date'},
  	contract:{model:'Contract',required:true,defaultsTo:0},

  	serviceType:{model:'ServiceType'},

  	serviceProgress:{model:'ServiceProgress',required:true,defaultsTo:1},

    //application:{collection:'Application', via:'service'},

    comment:{collection:'Comment',via:'service'},

    studentDestination:{type:'string'},

	step1:{type:'date'},

	step2:{type:'date'},

  price:{type:'float',required:true,defaultsTo:0},
    link:{type:'string'}
  },

};


