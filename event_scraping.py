import requests
import datefinder
from bs4 import BeautifulSoup
import feedparser
import ner
import re
from geocode import *
import json,codecs
from pymongo import MongoClient


class EventScarper:

    def __init__(self):
        # RSS feed of EventsDoha Website
        self.events_doha_link = 'http://www.eventsdoha.com/feed/'
        self.event_dict = {}
        self.event_dict['type'] = 'FeatureCollection'
        self.event_dict['features'] = []
        self.db = self.init_mongo()
        # creating object for the class
        self.geo = Geocode()
        # accessing the PYner server from QCRI
        self.tagger = ner.SocketNER(host='10.2.0.30', port=9190)

    def init_mongo(self):
        # connect mongo client to an instance of mogod
        client = MongoClient()
        # create a db test
        db = client.webevents
        return db

    def get_events_urls(self, url):
        # extracts all the urls of different events from the RSS feed.
        urls = set()
        # collection of all the different contents
        list_of_content = []
        # parsing through RSS feed
        feed_content = feedparser.parse(url)
        # extracts info available in RSS feed
        for entry in feed_content.entries:
            title = entry['title']
            summary = entry['summary']
            link = entry['link']
            author = entry['author_detail']
            category = entry['tags']
            title_and_summary = {"title": title, "summary": summary, "url": link, "author": author, "category": category}
            self.db.events.insert_one(title_and_summary)
            list_of_content.append(title_and_summary)

        for post in feed_content.entries:
            print post.title + ": " + post.link + " "
            urls.add(post.link)
        return urls

    def extract_event_info(self, url):
        info = ''
        locations = []
        date = ''

        # using beautifulsoup to extract data from each URL of the events
        source_code = requests.get(url)
        plain_text = source_code.text
        soup = BeautifulSoup(plain_text, "html.parser")

        # parsing through the information provided as a text and extracting them
        for geocoded_location in soup.find_all('p' and {lambda tag: tag.name == 'div' and tag.get('class') == ['post-inner']}):
            # extracting date from the given text using datefinder
            string_with_dates = geocoded_location.text
            dates = datefinder.find_dates(string_with_dates)
            for date_string in dates:
                # collecting all the date found in the text
                date = date + ' ' + str(date_string)
            # extracting all the text info
            info = info + geocoded_location.text + '\n'

        # TODO: find alternative
        clean_info = info.replace('\n', '     ')
        # remove all the special characters so the location can be processed
        clean_info = re.sub('[^A-Za-z0-9]+', ' ', clean_info)

        # location extractor
        entities = self.tagger.get_entities(clean_info)
        # info obtained from pyner both locations and organizations are considered
        if entities.get('LOCATION')!= None:
            location = self.clean_location(entities.get('LOCATION'))
            locations.append(location)
        if entities.get('ORGANIZATION')!= None:
            organization = self.clean_location(entities.get('ORGANIZATION'))
            locations.append(organization)

        """
        # TODO: double check
        cleaned_locations = []
        # remove the unicoded output of beautifulsoup
        for i in range(len(locations)):
            for j in range(len(locations[i])):
                cleaned_locations.append(locations[i][j].encode("utf-8"))
        print cleaned_locations
        """

        geocoded_location = {}
        for i in range(len(locations)):
            location = self.geo.google_geocoding(locations[i])
            print self.geo.google_geocoding(locations[i])
            # storing in the different location and their geocodes in a dict
            geocoded_location[locations[i]] = location

        # extracting the images of each event
        for image_tag in soup.findAll(lambda tag: tag.name == 'div' and tag.get('class') == ['single-post-thumb']):
            print image_tag.img['src']
            image = image_tag.img['src']

        for title_tag in soup.find_all('h1'):
            print title_tag.text
            head = title_tag.text

        # putting all the data obtained in a json format
        details = {"information": info, "date": date, "location": geocoded_location , "image": image}

        # inserting it in MongoDB
        self.db.eventinfor.insert_one(details)

        feature = {}
        feature['event'] = {"title": head, "information": info, "date": date, "location": geocoded_location, "image": image}
        self.event_dict['features'].append(feature)
        return self.event_dict

    def clean_location(self, location_set):
        clean_location = set()
        for j in range(len(location_set)):
            clean_location[j] = location_set[j].encode("utf-8")
        return clean_location

    def export_json(self, information):
        with open('events.json', 'w') as f:
            json.dump(information, codecs.getwriter('utf-8')(f), ensure_ascii=False)

if __name__ == "__main__":
    event_scraper = EventScarper()

    # collecting the different urls of events
    events = event_scraper.get_events_urls(event_scraper.events_doha_link)
    for link in events:
        information = event_scraper.extract_event_info(link)
    event_scraper.export_json(information)