/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  	username:{type:'string',unique:true,required:true},

  	password:{type:'string',required:true,minLength:6},

  	email:{type:'email',required:true},

  	nickname:{type:'string',required:true,unique:true},

  	firstName:{type:'string',required:true},

  	lastName:{type:'string',required:true},

  	role:{model:'Role',required:true}

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
        next();
      });
    });
  }
};

