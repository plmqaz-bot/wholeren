var Backbone = require('./backbone');
//var PageableCollection=require('backbone.paginator');
$ = require('./jquery');
var util=require('./util.js');
Backbone.$ = $;
Models = {};
Collections = {};
var _=require('lodash');
var simpleModel=Backbone.Model.extend({
        urlRoot:function(){
            var base=this._url||_.result(this.collection,'_url')||_.result(this.collection,'url');
            if((this.collection||{}).pageableCollection){
                base=base||_.result(this.collection.pageableCollection,'url');
            }
            if(base.indexOf('?')>0){
                return base.substring(0,base.indexOf('?'));
            }else{
                return base;
            }
        },
        initialize:function(attrs,options){
            this._url=(options||{})._url;
        },
        parse:function(response){
            // if(response.createdAt){
            //     if(!isNaN(new Date(response.createdAt).getTime())){
            //         response.createdAt=new Date(response.createdAt);
            //     }
            // }
            return response;
        },
        toString:function(){
            var toReturn='';
            for (var i in this.attributes){
                if(i!='id'&&i!='createdAt'&&i!='updatedAt'){
                    toReturn+=this.attributes[i];
                }
            }
            return toReturn;
        }
    });
var syncModel=simpleModel.extend({
    initialize:function(attrs,options){
        options=options||{};
        this._url=options._url;
        delete options['_url'];
        Backbone.Model.prototype.initialize.apply(this, arguments);
        this.on("change", function (model, options) {
            if (options && options.save === false) return;
            var prevAttr=model._previousAttributes;
            model.save(model.changed,{patch:true,error:function(model,response){
                model.set(prevAttr,{save:false});
                util.handleRequestError(response);
            },save:false});
        });
    },
    parse:function(response){
        return response;
    }
});
var simpleCollection=Backbone.Collection.extend({
        model: simpleModel,
        param:{},
        url:function(){
            var toReturn=this._url;
            var param="";
            console.log(this.param);
            for (var key in this.param){
                if(this.param.hasOwnProperty(key)&&this.param[key]!=null){
                    param+=key+"="+this.param[key]+"&";
                }
            }
            if(param){
                toReturn+="?"+param
            }

            return toReturn;
        },
        initialize:function(models,options){
            options=options||{};
            this.name=options.name;
            this._url=options.url;
            delete options.name;
            delete options.url;
        },
        setGetParameter:function(options){
            this.param=options;
        }
    });
var syncCollection=simpleCollection.extend({
    model:syncModel
});

