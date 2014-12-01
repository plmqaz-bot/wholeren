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

    var filename='TR.csv';
    var LEAD={},STATUS={},LEADLEVEL={},COUNTRY={},DEGREE={},PAYMENT={},CATEGORY={},SERVICETYPE={};
    var options=Lead.find().then(function(data){
        LEAD=data;
        return LeadLevel.find();
    }).then(function(data){
        LEADLEVEL=data;
        return Country.find();
    }).then(function(data){
        COUNTRY=data;
        return Degree.find();
    }).then(function(data){
        DEGREE=data;
        return PaymentOption.find();
    }).then(function(data){
        PAYMENT=data;
        return ContractCategory.find();
    }).then(function(data){
        CATEGORY=data;
        return Promise.resolve(data);
    });


     fs.readFile(filename,'utf8',function(err,data){
        if(err) throw err;
        parse(data,{comment:'#'},function(err,output){
            options.then(function(data){
                    var firstline = true;
                var linepromises = [];
                var i=0;
                output.forEach(function (line) {
                    line.forEach(function (element) {
                        element = element.replace('\"', '');
                        element = element.replace('\'', '');
                    });
                    if (firstline) {
                        firstline = false;
                    } else {
                       var curP = oneline(line).then(function(data){
                            console.log("finish line ",i);
                        }).fail(function(err){
                            console.log(err);
                        });
                    }
                });
            });
        });
     });
     
     function oneline(line){
        var contract={};
        var client={};
        client.chineseName=line[1];
        contract.contractCategory=line[2].replace(/^\s+|\s+$/g, ''); // later get contractcategoryid;
        contract.createdAt=new Date(line[3]);
        contract.lead=line[4]; // Later get the id;
        contract.leadName=line[5];
        contract.assistant=line[6]; //Later get user id;
        contract.sales=line[7]; //later get user id;
        contract.expert=line[8]; // later get user id;
        contract.status=line[9]; // later get id of status;
        contract.salesFollowup=line[10];
        contract.salesRecord=line[11];
        contract.leadLevel=line[12]; // later get leadlevel id;
        contract.expertContactdate=new Date(line[13]);
        //contract.expertFollowup=line[14];
        contract.expertFollowup=line[14]?line[14]:line[15];
        client.lastName=line[16];
        client.firstName=line[17];
        contract.originalText=line[18];
        client.primaryEmail=line[19].replace(/^\s+|\s+$/g, '');
        client.primaryPhone=line[20];
        contract.country=line[22]; // later get country id;
        contract.validI20=line[23]=='是'?true:false;
        contract.previousSchool=line[24];
        contract.targetSchool=line[25];
        var temp=parseFloat(line[26]);
        contract.gpa=temp?temp:0.0;
        temp=parseFloat(line[27]);
        contract.toefl=temp?temp:0.0;
        contract.otherScore=line[28];
        contract.age=line[29];
        contract.degree=line[30]; // later get degree id
        contract.diagnose=line[31];
        contract.contractSigned=new Date(line[32]);
        contract.contractPaid=new Date(line[33]);
        var Service=line[34]+","+line[35]+","+line[36]+","+line[37]; // Work on service
        temp=parseFloat(line[38]);
        contract.contractPrice=temp?temp:0.0;
        contract.contractDetail=line[39];
        contract.endFee=line[40];
        contract.paymentOption=line[41]; // later get payment id
        contract.endFeeDue=line[42]=='是'?true:false;
        contract.teacher=line[43]; // later get user id

        exchangeOptions(contract);
        var p=Promise.defer();
        return getClient(client).then(function(cid){
            contract.client=cid.id;
            //console.log("client id is ",contract.client);
            return getUser(contract.assistant);
        }).then(function(assis){
            contract.assistant=assis;
            return getUser(contract.sales);
        }).then(function(sale){
            contract.sales=sale;
            return getUser(contract.expert);
        }).then(function(exp){
            contract.expert=exp;
            return getUser(contract.teacher);
        }).then(function(tea){
            contract.teacher=tea;
            // add this contract
            console.log("look for contract",contract.client);
            return Contract.findOne({client:contract.client,salesFollowup:contract.salesFollowup});
        }).then(function(cont){
          if(cont){
                // if found, use it
                console.log("found contract",contract.client);
                 return Promise.resolve(cont);
            }else{
                var stringcontract=JSON.stringify(contract);
                contract=JSON.parse(stringcontract);
                console.log("creating contract",contract);
                return Contract.create(contract);      
            }
        }).then(function(data){
            var contractID=data.id;
            return getService(Service,contractID);     
               // p.resolve("current");
        }).fail(function(err){
            console.log(err);
        });
     };
     function exchangeOptions(contract){
        //get the id of category
        //var categoryid=contract.contractCategory?(_.find(CATEGORY,{'contractCategory':contract.contractCategory})).id:0;
       // console.log(CATEGORY);
        var categoryid=CATEGORY[contract.contractCategory];
        //console.log(contract.contractCategory," got id ",categoryid);
        //var leadid=contract.lead?(_.find(LEAD,{'lead':contract.lead})).id:0;
        var leadid=LEAD[contract.lead];
        //console.log(contract.lead," got id ",leadid);
        //var statusid=contract.status?(_.find(STATUS,{'status':contract.status})).id:0;
        var statusid=STATUS[contract.status];
        //console.log(contract.status," got id ",statusid);
        //var leadLevelid=contract.leadLevel?(_.find(LEADLEVEL,{'leadLevel':contract.leadLevel})).id:0;
        var leadLevelid=LEADLEVEL[contract.leadLevel];
        //console.log(contract.leadLevel," got id ",leadLevelid);
        //var countryid=contract.country?(_.find(COUNTRY,{'country':contract.country})).id:0;
        var countryid=COUNTRY[contract.country];
        //console.log(contract.country," got id ",countryid);
        //var degreeid=contract.degree?(_.find(DEGREE,{'degree':contract.degree})).id:0;
        var degreeid=DEGREE[contract.degree];
        //console.log(contract.degree," got id ",degreeid);
        //var paymentid=contract.paymentOption?(_.find(PAYMENT,{'paymentOption':contract.paymentOption})).id:0;
        var paymentid=PAYMENT[contract.paymentOption];
        //console.log(contract.paymentOption," got id ",paymentid);
        contract.contractCategory=categoryid>0?categoryid:null;
        contract.lead=leadid>0?leadid:null;
        contract.status=statusid>0?statusid:null;
        contract.leadLevel=leadLevelid>0?leadLevelid:null;
         contract.country = countryid>0?countryid:1;
        contract.degree=degreeid>0?degreeid:4;
        contract.paymentOption=paymentid>0?paymentid:null;
     }
     function getClient(client){
        var clientId=null;
            var p = Promise.defer();
        return Client.findOne({chineseName:getC.chineseName}).then(function(data){
            if(data){
                return Promise.resolve(data);
            }else{
                var c=JSON.stringify(getC);
                c=JSON.parse(c);
                console.log("creating client",c);
                return Client.create(c);
            }
        });
     };
     function getUser(user){
        
        return User.findOne({ nickname: user }).then(function (data){
                if (data) {
                    return Promise.resolve(data.id);
                } else { 
                    return Promise.resolve(null);
                }
            });
     }
     function getService(service,contID){
        service=service.replace("，",",");
        var servs=service.split(",");
        var p= Promise.defer();
        var insertPs=[];
        var serviceIDs=[];
        console.log(servs);
        _.forEach(servs,function(ele){
            if(!ele) return;
            var id=findID(ele);
           if(id){
                var curPromise=Service.findOne({contract:contID,serviceType:id}).then(function(data){
                    if(data){
                        serviceIDs.push(data.id);
                        return Promise.resolve(data);
                    }else{
                        console.log("create service");
                        return Service.create({contract:contID,serviceType:id}).then(function(s){
                            serviceIDs.push(s.id);
                        });
                    }
                });
                insertPs.push(curPromise);
             }
        });
          
            // var curPromise=Service.create({contract:contID,serviceType:id}).then(function(s){
            //     serviceID.push(s.id);
            // });
             //insertPs.push(curPromise);

        return Promise.all(insertPs).then(function(data){
            console.log("insert service done ",serviceIDs); 
        });
        
     }
     function findID(servs){
        var id=1;
        if(!servs){
            return undefined;
        }
        var id;
        var keyword=servs.substring(0,2);
        //console.log("keyword is ",keyword);
        
        SERVICETYPE.forEach(function(ele){
            var eachone=ele['serviceType'];

            if(eachone.indexOf(keyword)>=0){
               // console.log("found servicetype ",ele.id);
                id=ele.id;
            }
        });

        return id;
     }
      function makeHash(data,name){
        var hash={};
        data.forEach(function(ele){
            hash[ele[name]]=ele['id'];
        });
        return hash;
    }
    }
}