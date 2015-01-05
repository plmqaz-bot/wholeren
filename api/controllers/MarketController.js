

  module.exports = {
  	'general':function(req,res){
      var where=req.param('where')||"{}";
      console.log(where);
      where=JSON.parse(where);
      var wheresql="";
      if(where.createdAt){
        if(where.createdAt['>']){
          wheresql="where contract.createdAt>'"+where.createdAt['>']+"' ";
        }
        if(where.createdAt['<']){
          wheresql+="and contract.createdAt<'"+where.createdAt['<']+"' ";
        }
      }
  		var sql="SELECT lead.lead, sum(IF(contractCategory=8,1,0)) as '紧急咨询量', sum(IF(contractCategory=8 AND status=6,1,0)) as '紧急签约量', sum(IF(contractCategory=8 AND status=6,contractPrice,0)) as '紧急签约额',sum(IF(contractCategory=8 AND status=6,1,0))/sum(IF(contractCategory=8,1,0)) as '紧急签约率',sum(IF(contractCategory in (7,9,10,11),1,0)) as '转学咨询量', sum(IF(contractCategory in (7,9,10,11) AND status in(3,4,5,6),1,0)) as '转学签约量',sum(IF(contractCategory in (7,9,10,11) AND status in(3,4,5,6),contractPrice,0)) as '转学签约额',sum(IF(contractCategory in (7,9,10,11) AND status in(3,4,5,6),1,0))/sum(IF(contractCategory in (7,9,10,11),1,0)) as '转学签约率' FROM test.contract left join lead on contract.lead=lead.id "+wheresql+"group by lead;";
		  console.log(sql);
    Contract.query(sql,function(err,data){
			if(err) return res.json(404,err);
			return res.json(data);
		});
  	},
    'contractOfSaleAndExpert':function(req,res){
      var where=req.param('where')||"{}";
      console.log(where);
      where=JSON.parse(where);
      var wheresql="";
      if(where.createdAt){
        if(where.createdAt['>']){
          wheresql="where contract.createdAt>'"+where.createdAt['>']+"' ";
        }
        if(where.createdAt['<']){
          wheresql+="and contract.createdAt<'"+where.createdAt['<']+"' ";
        }
      }
      var sql="select *, \
t1.紧急销售签约量+t2.紧急专家签约量 as '紧急签约量',\
t1.转学销售签约量+t2.转学专家签约量 as '转学签约量',\
(t1.紧急销售签约量+t2.紧急专家签约量)/(t1.紧急销售咨询量+t2.紧急专家咨询量) as '紧急签约率',\
(t1.转学销售签约量+t2.转学专家签约量)/(t1.转学销售咨询量+t2.转学专家咨询量) as '转学签约率',\
(t1.转学销售签约量+t1.紧急销售签约量)/(t1.转学销售咨询量+t1.紧急销售咨询量) as '销售签约率',\
(t2.转学专家签约量+t2.紧急专家签约量)/(t2.转学专家咨询量+t2.紧急专家咨询量) as '专家签约率',\
t1.紧急销售签约额+t1.转学销售签约额 as '销售签约额',\
t2.紧急专家签约量+t2.转学专家签约量 as '专家签约额'\
from\
(select user.id, user.nickname as 'name',\
sum(IF(contractCategory=8,1,0)) as '紧急销售咨询量',\
sum(IF(contractCategory=8 AND status=6,1,0)) as '紧急销售签约量',\
sum(IF(contractCategory=8 AND status=6,contractPrice,0)) as '紧急销售签约额',\
sum(IF(contractCategory in (7,9,10,11),1,0)) as '转学销售咨询量', \
sum(IF(contractCategory in (7,9,10,11) AND status in(3,4,5,6),1,0)) as '转学销售签约量',\
sum(IF(contractCategory in (7,9,10,11) AND status in(3,4,5,6),contractPrice,0)) as '转学销售签约额'\
 from user left join contract on user.id=contract.sales group by user.id) as t1\
join \
(select user.id, \
sum(IF(contractCategory=8,1,0)) as '紧急专家咨询量',\
sum(IF(contractCategory=8 AND status=6,1,0)) as '紧急专家签约量',\
sum(IF(contractCategory=8 AND status=6,contractPrice,0)) as '紧急专家签约额',\
sum(IF(contractCategory in (7,9,10,11),1,0)) as '转学专家咨询量', \
sum(IF(contractCategory in (7,9,10,11) AND status in(3,4,5,6),1,0)) as '转学专家签约量',\
sum(IF(contractCategory in (7,9,10,11) AND status in(3,4,5,6),contractPrice,0)) as '转学专家签约额'\
 from user left join contract on user.id=contract.expert group by user.id) as t2 \
on t1.id=t2.id;";

sql="select *, t1.紧急销售签约量+t2.紧急专家签约量 as '紧急签约量', t1.转学销售签约量+t2.转学专家签约量 as '转学签约量',(t1.紧急销售签约量+t2.紧急专家签约量)/(t1.紧急销售咨询量+t2.紧急专家咨询量) as '紧急签约率',(t1.转学销售签约量+t2.转学专家签约量)/(t1.转学销售咨询量+t2.转学专家咨询量) as '转学签约率',(t1.转学销售签约量+t1.紧急销售签约量)/(t1.转学销售咨询量+t1.紧急销售咨询量) as '销售签约率',(t2.转学专家签约量+t2.紧急专家签约量)/(t2.转学专家咨询量+t2.紧急专家咨询量) as '专家签约率',t1.紧急销售签约额+t1.转学销售签约额 as '销售签约额',t2.紧急专家签约量+t2.转学专家签约量 as '专家签约额' from (select user.id, user.nickname as 'name',sum(IF(contractCategory=8,1,0)) as '紧急销售咨询量',sum(IF(contractCategory=8 AND status=6,1,0)) as '紧急销售签约量',sum(IF(contractCategory=8 AND status=6,contractPrice,0)) as '紧急销售签约额',sum(IF(contractCategory in (7,9,10,11),1,0)) as '转学销售咨询量', sum(IF(contractCategory in (7,9,10,11) AND status in(3,4,5,6),1,0)) as '转学销售签约量',sum(IF(contractCategory in (7,9,10,11) AND status in(3,4,5,6),contractPrice,0)) as '转学销售签约额' from user left join contract on user.id=contract.sales group by user.id) as t1 join (select user.id, sum(IF(contractCategory=8,1,0)) as '紧急专家咨询量',sum(IF(contractCategory=8 AND status=6,1,0)) as '紧急专家签约量',sum(IF(contractCategory=8 AND status=6,contractPrice,0)) as '紧急专家签约额',sum(IF(contractCategory in (7,9,10,11),1,0)) as '转学专家咨询量', sum(IF(contractCategory in (7,9,10,11) AND status in(3,4,5,6),1,0)) as '转学专家签约量',sum(IF(contractCategory in (7,9,10,11) AND status in(3,4,5,6),contractPrice,0)) as '转学专家签约额' from user left join contract on user.id=contract.expert group by user.id) as t2 on t1.id=t2.id;";
console.log(sql);
    Contract.query(sql,function(err,data){
      if(err) {
        console.log(err);
        return res.json(404,err);
      }
      return res.json(data);
    });
    },
    'MonthlyChange':function(req,res){

      var sql="select * from FullSummary; ";

      Contract.query(sql,function(err,data){
      if(err) {
        console.log(err);
        return res.json(404,err);
      }
      return res.json(data);
    });
    }
  }