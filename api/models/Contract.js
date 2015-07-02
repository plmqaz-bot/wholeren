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

    namekey:{type:'string'},

    salesGroup:{model:'SalesGroup'},
    
    contractCategory:{model:'ContractCategory'},

  	client:{model:'Client',required:true,defaultsTo:1},
  	
  	lead:{model:'Lead'},

    leadDetail:{model:'LeadDetail'},
  	
  	leadName:{type:"string"},
  	
  	leadLevel:{model:"LeadLevel"},

  	status:{model:"Status"},
  	
  	salesFollowup:{type:"string",maxLength: 1024, size:1024},
  	
  	salesRecord:{type:"string",maxLength: 1024, size:1024},

    expertContactDate:{type:"date"},
  	
  	expertFollowup:{type:"string",maxLength: 1024, size:1024},
  	
  	originalText:{type:"string", maxLength: 2048, size:2048},
  	
  	country:{model:"Country"},
  	
  	validI20:{type:"boolean",defaultsTo: 'true'},
  	
  	gpa:{type:"float",defaultsTo:null},

  	toefl:{type:"float"},

    sat:{type:"float"},

    gre:{type:"float"},

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

    targetSchoolDegree:{model:"Degree"},

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

    assisCont1:{model:'User'},
    assisCont2:{model:'User'},
    expert1:{model:'User'},
    expert2:{model:'User'},
    sales1:{model:'User'},
    sales2:{model:'User'},
    teacher:{model:'User'},
    //transferService:{collection:'Service',via:'contract',dominate:true},

    //emergencyService:{collection:'Service',via:'contract',dominate:true},

    //acedemiarService:{model:'Service'},

    //visaService:{model:'Service'},
    service:{collection:'Service',via:'contract'},
    deleted:{type:'boolean',defaultsTo:'false'},
  },
  /* If this is status 5, meaning contract is signed, in case they forgot to enter, automatically create one
  */
  beforeUpdate:function(attrs,next){
    if(attrs.status){
      if(attrs.status==5){
        attrs.contractSigned=new Date();
      }
    }
    if(attrs.hasOwnProperty('createdAt')){
      if(!attrs['createdAt']){
        delete attrs['createdAt'];
      }else {
        var d=new Date(attrs['createdAt']);
        if(isNaN(d.getTime())){
          delete attrs['createdAt'];
        }
      }
    }
    if(attrs.hasOwnProperty('status')){
      var criteria=this.update.arguments[0];
      Promise.all([Contract.findOne(criteria).populate('client').populate('status'),Status.find()]).spread(function(c,s){
        console.log(c);
        if(c.lead==4||c.lead=10){
          var reason="亲爱的敬爱的校代管理层：<br> 您的学生，"+(c.client||{}).chineseName+" 需要您的注意。 提醒原因:\n <br> 校代leads状态发生变化. \n<br> \
            原状态: "+c.status.status+". 现状态: "+(_.find(s,{id:attrs['status']})||{}).status+" \n<br>";
          EmailService.sendEmail({
            to : "Channel@wholeren.com",
            //to : 'han.lai321@gmail.com',
            from : "obama@whitehouse.gov",
            subject : "Reminder: ",
            //html:"亲爱的敬爱的销售老师："+options.nickname+"<br> 您的学生，"+options.client+" 又到了该您发邮件的时候啦。 提醒原因 "+options.reason+"!";
            html:reason
          }).error(function(err){
            sails.log.error("Error occurred during checking reminders: ",err);
          }); 
        }
      })
    }
    
    next();
  },

};

