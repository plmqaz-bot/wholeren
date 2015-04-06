"use strict";
var _=require('lodash');
var Promise=require('bluebird');
var moment=require('moment');
var $ = require('jquery');
require('jquery-ui');
$=require('../bootstrap-modal.js')($);
var Backgrid=require('../backgrid-text-cell.js');
var Backbone= require('../backbone.modal.js');
var Obiwang = require('../models');
var validator=require('../validator.js');
var util=require('../util');
var BackgridCells=require('../backgrid.cell.js');
require('backbone-forms');
var Backform=require('../backform');
var JST=require('../JST');
Backbone.$=$;
var main=require('./data');
var CommentModalView=require('./comment');

var ContractView=main.baseDataView.extend({
	collectionName:'Contract',
	title:'合同列表',
	paginator:true,
	filterFields:['clientName','contractCategory','lead','leadName','status','major','country','degree'],
	renderOptions:{date:true,deleted:true},
    constructColumns:function(){
    	var self=this;
    	var comment=BackgridCells.Cell.extend({
            cellText:'Comments',
            action:function(e){
                var item=$(e.currentTarget);
                var id = this.model.get('id');
                var m=new CommentModalView({cid:id});
                $('.app').html(m.renderAll().el);   
            }
        });
        var payment=BackgridCells.Cell.extend({
            cellText:'费用详细',
            action:function(e){
                var item=$(e.currentTarget);
                var id = this.model.get('id');
                var m=new ContractInvoiceView({id:id});
                m.render();
                $('.app').html(m.el);   
            } 
        });
        return Promise.all([util.ajaxGET('/contract/getAllOptions/'),util.ajaxGET('/User/')]).spread(function(AllOptions,Users){
        	var category=BackgridCells.SelectCell({name:"ContractCategory",values:_.map(AllOptions['ContractCategory'],function(e){return [e.contractCategory,e.id]})});
            var lead=BackgridCells.SelectCell({name:"Lead",values:_.map(AllOptions['Lead'],function(e){return [e.lead,e.id]})});
            var leadLevel=BackgridCells.SelectCell({name:"LeadLevel",values:_.map(AllOptions['LeadLevel'],function(e){return [e.leadLevel,e.id]})});
            var status=BackgridCells.SelectCell({name:"Status",values:_.map(AllOptions['Status'],function(e){return [e.status,e.id]})});
            var country=BackgridCells.SelectCell({name:"Country",values:_.map(AllOptions['Country'],function(e){return [e.country,e.id]})});
            var degree=BackgridCells.SelectCell({name:"Degree",values:_.map(AllOptions['Degree'],function(e){return [e.degree,e.id]})});
            var sign=BackgridCells.Cell.extend({
                cellText:'Status',
                action:function(e){
                    var item=$(e.currentTarget);
                    var ci= new ContractSignView({model:this.model,options:AllOptions['Status']});
                    ci.render();
                    $('.app').html(ci.el);
                }
            });
            var agent=BackgridCells.Cell.extend({
                cellText:'负责老师选择',
                action:function(e){
                    var m=new ContractAgentView({model:this.model,options:Users});
                    m.render();
                    $('.app').html(m.el);
                }
            });
            var edit=Backgrid.StringCell.extend({
                events:{
                    "click":"action"
                },
                action:function(e){
                    var popUpView = new ContractEdit({view:self,model:this.model});
                    $('.app').html(popUpView.render().el);
                }
            })
            self.columns=[
            {name:'clientName',label:'Name',cell:edit},
            {name:'contractCategory',label:'咨询服务类别',cell:category},
            {name:'lead',label:'Lead种类',cell:lead},
            {name:'leadName',label:'Lead介绍人',cell:'string'},
            {name:'leadLevel',label:'LeadLevel',cell:leadLevel},
            {name:'createdAt',label:'咨询日期',editable:false,cell:'date'},
            {name:'status',label:'签约状态',cell:sign},
            {name:'',label:'人员分配',cell:agent},
            {name:'salesFollowup',label:'销售跟进记录',cell:'text'},
            {name:'salesRecord',label:'销售跟进摘要',cell:'text'},
            {name:'expertContactDate',label:'专家咨询日期',cell:'date'},
            {name:'expertFollowup',label:'专家跟进记录',cell:'text'},
            {name:'originalText',label:'求助原文',cell:'text'},
            {name:'country',label:'当前所在地',cell:country},                    
            {name:'validI20',label:'I-20有效',cell:'boolean'},
            {name:'previousSchool',label:'原学校',cell:'string'},
            {name:'degree',label:'原学校类型',cell:degree},
            {name:'targetSchool',label:'目标学校',cell:'string'},
            {name:'targetSchoolDegree',label:'申请学校类型',cell:degree},
            {name:'gpa',label:'GPA',cell:'number'},
            {name:'toefl',label:'托福',cell:'number'},
            {name:'gre',label:'GRE',cell:'number'},
            {name:'sat',label:'SAT',cell:'number'},
            {name:'otherScore',label:'其他分数',cell:'string'},
            {name:'age',label:'年龄',cell:'string'},
            {name:'major',label:'就读专业',cell:'string'},
            {name:'diagnose',label:'何弃疗',cell:'string'},
            {name:'endFeeDue',label:'是否应收尾款',cell:'boolean'},
            {name:'endFee',label:'是否已收尾款',cell:'boolean'},
            {name:'',label:'费用详细',cell:payment},
            {name:'',label:'Comment',cell:comment},
            {name:'',label:'Delete/Undelete',cell:BackgridCells.DeleteCell}
            ];
            return Promise.resolve({});
        });
	},
    constructTable:function(){
        main.baseDataView.prototype.constructTable.apply(this,arguments);
        if(this.id){
            var one =new Obiwang.Models.syncModel({_url:'/Contract/'});
            one.set('id',this.id,{save:false});
            var self=this;
            one.fetch({save:false}).then(function(data){
                self.collection.push(data);
            });
        }
    },
    events: {
    'click  button.button-alt': 'refetch',
    'click  button.button-save': 'save',
    'click button.button-add':'add'
    },    
    add:function(e){
        var popUpView = new ContractEdit({view:this});
        $('.app').html(popUpView.render().el);
    },
});
var ContractSignView=Backbone.Modal.extend({
    prefix:"bbm",
    template: JST['editbox'],
    submitEl: '.ok',
    cancelEl:'.cancel',
    initialize: function (options){
        _.bindAll(this,  'render', 'afterRender');
        var self=this;
        this.render=_.wrap(this.render,function(render){
            render();
            self.afterRender();
        });
        this.model=options.model;
        this.options=_.map(options.options,function(e){
            return {label:e.status,value:e.id};
        });
    },
    afterRender:function(){
        var container=this.$el.find('.bbm-modal__section');
        var self=this;
        

        this.form=new Backbone.Form({
            model:this.model,
            schema:{
                status:{type:'Select',options:new Obiwang.Collections.Status()},
                contractSigned:{type:'DatePicker'},
                contractPaid:{type:'DatePicker'},
            }
        });
        this.form.render();
        //var fields=[
        // {name:'status',label:'Status',control:'select',options:this.options},
        // {name:'contractSigned',label:'Signed',control:'datepicker',options:{format:"yyyy-mm-dd"}},
        // {name:'contractPaid',label:'Paid',control:'datepicker',options:{format:"yyyy-mm-dd"}}];
        // this.form=new Backform.Form({
        //     el:self.$el.find('.bbm-modal__section'),
        //     model:self.model,
        //     fields:fields,
        // });
        // this.form.render();
        container.append(this.form.el);
        return this;
    },
    submit:function(e){
        var self=this;
        // this.model.save(null,{
        //     patch:true,
        //     success:function(d){
        //         self.close();
        //     },
        //     error:function(model,response){
        //         util.handleRequestError(response);                       
        //     },
        //     save:false,
        // });
        this.form.commit();
    },
    checkKey:function(e){
        if (this.active) {
            if (e.keyCode==27) return this.triggerCancel();
        }
    }
});

