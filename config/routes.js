/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
  * etc. depending on your default view engine) your home page.              *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  // '/': {
  //   view: 'homepage',
  //   locals:{
  //     pathFromApp:'/sailsjs/newapp'
  //     }
  // },
  '/':function(req,res,next){
    res.redirect('/admin/contract/');
  },
  '/view':function(req,res,next){
    res.redirect('/View/welcomePage/');
  },
  'POST /view/login':{
    controller:'View',
    action:'doSignin'
  },
  'POST /view/signup':{
    controller:'View',
    action:'doSignup'
  },
  'POST /admin/doSignin':{
    controller: 'Admin',
    action:'doSignin'
  },
  'POST /admin/doSignup':{
    controller: 'Admin',
    action:'doSignup'
  },
  'POST /admin/forgotten':{
    controller:'Admin',
    action:'doForgotten'
  },
  'GET /admin/reset/:token/':{
    controller:'Admin',
    action:'reset'
  },
  'POST /admin/reset/:token/':{
    controller:'Admin',
    action:'doReset'
  },
  'GET /contract/':{
    controller:'contract',
    action:'getContract'
  },
  'GET /ShortService/':{
    controller:'ShortService',
    action:'find'
  },
  'PUT /ShortService/:id':{
    controller:'ShortService',
    action:'update'
  },
  'POST /ShortService/':{
    controller:'ShortService',
    action:'create'
  },
  'DELETE /ShortService/:id':{
    controller:'ShortService',
    action:'destroy'
  },
  'POST /contract/':{
    controller:'contract',
    action:'createContract'
  },
  'PUT /contract/:id':{
    controller:'contract',
    action:'updateContract'
  },
  'PATCH /contract/:id':{
    controller:'contract',
    action:'updateContract'
  },
  'PATCH /service/:id':{
    controller:'service',
    action:'update'
  },
  // 'PATCH /userLevel/:id':{
  //   controller:'userLevel',
  //   action:'update'
  // },
  // 'PATCH /serviceType/:id':{
  //   controller:'serviceType',
  //   action:'update'
  // },
  // 'GET /service/':{
  //   controller:'service',
  //   action:'getService'
  // },
  // 'GET /user/':{
  //   controller:'user',
  //   action:'getAllUser',
  // },
  'GET /SalesComission/':{
    controller:'comission',
    action:'getSalesComission'
  },
  'GET /SalesComission/roles/':{
    controller:'comission',
    action:'getSalesRoles'
  },
  'POST /SalesComission/':{
    controller:'comission',
    action:'updateSalesComission'
  },
  'GET /ServiceComission/':{
    controller:'comission',
    action:'getServiceComission'
  },
  'GET /ServiceComission/roles/':{
    controller:'comission',
    action:'getServiceRoles'
  },
  'GET /ServiceComission/level/':{
    controller:'comission',
    action:'getServiceLevel'
  },
  'GET /ServiceDetail/':{
    controller:'ServiceDetail',
    action:'find'
  },
  'POST /ServiceDetail/':{
    controller:'ServiceDetail',
    action:'createorupdate'
  },
  'POST /ServiceComission/':{
    controller:'comission',
    action:'updateServiceComission'
  },
  'GET /AssistantComission/':{
    controller:'comission',
    action:'getAssistantComission'
  },
  'GET /Accounting/':{
    controller:'accounting',
    action:'find'
  },
  'GET /Accounting/:id':{
    controller:'accounting',
    action:'findOne'
  },
  'PUT /Accounting/:id':{
    controller:'accounting',
    action:'update'
  },
  // 'PATCH /user/:id':{
  //   controller:'user',
  //   action:'update'
  // },
  // 'PATCH /Invoice/:id':{
  //   controller:'invoice',
  //   action:'update'
  // },
  // 'PATCH /ServiceInvoice/:id':{
  //   controller:'ServiceInvoice',
  //   action:'update'
  // },
  'POST /user/changepw/':{
    controller:'user',
    action:'changepw'
  },
  // 'PATCH /application/:id':{
  //   controller:'application',
  //   action:'update'
  // },
  // 'PATCH /serviceDetail/:id':{
  //   controller:'serviceDetail',
  //   action:'update'
  // },
  // 'PATCH /ServComissionLookUp/:id':{
  //   controller:'ServComissionLookUp',
  //   action:'update'
  // },
  //'PATCH /WhoOwnsWho/:id':{
  //  controller:'WhoOwnsWho',
  //  action:'update'
  //},
  'GET /options/?':{
    controller:'contract',
    action:'getAllOptions'
  },
  'POST /market/MonthlyGoal/':{
    controller:'market',
    action:'updateMonthlyGoal'
  },
  'PUT /market/MonthlyGoal/:id':{
    controller:'market',
    action:'updateMonthlyGoal'
  },

  /***************************************************************************
  *                                                                          *
  * Custom routes here...                                                    *
  *                                                                          *
  *  If a request to a URL doesn't match any of the custom routes above, it  *
  * is matched against Sails route blueprints. See `config/blueprints.js`    *
  * for configuration options and examples.                                  *
  *                                                                          *
  ***************************************************************************/
  /*******************These are dummy Controllers for fake Models**************/
  'GET /ShortContract/':'ShortContractController.find',
  'GET /ShortContract/:id':'ShortContractController.findOne',
  'PUT /ShortContract/:id':'ShortContractController.update',
  'DELETE /ShortContract/:id':'ShortContractController.destroy'
};
