/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var uuid = require('node-uuid');
module.exports = {

  attributes: {
  	password:{type:'string',required:true,minLength:6},

  	email:{type:'email',required:true,unique:true},

    publicKey:{type:'string',unique:true},

  	nickname:{type:'string',required:true,unique:true},

  	firstname:{type:'string',required:true},

  	lastname:{type:'string',required:true},

  	role:{model:'Role',required:true,defaultsTo:1},

    active:{type:'boolean',required:true,defaultsTo:false},

    rank:{type:'int',required:true,defaultsTo:1}
  	//contractUserRole:{collection:'ContractUserRole',via:'user',required:true},

  	//service:{collection:'Service',via:'serviceTeacher',dominant:true}

  },
  beforeCreate: function (attrs, next) {
    var bcrypt = require('bcrypt');

    bcrypt.genSalt(10, function(err, salt) {
      if (err) return next(err);

      bcrypt.hash(attrs.password, salt, function(err, hash) {
        if (err) return next(err);

        attrs.password = hash;
        attrs.publicKey=uuid.v1();
        next();
      });
    });
  },
  toJSON: function() {
      var obj = this.toObject();
      delete obj.password;
      return obj;
    }
};