var ContractAgentView=Backbone.Modal.extend({
    prefix:"bbm",
    template: JST['editbox'],
    submitEl: '.ok',
    cancelEl:'.cancel',
    initialize: function (options){
        _.bindAll(this,  'render', 'afterRender');
        var self=this;
        this.render=_.wrap(this.render,function(render){
            render();
            self.afterRender();
        });
        this.model=options.model;
        this.options=options.options;
        this.options=_.map(options.options,function(e){
            return {label:e.nickname,value:e.id};
        });
        this.options.push({label:'NONE',value:null});
    },
    afterRender:function(){
        var container=this.$el.find('.bbm-modal__section');
        var self=this;
        var fields=[
        {name:'assistant1',label:'助理1',control:'select',options:this.options},
        {name:'assistant2',label:'助理2',control:'select',options:this.options},
        {name:'assistant3',label:'助理3',control:'select',options:this.options},
        {name:'assistant4',label:'助理4',control:'select',options:this.options},
        {name:'assisCont1',label:'助签1',control:'select',options:this.options},
        {name:'assisCont2',label:'助签1',control:'select',options:this.options},
        {name:'expert1',label:'专家1',control:'select',options:this.options},
        {name:'expert2',label:'专家2',control:'select',options:this.options},
        {name:'sales1',label:'销售1',control:'select',options:this.options},
        {name:'sales2',label:'销售2',control:'select',options:this.options},
        {name:'teacher',label:'总服务老师',control:'select',options:this.options}];
        this.form=new Backform.Form({
            el:self.$el.find('.bbm-modal__section'),
            model:self.model,
            fields:fields,
        });
        this.form.render();
        return this;
    },
    submit:function(e){
        
    },
    checkKey:function(e){
        if (this.active) {
            if (e.keyCode==27) return this.triggerCancel();
        }
    }
});

