
var parse=require('csv-parse');
var fs=require('fs');
var Promise=require('bluebird');
var _=require('lodash');
var csv=require('fast-csv');
var moment=require('moment');
 function makeHash(data,name){
        var hash={};
        data.forEach(function(ele){
            hash[ele[name]]=ele['id'];
        });
        return hash;
	};
	function stripstring(str){
		if(!str){
			return "";
		}
		if(str.toLowerCase()=="na"){
			return "";
		}
        if(str){
            return str.replace(/^\s+|\s+$/g, '');
        }else{
            return "";
        }
    };
module.exports = {
	'makePopulateHash':function(data){
		hash={};
		data.forEach(function(ele){
		hash[ele['id']]=ele;
		});
        return hash;
    },
    'makeO2MHash':function(data,field){
    	hash={};
    	data.forEach(function(ele){
    		if(!hash[ele[field]]){
    			hash[ele[field]]=[ele];
    		}else{
    			hash[ele[field]].push(ele);
    		}
    	});
    	return hash;
    },
    makeHash:function(data,name){
    	makeHash(data,name);
    },
    backgridHash:function(data,name){
    	return _.map(data,function(ele){
    		return [ele[name],ele['id']];
    	});
    },
    prepareUpdate:function(attribs,fields){
    	var toReturn={};
    	fields.forEach(function(e){
    		if(attribs.hasOwnProperty(e)){
    			toReturn[e]=attribs[e];
    		}
    	});
    	return toReturn;
    },
    formatDate:function(date){
    	var d=new Date(date);
    	console.log(d);
    	console.log(d.getMonth());
    	return d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();
    },
    importContract:function(filename){
		var LEAD={},STATUS={},LEADLEVEL={},COUNTRY={},DEGREE={},PAYMENT={},CATEGORY={},SERVICETYPE={},LEADDETAIL={},SALESGROUP={};
		var options=Lead.find().then(function(data){
			LEAD=makeHash(data,'lead');
			return LeadDetail.find();
	    }).then(function(data){
	    	 LEADDETAIL=makeHash(data,'leadDetail');
	    	//LEADDETAIL=data;
	    	return LeadLevel.find();
	    }).then(function(data){
	        //LEADLEVEL=makeHash(data,'leadLevel');
	        LEADLEVEL=data;
	        return Country.find();
	    }).then(function(data){
	        COUNTRY=makeHash(data,'country');
	        return Degree.find();
	    }).then(function(data){
	        DEGREE=makeHash(data,'degree');
	        return PaymentOption.find();
	    }).then(function(data){
	        PAYMENT=makeHash(data,'paymentOption');
	        return ContractCategory.find();
	    }).then(function(data){
	        CATEGORY=makeHash(data,'contractCategory');
	        //console.log(data);
	        //console.log(CATEGORY);
	        return Status.find();
	    }).then(function(data){
	        STATUS=makeHash(data,'status');
	        return ServiceType.find();
	    }).then(function(data){
	        SERVICETYPE=data;
	        return SalesGroup.find();
	    }).then(function(data){
	    	SALESGROUP=makeHash(data,'salesGroup');
	    	return Promise.resolve(data);
	    });
	    var errorLine=[];
	    var toReturn=Promise.defer();
	    var problem_user=[];
        var unknownItems=[];
        var unknownStatus=[];
        var replaceValues=[
	     {old:'paulaguosa',newname:'paula,guosa'},
	     {old:'qiqiguosa',newname:'qiqi,guosa'},
	     {old:'zhiminpaula',newname:'zhimin,paula'},
	     {old:'qiqiguosa',newname:'qiqi,guosa'},
	     {old:'patrickguosa',newname:'patrick,guosa'},
	     {old:'paulaalex',newname:'paula,alexwang'},
	     {old:'chenchenpaula',newname:'chenchen,paula'},
	     {old:'paulaguosa',newname:'paula,guosa'},
	     {old:'tingmengye',newname:'ting,mengye'},
	     {old:'mengyeting',newname:'mengye,ting'},
	     {old:'yirongxuejing',newname:'yirong,xuejing'},

	     ];
	     var old2Newname=[{old:'tingting',newname:'ting'},
	     {old:'cliff',newname:'ting'},
	     {old:'katherine',newname:'ting'},
	     {old:'chentan',newname:'chenchen'},
	     {old:'tingting',newname:'ting'},
	     {old:'paupa',newname:'paula'},
	     {old:'王老师',newname:'alexwang'},
	     {old:'婷老',newname:'ting'},
	     {old:'星仔',newname:'xing'},
	     {old:'北京盼盼',newname:'paula'},
	     {old:'caoqing',newname:'ting'},
	     {old:'cao',newname:'ting'},	     
	     {old:'yubing',newname:'patrick'},
	     {old:'brain',newname:'ting'},
	     {old:'green',newname:'ting'},
	     {old:'renee',newname:'xiaoya'},
	     {old:'shang',newname:'ting'},
	     {old:'lisa',newname:'ting'},
	     {old:'设计师',newname:'ting'},
	     {old:'yagyangyang',newname:'yangyang'},
	     {old:'sasa',newname:'guosa'},
	     {old:'嘉宁',newname:'janine'},
	     {old:'王曾安琪',newname:'serenewang'},
	     {old:'王芾',newname:'alexwang'},
	     {old:'chechen',newname:'chenchen'},
	     {old:'yihong',newname:'yirong'},
	     {old:'kelly',newname:'yirong'},
	     {old:'chole',newname:'chloe'},
	     {old:'chengzhi',newname:'chenzhi'},
	     {old:'楚卉',newname:'chuhui'},
	     {old:'angelatan',newname:'angela'},
	     {old:'tingtingting',newname:'ting'},
	     {old:'yolandali',newname:'yolanda'},
	     {old:'shiyuliu',newname:'shiyu'},
	     {old:'chenzhili',newname:'chenzhi'},
	     {old:'lichenzhi',newname:'chenzhi'},
	     {old:'qiyao',newname:'qiyao'},
	     {old:'alex王',newname:'alexwang'},
	     {old:'yaoqi',newname:'qiyao'},
	     {old:'xueqiwang',newname:'xueqi'},
	     {old:'gindu',newname:'gin'},
	     {old:'张然',newname:'糯米'},
	     {old:'zhangran',newname:'糯米'},
		 {old:'nancyzhang',newname:'nancy'},
		 {old:'chenjie',newname:'judy'},
		 {old:'mary申诉',newname:'mary'},
		 {old:'wangxinyi',newname:'xinyiwang'},
		 {old:'zixichen',newname:'zixi'},
		 {old:'盼盼',newname:'paula'},
		 {old:'panpan',newname:'paula'},
		 {old:'taoyan',newname:'michelle'},
		 {old:'吕海琳',newname:'hailin'},
		 {old:'xianxinzan',newname:'xiaoxin'},
		 {old:'zhenli',newname:'lydia'},
		 {old:'李祯',newname:'lydia'},
		 {old:'ertaicai',newname:'lydia'},
		 {old:'wanyin',newname:'ting'},
	     ];
	    fs.readFile(filename,'utf8',function(err,data){
	        if(err) throw err;
	        parse(data,{comment:'#'},function(err,output){
	            options.then(function(data){
	                    var firstline = true;
	                var linepromises = [];
	                var i=0;
	                var allPromises=[];
	                output.forEach(function (line) {
	                    line=_.map(line,function (element) {
	                        element = element.replace(/\"/g, '');
	                        element = element.replace(/\'/g, '');
	                        element=element.replace(new RegExp(String.fromCharCode(65292),'g'),",");
	                        element=element.replace(new RegExp(String.fromCharCode(65295),'g'),"/");
	                        element=element.replace(new RegExp(String.fromCharCode(65291),'g'),"+");
	                        //if(element.indexOf('紧急二次购买')>-1) console.log(element);
	                        return element;
	                    });
	                    if (firstline) {
	                        firstline = false;
	                    } else {
	                        console.log("start line ",i);
	                       var curP = oneline(line,i).then(function(data){
		                       	if(data.success){
		                       		console.log("finish line ",data.line);
		                       	}else{
		                       		errorLine.push(data.data);
		                       		console.log("error on line ",data.line);	
		                       	}
	                        })
	                        allPromises.push(curP);
	                        i++;
	                    }
	                });
					console.log("done loop");
	                return Promise.all(allPromises);
	            })
				 .then(function(data){
	             	problem_user=_.uniq(problem_user);
                    unknownItems= _.uniq(unknownItems);
                    unknownStatus= _.unique(unknownStatus);
	             	console.log(problem_user,"unknown user names");
                    console.log("Unknown items :",unknownItems);
                    console.log("Unknown status :",unknownStatus);
					
					var fsstream=fs.createWriteStream("error.csv");
					csv.write(errorLine,{header:false}).pipe(fsstream);
					toReturn.resolve("done");
                 }).fail(function(err){
	             	console.log('finished with errors',err);
	             	toReturn.reject("finished with errors");
	             });
	        });
	    });
	     return toReturn.promise;
	     
	     function processUserNames(string){
	     	var toReturn=string;
			 toReturn=toReturn.replace(/\"/g,'');
	     	replaceValues.forEach(function(ele){
	     		toReturn=toReturn.replace(ele['old'],ele['newname']);
	     	})
	     	toReturn=toReturn.replace(" ","");
	     	return toReturn;
	     }
	    function oneline(line,linenum){
	        var contract={};
	        var client={};
	        var serviceTeachers=[];
	        //if(line[0]=='新表格')return Promise.resolve("already")
	        contract.namekey=line[0];
	        client.chineseName=line[1];
	        contract.salesGroup=stripstring(line[2]);
	        contract.contractCategory=stripstring(line[3]); // later get contractcategoryid;
	        contract.degree=stripstring(line[4]); // later get degree id
	        if(line[5]){
	        	contract.createdAt=new Date(line[5].split('\n')[0]);
		        if(isNaN(contract.createdAt.getTime())){
	        		return Promise.resolve({success:false,data:line,line:linenum});
	        	}
	        }else{
	        	contract.createdAt=null;
	        }
	        
	        contract.lead=stripstring(line[6]); // Later get the id;
	        contract.leadDetail=stripstring(line[7]);
	        contract.leadName=line[8];
	        contract.assistant=processUserNames((line[9]||"").replace(/\d/g,'').toLowerCase()).split(/[\s和\+,\/&]+/); //Later get user id;
	        contract.sales=processUserNames((line[10]||"").replace(/\d/g,'').toLowerCase()).split(/[\s和\+,\/&]+/); //later get user id;
	        contract.expert=processUserNames((line[11]||"").replace(/\d/g,'').toLowerCase()).split(/[\s和\+,\/&]+/); // later get user id;
	        contract.status=stripstring(line[12]); // later get id of status;
	        contract.salesFollowup=line[13];
	        contract.salesRecord=line[14];
	        contract.leadLevel=stripstring(line[15]); // later get leadlevel id;
	        if(line[16]){
	        	contract.expertContactdate=new Date(line[16].split('\n')[0]);
	        	if(isNaN(contract.expertContactdate.getTime())){
	        		//return Promise.resolve({success:false,data:line,line:linenum});
	        	}
	        }else{
	        	contract.expertContactdate=null;
	        }
	        //contract.expertFollowup=line[14];

	        contract.expertFollowup=line[17]?line[17]:line[18];
	        client.lastName=line[19];
	        client.firstName=line[20];
	        contract.originalText=line[21];
	        client.primaryEmail=stripstring(line[22]);
	        client.primaryPhone=line[23];
	        //console.log("before getting country",linenum);
	        client.otherInfo=line[24];
	        contract.country=stripstring(line[25]); // later get country id;
	        //console.log("after getting country",linenum);
	        contract.validI20=line[26]=='是'?true:false;
	        contract.previousSchool=line[27];

	        contract.targetSchool=line[28];
	        var temp=parseFloat(line[29]);
	        contract.gpa=temp?temp:0.0;
	        temp=parseFloat(line[30]);
	        contract.toefl=temp?temp:0.0;
	        contract.otherScore=line[31];
	        contract.age=line[32];
	        
	        contract.diagnose=line[33];
	        //contract.contractSigned=line[34]==""?null:new Date(line[34].split('\n')[0]);
	        if(line[34]){
	        	contract.contractSigned=new Date(line[34].split('\n')[0]);
		        if(isNaN(contract.contractSigned.getTime())){
		        	console.log("Invalid date :",line[34]);
	        		//return Promise.resolve({success:false,data:line,line:linenum});
	        	}
	        }else{
	        	contract.contractSigned=null;
	        }
	        //contract.contractPaid=line[35]==""?null:new Date(line[35].split('\n')[0]);
	        if(line[34]){
	        	contract.contractPaid=new Date(line[35].split('\n')[0]);
	        	if(isNaN(contract.contractPaid.getTime())){
		        	console.log("Invalid date :",line[35]);
	        		//return Promise.resolve({success:false,data:line,line:linenum});
	        	}
	        }else{
	        	contract.contractPaid=null;
	        }
	        
	        var Service=line[36]+","+line[37]+","+line[38]+","+line[39]; // Work on service
	        temp=parseFloat(line[40]);
	        contract.contractPrice=temp?temp:0.0;
	        contract.contractDetail=line[41];
	        contract.endFee=line[42];
	        contract.paymentOption=stripstring(line[43]); // later get payment id
	        contract.endFeeDue=line[44]=='是'?true:false;
	        contract.teacher=processUserNames((line[45]||"").replace(/\d/g,'').toLowerCase()).split(/[\s和\+,\/&]+/); // later get user id
	        exchangeOptions(contract);
	        //var p=Promise.defer();
	        //console.log("look for stuff");
	        return getClient(client).then(function(cid){
	            contract.client=cid.id;
	            console.log("client id is ",contract.client);
	            var leadnames=(contract.leadName||"").replace("transfer","").replace(/\d\"/g,'').toLowerCase().split(/[\s,\/+]+/);
	            return getUser(leadnames,false,'leadname');
	        }).then(function(assisCons){
	        	assisCons=_.reject(assisCons=assisCons||[],function(e){return e==null;})
	            var count=1;
	            assisCons.forEach(function(e){
	            	if(count>2)return;
	            	if(e) {
	            		contract['assisCont'+count]=parseInt(e);
	            		count++;
	            	}
	            });
	        	return getUser(contract.assistant);
	        }).then(function(assis){
	           // if(_.contains(assis=assis||[],null)) throw {reason:"unknown assistant",assistant:contract.assistant,ids:assis,line:linenum};
	           	assis=_.reject(assis=assis||[],function(e){return e==null;})
	            var count=1;
	            assis.forEach(function(e){
	            	if(count>4)return;
	            	if(e) {
	            		contract['assistant'+count]=parseInt(e);
	            		count++;
	            	}
	            });
	            delete contract['assistant'];
	            //contract.assistant=assis;
	            return getUser(contract.sales);
	        }).then(function(sale){
	        	//if(_.contains(sale=sale||[],null)) throw {reason:"unknown sales",sales:contract.sales,line:linenum,O:contract.sales};
	        	sale=_.reject(sale=sale||[],function(e){return e==null;});
	        	var count=1;
	        	sale.forEach(function(e){
	        		if(count>2) return;
	        		if(e){
	        			contract['sales'+count]=parseInt(e);
	        		}
	        	});
	            //contract.sales=sale[0];
	            //if(sale.length>1)console.log("weird sales",sale);
	            delete contract['sales'];
	            return getUser(contract.expert);
	        }).then(function(exp){
	            //if(_.contains(exp=exp||[],null)) throw {reason:"unknown expert",expert:contract.expert,line:linenum};
	            exp=_.reject(exp=exp||[],function(e){return e==null;})
	            var count=1;
	        	exp.forEach(function(e){
	        		if(count>2) return;
	        		if(e){
	        			contract['expert'+count]=parseInt(e);
	        		}
	        	});
	        	delete contract['expert'];
	            //contract.expert=exp[0];
	            //if(exp.length>1)console.log("weird exp",exp);
	            return getUser(contract.teacher);
	        }).then(function(tea){
	            //if(_.contains(tea=tea||[],null)) throw {reason:"unknown teacher",teacher:contract.teacher,line:linenum};
	            tea=_.reject(tea=tea||[],function(e){return e==null;})
	            contract.teacher=tea[0];
	            serviceTeachers=tea;
	            if(tea.length>1)console.log("weird teacher",tea);
	            // add this contract
	            console.log("look for contract",contract.client,contract.contractCategory);
	            return Contract.findOne({client:contract.client,contractCategory:contract.contractCategory,lead:contract.lead,leadDetail:contract.leadDetail,contractSigned:contract.contractSigned,contractPaid:contract.contractPaid});
	        }).then(function(cont){
	        	cont=cont||{};
	          if(cont.id){
	                // if found, use it
	                console.log("found contract",cont.id);
	                 return Promise.resolve(cont);
	            }else{
	            	console.log("creating contract",contract);
	                var stringcontract=JSON.stringify(contract);
	                contract=JSON.parse(stringcontract);
	                
	                return Contract.create(contract);      
	            }
	        }).then(function(data){
	        	data=data||{};
	            var contractID1=data.id;
	            console.log("creating service for contract ",contractID1);
	            return getService(Service,contractID1,serviceTeachers);     
	               // p.resolve("current");
	        }).then(function(data){
	            return Promise.resolve({data:line,line:linenum,success:true});
	        }).fail(function(err){
	        	console.log(err);
	        	console.log("error in line ",linenum);
	        	return Promise.resolve({data:line,line:linenum,success:false});
	        });
	    };
	    function exchangeOptions(contract){
	        //get the id of category
	        //var categoryid=contract.contractCategory?(_.find(CATEGORY,{'contractCategory':contract.contractCategory})).id:0;
	       // console.log(CATEGORY);
            if(contract.contractCategory.indexOf('AHS')>=0||contract.contractCategory.indexOf('ELS')>=0||contract.contractCategory.indexOf('薛涌')>=0){
                contract.contractCategory='合作机构';
            }else if(contract.contractCategory.indexOf('中信')>=0||contract.contractCategory.indexOf('游学')>=0){
                contract.contractCategory='大客户';
            }
	        var categoryid=CATEGORY[contract.contractCategory];
	        if(!categoryid) console.log("unknown category :"+contract.contractCategory);
	        //console.log(contract.contractCategory," got id ",categoryid);
	        //var leadid=contract.lead?(_.find(LEAD,{'lead':contract.lead})).id:0;
	        //console.log(LEAD);
	        var leadid=LEAD[contract.lead];
			if(!leadid&&contract.lead) console.log('unknown lead :'+contract.lead);
	        //console.log(contract.lead," got id ",leadid);
	        //var statusid=contract.status?(_.find(STATUS,{'status':contract.status})).id:0;
	        //console.log(STATUS);
	        if(contract.status.indexOf('未咨询')>=0){
	        	contract.status='A. 无效-联系不上';
	        }else if(contract.status.indexOf('Done')>=0||contract.status.indexOf('C1')>=0||contract.status.indexOf('WIP')>=0){
	        	console.log('status is ',contract.status," changing to WIP");
	        	contract.status='E. WIP-进入服务';
	        }else if(contract.status.indexOf('放弃治疗')>=0){
	        	contract.status='F. 放弃治疗';
	        }else if(contract.status.indexOf('A. 未签约')>=0){
	        	contract.status='B. 未咨询-约咨询前&中';
	        }else if(contract.status.indexOf('放弃并转至其他服务')){
	        	contract.status='G. 公益完结';
	        }
	        var statusid=STATUS[contract.status];
	        if(statusid==5){
	        	console.log("Status is 5", contract.status);
	        }
			if(!statusid&&contract.status){
				unknownStatus.push(contract.status);
			} 
	        //if(!statusid&&contract.status) console.log(contract.status," got id ",statusid);
	        //var leadLevelid=contract.leadLevel?(_.find(LEADLEVEL,{'leadLevel':contract.leadLevel})).id:0;
	        //var leadLevelid=LEADLEVEL[contract.leadLevel];
	        var leadLevelid=null;
	        if(contract.leadLevel){
	        	leadLevelid=_.find(LEADLEVEL,function(e){
	        		if(contract.leadLevel.substring(0,2)==e.leadLevel.substring(0,2)) return true;
	        	});
	        	if(!leadLevelid){
	        		console.log('unknown leadLevel :'+contract.leadLevel);	
	        	}else{
	        		leadLevelid=leadLevelid.id;
	        	}
	        }
			//if(!leadLevelid&&contract.leadLevel) console.log('unknown leadLevel :'+contract.leadLevel);
	        //console.log(contract.leadLevel," got id ",leadLevelid);
	        //var countryid=contract.country?(_.find(COUNTRY,{'country':contract.country})).id:0;
	        var countryid=COUNTRY[contract.country];
			if(!countryid&&contract.country) console.log('unknown country :'+contract.country);
	         //console.log(contract.country," got id ",countryid);
	        //var degreeid=contract.degree?(_.find(DEGREE,{'degree':contract.degree})).id:0;
	        //console.log(DEGREE);
	        var degreeid=DEGREE[contract.degree];
			if(!degreeid&&contract.degree) console.log('unknown degree :'+contract.degree);
	        //console.log(contract.degree," got id ",degreeid);
	        //var paymentid=contract.paymentOption?(_.find(PAYMENT,{'paymentOption':contract.paymentOption})).id:0;
	        var paymentid=PAYMENT[contract.paymentOption];
			if(!paymentid&&contract.paymentOption) console.log('unknown paymentOption :'+contract.paymentOption);
	        //console.log(contract.paymentOption," got id ",paymentid);
	        var salesGroupid=SALESGROUP[contract.salesGroup];
			if(!salesGroupid&&contract.salesGroup) console.log('unknown salesGroup :'+contract.salesGroup);
			if(contract.leadDetail=='新介绍lead')contract.leadDetail='陌生leads';
			if(contract.leadDetail=='在服务的学生')contract.leadDetail='服务中的学生再次签约';
	        var leadDetailid=LEADDETAIL[contract.leadDetail];
			if(!leadDetailid&&contract.leadDetail) console.log('unknown leadDetail :'+contract.leadDetail);
	        contract.salesGroup=salesGroupid>0?salesGroupid:null;
	        contract.contractCategory=categoryid>0?categoryid:null;
	        contract.lead=leadid>0?leadid:null;
	        contract.leadDetail=leadDetailid>0?leadDetailid:null;
	        contract.status=statusid>0?statusid:null;
	        contract.leadLevel=leadLevelid>0?leadLevelid:null;
	        contract.country = countryid>0?countryid:1;
	        contract.degree=degreeid>0?degreeid:4;
	        contract.paymentOption=paymentid>0?paymentid:null;
	    }
	    function getClient(getC){
	        var clientId=null;
	            var p = Promise.defer();
	        return Client.findOne({chineseName:getC.chineseName,firstName:getC.firstName,lastName:getC.lastName,primaryPhone:getC.primaryPhone}).then(function(data){
	        	data=data||{};
	            if(data.id){
	                console.log("found client",data);
	                return Promise.resolve(data);
	            }else{
	                var c=JSON.stringify(getC);
	                c=JSON.parse(c);
	                console.log("creating client",c);
	                return Client.create(c);
	            }
	        });
	    };
	    function getUser(users,defaultUser,field){
			users=_.reject(users,function(e){return e==''||e==undefined});
			// Preprocess the username, some are not in database
			var modifyusers=[];
			users.forEach(function(user){
				old2Newname.forEach(function(ele){
	        		user=user.replace(ele['old'],ele['newname']);
	        	});
	        	replaceValues.forEach(function(ele){
	        		user=user.replace(ele['old'],ele['newname']);
	        	});
	        	user=user.split(',');
	        	user.forEach(function(e){
	        		modifyusers.push(e);
	        	});
			});
	        var allprom=_.map(modifyusers,function(user){
				if (user.length<1) {
					console.log(users,"weird users");
		        	if(defaultUser)
		        		user="ting";
		        	else
		        		return Promise.resolve(null);
	        	}
	        	if(user=='tingting'){
	        		user='ting';
	        	}
	        	
	        	user=user.trim();
	        	user=user.replace(/\"/g,'');
	        	return User.findOne({ or:[{nickname: {'contains':user}},{firstname: {'contains':user}},{lastname: {'contains':user}}] }).then(function (data){
	                if (data) {
	                    return Promise.resolve(data.id);
	                } else { 
	                	if(user!='na'){
                            if(field){
                                problem_user.push(field+" :"+user);
                            }else{
                                problem_user.push(user);
                            }
                        }
	                	return Promise.resolve(null);
	                	
	                	// if(user=='na'){
	                	// 	return Promise.resolve(null);
	                	// }else{
	                	// 	console.log("User not found use ting as default ",user);
	                	// 	problem_user.push(user);
	                	// 	return User.findOne({ or:[{nickname: 'ting'},{firstname: 'ting'},{lastname: 'ting'}] }).then(function(data){
	                 //    	if(data)
	                 //    		return Promise.resolve(data.id);
	                 //    	else
	                 //    		return Promise.resolve(null);
	                 //    	});	
	                	// }
	                }
	        	});
	        })
	        return Promise.all(allprom);
	        
	    }
	    function getService(service,contID,teacher){
	        service=service.replace("，",",");
	        service=service.replace(/\d\//g,'');
	        var servs=service.split(/[,+]/);
	        servs=_.reject(servs,function(e){if(e==null||e=="")return true;});
	        var p= Promise.defer();
	        var insertPs=[];
	        var serviceIDs=[];
	        teacher=teacher||[];
	        teacher=_.reject(teacher,function(e){if(e==null||e=="")return true;});
	        //teacher=teacher.length>0?teacher:null;
			console.log("add services ",contID)
	        //console.log(servs);
	        _.forEach(servs,function(ele){
	            if(!ele) return;
	            var id=findID(ele,contID);
	           if(id){
	                var curPromise=Service.findOne({contract:contID,serviceType:id}).then(function(data){
	                	data=data||{};
	                    if(data.id){
	                    	console.log("found service ",data.id);
	                        serviceIDs.push(data.id);
	                        var detailPromise=_.map(teacher,function(e){
	                            	console.log("create service detail ",data.id,e);
	                        	return ServiceDetail.findOne({service:data.id,user:e}).then(function(s){
	                        		s=s||{};
	                        		if(!s.id) return ServiceDetail.create({service:data.id,user:e});
	                        	});
	                        });
	                        return Promise.all(detailPromise);
	                    }else{
	                        console.log("create service",{contract:contID,serviceType:id});
	                        return Service.create({contract:contID,serviceType:id}).then(function(data){

	                            serviceIDs.push(data.id);
	                            var detailPromise=_.map(teacher,function(e){
	                            	console.log("create service detail ",data.id,e);
	                        		return ServiceDetail.findOne({service:data.id,user:e}).then(function(s){
	                        			s=s||{};
	                        			if(!s.id) return ServiceDetail.create({service:data.id,user:e});
	                        		});
	                        	});
	                            return Promise.all(detailPromise);
	                        });
	                    }
	                });
	                insertPs.push(curPromise);
	             }else{
	             	return Comment.create({contract:contID,comment:servs});
	             	//console.log("unknown service type ",ele);
	             }
	        });
	          
	            // var curPromise=Service.create({contract:contID,serviceType:id}).then(function(s){
	            //     serviceID.push(s.id);
	            // });
	             //insertPs.push(curPromise);

	        return Promise.all(insertPs);//.then(function(data){
	           // console.log("insert service done ",serviceIDs); 
	        //});
	        
	    }
	    function findID(servs,contractID){
	        if(!servs){
	        	console.log("service is empty string ");
	            return undefined;
	        }
	        servs=servs.toLowerCase();
            if(servs=='na'||servs=='undefined'){
                console.log("service is empty string ");
                return undefined;
            }
	        var start="";
	        var theone="";
	        // Preprocess servs
	        if(servs.indexOf('帮找当地律师')>=0){
	        	servs='c1';
	        }else if(servs.indexOf('礼包一')>=0){
	        	servs='pack1:b';
	        }else if(servs.indexOf('仅申诉文书修改')>=0){
	        	servs='p2';
	        }
	        if(servs.indexOf('.')<0){
	        	if(servs.length>2){
	        		start=servs.substring(0,2);
	        		theone=_.find(SERVICETYPE,function(ele){
		            var eachone=ele['serviceType'].toLowerCase();
		            if(eachone.indexOf(start)>=0){
		                return true;
		            }
		        	});
                    if(!theone){
                        console.log("first two digit does not match service, try first digit",servs);
                        start=servs.substring(0,1);
                        theone=_.find(SERVICETYPE,function(ele){
                            var eachone=ele['serviceType'].toLowerCase();
                            if(eachone.indexOf(start)>=0){
                                return true;
                            }
                        });
                    }
	        	}else if (servs.length>0){
	        		start=servs.trim();
	        		theone=_.find(SERVICETYPE,function(ele){
			            var eachone=ele['serviceType'].toLowerCase();
			            if(eachone.indexOf(start)>=0){
			                return true;
			            }
		        	});
	        		
	        	}else{
	        		console.log("service is empty ");
	        		return undefined;	
	        	}	        	
	        }else{
	        	start=servs.substring(0,servs.indexOf('.')).trim();
	        	theone=_.find(SERVICETYPE,function(ele){
		            var eachone=ele['serviceType'].toLowerCase();
		            if(eachone.indexOf(start)>=0){
		                return true;
		            }
	        	});
	        }
	        
	        // var start=servs.substring(0,1);
         //    var valid=false;
         //    switch(servs.substring(0,1)){
         //    	case 'd':
         //    	if(servs.indexOf('cc')>-1) start="d1";
         //    	else if(servs.indexOf('u')>-1) start="d3";
         //    	else if(servs.indexOf('高')>-1) start='d2';
         //    	else console.log("error servicetype",servs);
         //    	break;
         //    	case 'i':
         //    	if(servs.indexOf('cc')>-1) start="i1";
         //    	else if(servs.indexOf('u')>-1) start="i3";
         //    	else if(servs.indexOf('高')>-1) start='i2';
         //    	else if(servs.indexOf('国会')>-1) start='i4';
         //    	else console.log("error servicetype",servs);
         //    	break;
         //    	case 'f':
         //    	if(servs.indexOf('vip')>-1) start="f2";
         //    	else start="f1";
         //    	break;
         //    	case 'h':
         //    	if(servs.indexOf('学术')>-1) start="h1";
         //    	else if(servs.indexOf('早起')>-1) start="h2";
         //    	else if(servs.indexOf('单科')>-1) start="h3";
         //    	else if(servs.indexOf('托福')>-1) start="h4";
         //    	else if(servs.indexOf('1')>-1) start="h5";
         //    	else if(servs.indexOf('2')>-1) start="h6";
         //    	else if(servs.indexOf('选课')>-1) start="h7";
         //    	else console.log("error servicetype",servs);
         //    	break;
         //    }
	        
	        if(theone){
	        	return theone.id;
	        }else{
	        	console.log("service not found ",servs);
                unknownItems.push(servs);
	        	return undefined;
	        }
	    }
    },
    importService:function(filename){
    	var errorLine=[];

        var unknownNames=[];
    	function preProcess(lines){
    		var toReturn={};
    		var currentClient="";
    		for(var i=0;i<lines.length;i++){
    			var line=lines[i];
    			line=_.map(line,function (element) {
                    element = element.replace(/\"/g, '');
                    element = element.replace(/\'/g, '');
                    element=element.replace(new RegExp(String.fromCharCode(65292),'g'),",");
                    element=element.replace(new RegExp(String.fromCharCode(65295),'g'),"/");
                    element=element.replace(new RegExp(String.fromCharCode(65291),'g'),"+");
                    //if(element.indexOf('紧急二次购买')>-1) console.log(element);
                    return element;
            	});
    			var service={};
		    	var client={};
		    	var contract={};
		    	var application={};
		    	service['serviceProgress']=line[0];
		    	contract.teacher=line[1];
		    	client.name=line[2]||"";
		    	if(client.name.length<1){
		    		errorLine.push(line);
		    	}
		    	client.firstName=line[3]||"";
		    	client.lastName=line[4]||"";
		    	contract.contractSigned=null;
		    	if(line[5]){
		        	contract.contractSigned=new Date(line[5].split('\n')[0]);
		        }
		        service.serviceType=(line[6]||"").trim();
		        contract.gpa=line[7];
		        contract.toefl=line[8];
		        contract.sat=line[9];
		        contract.gre=line[10];
		        contract.gmat=line[11];
		        contract.previousSchool=line[12];
		        contract.major=line[13];
		        application.collageName=line[14];
		        application.appliedMajor=line[15];
		        application.appliedSemester=line[16];
		        var level=line[17];
		        var writer=line[18];
		        application.succeed=line[19]=='Y'?true:null;
		        application.studentCondition=line[20];
		        client.chineseName=(line[21]||"").trim().toLowerCase();
		        service.link=line[23];
		        var key=client.name+client.firstName+client.lastName+client.chineseName+line[5];
		        toReturn[key]=toReturn[key]||{};
		        toReturn[key]['client']=client;
		        toReturn[key]['contract']=contract;
		        toReturn[key]['service']=toReturn[key]['service']||{};
		        if(!toReturn[key]['service'][service.serviceType]){
		        	toReturn[key]['service'][service.serviceType]=service;
		        }
		        if(application.collageName){
		        	toReturn[key]['service'][service.serviceType]['application']=toReturn[key]['service'][service.serviceType]['application']||[];
		        	toReturn[key]['service'][service.serviceType]['application'].push(application);
		        }
    		}
    		return toReturn;
    	}

    	function string2IDs(serv){
    		var prog=serv.serviceProgress;
    		serv.serviceType=serv.serviceType||"";
    		switch(serv.serviceType){
    			case 'd3':serv.serviceType='d2';break;
    			case 'd2':serv.serviceType='d0';break;
    			case 'd1':serv.serviceType='d';break;
    			case 'f2':serv.serviceType='f';break;
    			case 'c2':serv.serviceType='c';break;
    			case 'h1':serv.serviceType='h';break;
    			case 'i3':serv.serviceType='i';break;
    			default:break;
    		}
    		serv.serviceType=SERVICETYPE[serv.serviceType];
    		if(serv.serviceProgress=='X放弃/退款X'){
    			serv.serviceProgress='X自我放弃X';
    		}
    		serv.serviceProgress=_.find(SERVICEPROGRESS,function(e){
    			var t=serv.serviceProgress;

    			if(e.serviceProgress.indexOf(t)>=0){
    				return e.id;
    			}
    		})
			if(!serv.serviceProgress){
				console.log(serv,prog);
			}
    		return serv;
    	}
    	var SERVICETYPE={};
    	var SERVICEPROGRESS={};
    	function serviceTypehash(){
    		return ServiceType.find().then(function(data){
    			var toReturn={};
    			data.forEach(function(e){
    				toReturn[e.alias]=e.id;
    			});
    			SERVICETYPE=toReturn;
    			return Promise.resolve({});
    		})
    	}
    	function progressHash(){
    		return ServiceProgress.find().then(function(data){
				SERVICEPROGRESS=data;
    		})
    	}
	    var toReturn=Promise.defer();
	    fs.readFile(filename,'utf8',function(err,data){
	        if(err) throw err;
	        parse(data,{comment:'#',relax:true},function(err,output){
				if(err) throw err;
	        	var allData=preProcess(output);
	        	//console.log(allData);
	        	var allPromises=[]
	        	Promise.all([serviceTypehash(),progressHash()]).then(function(){
	        		_.each(allData,function(eachContract){
	        		var promise;
	        		//console.log(eachContract);
	        		if(eachContract.client.chineseName.length<1){
	        			promise=Client.find({firstName:eachContract.client.firstName,lastName:eachContract.client.lastName});
	        		}else{
	        			promise=Client.find({firstName:eachContract.client.firstName,lastName:eachContract.client.lastName});
	        		}
	        		var eachPromise=promise.then(function(data){
		        			if(data.length>0){
		        				var clientId=_.pluck(data,'id');
		        				return Contract.find({client:clientId,contractSigned:eachContract.contract.contractSigned});
		        			}else{
		        				return Promise.resolve([{id:0}]);
		        			}
	        			}).then(function(cont){
	        				var contractid=0;
	        				if(cont.length>0){
	        					var contid=_.pluck(cont,'id');
	        					contractid=contid[0]
	        				}
	        				var sPs=[]
        					_.each(eachContract.service,function(e){
        						var serv=string2IDs(e);
        						var app=serv.application;
        						serv.contract=contractid;
        						serv.generated=true;
        						serv.chineseName=eachContract.client.chineseName;
        						serv.lastName=eachContract.client.lastName;
        						serv.firstName=eachContract.client.firstName;
        						delete serv['application'];
								var sp=Service.create(serv).then(function(data){
									var servId=data.id;
									var ps=[]
									if(app){
										app.forEach(function(a){
											a.service=servId;
											p.push(Application.create(a));
										})
										return Promise.all(ps);
									}else{
										return Promise.resolve("create service done");
									}
								});
								sPs.push(sp);
        					})	
        					return Promise.all(sPs);
	        			}).error(function(err){
	        				console.log(err);
	        			});	        		
	        		allPromises.push(eachPromise);
	        	})
	        	Promise.all(allPromises).then(function(data){
	        		console.log(data);
	        		var fsstream=fs.createWriteStream("service_error.csv");
				 	csv.write(errorLine,{header:false}).pipe(fsstream);
	        	}).error(function(err){
	        		console.log(err);
	        	});
	        	})
	        	

    //             var firstline = false;
    //             var linepromises = [];
    //             var i=0;
    //             var allPromises=[];
    //             allPromises=_.map(output,function(line){
    //             	line=_.map(line,function (element) {
    //                     element = element.replace(/\"/g, '');
    //                     element = element.replace(/\'/g, '');
    //                     element=element.replace(new RegExp(String.fromCharCode(65292),'g'),",");
    //                     element=element.replace(new RegExp(String.fromCharCode(65295),'g'),"/");
    //                     element=element.replace(new RegExp(String.fromCharCode(65291),'g'),"+");
    //                     //if(element.indexOf('紧急二次购买')>-1) console.log(element);
    //                     return element;
    //                 });
    //                 if(firstline){
    //                 	firstline=false;
    //                 	return Promise.resolve("empty");
    //                 }else{
    //                 	return oneline(line);
    //                 }
    //             });
				// Promise.all(allPromises).then(function(data){
	   //           	data=_.filter(data,{succeed:false});
	   //           	console.log(_.unique(_.pluck(data,'name')));
	   //           	var fsstream=fs.createWriteStream("service_error.csv");
	             	
				// 	csv.write(errorLine,{header:false}).pipe(fsstream);
				// 	toReturn.resolve("done");
    //             }).error(function(err){
	   //           	console.log('finished with errors',err);
	   //           	toReturn.reject("finished with errors");
	   //          });
	        });
	    });
	    return toReturn.promise;
	    function oneline(line){
	    	var service={};
	    	var client={};
	    	var contract={};
	    	var application={};
	    	service['serviceProgress']=line[0];
	    	contract.teacher=line[1];
	    	client.name=line[2];
	    	client.firstName=(line[3]||"");
	    	client.lastName=(line[4]||"");
	    	contract.contractSigned=null;
	    	if(line[5]){
	        	contract.contractSigned=new Date(line[5].split('\n')[0]);
	        	if(isNaN(contract.contractSigned.getTime())){
	        		return Promise.resolve("invalid datetime"+line[5]);
	        	}
	        }
	        service.serviceType=(line[6]||"").substring(0,1);
	        contract.gpa=line[7];
	        contract.toefl=line[8];
	        contract.sat=line[9];
	        contract.gre=line[10];
	        contract.gmat=line[11];
	        contract.previousSchool=line[12];
	        contract.major=line[13];
	        application.collageName=line[14];
	        application.appliedMajor=line[15];
	        application.appliedSemester=line[16];
	        var level=line[17];
	        var writer=line[18];
	        application.succeed=line[19];
	        application.studentCondition=line[20];
	        client.chineseName=(line[21]||"").trim().toLowerCase();
	        service.link=line[23];
	        var result={};
	        var contractid;
	        var clientId,sTypeid,contId,p;
	        if(client.chineseName.length>0&&client.chineseName!='y'&&client.chineseName!='n'&&client.chineseName!='n/a'){
	        	p=Client.find({chineseName:{contains:client.chineseName}});
	        }else{
	        	if(client.firstName.length>0&&client.lastName.length>0){
	        		p=Client.find({firstName:client.firstName,lastName:client.lastName});	
	        	}else{
	        		errorLine.push(line);
	        		unknownNames.push(client);
	        		return Promise.resolve({succeed:false,name:"no name"});
	        	}
	        	
	        }
	        return Promise.all([p,ServiceType.find({alias:{contains:service.serviceType}})]).spread(function(data_client,data_serviceType){
	        	if(data_client.length>0){
	        		clientId=_.pluck(data_client,'id');
	        	}
	        	if(data_serviceType.length>0){
	        		sTypeid=_.pluck(data_serviceType,'id');
	        	}
	        	if(!clientId){
	        		unknownNames.push(client);
	        		return Promise.reject(client.chineseName+" "+client.firstName+","+client.lastName+" "+service.serviceType+" are  not found");
	        	}
	        	console.log("look for contract"+clientId);
	        	return Contract.find({client:clientId});
	        }).then(function(Conts){
	        	if(Conts.length<1){
	        		return Promise.reject("Contract not found for client "+clientId);
	        	}
	        	contId=_.pluck(Conts,'id');
	        	console.log("found contract");
	        	return Service.find({contract:contId});
	        }).then(function(servs){
	        	if(servs.length<1){
	        		return Promise.resolve({succeed:true,length:0,data:client.chineseName+" "+contId.length+" contracts but no service found"});	
	        	}
	        	return Promise.resolve({succeed:true,length:servs.length});
	        }).catch(function(err){
	        	//console.log('finished line');
	        	console.log(err);
	        	errorLine.push(line);
	        	return Promise.resolve({succeed:false,name:client.chineseName});
	        })
	        // return Client.find({chineseName:client.chineseName}).then(function(data){
	        // 	if(data.length>0){
	        // 		result.client="found"+data.length;
	        // 		return Contract.find({client:_.pluck(data,"id"),contractSigned:service.contractSigned});
	        // 	}else{
	        // 		result.client="not found"+client.chineseName;
	        // 		return Promise.reject("client not found");
	        // 	}
	        // }).then(function(data){
	        // 	if(data.length>0){
	        // 		result.contract=data.length;
	        // 		contractid=data[0].id;
	        // 		return ServiceType.find({alias:{contains:service.serviceType}});
	        // 	}else{
	        // 		result.contract="not found";
	        // 		return Promise.reject("contract not found");
	        // 	}
	        // }).then(function(data){
	        // 	if(data.length>0){
	        // 		result.serviceType="found";
	        // 		var ids=_.pluck(data,"id");
	        // 		//console.log(ids);
	        // 		return Service.findOne({contract:contractid,serviceType:ids});
	        // 	}else{
	        // 		result.serviceType="not found";
	        // 		return Promise.reject("serviceType not found");
	        // 	}
	        // }).then(function(data){
	        // 	data=data||{};
	        // 	if(data.id){
	        // 		result.service="found";
	        // 		return Promise.resolve(result);
	        // 	}else{
	        // 		result.service="not found";
	        // 		return Promise.reject("service not found");
	        // 	}
	        // }).catch(function(err){
	        // 	console.log("line finished");
	        // 	return Promise.resolve([err,result]);
	        // });
	    }
    },
    'importUser':function(){
    	var filename='user.csv';
    	var roleProm=Role.find();
    	var toReturn=Promise.defer();
    	fs.readFile(filename,'utf8',function(err,data){ 
	        if(err) throw err;
	        parse(data,{comment:'#'},function(err2,output){
	        	if (err2) throw err2;
                var firstline = true;
                var linepromises = [];
                var i=0;
                roleProm.then(function(role){
                	var roleHash=makeHash(role,'role');
                	var allPromises=[];
                	output.forEach(function (line) {
	                    line.forEach(function (element) {
	                        element = element.replace(/\"/g, '');
	                        element = element.replace(/\'/g, '');
	                    });
	                    if (firstline) {
	                        firstline = false;
	                    } else {
	                        console.log("start line ",i);
	                        var curP = createUser(line,i,roleHash).then(function(data){
	                            console.log("finish line ",data);
	                        }).fail(function(err){
	                            console.log("error occurred during creation",err);
	                        });
	                        allPromises.push(curP);
	                        i++;
	                    }
                	});
                	return Promise.all(allPromises);
                }).then(function(data){
	                	toReturn.resolve("done");
                }).fail(function(err){
	            	console.log('error occurred in the array',err);
	            	toReturn.reject({error:"finished with errors",err:err});
	            });                	            
	        });
	    });
		return toReturn.promise;
	    function createUser(line, lineNumber,roleHash){
	    	var input={
		    	firstname:line[2],
		    	lastname:line[3],
		    	nickname:line[1].toLowerCase(),
		    	password:"123456",
		    	role:parseInt(line[10]?roleHash[line[10]]:roleHash['销售']),
		    	//boss:line[8],
		    	rank:line[9],
		    	email:line[5],
		    	phone:line[4],
		    	wechat:line[8],
		    	skype:line[7],
		    	personalemail:line[6]
	    	};
	    	input.email=stripstring(input.email).split(/[,\/\s\n]/)[0];
	    	input.personalemail=stripstring(input.personalemail).split(/[,\/\s\n]/)[0];
	    	if(!input.email){
	    		input.email=input.personalemail;
	    	}
	    	if(!input.personalemail){
	    		input.personalemail=input.email;
	    	}
	    	//if(!input.email) throw {error:err,line:lineNumber};
	    	return User.findOne({or:[{personalemail:input.email},{email:input.email}]}).then(function(data){
	    		if(data){
	    			input.id=data.id;
	    			//console.log('updating user',input);
	    			//delete input.password;
	    			//return User.update(input);
	    			return Promise.resolve(data);
	    		}else{
	    			console.log('creating user',input);
	    			return User.create(input);
	    		}
	    	}).catch(function(err){
	    		return Promise.reject({error:err,line:lineNumber});
	    	});
	    }
    },
    'nativeQuery':function(query){
    	var promise=Promise.defer();
    	console.log(query);
    	Contract.query(query,function(err,data){
    		if(err) promise.reject(err);
    		promise.resolve(data);
    	});
    	return promise.promise;
    },
    'errorHandler':function(err,res,txt){
    	console.log(txt);
    	console.log(err);
    	return res.json(400,{error:err});
    }
}