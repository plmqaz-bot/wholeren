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
    filterFields:['chineseName','serviceProgress','type','degree','previousSchool','studentDestination','servRole'],
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


var ServicePopup=Backbone.Modal.extend({
    prefix:"bbm",
    template: JST['editbox'],
    submitEl: '.ok',
    cancelEl:'.cancel',
    events:{
        'click .button-add':'addnew'
    },
    initialize: function (options){
        _.bindAll(this,  'render', 'afterRender');
        this.cache=[];
        var self=this;
        this.render=_.wrap(this.render,function(render){
            render();
            self.afterRender();
        });
        this.serviceID=parseInt(options.id);
        this.type=parseInt(options.type);
        this.collection=new Obiwang.Collections.ServiceDetail();
        this.collection.setSID(this.serviceID);
    },     
    addnew:function(e){
        var toAdd=new Obiwang.Models.syncModel({service:this.serviceID,originalType:this.type},{_url:'/ServiceDetail/'});
        //toAdd.set('service',this.serviceID,{save:false});
        //toAdd.set('originalType',this.type,{save:false});
        var self=this;
        toAdd.save(null,{
            save:false,
            success:function(model){
                self.collection.add(model);
            },
            error:function(response,model){
                util.handleRequestError(response);
            }
        })
  
    },
    afterRender:function(model){
        var container=this.$el.find('.bbm-modal__section');
        container.append('<button class="button-add">Add New</button>');
        
        var self=this;
        Promise.all([util.ajaxGET('/ServiceComission/roles/'),util.ajaxGET('/ServComissionLookUp/'),util.ajaxGET('/User/'),util.ajaxGET('/ServiceTypeGroup/')]).spread(function(roles,data,users,stype){
            var userselect=BackgridCells.SelectCell({name:'Users',values:_.map(users,function(e){return [e.nickname,e.id]})});
            var typeselect=userselect.extend({
                optionValues:function(){
                    var oritype=this.model.get('originalType');
                    var shrunk=_.where(stype,{groupServiceType:oritype});
                    var toadd=_.map(shrunk,function(e){return [e.serviceType.serviceType,e.serviceType.id]});
                    if((toadd||[]).length<1){
                        toadd.push([this.model.get('typetext'),this.model.get('originalType')]);
                    }
                    return [{name:'ServiceType',values:toadd}];
                }
            });
            var roleselect=userselect.extend({
                optionValues:function(){
                    var type=this.model.get('serviceType')||0;
                    var rols=_.unique(_.where(data,{serviceType:type}),false,function(e){
                        if(e.servRole){
                            return e.servRole.id;
                        }
                        return undefined;
                    })
                    var toAdd=_.map(rols,function(e){
                        if(e.servRole){
                            return [e.servLevel,e.lid];    
                        }
                        return ['error',null];                        
                    });
                    return [{name:'Roles',values:toAdd}];
                }
            });
            
            var levelselect=roleselect.extend({
                optionValues:function(){
                    var cell=this;
                    var role=this.model.get('servRole')||0;
                    var type=this.model.get('serviceType')||0;
                    self.cache[role]=self.cache[role]||[];
                    self.cache[role][type]=self.cache[role][type]||[];
                    self.cache[role][type]["level"]=self.cache[role][type]["level"]||[];
                    if(self.cache[role][type]["level"].length<1){                     
                        var shrunk=_.where(data,{servRole:role,serviceType:type});
                        _.where(data,{servRole:role,serviceType:0}).forEach(function(e){
                            shrunk.push(e);
                        });
                        var unique=_.uniq(shrunk,false,function(e){return e.lid;});
                        self.cache[role][type]["level"]=_.map(unique,function(e){return [e.servLevel,e.lid]});                         
                    }
                    var toadd=self.cache[role][type]["level"].slice(0);//clone it
                    toadd.push(["No Level",null]);
                    cell._optionValues=[{name:10,values:toadd}];
                    return cell._optionValues;                    
                }
            });
            var statusselect=roleselect.extend({
                optionValues:function(){
                    var cell=this;
                    var role=this.model.get('servRole')||0;
                    var type=this.model.get('serviceType')||0;
                    self.cache[role]=self.cache[role]||[];
                    self.cache[role][type]=self.cache[role][type]||[];
                    self.cache[role][type]["status"]=self.cache[role][type]["status"]||[];
                    if(self.cache[role][type]["status"].length<1){
                        var shrunk=_.where(data,{servRole:role,serviceType:type});
                        var shrunk2=_.where(data,{servRole:role,serviceType:0}).forEach(function(e){
                            shrunk.push(e);
                        });
                        var unique=_.uniq(shrunk,false,function(e){return e.sid;});
                        self.cache[role][type]["status"]=_.map(unique,function(e){return [e.serviceStatus,e.sid]});
                    }
                    var toadd=self.cache[role][type]["status"].slice(0);//clone it
                    toadd.push(["No Status",null]);
                    cell._optionValues=[{name:10,values:toadd}];
                    return cell._optionValues;
                } 
            });
            var DeleteCell = BackgridCells.DeleteCell;
           // var UpdateCell=BackgridCells.UpdateCell;
            var columns=[
                {name:'user',label:'User',cell:userselect},
                {name:'serviceType',label:'ServiceType',cell:typeselect},
                {name:'servRole',label:'Role',cell:roleselect},
                {name:'servLevel',label:'Level',cell:levelselect},
                {name:'progress',label:'Current Status',cell:statusselect},
                //{name:'',label:'Update',cell:UpdateCell},
                {name:'',label:'Delete Action',cell:DeleteCell}
                ];
            var grid=new Backgrid.Grid({columns:columns,collection:self.collection});
                container.append(grid.render().el);
                self.collection.fetch({reset:true});
            }).error(function(err){
                console.log(err);
            });  
        return this;
    },
    submit: function () {
        // get text and submit, and also refresh the collection. 

    },
    checkKey:function(e){
        if (this.active) {
            if (e.keyCode==27) return this.triggerCancel();
        }
    }
});
var ApplicationPopup=ServicePopup.extend({
    initialize: function (options){
        _.bindAll(this,  'render', 'afterRender');
        this.cache=[];
        var self=this;
        this.render=_.wrap(this.render,function(render){
            render();
            self.afterRender();
        });
        this.serviceID=parseInt(options.id);
        this.collection=new Obiwang.Collections.Application();
        this.collection.setSID(this.serviceID);
    },     
    addnew:function(e){
        var toAdd=new Obiwang.Models.syncModel({service:this.serviceID},{_url:'/Application/'});
        var self=this;
        toAdd.save(null,{
            success:function(d){
                self.collection.add(toAdd);
            },
            error:function(model,response){
                util.handleRequestError(response);                       
            }
        });
    },
    afterRender:function(model){
        var container=this.$el.find('.bbm-modal__section');
        container.append('<button class="button-add">Add New</button>');
        
        var self=this;
        util.ajaxGET('/User/').then(function(users){
            var userselect=BackgridCells.SelectCell({name:'Users',values:_.map(users,function(e){return [e.nickname,e.id]})});
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
            var columns=[
                {name:'user',label:'文书负责人',cell:userselect},
                {name:'collageName',label:'所申学校',cell:'string'},
                {name:'appliedMajor',label:'申请专业',cell:'string'},
                {name:'succeed',label:'录取',cell:'boolean'},
                {name:'newDev',label:'新开发？',cell:'boolean'},
                {name:'appliedSemester',label:'申请入读学期',cell:DateCell},
                //{name:'studentCondition',label:'Condition',cell:'string'},
                {name:'',label:'Comments',cell:comment},
                //{name:'',label:'Update',cell:UpdateCell},
                {name:'',label:'Delete Action',cell:DeleteCell}
                ];
            var grid=new Backgrid.Grid({columns:columns,collection:self.collection});
                container.append(grid.render().el);
                self.collection.fetch({reset:true});
            }).error(function(err){
                console.log(err);
            });  
        return this;
    }, 
});
module.exports=ServiceView;