Models={
    simpleModel: simpleModel,
    syncModel:syncModel,
    // Contract : Backbone.Model.extend({
    // idAttribute: "id",
    // initialize:function(options){
    //     this.set('createdAt',new Date(this.get('createdAt')));
    // },
    //     urlRoot:'/Contract/'
    // }),
    // Client:Backbone.Model.extend({
    //     urlRoot:'/Client/'
    // }),
    // ContractCategory:Backbone.Model.extend({
    //     urlRoot:'/ContractCategory/'

    // }),
    // Country:Backbone.Model.extend({
    //     urlRoot:'/Country/'

    // }),
    // Degree:Backbone.Model.extend({
    //     urlRoot:'/Degree/'

    // }),
    // Lead:Backbone.Model.extend({
    //     urlRoot:'/Lead/'

    // }),
    // LeadLevel:Backbone.Model.extend({
    //     urlRoot:'/LeadLevel/'

    // }),
    // PaymentOption:Backbone.Model.extend({
    //     urlRoot:'/PaymentOption/'

    // }),
    // Status:Backbone.Model.extend({
    //     urlRoot:'/Status/'

    // }),
    // ServiceType:Backbone.Model.extend({
    //     urlRoot:'/ServiceType/'
    // }),
    // Service : simpleModel.extend({
    // initialize:function(attrs,options){
    //     this.set('createdAt',new Date(this.get('createdAt')));
    //     if((this.get('contract')||{})['contractSigned']){
    //         var thiscontract=this.get('contract');
    //         thiscontract['contractSigned']=new Date((this.get('contract')||{})['contractSigned'])||"";
    //         this.set('contract',thiscontract);
    //     }
    // }
    // }),
    // ServiceProgress:Backbone.Model.extend({
    //     urlRoot:'/serviceProgress/'
    // }),
    // SalesComission: Backbone.Model.extend({
    //     initialize: function () {
    //     Backbone.Model.prototype.initialize.apply(this, arguments);
    //     this.on("change", function (model, options) {
    //         if (options && options.save === false) return;
    //         model.save();
    //     });
    //     },
    //     urlRoot:'/SalesComission/'
    // }),
    // Comission:Backbone.Model.extend({
    //     urlRoot:function(){
    //         var base=_.result(this.collection,'url')||urlError();
    //         if(base.indexOf('?')>0){
    //             return base.substring(0,base.indexOf('?'));
    //         }else{
    //             return base;
    //         }
    //     },
    //     initialize: function (options) {
    //     Backbone.Model.prototype.initialize.apply(this, arguments);
    //     this.on("change", function (model, options) {
    //         if (options && options.save === false) return;
    //         model.save(null,{save:false});
    //     });
        
    //     },        
    // }),
    // Accounting:Backbone.Model.extend({
    //     urlRoot:'/Accounting/',
    //     initialize: function (options) {
    //     Backbone.Model.prototype.initialize.apply(this, arguments);
    //     this.on("change", function (model, options) {
    //         if (options && options.save === false) return;
    //         model.save(null,{save:false});
    //     });
    //     },        
    // }),
    // User:Backbone.Model.extend({
    //     urlRoot:'/User/'
    // }),
    // Application:Backbone.Model.extend({
    //     urlRoot:'/Application/'
    // }),
    // Role:Backbone.Model.extend({
    //     urlRoot:'/Role/'
    // }),
    // Comment:Backbone.Model.extend({
    //     urlRoot:'/Comment/'
    // }),
    // UserLevel:Backbone.Model.extend({
    //     urlRoot:'/userLevel/',
    //     initialize: function (options) {
    //     Backbone.Model.prototype.initialize.apply(this, arguments);
    //     this.on("change", function (model, options) {
    //         if (options && options.save === false) return;
    //         model.save(null,{save:false});
    //     });
    //     },
    // }),
    // Reminder:Backbone.Model.extend({
    //     urlRoot:'/Notifications/',
    //     initialize: function (options) {
    //     Backbone.Model.prototype.initialize.apply(this, arguments);
    //     this.on("change", function (model, options) {
    //         if (options && options.save === false) return;
    //         model.save(null,{save:false});
    //     });
    //     this.contract=this.contract||{};
    //     this.contract.client=this.contract.client||{};
    //     this.clientName=this.contract.client.chineseName;
    //     }, 
    // }),
    // ServiceDetail:Backbone.Model.extend({
    //     urlRoot:'/ServiceDetail/',
    // }),
    // Invoice:syncModel.extend({
    //     setContract:function(options){
    //         this.set('contract',options.contract,{save:false});
    //     }
    // }) ,
    // ServiceInvoice:Backbone.Model.extend({
    //     urlRoot:'/ServiceInvoice/',
    //     initialize: function (options) {
    //         Backbone.Model.prototype.initialize.apply(this, arguments);
    //         this.on("change", function (model, options) {
    //             if (options && options.save === false) return;
    //             model.save(null,{save:false});
    //         });
    //     }, 
        
    // })  

};
// var sortableCollection=Backbone.Collection.extend({
//     sortAttr:{
//             attribute:'client',
//             nested:'firstName',
//             asec:true
//         },
//         pagesize:100,

