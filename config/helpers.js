var handlebars=require('sails/node_modules/express-handlebars/node_modules/handlebars');
var later=require('later');
	handlebars.registerHelper('link', function (text, options) {
        var attrs = [];
        for (var prop in options.hash) {
            attrs.push(prop + '="' + options.hash[prop] + '"');
        }
        return new handlebars.SafeString(
          "<a " + attrs.join(" ") + ">" + text + "</a>"
        );
    });
    
    handlebars.registerHelper('asset', function (link,options) {
        var output = '/' + link;
        var toreturn =new handlebars.SafeString(output);
        return toreturn;
    });

     handlebars.registerHelper('admin_url', function (options) {
   // var absolute = options && options.hash && options.hash.absolute,
        // Ghost isn't a named route as currently it violates the must start-and-end with slash rule
   //     context = !options || !options.hash || !options.hash.frontend ? {relativeUrl: '/ghost'} : 'home';

    //return config.urlFor(context, absolute);
    return "/admin";
    });


/*************************also schedule *****************************************/

later.date.localTime();
var textSched = later.parse.text('at 00:01am every day');
var everymin=later.parse.text('every minute');
var t=later.setInterval(logtime,everymin);

function logtime(){
    console.log(new Date());
}

	

