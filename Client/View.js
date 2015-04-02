"use strict";
var $ = require('./backgrid.fixedheader.js');
require('jquery-ui');
//var Backbone = require('backbone');
//var Backgrid=require('./backgrid-paginator.js');
//var Backgrid=require('./backgrid-filter.js');
var Backgrid=require('./backgrid-text-cell.js');
var Backbone= require('./backbone.modal.js');
var _=require('lodash');

var Handlebars = require('hbsfy/runtime');
var Obiwang = require('./models');
var Settings = {};
var Notification = {};
var validator=require('./validator.js');
var util=require('./util');
var JST=require('./JST');
var Promise=require('bluebird');
var BackgridCells=require('./backgrid.cell.js');
require('backbone-forms');
$=require('./bootstrap-modal.js')($);
var Backform=require('./backform');
Backbone.$=$;
var moment=require('moment');
Backbone.Form.editors.DatePicker =Backbone.Form.editors.Text.extend({
    render: function() {
        // Call the parent's render method
        Backbone.Form.editors.Text.prototype.render.call(this);
        // Then make the editor's element a datepicker.
        this.$el.datepicker({
            format: 'yyyy-mm-dd',
            autoclose: true,
            weekStart: 1
        });

        return this;
    },

    // The set value must correctl
    setValue: function(value) {
        var d=new Date(value);
        if(isNaN(d.getTime())){
            this.$el.val("");    
        }else{
            this.$el.val(d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate());
        }        
    }
});
//#region
Handlebars.registerHelper('ifCond', function (v1, v2, options) {
    if (v1 == v2) {
        return options.fn(this);
    }
    return options.inverse(this);
});
Handlebars.registerHelper('shortText', function (text) {
    text=text||'';
    return text.substring(0,14);
});
Handlebars.registerHelper('displayBool', function(bool){
    if(bool!=undefined){
        if(bool==true){
            return '是';   
        }else{
            return '否';
        }
    }else{
        return '';   
    }
});
Handlebars.registerHelper('detailStatus', function (serviceType,step,options) {
    if(!serviceType) return "";
 if(serviceType.indexOf('e')!=-1){
            if(step==1){
                return "Terminate Date:";
            }else{
                return "File Date:";
            }
        }else if(serviceType.indexOf('i2')!=-1||serviceType.indexOf('i3')!=-1){
            if(step==1){
                return "申请计划确认日期:";
            }else{
                return "选校单确认日期:";
            }
        }else if(serviceType.indexOf('p')!=-1){
            if(step==1){
                return "初稿预计完成日期:";
            }else{
                return "终稿预计完成日期:";
            }
        }
    return "";
});
//#endregion
Wholeren.baseView= Backbone.View.extend({
        templateName: "widget",

        template: function (data) {
            return JST[this.templateName](data);
        },

        templateData: function () {
            if (this.model) {
                return this.model.toJSON();
            }

            if (this.collection) {
                return this.collection.toJSON();
            }

            return {};
        },

        render: function () {
            if (_.isFunction(this.beforeRender)) {
                this.beforeRender();
            }

            this.$el.html(this.template(this.templateData()));

            if (_.isFunction(this.afterRender)) {
                this.afterRender();
            }

            return this;
        },
        addSubview: function (view) {
            if (!(view instanceof Backbone.View)) {
                throw new Error("Subview must be a Backbone.View");
            }
            this.subviews = this.subviews || [];
            this.subviews.push(view);
            return view;
        },

        // Removes any subviews associated with this view
        // by `addSubview`, which will in-turn remove any
        // children of those views, and so on.
        removeSubviews: function () {
            var children = this.subviews;

            if (!children) {
                return this;
            }

            _(children).invoke("remove");

            this.subviews = [];
            return this;
        },

        // Extends the view's remove, by calling `removeSubviews`
        // if any subviews exist.
        remove: function () {
            if (this.subviews) {
                this.removeSubviews();
            }
            return Backbone.View.prototype.remove.apply(this, arguments);
        }
    });
