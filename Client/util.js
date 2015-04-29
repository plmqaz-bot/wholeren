
var Promise=require('bluebird');
var $=require('./jquery');
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
        var csvContent = "data:text/csv;charset=utf-8,";
        if(!colnames){
            csvContent += keys.join(',')+'\n';
        }else{
            csvContent += keys.map(function(e){
                var header=_.find(colnames,function(f){
                    return f.name==e;
                });
                if((header||{}).label){
                    return header.label;
                }else{
                    return e;
                }
            }).join(',')+'\n';
        }
        csvContent += collection.map(function(item) { 
            var cols = []
            _.each(keys, function(key) { cols.push(item.get(key)) }); 
            return cols.join(',') ;
        }).join('\n');

        var encodedUri = encodeURI(csvContent);
        var link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", downloadName+".csv");
        link.click();
    }
 

}