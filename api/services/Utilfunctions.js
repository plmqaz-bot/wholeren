
var parse=require('csv-parse');
var fs=require('fs');
var Promise=require('bluebird');
 function makeHash(data,name){
        var hash={};
        data.forEach(function(ele){
            hash[ele[name]]=ele['id'];
        });
        return hash;
	};
	function stripstring(str){
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
    makeHash:function(data,name){
    	makeHash(data,name);
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
	    fs.readFile(filename,'utf8',function(err,data){
	        if(err) throw err;
	        parse(data,{comment:'#'},function(err,output){
	            options.then(function(data){
	                    var firstline = true;
	                var linepromises = [];
	                var i=0;
	                var allPromises=[];
	                output.forEach(function (line) {
	                    line.forEach(function (element) {
	                        element = element.replace('\"', '');
	                        element = element.replace('\'', '');
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
	                        allPromises.push(curP);
	                        i++;
	                    }
	                });
	                return Promise.all(allPromises);
	            }).then(function(data){
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
	        contract.teacher=(line[43]||"").replace(/\d/g,'').toLowerCase().split(/[\s,\/]+/);; // later get user id
	        
	        exchangeOptions(contract);
	        //var p=Promise.defer();
	        //console.log("look for stuff");
	        return getClient(client).then(function(cid){
	            contract.client=cid.id;
	            console.log("client id is ",contract.client);
	            return getUser(contract.assistant);
	        }).then(function(assis){
	            if(!assis&&contract.assistant[0].length>0) throw {reason:"unknown assistant",assistant:contract.assistant,line:linenum};
	            contract.assistant=assis;
	            return getUser(contract.sales);
	        }).then(function(sale){
	        	if(!sale) throw {reason:"unknown sales",sales:contract.sales,line:linenum,O:contract.sales};
	            contract.sales=sale;
	            return getUser(contract.expert);
	        }).then(function(exp){
	            if(!exp&&contract.expert[0].length>0) throw {reason:"unknown expert",expert:contract.expert,line:linenum};
	            contract.expert=exp;
	            return getUser(contract.teacher);
	        }).then(function(tea){
	            if(!tea&&contract.teacher[0].length>0) throw {reason:"unknown teacher",teacher:contract.teacher,line:linenum};
	            contract.teacher=tea;
	            // add this contract
	            console.log("look for contract",contract.client,contract.contractCategory);
	            return Contract.findOne({client:contract.client,contractCategory:contract.contractCategory});
	        }).then(function(cont){
	          if(cont){
	                // if found, use it
	                console.log("found contract",cont.id);
	                 return Promise.resolve(cont);
	            }else{
	                var stringcontract=JSON.stringify(contract);
	                contract=JSON.parse(stringcontract);
	                console.log("creating contract",contract);
	                return Contract.create(contract);      
	            }
	        }).then(function(data){
	            var contractID=data.id;
	            return getService(Service,contractID);     
	               // p.resolve("current");
	        }).then(function(data){
	            return Promise.resolve(linenum);
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
	        return Client.findOne({chineseName:getC.chineseName}).then(function(data){
	            if(data){
	                //console.log("found client",data);
	                return Promise.resolve(data);
	            }else{
	                var c=JSON.stringify(getC);
	                c=JSON.parse(c);
	                console.log("creating client",c);
	                return Client.create(c);
	            }
	        });
	    };
	    function getUser(user,defaultUser){
	    	user=user[0];
	        if (user.length<1) {
	        	if(defaultUser)
	        		user="ting";
	        	else
	        		return Promise.resolve(null);
	        }
	        return User.findOne({ or:[{nickname: user},{firstname: user},{lastname: user}] }).then(function (data){
                if (data) {
                    return Promise.resolve(data.id);
                } else { 
                    return User.findOne({ or:[{nickname: 'ting'},{firstname: 'ting'},{lastname: 'ting'}] }).then(function(data){
                    	if(data)
                    		return Promise.resolve(data.id);
                    	else
                    		return Promise.resolve(null);
                    });
                }
	        });
	    }
	    function getService(service,contID){
	        service=service.replace("，",",");
	        var servs=service.split(",");
	        var p= Promise.defer();
	        var insertPs=[];
	        var serviceIDs=[];
	        //console.log(servs);
	        _.forEach(servs,function(ele){
	            if(!ele) return;
	            var id=findID(ele);
	           if(id){
	                var curPromise=Service.findOne({contract:contID,serviceType:id}).then(function(data){
	                    if(data){
	                        serviceIDs.push(data.id);
	                        return Promise.resolve(data);
	                    }else{
	                        //console.log("create service");
	                        return Service.create({contract:contID,serviceType:id}).then(function(s){
	                            serviceIDs.push(s.id);
	                        });
	                    }
	                });
	                insertPs.push(curPromise);
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
	        var id;
	        var keyword=servs.substring(0,2);
	        //console.log("keyword is ",keyword);
	        
	        SERVICETYPE.forEach(function(ele){
	            var eachone=ele['serviceType'];

	            if(eachone.indexOf(keyword)>=0){
	               // console.log("found servicetype ",ele.id);
	                id=ele.id;
	            }
	        });

	        return id;
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
	                        element = element.replace('\"', '');
	                        element = element.replace('\'', '');
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
		    	firstname:line[3],
		    	lastname:line[2],
		    	nickname:line[1].toLowerCase(),
		    	password:"123456",
		    	role:parseInt(line[10]?roleHash[line[10]]:roleHash['销售']),
		    	//boss:line[8],
		    	rank:line[9],
		    	email:stripstring(line[5]),
		    	phone:line[4],
		    	skype:line[7],
		    	personalemail:stripstring(line[6])
	    	};
	    	if(!input.email){
	    		input.email=input.personalemail;
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
	    	}).fail(function(err){
	    		return Promise.reject({error:err,line:lineNumber});
	    	});
	    }
    },
    'nativeQuery':function(query){
    	var promise=Promise.defer();
    	Contract.query(query,function(err,data){
    		if(err) promise.reject(err);
    		promise.resolve(data);
    	});
    	return promise.promise;
    },
}