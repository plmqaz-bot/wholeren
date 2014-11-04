

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
        showError:function(text){
            Wholeren.notifications.clearEverything();
            Wholeren.notifications.addItem({
                type: 'error',
                message: text,
                status: 'passive'
            });
        }


}