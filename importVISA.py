# -*- coding: utf-8 -*-
import mysql.connector;
import csv;
import codecs;
from collections import OrderedDict;
import re;
import time;


cnx=mysql.connector.connect(user='wholeren',password='piouqtpowjer123141235',host='localhost',database='wholeren',charset='utf8');
cursor=cnx.cursor();

add_servicedetail=("INSERT INTO servicedetail (user,realServiceType,serviceProgress,indate,link,contractKey,cname,namekey) VALUES (16,6,%s,%s,NULL,NULL,%s,NULL)")
add_visainfo=("INSERT INTO visainfo (serviceDetail,visaProgress,Result,ResultComment,endDate,secondDate,secondResult,secondResultComment,thirdDate,thirdResult,id,createdAt,updatedAt) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,NULL,NOW(),NOW())")
SERVICEPROGRESS={};
UNKNOWNPROGRESS=[];
cursor.execute('select serviceProgress,id from serviceprogress;');
for row in cursor:
	#print unicode(row[0]).encode('utf-8');
	SERVICEPROGRESS[unicode(row[0]).encode('utf-8')]=row[1];


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

with open('visa.csv','rb') as csvfile:
	filereader=csv.reader(csvfile,delimiter=',',quotechar='\"');
	for line in filereader:
		name=line[1].strip();
		stype=line[2].strip();
		user=line[3].strip();
		startdate=convertDate(line[4].strip());
		serviceProgress=line[5].strip();
		if "1.0" in serviceProgress:
			print "found progress ";
			serviceProgress=2;
		elif "2.0" in serviceProgress:
			print "found progress ";
			serviceProgress=5;
		else:
			print "progress not found:"+serviceProgress;
			UNKNOWNPROGRESS+=[serviceProgress];
			continue;

		vprogress=line[7].strip();
		fResult=line[8].strip();
		fDate=convertDate(line[9].strip());
		fComment=line[10].strip();
		sDate=convertDate(line[11].strip());
		sResult=line[12].strip();
		sComment=line[13].strip();
		tDate=convertDate(line[14].strip());
		tResult=line[15].strip();
		print "execute "+name;
		cursor.execute(add_servicedetail,(serviceProgress,startdate,name));
		sid=cursor.lastrowid;
		if sid is not None:
			print sid;
			cursor.execute(add_visainfo,(sid,vprogress,fResult,fComment,fDate,sDate,sResult,sComment,tDate,tResult));
		else:
			print line;
				

cnx.commit();
cursor.close();
cnx.close();