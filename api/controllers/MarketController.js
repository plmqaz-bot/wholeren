

  module.exports = {
  	'general':function(req,res){
      var year=parseInt(req.param('year'));
      var month=parseInt(req.param('month'));
      if(isNaN(year)||isNaN(month)||year<1969||year>2100||month<1||month>12) return res.json(400,{error:"invalid year and month"});
      var sql="select salesgroup.salesGroup,lead.lead,t1.count,IFNULL(signcount,0) as 'signcount',IFNULL(income,0) as 'income' from (select salesGroup,lead,count(*) as 'count' from contract c where DateInRange(c.createdAt,"+year+","+month+") group by c.lead,c.salesGroup) t1 left join \
(select salesGroup,lead,count(*) as 'signcount',sum(contractPrice) as 'income' from contract c where DateInRange(c.contractSigned,"+year+","+month+")  and contractSigned is not null group by c.lead,c.salesGroup) t2 on t1.salesGroup=t2.salesGroup and t1.lead=t2.lead left join lead on lead.id=t1.lead left join salesgroup on salesgroup.id=t1.salesGroup;";
     // var sql="call LeadSignRate("+month+","+year+");";
      Utilfunctions.nativeQuery(sql).then(function(data){
          return res.json(data);
      }).catch(function(err){
            Utilfunctions.errorHandler(err,res,"Market General View Failed");
      });
  	},
    'contractOfSaleAndExpert':function(req,res){
      var year=parseInt(req.param('year'));
      var month=parseInt(req.param('month'));
      if(isNaN(year)||isNaN(month)||year<1969||year>2100||month<1||month>12) return res.json(400,{error:"invalid year and month"});
    
      sql="call PerUserSignRate(0,"+month+","+year+"); ";
      console.log(sql);
      Utilfunctions.nativeQuery(sql).then(function(data){
        if(data[0])
          return res.json(data[0]);
        else
          return res.json(data);
      }).catch(function(err){
            Utilfunctions.errorHandler(err,res,"Sales Expert Summary View Failed.");
      });
    },
    'MonthlyChange':function(req,res){
      var sql="select * from FullSummary; ";
      Utilfunctions.nativeQuery(sql).then(function(data){
          return res.json(data);
      }).catch(function(err){
            Utilfunctions.errorHandler(err,res,"Income Change View Failed");
      });
    },
    'MonthlyGoal':function(req,res){
      var year=parseInt(req.param('year'));
      var month=parseInt(req.param('month'));
      if(isNaN(year)||isNaN(month)||year<1969||year>2100||month<1||month>12) return res.json(400,{error:"invalid year and month"});
      var sql="select user.id as 'user', user.nickname,s.goal,"+year+" as 'year', "+month+" as 'month' from user left join salescomissiongoal s on (user.id=s.user and s.year="+year+" and s.month="+month+") where user.role=1;";
      Utilfunctions.nativeQuery(sql).then(function(data){
          return res.json(data);
      }).catch(function(err){
            Utilfunctions.errorHandler(err,res,"Sales Goal View Failed");
      });
    },
    'updateMonthlyGoal':function(req,res){
      var attribs=req.body;
      attribs.user=parseInt(attribs.user);
      attribs.year=parseInt(attribs.year);
      attribs.month=parseInt(attribs.month);
      var year=attribs.year;
      var month=attribs.month;
      if(isNaN(year)||isNaN(month)||year<1969||year>2100||month<1||month>12) return res.json(400,{error:"invalid year and month"});
      if(isNaN(attribs.user)){
        return res.json(404,{error:"not enough parameters"});
      }
      //var toupdate=Utilfunctions.prepareUpdate(attribs,['transferSaleGoal','transferExpGoal','emergSaleGoal','emergExpGoal','highSaleGoal','highExpGoal','studySaleGoal','studyExpGoal','leadGoal'])
      var toupdate=Utilfunctions.prepareUpdate(attribs,['goal','user','year','month']);
      SalesComissionGoal.findOne({user:attribs.user,year:attribs.year,month:attribs.month}).then(function(data){
        data=data||{};
        if(data.id){
          console.log("found ",data);
          return SalesComissionGoal.update({id:data.id},attribs);
        }else{
            //return Utilfunctions.errorHandler(err,res,"Generate Comment failed");
            return SalesComissionGoal.create(attribs);
        }
      }).then(function(data){
        data=data[0]||data;
        if(data.id){
          var sql="select user.id as 'user', user.nickname,s.goal,"+year+" as 'year', "+month+" as 'month' from user left join salescomissiongoal s on  (user.id=s.user)  where s.id="+data.id+";";
          return Utilfunctions.nativeQuery(sql);
        }else{
          return Promise.reject("Update failed, cannot create");
        }
      }).then(function(data){
           return res.json(data[0]);
      }).fail(function(err){
          return Utilfunctions.errorHandler(err,res,"Update Goal failed");
      });
    },
  }