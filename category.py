import feedparser


def get_events(url):
    cate =[]

    urls= set() #extracts all the urls of different events from the RSS feed.
    list_of_content =[] #collection of all the different contents
    d = feedparser.parse(url) #parsing through RSS feed
    for entry in d.entries:  #extracts info available in RSS feed

        category = entry['tags']
        print category

        taggg=[]
        for item in range(len(category)):
            cate=[]
            results = [item['term'] for item in category]
            print results
            print'*******'

        for i in range (len(results)):
            results= results[i].encode("utf-8")
        print re
        cate.append(results[0])
        print cate


get_events('http://www.eventsdoha.com/feed/')
