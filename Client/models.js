var Backbone = require('backbone');
$ = require('jquery');
Backbone.$ = $;
Models = {};
Collections = {};
Models={
    Contract : Backbone.Model.extend({
    idAttribute: "id",
    
    urlRoot:'/Contract/'
    }),
    Client:Backbone.Model.extend({
        idAttribute:"id",
    urlRoot:'/Client/'
    }),
    ContractCategory:Backbone.Model.extend({
        urlRoot:'/ContractCategory/'

    }),
    Country:Backbone.Model.extend({
        urlRoot:'/Country/'

    }),
    Degree:Backbone.Model.extend({
        urlRoot:'/Degree/'

    }),
    Lead:Backbone.Model.extend({
        urlRoot:'/Lead/'

    }),
    LeadLevel:Backbone.Model.extend({
        urlRoot:'/LeadLevel/'

    }),
    PaymentOption:Backbone.Model.extend({
        urlRoot:'/PaymentOption/'

    }),
    Status:Backbone.Model.extend({
        urlRoot:'/Status/'

    }),
    ServiceType:Backbone.Model.extend({
        urlRoot:'/ServiceType/'
    }),
    Service : Backbone.Model.extend({
    idAttribute: "id",
    urlRoot:'/Service/'
    }),
    User:Backbone.Model.extend({
        urlRoot:'/User/'
    }),
    Application:Backbone.Model.extend({
        urlRoot:'/Application/'
    }),
    Role:Backbone.Model.extend({
        urlRoot:'/Role/'
    }),
    Comment:Backbone.Model.extend({
        urlRoot:'/Comment/'
    })

};
var sortableCollection=Backbone.Collection.extend({
    sortAttr:{
            attribute:'client',
            nested:'firstName',
            asec:true
        },
        comparator:function(A,B){
            var aAttr='';
            var bAttr='';
            aAttr=A.get(this.sortAttr['attribute'])||{};
            aAttr=aAttr[this.sortAttr['nested']]||aAttr;
            bAttr=B.get(this.sortAttr['attribute'])||{};
            bAttr=bAttr[this.sortAttr['nested']]||bAttr;
            //if(B.get(this.sortAttr['attribute'])){
            //    bAttr=B.get(this.sortAttr['attribute'])[this.sortAttr];
            //}
            if(aAttr>bAttr){
                if(this.sortAttr.asec)return -1;
                else return 1;
            }else if(aAttr<bAttr){
                if(this.sortAttr.asec)return 1;
                else return -1;
            }else{
                return 0;
            }
        },
        selectedStrat:function(options){
            var sortAttr=options.sortAttr;
            var dir=options.direction;
            //this.sortAttr=sortAttr;
            var sub=sortAttr.indexOf('.');
            if(sub>0){
                this.sortAttr['attribute']=sortAttr.substring(0,sub);
                this.sortAttr['nested']=sortAttr.substring(sub+1);
            }else{
                this.sortAttr['attribute']=sortAttr;
                this.sortAttr['nested']='';
            }
            this.sortAttr['asec']=dir=="asec";
        },
});
Collections={
    Contract :sortableCollection.extend({
        model: Models.Contract,
        url: function(){return '/Contract/find?where='+this.whereclaus();},
        initialize:function(){
            this.selectedStrat({sortAttr:'client.firstName'});
            this.startDate="11/2/2014";
            this.endDate="11/19/2014";
        },
        whereclaus:function(){
            var where={};
            where.createdAt={}
            if(this.startDate){
                where.createdAt['>']=new Date(this.startDate);
            }
            if(this.endDate){
                where.createdAt['<']=new Date(this.endDate);
            }
            return JSON.stringify(where);
        }
    }),
    Client : Backbone.Collection.extend({
        model: Models.Client,
        name:'client',
        url: '/Client/'
    }),
    ContractCategory:Backbone.Collection.extend({
        name:'contractCategory',
        model:Models.ContractCategory,
        url:'/ContractCategory/'

    }),
    Country:Backbone.Collection.extend({
        name:'country',
        model:Models.Country,
        url:'/Country/'

    }),
    Degree:Backbone.Collection.extend({
        name:'degree',
        model:Models.Degree,
        url:'/Degree/'

    }),
    Lead:Backbone.Collection.extend({
        name:'lead',
        model:Models.Lead,
        url:'/Lead/'

    }),
    LeadLevel:Backbone.Collection.extend({
        name:'leadLevel',
        model:Models.LeadLevel,
        url:'/LeadLevel/'

    }),
    PaymentOption:Backbone.Collection.extend({
        name:'paymentOption',
        model:Models.PaymentOption,
        url:'/PaymentOption/'

    }),
    Status:Backbone.Collection.extend({
        name:'status',
        model:Models.Status,
        url:'/Status/'
    }),
    ServiceType:Backbone.Collection.extend({
        name:'serviceType',
        model:Models.ServiceType,
        url:'/ServiceType/'
    }),
    Service:sortableCollection.extend({
        model: Models.Service,
        url: function(){return '/Service/find?where='+this.whereclaus();},
        
        initialize:function(){
            this.selectedStrat({sortAttr:'contract.createdAt'});
            this.startDate="11/2/2014";
            this.endDate="11/19/2014";
        },
        whereclaus:function(){
            var where={};
            where.createdAt={}
            if(this.startDate){
                where.createdAt['>']=new Date(this.startDate);
            }
            if(this.endDate){
                where.createdAt['<']=new Date(this.endDate);
            }
            return JSON.stringify(where);
        }
    }),
    User:sortableCollection.extend({
        model: Models.User,
        url: '/User/',
        initialize:function(){
            this.selectedStrat({sortAttr:'nickname'});
        }
    }),
    Application:Backbone.Collection.extend({
        model:Models.Application,
        url:'/Application/'
    }),
    Role:Backbone.Collection.extend({
        model:Models.Role,
        url:'/Role/'
    }),
    Comment:Backbone.Collection.extend({
        model:Models.Comment,
        initialize:function(option){
            this.cid=option.cid;
            this.sid=option.sid;
        },
        url:function(){
            if(this.cid)
                return '/Comment/?contract='+this.cid;
            if(this.sid)
                return '/Comment/?service='+this.sid;
            if(this.aid)
                return '/Comment/?service='+this.aid;      
        }
    })
}



module.exports = { Models: Models,Collections:Collections };