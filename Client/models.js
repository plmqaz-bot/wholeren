﻿var Backbone = require('backbone');
$ = require('jquery');
Backbone.$ = $;
Models = {};
Collections = {};
Models={
    Contract : Backbone.Model.extend({
    idAttribute: "id",
    
    urlRoot:'/Contract/'
    }),
    Client:Backbone.Model.extend({
        idAttribute:"id",
    urlRoot:'/Client/'
    }),
    ContractCategory:Backbone.Model.extend({
        urlRoot:'/ContractCategory/'

    }),
    Country:Backbone.Model.extend({
        urlRoot:'/Country/'

    }),
    Degree:Backbone.Model.extend({
        urlRoot:'/Degree/'

    }),
    Lead:Backbone.Model.extend({
        urlRoot:'/Lead/'

    }),
    LeadLevel:Backbone.Model.extend({
        urlRoot:'/LeadLevel/'

    }),
    PaymentOption:Backbone.Model.extend({
        urlRoot:'/PaymentOption/'

    }),
    Status:Backbone.Model.extend({
        urlRoot:'/Status/'

    })

};
Collections={
    Contract : Backbone.Collection.extend({
        model: Models.Contract,
        url: '/Contract/'
    }),
    Client : Backbone.Collection.extend({
        model: Models.Client,
        name:'client',
        url: '/Client/'
    }),
    ContractCategory:Backbone.Collection.extend({
        name:'contractCategory',
        model:Models.ContractCategory,
        url:'/ContractCategory/'

    }),
    Country:Backbone.Collection.extend({
        name:'country',
        model:Models.Country,
        url:'/Country/'

    }),
    Degree:Backbone.Collection.extend({
        name:'degree',
        model:Models.Degree,
        url:'/Degree/'

    }),
    Lead:Backbone.Collection.extend({
        name:'lead',
        model:Models.Lead,
        url:'/Lead/'

    }),
    LeadLevel:Backbone.Collection.extend({
        name:'leadLevel',
        model:Models.LeadLevel,
        url:'/LeadLevel/'

    }),
    PaymentOption:Backbone.Collection.extend({
        name:'paymentOption',
        model:Models.PaymentOption,
        url:'/PaymentOption/'

    }),
    Status:Backbone.Collection.extend({
        name:'status',
        model:Models.Status,
        url:'/Status/'
    }),
}



module.exports = { Models: Models,Collections:Collections };