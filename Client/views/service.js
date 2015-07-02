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

var main=require('./data');
var CommentModalView=require('./comment');
var ServiceView=main.baseDataView.extend({
    collectionName:'Service',
    title:'服务列表',
    paginator:true,
    filterFields:['chineseName','nickname','serviceProgress','type','degree','previousSchool','studentDestination','servRole'],
    renderOptions:{date:true},
    constructColumns:function(){
        var popup=BackgridCells.Cell.extend({
            cellText:'Details',
            action:function(e){
                e.preventDefault();
                var id=this.model.get('id');
                var type=this.model.get('serviceType');
                var teacherview= new ServicePopup({id:id,type:type});
                teacherview.render();
                $('.app').html(teacherview.el);
            },
        });
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
                $('.app').html(appview.el);  
            }
        });
        var comment=BackgridCells.Cell.extend({
            cellText:'Comments',
            action:function(e){
                var item=$(e.currentTarget);
                var id = this.model.get('id');
                var type='serv';
                var m=new CommentModalView({sid:id});
                $('.app').html(m.renderAll().el);   
            }
        });
        var self=this;
        return Promise.all([util.ajaxGET('/ServiceProgress/'),util.ajaxGET('/Degree/')]).spread(function(progress,degree){
            var progressselect=BackgridCells.SelectCell({name:"Progress",values:_.map(progress,function(e){return [e.serviceProgress,e.id]})});
            var degreeselect=BackgridCells.SelectCell({name:"Degree",values:_.map(degree,function(e){return [e.degree,e.id]})});
            self.columns=[
            {name:'chineseName',label:'用户名字',editable:false,cell:'string'},
            {name:'nickname',label:'总负责老师',editable: false,cell:'string'},
            {name:'matchedcName',label:'导入表匹配到中文名',editable:false,cell:'string'},
            {name:'cName',label:'导入表学生中文名',cell:'string'},
            {name:'contractKey',label:'导入表合同ID',cell:'string'},
            {name:'serviceProgress',label:'状态',cell:progressselect},                    
            {name:'contractSigned',label:'进入服务时间',editable:false,cell:BackgridCells.MomentCell},
            {name:'type',label:'服务类型',editable:false,cell:'string'},
            //{name:'realnickname',label:'具体负责老师',editable:false,cell:'string'},
            //{name:'servRole',label:'具体负责任务',editable:false,cell:'string'},
            {name:'endFee',label:'预付申请费',editable:false,cell:'boolean'},
            {name:'gpa',label:'GPA',cell:'number'},
            {name:'toefl',label:'托福',cell:'number'},
            {name:'gre',label:'GRE',cell:'number'},
            {name:'sat',label:'SAT',cell:'number'},
            {name:'otherScore',label:'其他分数',cell:'string'},
            {name:'degree',label:'原学校类型',cell:degreeselect},
            {name:'previousSchool',label:'原学校',cell:'string'},
            {name:'major',label:'原专业',cell:'string'},
            {name:'targetSchoolDegree',label:'申请学校类型',cell:degreeselect},
            // {name:'step1',label:'step1',cell:'date'},
            // {name:'step2',label:'step2',cell:'date'},
            {name:'studentDestination',label:'学生去向',cell:'string'},
                {name:'link',label:'链接',cell:'uri'},
            {name:'',label:'Show Applications',cell:appPopup},
            {name:'',label:'Comment',cell:comment},
            {name:'',label:'Show Details',cell:popup},
            ];
            
            self.selectFields=[{name:'serviceProgress',label:'状态',options:_.map(progress,function(e){return [e.serviceProgress,e.id]})},
            {name:'degree',label:'原学校类型',options:_.map(degree,function(e){return [e.degree,e.id]})},
            {name:'targetSchoolDegree',label:'申请学校类型',options:_.map(degree,function(e){return [e.degree,e.id]})}
            ];
            return Promise.resolve({});
        });
    }
    });
