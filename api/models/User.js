/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/
var Promise=require('bluebird');
var bcrypt=require('bcrypt');
var tokenSecurity={};

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
        var dbHash=dbHash||"";

        hashText=String(expires)+email.toLocaleLowerCase()+foundUser['password']+dbHash;
        // Token:
        // BASE64(TIMESTAMP + email + HASH(TIMESTAMP + email + oldPasswordHash + dbHash ))

        // hash.update(String(expires));
        // hash.update(email.toLocaleLowerCase());
        // hash.update(foundUser.get('password'));
        // hash.update(String(dbHash));
        
        var promise=Promise.defer();

        bcrypt.genSalt(10,function(err,salt){
          if(err) return promise.reject("get sailt failed");
          bcrypt.hash(hashText,salt,function(err,hash){

            if(err) return promise.reject("hash generate failed");
            text += [expires, email, hash].join('|');

            var toReturn=new Buffer(text).toString('base64');
            promise.resolve(toReturn);
          });
        });
        return promise.promise;
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
          return Promise.reject(new Error("Invalid token structure"));
      }

      expires = parseInt(parts[0], 10);

      email = parts[1];

      if (isNaN(expires)) {
          return Promise.reject(new Error("Invalid token expiration"));
      }
      // Check if token is expired to prevent replay attacks
      if (expires < Date.now()) {
          return Promise.reject(new Error("Expired token"));
      }
 
      // to prevent brute force attempts to reset the password the combination of email+expires is only allowed for 10 attempts
      if (tokenSecurity[email + '+' + expires] && tokenSecurity[email + '+' + expires].count >= 10) {
          return Promise.reject(new Error("Token locked"));
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
        console.log(token);
        console.log(generatedToken)
          if (diff === 0) {
              return Promise.resolve(email);
          }

          // increase the count for email+expires for each failed attempt
          tokenSecurity[email + '+' + expires] = {count: tokenSecurity[email + '+' + expires] ? tokenSecurity[email + '+' + expires].count + 1 : 1};
          return Promise.reject(new Error("Invalid token"));
      });
  },
  
};

