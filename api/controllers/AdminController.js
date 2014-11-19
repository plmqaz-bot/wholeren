//var _=require('lodash');
var bcrypt = require('bcrypt');
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
        }else{
            adminNavbar.user.display=false;
        }

        res.render('contract', {
            bodyClass: 'contract',
            adminNav: setSelected(adminNavbar, 'contract')
        });
    },
    'service':function(req,res){
        if(req.session.manager){
            adminNavbar.user.display=true;
        }else{
            adminNavbar.user.display=false;
        }
        res.render('contract', {
            bodyClass: 'contract',
            adminNav: setSelected(adminNavbar, 'service')
        });
    },
    'user':function(req,res){
        if(req.session.manager){
            adminNavbar.user.display=true;
        }else{
            adminNavbar.user.display=false;
        }
        res.render('contract', {
            bodyClass: 'contract',
            adminNav: setSelected(adminNavbar, 'user')
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
         res.render('login', {
            bodyClass: 'ghost-login',
            hideNavbar: true,
            adminNav: setSelected(adminNavbar, 'login')
        });
         res.end();
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
            password = req.body.password;

        User.create({
            firstname: firstname,
            lastname: lastname,
            nickname: nickname,
            email: email,
            password: password
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
}