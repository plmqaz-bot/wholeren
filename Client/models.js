var Backbone = require('backbone');
$ = require('jquery');
Backbone.$ = $;
Models = {};
Collections = {};
Models.Message = Backbone.Model.extend({
    idAttribute: "idMessage",
    defaults: {
        idMessage:0,
        FromUserName: '',
        ToUserName: '',
        Content: '',
        ReplyFor:0
    },
    urlRoot:'/api/message/'
});
Models.Keyword = Backbone.Model.extend({
    idAttribute: "idKeywordReply",
    defaults: {
        idKeywordReply: -1,
        Keyword: '',
        RegularReply: null,
        MemberReply: null
    },
    urlRoot: '/api/keyword/'
});
Models.ReplyMaterial = Backbone.Model.extend({
    idAttribute: "idReplyMaterial",
    defaults: {
        idReplyMaterial: 0,
        CreateTime: '',
        MsgType: '',
        Title:'',
        Data:null
    },
    urlRoot:'/api/replymaterial/'
});
Collections.Message = Backbone.Collection.extend({
    model: Models.Message,
    initialize: function (options) {
        if (options&&options.id)
            this.skipnumber = options.id;
        else
            this.skipnumber = 0;
    },
    url: function () { return '/api/messagepage/' + this.skipnumber }
});
Collections.ReplyMessage = Backbone.Collection.extend({
    model: Models.Message,
    initialize: function (options){
        this.id = options.id;
    },
    url: function () { return '/api/replyMessage/'+this.id }
});
Collections.Keyword = Backbone.Collection.extend({
    model: Models.Keyword,
    url:'/api/keyword/'
});
Collections.ReplyMaterial = Backbone.Collection.extend({
    model: Models.ReplyMaterial,
    url:'/api/replymaterial/'
});

module.exports = { Models: Models,Collections:Collections };