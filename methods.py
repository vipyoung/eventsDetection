import feedparser
from dateutil import parser


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
		title = entry['title']
		summary = entry['summary']
		link = entry['link']
		title_and_summary = {"title" :title, "summary" :summary, "url" :link}
		list_of_content.append(title_and_summary)
	return list_of_content

if __name__ == "__main__":
	channel = 'http://www.eventsdoha.com/feed/'
	events = get_events(channel)
	for event in events:
		print 'Event:', event