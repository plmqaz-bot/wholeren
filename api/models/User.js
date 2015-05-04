/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  	password:{type:'string',required:true,minLength:6},

  	email:{type:'email',required:true,unique:true},

    personalemail:{type:'email'},

  	nickname:{type:'string',required:true,unique:true},

  	firstname:{type:'string',required:true},

  	lastname:{type:'string',required:true},

    phone:{type:'string'},

    skype:{type:'string'},

    wechat:{type:'string'},

  	role:{model:'Role',required:true,defaultsTo:1},

    active:{type:'boolean',required:true,defaultsTo:false},

    rank:{type:'integer',required:true,defaultsTo:1,max:3},

    boss:{model:'User'},

    userLevel:{model:'UserLevel',required:true,defaultsTo:1},
  	//contractUserRole:{collection:'ContractUserRole',via:'user',required:true},

  	//service:{collection:'Service',via:'serviceTeacher',dominant:true}
    toJSON: function() {
      var obj = this.toObject();
      delete obj.password;
      return obj;
    }
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
  },
  beforeUpdate:function(attrs,next){
    var bcrypt=require('bcrypt');
    if (attrs.password){
      bcrypt.genSalt(10,function(err,salt){
        if(err) return next(err);
        bcrypt.hash(attrs.password,salt,function(err,hash){
          if(err) return next(err);
          attrs.password=hash;
          next();
        });
      });
    }else{
      next();
    }
  },
  generateResetToken: function (email, expires, dbHash) {
    return this.findOne({email:email}).then(function (foundUser) {
        var hashText = "",text = "";

        hashText=String(expires)+email.toLocaleLowerCase()+foundUser.get('password');
        // Token:
        // BASE64(TIMESTAMP + email + HASH(TIMESTAMP + email + oldPasswordHash + dbHash ))

        hash.update(String(expires));
        hash.update(email.toLocaleLowerCase());
        hash.update(foundUser.get('password'));
        hash.update(String(dbHash));

        text += [expires, email, hash.digest('base64')].join('|');

        return new Buffer(text).toString('base64');
    });
  },

  validateToken: function (token, dbHash) {
      /*jslint bitwise:true*/
      // TODO: Is there a chance the use of ascii here will cause problems if oldPassword has weird characters?
      var tokenText = new Buffer(token, 'base64').toString('ascii'),
          parts,
          expires,
          email;

      parts = tokenText.split('|');

      // Check if invalid structure
      if (!parts || parts.length !== 3) {
          return when.reject(new Error("Invalid token structure"));
      }

      expires = parseInt(parts[0], 10);
      email = parts[1];

      if (isNaN(expires)) {
          return when.reject(new Error("Invalid token expiration"));
      }

      // Check if token is expired to prevent replay attacks
      if (expires < Date.now()) {
          return when.reject(new Error("Expired token"));
      }

      // to prevent brute force attempts to reset the password the combination of email+expires is only allowed for 10 attempts
      if (tokenSecurity[email + '+' + expires] && tokenSecurity[email + '+' + expires].count >= 10) {
          return when.reject(new Error("Token locked"));
      }

      return this.generateResetToken(email, expires, dbHash).then(function (generatedToken) {
          // Check for matching tokens with timing independent comparison
          var diff = 0,
              i;

          // check if the token lenght is correct
          if (token.length !== generatedToken.length) {
              diff = 1;
          }

          for (i = token.length - 1; i >= 0; i = i - 1) {
              diff |= token.charCodeAt(i) ^ generatedToken.charCodeAt(i);
          }

          if (diff === 0) {
              return when.resolve(email);
          }

          // increase the count for email+expires for each failed attempt
          tokenSecurity[email + '+' + expires] = {count: tokenSecurity[email + '+' + expires] ? tokenSecurity[email + '+' + expires].count + 1 : 1};
          return when.reject(new Error("Invalid token"));
      });
  },
  
};

