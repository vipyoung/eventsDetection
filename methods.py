import feedparser
from pymongo import MongoClient

client = MongoClient() #connect mongoclient to an instance of mogod
db = client.webevents #create a db test

#collections = db["sample"]



def get_events(url):
	"""
	Return list of events from the RSS url
	:param url: input rss url
	:return: list of events, each of which should have: title, summary, link, publication_date, categories/tags.
	"""

	# parse the url
	d = feedparser.parse(url)
	list_of_content = []
	for entry in d.entries:
		# Check the keys present in each event
		print entry.keys()
		# Assume all events have: title, summary, and link
		#list_of_content["title"]=entry['title']
		#list_of_content["summary"]=	entry['summary']
		#list_of_content["link"]=entry['link']
		title = entry['title']
		summary = entry['summary']
		link = entry['link']
		author=entry['author_detail']
		category = entry['tags']
		title_and_summary = {"title" :title, "summary" :summary, "url" :link,"author" :author,"category" :category}
		result = db.events.insert_one(title_and_summary)
		result.inserted_id
		list_of_content.append(title_and_summary)

	return list_of_content

if __name__ == "__main__":
	channel = 'http://www.eventsdoha.com/feed/'
	events = get_events(channel)
	for event in events:
		print 'Event:', event