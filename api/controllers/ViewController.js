/**
 * ViewController
 *
 * @description :: Server-side logic for managing Views
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
 var bcrypt=require('bcrypt');
var fs=require('fs');
module.exports = {
    welcomePage: function(req, res) {
        res.locals.layout='userDefaultLayout';
        return res.render('welcome',{userUrl:'/View/',title:"Welcome"});
    },

    'login': function (req, res) {
        res.locals.layout='userDefaultLayout';
        return res.render('login',{userUrl:'/View/',title:"Login"});
    },
    'signup': function (req, res) {
        /*jslint unparam:true*/
        res.locals.layout='userDefaultLayout';
        return res.render('signup',{userUrl:'/View/',title:"Sign Up"});
    },
    'visualization':function(req,res){
        res.locals.layout='userDefaultLayout';
        return res.render('visualization',{userUrl:'/View/',title:"Visualization"});
    },
    getClients : function(req,res) {
        fs.readFile('assets/data/wholeren.json', function(error, clients){
            if(error) 
                return console.warn(error);     
            return res.json({clients: JSON.parse(clients)});
        });
    },
    'doSignin': function (req, res) {
        var currentTime = process.hrtime()[0],
            remoteAddress = req.connection.remoteAddress,
            denied = '';
        loginSecurity = _.filter(loginSecurity, function (ipTime) {
            return (ipTime.time + 2 > currentTime);
        });
        denied = _.find(loginSecurity, function (ipTime) {
            return (ipTime.ip === remoteAddress);
        });
        var username=req.body.username;
        var pass=req.body.password;
        var redirect=req.body.redirect;
        if (!denied) {
            loginSecurity.push({ip: remoteAddress, time: currentTime});
            PublicUser.findOne({username:username}).then(function(ppl){
                if(!ppl){
                    return res.json(400,'no user found');
                }
                bcrypt.compare(pass,ppl.password,function(err,valid){
                    if(err){
                    	return Utilfunctions.errorHandler(err,res,'cannot compare password');
                    } 
                    if(!valid){
                    	return Utilfunctions.errorHandler(err,res,'password incorrect');	
                    } 
                    req.session.publicUser=ppl;
                    req.session.publicAuthenticated=true;
                    if(!redirect) redirect='/view/visualization/';
                    loginSecurity=_.reject(loginSecurity,function(ipTime){
                        return ipTime.ip===remoteAddress;
                    });
                    return res.redirect('/view/visualization/'); 
                })
            }).fail(function(err){
                return Utilfunctions.errorHandler(err,res,"Cannot find by username: "+username);
            });
        } else {
            return Utilfunctions.errorHandler({error: 'Slow down, there are way too many login attempts!'},res,"Log in too fast");
        }
    },
    'doSignup': function (req, res) {
        var username= req.body.username,
            password = req.body.password,
            password_confirm=req.body.password_confirmation,
            email = req.body.email,
            subscribe=req.body.check=='on';
            console.log(subscribe);
        if(password!==password_confirm){
        	return Utilfunctions.errorHandler({error: 'password does not match'},res,"Password ambiguous");
        }

        PublicUser.create({
            username: username,
            password: password,
            email: email,
            subscribe:subscribe
        }).then(function (user) {
            return EmailService.sendWelcomeEmail({
					from: "wholerencontactform@gmail.com",
			   		to: 'wholerencontactform@gmail.com',
			   		subject: 'Registration From Data Team Website',
			   		text: 'Client Name: ' + username + " Client Email Address: " + email
				});         
        }).then(function(data){
        	console.log("User created");
            return res.redirect('/view/visualization/');            
        }).fail(function (err) {
            return Utilfunctions.errorHandler(err,res,"Create Public User failed");
        });
    },
    'signout': function (req, res) {
        var username = req.session.publicUser.username;
        req.session.destroy();
        return res.render('logout',{username:username});
    },
};

