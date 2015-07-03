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

    subRole:{model:'SubRole'},

    active:{type:'boolean',required:true,defaultsTo:false},

    rank:{type:'integer',required:true,defaultsTo:1,max:4},

    boss:{model:'User'},

    userLevel:{model:'UserLevel',required:true,defaultsTo:1},

    dropbox:{type:'string'},

    evernote:{type:'string'},

    address:{type:'string'},

    city:{type:'string'},

    state:{type:'string'},

    zipcode:{type:'int'},

    bio:{type:'string',maxLength: 512, size:512},

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
        console.log("email is "+email+"expires is ",expires);
        hashText=String(expires)+email.toLocaleLowerCase()+foundUser['password']+dbHash;
        console.log("Hast Text is :"+hashText);
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
            console.log("Generated token is :"+text);
            var toReturn=new Buffer(text).toString('base64');
            console.log("bse64 is :"+toReturn);
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
      return this.findOne({email:email}).then(function(foundUser){
        var hashText=String(expires)+email.toLocaleLowerCase()+foundUser['password']+dbHash;  
        // console.log("Hash Text is :"+hashText);
        // console.log("part 2 is :"+parts[2]);
        var p=Promise.defer();
        bcrypt.compare(hashText,parts[2],function(err,valid){
          if(err) return p.reject('cannot compare token');
          if(!valid) {
            tokenSecurity[email + '+' + expires] = {count: tokenSecurity[email + '+' + expires] ? tokenSecurity[email + '+' + expires].count + 1 : 1};
            return p.reject('token incorrect');
          }
          return p.resolve(email);
        });
        return p.promise;

      });
  },
  resetPassword:function(token,newPassword,ne2Password,dbHash){
    var self = this;

    if (newPassword !== ne2Password) {
        return Promise.reject(new Error("Your new passwords do not match"));
    }
    return this.validateToken(token,dbHash).then(function(email){
      return User.findOne({email:email});
    }).then(function(foundUser){
      if(!foundUser) return Promise.reject("Not found");
      return User.update({id:foundUser.id},{password:newPassword});
    });
  }
  
};

