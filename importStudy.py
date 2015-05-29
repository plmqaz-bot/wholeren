# -*- coding: utf-8 -*-
import mysql.connector;
import csv;
import codecs;
from collections import OrderedDict;
import re;
import time;

add_application=("INSERT INTO application (collageName,appliedMajor,service,succeed,studentCondition,appliedSemester) VALUES (%s,%s,%s,%s,%s,%s)")
add_service=("INSERT INTO service (cName,lName,fName,namekey,generated,serviceType,serviceProgress,link,contractKey,indate) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)")
add_servicedetail=("INSERT INTO servicedetail (service,user,servRole) VALUES (%s,%s,%s)")

cnx=mysql.connector.connect(user='wholeren',password='piouqtpowjer123141235',host='han.bio.cmu.edu',database='wholeren',charset='utf8');
cursor=cnx.cursor();


with open('study.csv','rb') as csvfile:
	filereader=csv.reader(csvfile,delimiter=',',quotechar='\"');
	for line in filereader:

		chineseName=line[2].strip();
		email=line[12].strip();
		phone=line[13].strip();
		skype=line[14].strip();
		qq=line[15].strip();
		wechat=line[16].strip();
		address=line[17].strip();
		dob=line[18].strip();
		otherInfo=line[19].strip();
		emergincyContact=line[20].strip();
		level=line[21].strip();
		school=line[4].strip();
		type=line[6].strip();
		term=line[7].strip();
		semester=line[9].strip();
		semestersystem=line[10].strip();
		progress=line[11].strip();
		comment=line[22]+"|"+line[23]+"|"+line[24];
		serviceProgress=processProgress(line[0].strip());
		#print unicode(serviceProgress);
		if serviceProgress in SERVICEPROGRESS:
			print "found progress ";
			serviceProgress=SERVICEPROGRESS[serviceProgress];
		else:
			UNKNOWNPROGRESS+=[serviceProgress];
			errorfile.writerow(line);
			continue;
		serviceType=line[7].strip();
		serviceType=processType(serviceType);
		if serviceType in SERVICETYPE:
			serviceType=SERVICETYPE[serviceType];
		else:
			UNKNOWNTYPE+=[serviceType];
			errorfile.writerow(line);
			continue;
		uniqID=line[2].strip().replace("\'","\\'");
		name=line[3].strip().replace("\'","\\'");
		fName=line[4].strip().replace("\'","\\'");
		lName=line[5].strip().replace("\'","\\'");
		cName=line[22].strip().replace("\'","\\'");
		link=line[24].strip().replace("\'","\\'");
		curkey=fName+lName+cName+name+line[6].strip()+line[7].strip();
		curteacher=line[1];
		query=("select id from service where namekey='"+curkey+"';");
		cursor.execute(query);
		serv=cursor.fetchone();
		if serv is not None:
			sid=serv[0];
		else:
			print 'Service not found, inserting'
			cursor.execute(add_service,(cName,lName,fName,curkey,1,serviceType,serviceProgress,link,uniqID,convertDate(line[6].strip())));
			sid=cursor.lastrowid
		# Got service, now see if the teacher name is found
		addUserToService(sid,curteacher,line,0);
		writer=line[19].strip();
		addUserToService(sid,writer,line,4);

		appCollegeName=line[15].strip();
		appAppliedMajor=line[16].strip();
		oriappAppliedSemester=line[17].strip();
		appAppliedSemester=processSemester(oriappAppliedSemester);
		try:
			dt=time.strptime(appAppliedSemester,'%Y-%m-%d');
		except ValueError:
			try:
				dt=time.strptime(oriappAppliedSemester,'%m/%d/%Y');
				appAppliedSemester=time.strftime('%Y-%m-%d',dt);
			except ValueError:
				UNKNOWNSEMESTER+=[oriappAppliedSemester];
		if line[20].strip()=='Y':
			appSucceed=1;
		else:
			appSucceed=0;
		if appCollegeName!='':
			#UNKNOWNSEMESTER+=[appAppliedSemester];
			cursor.execute('select id from application where service='+str(sid)+' and collageName="'+appCollegeName+'" limit 1;');
			ap=cursor.fetchone();
			if ap is None:
				print 'add application for '+appCollegeName;
				cursor.execute(add_application,(appCollegeName,appAppliedMajor,sid,appSucceed,line[21].strip(),appAppliedSemester));
		
		# service['serviceProgress']=line[0];
		#     	contract.teacher=line[1];
		#     	client.name=line[2]||"";
		#     	if(client.name.length<1){
		#     		errorLine.push(line);
		#     	}
		#     	client.firstName=line[3]||"";
		#     	client.lastName=line[4]||"";
		#     	contract.contractSigned=null;
		#     	if(line[5]){
		#         	contract.contractSigned=new Date(line[5].split('\n')[0]);
		#         }
		#         service.serviceType=(line[6]||"").trim();
		#         contract.gpa=line[7];
		#         contract.toefl=line[8];
		#         contract.sat=line[9];
		#         contract.gre=line[10];
		#         contract.gmat=line[11];
		#         contract.previousSchool=line[12];
		#         contract.major=line[13];
		#         application.collageName=line[14];
		#         application.appliedMajor=line[15];
		#         application.appliedSemester=line[16];
		#         var level=line[17];
		#         var writer=line[18];
		#         application.succeed=line[19]=='Y'?true:null;
		#         application.studentCondition=line[20];
		#         client.chineseName=(line[21]||"").trim().toLowerCase();
		#         service.link=line[23];
f=open("UNKNOWNPROGRESS.csv","w");
f.write((",".join(OrderedDict.fromkeys(UNKNOWNPROGRESS).keys())));
f.close();
f=open("UNKNOWNTYPE.csv","w");
f.write((",".join(OrderedDict.fromkeys(UNKNOWNTYPE).keys())));
f.close();
f=open("UNKNOWNUSER.csv","w");
f.write((",".join(OrderedDict.fromkeys(UNKNOWNUSER).keys())));
f.close();
print OrderedDict.fromkeys(UNKNOWNSEMESTER).keys()
#print(UNKNOWNPROGRESS[0].encode('utf-8'));
#print(SERVICEPROGRESS);
#print UNKNOWNTYPE;
#print UNKNOWNUSER;
cnx.commit();
cursor.close();
cnx.close();
