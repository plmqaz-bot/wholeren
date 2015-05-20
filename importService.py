import mysql.connector;
import csv;
import codecs;
from collections import OrderedDict;

add_application=("INSERT INTO application (collageName,appliedMajor,service,succeed,studentCondition,appliedSemester) VALUES (%s,%s,%s,%s,%s,%s)")
add_service=("INSERT INTO service (cName,lName,fName,namekey,generated,serviceType,serviceProgress,link) VALUES (%s,%s,%s,%s,%s,%s,%s,%s)")
add_servicedetail=("INSERT INTO servicedetail (service,user) VALUES (%s,%s)")


cnx=mysql.connector.connect(user='wholeren',password='piouqtpowjer123141235',host='han.bio.cmu.edu',database='wholeren',charset='utf8');
cursor=cnx.cursor();

SERVICEPROGRESS={};
SERVICETYPE={};
cursor.execute('select serviceProgress,id from serviceprogress;');
for row in cursor:
	#print unicode(row[0]).encode('utf-8');
	SERVICEPROGRESS[unicode(row[0]).encode('utf-8')]=row[1];

cursor.execute('select alias,id from servicetype;');
for row in cursor:
	SERVICETYPE[unicode(row[0]).encode('utf-8')]=row[1];
UNKNOWNPROGRESS=[];
UNKNOWNTYPE=[];
UNKNOWNUSER=[];
outfile=open("incompleteServiceImport.csv","wb");
errorfile=csv.writer(outfile,delimiter=',',quotechar='\"');

#print unicode(SERVICETYPE).encode('utf8');
key='';
teacher=''
with open('S61.csv','rb') as csvfile:
	filereader=csv.reader(csvfile,delimiter=',',quotechar='\"');
	for line in filereader:
		serviceProgress=line[0].strip();
		#print unicode(serviceProgress);
		if serviceProgress in SERVICEPROGRESS:
			print "found progress ";
			serviceProgress=SERVICEPROGRESS[serviceProgress];
		else:
			UNKNOWNPROGRESS+=[serviceProgress];
			errorfile.writerow(line);
			continue;
		serviceType=line[6].strip();
		if serviceType in SERVICETYPE:
			serviceType=SERVICETYPE[serviceType];
		else:
			UNKNOWNTYPE+=[serviceType];
			errorfile.writerow(line);
			continue;
		name=line[2].strip().replace("\'","\\'");
		fName=line[3].strip().replace("\'","\\'");
		lName=line[4].strip().replace("\'","\\'");
		cName=line[21].strip().replace("\'","\\'");
		link=line[23].strip().replace("\'","\\'");
		curkey=fName+lName+cName+name+line[5].strip()+line[6].strip();
		curteacher=line[1];
		query=("select id from service where namekey='"+curkey+"';");
		cursor.execute(query);
		serv=cursor.fetchone();
		if serv is not None:
			sid=serv[0];
		else:
			print 'Service not found, inserting'
			cursor.execute(add_service,(cName,lName,fName,curkey,1,serviceType,serviceProgress,link));
			sid=cursor.lastrowid
		# Got service, now see if the teacher name is found
		if curteacher!='':
			print "look for user "+curteacher;
			cursor.execute("select id from user where firstName =%s or lastName=%s or nickname=%s limit 1",(curteacher,curteacher,curteacher));
			urow=cursor.fetchone();
			if urow is None:
				print 'user not found';
				UNKNOWNUSER+=[curteacher];
				errorfile.writerow(line);
				continue;
			else:
				uid=urow[0];
				print 'process serviceDetail';
				cursor.execute("select id from servicedetail where service=%s and user=%s limit 1",(sid,uid));
				sdrow=cursor.fetchone();
				if sdrow is None:
					cursor.execute(add_servicedetail,(sid,uid));
		writer=line[18].strip();
		if writer!='':
			cursor.execute("select id from user where firstName =%s or lastName=%s or nickname=%s limit 1",(writer,writer,writer));
			urow=cursor.fetchone();
			if urow is None:
				UNKNOWNUSER+=[curteacher];
				errorfile.writerow(line);
				continue;
			else:
				uid=urow[0];
				cursor.execute("select id from servicedetail where service=%s and user=%s limit 1",(sid,uid));
				sdrow=cursor.fetchone();
				if sdrow is None:
					cursor.execute(add_servicedetail,(sid,uid));

		appCollegeName=line[14].strip();
		appAppliedMajor=line[15].strip();
		appAppliedSemester=line[16].strip();
		if line[19].strip()=='Y':
			appSucceed=1;
		else:
			appSucceed=0;
		if appCollegeName!='':
			print 'add application for '+appCollegeName;
			cursor.execute(add_application,(appCollegeName,appAppliedMajor,sid,appSucceed,line[20],appAppliedSemester));
		
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
#print(UNKNOWNPROGRESS[0].encode('utf-8'));
#print(SERVICEPROGRESS);
#print UNKNOWNTYPE;
#print UNKNOWNUSER;
cnx.commit();
cursor.close();
cnx.close();
