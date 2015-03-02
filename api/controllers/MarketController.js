

  module.exports = {
  	'general':function(req,res){
      var year=parseInt(req.param('year'));
      var month=parseInt(req.param('month'));
      if(isNaN(year)||isNaN(month)||year<1969||year>2100||month<1||month>12) return res.json(400,{error:"invalid year and month"});
      var sql="call LeadSignRate("+month+","+year+");";
      console.log(sql);
      Utilfunctions.nativeQuery(sql).then(function(data){
        if(data[0])
          return res.json(data[0]);
        else
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
      var sql="select user.id as 'user',"+year+" as 'year', "+month+" as 'month', user.nickname,goal.* from user left join goal on user.id=goal.user left join role on user.role=role.id\
      where role.role ='销售' and (month is null or month="+month+") and (year is null or year="+year+");";
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
      var toupdate=Utilfunctions.prepareUpdate(attribs,['transferSaleGoal','transferExpGoal','emergSaleGoal','emergExpGoal','highSaleGoal','highExpGoal','studySaleGoal','studyExpGoal','leadGoal'])
      Goal.findOne({user:attribs.user,year:attribs.year,month:attribs.month}).then(function(data){
        data=data||{};
        if(data.id){
          console.log("found ",data);
          return Goal.update({id:data.id},toupdate);
        }else{
            return Utilfunctions.errorHandler(err,res,"Generate Comment failed");
        }
      }).then(function(data){
        var sql="select user.id as 'user',"+year+" as 'year', "+month+" as 'month', user.nickname,goal.* from user left join goal on user.id=goal.user left join role on user.role=role.id\
        where role.role ='销售' and (month is null or month="+attribs.month+") and (year is null or year="+attribs.year+") and user.id="+attribs.user+";";
        return Utilfunctions.nativeQuery(sql);
      }).then(function(data){
        return res.json(data);
      }).fail(function(err){
          return Utilfunctions.errorHandler(err,res,"Update Goal failed");
      });
    },
  }