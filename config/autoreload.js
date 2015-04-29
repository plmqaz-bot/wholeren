/**
 * Created by Han on 4/28/2015.
 * For usage with sails-hook-autoreload. it reloads model and controller and services when changes are made
 */

module.exports.autoreload={
    active:true,
    usePolling:true,
    dirs:[
        'api/models',
        'api/controllers',
        'api/services'
    ]
}
