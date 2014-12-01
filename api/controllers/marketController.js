

  module.exports = {
  	'general':function(req,res){
  		var where=req.param('where')||null;
  		var sql="SELECT lead.lead, sum(IF(contractCategory=8,1,0)) as '紧急咨询量', sum(IF(contractCategory=8 AND status=6,1,0)) as '紧急签约量', sum(IF(contractCategory=8 AND status=6,contractPrice,0)) as '紧急签约额',sum(IF(contractCategory=8 AND status=6,1,0))/sum(IF(contractCategory=8,1,0)) as '紧急签约率',sum(IF(contractCategory in (7,9,10,11),1,0)) as '转学咨询量', sum(IF(contractCategory in (7,9,10,11) AND status=6,1,0)) as '转学签约量',sum(IF(contractCategory in (7,9,10,11) AND status=6,contractPrice,0)) as '转学签约额',sum(IF(contractCategory in (7,9,10,11) AND status=6,1,0))/sum(IF(contractCategory=8,1,0)) as '转学签约率' FROM test.contract left join lead on contract.lead=lead.id group by lead;";		
  		where=JSON.parse(where);
		Contract.query(sql,function(err,data){
			if(err) return res.json(404,err);
			return res.json(data);
		});
  	}
  }