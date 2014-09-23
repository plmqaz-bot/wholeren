var Backbone = require('backbone');
$ = require('jquery');
Backbone.$ = $;
Models = {};
Collections = {};
Models.Contract = Backbone.Model.extend({
    idAttribute: "id",
    
    urlRoot:'/Contract/'
});

Collections.Contract = Backbone.Collection.extend({
    model: Models.Contract,
    initialize: function (options) {
        if (options&&options.id)
            this.skipnumber = options.id;
        else
            this.skipnumber = 0;
    },
    url: '/Contract/'
});


module.exports = { Models: Models,Collections:Collections };