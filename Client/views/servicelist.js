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
var ServiceView=main.baseDataView.extend({
    collectionName:'ServiceList',
    title:'服务列表',
    paginator:true,
    minScreenSize:4000,
    simpleFilter:true,
    filterFields:[],
    //filterFields:['cName','realServiceType','serviceProgress','user','link'],
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
            var userselect=BackgridCells.SelectCell({name:'Users',values:_.map(_.filter(users,function(a){
                if(a.role==2||(a.secondaryRole||0)==2) return true;
            }),function(e){return [e.nickname,e.id]})});
            var typeselect=BackgridCells.SelectCell({name:'ServiceType',values:_.map(stype,function(e){return [e.realServiceType,e.id]})});
            var progressselect=BackgridCells.SelectCell({name:'Progress',values:_.map(progress,function(e){return [e.serviceProgress,e.id]})});
            var degreeselect=BackgridCells.SelectCell({name:'Degree',values:_.map(degree,function(e){return [e.degree,e.id]})});
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
            var contPopup=BackgridCells.Cell.extend({
                cellText:'ContactInfo',
                render: function () {
                    this.$el.html('<a>'+this.cellText+'</a>');
                    this.delegateEvents();
                    return this;
                  },
                action:function(e){
                    e.preventDefault();
                    var id=this.model.get('id');
                    var c=this.model.get('client');
                    var contactview= new ContactInfoPopup({id:id,client:c});
                    contactview.render();
                    $('.app').append(contactview.el);  
                }
            });
             var visaPopup=BackgridCells.Cell.extend({
                cellText:'Visa Info',
                render: function () {
                    if(this.model.get('realServiceType')==6)
                        this.$el.html('<a>'+this.cellText+'</a>');
                    else
                        this.$el.html('');   
                    return this;
                  },
                action:function(e){
                    e.preventDefault();
                    var id=this.model.get('id');
                    var visaview= new VisaPopup({id:id});
                    visaview.render();
                    $('.app').append(visaview.el);  
                }
            });
            var appPopup=BackgridCells.Cell.extend({
                cellText:'Applications',
                render: function () {
                    if(this.model.get('realServiceType')==6)
                       this.$el.html('<a>Visa Info</a>');
                    else if(this.model.get('addApplication')!=0)
                        this.$el.html('<a>Applications</a>');
                    this.delegateEvents();
                    return this;
                  },
                action:function(e){
                    e.preventDefault();
                    var view;
                    var id=this.model.get('id');
                    if(this.model.get('realServiceType')==6){
                        view= new VisaPopup({id:id});
                    }else if(this.model.get('addApplication')!=0){
                        view= new ApplicationPopup({id:id});
                    }
                    view.render();
                    $('.app').append(view.el); 
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
                    this.$el.html('<a href="/admin/service/'+id+'">Link to Service</a>');
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
                {name:'pinyin',label:'拼音',editable:false,cell:'string'},
                {name:'primaryPhone',label:'用户电话',editable:false,cell:'string'},
                {name:'primaryEmail',label:'Email',editable:false,cell:'string'},
                {name:'',label:'合同链接',editable:false,cell:RedirectCell},
                //{name:'contractKey',label:'合同ID',cell:'string'},
                // {name:'id',label:'ID',editable:false,cell:'integer'},
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
                //{name:'',label:'ContactInfo',cell:contPopup},
                {name:'',label:'Extra Info',cell:appPopup},
                //{name:'',label:'VisaInfo',cell:visaPopup},
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
var VisaPopup=main.baseModalDataView.extend({
    collectionName:'SimpleSyncCollection',
    collectionUrl:'/VisaInfo/',
    initialize: function (options){
        main.baseModalDataView.prototype.initialize.apply(this,arguments);
        this.serviceID=parseInt(options.id);
        this.collection.setGetParameter({serviceDetail:this.serviceID});    
    },
    newModel:function(){
        return new Obiwang.Models.syncModel({serviceDetail:this.serviceID},{_url:'/VisaInfo/'});
    },
    constructColumns:function(){
        var DeleteCell = BackgridCells.DeleteCell;
         var pselect=Backgrid.SelectCell.extend({
              optionValues:function(){
                return [['1. 初步联络学生','1. 初步联络学生'],['2.填写DS160','2.填写DS160'],['3. 预约面签','3. 预约面签'],['4. 面签培训','4. 面签培训'],['5. 签证结果','5. 签证结果']];
              },
              formatter:_.extend({}, Backgrid.SelectFormatter.prototype, {
                toRaw: function (formattedValue, model) {
                  return formattedValue;
                }
              })
            },{
              _touse:[['1. 初步联络学生','1. 初步联络学生'],['2.填写DS160','2.填写DS160'],['3. 预约面签','3. 预约面签'],['4. 面签培训','4. 面签培训'],['5. 签证结果','5. 签证结果']]
            });
        this.columns=[
            //{name:'user',label:'文书负责人',cell:userselect},
            {name:'visaProgress',label:'签证进展程度',cell:pselect},
            {name:'Result',label:'签证结果',cell:'string'},
            {name:'endDate',label:'公布结果日期',cell:BackgridCells.MomentCell},
            {name:'ResultComment',label:'二次方案调整',cell:'string'},
            {name:'secondDate',label:'二次签证时间',cell:BackgridCells.MomentCell},
            {name:'secondResult',label:'二次签证结果',cell:'string'},
            {name:'secondResultComment',label:'三次方案调整',cell:'string'},
            {name:'thirdDate',label:'三次签证时间',cell:BackgridCells.MomentCell},
            {name:'thirdResult',label:'三次签证结果',cell:'string'},
            {name:'',label:'Delete',cell:DeleteCell}
            ];
        return Promise.resolve({});
                
    },
});
var ContactInfoPopup=main.baseModalDataView.extend({
    collectionName:'SimpleSyncCollection',
    collectionUrl:'/ContactInfo/',
    initialize: function (options){
        main.baseModalDataView.prototype.initialize.apply(this,arguments);
        this.serviceID=parseInt(options.id);
        this.clientID=parseInt(options.client||0);
        if(this.clientID!=0){
            this.collection.setGetParameter({client:this.clientID});    
        }else{
            this.collection.setGetParameter({service:this.serviceID});    
        }
        
    },
    newModel:function(){
        return new Obiwang.Models.syncModel({service:this.serviceID,client:this.clientID},{_url:'/ContactInfo/'});
    },
    constructColumns:function(){
        var DeleteCell = BackgridCells.DeleteCell;
        this.columns=[
            //{name:'user',label:'文书负责人',cell:userselect},
            {name:'primaryCell',label:'主要电话',cell:'string'},
            {name:'secondaryEmail',label:'Email',cell:'string'},
            {name:'skype',label:'skype',cell:'string'},
            {name:'qq',label:'QQ',cell:'string'},
            {name:'wechat',label:'微信',cell:'string'},
            {name:'parentPhone',label:'家长电话',cell:'string'},
            {name:'parentEmail',label:'家长邮箱',cell:'string'},
            {name:'emergencyContact',label:'紧急联系方式',cell:'string'},
            {name:'',label:'Delete',cell:DeleteCell}
            ];
        return Promise.resolve({});
                
    },
});


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
module.exports=ServiceView;