# -*- coding: utf-8 -*-
import mysql.connector;
import csv;
import codecs;
from collections import OrderedDict;
import re;
import time;


cnx=mysql.connector.connect(user='wholeren',password='piouqtpowjer123141235',host='50.163.243.196',database='wholeren',charset='utf8');

cursor=cnx.cursor();

def toInt(s):
	s=s.strip()
	try:
		i=int(s)
	except ValueError:
		i='NULL'
		#print 'not integer'+s;
	return i;
def toFloat(s):
	s=s.strip()
	try:
		i=float(s)
	except ValueError:
		i='NULL'
		#print 'not float'+s;
	return i;
updateContract=("UPDATE client set pinyin=%s where id=%s");
SelectSQL=("SELECT distinct contract.id from servicedetail inner join contract on contract.id=servicedetail.contract where servicedetail.cName=%s");
updateSQL=("UPDATE contract set previousSchool=%s,major=%s,gpa=%s,toefl=%s,sat=%s,gre=%s,gmat=%s where id=%s");
with open('gpa.csv','rb') as csvfile:
	filereader=csv.reader(csvfile,delimiter=',',quotechar='\"');
	for line in filereader:
		name=line[0].strip();
		originalSchool=line[1].strip();
		originalMajor=line[2].strip();
		gpa=toFloat(line[3]);
		toefl=toFloat(line[4]);
		sat=toFloat(line[5]);
		gre=toFloat(line[6]);
		gmat=toFloat(line[7]);
<<<<<<< HEAD
		#print "execute "+name;
		cursor.execute("SELECT distinct contract.id from servicedetail inner join contract on contract.id=servicedetail.contract where servicedetail.cName=\'"+name+"\'");
		print name;
		cids=cursor.fetchall();
		for row in cids:
			print "here";
=======
		print "execute "+name;
		cursor.execute("SELECT distinct contract.id from servicedetail inner join contract on contract.id=servicedetail.contract where servicedetail.cName=\'"+name+"\'");
		
		cids=cursor.fetchall();
		for row in cids:
>>>>>>> d8c53f1f09a543061ec44bd5709866a9fa6aa82a
			if row[0] is not None:
				print name;
				cid=row[0];
				#cursor.execute(updateSQL,(originalSchool,originalMajor,gpa,toefl,sat,gre,gmat,cid));
			else:
				print line;
				

cnx.commit();
cursor.close();
cnx.close();
