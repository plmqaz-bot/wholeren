
var parse=require('csv-parse');
var fs=require('fs');
var Promise=require('bluebird');
var _=require('lodash');
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
    		if(attribs[e]!=null) toReturn[e]=attribs[e];
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
		var LEAD={},STATUS={},LEADLEVEL={},COUNTRY={},DEGREE={},PAYMENT={},CATEGORY={},SERVICETYPE={};
		var options=Lead.find().then(function(data){
			LEAD=makeHash(data,'lead');
			return LeadLevel.find();
	    }).then(function(data){
	        LEADLEVEL=makeHash(data,'leadLevel');
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
	        return Promise.resolve(data);
	    });
	    var errorLine=[];
	    var toReturn=Promise.defer();
	    var problem_user=[];
	    fs.readFile(filename,'utf8',function(err,data){
	        if(err) throw err;
	        parse(data,{comment:'#'},function(err,output){
	            options.then(function(data){
	                    var firstline = false;
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
	                            console.log("finish line ",data);
	                        }).fail(function(err){
	                            console.log(err);
	                            errorLine.push(err);
	                        });
	                        allPromises.push(Promise.resolve(curP));
	                        i++;
	                    }
	                });
					console.log("done loop");
	                return Promise.all(allPromises);
	            })
				 .then(function(data){
	             	problem_user=_.uniq(problem_user);
	             	console.log(problem_user,"unknown user names");
	                 	toReturn.resolve("done");
                 }).fail(function(err){
	             	console.log('finished with errors',err);
	             	toReturn.reject("finished with errors");
	             });
	        });
	    });
	     return toReturn.promise;
	    function oneline(line,linenum){
	        var contract={};
	        var client={};
	        var serviceTeachers=[];
	        client.chineseName=line[1];
	        contract.contractCategory=stripstring(line[2]); // later get contractcategoryid;
	        contract.createdAt=new Date(line[3]);
	        contract.lead=stripstring(line[4]); // Later get the id;
	        contract.leadName=line[5];
	        contract.assistant=(line[6]||"").replace(/\d/g,'').toLowerCase().split(/[\s,\/]+/); //Later get user id;
	        contract.sales=(line[7]||"").replace(/\d/g,'').toLowerCase().split(/[\s,\/]+/); //later get user id;
	        contract.expert=(line[8]||"").replace(/\d/g,'').toLowerCase().split(/[\s,\/]+/); // later get user id;
	        contract.status=stripstring(line[9]); // later get id of status;
	        contract.salesFollowup=line[10];
	        contract.salesRecord=line[11];
	        contract.leadLevel=stripstring(line[12]); // later get leadlevel id;
	        contract.expertContactdate=new Date(line[13]);
	        //contract.expertFollowup=line[14];

	        contract.expertFollowup=line[14]?line[14]:line[15];
	        client.lastName=line[16];
	        client.firstName=line[17];
	        contract.originalText=line[18];
	        client.primaryEmail=stripstring(line[19]);
	        client.primaryPhone=line[20];
	        //console.log("before getting country",linenum);
	        contract.country=stripstring(line[22]); // later get country id;
	        //console.log("after getting country",linenum);
	        contract.validI20=line[23]=='是'?true:false;
	        contract.previousSchool=line[24];

	        contract.targetSchool=line[25];
	        var temp=parseFloat(line[26]);
	        contract.gpa=temp?temp:0.0;
	        temp=parseFloat(line[27]);

	        contract.toefl=temp?temp:0.0;
	        contract.otherScore=line[28];
	        contract.age=line[29];
	        contract.degree=stripstring(line[30]); // later get degree id
	        contract.diagnose=line[31];
	        contract.contractSigned=new Date(line[32]);
	        contract.contractPaid=new Date(line[33]);
	        var Service=line[34]+","+line[35]+","+line[36]+","+line[37]; // Work on service
	        temp=parseFloat(line[38]);
	        contract.contractPrice=temp?temp:0.0;
	        contract.contractDetail=line[39];
	        contract.endFee=line[40];
	        contract.paymentOption=stripstring(line[41]); // later get payment id
	        contract.endFeeDue=line[42]=='是'?true:false;
	        contract.teacher=(line[43]||"").replace(/\d/g,'').toLowerCase().split(/[\s,\/]+/); // later get user id
	        
	        exchangeOptions(contract);
	        //var p=Promise.defer();
	        //console.log("look for stuff");
	        return getClient(client).then(function(cid){
	            contract.client=cid.id;
	            console.log("client id is ",contract.client);
	            var leadnames=(contract.leadName||"").replace("transfer","").replace(/\d\"/g,'').toLowerCase().split(/[\s,\/+]+/);
	            return getUser(leadnames);
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
	            if(tea.length>1)console.log("weird tea",tea);
	            // add this contract
	            console.log("look for contract",contract.client,contract.contractCategory);
	            return Contract.findOne({client:contract.client,contractCategory:contract.contractCategory});
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
	            var contractID=data.id;
	            console.log("creating service for contract ",contractID);
	            return getService(Service,contractID,serviceTeachers);     
	               // p.resolve("current");
	        }).then(function(data){
	            return Promise.resolve(linenum);
	        }).fail(function(err){
	        	console.log(err);
	        	console.log("error in line ",linenum);
	        	return Promise.reject(err);
	        });
	    };
	    function exchangeOptions(contract){
	        //get the id of category
	        //var categoryid=contract.contractCategory?(_.find(CATEGORY,{'contractCategory':contract.contractCategory})).id:0;
	       // console.log(CATEGORY);
	        var categoryid=CATEGORY[contract.contractCategory];
	        //console.log(contract.contractCategory," got id ",categoryid);
	        //var leadid=contract.lead?(_.find(LEAD,{'lead':contract.lead})).id:0;
	        //console.log(LEAD);
	        var leadid=LEAD[contract.lead];
	        //console.log(contract.lead," got id ",leadid);
	        //var statusid=contract.status?(_.find(STATUS,{'status':contract.status})).id:0;
	        //console.log(STATUS);
	        var statusid=STATUS[contract.status];
	        //if(!statusid&&contract.status) console.log(contract.status," got id ",statusid);
	        //var leadLevelid=contract.leadLevel?(_.find(LEADLEVEL,{'leadLevel':contract.leadLevel})).id:0;
	        var leadLevelid=LEADLEVEL[contract.leadLevel];
	        //console.log(contract.leadLevel," got id ",leadLevelid);
	        //var countryid=contract.country?(_.find(COUNTRY,{'country':contract.country})).id:0;
	        var countryid=COUNTRY[contract.country];
	         //console.log(contract.country," got id ",countryid);
	        //var degreeid=contract.degree?(_.find(DEGREE,{'degree':contract.degree})).id:0;
	        //console.log(DEGREE);
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
	    function getUser(users,defaultUser){
			users=_.reject(users,function(e){return e==''})
	        var allprom=_.map(users,function(user){
				if (user.length<1) {
					console.log(users,"weird users");
		        	if(defaultUser)
		        		user="ting";
		        	else
		        		return Promise.resolve(null);
	        	}
	        	user=user.trim();
	        	user=user.replace(/\"/g,'');
	        	return User.findOne({ or:[{nickname: {'contains':user}},{firstname: {'contains':user}},{lastname: {'contains':user}}] }).then(function (data){
	                if (data) {
	                    return Promise.resolve(data.id);
	                } else { 
	                	if(user!='na') problem_user.push(user);
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
	            var id=findID(ele);
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
	             	console.log("unknown service type ",ele);
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
	    function findID(servs){
	        if(!servs){
	            return undefined;
	        }
	        servs=servs.toLowerCase();
	        var start=servs.substring(0,1);
	            var valid=false;
	            switch(servs.substring(0,1)){
	            	case 'd':
	            	if(servs.indexOf('cc')>-1) start="d1";
	            	else if(servs.indexOf('u')>-1) start="d3";
	            	else if(servs.indexOf('高')>-1) start='d2';
	            	else console.log("error servicetype",servs);
	            	break;
	            	case 'i':
	            	if(servs.indexOf('cc')>-1) start="i1";
	            	else if(servs.indexOf('u')>-1) start="i3";
	            	else if(servs.indexOf('高')>-1) start='i2';
	            	else if(servs.indexOf('国会')>-1) start='i4';
	            	else console.log("error servicetype",servs);
	            	break;
	            	case 'f':
	            	if(servs.indexOf('vip')>-1) start="f2";
	            	else start="f1";
	            	break;
	            	case 'h':
	            	if(servs.indexOf('学术')>-1) start="h1";
	            	else if(servs.indexOf('早起')>-1) start="h2";
	            	else if(servs.indexOf('单科')>-1) start="h3";
	            	else if(servs.indexOf('托福')>-1) start="h4";
	            	else if(servs.indexOf('1')>-1) start="h5";
	            	else if(servs.indexOf('2')>-1) start="h6";
	            	else if(servs.indexOf('选课')>-1) start="h7";
	            	else console.log("error servicetype",servs);
	            	break;
	            }
	        var theone=_.find(SERVICETYPE,function(ele){
	            var eachone=ele['serviceType'].toLowerCase();
	            if(eachone.indexOf(start)>=0){
	                return true;
	            }
	        });
	        if(theone){
	        	return theone.id;
	        }else{
	        	console.log("service not found ",servs);
	        	return undefined;
	        }
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
    	console.log(err.toJSON());
    	return res.json(400,err.toJSON());
    }
}