//var _=require('lodash');
var bcrypt = require('bcrypt');
var parse=require('csv-parse');
var fs=require('fs');
var Promise=require('bluebird');
loginSecurity = [];
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
    comission: {
        name: 'Comission',
        navClass: 'contract',
        key: 'admin.navbar.contract',
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
    user: {
        name: 'User',
        navClass: 'contract',
        key: 'admin.navbar.contract',
        path: '/user/',
        display:false
    },
    settings: {
        name: 'Settings',
        navClass: 'settings',
        key: 'admin.navbar.settings',
        path: '/settings/',
        display:false
    }
};
loginSecurity=[];
function setSelected(list, name) {
    _.each(list, function (item, key) {
        item.selected = key === name;
    });
    return list;
}

module.exports={

    'index': function (req, res) {
        /*jslint unparam:true*/
        // function renderIndex() {
        //     res.render('contract', {
        //         bodyClass: 'contract',
        //         adminNav: setSelected(adminNavbar, 'contract')
        //     });
        // }

        // renderIndex();
        res.redirect('/admin/contract/');
    },
    'contract':function(req,res){
        var allowedSections = ['', 'general', 'user', 'apps'],
            section = req.url.replace(/(^\/admin\/contract[\/]*|\/$)/ig, '');

        if (allowedSections.indexOf(section) < 0) {
            return next();
        }
        if(req.session.manager){
            adminNavbar.user.display=true;
            adminNavbar.market.display=true;
        }else{
            adminNavbar.user.display=false;
            adminNavbar.market.display=false;
        }

        res.render('contract', {
            bodyClass: 'contract',
            adminNav: setSelected(adminNavbar, 'contract'),
            currentUser:req.session.user
        });
    },
    'service':function(req,res){
        if(req.session.manager){
            adminNavbar.user.display=true;
            adminNavbar.market.display=true;
        }else{
            adminNavbar.user.display=false;
            adminNavbar.market.display=false;
        }
        res.render('contract', {
            bodyClass: 'contract',
            adminNav: setSelected(adminNavbar, 'service'),
            currentUser:req.session.user
        });
    },
    'market':function(req,res){
        if(req.session.manager){
            adminNavbar.user.display=true;
            adminNavbar.market.display=true;
        }else{
            adminNavbar.user.display=false;
            adminNavbar.market.display=false;
        }
        res.render('settings', {
            bodyClass: 'settings',
            adminNav: setSelected(adminNavbar, 'market'),
            currentUser:req.session.user
        });
    },
    'comission':function(req,res){
        if(req.session.manager){
            adminNavbar.user.display=true;
            adminNavbar.market.display=true;
        }else{
            adminNavbar.user.display=false;
            adminNavbar.market.display=false;
        }
        res.render('contract', {
            bodyClass: 'contract',
            adminNav: setSelected(adminNavbar, 'comission'),
            currentUser:req.session.user
        });
    },
    'user':function(req,res){
        if(req.session.manager){
            adminNavbar.user.display=true;
            adminNavbar.market.display=true;
        }else{
            adminNavbar.user.display=false;
            adminNavbar.market.display=false;
        }
        res.render('contract', {
            bodyClass: 'contract',
            adminNav: setSelected(adminNavbar, 'user'),
            currentUser:req.session.user
        });
    },

    'settings': function (req, res, next) {
        // TODO: Centralise list/enumeration of settings panes, so we don't run into trouble in future.
        var allowedSections = ['', 'general', 'user', 'apps'],
            section = req.url.replace(/(^\/ghost\/settings[\/]*|\/$)/ig, '');

        if (allowedSections.indexOf(section) < 0) {
            return next();
        }

        return res.render('settings', {
            bodyClass: 'settings',
            adminNav: setSelected(adminNavbar, 'settings')
        });
    },
    'signout': function (req, res) {
        req.session.destroy();

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
        return res.render('login', {
            bodyClass: 'ghost-login',
            hideNavbar: true,
            adminNav: setSelected(adminNavbar, 'login')
        });
    },
    'signup': function (req, res) {
        /*jslint unparam:true*/
        res.render('signup', {
            bodyClass: 'ghost-signup',
            hideNavbar: true,
            adminNav: setSelected(adminNavbar, 'login')
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
                    req.session.authenticated=true;
                    if(ppl.rank>1) req.session.manager=true;
                    if(!redirect) redirect='/admin/contract/';
                    loginSecurity=_.reject(loginSecurity,function(ipTime){
                        return ipTime.ip===remoteAddress;
                    });
                    return res.json(200,{redirect:redirect});
                })
            }).fail(function(err){
                return res.json(400,err);
            });
        } else {
            res.json(401, {error: 'Slow down, there are way too many login attempts!'});
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
                EmailService.send();
                req.session.regenerate(function (err) {
                    if (!err) {
                        if (req.session.user === undefined) {
                            req.session.user = user;
                            req.session.authenticated=true;
                        }
                        res.json(200, {redirect: '/admin/contract/'});
                    }else{
                        res.json(401,{error:err});
                    }
                });
                console.log("User created");
        }).fail(function (error) {
            console.log("Create failed");
            console.log(error);
            res.json(401, {error: error.message});
        });
    },
    'forgotten': function (req, res) {
        /*jslint unparam:true*/
        res.render('forgotten', {
            bodyClass: 'ghost-forgotten',
            hideNavbar: true,
            adminNav: setSelected(adminNavbar, 'login')
        });
    },
    'doForgotten': function (req, res) {
        var email = req.body.email;

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
            var notification = {
                type: 'success',
                message: 'Check your email for further instructions',
                status: 'passive',
                id: 'successresetpw'
            };
            res.json(200, {redirect: '/admin/signin/', notification:notification});
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

        api.users.validateToken(token).then(function () {
            // Render the reset form
            res.render('reset', {
                bodyClass: 'ghost-reset',
                hideNavbar: true,
                adminNav: setSelected(adminNavbar, 'reset')
            });
        }).otherwise(function (err) {
            // Redirect to forgotten if invalid token
            var notification = {
                type: 'error',
                message: 'Invalid or expired token',
                status: 'persistent',
                id: 'errorinvalidtoken'
            };

            errors.logError(err, 'admin.js', "Please check the provided token for validity and expiration.");

            return api.notifications.add(notification).then(function () {
                res.redirect(config().paths.subdir + '/ghost/forgotten');
            });
        });
    },
    'import':function(req,res){
        Utilfunctions.importContract('EM_12_7.csv')
         .then(function(data){
             console.log('import done');
         }).error(function(err){
            console.log('errors: ',err);
         });
    },
    'importUser':function(req,res){
        Utilfunctions.importUser().then(function(data){
             console.log('import done');
         }).error(function(err){
            console.log('errors: ',err);
         });
    }
}