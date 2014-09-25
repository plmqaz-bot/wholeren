var _=require('lodash');
var Backbone= require('../assets/js/backbone.modal.js');
var tpSignup=require('./template/signup.hbs');
var tpLogin=require('./template/login.hbs');
var validator=require('./validator');
var util=require('./util');
Views={};
var View = Backbone.View.extend({
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

Views.Login=View.extend({

    initialize: function () {
        this.render();
    },

    templateName: "login",

    template: tpLogin,

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
 Views.Signup = View.extend({

        initialize: function () {
            this.submitted = "no";
            this.render();
        },

        templateName: "signup",
        template: tpSignup,

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

module.exports={
    baseView:View,
    authViews:Views
}