//         comparator:function(A,B){
//             var aAttr='';
//             var bAttr='';
//             aAttr=A.get(this.sortAttr['attribute'])||{};
//             aAttr=aAttr[this.sortAttr['nested']]||aAttr;
//             bAttr=B.get(this.sortAttr['attribute'])||{};
//             bAttr=bAttr[this.sortAttr['nested']]||bAttr;
//             //if(B.get(this.sortAttr['attribute'])){
//             //    bAttr=B.get(this.sortAttr['attribute'])[this.sortAttr];
//             //}
//             if(aAttr>bAttr){
//                 if(this.sortAttr.asec)return -1;
//                 else return 1;
//             }else if(aAttr<bAttr){
//                 if(this.sortAttr.asec)return 1;
//                 else return -1;
//             }else{
//                 return 0;
//             }
//         },
//         selectedStrat:function(options){
//             var sortAttr=options.sortAttr;
//             var dir=options.direction;
//             //this.sortAttr=sortAttr;
//             var sub=sortAttr.indexOf('.');
//             if(sub>0){
//                 this.sortAttr['attribute']=sortAttr.substring(0,sub);
//                 this.sortAttr['nested']=sortAttr.substring(sub+1);
//             }else{
//                 this.sortAttr['attribute']=sortAttr;
//                 this.sortAttr['nested']='';
//             }
//             this.sortAttr['asec']=dir=="asec";
//         },
//         getPage:function(pageNum){
//             try{
//                 var pn=parseInt(pageNum);
//                 return this.slice((pn-1)*this.pagesize,(pn)*this.pagesize);
//             }catch(e){
//                 var pn=1;
//                 return this.slice((pn-1)*this.pagesize,(pn)*this.pagesize);
//             }
//         },
//         getTotalPage:function(){
//             return Math.ceil(this.length/this.pagesize);
//         },
//         complexFilter:function(filterElements){
//             fs=filterElements;
//             function match(v1,v2,ele){
//                 if(v1==v2){
//                     return true;
//                 }
//                 if(!v1||!v2){
//                     return false;
//                 }
//                 try{
//                     v1=JSON.parse(v1);
//                 }catch(e){
//                     v1=v1;
//                 }
//                 try{
//                     v2=JSON.parse(v2);
//                 }catch(e){
//                     v2=v2;
//                 }
//                 if(typeof v1 =='object'){
//                     v1=v1.id;
//                     v2=parseInt(v2);
//                     if(v1==v2) return true;
//                 }
//                 if(typeof v1=='string'){
//                     if(v1.indexOf(v2)!=-1){
//                         return true;
//                     }
//                 }
//                 return false;
//             }
//             var filteredArray= this.filter(function(eachone){
//                 var obj=eachone.toJSON();
//                 var filteredout=false;
//                 _.forEach(fs,function(ele){
//                     var attr=ele.name;
//                     var value=ele.value;
//                     if(!value) return; // return if the filter is null
//                     try{
//                         value=JSON.parse(value);
//                     }catch(e){
//                          // if value cannot be parsed, then it is a string, not json;
//                     }
//                     var sub=attr.indexOf('.');
//                     var tocomp;
//                     if(sub>0){
//                         tocomp=obj[attr.substring(0,sub)]||{};
//                         attr=attr.substring(sub+1);
//                     }
//                     if(tocomp instanceof Array&&tocomp.length>0){
//                         tocomp.forEach(function(e){
//                             var c=e[attr];
//                             if(c!==undefined){
//                                 if(value instanceof Array){ // If it is array, see if tocomp is in the array. 
//                                     var ind=_.findIndex(value,function(v){
//                                         return match(c,v,ele);
//                                     });
//                                     if(ind<0) e.display=false;
//                                 }else{
//                                     if(!match(c,value,ele)){
//                                         e.display=false;
//                                     }
//                                 }
//                             }else{
//                                 e.display=false;
//                             }
//                         });
//                     }else{
//                         tocomp=obj[attr];
//                         if(tocomp!==undefined){
//                             if(value instanceof Array){ // If it is array, see if tocomp is in the array. 
//                                 var ind=_.findIndex(value,function(v){
//                                     return match(tocomp,v,ele);
//                                 });
//                                 if(ind<0) filteredout=true;
//                             }else{
//                                 if(!match(tocomp,value,ele)){
//                                     filteredout=true;
//                                 }
//                             }
//                         }else{
//                             filteredout=true;
//                         }
//                     }                               
                    
