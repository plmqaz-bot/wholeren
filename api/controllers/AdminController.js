

adminNavbar = {
    contract: {
        name: 'Contract',
        navClass: 'contract',
        key: 'admin.navbar.contract',
        path: '/contract/'
    },
    content: {
        name: 'Content',
        navClass: 'content',
        key: 'admin.navbar.content',
        path: '/'
    },
    add: {
        name: 'New Post',
        navClass: 'editor',
        key: 'admin.navbar.editor',
        path: '/editor/'
    },
    settings: {
        name: 'Settings',
        navClass: 'settings',
        key: 'admin.navbar.settings',
        path: '/settings/'
    }
};

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
}