import urllib
import urllib2
import json
import googlemaps
from googlemaps.exceptions import ApiError, TransportError, Timeout, HTTPError
import json, ast


class Geocode:

    def __init__(self):
        self.country_code = 'QA'
        self.google_key = 'AIzaSyALibQM9Zy1TlI_88TgkyXw9je7jd2gjH4'

    def google_geocoding(self, location):
        """
        Using GoogleMaps api to geocode a location.
        :param location: text describing a location name
        :return: a location object with: formatted_address, lat, lng attributes
        """
        # TODO: Try to consider all location from the country_code.
        try:
            gmaps = googlemaps.Client(key=self.google_key)
            # Use components to make sure the first result is about Qatar.
            res = gmaps.geocode(location, components={'country': self.country_code})
            if not res or len(res) == 0:
                return [0,0]
            # Thanks to components, we can consider the first result only.
            #g_location = self._format_google_location(res[0])
            #return g_location


        except ApiError as e:
            print "problem with googlemap geocoding (ApiError):"
            print e
            return [0,0]
        except HTTPError as e:
            print "problem with googlemap geocoding (HTTPError): %s"+ e
            return [0,0]
        except Timeout as e:
            print "problem with googlemap geocoding (Timeout): %s"+ e
            return [0,0]
        except TransportError as e:
            print "problem with googlemap geocoding (TransportError): %s"+ e
            return [0,0]
        return [res[0][u'geometry'][u'location'][u'lat'], res[0][u'geometry'][u'location'][u'lng']]
        #return res[0]
        #r = ast.literal_eval(json.dumps(r))
        #return r

    def google_geocoding_from_scratch(self, location):
        basepath = 'https://maps.googleapis.com/maps/api/geocode/json?'
        params = urllib.urlencode({'address': location, 'components': {'country :' + self.country_code},
                                   'key': self.google_key})
        # print basepath+params
        obj = self.run_request(basepath + params)
        if 'results' not in obj.keys() or len(obj['results']) == 0:
            return None

        results = obj['results']
        # check if there's a result about our country code: Qatar
        indx = -1
        for i, result in enumerate(results):
            country = result['address_components'][-1]
            if country['short_name'] == self.country_code:
                indx = i
                break
        if indx == -1:
            return None
        print results[indx]

    @staticmethod
    def run_request(url, data=None, headers=None):
        """
        This is a general method to interact with any restful API implementation.
        :param url: The url should be prepared in advance with all it's parameters (key, options, etc.)
        :param data: the data to supply to the server, case of POST requests
        :param headers: If required.
        :return: A JSON object of the results. -- Make sure you request valid JSON from the API server.
        """
        if data and headers:
            request = urllib2.Request(url, data, headers)
        elif data:
            request = urllib2.Request(url, data)
        else:
            request = urllib2.Request(url)
        try:
            request_open = urllib2.urlopen(request)
            response = request_open.read()
            request_open.close()
            return json.loads(response)
        except urllib2.HTTPError as e:
            print '%s: %s - Needs to generate new tokens', e.code, e.reason
            return None


"""
if __name__ == "__main__":
    obj = Geocode()
    print obj.google_geocoding('Al Nafourah Garden')
    #string = obj.google_geocoding_from_scratch('west bay')
    #print string
"""