import mysql.connector;
import csv;
import codecs;
from collections import OrderedDict;
import re;

add_application=("INSERT INTO application (collageName,appliedMajor,service,succeed,studentCondition,appliedSemester) VALUES (%s,%s,%s,%s,%s,%s)")
add_service=("INSERT INTO service (cName,lName,fName,namekey,generated,serviceType,serviceProgress,link) VALUES (%s,%s,%s,%s,%s,%s,%s,%s)")
add_servicedetail=("INSERT INTO servicedetail (service,user) VALUES (%s,%s)")


cnx=mysql.connector.connect(user='wholeren',password='piouqtpowjer123141235',host='han.bio.cmu.edu',database='wholeren',charset='utf8');
cursor=cnx.cursor();

SERVICEPROGRESS={};
SERVICETYPE={};
UNKNOWNPROGRESS=[];
UNKNOWNTYPE=[];

UNKNOWNUSER=[];
cursor.execute('select serviceProgress,id from serviceprogress;');
for row in cursor:
	#print unicode(row[0]).encode('utf-8');
	SERVICEPROGRESS[unicode(row[0]).encode('utf-8')]=row[1];

cursor.execute('select alias,id from servicetype;');
for row in cursor:
	SERVICETYPE[unicode(row[0]).encode('utf-8')]=row[1];

outfile=open("incompleteServiceImport.csv","wb");
errorfile=csv.writer(outfile,delimiter=',',quotechar='\"');

def addUserToService(sid,username):
	global UNKNOWNUSER;
	global errorfile;
	username=username.lower();
	if username!='' and username!='na':
		print "look for User "+username;
		userArray=re.findall(r"[\w' ]+",username);
		for cw in userArray:
			tok=cw.split(" ");
			if len(tok)==1:
				cursor.execute("select id from user where lower(firstName) like '%%"+tok[0]+"%%' or lower(lastName) like '%%"+tok[0]+"%%' or lower(nickname) like '%%"+tok[0]+"%%' limit 1");
			else:
				cursor.execute("select id from user where lower(firstName) like '%%"+tok[0]+"%%' and lower(lastName) like '%%"+tok[1]+"%%' limit 1");
			urow=cursor.fetchone();
			if urow is None:
				print "User not found "+cw;
				UNKNOWNUSER+=[cw];
				errorfile.writerow(line);
				continue;
			else:
				uid=urow[0];
				cursor.execute("select id from servicedetail where service=%s and user=%s limit 1",(sid,uid));
				sdrow=cursor.fetchone();
				if sdrow is None:
					cursor.execute(add_servicedetail,(sid,uid));
#print unicode(SERVICETYPE).encode('utf8');
key='';
teacher=''
with open('S61_3.csv','rb') as csvfile:
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
		serviceType=line[7].strip();
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
			cursor.execute(add_service,(cName,lName,fName,curkey,1,serviceType,serviceProgress,link));
			sid=cursor.lastrowid
		# Got service, now see if the teacher name is found
		addUserToService(sid,curteacher);
		writer=line[19].strip();
		addUserToService(sid,writer);

		appCollegeName=line[15].strip();
		appAppliedMajor=line[16].strip();
		appAppliedSemester=line[17].strip();
		if line[20].strip()=='Y':
			appSucceed=1;
		else:
			appSucceed=0;
		if appCollegeName!='':
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
#print(UNKNOWNPROGRESS[0].encode('utf-8'));
#print(SERVICEPROGRESS);
#print UNKNOWNTYPE;
#print UNKNOWNUSER;
cnx.commit();
cursor.close();
cnx.close();



