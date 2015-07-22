/**
* VisaInfo.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  	serviceDetail:{model:'ServiceDetail'},
  	visaProgress:{type:'string',regex:'(1. 初步联络学生|2.填写DS160|3. 预约面签|4. 面签培训|5. 签证结果)'},
    Result:{type:'string'},
    ResultComment:{type:'string'},
    endDate:{type:'date'},
    secondDate:{type:'date'},
    secondResult:{type:'string'},
    secondResultComment:{type:'string'},
    thirdDate:{type:'date'},
    thirdResult:{type:'string'},
  }
};

