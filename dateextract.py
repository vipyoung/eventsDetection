__author__ = 'monisha'
import requests

from bs4 import BeautifulSoup
import feedparser

#import datefinder
from pymongo import MongoClient

client = MongoClient() #connect mongoclient to an instance of mogod
db = client.webevents #create a db test

#collections = db["sample"]

def get_events(url):
    urls= set()
    d = feedparser.parse(url)
    for entry in d.entries:
        # Check the keys present in each event
        print (entry)
        urls.add(entry)
    return urls


def trade_spider(url):
    info  =' '
    links = url
    #url="http://www.eventsdoha.com/white-salsa-night-a-farewell-to-dubraska-the-irish-harp-sheraton-garnd-17th-may/"
    source_code = requests.get(links)
    plain_text = source_code.text
    soup = BeautifulSoup(plain_text, "html.parser")
    for d in soup.find_all('p'):
        print (d.text)
        #info = str(div_tag.text)+str(div_tag.next_sibling)
        #print "hello"
        #info.append(d.text)
        info =info + d.text + "\n"
    details = {"information": info}
    #print "***********"
    results2 = db.eventinfor.insert_one(details)
    results2.inserted_id
        # for link in soup.find_all('p', ):
        #   href = link.get('href')
        #  print(href)
    return info

if __name__ == "__main__":
    channel = 'http://www.eventsdoha.com/feed/'
    events = set()
    events = get_events(channel)
    print (events)
    print ("**************")
   # Object[] array = events.toArray();

   # for (int i=0; i < array.length; i++)
    #    Object o = array[i];
     #   print (o)
    #for link in events:                 # loop not running for set  CHECK
      #  trade_spider(link)
 #   string_with_dates= information
  #  matches = datefinder.find_dates(string_with_dates)
   # for match in matches:
    #    print (match)









string_with_dates = "entries are due by January 4th, 2017 at 8:00pm created 01/15/2005 by ACME Inc. and associate"

import datefinder
matches = datefinder.find_dates(string_with_dates)
for match in matches:
     print (match)