"use strict";
var $ = require('./floatThead.js');
//var Backbone = require('backbone');
var Backbone= require('./backbone.modal.js');
var _=require('lodash');
Backbone.$=$;
var Handlebars = require('hbsfy/runtime');
var Obiwang = require('./models');
var Settings = {};
var Notification = {};
var validator=require('./validator.js');
var util=require('./util');
var JST=require('./JST');
//#region
Handlebars.registerHelper('ifCond', function (v1, v2, options) {
    if (v1 === v2) {
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
Backbone.$ = $;
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
                    window.location.href = msg.redirect;
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
                        window.location.href = msg.redirect;
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

/******************************************Views for Settings*************************************/
var SettingView = Backbone.View.extend({
    initialize: function (options) {
        $(".settings-content").removeClass('active');
        this.sidebar = new Sidebar({
            el: '.settings-sidebar',
            pane: options.pane,
            model: this.model
        });
        this.listenTo(myApp.router, 'route:settings', this.changePane);
        
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

var Sidebar = Wholeren.baseView.extend({
    templateName:'marketSidebar',
    submenu:'market',
    initialize: function (options) {
        
        this.el=options.el;
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
        var toDisplay=Market[id];
        if(toDisplay){
            this.pane =new toDisplay({ el: '.settings-content' }); 
        }else{
            this.pane=new Market.Pane({ el: '.settings-content' });
        }
        this.pane.render();
        this.pane.afterRender();
        
//
//        if (!this.models.hasOwnProperty(this.pane.options.modelType)) {
//            model = this.models[this.pane.options.modelType] = new Ghost.Models[this.pane.options.modelType]();
//            model.fetch().then(function () {
//                self.renderPane(model);
//            });
//        } else {
//            model = this.models[this.pane.options.modelType];
//            self.renderPane(model);
//        }
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
    }
});
    // ### General settings
 Settings.general = Settings.Pane.extend({
    id: "general",
    templateName:"marketMessage",
//    events: {
//        'click .button-save': 'saveSettings',
//        'click .js-modal-logo': 'showLogo',
//        'click .js-modal-cover': 'showCover'
//    },
    afterRender: function () {
        this.$el.attr('id', this.id);
        this.$el.addClass('active');
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
        render: function () {
             var ml = this.template();
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
            var toRender=new Obiwang.Models[modelName]({id:options.id});
            if(options.del){
                self.collection.remove(self.collection.get(options.id));
                self.renderCollection();
                return;
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
            var ele=$('<div/>').html('<p>Text for '+this.attr+'</p><input type="text" class="reply-content" value="'+this.curValue+'"/>>').contents();        
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
                     var toAdd=$('<option>', { value : choice.id }).text(choice[self.optext]);
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
        var options={};
        options["id"]=this.updateId;
        options[this.attr]=content;
        var toupdate = new Obiwang.Models[this.modelName](options);
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
            this.model=new Obiwang.Models.Contract();
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

var ContractView=Wholeren.FormView.extend({
    serviceTypes:{},
    ready:false,
    singleTemplate:JST['contractSingle'],
    templateName:'contract',
        initialize: function (options) {
            this.rank=$('#rank').text();
            _.bindAll(this,'rerenderSingle');
            _.bindAll(this,'renderCollection');
            _.bindAll(this,'renderCollectionCore');
            _.bindAll(this,'renderSingle');
            _.bindAll(this,'modifyRow');
            this.serviceTypes=new Obiwang.Collections.ServiceType();
            var self=this;
            this.render();
          // $('.Contracts.responsive').floatThead();
            if (options.collection) {
                this.collection = options.collection;
                this.serviceTypes.fetch().done(function(data){
                    self.collection.on("sort", self.renderCollection, self);
                    self.ready=true;
                    self.renderCollection();
                    
                });
                
            } else if (!this.collection || this.collection.length < 1) {
                this.collection = new Obiwang.Collections.Contract();
                $.when(this.collection.fetch(),this.serviceTypes.fetch()).done(function(data){
                    
                    self.collection.on("sort", self.renderCollection, self);
                    self.collection.on("reset", self.renderCollection, self);
                    self.ready=true;
                    self.renderCollection();
                });
            }    
            // Now get filters
            $.ajax({
                url: '/contract/getFilters/',
                type: 'GET',
                headers: {
                    'X-CSRF-Token': $("meta[name='csrf-param']").attr('content')
                },
                success: function (data) {
                    self.renderFilterButtons(data);                
                },
                error: function (xhr) {
                    console.log('error');
                }
            });
            //self.collection.on("sort", this.renderCollection, this); 
        },
        events: {
        'click  button.button-add': 'editView',
        'click  button.button-alt': 'refetch',
        'change .filter':'renderCollection',
        'click .clickablecell':'editContract2',
        'click .edit,.del':'editContract',
        'click .textbox,.selectbox,.multiselectbox,.singletextbox,.boolbox':'editAttr',
        'click .sortable':'sortCollection',
        'click .comment_edit':'showComments',
        'click a.page':'switchPage'
        },     
        refetch:function(e){
            var startDate=$('#startDate').val();
            var endDate=$('#endDate').val();
            this.collection.setdate({startDate:startDate,endDate:endDate});
            this.collection.endDate=endDate;
            this.removeAll();
            this.collection.fetch({reset:true});
        },
        renderCollection: function (){
            var self=this;

            if(!this.ready){
                this.serviceTypes=new Obiwang.Collections.ServiceType();
                this.serviceTypes.fetch({ reset: true }).done(function(data){self.ready=true;self.renderCollectionCore();}); 
            }else{
                this.renderCollectionCore();
            }
            $('#total_count').text(this.contractLength);
        },
        headline:function(obj){
            if(obj.client){
                var text=obj.client.chineseName;
                if(text)
                    return text.substring(0,14);
                else
                    return "NO NAME";
            }else{
                return "NO NAME";
            }
        },
        editView: function(){
            var popUpView = new ContractEdit({view:this});
            $('.app').html(popUpView.render().el);
        },
        editContract2: function(e){
            var id = $(e.currentTarget).data("id");
            var item = this.collection.get(id);
            console.log("clicked item ",item);
            var popUpView = new ContractEdit({view:this,model:item});
            $('.app').html(popUpView.render().el);
        },
        editContract:function(e){
            // Service id
            var item=$(e.currentTarget);
            var id = item.attr('href').substring(1);
            var action=item.attr('class');
            var self=this;
            switch(action){
                case 'del':
                    var newApp=new Obiwang.Models['Contract']({id:id});
                    newApp.destroy({
                        success:function(d){
                            self.rerenderSingle({id:id,del:true});            
                        },
                        error:function(model,response){
                            util.handleRequestError(response);                       
                        }
                    });
                    break;
                case 'edit':
                    var curCont=this.collection.get(id);
                    if(!curCont){
                        return;
                    }
                    var popUpView = new ContractEdit({view:this,model:curCont});
                    $('.app').html(popUpView.render().el);
            }
        },
        showComments:function(e){
            var item=$(e.currentTarget);
            var id = item.attr('href').substring(1);
            var m=new CommentModalView({cid:id});
            $('.app').html(m.renderAll().el);
        }  
});

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
            this.model=new Obiwang.Models.Contract();
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
        var client=new Obiwang.Models['Client']({id:selected});
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
                self.refreshClientID();                      
            }
        });
    },
});
/*************************************************Views for Services *****************************/
var ServiceView=Wholeren.FormView.extend({
    filter:[],
    singleTemplate:JST['serviceSingle'],
    user:{},
    ready:false,
    templateName:'service',
        initialize: function (options) {
            this.rank=$('#rank').text();
            _.bindAll(this,'rerenderSingle');
            _.bindAll(this,'renderCollection');
            _.bindAll(this,'renderCollectionCore');
            this.el=options.el;
            var modelName=this.templateName.charAt(0).toUpperCase() + this.templateName.slice(1);
            this.user=new Obiwang.Collections.User();
            var self=this;
            this.collection = new Obiwang.Collections[modelName]();
            this.render();
            if(options.id){
                var model=new Obiwang.Models[modelName]({id:options.id});
                model.fetch().then(function(){
                    if(model)
                        self.collection.add(model);
                    self.ready=true;
                    self.renderCollectionCore();
                    self.collection.on("sort", self.renderCollection, self);
                }).fail(function(err){
                    util.handleRequestError(err); 
                });
            }else {
                this.collection.fetch().then(function(){
                    self.ready=true;
                    self.renderCollectionCore();
                    self.collection.on("sort", self.renderCollection, self);
                }).fail(function(err){
                    util.handleRequestError(err); 
                });;
            }
            self.collection.on("reset",self.renderCollection,self);
             // Now get filters
            $.ajax({
                url: '/service/getFilters/',
                type: 'GET',
                headers: {
                    'X-CSRF-Token': $("meta[name='csrf-param']").attr('content')
                },
                success: function (data) {
                    self.renderFilterButtons(data);                
                },
                error: function (xhr) {
                    console.log('error');
                }
            });
        },
        events: {
        'click .add,.edit,.del':'editApplication',
        'click  button.button-alt': 'refetch',
        'change .filter':'renderCollection',
        'click .textbox,.selectbox':'editAttr',
        'click .sortable':'sortCollection',
        'click .comment_edit':'showComments',
        'click a.page':'switchPage'
        },    
        refetch:function(e){
            var startDate=$('#startDate').val();
            var endDate=$('#endDate').val();
            this.collection.setdate({startDate:startDate,endDate:endDate});
            this.collection.endDate=endDate;
            this.removeAll();
            this.collection.fetch({reset:true});
        },    
        renderCollection: function (){
            // if(this.ready){
                this.resetCollection();
                this.renderCollectionCore();       
            // }else{
            //      var self=this;
            //     this.user=new Obiwang.Collections.User();
            //     this.user.fetch().done(function(data){
            //         self.ready=true;
            //         self.resetCollection();
            //         self.renderCollectionCore();
            //     }); 
            // }            
        },
        resetCollection:function(){
            this.collection.forEach(function(serv){
                var apps=serv.get('application');
                if(apps){
                    apps.forEach(function(app){
                        app.display=true;
                    });
                }
                serv.set('application',apps);
            });
        },
        headline:function(obj){
            if(obj.contract.client){
                return obj.contract.client.chineseName;                
            }else{
                return "NO NAME";
            }
        },
        modifyRow:function(obj){
            var self=this;
            if(obj.application){
                obj.application.forEach(function(ele){
                    var id=parseInt(ele.writer);
                    if(id){
                        ele.writer=self.user.get(id).toJSON();
                    }
                });   
            }
            // var id=obj.contract.client;
            // if(id){
            //     obj.contract.client=self.client.get(id).toJSON();
            // }
            if(this.rank>1){
                obj.displayDelete=1;
            }
            return obj;
        },
        editApplication:function(e){
            // Service id
            var item=$(e.currentTarget);
            var id = item.parent().parent().attr('name');
            var action=item.attr('class');
            var appid=item.attr('href').substring(1);
            var curService = this.collection.get(id);
            var self=this;
            switch(action){
                case 'add':
                    var newApp=new Obiwang.Models['Application']({service:id});
                    newApp.save({},{
                        success:function(d){
                            self.rerenderSingle({id:id});            
                        },
                        error:function(model,response){
                            util.handleRequestError(response);                       
                        }
                    });
                    break;
                case 'del':
                    var newApp=new Obiwang.Models['Application']({id:appid});
                    newApp.destroy({
                        success:function(d){
                            self.rerenderSingle({id:id});            
                        },
                        error:function(model,response){
                            util.handleRequestError(response);                       
                        }
                    });
                    break;
                case 'edit':
                    var apps=curService.get('application')||[];
                    var curApp;
                    apps.forEach(function(ele){
                        if(ele.id==appid){
                            curApp=ele;
                            return;
                        }
                    });
                    if(!curApp){
                        return;
                    }

                    var popUpView = new ApplicationEdit({view:this,service:curService,curApp:curApp});
                    $('.app').html(popUpView.render().el);
            }             
        },
        showComments:function(e){
            var item=$(e.currentTarget);
            var id = item.attr('href').substring(1);
            var type=item.data('type');
            if(type=='app'){
                var m=new CommentModalView({aid:id});
                $('.app').html(m.renderAll().el); 
            }else{
                var m=new CommentModalView({sid:id});
                $('.app').html(m.renderAll().el); 
            }
            
        }  
        // renderCollectionCore:function(){
        // // Remove all keywords
        // var toRemove = $('.content tr').not('#scrollableheader').not('#pinnedheader');
        // toRemove.remove();
        // var headrow=$('#scrollableheader');
        // var stableheadrow=$('#pinnedheader');
        // var self=this;
        // this.collection.forEach(function(item){
        //     var obj=item.toJSON();
        //     obj.application.forEach(function(ele){
        //         var id=ele.writer;
        //         if(id){
        //             ele.writer=self.user.get(id).toJSON();
        //         }
        //     });
        //     var id=obj.contract.client;
        //     if(id){
        //         obj.contract.client=self.client.get(id).toJSON();
        //     }
        //     var ele = self.singleTemplate(obj);
        //     var toInsert = $('<div/>').html(ele).contents();
        //     toInsert.insertAfter(headrow);
        //     var headline='';
        //     if(obj.contract.client){
        //         headline=obj.contract.client.chineseName;
                
        //     }
        //     if(!headline){
        //             headline="NO NAME";
        //     }
        //     var headInsert=$('<div/>').html('<tr><td data-id="'+obj.id+'" class="clickablecell" name="'+obj.id+'">'+headline+'</td></tr>').contents();
        //     headInsert.insertAfter(stableheadrow);
        // });     
        // },
});


var ComissionView=Wholeren.FormView.extend({
    initialize: function (options) {
            this.rank=$('#rank').text();
            _.bindAll(this,'rerenderSingle');
            _.bindAll(this,'renderCollection');
            _.bindAll(this,'renderCollectionCore');
            _.bindAll(this,'renderSingle');
            _.bindAll(this,'modifyRow');
            this.serviceTypes=new Obiwang.Collections.ServiceType();
            var self=this;
            this.render();
          // $('.Contracts.responsive').floatThead();
            if (options.collection) {
                this.collection = options.collection;
                this.serviceTypes.fetch().done(function(data){
                    self.collection.on("sort", self.renderCollection, self);
                    self.ready=true;
                    self.renderCollection();
                    
                });
                
            } else if (!this.collection || this.collection.length < 1) {
                this.collection = new Obiwang.Collections.Contract();
                $.when(this.collection.fetch(),this.serviceTypes.fetch()).done(function(data){
                    
                    self.collection.on("sort", self.renderCollection, self);
                    self.collection.on("reset", self.renderCollection, self);
                    self.ready=true;
                    self.renderCollection();
                });
            }    
            // Now get filters
            $.ajax({
                url: '/contract/getFilters/',
                type: 'GET',
                headers: {
                    'X-CSRF-Token': $("meta[name='csrf-param']").attr('content')
                },
                success: function (data) {
                    self.renderFilterButtons(data);                
                },
                error: function (xhr) {
                    console.log('error');
                }
            });
            //self.collection.on("sort", this.renderCollection, this); 
        },

});
var ApplicationEdit=EditForm.extend({
    template: JST['serviceEdit'],
    events:{
        "click .ok":"Submit",
        "change select:not([id^='client.'])":"selectionChanged",
        "change input":"inputChanged",
    },
    initialize: function (options){
        this.parentView = options.view;
        if(!options.service||!options.curApp){
            util.showError("No service or application selected!");
            this.close();
            return;
        }
        this.serviceId=options.service.id;
        this.model=new Obiwang.Models['Application'](options.curApp);
        this.model.set('service',options.service.toJSON());
        this.modelChanges.id=this.model.get('id');
        _.bindAll(this,'renderSelect');
        _.bindAll(this,'render', 'afterRender'); 
        var _this = this;
        this.render = _.wrap(this.render, function(render) {
          render();
          _this.afterRender();
          return _this;
        }); 
    }, 
    Submit:function(option){
        if(this.formError) return;
        var self=this;
        var changes=JSON.parse(JSON.stringify(this.modelChanges));
        this.model.save(changes,{
            patch:true,
            success:function(d){
                // refresh parent view
                self.parentView.rerenderSingle({id:self.serviceId});
                return self.close();
                  
            },
            error:function(model,response){
                util.handleRequestError(response);                       
            }
        });
    },
    afterRender:function(){
         var self=this;
        $.ajax({
            url: '/User/?role=4',
            type: 'GET',
            headers: {
                'X-CSRF-Token': $("meta[name='csrf-param']").attr('content')
            },
            success: function (data) {
                    self.renderSelect({name:'writer',content:data});
                                
            },
            error: function (xhr) {
                console.log('error');
            }
        });
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
            var toAdd=$('<option>', { value : ele.id }).text(ele['nickname']);
            if(self.model.get(tableName)&&((self.model.get(tableName).id&&self.model.get(tableName).id==ele.id)||self.model.get(tableName)==ele.id)){
                toAdd.attr('selected','selected');
            }
            theSel.append(toAdd); 
        });  
    },
});
var UserView=Wholeren.FormView.extend({
    filter:[],
    singleTemplate:JST['userSingle'],
    ready:false,
    templateName:'user',
        initialize: function (options) {
            _.bindAll(this,'rerenderSingle');
            _.bindAll(this,'renderCollection');
            _.bindAll(this,'renderCollectionCore');
            this.el=options.el;
            var modelName=this.templateName.charAt(0).toUpperCase() + this.templateName.slice(1);
            var self=this;
            this.collection = new Obiwang.Collections[modelName]();
            this.render();
            this.collection.fetch().done(function(){
                self.ready=true;
                self.renderCollectionCore();
                self.collection.on("sort", self.renderCollection, self);
            });
            
        },
        events: {
        'click .textbox,.selectbox,.multiselectbox,.boolbox':'editAttr',
        'click .sortable':'sortCollection',
        },        
        renderCollection: function (){
            if(this.ready){
                this.renderCollectionCore();       
            }else{
                 var self=this;
                this.collection.fetch().done(function(){
                self.ready=true;
                self.renderCollectionCore();
            });
            }            
        },
        headline:function(obj){
                return "NO NAME";
        },
        modifyRow:function(obj){

            return obj;
        },
        
        // renderCollectionCore:function(){
        // // Remove all keywords
        // var toRemove = $('.content tr').not('#scrollableheader').not('#pinnedheader');
        // toRemove.remove();
        // var headrow=$('#scrollableheader');
        // var stableheadrow=$('#pinnedheader');
        // var self=this;
        // this.collection.forEach(function(item){
        //     var obj=item.toJSON();
        //     obj.application.forEach(function(ele){
        //         var id=ele.writer;
        //         if(id){
        //             ele.writer=self.user.get(id).toJSON();
        //         }
        //     });
        //     var id=obj.contract.client;
        //     if(id){
        //         obj.contract.client=self.client.get(id).toJSON();
        //     }
        //     var ele = self.singleTemplate(obj);
        //     var toInsert = $('<div/>').html(ele).contents();
        //     toInsert.insertAfter(headrow);
        //     var headline='';
        //     if(obj.contract.client){
        //         headline=obj.contract.client.chineseName;
                
        //     }
        //     if(!headline){
        //             headline="NO NAME";
        //     }
        //     var headInsert=$('<div/>').html('<tr><td data-id="'+obj.id+'" class="clickablecell" name="'+obj.id+'">'+headline+'</td></tr>').contents();
        //     headInsert.insertAfter(stableheadrow);
        // });     
        // },
});
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

Market.General=Market.Pane.extend({
    templateName:'marketMessage',
    id:"general",
    events: {
        'click .button-alt':'refetch'
    },
    requrestUrl:'general',
    refetch:function(){
        var startDate=$('#startDate').val();
        var endDate=$('#endDate').val();
        var where={};
        where.createdAt={}
        try{
            if(startDate){
                where.createdAt['>']=new Date(startDate);
            }
            if(endDate){
                where.createdAt['<']=new Date(endDate);
            }
            if(where.createdAt){
                where= JSON.stringify(where);
            }
        }catch(e){
            where= "{}";
        }
        $('.content').html("");
        var self=this;
        $.ajax({
                url: '/market/'+self.requrestUrl+'/?where='+where,
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

Market.view1=Market.General.extend({

    requrestUrl:'contractOfSaleAndExpert'
});
Market.view2=Market.General.extend({
    requrestUrl:'MonthlyChange'
});
var MarketView=Wholeren.baseView.extend({
    initialize: function (options) {
        $(".settings-content").removeClass('active');
        this.sidebar = new Sidebar({
            el: '.settings-sidebar',
            pane: options.pane,
            model: this.model
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
module.exports={
		Sidebar:Sidebar,
        Panes: Settings,
        Notification:Notification,
        Contract:ContractView,
        Service:ServiceView,
        Market:MarketView,
        Setting:SettingView,
        User:UserView,
        Auth:Views

};