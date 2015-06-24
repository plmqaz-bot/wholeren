
var Promise=require('bluebird');
var $=require('./jquery');
var _=require('underscore');
var saveAs=require('./FileSaver');
module.exports={


	 getRequestErrorMessage: function (request) {
            var message,
                msgDetail;

            // Can't really continue without a request
            if (!request) {
                return null;
            }

            // Seems like a sensible default
            message = request.statusText;

            // If a non 200 response
            if (request.status !== 200) {
                try {
                    // Try to parse out the error, or default to "Unknown"
                    message =  request.responseJSON.error || request.responseText||"Unknown Error";
                } catch (e) {
                    msgDetail = request.status ? request.status + " - " + request.statusText : "Server was not available";
                    message = "The server returned an error (" + msgDetail + ").";
                }
            }

            return message;
    },
    handleRequestError:function(response){
        console.log(response);
        Wholeren.notifications.clearEverything();
        var errors=response.responseJSON||{};
        var errortext=response.responseText||"";
        var redirect=response.redirect;
        var delay=response.delay||5;
        if(errors.invalidAttributes){
            for(var key in errors.invalidAttributes){
                if(errors.invalidAttributes.hasOwnProperty(key)){
                    var a=errors.invalidAttributes[key];
                    a.forEach(function(item){
                        Wholeren.notifications.addItem({
                        type: 'error',
                        message: JSON.stringify(item),
                        status: 'passive'
                        });
                    });
                }
            }                     
        }else{
            Wholeren.notifications.addItem({
                type: 'error',
                message: errortext,
                status: 'passive'
            });
        }

        if(redirect){
            Wholeren.notifications.addItem({
                type: 'error',
                message: 'redirecting',
                status: 'passive'
            });
            setTimeout(function(){
                //Wholeren.router.navigate(redirect,{trigger:true});  
                window.location.href = redirect;
            },delay*1000);
        }
    },
    handleRequestSuccess:function(response){
        Wholeren.notifications.clearEverything();
        var text=response.responseText||"";
        var redirect=response.redirect;
        var delay=response.delay||5;
         Wholeren.notifications.addItem({
                        type: 'success',
                        message: text,
                        status: 'passive'
                        });
        if(redirect){
            setTimeout(function(){
                //Wholeren.router.navigate(redirect,{trigger:true});  
                window.location.href = redirect;
            },delay*1000);
        }
    },
    showError:function(text){
        Wholeren.notifications.clearEverything();
        Wholeren.notifications.addItem({
            type: 'error',
            message: text,
            status: 'passive'
        });
    },
    ajaxGET:function(url){
        var defer=Promise.defer();
        $.ajax({
            url: url,
            type: 'GET',
            headers: {
                'X-CSRF-Token': $("meta[name='csrf-param']").attr('content')
            },
            success: function (data) { 
                defer.resolve(data);                        
            },
            error: function (xhr) {
                defer.reject(xhr);
            }
        });
        return defer.promise;
    },
    ajaxSyncGET:function(url){
        var defer=Promise.defer();
        $.ajax({
            async:false,
            url: url,
            type: 'GET',
            headers: {
                'X-CSRF-Token': $("meta[name='csrf-param']").attr('content')
            },
            success: function (data) { 
                defer.resolve(data);                        
            },
            error: function (xhr) {
                defer.reject(xhr);
            }
        });
        return defer.promise;
    },
    saveCSV:function(collection,colnames){

        var downloadName = 'CSV data '+(new Date()).toString('yyyy-MM-dd hhmmss');
        var keys = _.chain(collection.first().attributes).keys().sort().value();
        var csvContent = "";
        if(!colnames){
            csvContent += keys.join(',')+'\n';
            csvContent += collection.map(function(item) { 
                var cols = []
                _.each(keys, function(key) { 
                    var i=item.get(key);
                    var topush="";
                    if(key)
                    if(typeof i == "string"){

                    }else if (i!=null&&i!=undefined){
                        topush=i.toString();
                    }                    
                    if(topush.indexOf(/,\n/g)>-1){
                        topush="\""+topush+"\"";
                    }
                    cols.push(topush);
                }); 
                return cols.join(',') ;
            }).join('\n');
        }else{
            csvContent +=_.map(colnames,function(e){
                return e.label;
            }).join(',')+"\n";
            csvContent+=collection.map(function(item){
                var cols=_.map(colnames,function(e){
                    var key=e.name;
                    var i=item.get(key);
                    // If it is a select cell
                    if(e.cell._touse){
                        var selValue=_.find(e.cell._touse,function(f){
                            return f[1]==i;
                        });
                        if((selValue||[]).length>0){
                            i=selValue[0];
                        }
                    }
                    i=i||"";
                    if(typeof i !=='string'){
                        i=i.toString();
                    }
                    if(i.search(/[,\n]/g)>-1){
                        i="\""+i+"\"";
                    }
                    return i;
                }).join(",");
                return cols;
            }).join('\n');
            // csvContent += keys.map(function(e){
            //     var header=_.find(colnames,function(f){
            //         return f.name==e;
            //     });
            //     if((header||{}).label){
            //         return header.label;
            //     }else{
            //         return e;
            //     }
            // }).join(',')+'\n';
        }

        var blob=new Blob([csvContent],{type:'text/plain;charset=utf-8'});
        saveAs.saveAs(blob,'text.csv');

        // var encodedUri = encodeURI(csvContent);
        // var link = document.createElement("a");
        // link.setAttribute("href", encodedUri);
        // link.setAttribute("download", downloadName+".csv");
        // link.click();
    }
 

}