

module.exports = {
	makePopulateHash:function(data){
			hash={};
			data.forEach(function(ele){
            hash[ele['id']]=ele;
        	});	
		
        
        return hash;
    }
}