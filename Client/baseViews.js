var _=requires('lodash');

var tpLogin=require('./template/login.hbs')
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

View.Login=View.extend{

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
            redirect = Ghost.Views.Utils.getUrlVariables().r,
            validationErrors = [];
            $.ajax({
                url: Ghost.paths.subdir + '/admin/signin/',
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
                    Ghost.notifications.clearEverything();
                    Ghost.notifications.addItem({
                        type: 'error',
                        message: Ghost.Views.Utils.getRequestErrorMessage(xhr),
                        status: 'passive'
                    });
                }
            });

    }

};

module.export={


}