var ContractInvoiceView=main.baseModalDataView.extend({
	events:{
        'click .button-add-invoice':'addnew'
    },
    collectionName:'Invoice',
    initialize:function(options){
    	main.baseModalDataView.prototype.initialize.apply(this,arguments);
    	this.contractID=parseInt(options.id);
    	this.collection.contract=this.contractID;
    },
    addnew:function(e){
		e.preventDefault();
		var toAdd=new Obiwang.Models.Invoice({_url:'/Invoice/'});
		toAdd.setContract({contract:this.contractID});
		var self=this;
		toAdd.save(null,{
			success:function(model){
				self.collection.add(toAdd);
			},
			error:function(response,model){
				util.handleRequestError(response);
			},
			save:false
		});  
    },
    afterRender:function(model){
    	var container=this.$el.find('.bbm-modal__section');
        container.append('<button class="button-add-invoice">Add New</button>');
		return this;
    },
    constructColumns:function(){
    	var DeleteCell = BackgridCells.DeleteCell;
        var ServiceInvoiceCell=BackgridCells.Cell.extend({
            cellText:'Detail',
            action:function(e){
                e.preventDefault();
                var childview=new ServiceInvoiceView({invoice:this.model});
                childview.render();
                $('.app').append(childview.el);
            }
        });
        var self=this;
        return Promise.all([util.ajaxGET('/DepositAccount/'),util.ajaxGET('/PaymentOption/')]).spread(function(account,payment){
            var accountSelect=BackgridCells.SelectCell({name:"收款账户",values:_.map(account,function(e){return [e.account,e.id]})});
            var paymentSelect=BackgridCells.SelectCell({name:"付款方式",values:_.map(payment,function(e){return [e.paymentOption,e.id]})});
            self.columns=[
            {name:'nontaxable',label:'申请费',cell:'number'},
            {name:'remittances',label:'shouxu',cell:'number'},
            {name:'other',label:'其他费用',cell:'number'},
            {name:'service',label:'服务收费',editable:false,cell:'number'},
            {name:'total',label:'Total',editable:false,cell:'number'},
            {name:'depositAccount',label:'收款账户',cell:accountSelect},
            {name:'paymentOption',label:'收款方式',cell:paymentSelect},
            {name:'',label:'具体服务收费',cell:ServiceInvoiceCell},
            {name:'',label:'Delete Action',cell:DeleteCell}
            ];
            return Promise.resolve({});
        });
    },
});
var ServiceInvoiceView=main.baseModalDataView.extend({
    collectionName:'ServiceInvoice',
    initialize: function (options){
       	main.baseModalDataView.prototype.initialize.apply(this,arguments);
        this.invoice=options.invoice;
        this.invoiceID=parseInt(this.invoice.id);
        this.collection.invoice=this.invoiceID;
    },
    events:{
        'click .button-add-invoice':'addnew'
    },
    constructColumns:function(){
    	var self=this;
    	return util.ajaxGET('/ServiceType/').then(function(data){
            var type=BackgridCells.SelectCell({name:"ServiceType",values:_.map(data,function(e){return [e.serviceType,e.id]})});
            var deletecell =BackgridCells.Cell.extend({
                cellText:'Delete Service',
                action:function(e){
                    e.preventDefault();
                    var s=new Obiwang.Models.syncModel({_url:'/Service/'});
                    s.set('id',this.model.get('service'),{save:false});
                    this.model.destroy({
                        success:function(model){
                            s.destroy({
                                success:function(model){
                                    Wholeren.notifications.addItem({
                                    type: 'success',
                                    message: "Delete Successful",
                                    status: 'passive'
                                    });
                                },
                                error:function(response){
                                  util.handleRequestError(response);
                                },
                                wait:true
                            });
                        },
                        error:function(response){
                          util.handleRequestError(response);
                        },
                        wait:true
                    });
                   
                }
            });
            self.columns=[
                {name:'serviceType',label:'服务',cell:type},
                {name:'price',label:'服务价格',cell:'number'},
                {name:'paid',label:'已付',editable:false,cell:'number'},
                {name:'paidAmount',label:'付款',cell:'number'},
                {name:'',label:'删除',cell:deletecell}
                ];
            return Promise.resolve({});
        });
    },
    afterRender:function(model){
        var container=this.$el.find('.bbm-modal__section');
        container.append('<button class="button-add-invoice">Add New</button>');
        return this;
    },
    addnew:function(e){
        e.preventDefault();
        var toAdd=new Obiwang.Models.syncModel({_url:'/Service/'});
        toAdd.set('contract',this.invoice.get('contract'),{save:false});
        var self=this;
        toAdd.save(null,{
            success:function(model){
                self.collection.fetch({reset:true});
            },
            error:function(response,model){
                util.handleRequestError(response);
            },
            save:false
        });  
    },
    submit: function () {
        // get text and submit, and also refresh the collection. 
        this.invoice.fetch();
    },
    cancel:function(){
        this.invoice.fetch();
    },
});
var EditForm=Backbone.Modal.extend({
    viewContainer:'.app',
    cancelEl: '.cancel',
    
    constructor:function(){
        this.modelChanges={},
        this.formError=false,
        Backbone.Modal.apply(this,arguments);
    },
    initialize: function (options){
        this.parentView = options.view;
        this.model={};
        if(options.model){
            this.model=options.model;
            this.modelChanges.client=this.model.get('client');
            this.modelChanges.id=this.model.get('id');
        }else{
            this.model=new Obiwang.Models.simpleModel({_url:'/Contract/'});
        }
        _.bindAll(this,'renderSelect');
       _.bindAll(this,'render', 'afterRender'); 
       this.render = _.wrap(this.render, function(render) {
          render();
          _this.afterRender();
          return _this;
        }); 
    }, 
    afterRender:function(){      
    },
    selectionChanged:function(e){
        var field=$(e.currentTarget);
        var selected=$("option:selected",field).val();
       // var value=$("option:selected",field).text();
        var id=field.attr('id');
        var data={};
        this.modelChanges[id]=selected;             
    },
    renderSelect:function(collection){
        var col=collection.content;
        var tableName=collection.name;   
        tableName=tableName.charAt(0).toLowerCase() + tableName.slice(1);
        var self=this; 
        var theSel=$('#'+tableName).find('option').remove().end();
        theSel.append('<option></option>');
        col.forEach(function(item){
            var ele=item;
            var toAdd=$('<option>', { value : ele.id }).text(ele[tableName]);
            if(self.model.get(tableName)&&((self.model.get(tableName).id&&self.model.get(tableName).id==ele.id)||self.model.get(tableName)==ele.id)){
                toAdd.attr('selected','selected');
            }
            theSel.append(toAdd); 
        });  
    },
    inputChanged:function(e){
        var field=$(e.currentTarget);
        var id=field.attr('id');
        var value=field.val();
        var requiredValidation=field.data("rValid");
        var optionalValidation=field.data("oValid");
            
        var sub=id.indexOf('.');
        if(sub>0){
            //It is not attribute, it is nested attribute.
            var nested=id.substring(0,sub);
            var obj=this.modelChanges[nested];
            data={};

            var attr=id.substring(sub+1);
            data[attr]=value;
            if(obj){
                obj[attr]=value;
            }else{
                //var modelName=nested.charAt(0).toUpperCase() + nested.slice(1);
               // this.model.set(nested,new Obiwang.Models[modelName]());

               this.modelChanges[nested]={};
               this.modelChanges[nested][attr]=value;
            }

        }else{
            var data={};
            data[id] = value;
           this.modelChanges[id]=value;
        }
        var error=false;
        if(value.length===0){
            if(requiredValidation){
                if(!validator[requiredValidation](value)){
                    error=true;
                }
            }
        }else{
            if(optionalValidation){
                if(!validator[optionalValidation](value)){
                    error=true;
                }
            }
        }
        if(!error){
            field.removeClass('error');
            field.attr('title','');
            this.formError=false;
        }else{
            field.attr('title','error');
            field.addClass('error');
            this.formError=true;
        }

    },
    Submit:function(){
        if(this.formError) return;
        var self=this;
        this.model.save(this.modelChanges,{
            patch:true,
            success:function(d){
                // refresh parent view
                    self.parentView.rerenderSingle({id:d.get('id')});
                    return self.close();
                  
            },
            error:function(model,response){
                util.handleRequestError(response);                       
            }
        });
    },
    clickOutside:function(){
        return;
    },
    checkKey:function(e){
        if (this.active) {
            if (e.keyCode==27) return this.triggerCancel();
        }
    }
});
var ContractEdit = EditForm.extend({
    template: JST['contractEdit'],
    events:{
        "click .ok":"Submit",
        "change select:not([id^='client.'])":"selectionChanged",
        "change input":"inputChanged",
        "mouseover input":"showError",
        "change #client\\.firstName,#client\\.lastName,#client\\.chinesename":"refreshClientID",
        "change select[id^='client.']":"refreshClientInfo"
    },
    initialize: function (options){
        this.parentView = options.view;
        this.model={};
        if(options.model){
            this.model=options.model;
            this.modelChanges.client=this.model.get('client');
            this.modelChanges.id=this.model.get('id');
        }else{
            this.model=new Obiwang.Models.simpleModel({_url:'/Contract/'});
        }
        _.bindAll(this,'renderSelect');
       _.bindAll(this,'render', 'afterRender'); 
        var _this = this;
        this.render = _.wrap(this.render, function(render) {
          render();
          _this.afterRender();
          return _this;
        }); 
        }, 
    afterRender:function(){
         var self=this;
        $.ajax({
            url: '/options/',
            type: 'GET',
            headers: {
                'X-CSRF-Token': $("meta[name='csrf-param']").attr('content')
            },
            success: function (data) {
                for(var key in data){
                    self.renderSelect({name:key,content:data[key]});
                }                
            },
            error: function (xhr) {
                console.log('error');
            }
        });
    },
    refreshClientID:function(){
        var firstname=$("#client\\.firstName").val();
        var lastname=$("#client\\.lastName").val();
        var chinesename=$('#client\\.chineseName').val();
        var where={};
        if(firstname){
            where.firstName=firstname;
        }
        if(lastname){
            where.lastName=lastname;
        }
        if(chinesename){
            where.chineseName=chinesename;
        }

        $.ajax({
            url: '/client/find?where='+JSON.stringify(where),
            type: 'GET',
            headers: {
                'X-CSRF-Token': $("meta[name='csrf-param']").attr('content')
            },
            success: function (clients) {
                var theSel=$('#client\\.id').find('option').remove().end();
                theSel.append('<option></option>');
                console.log(clients);
                clients.forEach(function(entry){
                    theSel.append('<option value="'+entry.id+'">'+entry.primaryEmail+'</option>');
                });                
            },
            error: function (response) {
                util.handleRequestError(response);
                console.log('error');
            }
        });
    },
    refreshClientInfo:function(e){
        var field=$(e.currentTarget);
        var selected=$("option:selected",field).val();
       // var value=$("option:selected",field).text();
       if(!selected){
            return;
       }
        var client=new Obiwang.Models.simpleModel({_url:'/Client/',id:selected});
        var self=this;
        client.fetch({
            reset: true,
            success: function (mod, response, options) {
                var clientmod=mod.toJSON();
                self.modelChanges.client=clientmod;
                $('#client\\.firstName').val(clientmod.firstName);
                $('#client\\.lastName').val(clientmod.lastName);
                $('#client\\.chineseName').val(clientmod.chineseName);
                $('#client\\.primaryEmail').val(clientmod.primaryEmail);
                $('#client\\.secondaryEmail').val(clientmod.secondaryEmail);
                $('#client\\.primaryPhone').val(clientmod.primaryPhone);
                $('#client\\.secondaryPhone').val(clientmod.secondaryPhone);
                $('#client\\.otherInfo').val(clientmod.otherInfo);
            },
            error: function (collection, response, options) {
                util.handleRequestError(response);
                console.log('error fetch');
            }
        });
   },
   Submit:function(event){
        event.preventDefault();
        var firstname = this.$('#client\\.firstName').val(),
            lastname = this.$('#client\\.lastName').val(),
            chinesename = this.$('#client\\.chineseName').val(),
            email = this.$('#client\\.primaryEmail').val(),
            validationErrors = [],
            self = this;

        if (!validator.isLength(chinesename, 1)) {
            validationErrors.push("Please enter a chinesename.");
        }
        if (!validator.isLength(firstname, 1)) {
            validationErrors.push("Please enter a firstname.");
        }
        if (!validator.isLength(lastname, 1)) {
            validationErrors.push("Please enter a lastname.");
        }

        if (!validator.isEmail(email)) {
            validationErrors.push("Please enter a correct email address.");
        }
        if((this.modelChanges.gpa||"").length<1){
             this.modelChanges.gpa=null;
        }
        if((this.modelChanges.toefl||"").length<1){
            this.modelChanges.toefl=null;
        }
        if((this.modelChanges.contractSigned||"").length<1){
            this.modelChanges.contractSigned=null;
        }
        if((this.modelChanges.contractPrice||"").length<1){
            this.modelChanges.contractPrice=null;
        }
        if (validationErrors.length) {
            validator.handleErrors(validationErrors);
        }else{
            var self=this;
                this.model.save(this.modelChanges,{
                patch:true,
                save:false,
                success:function(d){
                    // refresh parent view
                    try{
                        //self.parentView.rerenderSingle({id:d.get('id')});
                        if(!self.parentView.collection.contains(d)){
                            self.parentView.collection.fullCollection.add(d); 
                            self.parentView.collection.fullCollection.sort();
                        }
                    }catch(e){
                        return self.close();
                    }
                    return self.close();
                },
                error:function(model,response){
                    self.model.attributes=model._previousAttributes;
                    util.handleRequestError(response); 
                    self.refreshClientID();                      
                }
                });
                
        }        
    },
});

module.exports=ContractView;
