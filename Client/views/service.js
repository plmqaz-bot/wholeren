"use strict";
var _=require('lodash');
var Promise=require('bluebird');
var moment=require('moment');
var $ = require('../jquery');
var Backgrid=require('../backgrid');
var Backbone= require('../backbone');
var Obiwang = require('../models');
var validator=require('../validator.js');
var util=require('../util');
var BackgridCells=require('../backgrid.cell.js');
var Backform=require('../backform');
var JST=require('../JST');
var Dropzone=require('dropzone');
var main=require('./data');
var CommentModalView=require('./comment');
var ShortContractView=main.baseDataView.extend({
    collectionName:'ShortContract',
    title:'服务列表',
    simpleFilter:true,
    paginator:true,
    //filterFields:['chineseName','pinyin','nameKey','teacher','contractPaid','boughtservices','previousSchool','major'],
    filterFields:[],
    renderOptions:{date:true},
    constructColumns:function(){
        var popup=BackgridCells.Cell.extend({
            cellText:'Details',
            action:function(e){
                e.preventDefault();
                var teacherview= new ServicePopup({model:this.model});
                teacherview.render();
                $('.app').html(teacherview.el);
            },
        });
        var contPopup=BackgridCells.Cell.extend({
                cellText:'ContactInfo',
                render: function () {
                    this.$el.html('<a>'+this.cellText+'</a>');
                    this.delegateEvents();
                    return this;
                  },
                action:function(e){
                    e.preventDefault();
                    var id=this.model.get('client')||0;
                    var contactview= new ContactInfoPopup({id:id});
                    contactview.render();
                    $('.app').append(contactview.el);  
                }
            });
        var comment=BackgridCells.Cell.extend({
            cellText:'Comments',
            action:function(e){
                var item=$(e.currentTarget);
                var id = this.model.get('id');
                var type='serv';
                var m=new CommentModalView({cid:id});
                $('.app').html(m.renderAll().el);   
            }
        });
        var self=this;
        return util.ajaxGET('/contract/getAllOptions/').then(function(AllOptions){
            var status=BackgridCells.SelectCell({name:"Status",values:_.map(AllOptions['Status'],function(e){return [e.status,e.id]})});
            var country=BackgridCells.SelectCell({name:"Country",values:_.map(AllOptions['Country'],function(e){return [e.country,e.id]})});
            var degree=BackgridCells.SelectCell({name:"Degree",values:_.map(AllOptions['Degree'],function(e){return [e.degree,e.id]})});
             self.columns=[
            {name:'chineseName',label:'用户名字',editable:false,cell:'string'},
            {name:'pinyin',label:'用户拼音',editable:false,cell:'string'},
            {name:'primaryPhone',label:'电话',editable:false,cell:'string'},
            {name:'primaryEmail',label:'Email',editable:false,cell:'string'},
            {name:'',label:'其他联系方式',cell:contPopup},   
            //{name:'nameKey',label:'合同ID',editable:false,cell:'string'},
            // {name:'teacher',label:'后期组长',editable: false,cell:'string'},
            {name:'contractPaid',label:'付款日',editable:false,cell:BackgridCells.MomentCell},
            {name:'status',label:'该合同进度',editable:false,cell:status},
            {name:'boughtservices',label:'该合同购买服务',cell:'text'},
            {name:'',label:'各进程细节',cell:popup},                    
                             
            //{name:'',label:'第三方费用',cell:'string'},                    
            {name:'country',label:'学生所在地',cell:country},
            {name:'degree',label:'原学校类型',cell:degree},
            {name:'previousSchool',label:'原学校',cell:'string'},
            {name:'major',label:'原专业',cell:'string'},
            {name:'gpa',label:'GPA',cell:'number'},
            {name:'toefl',label:'托福',cell:'number'},
            {name:'gre',label:'GRE',cell:'number'},
            {name:'sat',label:'SAT',cell:'number'},
            {name:'otherScore',label:'其他分数',cell:'string'},
            //{name:'',label:'Show Applications',cell:appPopup},
            {name:'',label:'Comment',cell:comment}
            ];
            
             self.selectFields=[{name:'status',label:'该合同进度',options:_.map(AllOptions['Status'],function(e){return [e.status,e.id]})},
            {name:'country',label:'学生所在地',options:_.map(AllOptions['Country'],function(e){return [e.country,e.id]})},
            {name:'degree',label:'原学校类型',options:_.map(AllOptions['Degree'],function(e){return [e.degree,e.id]})},
            ];
            return Promise.resolve({});
        });
    },
    constructTable:function(){
        main.baseDataView.prototype.constructTable.apply(this,arguments);
        if(this.id){
            var one =new Obiwang.Models.syncModel({id:this.id},{_url:'/ShortContract/'});
            var self=this;
            one.fetch({save:false}).then(function(data){
                self.collection.push(data);
            });
        }
    },
});

