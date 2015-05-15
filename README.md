# testProject

a [Sails](http://sailsjs.org) application


TODO List:
signup--DONE

Figure out a way to add and remove services --DONE

View for all the users and change roles and stuff --DONE

data validation for every model attributes, especially the dates format. 

policy, manager rank control everything. ...-DONE

creating contract should be transaction, client should not be created.  --DONE

Return don't close modal --DONE


Add commet to contract or service or application.--DONE

production database. --DONE

user login -DONE


STAGE 1. 

crlf for security

Client generate tracking code. --DONE

Contract add 学生专业， 付款时间， lead种类加 presale 和 CA --DONE

Contract add 助理，助签 两个角色，也是销售里面选 --DONE

Contract original text length 1000, others 300. --DONE

User add 签约量， 和，上级， --DONE

Service 显示签约时间，不是创建时间。 已签约才出现 --DONE

rank 2为主管，rank 3为经理。 主管管理部分人。  rank2 销售看管理contract， rank2,3 申请都看所有service。--DONE

rank 1不能delete， --DONE

Service Step1, Step2 填写时间，未填写状态填写placeholder。 --DONE

Comment on Application, --DONE

Service 状态更新（5个状态）--DONE 按钮发送email。

Contract and Service 更换老师，auto generate comment。 --DONE

Contract Filter 时间段，经理查看主管的项目，--DONE

FILTER: 咨询服务类别，是否应收尾款，是否已收尾款。--Progress --DONE

User higher rank 可以修改rank, calculate count. --DONE

Service Filter 时间段，--DONE

（签约时间） 服务类别（大类， i,d,e,b,a,z). --DONE

入学学期（一年四个）。 --DONE

forgot password

import data  sales name unknow , what to do ? --DONE

import User --DONE

setup User profile

handle how to activate user.  --DONE

Contract, service pagination --DONE

 bug in add application! --DONE

 working on Service for application writer. Get service and findOne. --DONE

 service block services to prevent add application, -DONE

 test service, and how to modify service and application.  -DONE



View for sales:
1. monthly sales contract comission --DONE
2. monthly sales target/completion --DONE
3. monthly sales record. --DONE

sales comission select time --DONE

redo how service comission get the select options. should be done in client-DONE


market need a renewed view. 

edit goal for sales and expert etc...-DONE

sales comission should be per month. 

Service and Contract findOne needs update; --DONE

reod sql for servicecomission; --DONE

service comission should be the services that is not done. --DONE

. 
edit init.sql to create the procedures --DONE

less templates.  --DONE


Names in template-- DONE


Invoice View: add new, delete, view to split invoice to multiple service -DONE

Service invoice View:  --DONE

Invoice controller: get invoices of one contract, update/delete invoice,  --DONE

Service Invoice, get service invoices of one Invoice, --DONE


rollback problem --DONE
ni s

generate csv --DONE 

Save attribute should roll back --DONE

Insert into contract has problem. --DONE

use colgroup for fix columns --DONE

add gre and sat in contract --DONE

problem with sorting of pageable collection --DONE

click name show client edit form

click sign show contract sign form -- DONE  need the date to be nullable --DONE

click user show sales, experts  --DONE


Filter to select only finished contract and service

delete does not delete the head column --DONE

edit contract --DONE


bug in signup -DONE

bug in sales role

bug in user --DONE

change sales comission lookup into cumulative --

change service to show Application only for service that allow application. --DONE

add salesGroup into contract, and select contractcategory based on group,  --DONE

select leadDetail based on lead.  --DONE

in service, show seperate service if it is a package --DONE

make a service to generally handle all forbidden requests, query errors,  redirect to appropriate page and return correct format --Stage 3. --DONE

price of service is based on serviceType and the current school type.  

collection initialize (models,options), not (options) --DONE

so is model --DONE

extending view, instance variables should not be object. --DONE



auto mysql backup setup --DONE

filter on grid table works on string cells and also select cells --DONE

authorization needs to change, aparently there are more than three layers  of "who owns who" --DONE

make introduction videos --DONE

password reset --DONE



make choose service to be in contract view --DONE

added contact info, address for user, set up static link info table. --DONE

display Count --DONE

added nullable selections, the select box in grid view now have an "unknown" option --DONE

used cookie now, so server restart won't cause ppl to relog in --DONE


set permission for update own password, but not change other user's stuff

setup debug enviroment and utest

setup Lead, sales group, category restrictions for user change

add a rank to be able to see all contract,service, but not all comission. 




chagne one contract field, other service should also update --Sync subscribe and stuff, later

raid for data storage


