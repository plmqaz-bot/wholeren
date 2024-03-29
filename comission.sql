use test;
# sales comission table
select user.id as "userid",service.id as "serviceid",user.nickname,servicetype.serviceType,service.price,salesrole.comissionPercent,salesrole.flatComission,servicetype.commission from user 
inner join contract on (contract.sales=user.id or contract.assistant=user.id)
inner join service on (service.contract=contract.id)
left join contractcomission on (user.id=contractcomission.user and service.id=contractcomission.service)
left join salesrole on (activeRole=salesrole.id)
left join servicetype on (service.serviceType=servicetype.id);

#make sure they are unique
alter table contractcomission add unique unique_index(user,service);
alter table servicecomission add unique unique_index(user,service,application);
select * from servicestatus