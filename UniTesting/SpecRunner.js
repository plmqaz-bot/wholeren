require.config({
  baseUrl: '/backbone-tests/',
  paths: {
    'jquery'        : '/app/libs/jquery',
    'underscore'    : '/app/libs/underscore',
    'backbone'      : '/app/libs/backbone',
    'mocha'         : 'libs/mocha',
    'chai'          : 'libs/chai',
    'chai-jquery'   : 'libs/chai-jquery',
    'models'        : '/app/models'
  },
  shim: {
    'chai-jquery': ['jquery', 'chai']
  },
  urlArgs: 'bust=' + (new Date()).getTime()
});
 
define(function(require) {
  var chai = require('chai');
  var mocha = require('mocha');
  require('jquery');
  require('chai-jquery');
 
  // Chai
  var should = chai.should();
  chai.use(chaiJquery);
 
  mocha.setup('bdd');
 
  require([
    'specs/model-tests.js',
  ], function(require) {
    mocha.run();
  });
 
});