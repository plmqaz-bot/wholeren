/**
* Contract.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/
var Q=require('q');
module.exports = {

  attributes: {
    id:{type: 'integer',
    autoIncrement: true,
    primaryKey: true,
    unique: true},

    contractCategory:{model:'ContractCategory',required:true,defaultsTo:1},

  	client:{model:'Client',required:true,defaultsTo:1},
  	
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

    contractUser:{model:"User"},

    endFee:{type:"boolean",defaultsTo:"false"},

    comment:{collection:"Comment"},

    expert:{model:'User'},

    sales:{model:'User'},

    teacher:{model:'User'},
        //transferService:{collection:'Service',via:'contract',dominate:true},

    //emergencyService:{collection:'Service',via:'contract',dominate:true},

    //acedemiarService:{model:'Service'},

    //visaService:{model:'Service'},
    service:{collection:'Service',via:'contract'}
  },
  beforeUpdate: function (attrs, next) {
    // update service separatly


    var serviceAttrs=attrs['service'];// This should be arry of service to add [transfer,study...]
    var toAdd=serviceAttrs||[];
    var toDel=[];
    var contractId=attrs['id'];
    delete attrs['service'];
    var types;
    var def=ServiceType.find();
    var exist;
    var def2=Contract.findOne({id:contractId}).populate('service');
    console.log("before find");
    Q.all([def,def2]).spread(function(types,contract){
      console.log("before process");
      console.log("exist data",contract);
/*        contract.service.forEach(function(item){
        var curServiceid=item.serviceType;
        var curServiceType=_.find(types,function(type){return type.id==curServiceid})||{};
        console.log(curServiceType.serviceType);
        if(curServiceType.serviceType){
          var todel=false;
          toAdd=_.reject(toAdd,function(serv){
            todel=!(serv==curServiceType.serviceType||serv==curServiceid);
            return !todel;
          });
        }else{
          toDel.add(curServiceid);
        }
      });*/
        console.log(toAdd,toDel);
    }).fail(function(err){console.log(err);next();});    
  }
};