var ContactInfoPopup=main.baseModalDataView.extend({
    collectionName:'SimpleSyncCollection',
    collectionUrl:'/ContactInfo/',
    initialize: function (options){
        main.baseModalDataView.prototype.initialize.apply(this,arguments);
        this.clientID=parseInt(options.id);
        this.collection.setGetParameter({client:this.clientID});
    },
    newModel:function(){
        return new Obiwang.Models.syncModel({client:this.clientID},{_url:'/ContactInfo/'});
    },
    constructColumns:function(){
        var DeleteCell = BackgridCells.DeleteCell;
        this.columns=[
            //{name:'user',label:'文书负责人',cell:userselect},
            //{name:'primaryCell',label:'主要电话',cell:'string'},
            //{name:'secondaryEmail',label:'Email',cell:'string'},
            {name:'skype',label:'skype',cell:'string'},
            {name:'qq',label:'QQ',cell:'string'},
            {name:'wechat',label:'微信',cell:'string'},
            {name:'parentPhone',label:'家长电话',cell:'string'},
            {name:'parentEmail',label:'家长邮箱',cell:'string'},
            {name:'emergencyContact',label:'紧急联系方式',cell:'string'},
            {name:'otherContact',label:'其他',cell:'string'},
            {name:'',label:'Delete',cell:DeleteCell}
            ];
        return Promise.resolve({});
                
    },
});
// var ServicePopup=Backbone.Modal.extend({
//     prefix:"bbm",
//     template: JST['editbox'],
//     submitEl: '.ok',
//     cancelEl:'.cancel',
//     events:{
//         'click .button-add':'addnew'
//     },
//     initialize: function (options){
//         _.bindAll(this,  'render', 'afterRender');
//         this.cache=[];
//         var self=this;
//         this.render=_.wrap(this.render,function(render){
//             render();
//             self.afterRender();
//         });
//         this.shortContract=options.model;
//         this.contractId=parseInt(this.shortContract.get('id'));
//         this.collection=new Obiwang.Collections.ServiceDetail();
//         this.collection.setCID(this.contractId);
//     },     
//     addnew:function(e){
//         var toAdd=new Obiwang.Models.syncModel({contract:this.contractId,cName:this.shortContract.get('chineseName')},{_url:'/ServiceDetail/'});
//         //toAdd.set('service',this.serviceID,{save:false});
//         //toAdd.set('originalType',this.type,{save:false});
//         var self=this;
//         toAdd.save(null,{
//             save:false,
//             success:function(model){
//                 self.collection.add(model);
//             },
//             error:function(response,model){
//                 util.handleRequestError(response);
//             }
//         })
  
//     },
//     afterRender:function(model){
//         var container=this.$el.find('.bbm-modal__section');
//         container.append('<button class="button-add">Add New</button>');
        
