# -*- coding: utf-8 -*-
import mysql.connector;
import csv;
import codecs;
from collections import OrderedDict;
import re;
import time;
from pypinyin import pinyin,lazy_pinyin;
import pypinyin

cnx=mysql.connector.connect(user='wholeren',password='3000201S',host='localhost',database='wholeren',charset='utf8');
cursor=cnx.cursor();

updateClient=("UPDATE client set pinyin=%s where id=%s");


cursor.execute('select chineseName,id from client;');
aa=cursor.fetchall();
for row in aa:
	if row[0] is not None:
		p= pypinyin.slug(unicode(row[0]),style=pypinyin.NORMAL,separator='');
		
		cursor.execute("""UPDATE client SET pinyin=%s WHERE id=%s""",(p,row[1]));
		print p
		#print cursor.fetchOne();
cnx.commit();
cursor.close();
cnx.close();
