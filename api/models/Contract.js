/**
* Contract.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var Promise=require('bluebird');
module.exports = {
  types:{
    size:function(){return true;}
  },
  attributes: {
    id:{type: 'integer',
    autoIncrement: true,
    primaryKey: true,
    unique: true},

    contractCategory:{model:'ContractCategory'},

  	client:{model:'Client',required:true,defaultsTo:1},
  	
  	lead:{model:'Lead'},
  	
  	leadName:{type:"string"},
  	
  	leadLevel:{model:"LeadLevel"},

  	status:{model:"Status"},
  	
  	salesFollowup:{type:"string",maxLength: 1024, size:1024},
  	
  	salesRecord:{type:"string",maxLength: 1024, size:1024},

    expertContactDate:{type:"date"},
  	
  	expertFollowup:{type:"string",maxLength: 1024, size:1024},
  	
  	originalText:{type:"string", maxLength: 2048, size:2048},
  	
  	country:{model:"Country"},
  	
  	validI20:{type:"boolean",required:true,defaultsTo: 'true'},
  	
  	gpa:{type:"float"},

  	toefl:{type:"float"},

  	age:{type:"string"},

    otherScore:{type:"string"},

  	degree:{model:"Degree"},

    major:{type:"string"},

  	diagnose:{type:"string"},

  	contractSigned:{type:"date"},

  	contractPaid:{type:"date"},

  	contractPrice:{type:"float"},

  	contractDetail:{type:"string"},

  	previousSchool:{type:"string"},

    targetSchool:{type:"string"}, 

  	applicationFeePaid:{type:"boolean",required:true,defaultsTo:'false'},

  	paymentOption:{model:"PaymentOption"},

    contractUser:{model:"User"},

    endFeeDue:{type:"boolean",defaultsTo:"false"},

    endFee:{type:"boolean",defaultsTo:"false"},

    comment:{collection:"Comment",via:'contract'},

    assistant1:{model:'User'},
    assistant2:{model:'User'},
    assistant3:{model:'User'},
    assistant4:{model:'User'},

    assisCont:{model:'User'},

    expert:{model:'User'},

    sales:{model:'User'},

    teacher:{model:'User'},
    //transferService:{collection:'Service',via:'contract',dominate:true},

    //emergencyService:{collection:'Service',via:'contract',dominate:true},

    //acedemiarService:{model:'Service'},

    //visaService:{model:'Service'},
    service:{collection:'Service',via:'contract'}
  },
  beforeUpdate2: function (attrs, next) {
    // update service separatly
    var serviceAttrs=attrs['service'];// This should be arry of service to add [transfer,study...]
    if(!serviceAttrs) return next();
    var toAdd=[]; // Will store the id of serviceTypes that need to be created. 
    var toKeep=[]; // This store the service id that already exist. 
    var toDel=[]; // Will store the id of services that should be deleted from contract;
    var contractId=attrs['id'];
    delete attrs['service'];

    var types;
    var def=ServiceType.find();
    var exist;
    var def2=Contract.findOne({id:contractId}).populate('service');
    console.log("before find");
    Promise.all([def,def2]).spread(function(types,contract){
        contract.service.forEach(function(item){
        var curServiceTypeid=item.serviceType;
        var curServiceType=_.find(types,function(type){return type.id==curServiceTypeid})||{};
        console.log(curServiceType.serviceType);
        if(curServiceType.serviceType){
          var overlap=false;
          serviceAttrs=_.reject(serviceAttrs,function(serv){
              if(serv==curServiceType.serviceType||serv==curServiceTypeid){// If the service type overlaps with the service to add, then don't do anything 
                overlap=true;
                return true;
              }else{
                return false;
              }
          });
          if(overlap){
            toKeep.push(item.id);
          }else{ // Not overlap, so this service type need to be deleted
            toDel.push(curServiceTypeid);
          }
        }else{
          toDel.push(curServiceTypeid);
        }
      });
    }).then(function(){
      console.log("to add service type are ", serviceAttrs);
      console.log("to keep service id are ", toKeep);
      console.log("to del service are ",toDel);
    }).error(function(err){console.log(err);});    
  },

};