//         var self=this;
//         Promise.all([util.ajaxGET('/RealServiceType/'),util.ajaxGET('/ServiceProgress/'),util.ajaxGET('/User/')]).spread(function(stype,progress,users){
//             var userselect=BackgridCells.SelectCell({name:'Users',values:_.map(_.where(users,{role:2}),function(e){return [e.nickname,e.id]})}); // Only Backend Group
//             var typeselect=BackgridCells.SelectCell({name:'ServiceType',values:_.map(stype,function(e){return [e.realServiceType,e.id]})});
//             var progressselect=BackgridCells.SelectCell({name:'Progress',values:_.map(progress,function(e){return [e.serviceProgress,e.id]})});
//             // var typeselect=userselect.extend({
//             //     optionValues:function(){
//             //         var oritype=this.model.get('originalType');
//             //         var shrunk=_.where(stype,{groupServiceType:oritype});
//             //         var toadd=_.map(shrunk,function(e){return [e.serviceType.serviceType,e.serviceType.id]});
//             //         if((toadd||[]).length<1){
//             //             toadd.push([this.model.get('typetext'),this.model.get('originalType')]);
//             //         }
//             //         return [{name:'ServiceType',values:toadd}];
//             //     }
//             // });
//             var appPopup=BackgridCells.Cell.extend({
//                 cellText:'Applications',
//                 render: function () {
//                     if(this.model.get('addApplication')!=0)
//                         this.$el.html('<a>'+this.cellText+'</a>');
//                     else
//                         this.$el.html('');        
//                     this.delegateEvents();
//                     return this;
//                   },
//                 action:function(e){
//                     e.preventDefault();
//                     var id=this.model.get('id');
//                     var appview= new ApplicationPopup({id:id});
//                     appview.render();
//                     $('.app').append(appview.el);  
//                 }
//             });
//             var comment=BackgridCells.Cell.extend({
//                     cellText:'Comments',
//                     action:function(e){
//                         var item=$(e.currentTarget);
//                         var id = this.model.get('id');
//                         var type='serv';
//                         var m=new CommentModalView({sid:id});
//                         $('.app').append(m.renderAll().el);   
//                     }
//                 });
//             var columns=[
//                 {name:'cName',label:'用户名字',editable:false,cell:'string'},
//                 {name:'realServiceType',label:'各进程类型',cell:typeselect},
//                 {name:'ServiceProgress',label:'该进程状态',cell:progressselect},
//                 {name:'user',label:'该进程负责人',cell:userselect},
//                 {name:'link',label:'学生档案 Link',cell:'uri'},
//                 {name:'',label:'该进程备注',cell:comment},
//                 {name:'',label:'Application',cell:appPopup},
//                 {name:'',label:'Delete Action',cell:BackgridCells.DeleteCell}
//                 ];
//             var grid=new Backgrid.Grid({columns:columns,collection:self.collection});
//                 container.append(grid.render().el);
//                 self.collection.fetch({reset:true});
//             }).error(function(err){
//                 console.log(err);
//             });  
//         return this;
//     },
//     submit: function () {
//         // get text and submit, and also refresh the collection. 

//     },
//     checkKey:function(e){
//         if (this.active) {
//             if (e.keyCode==27) return this.triggerCancel();
//         }
//     }
// });
var ServicePopup=main.baseModalDataView.extend({
    collectionName:'SimpleSyncCollection',
    collectionUrl:'/ServiceDetail/',
    initialize:function(options){
        main.baseModalDataView.prototype.initialize.apply(this,arguments);
        this.shortContract=options.model;
        this.contractId=parseInt(this.shortContract.get('id'));
        this.collection.setGetParameter({contract:this.contractId})
    },
    constructColumns:function(){
        var self=this;
        return Promise.all([util.ajaxGET('/RealServiceType/'),util.ajaxGET('/ServiceProgress/'),util.ajaxGET('/User/')]).spread(function(stype,progress,users){
            var userselect=BackgridCells.SelectCell({name:'Users',values:_.map(_.filter(users,function(a){
                if(a.role==2||(a.secondaryRole||0)==2) return true;
            }),function(e){return [e.nickname,e.id]})}); 
            var typeselect=BackgridCells.SelectCell({name:'ServiceType',values:_.map(stype,function(e){return [e.realServiceType,e.id]})});
            var progressselect=BackgridCells.SelectCell({name:'Progress',values:_.map(progress,function(e){return [e.serviceProgress,e.id]})});
            var semesterselect=Backgrid.SelectCell.extend({
              optionValues:function(){
                return [['quarter','quarter'],['semester','dual'],['unknown',null]];
              },
              formatter:_.extend({}, Backgrid.SelectFormatter.prototype, {
                toRaw: function (formattedValue, model) {
                  return formattedValue;
                }
              })
            },{
              _touse:[['quarter','quarter'],['semester','dual'],['unknown',null]]
            });
           // var typeselect=userselect.extend({
            //     optionValues:function(){
            //         var oritype=this.model.get('originalType');
            //         var shrunk=_.where(stype,{groupServiceType:oritype});
            //         var toadd=_.map(shrunk,function(e){return [e.serviceType.serviceType,e.serviceType.id]});
            //         if((toadd||[]).length<1){
            //             toadd.push([this.model.get('typetext'),this.model.get('originalType')]);
            //         }
            //         return [{name:'ServiceType',values:toadd}];
            //     }
            // });
            var appPopup=BackgridCells.Cell.extend({
                cellText:'Applications',
                render: function () {
                    if(this.model.get('addApplication')!=0)
                        this.$el.html('<a>'+this.cellText+'</a>');
                    else
                        this.$el.html('');        
                    this.delegateEvents();
                    return this;
                  },
                action:function(e){
                    e.preventDefault();
                    var id=this.model.get('id');
                    var appview= new ApplicationPopup({id:id});
                    appview.render();
                    $('.app').append(appview.el);  
                }
            });
            var userinservice=BackgridCells.Cell.extend({
                cellText:'Others',
                render:function(){
                    this.$el.html('<a>'+this.cellText+'</a>');
                    this.delegateEvents();
                    return this;
                },
                action:function(e){
                    e.preventDefault();
                    var id=this.model.get('id');
                    var userview= new MoreUserPopup({serviceDetail:id,collectionParam:{serviceDetail:id}});
                    userview.render();
                    $('.app').append(userview.el);  
                }
            })
            var comment=BackgridCells.Cell.extend({
                    cellText:'Comments',
                    action:function(e){
                        var item=$(e.currentTarget);
                        var id = this.model.get('id');
                        var type='serv';
                        var m=new CommentModalView({sid:id});
                        $('.app').append(m.renderAll().el);   
                    }
                });
            var DateCell=Backgrid.DateCell.extend({
                formatter:{
                    fromRaw:function(rawValue,model){
                        if(rawValue==null||rawValue=="") return '';
                        var d=moment(rawValue);
                        return d.format('YYYY-MM');
                    },
                    toRaw:function(formattedData, model){
                        if(formattedData=="") return null;
                        var d=moment(formattedData,'YYYY-MM');
                        if(d.isValid()){
                            return d
                        }else{
                            return
                        } ;
                    }
                }
            });
            self.columns=[
                {name:'cName',label:'用户名字',editable:false,cell:'string'},
                {name:'id',label:'ID',editable:false,cell:'integer'},
                {name:'realServiceType',label:'各进程类型',cell:typeselect},
                {name:'serviceProgress',label:'该进程状态',cell:progressselect},
                {name:'indate',label:'启动时间',cell:BackgridCells.MomentCell},
                {name:'correspondService',label:'附属i服务',cell:'string'},
                {name:'effectiveSemester',label:'需选课学期',cell:DateCell},
                {name:'semesterType',label:'学校系统',cell:semesterselect},
                {name:'level',label:'Level',cell:'number'},
                {name:'user',label:'该进程负责人',cell:userselect},
                {name:'link',label:'学生档案 Link',cell:'uri'},
                {name:'',label:'OtherUsers',cell:userinservice},
                {name:'',label:'该进程备注',cell:comment},
                {name:'',label:'Application',cell:appPopup},
                {name:'',label:'Delete Action',cell:BackgridCells.DeleteCell}
                ];
        });       
    },
    newModel:function(){
        return new Obiwang.Models.syncModel({contract:this.contractId,cName:this.shortContract.get('chineseName'),serviceProgress:1},{_url:'/ServiceDetail/'});
    }
});