//                 });
//                 return !filteredout;
//             });
//             var toReturn= new this.constructor(filteredArray,{sortAttr:this.sortAttr,startDate:this.startDate,endDate:this.endDate});
//             return toReturn;
            
//         }
// });
Collections={
    SimpleCollection:simpleCollection,
    SimpleSyncCollection:syncCollection,
    SimplePageCollection:Backbone.PageableCollection.extend({
        model: syncModel,
        param:{},
        url:function(){
            var toReturn=this._url;
            var param="";
            for (var key in this.param){
                if(this.param.hasOwnProperty(key)&&this.param[key]!=null){
                    param+=key+"="+this.param[key]+"&";
                }
            }
            if(param){
                toReturn+="?"+param
            }

            return toReturn;
        },
        initialize:function(models,options){
            this.mode="client";
            this.state={pageSize:20};
            options=options||{};
            this.name=options.name;
            this._url=options.url;
            delete options.name;
            delete options.url;
        },
        setGetParameter:function(options){
            this.param=options;
        }
    }),
    Contract :Backbone.PageableCollection.extend({
        model: Models.syncModel,
        
        _url: '/Contract/',
        url: function(){
            if(this.whereclaus){
                return '/Contract/?where='+this.whereclaus();
            }else{
                return '/Contract/';
            }
        },
        initialize:function(models,options){
            options=options||{};
            this.startDate=options.startDate||"09-01-2014";
            this.endDate=options.endDate||"";
            this.mode="client";
            this.state={pageSize:20};
            this.field='createdAt';
        },
        setdate:function(options){
            this.startDate=options.startDate;
            this.endDate=options.endDate;
        },
        whereclaus:function(){
            var where={};
            try{
                if(this.startDate){
                    where[this.field]=where[this.field]||{};
                    where[this.field]['>']=new Date(this.startDate);
                }
                if(this.endDate){
                    where[this.field]=where[this.field]||{};
                    where[this.field]['<']=new Date(this.endDate);
                }
                if(this.deleted==true){
                    where.deleted=true;
                }
                if(where[this.field]||where.deleted!=undefined){
                    return JSON.stringify(where);
                }
            }catch(e){
                return "{}";
            }
            return "{}";
        },

    }),
    ShortContract:Backbone.PageableCollection.extend({
        model: Models.syncModel,
        
        _url: '/ShortContract/',
        url: function(){
            if(this.whereclaus){
                return '/ShortContract/?where='+this.whereclaus();
            }else{
                return '/ShortContract/';
            }
        },
        initialize:function(models,options){
            options=options||{};
            this.startDate=options.startDate||"09-01-2014";
            this.endDate=options.endDate||"";
            this.mode="client";
            this.state={pageSize:20};
        },
        setdate:function(options){
            this.startDate=options.startDate;
            this.endDate=options.endDate;
        },
        whereclaus:function(){
            var where={};
            try{
                if(this.startDate){
                    where.contractSigned=where.contractSigned||{};
                    where.contractSigned['>']=new Date(this.startDate);
                }
                if(this.endDate){
                    where.contractSigned=where.contractSigned||{};
                    where.contractSigned['<']=new Date(this.endDate);
                }
                if(this.deleted==true){
                    where.deleted=true;
                }
                if(where.contractSigned){
                    return JSON.stringify(where);
                }
            }catch(e){
                return "{}";
            }
            return "{}";
        },

    }),
    // Client : Backbone.Collection.extend({
    //     model: Models.simpleModel,
    //     name:'client',
    //     url: '/Client/'
    // }),
    // ContractCategory:Backbone.Collection.extend({
    //     model: Models.simpleModel,
    //     name:'contractCategory',
    //     url:'/ContractCategory/'

    // }),
    // Country:Backbone.Collection.extend({
    //     name:'country',
    //     model:Models.simpleModel,
    //     url:'/Country/'

    // }),
    // Degree:Backbone.Collection.extend({
    //     name:'degree',
    //     model:Models.simpleModel,
    //     url:'/Degree/'

    // }),
    // Lead:Backbone.Collection.extend({
    //     name:'lead',
    //     model:Models.simpleModel,
    //     url:'/Lead/'

    // }),
    // LeadLevel:Backbone.Collection.extend({
    //     name:'leadLevel',
    //     model:Models.simpleModel,
    //     url:'/LeadLevel/'

    // }),
    // PaymentOption:Backbone.Collection.extend({
    //     name:'paymentOption',
    //     model:Models.simpleModel,
    //     url:'/PaymentOption/'

    // }),
    // Status:Backbone.Collection.extend({
    //     name:'status',
    //     model:Models.simpleModel,
    //     url:'/Status/'
    // }),
    // ServiceType:Backbone.Collection.extend({
    //     name:'serviceType',
    //     model:Models.simpleModel,
    //     url:'/ServiceType/'
    // }),
    // ServiceProgress:Backbone.Collection.extend({
    //     name:'serviceProgress',
    //     model:Models.simpleModel,
    //     url:'/ServiceProgress/'
    // }),
    // User:Backbone.PageableCollection.extend({
    //     model: Models.syncModel,
    //     _url: '/User/',
    //     url:function(){
    //         var toReturn='/User/';
    //         if(this.deleted!=undefined){
    //             toReturn+='?active='+!this.deleted;
    //         }
    //         return toReturn;
    //     },
    //     initialize:function(models,options){
    //         this.mode="client";
    //         this.state={pageSize:20};
    //     },
    // }),
    // Application:Backbone.Collection.extend({
    //     model:Models.syncModel,
    //     _url:'/Application/',
    //     url:function(){
    //         var toReturn='/Application/?service='+this.sid;
    //         return toReturn;
    //     },
    //     setSID:function(sid){
    //         this.sid=sid;
    //     }
    // }),
    // ContactInfo:Backbone.Collection.extend({
    //     model:Models.syncModel,
    //     _url:'/ContactInfo/',
    //     url:function(){
    //         return '/ContactInfo/?service='+this.sid;
    //     },
    //     setSID:function(sid){
    //         this.sid=sid;
    //     }
    // }),
    // Role:Backbone.Collection.extend({
    //     model:Models.simpleModel,
    //     url:'/Role/'
    // }),
    // ShortService:Backbone.Collection.extend({
    //     model: Models.syncModel,
    //     url:function(){
    //         return '/ShortService/?contract='+this.contract;
    //     },
    //     initialize:function(models,options){
    //         options=options||{};
    //         this.contract=options.contract;
    //     }
    // }),
    Service:Backbone.PageableCollection.extend({
        model: Models.syncModel,
        _url:'/Service/',
        url: function(){
            if(this.customWhere){
                return '/Service/?where='+this.customWhere;   
            }else if(this.whereclaus){
                return '/Service/?where='+this.whereclaus();   
            }else{
                return '/Service/';
            }
        },
        
        initialize:function(models,options){
            options=options||{};
            this.startDate=options.startDate||"09-01-2014";
            this.endDate=options.endDate||"";
            this.mode="client";
            this.state={pageSize:20};
        },
        setdate:function(options){
            this.startDate=options.startDate;
            this.endDate=options.endDate;
        },
        whereclaus:function(){
            var where={};
            where.contractSigned={};
             try{
               if(this.startDate){
                    where.contractSigned['>']=new Date(this.startDate);
                }
                if(this.endDate){
                    where.contractSigned['<']=new Date(this.endDate);
                }
                if(where.contractSigned){
                    return JSON.stringify(where);
                }
            }catch(e){
                return "{}";
            }
            return "{}";
        }
    }),
    ServiceList:Backbone.PageableCollection.extend({
        model: Models.syncModel,
        _url:'/ServiceDetail/',
        url: function(){
            if(this.customWhere){
                return '/ServiceDetail/?where='+this.customWhere;   
            }else if(this.whereclaus){
                return '/ServiceDetail/?where='+this.whereclaus();   
            }else{
                return '/ServiceDetail/';
            }
        },
        
        initialize:function(models,options){
            options=options||{};
            this.startDate=options.startDate||"09-01-2014";
            this.endDate=options.endDate||"";
            this.mode="client";
            this.state={pageSize:20};
        },
        setdate:function(options){
            this.startDate=options.startDate;
            this.endDate=options.endDate;
        },
        whereclaus:function(){
            var where={};
            where.contractSigned={};
             try{
               if(this.startDate){
                    where.indate['>']=new Date(this.startDate);
                }
                if(this.endDate){
                    where.indate['<']=new Date(this.endDate);
                }
                if(where.indate){
                    return JSON.stringify(where);
                }
            }catch(e){
                return "{}";
            }
            return "{}";
        }
    }),
    MonthlyCollection:Backbone.PageableCollection.extend({
        model:Models.syncModel,
         url: function(){
            var toreturn=this._url+'?';
            if(this.year)
                toreturn+='year='+this.year;
            if(this.month)
                toreturn+="&month="+this.month;
            return toreturn;
        },
        
        initialize:function(models,options){
            this.year=new Date().getFullYear();
            this.month=new Date().getMonth()+1;
            this._url=options.url;
            this.mode="client";
            this.state={pageSize:25};
        },
        setdate:function(options){
            this.year=options.year;
            this.month=options.month;
        },
    }),
    // SalesComission:sortableCollection.extend({
    //     model:Models.Comission,
    //     url: function(){
    //         var toreturn='/SalesComission/?';
    //         if(this.startDate)
    //             toreturn+='startdate='+this.startDate;
    //         if(this.endDate)
    //             toreturn+="&enddate="+this.endDate;
    //         return toreturn;
    //     },
        
    //     initialize:function(){
    //         this.startDate="9/1/2014";
    //         this.endDate="";
    //         this.mode="client";
    //     },
    //     setdate:function(options){
    //         this.startDate=options.startDate;
    //         this.endDate=options.endDate;
    //     },
    // }),
    // ServiceComission:Backbone.PageableCollection.extend({
    //     model:Models.syncModel,
    //     url: function(){
    //         var toreturn='/ServiceComission/?';
    //         if(this.year)
    //             toreturn+='year='+this.year;
    //         if(this.month)
    //             toreturn+="&month="+this.month;
    //         return toreturn;
    //     },
        
    //     initialize:function(models,options){
    //         this.year=new Date().getFullYear();
    //         this.month=new Date().getMonth()+1;
    //         this.mode="client";
    //         this.state={pageSize:25};
    //     },
    //     setdate:function(options){
    //         this.year=options.year;
    //         this.month=options.month;
    //     },
    // }),

    // Comment:Backbone.Collection.extend({
    //     model:Models.simpleModel,
    //     initialize:function(models,option){
    //         this.cid=option.cid;
    //         this.sid=option.sid;
    //         this.aid=option.aid;
    //     },
    //     url:function(){
    //         if(this.cid)
    //             return '/Comment/?contract='+this.cid;
    //         if(this.sid)
    //             return '/Comment/?service='+this.sid;
    //         if(this.aid)
    //             return '/Comment/?application='+this.aid;      
    //     }
    // }),
    // UserLevel:Backbone.Collection.extend({
    //     model:Models.syncModel,
    //     url:'/userLevel/',

    // }),
    // ServiceDetail:Backbone.PageableCollection.extend({
    //     model:Models.syncModel,
    //     _url:'/ServiceDetail/',
    //     url:function(){
    //         var toReturn='/ServiceDetail/?contract='+this.cid;
    //         return toReturn;
    //     },
    //     initialize:function(models, options){
    //         this.mode="client";
    //         this.state={pageSize:25};
    //     },
    //     setCID:function(cid){
    //         this.cid=cid;
    //     }
    // }),
    // UserInService:Backbone.Collection.extend({
    //     model:Models.syncModel,
    //     _url:'/UserInService/',
    //     url:function(){
    //         return this._url+'?serviceDetail='+this.serviceDetail;
    //     },
    //     initialize:function(models,options){
    //         this.serviceDetail=(options||{}).serviceDetail;
    //     }
    // }),
    General:Backbone.PageableCollection.extend({
        model:Models.syncModel,
        url: function(){
            var toreturn=this._url;
            if(this.year&&this.month)
                toreturn+='?year='+this.year+"&month="+this.month;
            return toreturn;
        },
        
        initialize:function(models,options){
            options=options||{};
            this.year=options.year||new Date().getFullYear();
            this.month=options.month||new Date().getMonth()+1;
            this.mode=options.mode||"client";
            this.state=options.state||{pageSize:25};
            this._url=options.url;
        },
        setdate:function(options){
            this.year=options.year;
            this.month=options.month;
        },
    }),
    // SyncCollection:Backbone.PageableCollection.extend({
    //     model:Models.syncModel,
    //     initialize:function(models,options){
    //         this.url=options.url;
    //         delete options.url;
    //         this.mode=options.mode||"client";
    //         this.state=options.state||{pageSize:25};
    //         Backbone.PageableCollection.prototype.initialize.apply(this,arguments);
    //     }
    // }),
    TimeRangeGeneral:Backbone.PageableCollection.extend({
       model:Models.syncModel,
       url: function(){
            var toreturn=this._url+"?";
            if(this.startDate)
                toreturn+='startDate='+encodeURI(this.startDate);
            if(this.endDate)
                toreturn+="&sendDate="+encodeURI(this.endDate);
            return toreturn;
        },
        initialize:function(models, options){
            options=options||{};
            var cur=new Date();
            this.startDate=cur.setMonth(cur.getMonth()-1);
            this.endDate=cur;
            this._url=options.url;
            this.mode=options.mode||"client";
            this.state=options.state||{pageSize:25};
        },
        setdate:function(options){
            this.startDate=options.startDate;
            this.endDate=options.endDate;
        },
        setUrl:function(url){
            this._url=url;
        }
    }),
    // Invoice:Backbone.Collection.extend({
    //     model:Models.syncModel,
    //     _url:'/Invoice/',
    //     url:function(){
    //         return this._url+'?contract='+this.contract;
    //     },
    //     initialize:function(models,options){
    //         this.contract=(options||{}).contract;
    //     }
    // }),
    // ServiceInvoice:Backbone.Collection.extend({
    //     model:Models.syncModel,
    //     _url:'/ServiceInvoice/',
    //     url:function(){
    //         return this._url+'?invoice='+this.invoice;
    //     },
    //     initialize:function(models, options){
    //         this.invoice=(options||{}).invoice;
    //     }
    // }),
    // ApplicationFile:Backbone.Collection.extend({
    //     model:Models.syncModel,
    //     _url:'/ApplicationFile/',
    //     url:function(){
    //         return this._url+'?application='+this.aid||0;
    //     }
    // })
}



module.exports = { Models: Models,Collections:Collections };