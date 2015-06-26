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
    collectionName:'ServiceList',
    title:'服务列表',
    paginator:true,
    minScreenSize:0,
    filterFields:['cName','realServiceType','serviceProgress','user','link'],
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
        var self=this;
        return Promise.all([util.ajaxGET('/RealServiceType/'),util.ajaxGET('/ServiceProgress/'),util.ajaxGET('/User/'),util.ajaxGET('/Degree/')]).spread(function(stype,progress,users,degree){
            var userselect=BackgridCells.SelectCell({name:'Users',values:_.map(users,function(e){return [e.nickname,e.id]})}); // Only Backend Group
            var typeselect=BackgridCells.SelectCell({name:'ServiceType',values:_.map(stype,function(e){return [e.realServiceType,e.id]})});
            var progressselect=BackgridCells.SelectCell({name:'Progress',values:_.map(progress,function(e){return [e.serviceProgress,e.id]})});
            var degreeselect=BackgridCells.SelectCell({name:'Degree',values:_.map(degree,function(e){return [e.degree,e.id]})});
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
            var RedirectCell=Backgrid.Cell.extend({
                render: function () {
                  var id=this.model.get('contract');
                  if(id){
                    this.$el.html('<a href="/admin/contract/'+id+'">Link to contract</a>');
                  }else{
                    this.$el.html('');
                  }
                  this.delegateEvents();
                  return this;
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
                {name:'',label:'合同链接',editable:false,cell:RedirectCell},
                {name:'contractKey',label:'ID',cell:'string'},
                {name:'realServiceType',label:'各进程类型',editable:false,cell:typeselect},
                {name:'serviceProgress',label:'该进程状态',cell:progressselect},
                {name:'indate',label:'启动时间',cell:BackgridCells.MomentCell},
                //{name:'degree',label:'申请学校类型',cell:degreeselect},
                {name:'correspondService',label:'附属i服务',cell:'string'},
                {name:'effectiveSemester',label:'需选课学期',cell:DateCell},
                {name:'semesterType',label:'学校系统',cell:semesterselect},
                {name:'level',label:'Level',cell:'number'},
                {name:'user',label:'该进程负责人',editable:false,cell:userselect},
                {name:'link',label:'学生档案 Link',cell:'uri'},
                {name:'',label:'OtherUsers',cell:userinservice},
                {name:'',label:'该进程备注',cell:comment},
                {name:'',label:'Application',cell:appPopup},
                {name:'',label:'Delete Action',cell:BackgridCells.DeleteCell}
                ];
            var user_options=_.map(users,function(e){return [e.nickname,e.id]});
            self.selectFields=[{name:'realServiceType',label:'各进程类型',options:_.map(stype,function(e){return [e.realServiceType,e.id]})},
            {name:'serviceProgress',label:'该进程状态',options:_.map(progress,function(e){return [e.serviceProgress,e.id]})},
            {name:"user",label:'该进程负责人',options:user_options},
            ];
            return Promise.resolve({});
        });
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
module.exports=ServiceView;