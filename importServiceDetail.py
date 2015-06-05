# -*- coding: utf-8 -*-
import mysql.connector;
import csv;
import codecs;
from collections import OrderedDict;
import re;
import time;

add_application=("INSERT INTO application (collageName,appliedMajor,service,succeed,studentCondition,appliedSemester) VALUES (%s,%s,%s,%s,%s,%s)")
add_service=("INSERT INTO servicedetail (contractKey,cName,serviceType,serviceProgress,indate,link,namekey,generated) VALUES (%s,%s,%s,%s,%s,%s,%s,%s)")
add_servicedetail=("INSERT INTO servicedetail (user,realServiceType,serviceProgress,indate,link,contractKey,cname,namekey) VALUES (%s,%s,%s,%s,%s,%s,%s,%s)")


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

cursor.execute('select realServiceType,id from realservicetype;');
for row in cursor:
	SERVICETYPE[unicode(row[0]).encode('utf-8')]=row[1];

outfile=open("incompleteServiceImport.csv","wb");
errorfile=csv.writer(outfile,delimiter=',',quotechar='\"');
outfile2=open("S61_servicedetail_new.csv","wb");
processed=csv.writer(outfile2,delimiter=',',quotechar='\"');
oldTypeToNew={'d5':'d','d4':'d','d1':'d','d3':'d2','d2':'d0','f2':'f','c':'c1','h1':'h','i5':'i','i4':'i2','i3':'i','i2':'i1','i1':'i','ps':'p2','p':'p2','ghj':'j1','ic':'h11','b1':'b','i4, f':'i4','d4+d5':'d','z':'i'}
def processType(type):
	# type=type.strip();
	# if type.lower() in oldTypeToNew:
	# 	return oldTypeToNew[type.lower()];
	return type.lower();
def processProgress(prog):
	return prog;

#USERS={'renee':'xiaoya','yanmeng xiao':'yanmeng','tsung hsun lee':'lee','yolandali':'yolanda','xiaoyanmeng':'yanmeng','annie wang':'annie','alex wang':'alex','alex z':'alex','xiao yanmeng':'yanmeng','caroline sun':'caroline','qifeng yin':'qifeng','chuihui zhang':'chuhui','jingyi zou':'jingyi','kelly lau':'kellylau','chole':'chloe'};

# def processUser(u):
# 	u=u.strip();
# 	if u.lower() in USERS:
# 		return USERS[u.lower()];
# 	return u.lower();

def convertDate(d):
	try:
		dt=time.strptime(d,'%Y-%m-%d');
		return time.strftime('%Y-%m-%d',dt);
	except ValueError:
		try:
			dt=time.strptime(d,'%m/%d/%Y');
			return time.strftime('%Y-%m-%d',dt);
		except ValueError:
			try:
				dt=time.strptime(d,'%Y%m%d');
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
with open('S61.csv','rb') as csvfile:
	filereader=csv.reader(csvfile,delimiter=',',quotechar='\"');
	for line in filereader:
		contractKey=line[0].strip();
		cName=line[1].strip();
		serviceType=line[2].strip();
		serviceType=processType(serviceType);
		if serviceType in SERVICETYPE:
			serviceType=SERVICETYPE[serviceType];
		else:
			print "type not found:"+serviceType;
			UNKNOWNTYPE+=[serviceType];
			errorfile.writerow(line);
			continue;
		serviceProgress=processProgress(line[3].strip());
		#print unicode(serviceProgress);
		if serviceProgress in SERVICEPROGRESS:
			print "found progress ";
			serviceProgress=SERVICEPROGRESS[serviceProgress];
		elif serviceProgress=='':
			serviceProgress=1;
		else:
			print "progress not found:"+serviceProgress;
			UNKNOWNPROGRESS+=[serviceProgress];
			errorfile.writerow(line);
			continue;
		curteacher=line[4].strip().lower();
		indate=convertDate(line[5].strip());
		if indate=='':
			print "unknown Date:"+indate;
			errorfile.writerow(line);
			continue;
		comment=line[6].strip();
		if len(line)>7:
			link=line[7].strip().replace("\'","\\'");
		else:
			link="";
		curkey=cName+line[2].strip()+line[5].strip();	
		#find the user using email
		query=("select id from user where email ='"+curteacher+"';");
		cursor.execute(query);
		uid=cursor.fetchone();
		if uid is None:
			UNKNOWNUSER+=[curteacher];
			continue;
		else:
			uid=uid[0]

		query=("select id from servicedetail where namekey='"+curkey+"';");
		cursor.execute(query);
		serv=cursor.fetchone();
		if serv is not None:
		 	sid=serv[0];
		else:
		 	print 'ServiceDetail not found, inserting'
			cursor.execute(add_servicedetail,(uid,serviceType,serviceProgress,indate,link,contractKey,cName,curkey));
			sid=cursor.lastrowid
		# Got service, now see if the teacher name is found
		#addUserToService(sid,curteacher,line,0);
		processed.writerow(line);

f=open("UNKNOWNPROGRESS.csv","w");
f.write((",".join(OrderedDict.fromkeys(UNKNOWNPROGRESS).keys())));
f.close();
f=open("UNKNOWNTYPE.csv","w");
f.write((",".join(OrderedDict.fromkeys(UNKNOWNTYPE).keys())));
f.close();
f=open("UNKNOWNUSER.csv","w");
f.write((",".join(OrderedDict.fromkeys(UNKNOWNUSER).keys())));
f.close();
print OrderedDict.fromkeys(UNKNOWNUSER).keys()
print OrderedDict.fromkeys(UNKNOWNTYPE).keys()
print OrderedDict.fromkeys(UNKNOWNPROGRESS).keys()
#print(UNKNOWNPROGRESS[0].encode('utf-8'));
#print(SERVICEPROGRESS);
#print UNKNOWNTYPE;
#print UNKNOWNUSER;
cnx.commit();
cursor.close();
cnx.close();



