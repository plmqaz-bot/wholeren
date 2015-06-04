# -*- coding: utf-8 -*-
import mysql.connector;
import csv;
import codecs;
from collections import OrderedDict;
import re;
import time;

add_application=("INSERT INTO application (collageName,appliedMajor,service,succeed,studentCondition,appliedSemester) VALUES (%s,%s,%s,%s,%s,%s)")

add_servicedetail=("INSERT INTO servicedetail (user,realServiceType,serviceProgress,indate,link,contractKey,cname,namekey) VALUES (%s,%s,%s,%s,%s,%s,%s,%s)")


cnx=mysql.connector.connect(user='wholeren',password='piouqtpowjer123141235',host='han.bio.cmu.edu',database='wholeren',charset='utf8');
cursor=cnx.cursor();


SERVICETYPE={};
UNKNOWNTYPE=[];
UNKNOWNSEMESTER=[];
UNKNOWNUSER=[];


cursor.execute('select realServiceType,id from realservicetype;');
for row in cursor:
	SERVICETYPE[unicode(row[0]).encode('utf-8')]=row[1];

outfile=open("incompleteApplication.csv","wb");
errorfile=csv.writer(outfile,delimiter=',',quotechar='\"');
#oldTypeToNew={'d5':'d','d4':'d','d1':'d','d3':'d2','d2':'d0','f2':'f','c':'c1','h1':'h','i5':'i','i4':'i2','i3':'i','i2':'i1','i1':'i','ps':'p2','p':'p2','ghj':'j1','ic':'h11','b1':'b','i4, f':'i4','d4+d5':'d','z':'i'}
oldTypeToNew={'d4':'d','d5':'d','d1':'d','d3':'d'}
def processType(type):
	type=type.strip();
	if type.lower() in oldTypeToNew:
		return oldTypeToNew[type.lower()];
	return type.lower();
def convertDate(d):
	try:
		dt=time.strptime(d,'%Y-%m-%d');
		return time.strftime('%Y-%m-%d',dt);
	except ValueError:
		try:
			dt=time.strptime(d,'%m/%d/%Y');
			return time.strftime('%Y-%m-%d',dt);
		except ValueError:
			return '';
#print unicode(SERVICETYPE).encode('utf8');
key='';
teacher=''
with open('S61_app.csv','rb') as csvfile:
	filereader=csv.reader(csvfile,delimiter=',',quotechar='\"');
	for line in filereader:
		contractKey=line[0].strip();
		cName=line[1].strip();
		#dd=cName.decode('utf-8')
		
		serviceType=line[2].strip();
		serviceType=processType(serviceType);
		if serviceType in SERVICETYPE:
			serviceType=SERVICETYPE[serviceType];
		else:
			print "type not found:"+serviceType;
			UNKNOWNTYPE+=[serviceType];
			errorfile.writerow(line);
			continue;
		univ=line[4].strip();
		major=line[5].strip();
		semester=convertDate(line[6].strip());
		if semester=='':
			print "unknown Date:"+line[6];
			UNKNOWNSEMESTER+=[line[6]];
			errorfile.writerow(line);
		result=line[7].strip();
		studentCondition=line[8].strip();
		query=("select id,count(*) from servicedetail where (cName='"+cName+"' and realServiceType='"+str(serviceType)+"');");
		cursor.execute(query);
		serv=cursor.fetchone();
		sid=serv[0];
	 	count=serv[1]
		if count !=1:
		 	# add application
		 	print 'ServiceDetail not found or too many'+str(count)+" " +str(serviceType)+" "+contractKey#+cName;
			errorfile.writerow(line);
			#cursor.execute(add_servicedetail,(uid,serviceType,serviceProgress,indate,link,contractKey,cName,curkey));
			#sid=cursor.lastrowid
		# Got service, now see if the teacher name is found
		#addUserToService(sid,curteacher,line,0);

f=open("UNKNOWNTYPE.csv","w");
f.write((",".join(OrderedDict.fromkeys(UNKNOWNTYPE).keys())));
f.close();
print OrderedDict.fromkeys(UNKNOWNTYPE).keys()
#print(UNKNOWNPROGRESS[0].encode('utf-8'));
#print(SERVICEPROGRESS);
#print UNKNOWNTYPE;
#print UNKNOWNUSER;
cnx.commit();
cursor.close();
cnx.close();



