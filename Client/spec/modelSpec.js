describe('test1',function(){
	var Elements=require('../models');
	var models=Elements.Models;
	var collections=Elements.Collections;
	it('Simple models ',function(){
		var m=new models.simpleModel();
		expect(m).not.toBe(null);
	});
	
});