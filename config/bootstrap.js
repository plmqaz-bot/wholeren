/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#/documentation/reference/sails.config/sails.config.bootstrap.html
 */
var later=require('later');
var Promise=require('bluebird');

module.exports.bootstrap = function(cb) {
/*************************also schedule *****************************************/


//PeriodicFunctions.periodicEmailCheck();

for(var key in PeriodicFunctions){
	if(PeriodicFunctions.hasOwnProperty(key)&&typeof PeriodicFunctions[key]==='function'){
		sails.log.info('Set up periodic function: ',key);
		//PeriodicFunctions[key]();
		setInterval(PeriodicFunctions[key], 1000*60*60*24);		
	}
}


  // It's very important to trigger this callback method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
  cb();
};
