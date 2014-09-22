"use strict";
var $ = require('jquery');
var Backbone = require('backbone');
Backbone.$ = $;
var Msg = require('./models');

modelView = {};
modelView.Message = Backbone.View.extend({
    model: Msg.Item,
    render: function () {
//<tr><td>{{ FromUserName }}</td><td>{ { ToUserName }}</td><td>{ { Content }}</td><td>{ { ReplyFor }}</td></tr>
    }

});