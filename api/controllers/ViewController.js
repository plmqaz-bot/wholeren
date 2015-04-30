/**
 * ViewController
 *
 * @description :: Server-side logic for managing Views
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
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
};