var MoreUserPopup=main.baseModalDataView.extend({
    collectionName:'SimpleSyncCollection',
    collectionUrl:'/UserInService/',
    initialize:function(options){
        main.baseModalDataView.prototype.initialize.apply(this,arguments);
        this.serviceDetail=options.serviceDetail;
        this.collection.setGetParameter({serviceDetail:this.serviceDetail});
    },
    constructColumns:function(){
        var self=this;
        return util.ajaxGET('/User/').then(function(users){
            var userselect=BackgridCells.SelectCell({name:'Users',values:_.map(_.filter(users,function(a){
                if(a.role==2||(a.secondaryRole||0)==2) return true;
            }),function(e){return [e.nickname,e.id]})});
            self.columns=[
                {name:'user',label:'负责人名字',cell:userselect},
                {name:'',label:'Delete Action',cell:BackgridCells.DeleteCell}
            ];
            return Promise.resolve({});
        })        
    },
    newModel:function(){
        return new Obiwang.Models.syncModel({serviceDetail:this.serviceDetail},{_url:'/UserInService/'});
    }
})


var ApplicationPopup=main.baseModalDataView.extend({
    collectionName:'SimpleSyncCollection',
    collectionUrl:'/Application/',
    initialize: function (options){
        main.baseModalDataView.prototype.initialize.apply(this,arguments);
        this.serviceID=parseInt(options.id);
        this.collection.setGetParameter({service:this.serviceID});
    },  
    newModel:function(){
        return new Obiwang.Models.syncModel({service:this.serviceID},{_url:'/Application/'});
    },
    constructColumns:function(){
        var self=this;
        return Promise.all([util.ajaxGET('/User/'),util.ajaxGET('/Degree/')]).spread(function(users,degree){
            //var userselect=BackgridCells.SelectCell({name:'Users',values:_.map(users,function(e){return [e.nickname,e.id]})});
            var degree=BackgridCells.SelectCell({name:'Degree',values:_.map(degree,function(e){return [e.degree,e.id]})});
            var comment=BackgridCells.Cell.extend({
                cellText:'Comments',
                action:function(e){
                    var id = this.model.get('id');
                    var m=new CommentModalView({aid:id});
                    $('.app').append(m.renderAll().el);   
                }
            });
            var DeleteCell = BackgridCells.DeleteCell;
            //var UpdateCell=BackgridCells.UpdateCell;
            var DateCell=Backgrid.DateCell.extend({
                formatter:{
                    fromRaw:function(rawValue,model){
                        if(rawValue==null||rawValue=="") return '';
                        var d=moment(rawValue);
                        return d.format('YYYY-MM');
                    },
                    toRaw:function(formattedData, model){
                        if(formattedData=="") return null;
                        var d=moment(formattedData,'YYYY-MM');
                        if(d.isValid()){
                            return d
                        }else{
                            return
                        } ;
                    }
                }
            });
            var FileCell=BackgridCells.Cell.extend({
                cellText:'Files',
                action:function(e){
                    var id = this.model.get('id');
                    var m=new FilePopup({id:id})
                    m.render();
                    $('.app').append(m.el);
                }
            })
            self.columns=[
                //{name:'user',label:'文书负责人',cell:userselect},
                {name:'collageName',label:'所申学校',cell:'string'},
                {name:'appliedSemester',label:'申请入读学期',cell:DateCell},
                {name:'appliedMajor',label:'申请专业',cell:'string'},
                {name:'appliedDegree',label:'申请学校类型',cell:degree},
                {name:'decided',label:'选校',cell:'boolean'},
                {name:'decidedDate',label:'选校时间',cell:BackgridCells.MomentCell},
                {name:'applied',label:'已提交申请',cell:'boolean'},
                {name:'submitDate',label:'提交时间',cell:BackgridCells.MomentCell},
                {name:'succeed',label:'录取',cell:'boolean'},
                {name:'acceptedDate',label:'录取时间',cell:BackgridCells.MomentCell},
                {name:'deadline',label:'截止时间',cell:BackgridCells.MomentCell},
                {name:'studentDecision',label:'去否',cell:'boolean'},
               // {name:'newDev',label:'新开发？',cell:'boolean'},
                {name:'',label:'有关文件',cell:FileCell},
                //{name:'studentCondition',label:'Condition',cell:'string'},
                {name:'',label:'Comments',cell:comment},
                //{name:'',label:'Update',cell:UpdateCell},
                {name:'',label:'Delete',cell:DeleteCell}
                ];
        });         
    },
});

