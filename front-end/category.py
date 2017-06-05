import requests
import feedparser

def get_events(url):
    urls= set() #extracts all the urls of different events from the RSS feed.
    list_of_content =[] #collection of all the different contents
    d = feedparser.parse(url) #parsing through RSS feed
    for entry in d.entries:  #extracts info available in RSS feed
        category = entry['tags']
    for i, term in enumerate(d['term'] for d in category):
        print i, term


get_events('http://www.eventsdoha.com/feed/')
