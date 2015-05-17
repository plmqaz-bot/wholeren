//var _=require('lodash');
var bcrypt = require('bcrypt');
var parse=require('csv-parse');
var fs=require('fs');
var Promise=require('bluebird');
loginSecurity = [];
var partials={
    //layout:'default',
    navbar:'partials/navbar',
    notifications:'partials/notifications'
}
adminNavbar = {
    contract: {
        name: 'Contract',
        navClass: 'contract',
        key: 'admin.navbar.contract',
        path: '/contract/',
        display:true
    },
    service: {
        name: 'Service',
        navClass: 'contract',
        key: 'admin.navbar.contract',
        path: '/service/',
        display:true
    },
    /*salescomission: {
        name: 'Comission',
        navClass: 'contract',
        key: 'admin.navbar.contract',
        path: '/comission/sales/',
        display:true
    },
    assiscomission: {
        name: 'AssisComission',
        navClass: 'contract',
        key: 'admin.navbar.contract',
        path: '/comission/assis/',
        display:true
    },
    servicecomission: {
        name: 'ServiceComission',
        navClass: 'contract',
        key: 'admin.navbar.contract',
        path: '/comission/service/',
        display:true
    },*/
    accounting:{
        name: 'Accounting',
        navClass: 'contract',
        key: 'admin.navbar.contract',
        path: '/accounting/',
        display:true
    },
    comission:{
        name: 'Comission',
        navClass: 'contract',
        key: 'admin.navbar.settings',
        path: '/comission/',
        display:true

    },
    market: {
        name: 'Market',
        navClass: 'contract',
        key: 'admin.navbar.settings',
        path: '/market/',
        display:false
    },
    // user: {
    //     name: 'User',
    //     navClass: 'contract',
    //     key: 'admin.navbar.contract',
    //     path: '/user/',
    //     display:false
    // },
    settings: {
        name: 'Settings',
        navClass: 'settings',
        key: 'admin.navbar.settings',
        path: '/settings/',
        display:true
    },
    // accountinfo:{
    //     name: 'Account',
    //     navClass: 'contract',
    //     key: 'admin.navbar.settings',
    //     path: '/Account/',
    //     display:true  
    // }
};
loginSecurity=[];
function setSelected(list, name) {
    _.each(list, function (item, key) {
        item.selected = key === name;
    });
    return list;
}
function generateView(req,res,template,selected,body,hideNavbar){
    if(!hideNavbar) hideNavbar=false;
    body = typeof body !== 'undefined' ? body : 'contract';
    res.locals.layout='default';
    res.render('admin/'+template, {
        bodyClass: body,
        hideNavbar:hideNavbar,
        adminNav: setSelected(adminNavbar, selected),
        currentUser:req.session.user,
        partials:partials
    });

}
function handleRank(req){
    if(req.session.manager){
        //adminNavbar.user.display=true;
        adminNavbar.market.display=true;
    }else{
        //adminNavbar.user.display=false;
        adminNavbar.market.display=false;
    }
}
module.exports={

    'index': function (req, res) {
        res.redirect('/admin/contract/');
    },
    'contract':function(req,res){
        handleRank(req);
        generateView(req,res,'contract','contract');
    },
    'service':function(req,res){
        handleRank(req);
        generateView(req,res,'contract','service');
    },
    'market':function(req,res){
        handleRank(req);
        generateView(req,res,'settings','market','settings');
    },
    'comission':function(req,res){
        // console.log(req.params);
        // var pane=req.params.id;
        // if(!pane){
        //     return res.redirect('/admin/comission/sales/');
        // }
        handleRank(req);
       // comission(req,res,'contract',pane+'comission');
       generateView(req,res,'settings','comission','settings');
        
    },
    'accounting':function(req,res){
        handleRank(req);
        generateView(req,res,'contract','accounting');
    },
    // 'user':function(req,res){
    //     handleRank(req);
    //     generateView(req,res,'contract','user');
    // },

    'settings': function (req, res, next) {

        handleRank(req);
        return generateView(req,res,'settings','settings','settings');
        // return res.render('settings', {
        //     bodyClass: 'settings',
        //     adminNav: setSelected(adminNavbar, 'settings')
        // });
    },
    'signout': function (req, res) {
        req.session.destroy();
        res.clearCookie('user');
        res.clearCookie('manager');

        var notification = {
            type: 'success',
            message: 'You were successfully signed out',
            status: 'passive',
            id: 'successlogout'
        };

        return res.redirect('/admin/signin/');
    },
    'signin': function (req, res) {
        /*jslint unparam:true*/
        
        return generateView(req,res,'signin','login','ghost-login',true);
        // return res.render('admin/signin',{
        //     bodyClass: 'ghost-login',
        //     hideNavbar: true,
        //     adminNav: setSelected(adminNavbar, 'login'),
        // });
        //return res.view('admin/signin');
    },
    'signup': function (req, res) {
        /*jslint unparam:true*/
        return generateView(req,res,'signup','login','ghost-signup',true);
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
        var email=req.body.email;
        var pass=req.body.password;
        var redirect=req.body.redirect;
        if (!denied) {
            loginSecurity.push({ip: remoteAddress, time: currentTime});
            User.findOneByEmail(email).then(function(ppl){
                if(!ppl){
                    return res.json(400,'no user found');
                }
                bcrypt.compare(pass,ppl.password,function(err,valid){
                    if(err) return res.json(400,'cannot compare password');
                    if(!valid) return res.json(400,'password incorrect');
                    if(!ppl.active) return res.json(400, 'not activated, contact superviser');
                    req.session.user=ppl;
                    res.cookie('user',ppl);
                    if(ppl.rank>1) {
                        req.session.manager=true;
                        res.cookie('manager',true);
                    }
                    if(!redirect) redirect='/admin/contract/';
                    loginSecurity=_.reject(loginSecurity,function(ipTime){
                        return ipTime.ip===remoteAddress;
                    });
                    return res.json(200,{redirect:redirect});
                });
            }).fail(function(err){
                Utilfunctions.errorHandler(err,res,"Cannot find by email: "+email);
            });
        } else {
            Utilfunctions.errorHandler({error: 'Slow down, there are way too many login attempts!'},res,"Get Accounting");
        }
    },
    'doSignup': function (req, res) {
        var firstname = req.body.firstname,
            nickname = req.body.nickname,
            lastname = req.body.lastname,
            email = req.body.email,
            password = req.body.password,
            role=req.body.role;

        User.create({
            firstname: firstname,
            lastname: lastname,
            nickname: nickname,
            email: email,
            password: password,
            role:role,
        }).then(function (user) {
                // var message = {
                //     to: email,
                //     subject: 'Your New Ghost Blog',
                //     html: '<p><strong>Hello!</strong></p>' +
                //           '<p>Good news! You\'ve successfully created a brand new Ghost blog over on ' + config().url + '</p>' +
                //           '<p>You can log in to your admin account with the following details:</p>' +
                //           '<p> Email Address: ' + email + '<br>' +
                //           'Password: The password you chose when you signed up</p>' +
                //           '<p>Keep this email somewhere safe for future reference, and have fun!</p>' +
                //           '<p>xoxo</p>' +
                //           '<p>Team Ghost<br>' +
                //           '<a href="https://ghost.org">https://ghost.org</a></p>'
                // };
                // mailer.send(message).otherwise(function (error) {
                //     errors.logError(
                //         error.message,
                //         "Unable to send welcome email, your blog will continue to function.",
                //         "Please see http://docs.ghost.org/mail/ for instructions on configuring email."
                //     );
                // });
                return EmailService.sendWelcomeEmail({nickname:nickname,email:email});
                // req.session.regenerate(function (err) {
                //     if (!err) {
                //         if (req.session.user === undefined) {
                //             req.session.user = user;
                //             req.session.authenticated=true;
                //         }
                //         res.json(200, {redirect: '/admin/contract/'});
                //     }else{
                //         res.json(401,{error:err});
                //     }
                // });
                
        }).then(function(data){
            return res.json(200, {redirect: '/admin/signin/'});
            console.log("User created");
        }).fail(function (err) {
            Utilfunctions.errorHandler(err,res,"Cannot find by email: "+email);
        });
    },
    'forgotten': function (req, res) {
        /*jslint unparam:true*/
        return generateView(req,res,'forgotten','login','ghost-forgotten',true);
    },
    'doForgotten': function (req, res) {
        var email = req.body.email;
        User.generateResetToken(email, Date.now()+3600000,"").then(function(token){
            var protocol=req.connection.encrypted?'https':'http';
            resetUrl =  protocol+'://'+req.headers.host+'/admin/reset/' + token + '/';
            resetLink = '<a href="' + resetUrl + '">' + resetUrl + '</a>',
            console.log("token is "+token);
            message = {
                to: email,
                subject: 'Reset Password',
                html: '<p><strong>Hello!</strong></p>' +
                      '<p>Please follow the link below to reset your password:<br><br>' + resetLink + '</p>' +
                      '<p>Wholeren Database</p>'
            };
            
            return EmailService.sendEmail(message);
        }).then(function(){
            var notification = {
                type: 'success',
                message: 'Check your email for further instructions',
                status: 'passive',
                id: 'successresetpw'
            };
            return res.json(200, {redirect: '/admin/signin/', notification:notification});
        }).fail(function(err){
            return res.json(401, {redirect: '/admin/signin/',error:err});
        });
        // api.users.generateResetToken(email).then(function (token) {
        //     var siteLink = '<a href="' + config().url + '">' + config().url + '</a>',
        //         resetUrl = config().url.replace(/\/$/, '') +  '/ghost/reset/' + token + '/',
        //         resetLink = '<a href="' + resetUrl + '">' + resetUrl + '</a>',
        //         message = {
        //             to: email,
        //             subject: 'Reset Password',
        //             html: '<p><strong>Hello!</strong></p>' +
        //                   '<p>A request has been made to reset the password on the site ' + siteLink + '.</p>' +
        //                   '<p>Please follow the link below to reset your password:<br><br>' + resetLink + '</p>' +
        //                   '<p>Ghost</p>'
        //         };

        //     return mailer.send(message);
        // }).then(function success() {
            
            // return api.notifications.add(notification).then(function () {
            //     res.json(200, {redirect: config().paths.subdir + '/ghost/signin/'});
            // });

        // }, function failure(error) {
        //     // TODO: This is kind of sketchy, depends on magic string error.message from Bookshelf.
        //     if (error && error.message === 'EmptyResponse') {
        //         error.message = "Invalid email address";
        //     }

        //     res.json(401, {error: error.message});
        // });
    },
    'reset': function (req, res) {
        // Validate the request token
        var token = req.params.token;

        User.validateToken(token,"").then(function () {
            // Render the reset form
            return generateView(req,res,'reset','reset','ghost-reset',true);
        }).fail(function (err) {// Redirect to forgotten if invalid token

            //errors.logError(err, 'admin.js', "Please check the provided token for validity and expiration.");

            // return api.notifications.add(notification).then(function () {
            //     res.redirect(config().paths.subdir + '/admin/forgotten');
            // });
            return res.json(401,err);
        });
    },
    'doReset': function (req, res) {
        var token = req.params.token,
            newPassword = req.param('newpassword'),
            ne2Password = req.param('ne2password');

        User.resetPassword(token, newPassword, ne2Password,"").then(function () {
            var notification = {
                type: 'success',
                message: 'Password changed successfully.',
                status: 'passive',
                id: 'successresetpw'
            };
            return res.json(200, {redirect:'/admin/signin/',notification:notification,delay:1});
        }).fail(function (err) {
            return res.json(401, {error: err});
        });
    },
    'import':function(req,res){
        var filename='603.csv';
        Utilfunctions.importContract(filename)
         .then(function(data){
             console.log('import done');
         }).catch(function(err){
            Utilfunctions.errorHandler(err,res,"Import failed! file: "+filename);
         });
    },
    'importUser':function(req,res){
        Utilfunctions.importUser().then(function(data){
             console.log('import done');
         }).catch(function(err){
            Utilfunctions.errorHandler(err,res,"Import User failed");
         });
    }
}