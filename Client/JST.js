/*************************************************All the templates *****************************/
//var tpMsgPane = require('./template/settings/message.hbs');
//var tpSidebar = require('./template/settings/sidebar.hbs');
var tpGeneral = require('./template/settings/general.hbs');
var tpReply = require('./template/modals/reply.hbs');
//var tpChooseMaterial = require('./template/modals/material.hbs');
var tpNotification = require('./template/notification.hbs');
//var tpKeyword = require('./template/settings/keyword.hbs');
//var tpMaterial = require('./template/settings/replymaterial.hbs');
//var tpKeywordSingle=require('./template/settings/keyword_single.hbs');
//var tpMaterialSingle = require('./template/settings/replymaterial_single.hbs');
//var tpMaterialAdd = require('./template/settings/replymaterial_add.hbs');
var tpContract=require('./template/contract.hbs');
var tpContractSingle=require('./template/contract_single.hbs');
var tpContractEdit=require('./template/modals/contract_edit.hbs');
var tpSignup=require('./template/signup.hbs');
var tpSignin=require('./template/login.hbs');
var tpService=require('./template/service.hbs');
var tpServiceSingle=require('./template/service_single.hbs');
var tpServiceEdit=require('./template/modals/service_edit.hbs');
var tpl={
    'contract':tpContract,
    'contractSingle':tpContractSingle,
    'contractEdit':tpContractEdit,
    'editbox':tpReply,
    'notification':tpNotification,
    'signup':tpSignup,
    'signin':tpSignin,
    'service':tpService,
    'serviceSingle':tpServiceSingle,
    'serviceEdit':tpServiceEdit
};

module.exports=tpl;