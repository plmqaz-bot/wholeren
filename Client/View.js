"use strict";
var $ = require('jquery');
//var Backbone = require('backbone');
var Backbone= require('./backbone.modal.js');
var _=require('lodash');
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
    return text.substring(0,20);
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

        submitHandler: function (event) {
            event.preventDefault();
            var name = this.$('.name').val(),
                email = this.$('.email').val(),
                password = this.$('.password').val(),
                validationErrors = [],
                self = this;

            if (!validator.isLength(name, 1)) {
                validationErrors.push("Please enter a name.");
            }

            if (!validator.isEmail(email)) {
                validationErrors.push("Please enter a correct email address.");
            }

            if (!validator.isLength(password, 0)) {
                validationErrors.push("Please enter a password");
            }

            if (!validator.equals(this.submitted, "no")) {
                validationErrors.push("Ghost is signing you up. Please wait...");
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
                        name: name,
                        email: email,
                        password: password
                    },
                    success: function (msg) {
                        window.location.href = msg.redirect;
                    },
                    error: function (xhr) {
                        self.submitted = "no";
                        Wholeren.notifications.clearEverything();
                        Wholeren.notifications.addItem({
                            type: 'error',
                            message: util.getRequestErrorMessage(xhr),
                            status: 'passive'
                        });
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

var Sidebar = Backbone.View.extend({
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
//      for (item in this.$el){
//          alert(item+" "+this.$el[item]);
//      }
        //this.el.html(tpSidebar());
    
        //$(this.el).html("bb");
        var ml = tpSidebar({});
        if (ml[0] != '<') {
            ml = ml.substring(1);
        }
        this.$el.html('');
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
        myApp.router.navigate('/settings/' + id + '/');
        //myApp.trigger('urlchange');
        if (this.pane && id === this.pane.id) {
            return;
        }
        if(this.pane)
        this.pane.destroy();
        this.setActive(id);
        var toDisplay=Settings[id];
        if(toDisplay){
            this.pane =new toDisplay({ el: '.settings-content' }); 
        }else{
            this.pane=new Settings.Pane({ el: '.settings-content' });
        }
        this.pane.render();
        
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
Settings.Pane = Backbone.View.extend({
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
//        Ghost.notifications.clearEverything();
//        Ghost.notifications.addItem({
//            type: 'success',
//            message: 'Saved',
//            status: 'passive'
//        });
    },
    saveError: function (model, xhr) {
        /*jshint unused:false*/
//        Ghost.notifications.clearEverything();
//        Ghost.notifications.addItem({
//            type: 'error',
//            message: Ghost.Views.Utils.getRequestErrorMessage(xhr),
//            status: 'passive'
//        });
    },
    validationError: function (message) {
//        Ghost.notifications.clearEverything();
//        Ghost.notifications.addItem({
//            type: 'error',
//            message: message,
//            status: 'passive'
//        });
    }
});
    // ### General settings
 Settings.general = Settings.Pane.extend({
    id: "general",
//    events: {
//        'click .button-save': 'saveSettings',
//        'click .js-modal-logo': 'showLogo',
//        'click .js-modal-cover': 'showCover'
//    },
    render: function () {
        var ml = tpGeneral();
        
        this.$el.html(ml);
        this.$el.attr('id', this.id);
        this.$el.addClass('active');
    }
});




















/*************************************************Views for Contract *****************************/

var ContractView=Wholeren.baseView.extend({
    filter:[],
    id: "contracts",
    serviceTypes:{},
    ready:false,
    singleTemplate:JST['contractSingle'],
    templateName:'contract',
        initialize: function (options) {
            if (options.collection) {
                this.collection = options.collection;
            } else if (!this.collection || this.collection.length < 1) {
                this.collection = new Obiwang.Collections.Contract();
                this.collection.fetch({ reset: true });
            }
            this.render();
            this.collection.on("reset", this.renderCollection, this);
            this.collection.on("sort", this.renderCollection, this);
            this.serviceTypes=new Obiwang.Collections.ServiceType();
            this.serviceTypes.fetch({ reset: true }).done(function(data){this.ready=true});
            _.bindAll(this,'rerenderSingle');
            _.bindAll(this,'renderCollection');
            _.bindAll(this,'renderCollectionCore');
        },
        events: {
        'click  button.button-add': 'editView',
        'click .clickablecell':'editContract',
        'click .textbox':'editAttr',
        'click .sortable':'sortCollection'
        },
        render: function () {
             var ml = this.template();
             if (ml[0] != '<') {
                 ml = ml.substring(1);
             }
            this.$el.html(ml);
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
        renderCollection: function (){
            var self=this;
            if(!this.ready){
                this.serviceTypes=new Obiwang.Collections.ServiceType();
                this.serviceTypes.fetch({ reset: true }).done(function(data){self.ready=true;self.renderCollectionCore();}); 
            }else{
                this.renderCollectionCore();
            }
        },
        renderCollectionCore:function(){
        // Remove all keywords
        var toRemove = $('.content tr').not('#scrollableheader').not('#pinnedheader');
        toRemove.remove();
        var headrow=$('#scrollableheader');
        var stableheadrow=$('#pinnedheader');
        var self=this;
        this.collection.forEach(function(item){
            var obj=item.toJSON();
            var filteredOut=false;
            self.filter.forEach(function(f){
                var attr=f.attr;
                var value=f.value;
                var sub=attr.indexOf('.');
                if(sub>0){
                    var tocomp=obj[attr.substring(0,sub)]||{};
                    tocomp=tocomp[attr.substring(sub+1)];
                    if(tocomp!=value){
                        filteredOut=true;
                    }
                }else if(obj[attr]!=value){
                    filteredOut=true;
                }
            });
            if(filteredOut){
                return;
            }
            obj.services.forEach(function(ele){
                var id=ele.serviceType;
                if(id){
                    console.log(id);
                    ele.serviceType=self.serviceTypes.get(id).toJSON();
                }
            });

            console.log(obj);

            var ele = self.singleTemplate(obj);
            var toInsert = $('<div/>').html(ele).contents();
            toInsert.insertAfter(headrow);
            var headline='';
            if(obj.client){
                headline=obj.client.chineseName;
                
            }
            if(!headline){
                    headline="NO NAME";
            }
            var headInsert=$('<div/>').html('<tr><td data-id="'+obj.id+'" class="clickablecell" name="'+obj.id+'">'+headline+'</td></tr>').contents();
            headInsert.insertAfter(stableheadrow);
        });     
        },
        rerenderSingle:function(options){
            var self=this;
            var toRender=new Obiwang.Models.Contract({id:options.id});
            toRender.fetch({
                reset:true,
                success:function(model,response,options){
                    self.collection.remove(self.collection.get(model.get('id')));
                    self.collection.push(model);
                    self.renderCollection();
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
            
        },
        editView: function(){
            var popUpView = new ContractEdit({view:this});
            $('.app').html(popUpView.render().el);
        },
        editContract: function(e){
            var id = $(e.currentTarget).data("id");
            var item = this.collection.get(id);
            console.log("clicked item ",item);
            var popUpView = new ContractEdit({view:this,model:item});
            $('.app').html(popUpView.render().el);
        },
        editAttr:function(e){
            var attr=$(e.currentTarget).data("attr");
            var type=$(e.currentTarget).data("type");
            var id=$(e.currentTarget).parent().attr("id");
            var curValue=this.collection.get(id).get(attr);
             var popUpView=new AttributeEdit({view:this,id:id,attr:attr,type:type,curValue:curValue});
             popUpView.render();
             $('.app').html(popUpView.el);
        }
});

/**

TODO: refresh view after submit--done
    validator on every input.  -done
    reduce the ajax call to get selection options. -done
*/
var ContractEdit = Backbone.Modal.extend({
    viewContainer:'.app',
    modelChanges:{},
    optionalValidation:{
        'client.primaryEmail':'isEmail',
        'client.secondaryEmail':'isEmail',
        'client.primaryPhone':'isInt',
        'client.secondaryPhone':'isInt',


    },
    requiredValidation:{
        'client.firstName':'isNotNull',
        'client.lastName':'isNotNull',
        'client.chinesename':'isNotNull',
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
    template: JST['contractEdit'],
    cancelEl: '.cancel',
    //submitEl: '.ok',
    events:{
        "click .ok":"Submit",
        "change select:not([id^='client.'])":"selectionChanged",
        "change input":"inputChanged",
        "mouseover input":"showError",
        "change #client\\.firstName,#client\\.lastName,#client\\.chinesename":"refreshClientID",
        "change select[id^='client.']":"refreshClientInfo"
    },
    selectionChanged:function(e){
        var field=$(e.currentTarget);
        var selected=$("option:selected",field).val();
       // var value=$("option:selected",field).text();
        var id=field.attr('id');
        var data={};
        if(selected=='true'||selected=='false'){
            //data[id]=selected;
            this.modelChanges[id]=selected;
        }else{

           // data[id]=selected;
           this.modelChanges[id]=selected;
            
            //data[id]={};
            //data[id]['id']=selected;
            //data[id][id]=value;
            
        }
        
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
            if(self.model.get(tableName)&&((self.model.get(tableName).id&&self.get(tableName).id==ele.id)||self.model.get(tableName)==ele.id)){
                toAdd.attr('selected','selected');
            }
            theSel.append(toAdd); 
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
    inputChanged:function(e){
        var field=$(e.currentTarget);
        var id=field.attr('id');
        var value=field.val();
            
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
            if(this.requiredValidation[id]){
                if(!validator[this.requiredValidation[id]](value)){
                    error=true;
                }
            }
        }else{
            if(this.optionalValidation[id]){
                if(!validator[this.optionalValidation[id]](value)){
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
    showError:function(e){

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
    }
});

var AttributeEdit=Backbone.Modal.extend({
    initialize: function (options){
        _.bindAll(this,  'render', 'afterRender');
        this.parentView = options.view;
        this.contractID = options.id;
        this.attr=options.attr;
        this.type=options.type;
        this.curValue=options.curValue||'';
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
            case 'text':
            var ele=$('<div/>').html('<p>Text for '+this.attr+'</p><textarea class="reply-content">'+this.curValue+'</textarea>').contents();        
            this.$el.find('.bbm-modal__section').append(ele);
            break;
            case 'selection':
           break;
            
        }
        return this;
    },
    submit: function () {
        // get text and submit, and also refresh the collection. 
        var content = $('.reply-content').val();
        var options={};
        options["id"]=this.contractID;
        options[this.attr]=content;
        var contract = new Obiwang.Models.Contract(options);
        var self=this;
        contract.save(options,{
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
    }
});

module.exports={
		Setting:SettingView,
		Sidebar:Sidebar,
        Panes: Settings,
        Notification:Notification,
        Contract:ContractView,
        Auth:Views

};