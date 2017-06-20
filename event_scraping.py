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
        self.event_lst = []
        #self.event_dict['type'] = 'FeatureCollection'
        #self.event_dict['features'] = []
        self.db = 'webevents'
        self.db_connection = self.init_mongo()
        self.event_collection = self.db_connection[self.db]['events']
        self.eventinfor_collection = self.db_connection[self.db]['eventinfor']
        # creating object for the class
        self.geo = Geocode()
        # accessing the PYner server from QCRI
        self.tagger = ner.SocketNER(host='10.2.0.30', port=9190)

    def filter_in_qatar(self, geoloc_point, bbx):
        [lat, lng] = geoloc_point
        [min_lat, max_lat, min_lng, max_lng] = bbx

        if lat >= min_lat and lat <= max_lat and lng >= min_lng and lng <= max_lng:
            return True
        else:
            return False

    def init_mongo(self):
        connection = MongoClient('10.2.0.139', 27017)
        print 'connection succesful'
        # connect mongo client to an instance of mogod
        #client = MongoClient()
        # create a db test
        db = 'webevents'
        return connection

    def get_events_urls(self, url):
        # extracts all the urls of different events from the RSS feed.
        urls = set()
        category_list=[]
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
            tags = entry['tags']
            title_and_summary = {"title": title, "summary": summary, "url": link, "author": author, "category": tags}
            self.event_collection.insert_one(title_and_summary)
            list_of_content.append(title_and_summary)

            event_category = []
            for category in tags:
                category_temp = category['term']
                event_category.append(category_temp)

            for i in range(len(event_category)):
                temp = ((event_category[i]).encode("utf-8"))
                event_category[i] = temp

            category_list.append(event_category[0])

        for post in feed_content.entries:
            print post.title + ": " + post.link + " "
            urls.add(post.link)
        return urls,category_list

    def extracts_event_info(self, url, category):
        info = ''
        locations_ner = []
        event_locations =[]
        event= dict()
        date = ''
        print '----------------'
        print url
        # using beautifulsoup to extract data from each URL of the events
        source_code = requests.get(url)
        plain_text = source_code.text
        soup = BeautifulSoup(plain_text, "html.parser")

        # parsing through the information provided as a text and extracting them
        for geocoded_location in soup.find_all(
                        'p' and {lambda tag: tag.name == 'div' and tag.get('class') == ['post-inner']}):
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
        if entities.get('LOCATION') != None:
            location = entities.get('LOCATION')
            # location = self.clean_location(entities.get('LOCATION'))
            locations_ner.append(location)
        if entities.get('ORGANIZATION') != None:
            organization = entities.get('ORGANIZATION')
            # organization = self.clean_location(entities.get('ORGANIZATION'))
            locations_ner.append(organization)

        # TODO: double check
        cleaned_locations = []
        # remove the unicoded output of beautifulsoup
        for i in range(len(locations_ner)):
            for j in range(len(locations_ner[i])):
                cleaned_locations.append(locations_ner[i][j].encode("utf-8"))
        print cleaned_locations
        geocoded_location = []
        qatar_bbx = [25.1136, 25.5362, 50.9496, 51.2018]

        for i in range(len(cleaned_locations)):
            # print self.geo.google_geocoding(cleaned_locations[i])
            # storing in the different location and their geocodes in a dict
            #geocoded_location[cleaned_locations[i]] = self.geo.google_geocoding(cleaned_locations[i])
            geocoded_location = self.geo.google_geocoding(cleaned_locations[i])
            location_dict = dict()
            if self.filter_in_qatar(geocoded_location, qatar_bbx) == False:
                print geocoded_location
                location_dict['location_name'] = cleaned_locations[i]
                location_dict['latitude']= geocoded_location[0]
                location_dict['longitude'] = geocoded_location[1]
            event_locations.append(location_dict)
            print geocoded_location

            #geocoded_location.append(self.geo.google_geocoding(cleaned_locations[i]))

        # extracting the images of each event
        for image_tag in soup.findAll(lambda tag: tag.name == 'div' and tag.get('class') == ['single-post-thumb']):
            print image_tag.img['src']
            image = image_tag.img['src']

        for title_tag in soup.find_all('h1'):
            print title_tag.text
            head = title_tag.text

        # putting all the data obtained in a json format
        details = {"information": info, "date": date, "location": geocoded_location, "image": image}

        # inserting it in MongoDB
        self.eventinfor_collection.insert_one(details)

        # filter coordinatess if it is inside qatar
        event["title"] =  head
        event["information"]= info
        event["date"]= date
        event["location"]=event_locations
        event["image"]= image
        event["link"] = url
        event["category"]= category
        #feature = Feature(geometry=Point((place_geoloc[0], place_geoloc[1])),properties={"title": head, "information": info, "date": date, "image": image,link": url, "category": category})
        #self.event_lst.append(feature)
        print '***********'

        # feature = {}
        # feature['type'] = 'Feature'
        # feature['geometry'] = {}
        # feature['geometry']['type'] = 'Point'
        # feature['geometry']['coordinates'] = geocoded_location
        # feature['properties'] = {"title": head, "information": info, "date": date, "image": image}


        return event

    def extract_event_info(self, url, category):
        info = ''
        locations = []
        date = ''
        print '----------------'
        print url
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
            location = entities.get('LOCATION')
            #location = self.clean_location(entities.get('LOCATION'))
            locations.append(location)
        if entities.get('ORGANIZATION')!= None:
            organization = entities.get('ORGANIZATION')
            #organization = self.clean_location(entities.get('ORGANIZATION'))
            locations.append(organization)

        # TODO: double check
        cleaned_locations = []
        # remove the unicoded output of beautifulsoup
        for i in range(len(locations)):
            for j in range(len(locations[i])):
                cleaned_locations.append(locations[i][j].encode("utf-8"))
        print cleaned_locations
        geocoded_location = []

        for i in range(len(cleaned_locations)):
            #print self.geo.google_geocoding(cleaned_locations[i])
            # storing in the different location and their geocodes in a dict
            #geocoded_location[cleaned_locations[i]] = self.geo.google_geocoding(cleaned_locations[i])


            geocoded_location.append(self.geo.google_geocoding(cleaned_locations[i]))

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
        qatar_bbx = [25.1136,25.5362,50.9496,51.2018]
        self.eventinfor_collection.insert_one(details)

        try:
            for place_geoloc in geocoded_location:
                if place_geoloc != [0,0]:
                    # filter coordinatess if it is inside qatar
                    if self.filter_in_qatar( place_geoloc, qatar_bbx) == False:
                        print place_geoloc
                        #event ={"title": head, "information": info, "date": date,"location":  "image": image, "link" :url ,"category": category} }
                        feature = Feature(geometry=Point((place_geoloc[0], place_geoloc[1])), properties=  {"title": head, "information": info, "date": date, "image": image, "link" :url ,"category": category})
                        self.event_lst.append(feature)
                        print '***********'
                    else:
                        pass
        except Exception as e:
            print e
            pass

        #feature = {}
        #feature['type'] = 'Feature'
        #feature['geometry'] = {}
        #feature['geometry']['type'] = 'Point'
        #feature['geometry']['coordinates'] = geocoded_location
        #feature['properties'] = {"title": head, "information": info, "date": date, "image": image}


        return self.event_lst

    """

    def clean_location(self, location_set):
        clean_location = set()
        for j in range(len(location_set)):
            clean_location[j] = location_set[j].encode("utf-8")
        return clean_location
    """
    def export_json(self, event_dict):
        #geojson_data = FeatureCollection(lst_features)
        with open('events.json', 'w') as f:
            json.dump(event_dict, codecs.getwriter('utf-8')(f), ensure_ascii=False)

if __name__ == "__main__":
    event_scraper = EventScarper()

    # collecting the different urls of events
    events, category_list = event_scraper.get_events_urls(event_scraper.events_doha_link)
    print events
    features = []
    events_new = list(events)
    print category_list
    # while(i<len(categorr)):
    main_events = []
    for i in range(len(events_new)):
        event_dict = event_scraper.extracts_event_info(events_new[i], category_list[i])
        main_events.append(event_dict)
    #features = event_scraper.event_lst

    event_scraper.export_json(main_events)