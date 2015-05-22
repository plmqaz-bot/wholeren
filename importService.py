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

SERVICEPROGRESS={};
SERVICETYPE={};
UNKNOWNPROGRESS=[];
UNKNOWNTYPE=[];
UNKNOWNSEMESTER=[];

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
oldTypeToNew={'d5':'d','d4':'d','d1':'d','d3':'d2','d2':'d0','f2':'f','c':'c1','h1':'h','i5':'i','i4':'i2','i3':'i','i2':'i1','i1':'i','ps':'p2','p':'p2','ghj':'j1','ic':'h11','b1':'b','i4, f':'i4','d4+d5':'d','z':'i'}
def processType(type):
	type=type.strip();
	if type.lower() in oldTypeToNew:
		return oldTypeToNew[type.lower()];
	return type.lower();
oldProg={'**勿忘我2**':'**勿忘我**','X放弃/退款X':'X自我放弃X'}
def processProgress(prog):
	if prog in oldProg:
		return oldProg[prog];
	return prog;

USERS={'renee':'xiaoya','yanmeng xiao':'yanmeng','tsung hsun lee':'lee','yolandali':'yolanda','xiaoyanmeng':'yanmeng','annie wang':'annie','alex wang':'alex','alex z':'alex','xiao yanmeng':'yanmeng','caroline sun':'caroline','qifeng yin':'qifeng','chuihui zhang':'chuhui','jingyi zou':'jingyi','kelly lau':'kellylau','chole':'chloe'};

def processUser(u):
	u=u.strip();
	if u.lower() in USERS:
		return USERS[u.lower()];
	return u.lower();
semester={'na':'','v':'','NA':'','N/A':'','Fall2015':'2015-09-01','Spring2016':'2016-01-01'};
def processSemester(s):
	if s =='':
		return '';
	s=s.split('\n')[0];
	s=s.replace(' ','');
	if s in semester:
		return semester[s];

	return s.replace('/','-').replace('.','-')+'-01';

def convertDate(d):
	try:
		dt=time.strptime(d,'%Y-%m-%d');
		return time.strftime('%Y-%m-%d',dt);
	except ValueError:
		try:
			dt=time.strptime(d,'%m/%d/%Y');
			return time.strftime('%Y-%m-%d',dt);
		except ValueError:
			print "unknown date "+d;
			return '';
def addUserToService(sid,username,line,role):
	global UNKNOWNUSER;
	global errorfile;
	username=username.lower();
	if username=='lia chole':
		username='lia,chole';
	if username!='' and username!='na':
		print "look for User "+username;
		userArray=re.findall(r"[\w' ]+",username);
		for cw in userArray:
			cw=processUser(cw);
			tok=cw.split(" ");
			if len(tok)==1:
				cursor.execute("select id from user where lower(firstName) like '%%"+tok[0]+"%%' or lower(lastName) like '%%"+tok[0]+"%%' or lower(nickname) like '%%"+tok[0]+"%%' limit 1");
			else:
				cursor.execute("select id from user where (lower(firstName) like '%%"+tok[0]+"%%' and lower(lastName) like '%%"+tok[1]+"%%') or lower(lastName) like '%%"+tok[0]+"%%' and lower(firstName) like '%%"+tok[1]+"%%' limit 1");
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
					cursor.execute(add_servicedetail,(sid,uid,role));
#print unicode(SERVICETYPE).encode('utf8');
key='';
teacher=''
with open('S61_4.csv','rb') as csvfile:
	filereader=csv.reader(csvfile,delimiter=',',quotechar='\"');
	for line in filereader:
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



