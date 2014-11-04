var _=require('lodash');
loginSecurity = [];
adminNavbar = {
    contract: {
        name: 'Contract',
        navClass: 'contract',
        key: 'admin.navbar.contract',
        path: '/contract/'
    },
    service: {
        name: 'Service',
        navClass: 'contract',
        key: 'admin.navbar.contract',
        path: '/service/'
    },
    user: {
        name: 'User',
        navClass: 'contract',
        key: 'admin.navbar.contract',
        path: '/user/'
    },
    settings: {
        name: 'Settings',
        navClass: 'settings',
        key: 'admin.navbar.settings',
        path: '/settings/'
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
        function renderIndex() {
            res.render('content', {
                bodyClass: 'manage',
                adminNav: setSelected(adminNavbar, 'content')
            });
        }

        renderIndex();
    },
    'contract':function(req,res){
        var allowedSections = ['', 'general', 'user', 'apps'],
            section = req.url.replace(/(^\/admin\/contract[\/]*|\/$)/ig, '');

        if (allowedSections.indexOf(section) < 0) {
            return next();
        }

        res.render('contract', {
            bodyClass: 'contract',
            adminNav: setSelected(adminNavbar, 'contract')
        });
    },
    'service':function(req,res){
        res.render('contract', {
            bodyClass: 'contract',
            adminNav: setSelected(adminNavbar, 'service')
        });
    },
    'user':function(req,res){
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

        res.render('settings', {
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

        if (!denied) {
            loginSecurity.push({ip: remoteAddress, time: currentTime});
            // api.users.check({email: req.body.email, pw: req.body.password}).then(function (user) {
            //     req.session.regenerate(function (err) {
            //         if (!err) {
            //             req.session.user = user.id;
            //             var redirect = config().paths.subdir + '/ghost/';
            //             if (req.body.redirect) {
            //                 redirect += decodeURIComponent(req.body.redirect);
            //             }
            //             // If this IP address successfully logs in we
            //             // can remove it from the array of failed login attempts.
            //             loginSecurity = _.reject(loginSecurity, function (ipTime) {
            //                 return ipTime.ip === remoteAddress;
            //             });
            //             res.json(200, {redirect: redirect});
            //         }
            //     });
            // }, function (error) {
            //     res.json(401, {error: error.message});
            // });
            req.session.user=1;
            
            //res.json(401, {error:"Can not log you in!!!"});
            res.json(200, {redirect: '/admin/contract/'});
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
                            req.session.user = user.id;
                        }
                        res.json(200, {redirect: '/admin/contract/'});
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