var Views={}
Views.Login=Wholeren.baseView.extend({

    initialize: function () {
        this.render();
    },

    templateName: "signin",


    events: {
        'submit #login': 'submitHandler'
    },

    afterRender: function () {
        var self = this;
        this.$el.css({"opacity": 0}).animate({"opacity": 1}, 500, function () {
            self.$("[name='email']").focus();
        });
    },

    submitHandler: function (event) {
        event.preventDefault();
        var email = this.$el.find('.email').val(),
            password = this.$el.find('.password').val(),
            redirect = '/admin/contract/',
            validationErrors = [];
            $.ajax({
                url: '/admin/doSignin/',
                type: 'POST',
                headers: {
                    'X-CSRF-Token': $("meta[name='csrf-param']").attr('content')
                },
                data: {
                    email: email,
                    password: password,
                    redirect: redirect
                },
                success: function (msg) {
                    var sucessMsg={responseText:"success, please wait to be redirected",redirect:'/admin/contract/',delay:1};
                    util.handleRequestSuccess(sucessMsg);
                    //util.handleRequestSuccess(msg);
                    //window.location.href = msg.redirect;
                },
                error: function (xhr) {
                    Wholeren.notifications.clearEverything();
                    Wholeren.notifications.addItem({
                        type: 'error',
                        message: util.getRequestErrorMessage(xhr),
                        status: 'passive'
                    });
                }
            });

    }

});
 Views.Signup =Wholeren.baseView.extend({

        initialize: function () {
            this.submitted = "no";
            this.render();
            this.roles=new Obiwang.Collections['Role']();
            _.bindAll(this,'renderRole');
            var self=this;
            this.roles.fetch().done(function(){
                self.renderRole();
            }).fail(function(err){
                console.log(err);
            });
            //this.roles.on('reset',this.renderRole);
        },

        templateName: "signup",

        events: {
            'submit #signup': 'submitHandler'
        },

        afterRender: function () {
            var self = this;

            this.$el
                .css({"opacity": 0})
                .animate({"opacity": 1}, 500, function () {
                    self.$("[name='name']").focus();
                });
        },
        renderRole:function(roles){
            var select=$('.role').find('option').remove().end();
            this.roles.forEach(function(ele){
                var item=ele.toJSON();
                var toAdd=$('<option>', { value : item.id }).text(item['role']);
                select.append(toAdd);
            });
        },
        submitHandler: function (event) {
            event.preventDefault();
            var nickname = this.$('.nickname').val(),
                firstname = this.$('.firstname').val(),
                lastname = this.$('.lastname').val(),
                email = this.$('.email').val(),
                password = this.$('.password').val(),
                role=this.$('.role').val(),
                validationErrors = [],
                self = this;

            if (!validator.isLength(nickname, 1)) {
                validationErrors.push("Please enter a nickname.");
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

            if (!validator.isLength(password, 0)) {
                validationErrors.push("Please enter a password");
            }

            if (!validator.equals(this.submitted, "no")) {
                validationErrors.push("Wholeren is signing you up. Please wait...");
            }

            if (validationErrors.length) {
                validator.handleErrors(validationErrors);
            } else {
                this.submitted = "yes";
                $.ajax({
                    url: '/admin/doSignup/',
                    type: 'POST',
                    headers: {
                        'X-CSRF-Token': $("meta[name='csrf-param']").attr('content')
                    },
                    data: {
                        nickname: nickname,
                        firstname: firstname,
                        lastname: lastname,
                        email: email,
                        password: password,
                        role:role
                    },
                    success: function (msg) {
                        var sucessMsg={responseText:"success, please wait for your account to be activated",redirect:'/admin/signin/'};
                        util.handleRequestSuccess(sucessMsg);
                        //window.location.href = '/admin/signin/';
                    },
                    error: function (xhr) {
                        self.submitted = "no";
                        Wholeren.notifications.clearEverything();
                        Wholeren.notifications.addItem({
                            type: 'error',
                            message: xhr.responseText,
                            status: 'passive'
                        });
                    }
                });
            }
        }
    });

Views.Forgotten=Wholeren.baseView.extend({
    templateName: "forgotten",
    initialize: function () {
                this.render();
    },
    afterRender: function () {
        var self = this;
        this.$el.css({"opacity": 0}).animate({"opacity": 1}, 500, function () {
            self.$("[name='email']").focus();
        });
    },
    events: {
        'submit #forgotten': 'submitHandler'
    },
    submitHandler: function (event) {
            event.preventDefault();

            var email = this.$el.find('.email').val(),
                validationErrors = [];

            if (!validator.isEmail(email)) {
                validationErrors.push("Please enter a correct email address.");
            }

            if (validationErrors.length) {
                validator.handleErrors(validationErrors);
            } else {
                $.ajax({
                    url: '/admin/forgotten/',
                    type: 'POST',
                    headers: {
                        'X-CSRF-Token': $("meta[name='csrf-param']").attr('content')
                    },
                    data: {
                        email: email
                    },
                    success: function (msg) {
                        window.location.href = msg.redirect;
                    },
                    error: function (xhr) {
                        util.handleRequestError(xhr);
                    }
                });
            }
        }
});



/*************************************************Views for Notifications *****************************/
/**
     * This handles Notification groups
     */

Notification.Single = Wholeren.baseView.extend({
    templateName: 'notification',
    initialize: function (options) {
        this.model = options.model;
    },
    className: 'js-bb-notification',
    render: function () {
        var html = this.template(this.model);
        this.$el.html(html);
        return this;
    }
});
Notification.Collection = Wholeren.baseView.extend({
    el: '#notifications',
    initialize: function () {
        var self = this;
        this.render();
        Wholeren.on('urlchange', function () {
            self.clearEverything();
        });
        //shortcut.add("ESC", function () {
        //    // Make sure there isn't currently an open modal, as the escape key should close that first.
        //    // This is a temporary solution to enable closing extra-long notifications, and should be refactored
        //    // into something more robust in future
        //    if ($('.js-modal').length < 1) {
        //        self.clearEverything();
        //    }
        //});
    },
    events: {
        'animationend .js-notification': 'removeItem',
        'webkitAnimationEnd .js-notification': 'removeItem',
        'oanimationend .js-notification': 'removeItem',
        'MSAnimationEnd .js-notification': 'removeItem',
        'click .js-notification.notification-passive .close': 'closePassive',
        'click .js-notification.notification-persistent .close': 'closePersistent'
    },
    render: function () {
        _.each(this.model, function (item) {
            this.renderItem(item);
        }, this);
    },
    renderItem: function (item) {
        var itemView = new Notification.Single({ model: item }),
            height,
            $notification = $(itemView.render().el);
        
        this.$el.append($notification);
        height = $notification.hide().outerHeight(true);
        $notification.animate({ height: height }, 250, function () {
            $(this)
                    .css({ height: "auto" })
                    .fadeIn(250);
        });
    },
    addItem: function (item) {
        this.model.push(item);
        this.renderItem(item);
    },
    clearEverything: function () {
        this.$el.find('.js-notification.notification-passive').parent().remove();
    },
    removeItem: function (e) {
        e.preventDefault();
        var self = e.currentTarget,
            bbSelf = this;
        if (self.className.indexOf('notification-persistent') !== -1) {
            $.ajax({
                type: "DELETE",
                headers: {
                    'X-CSRF-Token': $("meta[name='csrf-param']").attr('content')
                },
                url: '/api/notifications/' + $(self).find('.close').data('id')
            }).done(function (result) {
                /*jshint unused:false*/
                bbSelf.$el.slideUp(250, function () {
                    $(this).show().css({ height: "auto" });
                    $(self).remove();
                });
            });
        } else {
            $(self).slideUp(250, function () {
                $(this)
                        .show()
                        .css({ height: "auto" })
                        .parent()
                        .remove();
            });
        }
    },
    closePassive: function (e) {
        $(e.currentTarget)
                .parent()
                .fadeOut(250)
                .slideUp(250, function () {
            $(this).remove();
        });
    },
    closePersistent: function (e) {
        var self = e.currentTarget,
            bbSelf = this;
        $.ajax({
            type: "DELETE",
            headers: {
                'X-CSRF-Token': $("meta[name='csrf-param']").attr('content')
            },
            url: +'/api/notifications/' + $(self).data('id')
        }).done(function (result) {
            /*jshint unused:false*/
            var height = bbSelf.$('.js-notification').outerHeight(true),
                $parent = $(self).parent();
            bbSelf.$el.css({ height: height });
            
            if ($parent.parent().hasClass('js-bb-notification')) {
                $parent.parent().fadeOut(200, function () {
                    $(this).remove();
                    bbSelf.$el.slideUp(250, function () {
                        $(this).show().css({ height: "auto" });
                    });
                });
            } else {
                $parent.fadeOut(200, function () {
                    $(this).remove();
                    bbSelf.$el.slideUp(250, function () {
                        $(this).show().css({ height: "auto" });
                    });
                });
            }
        });
    }
});



/************************************************Views for Forms**************************************/
 Wholeren.FormView=Wholeren.baseView.extend({
        templateName:'contract',
        curPage:1,
        events: {
        'click .textbox,.selectbox':'editAttr',
        'click .sortable':'sortCollection'
        },
        constructor:function(){
            this.filter=[];
            Wholeren.baseView.apply(this,arguments);
        },
        render: function (options) {
             var ml = this.template(options);
             if (ml[0] != '<') {
                 ml = ml.substring(1);
             }
            this.$el.html(ml);
        },
        renderFilterButtons:function(options){
            var last_ele=$('.page-actions').children().last();
            var self=this;
            for( var key in options){
                var value=options[key]; // Key is the attribute name, value are either boolean or a table
                switch (value.type){
                    case "bool":
                    var s=$('<select name="'+key+'" class="filter"></select>');
                    $("<option />",{value:"",text:value.text}).appendTo(s);
                    $("<option />",{value:true,text:"TRUE"}).appendTo(s);
                    $("<option />",{value:false,text:"FALSE"}).appendTo(s);
                    s.insertAfter(last_ele);
                    break;
                    case "table":
                    var s=$('<select name="'+key+'" class="filter"></select>');
                    $("<option />",{value:"",text:value.text}).appendTo(s);
                    value.value.forEach(function(ele){
                        var id=ele.id;
                        var txt=ele[key];
                        $("<option />",{value:JSON.stringify(id),text:txt}).appendTo(s);
                    });
                    s.insertAfter(last_ele);
                    break;
                }
            }
        },
        sortCollection:function(e){
            if(!this.collection) return;
            var attr=$(e.currentTarget).data("attr");
            var direction;
            switch($(e.currentTarget).data("direction")){
                case "asec":
                direction="desc";$(e.currentTarget).data("direction","desc");break;
                case "desc":
                direction="asec";$(e.currentTarget).data("direction","asec");break;
                default:
                direction="asec";$(e.currentTarget).data("direction","asec");
            }
            this.collection.selectedStrat({sortAttr:attr,direction:direction});
            this.collection.sort();
        },
        editAttr:function(e){
            var item=$(e.currentTarget);
            var attr=item.data("attr");
            var type=item.attr("class");
            var id=item.parent().attr("name");
            var filter=item.data("restri")||"";
            var coll=item.data("coll")||"";
            var optext=item.data("optext")||"";
            var curValue=this.collection.get(id).get(attr);
            var modelName=item.data("model");
            var modelId=item.data("id");

             var popUpView=new AttributeEdit({view:this,id:id,filter:filter,coll:coll,optext:optext,attr:attr,type:type,curValue:curValue,modelName:modelName,modelId:modelId});
             popUpView.render();
             $('.app').html(popUpView.el);
        },
        rerenderSingle:function(options){
            var self=this;
            var modelName=this.templateName.charAt(0).toUpperCase() + this.templateName.slice(1);
            var toRender=new Obiwang.Models.simpleModel({_url:'/'+modelName+'/',id:options.id});
            if(options.del){
                self.collection.remove(self.collection.get(options.id));
                self.renderCollection();
                return;
            }
            if(!this.collection.get(options.id)){
                this.collection.add(toRender);
            }
            this.collection.get(options.id).fetch({
                reset:true,
                success:function(model,response,options){
                    if(!model){
                       self.collection.remove(self.collection.get(model.get('id')));
                    }
                    // pinned previous row
                    var id=model.get('id');

                    var pinned= $("tr.pin[name='"+id+"']").prev();
                    var row=$("tr[name='"+id+"']").not('.pin').prev();
                    //self.renderCollection();
                    self.removeCurRow(model);
                    self.renderSingle(model,row,pinned);
                },
                error: function(model,response,options){
                        Wholeren.notifications.clearEverything();
                        Wholeren.notifications.addItem({
                            type: 'error',
                            message: util.getRequestErrorMessage(response),
                            status: 'passive'
                        });
                }
            });
            // toRender.fetch({
            //     reset:true,
            //     success:function(model,response,options){
            //         if(model){
            //             self.collection.set(model.get('id'),model);
            //         }else{
            //             self.collection.remove(self.collection.get(model.get('id')));
            //         }
            //         // pinned previous row
            //         var pinned=$('.clickablecell#'+model.get('id'));
            //         var row=$('#'+model.get('id')).not('.clickablecell');
            //         //self.renderCollection();
            //         self.renderSingle(model,row,pinned);
            //     },
            //     error: function(model,response,options){
            //             Wholeren.notifications.clearEverything();
            //             Wholeren.notifications.addItem({
            //                 type: 'error',
            //                 message: util.getRequestErrorMessage(response),
            //                 status: 'passive'
            //             });
            //     }
            // });
            
        },
        removeCurRow:function(model){
            var id=model.get('id');
            $("tr[name='"+id+"']").remove();
        },
        renderSingle:function(model,previousRow,previousPinnedRow,append){
            append=typeof append!=='undefined'?append:false;
            var self=this;
            var obj=model.toJSON();
            //if(self.applyFilter(obj)){
            //    return;
            //}
            obj=self.modifyRow(obj);
            var ele = self.singleTemplate(obj);
            var toInsert = $('<div/>').html(ele).contents();
            var headline=self.headline(obj);
            if(previousRow.length==0||previousPinnedRow.length==0){
                previousRow=$('#scrollerfirst');
                previousPinnedRow=$('#pinnedfirst');
                append=false;
            }

            var headInsert=$('<div/>').html('<tr name="'+obj.id+'" class="pin"><td data-id="'+obj.id+'" class="clickablecell">'+headline+'</td></tr>').contents();
            if(append==true){
                if(previousRow.parent()) previousRow.parent().append(toInsert);
                if(previousPinnedRow.parent())previousPinnedRow.parent().append(headInsert);
            }else{
                toInsert.insertAfter(previousRow);
                headInsert.insertAfter(previousPinnedRow);
            }            
        },
        applyFilter:function(obj){
            var fs=$('.filter');
            function match(v1,v2,ele){
                if(v1.toString()==v2||v1==v2){
                    return true;
                }else{
                    if(!v1.id){
                    }else if(v1.id==v2||v1.id.toString()==v2){
                        return true;
                    }
                }
                if(ele.tagName.toLowerCase()=='input'){
                    if(v1.indexOf(v2)!=-1){
                        return true;
                    }
                }
                return false;
            }
            var filteredout=false;
            _.forEach(fs,function(ele){
                var attr=ele.name;
                var value=ele.value;
                if(!value) return; // return if the filter is null
                try{
                    value=JSON.parse(value);
                }catch(e){
                     // if value cannot be parsed, then it is a string, not json;
                }
                var sub=attr.indexOf('.');
                var tocomp;
                if(sub>0){
                    tocomp=obj[attr.substring(0,sub)]||{};
                    attr=attr.substring(sub+1);
                }
                if(tocomp instanceof Array&&tocomp.length>0){
                    tocomp.forEach(function(e){
                        var c=e[attr];
                        if(c!=undefined){
                            if(value instanceof Array){ // If it is array, see if tocomp is in the array. 
                                var ind=_.findIndex(value,function(v){
                                    return match(c,v,ele);
                                });
                                if(ind<0) e.display=false;
                            }else{
                                if(!match(c,value,ele)){
                                    e.display=false;
                                }
                            }
                        }else{
                            e.display=false;
                        }
                    });
                }else{
                    tocomp=obj[attr];
                    if(tocomp!=undefined){
                        if(value instanceof Array){ // If it is array, see if tocomp is in the array. 
                            var ind=_.findIndex(value,function(v){
                                return match(tocomp,v,ele);
                            });
                            if(ind<0) filteredout=true;
                        }else{
                            if(!match(tocomp,value,ele)){
                                filteredout=true;
                            }
                        }
                    }else{
                        filteredout=true;
                    }
                }                                
                
            });
            return filteredout;
        },
        modifyRow:function(obj){
            var self=this;
            obj.service.forEach(function(ele){
                var id=ele.serviceType;
                if(id){
                    var servT=self.serviceTypes.get(id);
                    if(!servT.toJSON){
                        console.log("something wrong");
                    }else{
                        ele.serviceType=servT.toJSON();
                    }
                }
            });
            if(this.rank>1){
                obj.displayDelete=1;
            }
            this.contractLength++;
            return obj;
        },
        headline:function(obj){
            return "NO NAME";
        },
        removeAll:function(){
            var toRemove = $('.content tbody tr').not('#scrollerfirst').not('#pinnedfirst');
            toRemove.remove();
        },
        renderCollectionCore:function(){
        // Remove all keywords
        this.removeAll();
        var headrow=$('#scrollerfirst');
        var stableheadrow=$('#pinnedfirst');
        var self=this;
        this.contractLength=0;
        var counter=0;
        // add pagination
        $('.pagination').children().remove();
        var collectionToRender=this.collection.complexFilter($('.filter'));
        var total=collectionToRender.getTotalPage();
        for(var i=1;i<=total;i++){
            if(i==this.curPage)
                $('.pagination').append('<span class="page active">'+i+'</span>');
            else
                $('.pagination').append('<a href="#" class="page">'+i+'</a>');
        }
        collectionToRender.getPage(this.curPage).forEach(function(item){
            // if(counter>200){
            //     return;
            // }else{
                self.renderSingle(item,headrow,stableheadrow,true);
            //     counter++;   
            // }
        });     
        },
        switchPage:function(e){
            var item=$(e.currentTarget);
            var page=item.text();
            this.curPage=parseInt(page);
            this.renderCollectionCore();
        }


});

var AttributeEdit=Backbone.Modal.extend({
    modelName:'',
    prefix:"small-bbm",
    initialize: function (options){
        this.modelName=options.modelName;
        _.bindAll(this,  'render', 'afterRender');
        this.parentView = options.view;
        this.filter=options.filter.replace(/\'/g,"\"");
        this.selectModel=options.coll;
        this.rerenderId = options.id;
        this.updateId=options.modelId||options.id;
        this.attr=options.attr;
        this.type=options.type;
        this.curValue=options.curValue||'';
        this.optext=options.optext;
        var self=this;
        this.render=_.wrap(this.render,function(render){
            render();
            self.afterRender();
        })
        //this.model={attr:options.attr};
    }, 
    template: JST['editbox'],
    cancelEl: '.cancel',
    submitEl: '.ok',
    afterRender:function(model){
        switch(this.type){
            case 'textbox':
            var ele=$('<div/>').html('<p>Text for '+this.attr+'</p><textarea class="reply-content">'+this.curValue+'</textarea>').contents();        
            this.$el.find('.bbm-modal__section').append(ele);
            break;
            case 'singletextbox':
            var ele=$('<div/>').html('<p>Text for '+this.attr+'</p><input type="text" class="reply-content" value="'+this.curValue+'"/>').contents();        
            this.$el.find('.bbm-modal__section').append(ele);
            break;
            case 'selectbox':
            var eletitle=$('<div/>').html('<p>Text for '+this.attr+'</p>').contents();
            var ele=$('<div/>').html('<select class="reply-content"></select>').contents();
            var choices=new Obiwang.Collections[this.selectModel]();
            var self=this;
            choices.fetch().done(function(){
                choices.forEach(function(item){
                    var choice=item.toJSON();
                    var toAdd=$('<option>', { value : choice.id }).text(choice[self.optext]);
                    if(self.filter){
                        var obfilter=JSON.parse(self.filter);
                        for(var key in obfilter){
                            if(choice[key][key]!=obfilter[key]){
                                return;
                            }
                        }
                    }
                    if(self.curValue){
                        if(self.curValue.id==choice.id||self.curValue==choice.id){
                            toAdd.attr('selected', 'selected');
                        }  
                    }
                    ele.append(toAdd);                   
                });
                self.$el.find('.bbm-modal__section').append(eletitle).append(ele);
            });             
            break;
            case 'multiselectbox':
            var eletitle=$('<div/>').html('<p>Text for '+this.attr+'</p>').contents();
            //var ele=$('<div/>');
             var ele=$('<div/>').html('<select class="reply-content" multiple size=10></select>').contents();
            var choices=new Obiwang.Collections[this.selectModel]();
            var self=this;
            choices.fetch().done(function(){
                choices.forEach(function(item){
                    var choice=item.toJSON();
                    //var toAdd=$('<input>', { value : choice.id,type:"checkbox",name:"names[]" }).text(choice[self.optext]);
                    var sel='';
                    var found=_.find(self.curValue,function(e){
                        e=e||{};
                        var atr=e[self.optext];
                        if(e.id==choice.id||atr.id==choice.id){
                            return true;
                        }
                    });
                    if(found){
                        sel='selected=""';
                    }
                    var toAdd=$('<option value="'+choice.id+'"'+sel+'>'+choice[self.optext]+'</option>');
                    if(found){
                        toAdd.css('background-color','#b3d5f3');
                    }
                     //var toAdd=$('<option>', { value : choice.id,selected:sel }).text(choice[self.optext]);
                    if(self.filter){
                        var obfilter=JSON.parse(self.filter);
                        for(var key in obfilter){
                            if(choice[key][key]!=obfilter[key]){
                                return;
                            }
                        }
                    }
                    //search if it exist
                    if(self.curValue){
                        self.curValue.forEach(function(curv){
                            curv=curv[self.optext]||curv;
                            if(curv.id==choice.id||curv==choice.id){
                                toAdd.attr('selected', 'selected');
                                return;
                            }
                        });
                    }
                    ele.append(toAdd);
                    //ele.append($('<br>'));                   
                });
                ele.val(this.curValue);
                self.$el.find('.bbm-modal__section').append(eletitle).append(ele);
            });   
            break;
            case 'boolbox':
            var ele=$('<div/>').html('<select class="reply-content"></select>').contents();
            var toAdd=$('<option>', { value : true }).text('TRUE');
            if(this.curValue){
                ele.append($('<option>', { value : true, selected:'selected' }).text('TRUE'));
                ele.append($('<option>', { value : false}).text('FALSE'));
            }else{
                ele.append($('<option>', { value : true}).text('TRUE'));
                ele.append($('<option>', { value : false, selected:'selected' }).text('FALSE'));
            }
            this.$el.find('.bbm-modal__section').append(eletitle).append(ele);
        }
        return this;
    },
    submit: function () {
        // get text and submit, and also refresh the collection. 
        var content = $('.reply-content').val();
        if(this.type=="multiselectbox") content=content||[];
        var options={};
        options["id"]=this.updateId;
        options[this.attr]=content;
        options._url='/'+this.modelName+'/';
        var toupdate = new Obiwang.Models.simpleModel(options);
        var self=this;
        toupdate.save(options,{
            patch:true,
            success:function(d){
                // refresh parent view
                    self.parentView.rerenderSingle({id:self.rerenderId});
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
/*************************************************Views for Contract *****************************/

var ContractView=Wholeren.baseView.extend({
    templateName:'dateTableView',
    initialize: function (options) {
        this.rank=$('#rank').text();
        this.el=options.el;
        this.collection = new Obiwang.Collections['Contract']();
        this.render({title:"Contracts"});
        $('.page-actions').prepend('<button class="button-add">Add New</button>');
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
        var self=this;
        Promise.all([util.ajaxGET('/contract/getAllOptions/'),util.ajaxGET('/User/')]).spread(function(AllOptions,Users){
            self.ready=true;
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
            var columns=[
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
            {name:'',label:'Delete',cell:BackgridCells.DeleteCell}
            ];
            self.columns=columns;
            self.grid=new Backgrid.Extension.ResponsiveGrid({columns:columns,collection:self.collection,columnsToPin:1,minScreenSize:4000});
            //ResposiveGrid
            //self.grid=new Backgrid.Grid({columns:columns,collection:self.collection});
            $('.table-wrapper').append(self.grid.render().el);
             var paginator = new Backgrid.Extension.Paginator({
                    windowSize: 20, // Default is 10
                    slideScale: 0.25, // Default is 0.5
                    goBackFirstOnSort: false, // Default is true
                    collection: self.collection
                    });
            $('.table-wrapper').append(paginator.render().el);  
            var clientSideFilter = new Backgrid.Extension.ClientSideFilter({
                collection: self.collection,
                placeholder: "Search in the browser",
                // The model fields to search for matches
                fields: ['clientName','contractCategory','lead','leadName','status','major','country','degree'],
                // How long to wait after typing has stopped before searching can start
                wait: 150
            });
            $('.table-wrapper').prepend(clientSideFilter.render().el);               
        });
        
    },
    events: {
    'click  button.button-alt': 'refetch',
    'click  button.button-save': 'save',
    'click button.button-add':'add'
    },    
    refetch:function(e){
        if(!this.ready) return;
        var startDate=$('#startDate').val();
        var endDate=$('#endDate').val();
        this.collection.setdate({startDate:startDate,endDate:endDate});
        this.collection.reset();
        if(this.collection.fullCollection)this.collection.fullCollection.reset();
        this.collection.fetch({reset:true});
    },   
    save:function(e){
        util.saveCSV((this.collection||{}).fullCollection?this.collection.fullCollection:this.collection,this.columns);
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
// var ContractServiceView=Backbone.Modal.extend({
//     prefix:"bbm",
//     template: JST['editbox'],
//     submitEl: '.ok',
//     cancelEl:'.cancel',
//      events:{
//         'click .button-add-invoice':'addnew'
//     },
//     initialize: function (options){
//         _.bindAll(this,  'render', 'afterRender');
//         var self=this;
//         this.render=_.wrap(this.render,function(render){
//             render();
//             self.afterRender();
//         });
//         this.contractID=parseInt(options.id);
//         this.collection=new Obiwang.Collections.Invoice();
//         this.collection.contract=this.contractID;
//     },     
//     addnew:function(e){
//         e.preventDefault();
//         var toAdd=new Obiwang.Models.Invoice({_url:'/Invoice/'});
//         toAdd.setContract({contract:this.contractID});
//         var self=this;
//         toAdd.save(null,{
//             success:function(model){
//                 self.collection.add(toAdd);
//             },
//             error:function(response,model){
//                 util.handleRequestError(response);
//             },
//             save:false
//         });  
//     },
//     afterRender:function(model){
//         var container=this.$el.find('.bbm-modal__section');
//         container.append('<button class="button-add-invoice">Add New</button>');
//         var DeleteCell = BackgridCells.DeleteCell;
//         var ServiceInvoiceCell=Backgrid.Cell.extend({
//             template: _.template("<a href='#'>Details</a>"),
//             events: {
//               "click a": "showDetails"
//             },
//             showDetails: function (e) {
//               e.preventDefault();
//               e.stopPropagation();
//               var childview=new ServiceInvoiceView({invoice:this.model});
//               childview.render();
//               $('.app').append(childview.el);
//             },
//             render: function () {
//               this.$el.html(this.template());
//               this.delegateEvents();
//               return this;
//             }
//         });
//         var self=this;
//         Promise.all([util.ajaxGET('/DepositAccount/'),util.ajaxGET('/PaymentOption/')]).spread(function(account,payment){
//             var selection=_.map(account,function(e){return [e.account,e.id]});
//             var ps=_.map(payment,function(e){return [e.paymentOption,e.id]})
//             var accountSelect=Backgrid.SelectCell.extend({
//                 optionValues:  [{name:"Users",values:selection}],
//                 formatter:_.extend({}, Backgrid.SelectFormatter.prototype, {
//                     toRaw: function (formattedValue, model) {
//                       return formattedValue == null ? null: parseInt(formattedValue);
//                     }
//                 })
//             });
//             var paymentSelect=accountSelect.extend({
//                 optionValues:[{name:"Users",values:ps}],
//             });
//             var columns=[
//             {name:'nontaxable',label:'申请费',cell:'number'},
//             {name:'remittances',label:'shouxu',cell:'number'},
//             {name:'other',label:'其他费用',cell:'number'},
//             {name:'service',label:'服务收费',editable:false,cell:'number'},
//             {name:'total',label:'Total',editable:false,cell:'number'},
//             {name:'depositAccount',label:'收款账户',cell:accountSelect},
//             {name:'paymentOption',label:'收款方式',cell:paymentSelect},
//             {name:'',label:'具体服务收费',cell:ServiceInvoiceCell},
//             {name:'',label:'Delete Action',cell:DeleteCell}
//             ];

//             self.grid=new Backgrid.Grid({columns:columns,collection:self.collection});
//             container.append(self.grid.render().el);
//             self.collection.fetch({reset:true});
//         });

//         return this;
//     },
//     submit: function () {
//         // get text and submit, and also refresh the collection. 
//         this.grid.remove();
//         this.close();

//     },
//     checkKey:function(e){
//         if (this.active) {
//             if (e.keyCode==27) return this.triggerCancel();
//         }
//     }
// });
var ContractInvoiceView=Backbone.Modal.extend({
    prefix:"bbm",
    template: JST['editbox'],
    submitEl: '.ok',
    cancelEl:'.cancel',
    events:{
        'click .button-add-invoice':'addnew'
    },
    initialize: function (options){
        _.bindAll(this,  'render', 'afterRender');
        var self=this;
        this.render=_.wrap(this.render,function(render){
            render();
            self.afterRender();
        });
        this.contractID=parseInt(options.id);
        this.collection=new Obiwang.Collections.Invoice();
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
        Promise.all([util.ajaxGET('/DepositAccount/'),util.ajaxGET('/PaymentOption/')]).spread(function(account,payment){
            var accountSelect=BackgridCells.SelectCell({name:"收款账户",values:_.map(account,function(e){return [e.account,e.id]})});
            var paymentSelect=BackgridCells.SelectCell({name:"付款方式",values:_.map(payment,function(e){return [e.paymentOption,e.id]})});
            var columns=[
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

            self.grid=new Backgrid.Grid({columns:columns,collection:self.collection});
            container.append(self.grid.render().el);
            self.collection.fetch({reset:true});
        });

        return this;
    },
    submit: function () {
        // get text and submit, and also refresh the collection. 
        this.grid.remove();
        this.close();

    },
    checkKey:function(e){
        if (this.active) {
            if (e.keyCode==27) return this.triggerCancel();
        }
    }
});
var ServiceInvoiceView=Backbone.Modal.extend({
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
        this.invoice=options.invoice;
        this.invoiceID=parseInt(this.invoice.id);
        this.collection=new Obiwang.Collections.ServiceInvoice({invoice:this.invoiceID});
    },
    events:{
        'click .button-add-invoice':'addnew'
    },
    afterRender:function(model){
        var container=this.$el.find('.bbm-modal__section');
        container.append('<button class="button-add-invoice">Add New</button>');
        var self=this;
        util.ajaxGET('/ServiceType/').then(function(data){
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
            var columns=[
                {name:'serviceType',label:'服务',cell:type},
                {name:'price',label:'服务价格',cell:'number'},
                {name:'paid',label:'已付',editable:false,cell:'number'},
                {name:'paidAmount',label:'付款',cell:'number'},
                {name:'',label:'删除',cell:deletecell}
                ];
            var grid=new Backgrid.Grid({columns:columns,collection:self.collection});
            container.append(grid.render().el);
            self.collection.fetch({reset:true});
        });
        
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
    checkKey:function(e){
        if (this.active) {
            if (e.keyCode==27) return this.triggerCancel();
        }
    }
});
// var ContractView=Wholeren.FormView.extend({
//     serviceTypes:{},
//     ready:false,
//     singleTemplate:JST['contractSingle'],
//     templateName:'contract',
//         initialize: function (options) {
//             this.rank=$('#rank').text();
//             _.bindAll(this,'rerenderSingle');
//             _.bindAll(this,'renderCollection');
//             _.bindAll(this,'renderCollectionCore');
//             _.bindAll(this,'renderSingle');
//             _.bindAll(this,'modifyRow');
//             this.serviceTypes=new Obiwang.Collections.ServiceType();
//             var self=this;
//             this.render();
//           // $('.Contracts.responsive').floatThead();
//           this.collection = new Obiwang.Collections.Contract();
//           if(options.id){
//                 var model=new Obiwang.Models.simpleModel({_url:'/Contract/',id:options.id});
//                 model.fetch().then(function(){
//                     if(model)
//                         self.collection.add(model);
//                     self.renderCollection();
//                     self.collection.on("sort", self.renderCollection, self);
//                 }).fail(function(err){
//                     util.handleRequestError(err); 
//                 });
//             }else if (!this.collection || this.collection.length < 1) {
                
//                 self.collection.on("sort", self.renderCollection, self);
//                 self.collection.on("reset", self.renderCollection, self);
//             }    
//             // Now get filters
//             $.ajax({
//                 url: '/contract/getFilters/',
//                 type: 'GET',
//                 headers: {
//                     'X-CSRF-Token': $("meta[name='csrf-param']").attr('content')
//                 },
//                 success: function (data) {
//                     self.renderFilterButtons(data);                
//                 },
//                 error: function (xhr) {
//                     console.log('error');
//                 }
//             });
//             //self.collection.on("sort", this.renderCollection, this); 
//         },
//         events: {
//         'click  button.button-add': 'editView',
//         'click  button.button-alt': 'refetch',
//         'click  a.payment':'showPayment',
//         'change .filter':'renderCollection',
//         'click .clickablecell':'editContract2',
//         'click .edit,.del':'editContract',
//         'click .textbox,.selectbox,.multiselectbox,.singletextbox,.boolbox':'editAttr',
//         'click th.sortable':'sortCollection',
//         'click .comment_edit':'showComments',
//         'click a.page':'switchPage'
//         },     
//         refetch:function(e){
//             var startDate=$('#startDate').val();
//             var endDate=$('#endDate').val();
//             this.collection.setdate({startDate:startDate,endDate:endDate});
//             this.collection.endDate=endDate;
//             this.removeAll();
//             this.collection.fetch({reset:true}).fail(function(err){
//                     util.handleRequestError(err); 
//                 });;;
//         },
//         renderCollection: function (){
//             var self=this;

//             if(!this.ready){
//                 this.serviceTypes=new Obiwang.Collections.ServiceType();
//                 this.serviceTypes.fetch({ reset: true }).done(function(data){self.ready=true;self.renderCollectionCore();}); 
//             }else{
//                 this.renderCollectionCore();
//             }
//             $('#total_count').text(this.contractLength);
//         },
//         headline:function(obj){
//             if(obj.client){
//                 var text=obj.client.chineseName;
//                 if(text)
//                     return text.substring(0,14);
//                 else
//                     return "NO NAME";
//             }else{
//                 return "NO NAME";
//             }
//         },
//         editView: function(){
//             var popUpView = new ContractEdit({view:this});
//             $('.app').html(popUpView.render().el);
//         },
//         editContract2: function(e){
//             var id = $(e.currentTarget).data("id");
//             var item = this.collection.get(id);
//             console.log("clicked item ",item);
//             var popUpView = new ContractEdit({view:this,model:item});
//             $('.app').html(popUpView.render().el);
//         },
//         editContract:function(e){
//             // Service id
//             var item=$(e.currentTarget);
//             var id = item.attr('href').substring(1);
//             var action=item.attr('class');
//             var self=this;
//             switch(action){
//                 case 'del':
//                     var newApp=new Obiwang.Models.simpleModel({_url:'/Contract/',id:id});
//                     newApp.destroy({
//                         success:function(d){
//                             self.rerenderSingle({id:id,del:true});            
//                         },
//                         error:function(model,response){
//                             util.handleRequestError(response);                       
//                         }
//                     });
//                     break;
//                 case 'edit':
//                     var curCont=this.collection.get(id);
//                     if(!curCont){
//                         return;
//                     }
//                     var popUpView = new ContractEdit({view:this,model:curCont});
//                     $('.app').html(popUpView.render().el);
//             }
//         },
//         showComments:function(e){
//             var item=$(e.currentTarget);
//             var id = item.attr('href').substring(1);
//             var m=new CommentModalView({cid:id});
//             $('.app').html(m.renderAll().el);
//         } ,
//         showPayment:function(e){
//             var item=$(e.currentTarget);
//             var id = item.parent().parent().attr('name');
//             var ci= new ContractInvoiceView({id:id});
//             ci.render();
//             $('.app').html(ci.el);
//         }
// });



/**

TODO: refresh view after submit--done
    validator on every input.  -done
    reduce the ajax call to get selection options. -done
*/
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
/*************************************************Views for Services *****************************/
// var ServiceView=Wholeren.FormView.extend({
//     filter:[],
//     singleTemplate:JST['serviceSingle'],
//     user:{},
//     ready:false,
//     templateName:'service',
//         initialize: function (options) {
//             this.rank=$('#rank').text();
//             _.bindAll(this,'rerenderSingle');
//             _.bindAll(this,'renderCollection');
//             _.bindAll(this,'renderCollectionCore');
//             this.el=options.el;
//             this.user=new Obiwang.Collections.User();
//             var self=this;
//             this.collection = new Obiwang.Collections.Service();
//             this.render();
//             if(options.id){
//                 var model=new Obiwang.Models.simpleModel({_url:'/Service/',id:options.id});
//                 model.fetch().then(function(){
//                     if(model)
//                         self.collection.add(model);
//                     self.ready=true;
//                     self.renderCollectionCore();
//                     self.collection.on("sort", self.renderCollection, self);
//                 }).fail(function(err){
//                     util.handleRequestError(err); 
//                 });
//             }else {
//                 this.collection.fetch().then(function(){
//                     self.ready=true;
//                     self.renderCollectionCore();
//                     self.collection.on("sort", self.renderCollection, self);
//                 }).fail(function(err){
//                     util.handleRequestError(err); 
//                 });;
//             }
//             self.collection.on("reset",self.renderCollection,self);
//              // Now get filters
//             $.ajax({
//                 url: '/service/getFilters/',
//                 type: 'GET',
//                 headers: {
//                     'X-CSRF-Token': $("meta[name='csrf-param']").attr('content')
//                 },
//                 success: function (data) {
//                     self.renderFilterButtons(data);                
//                 },
//                 error: function (xhr) {
//                     console.log('error');
//                 }
//             });
//         },
//         events: {
//         'click .add,.edit,.del':'editApplication',
//         'click  button.button-alt': 'refetch',
//         'change .filter':'renderCollection',
//         'click .textbox,.selectbox,.multiselectbox':'editAttr',
//         'click .sortablehead':'sortCollection',
//         'click .comment_edit':'showComments',
//         'click a.page':'switchPage',
//         'click .pop':'editTeacher'
//         },    
//         editTeacher:function(e){
//             e.preventDefault();
//             var item =$(e.currentTarget);
//             var id = item.parent().parent().attr('name');
//             var type=item.data('type');
//             var teacherview= new ServicePopup({id:id,type:type});
//             teacherview.render();
//             $('.app').html(teacherview.el);
//         },
//         refetch:function(e){
//             var startDate=$('#startDate').val();
//             var endDate=$('#endDate').val();
//             this.collection.setdate({startDate:startDate,endDate:endDate});
//             this.collection.endDate=endDate;
//             this.removeAll();
//             this.collection.fetch({reset:true});
//         },    
//         renderCollection: function (){
//             // if(this.ready){
//                 this.resetCollection();
//                 this.renderCollectionCore();       
//             // }else{
//             //      var self=this;
//             //     this.user=new Obiwang.Collections.User();
//             //     this.user.fetch().done(function(data){
//             //         self.ready=true;
//             //         self.resetCollection();
//             //         self.renderCollectionCore();
//             //     }); 
//             // }            
//         },
//         resetCollection:function(){
//             this.collection.forEach(function(serv){
//                 var apps=serv.get('application');
//                 if(apps){
//                     apps.forEach(function(app){
//                         app.display=true;
//                     });
//                 }
//                 serv.set('application',apps);
//             });
//         },
//         headline:function(obj){
//             if(obj.contract.client){
//                 return obj.contract.client.chineseName;                
//             }else{
//                 return "NO NAME";
//             }
//         },
//         modifyRow:function(obj){
//             var self=this;
//             if(obj.application){
//                 obj.application.forEach(function(ele){
//                     var id=parseInt(ele.writer);
//                     if(id){
//                         ele.writer=self.user.get(id).toJSON();
//                     }
//                 });   
//             }
//             // var id=obj.contract.client;
//             // if(id){
//             //     obj.contract.client=self.client.get(id).toJSON();
//             // }
//             if(this.rank>1){
//                 obj.displayDelete=1;
//             }
//             return obj;
//         },
//         editApplication:function(e){
//             // Service id
//             var item=$(e.currentTarget);
//             var id = item.parent().parent().attr('name');
//             var action=item.attr('class');
//             var appid=item.attr('href').substring(1);
//             var curService = this.collection.get(id);
//             var self=this;
//             switch(action){
//                 case 'add':
//                     var newApp=new Obiwang.Models.simpleModel({_url:'/Application/',service:id});
//                     newApp.save({},{
//                         success:function(d){
//                             self.rerenderSingle({id:id});            
//                         },
//                         error:function(model,response){
//                             util.handleRequestError(response);                       
//                         }
//                     });
//                     break;
//                 case 'del':
//                     var newApp=new Obiwang.Models.simpleModel({_url:'/Application/',id:appid});
//                     newApp.destroy({
//                         success:function(d){
//                             self.rerenderSingle({id:id});            
//                         },
//                         error:function(model,response){
//                             util.handleRequestError(response);                       
//                         }
//                     });
//                     break;
//                 case 'edit':
//                     var apps=curService.get('application')||[];
//                     var curApp;
//                     apps.forEach(function(ele){
//                         if(ele.id==appid){
//                             curApp=ele;
//                             return;
//                         }
//                     });
//                     if(!curApp){
//                         return;
//                     }

//                     var popUpView = new ApplicationEdit({view:this,service:curService,curApp:curApp});
//                     $('.app').html(popUpView.render().el);
//             }             
//         },
//         showComments:function(e){
//             var item=$(e.currentTarget);
//             var id = item.attr('href').substring(1);
//             var type=item.data('type');
//             if(type=='app'){
//                 var m=new CommentModalView({aid:id});
//                 $('.app').html(m.renderAll().el); 
//             }else{
//                 var m=new CommentModalView({sid:id});
//                 $('.app').html(m.renderAll().el); 
//             }
            
//         }  
//         // renderCollectionCore:function(){
//         // // Remove all keywords
//         // var toRemove = $('.content tr').not('#scrollableheader').not('#pinnedheader');
//         // toRemove.remove();
//         // var headrow=$('#scrollableheader');
//         // var stableheadrow=$('#pinnedheader');
//         // var self=this;
//         // this.collection.forEach(function(item){
//         //     var obj=item.toJSON();
//         //     obj.application.forEach(function(ele){
//         //         var id=ele.writer;
//         //         if(id){
//         //             ele.writer=self.user.get(id).toJSON();
//         //         }
//         //     });
//         //     var id=obj.contract.client;
//         //     if(id){
//         //         obj.contract.client=self.client.get(id).toJSON();
//         //     }
//         //     var ele = self.singleTemplate(obj);
//         //     var toInsert = $('<div/>').html(ele).contents();
//         //     toInsert.insertAfter(headrow);
//         //     var headline='';
//         //     if(obj.contract.client){
//         //         headline=obj.contract.client.chineseName;
                
//         //     }
//         //     if(!headline){
//         //             headline="NO NAME";
//         //     }
//         //     var headInsert=$('<div/>').html('<tr><td data-id="'+obj.id+'" class="clickablecell" name="'+obj.id+'">'+headline+'</td></tr>').contents();
//         //     headInsert.insertAfter(stableheadrow);
//         // });     
//         // },
// });

var ServiceView=Wholeren.baseView.extend({
    templateName:'dateTableView',
    ready:true,
    initialize: function (options) {
        this.rank=$('#rank').text();
        this.el=options.el;
        this.collection = new Obiwang.Collections['Service']();
        this.render({title:"Services"});
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
        Promise.all([util.ajaxGET('/ServiceProgress/'),util.ajaxGET('/Degree/')]).spread(function(progress,degree){
            var progressselect=BackgridCells.SelectCell({name:"Progress",values:_.map(progress,function(e){return [e.serviceProgress,e.id]})});
            var degreeselect=BackgridCells.SelectCell({name:"Degree",values:_.map(degree,function(e){return [e.degree,e.id]})});
            var columns=[
            {name:'chineseName',label:'用户名字',editable:false,cell:'string'},
            {name:'nickname',label:'负责老师',editable: false,cell:'string'},
            {name:'serviceProgress',label:'状态',cell:progressselect},                    
            {name:'contractSigned',label:'进入服务时间',editable:false,cell:'date'},
            {name:'type',label:'服务类型',editable:false,cell:'string'},
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
            {name:'step1',label:'step1',cell:'date'},
            {name:'step2',label:'step2',cell:'date'},
            {name:'studentDestination',label:'学生去向',cell:'string'},
            {name:'',label:'Show Applications',cell:appPopup},
            {name:'',label:'Comment',cell:comment},
            {name:'',label:'Show Details',cell:popup},
            ];
            self.columns=columns;
            self.grid=new Backgrid.Extension.ResponsiveGrid({columns:columns,collection:self.collection,columnsToPin:1,minScreenSize:4000});
            //ResposiveGrid
            //self.grid=new Backgrid.Grid({columns:columns,collection:self.collection});
            $('.table-wrapper').append(self.grid.render().el);
             var paginator = new Backgrid.Extension.Paginator({
                    windowSize: 20, // Default is 10
                    slideScale: 0.25, // Default is 0.5
                    goBackFirstOnSort: false, // Default is true
                    collection: self.collection
                    });
            $('.table-wrapper').append(paginator.render().el);  
            var clientSideFilter = new Backgrid.Extension.ClientSideFilter({
                collection: self.collection,
                placeholder: "Search in the browser",
                // The model fields to search for matches
                fields: ['chineseName','type','degree','previousSchool','major','studentDestination','nickname'],
                // How long to wait after typing has stopped before searching can start
                wait: 150
            });
            $('.table-wrapper').prepend(clientSideFilter.render().el);               
        });
        
    },
    events: {
    'click  button.button-alt': 'refetch',
    'click  button.button-save': 'save'
    },    
    refetch:function(e){
        if(!this.ready) return;
        var startDate=$('#startDate').val();
        var endDate=$('#endDate').val();
        this.collection.setdate({startDate:startDate,endDate:endDate});
        this.collection.reset();
        if(this.collection.fullCollection)this.collection.fullCollection.reset();
        this.collection.fetch({reset:true});
    },   
    save:function(e){
        util.saveCSV((this.collection||{}).fullCollection?this.collection.fullCollection:this.collection,this.columns);
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
        var toAdd=new Obiwang.Models.syncModel({_url:'/ServiceDetail/'});
        toAdd.set('service',this.serviceID,{save:false});
        toAdd.set('type',this.type,{save:false});
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
        Promise.all([util.ajaxGET('/ServiceComission/roles/'),util.ajaxGET('/ServiceComission/level/'),util.ajaxGET('/User/')]).spread(function(roles,data,users){
            var roleselect=BackgridCells.SelectCell({name:'职位',values:roles});
            var userselect=BackgridCells.SelectCell({name:'Users',values:_.map(users,function(e){return [e.nickname,e.id]})});
            var levelselect=roleselect.extend({
                optionValues:function(){
                    var cell=this;
                    var role=this.model.get('servRole')||0;
                    var type=this.model.get('type')||0;
                    self.cache[role]=self.cache[role]||[];
                    self.cache[role][type]=self.cache[role][type]||[];
                    self.cache[role][type]["level"]=self.cache[role][type]["level"]||[];
                    if(self.cache[role][type]["level"].length<1){                     
                        var shrunk=_.where(data,{servRole:role,serviceType:type});
                        var shrunk2=_.where(data,{servRole:role,serviceType:0}).forEach(function(e){
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
                    var type=this.model.get('type')||0;
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
        var toAdd=new Obiwang.Models.simpleModel({_url:'/Application/'});
        toAdd.set('service',this.serviceID);
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
            var UpdateCell=BackgridCells.UpdateCell;
            var DateCell=Backgrid.DateCell.extend({
                formatter:{
                    fromRaw:function(rawValue,model){
                        var d=moment(rawValue);
                        return d.format('YYYY-MM');
                    },
                    toRaw:function(formattedData, model){
                        var d=moment(formattedData,'YYYY-MM');
                        return d;
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
var SalesComissionView=Wholeren.baseView.extend({
    templateName:'serviceComission',
    ready:true,
    initialize: function (options) {
        this.rank=$('#rank').text();
        this.el=options.el;
        this.collection = new Obiwang.Collections['Comission']({url:'/SalesComission/'});
        this.render({title:"sales"});
        var testroles;
        var self=this;
        this.ready=false;
        util.ajaxGET('/SalesComission/roles/').then(function(data){
                var myselect=BackgridCells.SelectCell({name:'Roles',values:[{name:"role",values:data}]});
                var columns=[
                {name:'chineseName',label:'用户名字',editable:false,cell:'string'},
                {name:'nickname',label:'销售名字',editable: false,cell:'string'},
                {name:'serviceType',label:'服务类型',cell:'string'},
                {name:'contractPaid',label:'付款时间',editable:false,cell:'date'},
                {name:'price',label:'服务价格',editable:false,cell:'number'},
                {name:'realPaid',label:'实际收入',editable:false,cell:'number'},
                {name:'salesRole',label:'销售任务',cell:myselect},
                {name:'comissionPercent',label:'佣金百分比',editable: false,cell:Backgrid.NumberCell.extend({decimals:3})},
                {name:'flatComission',label:'佣金非百分比',editable: false,cell:'number'},
                {name:'comission',label:'服务佣金百分比',editable: false,cell:'number'},
                {name:'extra',label:'其他',cell:'number'},
                {name:'final',label:'总佣金',cell:'number'}
                ];
                self.columns=columns;
                self.grid=new Backgrid.Grid({columns:columns,collection:self.collection});
                $('.table-wrapper').append(self.grid.render().el);
                // $.backgridFixedHeader({
                //     grid:self.grid,
                //     container:$('.table-wrapper')
                // });
                var paginator = new Backgrid.Extension.Paginator({
                windowSize: 20, // Default is 10
                slideScale: 0.25, // Default is 0.5
                goBackFirstOnSort: false, // Default is true
                collection: self.collection
                });
                $('.table-wrapper').append(paginator.render().el);
                self.ready=true;
                }).error(function(err){
                    console.log(err);
                });        
    },
    events: {
    'click  button.button-alt': 'refetch',
    'click  button.button-save': 'save',
    'click a.page':'switchPage'
    },    
    refetch:function(e){
        if(!this.ready) return;
        var year=$('#year').val();
        var month=$('#month').val();
        this.collection.setdate({year:year,month:month});
        this.collection.reset();
        if(this.collection.fullCollection)this.collection.fullCollection.reset();
        this.collection.fetch({reset:true});
    },   
    save:function(e){
        util.saveCSV((this.collection||{}).fullCollection?this.collection.fullCollection:this.collection,this.columns);
    }
});

var ServiceComissionView=SalesComissionView.extend({
    templateName:'serviceComission',
    initialize: function (options) {
        this.rank=$('#rank').text();
        this.el=options.el;
        this.cache=[];
        var self=this;
        this.collection = new Obiwang.Collections['Comission']({url:'/ServiceComission/'});
        this.render({title:"service"});
        Promise.all([util.ajaxGET('/ServiceComission/roles/'),util.ajaxGET('/ServiceComission/level/')]).spread(function(roles,data){
            var roleselect=BackgridCells.SelectCell({name:'Roles',values:roles});
            var levelselect=roleselect.extend({
                optionValues:function(){
                    var cell=this;
                    var role=this.model.get('servRole')||0;
                    var type=this.model.get('type')||0;
                    self.cache[role]=self.cache[role]||[];
                    self.cache[role][type]=self.cache[role][type]||[];
                    self.cache[role][type]["level"]=self.cache[role][type]["level"]||[];
                    if(self.cache[role][type]["level"].length<1){                     
                        var shrunk=_.where(data,{servRole:role,serviceType:type});
                        var shrunk2=_.where(data,{servRole:role,serviceType:0}).forEach(function(e){
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
                    var type=this.model.get('type')||0;
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
            var columns=[
                {name:'chineseName',label:'用户名字',editable:false,cell:'string'},
                {name:'nickname',label:'老师名字',editable: false,cell:'string'},
                {name:'serviceType',label:'服务类型',editable: false,cell:'string'},
                {name:'contractPaid',label:'付款时间',editable:false,cell:'Date'},
                {name:'servRole',label:'老师任务',editable:false,cell:roleselect},
                {name:'servLevel',label:'文书level',editable:false,cell:levelselect},
                {name:'startprogress',label:'月初进度',editable:false,cell:statusselect},
                {name:'endprogress',label:'月末进度',editable:false,cell:statusselect},
               // {name:'extra',label:'Extra',cell:'number'},
                {name:'startComission',label:'月初佣金',editable: false,cell:'number'},
                {name:'endComission',label:'月末佣金',editable: false,cell:'number'},
                {name:'monthlyComission',label:'本月佣金',editable:false,cell:'number'},
                // {name:'final',label:'佣金',cell:'number'}
                ];

            self.columns=columns;
            self.grid=new Backgrid.Grid({columns:columns,collection:self.collection});
                
            var paginator = new Backgrid.Extension.Paginator({
                windowSize: 20, // Default is 10
                slideScale: 0.25, // Default is 0.5
                goBackFirstOnSort: false, // Default is true
                collection: self.collection
                });
                $('.table-wrapper').append(paginator.render().el);
                $('.table-wrapper').append(self.grid.render().el);
                //$('.table-wrapper').append(html);
                self.ready=true;
            }).error(function(err){
                console.log(err);
            });  
    },    
});
var AssisComissionView=SalesComissionView.extend({
    initialize: function (options) {
        this.rank=$('#rank').text();
        this.el=options.el;
        this.collection = new Obiwang.Collections['Comission']({url:'/AssistantComission/'});
        this.render({title:"assisatnace"});
        var self=this;
        var columns=[
        {name:'chineseName',label:'客户名字',editable: false,cell:'string'},
        //{name:'contract',label:'Contract',editable:false,cell:'string'},
        {name:'user',label:'User',editable: false,cell:'string'},
        {name:'createdAt',label:'咨询时间',editable:false,cell:'Date'},
        {name:'contractPaid',label:'付款时间',editable:false,cell:'Date'},
        {name:'email',label:'邮件数',editable: false,cell:'number'},
        {name:'comission',label:'佣金',editable: false,cell:'number'},
        ];

        self.columns=columns;
        this.grid=new Backgrid.Grid({columns:columns,collection:self.collection});
        $('.table-wrapper').append(this.grid.render().el);      
        var paginator = new Backgrid.Extension.Paginator({
            windowSize: 20, // Default is 10
            slideScale: 0.25, // Default is 0.5
            goBackFirstOnSort: false, // Default is true
            collection: self.collection
            });
        $('.table-wrapper').append(paginator.render().el);  
    },
});
var Comission={
    'sales':SalesComissionView,
    'service':ServiceComissionView,
    'assis':AssisComissionView
};


// var ApplicationEdit=EditForm.extend({
//     template: JST['serviceEdit'],
//     events:{
//         "click .ok":"Submit",
//         "change select:not([id^='client.'])":"selectionChanged",
//         "change input":"inputChanged",
//     },
//     initialize: function (options){
//         this.parentView = options.view;
//         if(!options.service||!options.curApp){
//             util.showError("No service or application selected!");
//             this.close();
//             return;
//         }
//         this.serviceId=options.service.id;
//         this.model=new Obiwang.Models.simpleModel(options.curApp);
//         this.model._url='/Application/';
//         this.model.set('service',options.service.toJSON());
//         this.modelChanges.id=this.model.get('id');
//         _.bindAll(this,'renderSelect');
//         _.bindAll(this,'render', 'afterRender'); 
//         var _this = this;
//         this.render = _.wrap(this.render, function(render) {
//           render();
//           _this.afterRender();
//           return _this;
//         }); 
//     }, 
//     Submit:function(option){
//         if(this.formError) return;
//         var self=this;
//         var changes=JSON.parse(JSON.stringify(this.modelChanges));
//         this.model.save(changes,{
//             patch:true,
//             success:function(d){
//                 // refresh parent view
//                 self.parentView.rerenderSingle({id:self.serviceId});
//                 return self.close();
                  
//             },
//             error:function(model,response){
//                 util.handleRequestError(response);                       
//             }
//         });
//     },
//     afterRender:function(){
//          var self=this;
//         $.ajax({
//             url: '/User/?role=4',
//             type: 'GET',
//             headers: {
//                 'X-CSRF-Token': $("meta[name='csrf-param']").attr('content')
//             },
//             success: function (data) {
//                     self.renderSelect({name:'writer',content:data});
                                
//             },
//             error: function (xhr) {
//                 console.log('error');
//             }
//         });
//     },
//     renderSelect:function(collection){
//         var col=collection.content;
//         var tableName=collection.name;   
//         tableName=tableName.charAt(0).toLowerCase() + tableName.slice(1);
//         var self=this; 
//         var theSel=$('#'+tableName).find('option').remove().end();
//         theSel.append('<option></option>');
//         col.forEach(function(item){
//             var ele=item;
//             var toAdd=$('<option>', { value : ele.id }).text(ele['nickname']);
//             if(self.model.get(tableName)&&((self.model.get(tableName).id&&self.model.get(tableName).id==ele.id)||self.model.get(tableName)==ele.id)){
//                 toAdd.attr('selected','selected');
//             }
//             theSel.append(toAdd); 
//         });  
//     },
// });
var UserView=Wholeren.baseView.extend({
    templateName:'dateTableView',
    initialize: function (options) {
        this.rank=$('#rank').text();
        this.el=options.el;
        this.collection = new Obiwang.Collections['User']();
        this.render({title:"Services"});
        var self=this;
        this.collection.fetch().done(function(){
            return Promise.all([util.ajaxGET('/Role/'),util.ajaxGET('/User/'),util.ajaxGET('/UserLevel/')]).spread(function(role,user,level){
            var roleselect=Backgrid.SelectCell.extend({
                optionValues:function(){
                    var selection=_.map(role,function(e){return [e.role,e.id]});
                    return [{name:"Role",values:selection}];
                },
                formatter:_.extend({}, Backgrid.SelectFormatter.prototype, {
                    toRaw: function (formattedValue, model) {
                      return formattedValue == null ? null: parseInt(formattedValue);
                    }
                })
            });
            var userselect=Backgrid.SelectCell.extend({
                optionValues:function(){
                    var selection=_.map(user,function(e){return [e.nickname,e.id]});
                    return [{name:"User",values:selection}];
                },
                formatter:_.extend({}, Backgrid.SelectFormatter.prototype, {
                    toRaw: function (formattedValue, model) {
                      return formattedValue == null ? null: parseInt(formattedValue);
                    }
                })
            });
            var levelselect=Backgrid.SelectCell.extend({
                optionValues:function(){
                    var selection=_.map(level,function(e){return [e.userLevel,e.id]});
                    return [{name:"UserLevel",values:selection}];
                },
                formatter:_.extend({}, Backgrid.SelectFormatter.prototype, {
                    toRaw: function (formattedValue, model) {
                      return formattedValue == null ? null: parseInt(formattedValue);
                    }
                })
            });
            var booleanCell=Backgrid.BooleanCell.extend({
                formatter:{
                    fromRaw:function(modelValue){
                        if(modelValue==true) return true;
                        return false;
                    },
                    toRaw:function(formattedValue,model){
                        return formattedValue =="true" ?true:false;
                    }
                }
            });
            var columns=[
            {name:'nickname',label:'称呼',editable: false,cell:'string'},
            {name:'firstname',label:'姓',editable:false,cell:'string'},                    
            {name:'lastname',label:'名',editable:false,cell:'string'},
            {name:'email',label:'邮箱',editable:false,cell:'string'},
            {name:'role',label:'职位',cell:roleselect},
            {name:'userLevel',label:'佣金等级',cell:levelselect},
            {name:'rank',label:'职位等级',cell:'number'},
            {name:'boss',label:'主管',cell:userselect},
            {name:'active',label:'在职',cell:'boolean'}
            ];
            self.columns=columns;
            self.grid=new Backgrid.Extension.ResponsiveGrid({columns:columns,collection:self.collection,columnsToPin:1,minScreenSize:4000});
            //ResposiveGrid
            //self.grid=new Backgrid.Grid({columns:columns,collection:self.collection});
            $('.table-wrapper').append(self.grid.render().el);             
        });
        }).fail(function(err){
            console.log(err);
        });
        
    },   
    save:function(e){
        util.saveCSV((this.collection||{}).fullCollection?this.collection.fullCollection:this.collection,this.columns);
    }
    });
// var UserView=Wholeren.FormView.extend({
//     filter:[],
//     singleTemplate:JST['userSingle'],
//     ready:false,
//     templateName:'user',
//         initialize: function (options) {
//             _.bindAll(this,'rerenderSingle');
//             _.bindAll(this,'renderCollection');
//             _.bindAll(this,'renderCollectionCore');
//             this.el=options.el;
//             var modelName=this.templateName.charAt(0).toUpperCase() + this.templateName.slice(1);
//             var self=this;
//             this.collection = new Obiwang.Collections[modelName]();
//             this.render();
//             this.collection.fetch().done(function(){
//                 self.ready=true;
//                 self.renderCollectionCore();
//                 self.collection.on("sort", self.renderCollection, self);
//             });
            
//         },
//         events: {
//         'click .singletextbox,.textbox,.selectbox,.multiselectbox,.boolbox':'editAttr',
//         'click .sortable':'sortCollection',
//         },        
//         renderCollection: function (){
//             if(this.ready){
//                 this.renderCollectionCore();       
//             }else{
//                  var self=this;
//                 this.collection.fetch().done(function(){
//                 self.ready=true;
//                 self.renderCollectionCore();
//             });
//             }            
//         },
//         headline:function(obj){
//                 return "NO NAME";
//         },
//         modifyRow:function(obj){

//             return obj;
//         },
// });
var CommentView=Wholeren.baseView.extend({
    tagName:'li',
    template: JST['commentSingle'],
    events: {
      "dblclick .view"  : "edit",
      "click a.destroy" : "clear",
      "keypress .editComment"  : "updateOnEnter",
      "blur .editComment"      : "close"
    },
    initialize: function() {
      this.listenTo(this.model, 'change', this.render);
      this.listenTo(this.model, 'destroy', this.remove);
    },
    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      this.input = this.$('.editComment');
      return this;
    },
    edit: function() {
      this.$el.addClass("editing");
      this.input.focus();
    },
    clear: function() {
      this.model.destroy();
    },
    updateOnEnter: function(e) {
      if (e.keyCode == 13) this.close();
    },
    close: function() {
      var value = this.input.val();
      if (!value) {
        this.clear();
      } else {
        this.model.save({comment: value});
        this.$el.removeClass("editing");
      }
    },
});
var CommentModalView=Backbone.Modal.extend({
    viewContainer:'.app',
    //el: $("#todoapp"),
    template: JST['comment'],
    cancelEl: '.cancel',
    submitEl: '.ok',
    prefix:'small-bbm',
    events: {
      "keypress #new-todo":  "createOnEnter",
    },
    initialize: function(option) {
        this.cid=option.cid;
        this.sid=option.sid;
        this.aid=option.aid;
        if(this.cid){
            this.Todos=new Obiwang.Collections.Comment({cid:this.cid});
        }else if(this.sid){
            this.Todos=new Obiwang.Collections.Comment({sid:this.sid});
        }else if(this.aid){
            this.Todos=new Obiwang.Collections.Comment({aid:this.aid});
        }else{
            return;
        }

      this.listenTo(this.Todos, 'add', this.addOne);
      //this.listenTo(this.Todos, 'all', this.render);   
      _.bindAll(this, "addAll");   
    },
    renderAll:function(){
        this.render();
        this.afterRender();
        return this;
    },
    afterRender:function(){
      this.input = this.$("#new-todo");
      this.main = $('#main');
      var self=this;
      this.Todos.fetch();
    },
    addOne: function(todo) {
      var view = new CommentView({model: todo});
      var toa=view.render().el;
      this.$el.find("#todo-list").append(toa);
    },
    addAll: function() {
      this.Todos.each(this.addOne, this);
    },
    createOnEnter: function(e) {
      if (e.keyCode != 13) return;
      if (!this.$("#new-todo").val()) return;
      if(this.cid){
        this.Todos.create({comment: this.$("#new-todo").val(),contract:this.cid});
      }
      if(this.sid){
        this.Todos.create({comment: this.$("#new-todo").val(),service:this.sid});
      }
      if(this.aid){
        this.Todos.create({comment: this.$("#new-todo").val(),application:this.aid});
      }
      this.$("#new-todo").val("");
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
/**************************************************** Accounting ******************************************************/
var Accounting=Wholeren.baseView.extend({
    templateName:'dateTableView',
    ready:true,
    initialize: function (options) {
        this.rank=$('#rank').text();
        this.el=options.el;
        this.collection = new Obiwang.Collections['TimeRangeGeneral']();
        this.collection.setUrl('/Accounting/');
        this.render({title:"Accounting"});
        var matchCell=Backgrid.Cell.extend({
            template: _.template("<a>Match</a>"),
            events: {
              "click a": "match"
            },
            match: function (e) {
              e.preventDefault();
              var toupdate={};
              toupdate.receivedNontaxable=this.model.get('nontaxable');
              toupdate.receivedRemittances=this.model.get('remittances');
              toupdate.receivedOther=this.model.get('other');
              toupdate.receivedTotal=this.model.get('totalpay');
              this.model.save(toupdate,{save:false});
            },
            render: function () {
              this.$el.html(this.template());
              this.delegateEvents();
              return this;
            }
        });
        var columns=[
        {name:'createdAt',label:'收款日期',editable:false,cell:'date'},
        {name:'servicepay',label:'服务收款',editable:false,cell:'number'},
        {name:'nontaxable',label:'时进时出',editable:false,cell:'number'},
        {name:'remittances',label:'银行费用',editable:false,cell:'number'},
        {name:'other',label:'其他',editable:false,cell:'number'},
        {name:'totalpay',label:'收款金额',editable: false,cell:'number'},
        {name:'account',label:'收款账户',editable: false,cell:'string'},
        {name:'',label:'Match',cell:matchCell},
        {name:'receiveDate',label:'实际收款日期',cell:'date'},
        {name:'receivedServicepay',label:'实收服务金额',editable:false,cell:'number'},
        {name:'receivedNontaxable',label:'实收时进时出',cell:'number'},
        {name:'receivedRemittances',label:'实收银行费用',cell:'number'},
        {name:'receivedOther',label:'实收其他',cell:'number'},
        {name:'receivedTotal',label:'实收金额',cell:'number'}
        ];
        var grid=new Backgrid.Grid({columns:columns,collection:this.collection});
        $('.table-wrapper').append(grid.render().el);
        var paginator = new Backgrid.Extension.Paginator({
        windowSize: 20, // Default is 10
        slideScale: 0.25, // Default is 0.5
        goBackFirstOnSort: false, // Default is true
        collection: this.collection
        });
        $('.table-wrapper').append(paginator.render().el);        
    },
    events: {
    'click  button.button-alt': 'refetch',
    'click a.page':'switchPage'
    },    
    refetch:function(e){
        if(!this.ready) return;
        var startDate=$('#startDate').val();
        var endDate=$('#endDate').val();
        this.collection.setdate({startDate:startDate,endDate:endDate});
        this.collection.reset();
        if(this.collection.fullCollection)this.collection.fullCollection.reset();
        this.collection.fetch({reset:true});
    }, 
});
/************************************************ Market VIEW *****************************************************/

var Sidebar = Wholeren.baseView.extend({
    //templateName:'marketSidebar',
    //submenu:'market',
    initialize: function (options) {
        
        this.el=options.el;
        this.templateName=options.templateName;
        this.submenu=options.submenu;
        this.MenuViews=options.MenuViews;
        this.render();

        this.menu = this.$('.settings-menu');
    },
    models: {},
    events: {
        'click .settings-menu li': 'switchPane'
    },
    render: function () {
        var ml = this.template();
        if (ml[0] != '<') {
            ml = ml.substring(1);
        }
       this.$el.html(ml);
        return this;
    },
    switchPane: function (e) {
        e.preventDefault();
        var item = $(e.currentTarget),
            id = item.find('a').attr('href').substring(1);
        
        this.showContent(id);
    },

    showContent: function (id) {
        
        
        var self = this,
            model;
        Wholeren.router.navigate('/'+this.submenu+'/' + id + '/');
        //myApp.trigger('urlchange');
        if (this.pane && id === this.pane.id) {
            return;
        }
        if(this.pane)
        this.pane.destroy();
        this.setActive(id);
        var toDisplay=this.MenuViews[id];
        if(toDisplay){
            this.pane =new toDisplay({ el: '.settings-content' }); 
        }else{
            this.pane=new this.MenuViews.Pane({ el: '.settings-content' });
        }
        this.pane.render();
        this.pane.afterRender();
    },

    renderPane: function (model) {
        this.pane.model = model;
        this.pane.render();
    },

    setActive: function (id) {
        this.menu = this.$('.settings-menu');
        this.menu.find('li').removeClass('active');
        var submenu= this.menu.find('.submenu');
        for (var i = 0; i < submenu.length; i++) {
            submenu[i].style.display = 'none';
        }
        this.menu.find('a[href=#' + id + ']').parent().addClass('active');
        var ind = id.indexOf('_');
        var frameID;
        //It is a submenu, first make the submenu display
        if (ind > 0) {
            frameID= id.substring(0, ind);
        } else {
            frameID = id;
        }
        if (this.menu.find('#' + frameID).length>0) {
            this.menu.find('#' + frameID)[0].style.display = 'block';
        } 
        
    }
});
var Market={};
Market.Pane = Wholeren.baseView.extend({
    destroy: function () {
        this.$el.removeClass('active');
        this.undelegateEvents();
    },
    
    render: function () {
        this.$el.hide();
        this.$el.html("Selected pane does not exist");
        this.$el.fadeIn(300);
    },
    afterRender: function () {
        this.$el.attr('id', this.id);
        this.$el.addClass('active');
    }
});

Market.general=Market.Pane.extend({
    templateName:'default',
    id:"general",
    events: {
        'click .button-alt':'refetch',
        'click .button-save':'save'
    },
    requrestUrl:'general',
    refetch:function(){
        var month=$('#month').val()||'';
        var year=$('#year').val()||'';
        if(month.length<0||year.length<0) return;
        var query="month="+month+"&year="+year;
        $('.content').html("");
        var self=this;
        $.ajax({
                url: '/market/'+self.requrestUrl+'/?'+query,
                type: 'GET',
                headers: {
                    'X-CSRF-Token': $("meta[name='csrf-param']").attr('content')
                },
                success: function (msg) {
                    self.result=msg;
                    self.displayQuery(msg);
                },
                error: function (xhr) {
                    Wholeren.notifications.clearEverything();
                    Wholeren.notifications.addItem({
                        type: 'error',
                        message: util.getRequestErrorMessage(xhr),
                        status: 'passive'
                    });
                }
            });
    },
    save:function(e){
        var col=new Backbone.Collection(this.result);
        util.saveCSV(col);
    },
    render: function () {
         var ml = this.template();
         if (ml[0] != '<') {
             ml = ml.substring(1);
         }
        this.$el.html(ml);
        this.refetch();
    },
    displayQuery:function(data){

        var tab=$('<table/>');
        if(!data) return;
        var keys=_.keys(data[0]);
        var headline=$('<tr/>');
        keys.forEach(function(ele){
            var attr=$('<th/>').text(ele);
            headline.append(attr);
        });
        tab.append(headline);
        //Now insert every row
        data.forEach(function(row){
            var curRow=$('<tr/>');
            keys.forEach(function(key){
                curRow.append($('<td/>').text(row[key]));
            });
            tab.append(curRow);
        });
        $('.content').html(tab);
    },
    afterRender: function () {
        this.$el.attr('id', this.id);
        this.$el.addClass('active');
    }

});

Market.view1=Market.general.extend({
    id:'view1',
    requrestUrl:'contractOfSaleAndExpert'
});
Market.view2=Market.general.extend({
    id:'view2',
    requrestUrl:'MonthlyChange'
});
Market.view3=Market.Pane.extend({
    id:'view3',
    title:'Monthly Goal',
    url:'/Market/MonthlyGoal/',
    templateName:'default',
    initialize:function(options){
        this.rank=$('#rank').text();
        this.el=options.el;
        this.collection = new Obiwang.Collections['General']({url:this.url,model:Backbone.Model.extend({url:'/MonthlyGoal/'})});
        this.render();
    },
    events: {
        'click .button-alt':'refetch',
        'click .button-save':'save'
    },
    save:function(e){
        util.saveCSV((this.collection||{}).fullCollection?this.collection.fullCollection:this.collection,this.columns);
    },
    render: function () {
         var ml = this.template({title:this.title});
         if (ml[0] != '<') {
             ml = ml.substring(1);
         }
        this.$el.html(ml);
    },
    afterRender:function(){
        var self=this;
        var columns=[
        {name:'nickname',label:'老师名字',editable:false,cell:'string'},
        {name:'transferSaleGoal',label:'转学销售目标',cell:'integer'},
        {name:'transferExpGoal',label:'转学专家目标',cell:'integer'},
        {name:'emergSaleGoal',label:'紧急销售目标',cell:'integer'},
        {name:'emergExpGoal',label:'紧急专家目标',cell:'integer'},
        {name:'highSaleGoal',label:'高中销售目标',cell:'integer'},
        {name:'highExpGoal',label:'高中专家目标',cell:'integer'},
        {name:'studySaleGoal',label:'学术销售目标',cell:'integer'},
        {name:'studyExpGoal',label:'学术专家目标',cell:'integer'},
        {name:'leadGoal',label:'lead',cell:'integer'},
        ];

        this.columns=columns;
        this.grid=new Backgrid.Grid({columns:columns,collection:self.collection});
        $('.content').append(this.grid.render().el);      
        var paginator = new Backgrid.Extension.Paginator({
            windowSize: 20, // Default is 10
            slideScale: 0.25, // Default is 0.5
            goBackFirstOnSort: false, // Default is true
            collection: self.collection
            });
        $('.content').append(paginator.render().el);  
        this.$el.attr('id', this.id);
        this.$el.addClass('active');
     },
    refetch:function(e){
        var year=$('#year').val();
        var month=$('#month').val();
        this.collection.setdate({year:year,month:month});
        this.collection.reset();
        if(this.collection.fullCollection)this.collection.fullCollection.reset();
        this.collection.fetch({reset:true});
    },
});
Market.view4=Market.view3.extend({
    id:'view4',
    title:'Sales Role ',
    url:'/SalesRole/',
    afterRender:function(){
        var self=this;
        var columns=[
        {name:'salesRole',label:'角色名称',editable:false,cell:'string'},
        {name:'comissionPercent',label:'佣金百分比',cell:Backgrid.NumberCell.extend({decimals:3})},
        {name:'flatComission',label:'非百分比佣金',cell:'number'}
        ];
        this.columns=columns;
        this.grid=new Backgrid.Grid({columns:columns,collection:self.collection});
        $('.content').append(this.grid.render().el);      
        var paginator = new Backgrid.Extension.Paginator({
            windowSize: 20, // Default is 10
            slideScale: 0.25, // Default is 0.5
            goBackFirstOnSort: false, // Default is true
            collection: self.collection
            });
        $('.content').append(paginator.render().el);  
        this.$el.attr('id', this.id);
        this.$el.addClass('active');
     },
     refetch:function(e){
        this.collection.setdate({year:"",month:""});
        this.collection.reset();
        if(this.collection.fullCollection)this.collection.fullCollection.reset();
        this.collection.fetch({reset:true});
    },
});
Market.view5=Market.view4.extend({
    id:'view5',
    title:'Service Type Comission',
    url:'/ServiceType/',
    afterRender:function(){
        var self=this;
        var columns=[
        {name:'serviceType',label:'服务名称',editable:false,cell:'string'},
        {name:'category',label:'类型',editable:false,cell:'string'},
        {name:'comission',label:'百分比佣金',cell:Backgrid.NumberCell.extend({decimals:3})}
        ];
        this.columns=columns;
        this.grid=new Backgrid.Grid({columns:columns,collection:self.collection});
        $('.content').append(this.grid.render().el);      
        var paginator = new Backgrid.Extension.Paginator({
            windowSize: 20, // Default is 10
            slideScale: 0.25, // Default is 0.5
            goBackFirstOnSort: false, // Default is true
            collection: self.collection
            });
        $('.content').append(paginator.render().el);  
        this.UL=new Obiwang.Collections['UserLevel']();
        var grid2=new Backgrid.Grid({columns:[{name:'userLevel',label:'老师等级',editable:false,cell:'string'},
        {name:'userComission',label:'等级佣金百分比',cell:'number'}],collection:self.UL});
        $('.content').append(grid2.render().el);
        this.UL.fetch();
        this.$el.attr('id', this.id);
        this.$el.addClass('active');
     },
});
Market.view6=Market.view4.extend({
    id:'view6',
    title:'Notifications',
    url:'/Notifications/',
    afterRender:function(){
        var self=this;
        var DeleteCell = BackgridCells.DeleteCell;
        var RedirectCell=Backgrid.Cell.extend({
            render: function () {
              var id=this.model.get('contract');
              this.$el.html('<a href="/admin/contract/'+id+'">Link</a>');
              this.delegateEvents();
              return this;
            }
        });
        var columns=[
        {name:'chineseName',label:'客户名字',editable:false,cell:'string'},
        {name:'days',label:'天数',editable:false,cell:'integer'},
        {name:'nickname',label:'销售名字',editable:false,cell:'string'},
        {name:'reason',label:'提醒理由',editable:false,cell:'string'},
        {name:'createdAt',label:'生成日期',editable:false,cell:'date'},
        {name:'',label:'跳转',editable:false,cell:RedirectCell},
        {name:'',label:'Delete',editable:false,cell:DeleteCell}
        ];
        this.columns=columns;
        this.grid=new Backgrid.Grid({columns:columns,collection:self.collection});
        $('.content').append(this.grid.render().el);      
        var paginator = new Backgrid.Extension.Paginator({
            windowSize: 20, // Default is 10
            slideScale: 0.25, // Default is 0.5
            goBackFirstOnSort: false, // Default is true
            collection: self.collection
            });
        $('.content').append(paginator.render().el);  
        this.$el.attr('id', this.id);
        this.$el.addClass('active');
     },
});
var MarketView=Wholeren.baseView.extend({
    initialize: function (options) {
        $(".settings-content").removeClass('active');
        this.sidebar = new Sidebar({
            el: '.settings-sidebar',
            pane: options.pane,
            model: this.model,
            templateName:'marketSidebar',
            submenu:'market',
            MenuViews:Market
        });
        this.listenTo(Wholeren.router, 'route:market', this.changePane);
        
    },
    changePane: function (pane) {
        if (!pane) {
            return;
        }
        this.sidebar.showContent(pane);
    },
    render: function () {
        this.sidebar.render();
//        if(!this.sidebar.pane)
//          this.showContent('general');
//        else
//          this.sidebar.renderPane({});
    }
});
/******************************************Views for Settings*************************************/


var Settings={};
Settings.Pane = Wholeren.baseView.extend({
    destroy: function () {
        this.$el.removeClass('active');
        this.undelegateEvents();
    },
    
    render: function () {
        this.$el.hide();
        this.$el.html("Selected pane does not exist");
        this.$el.fadeIn(300);
    },
    afterRender: function () {
        this.$el.attr('id', this.id);
        this.$el.addClass('active');
    },
    saveSuccess: function (model, response, options) {
            /*jshint unused:false*/
            Wholeren.notifications.clearEverything();
            Wholeren.notifications.addItem({
                type: 'success',
                message: 'Saved',
                status: 'passive'
            });
        },
        saveError: function (model, xhr) {
            /*jshint unused:false*/
            Wholeren.notifications.clearEverything();
            Wholeren.notifications.addItem({
                type: 'error',
                message: util.handleRequestError(xhr),
                status: 'passive'
            });
        },
        validationError: function (message) {
            Wholeren.notifications.clearEverything();
            Wholeren.notifications.addItem({
                type: 'error',
                message: message,
                status: 'passive'
            });
        }
});
    // ### General settings
Settings.general = Settings.Pane.extend({
    id: "general",
    templateName:"settingGeneral",
    afterRender: function () {
        this.$el.attr('id', this.id);
        this.$el.addClass('active');
    }
});
Settings.user=Settings.Pane.extend({
    id: 'user',
    templateName:'settingUser',
    events: {
        'click .button-save': 'saveUser',
        'click .button-change-password': 'changePassword',
    },
    initialize:function(option){
        var id=parseInt($('#userid').text())||null;
        this.model=new Obiwang.Models.simpleModel({id:id,_url:'/User/'});
        var self=this;
        this.model.fetch().then(function(data){
            self.render();
        });
    },
    render:function(){
        var ml = this.template(this.model.toJSON());
         if (ml[0] != '<') {
             ml = ml.substring(1);
         }
        this.$el.html(ml);
    },
    afterRender: function () {
        this.$el.attr('id', this.id);
        this.$el.addClass('active');
    },
    saveUser: function () {
            var self = this,
                firstName = this.$('#user-firstname').val(),
                lastName = this.$('#user-lastname').val(),
                nickname = this.$('#user-nickname').val(),
                email = this.$('#user-email').val(),
                phone = this.$('#user-phone').val(),
                skype = this.$('#user-skype').val(),
                bio=this.$('#user-bio').val(),
                validationErrors = [];

            if (!validator.isLength(firstName, 0, 150)) {
                validationErrors.push({message: "Name is too long", el: $('#user-name')});
            }
            if (!validator.isLength(lastName, 0, 150)) {
                validationErrors.push({message: "Name is too long", el: $('#user-name')});
            }
            if (!validator.isLength(nickname, 0, 150)) {
                validationErrors.push({message: "Name is too long", el: $('#user-name')});
            }
            if (!validator.isLength(bio, 0, 200)) {
                validationErrors.push({message: "Bio is too long", el: $('#user-bio')});
            }

            if (!validator.isEmail(email)) {
                validationErrors.push({message: "Please supply a valid email address", el: $('#user-email')});
            }

            if (validationErrors.length) {
                validator.handleErrors(validationErrors);
            } else {

                this.model.save({
                    'firstname':             firstName,
                    'lastname':             lastName,
                    'nickname':             nickname,
                    'email':            email,
                    'phone':         phone,
                    'skype':          skype,
                    'bio':              bio
                }, {
                    patch:true,
                    success: this.saveSuccess,
                    error: this.saveError
                }).then(function () {
                    self.render();
                });
            }
    },
    changePassword: function (event) {
            event.preventDefault();
            var self = this,
                oldPassword = this.$('#user-password-old').val(),
                newPassword = this.$('#user-password-new').val(),
                ne2Password = this.$('#user-new-password-verification').val(),
                validationErrors = [];

            if (!validator.equals(newPassword, ne2Password)) {
                validationErrors.push("Your new passwords do not match");
            }

            if (!validator.isLength(newPassword, 5)) {
                validationErrors.push("Your password is not long enough. It must be at least 8 characters long.");
            }

            if (validationErrors.length) {
                validator.handleErrors(validationErrors);
            } else {
                $.ajax({
                    url: '/user/changepw/',
                    type: 'POST',
                    headers: {
                        'X-CSRF-Token': $("meta[name='csrf-param']").attr('content')
                    },
                    data: JSON.stringify({
                        password: oldPassword,
                        newpassword: newPassword,
                        ne2password: ne2Password
                    }),
                    success: function (msg) {
                        Wholeren.notifications.addItem({
                            type: 'success',
                            message: "password change succeed",
                            status: 'passive',
                            id: 'success-98'
                        });
                        self.$('#user-password-old, #user-password-new, #user-new-password-verification').val('');
                    },
                    error: function (xhr) {
                        Wholeren.notifications.addItem({
                            type: 'error',
                            message: util.handleRequestError(xhr),
                            status: 'passive'
                        });
                    }
                }).then(function () {
                    self.render();
                });
            }
    },

});

var SettingView = Backbone.View.extend({
    initialize: function (options) {
        $(".settings-content").removeClass('active');
        this.sidebar = new Sidebar({
            el: '.settings-sidebar',
            pane: options.pane,
            model: this.model,
            templateName:'settingSidebar',
            submenu:'settings',
            MenuViews:Settings
        });
        this.listenTo(Wholeren.router, 'route:settings', this.changePane);
        
    },
    changePane: function (pane) {
        if (!pane) {
            return;
        }
        this.sidebar.showContent(pane);
    },
    render: function () {
        this.sidebar.render();

    }
});
module.exports={
		Sidebar:Sidebar,
        Panes: Settings,
        Notification:Notification,
        Contract:ContractView,
        Service:ServiceView,
        Market:MarketView,
        Setting:SettingView,
        User:UserView,
        Auth:Views,
        Comission:Comission,
        Accounting:Accounting
};