var ShortContractView=main.baseDataView.extend({
    collectionName:'ShortContract',
    title:'服务列表',
    paginator:true,
    filterFields:['chineseName','nameKey','teacher','contractPaid','boughtservices','previousSchool','major'],
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
            {name:'nameKey',label:'合同ID',editable:false,cell:'string'},
            // {name:'teacher',label:'后期组长',editable: false,cell:'string'},
            {name:'contractPaid',label:'付款日',editable:false,cell:BackgridCells.MomentCell},
            {name:'status',label:'该合同进度',editable:false,cell:status},
            {name:'boughtservices',label:'该合同购买服务',cell:'text'},
            {name:'',label:'各进程细节',cell:popup},                    
            {name:'',label:'学生联系方式',cell:'string'},                    
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
    }
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
    collectionName:'ServiceDetail',
    initialize:function(options){
        main.baseModalDataView.prototype.initialize.apply(this,arguments);
        this.shortContract=options.model;
        this.contractId=parseInt(this.shortContract.get('id'));
        this.collection.setCID(this.contractId);
    },
    constructColumns:function(){
        var self=this;
        return Promise.all([util.ajaxGET('/RealServiceType/'),util.ajaxGET('/ServiceProgress/'),util.ajaxGET('/User/')]).spread(function(stype,progress,users){
            var userselect=BackgridCells.SelectCell({name:'Users',values:_.map(_.where(users,{role:2,active:true}),function(e){return [e.nickname,e.id]})}); // Only Backend Group
            var typeselect=BackgridCells.SelectCell({name:'ServiceType',values:_.map(stype,function(e){return [e.realServiceType,e.id]})});
            var progressselect=BackgridCells.SelectCell({name:'Progress',values:_.map(progress,function(e){return [e.serviceProgress,e.id]})});
            var semesterselect=BackgridCells.SelectCell({name:'SemesterType',values:[['quarter','quarter'],['dual','dual']]});
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
    collectionName:'UserInService',
    initialize:function(options){
        main.baseModalDataView.prototype.initialize.apply(this,arguments);
        this.serviceDetail=options.serviceDetail;
    },
    constructColumns:function(){
        var self=this;
        return util.ajaxGET('/User/').then(function(users){
            var userselect=BackgridCells.SelectCell({name:'Users',values:_.map(_.where(users,{role:2}),function(e){return [e.nickname,e.id]})}); // Only Backend Group
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
    collectionName:'Application',
    initialize: function (options){
        main.baseModalDataView.prototype.initialize.apply(this,arguments);
        this.serviceID=parseInt(options.id);
        this.collection.setSID(this.serviceID);
    },  
    newModel:function(){
        return new Obiwang.Models.syncModel({service:this.serviceID},{_url:'/Application/'});
    },
    constructColumns:function(){
        var self=this;
        return Promise.all([util.ajaxGET('/User/'),util.ajaxGET('/Degree/')]).spread(function(users,degree){
            var userselect=BackgridCells.SelectCell({name:'Users',values:_.map(users,function(e){return [e.nickname,e.id]})});
            var degree=BackgridCells.SelectCell({name:'Degree',values:_.map(degree,function(e){return [e.degree,e.id]})});
            var comment=BackgridCells.Cell.extend({
                cellText:'Comments',
                action:function(e){
                    var item=$(e.currentTarget);
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
            self.columns=[
                //{name:'user',label:'文书负责人',cell:userselect},
                {name:'collageName',label:'所申学校',cell:'string'},
                {name:'appliedMajor',label:'申请专业',cell:'string'},
                {name:'appliedDegree',label:'申请学校类型',cell:degree},
                {name:'decided',label:'选校',cell:'boolean'},
                {name:'decidedDate',label:'选校时间',cell:BackgridCells.MomentCell},
                {name:'applied',label:'已提交申请',cell:'boolean'},
                {name:'submitDate',label:'提交时间',cell:BackgridCells.MomentCell},
                {name:'succeed',label:'录取',cell:'boolean'},
                {name:'acceptedDate',label:'录取时间',cell:BackgridCells.MomentCell},
                {name:'deadline',label:'截止时间',cell:BackgridCells.MomentCell},
               // {name:'newDev',label:'新开发？',cell:'boolean'},
                {name:'appliedSemester',label:'申请入读学期',cell:DateCell},
                //{name:'studentCondition',label:'Condition',cell:'string'},
                {name:'',label:'Comments',cell:comment},
                //{name:'',label:'Update',cell:UpdateCell},
                {name:'',label:'Delete',cell:DeleteCell}
                ];
        });         
    },
});
module.exports=ShortContractView;