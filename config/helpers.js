//var handlebars=require('sails/node_modules/express-handlebars/node_modules/handlebars/dist/cjs/handlebars');
module.exports={
    'asset':function (link,options) {
        var output = '/' + link;
        var handlebars=sails.config.handlebars;
        var toreturn =new handlebars.SafeString(output);
        return toreturn;
    },
    'link':function (text, options) {
        var attrs = [];
        for (var prop in options.hash) {
            attrs.push(prop + '="' + options.hash[prop] + '"');
        }
        var handlebars=sails.config.handlebars;
        return new handlebars.SafeString(
          "<a " + attrs.join(" ") + ">" + text + "</a>"
        );
    },
    'admin_url': function (options) {
        return "/admin";
    }
}


	