var FilePopup=main.baseModalDataView.extend({
    collectionName:'SimpleSyncCollection',
    collectionUrl:'/ApplicationFile/',
    addNew:false,
    initialize:function(options){
        main.baseModalDataView.prototype.initialize.apply(this,arguments);
        this.applicationID=parseInt(options.id);
        this.collection.setGetParameter({application:this.applicationID});
    },
    constructColumns:function(){
        var uri=BackgridCells.Cell.extend({
                cellText:'download',
                action:function(e){
                    window.open("/PublicFiles/getFile/"+this.model.get('file'));
                },
                render: function () {
                    this.$el.html('<a src="/PublicFiles/getFile/'+this.model.get('file')+'">download</a>');
                    this.delegateEvents();
                    return this;
                }
            });
         this.columns=[
                //{name:'user',label:'文书负责人',cell:userselect},
                {name:'description',label:'文件介绍',cell:'string'},
                {name:'',label:'下载',cell:uri},
                {name:'',label:'Delete',cell:BackgridCells.DeleteCell}
                ];
        return Promise.resolve();
    },
    afterRender:function(){
        main.baseModalDataView.prototype.afterRender.apply(this,arguments);
        this.$('.bbm-modal__section').prepend('<form action="/" class="dropzone"></form>');;
        var obj=this.$('.dropzone');
        var domobj=obj[0];
        var myDropzone = new Dropzone(domobj, { url: "/ApplicationFile/"});
        var self=this;
        myDropzone.on('success',function(file,data){
           //console.log("success",arguments);
            self.collection.add(data);
            util.handleRequestSuccess({responseText:"Upload Successful"});
            //myDropzone.removeFile(file);
        });
        myDropzone.on("sending",function(file,xhr,data){
            data.append("application",self.applicationID);
        });
        myDropzone.on('error',function(file){
            util.handleRequestError(err);
            myDropzone.removeFile(file);
        })
        return this;
    },
});
module.exports=ShortContractView;