#!/usr/bin/env python3


TRACK_ID = "4xiyq1iRdsxuU1BPUJ490Z" # The Cure - close to me

import spotipy, time


from spotipy.oauth2 import SpotifyOAuth
scope = "user-library-read"
sp = spotipy.Spotify(auth_manager=SpotifyOAuth(scope=scope))


"""
from spotipy.oauth2 import SpotifyClientCredentials
auth_manager = SpotifyClientCredentials()
sp = spotipy.Spotify(auth_manager=auth_manager)
"""


country_codes = ['AD', 'AR', 'AU', 'AT', 'BE', 'BO', 'BR', 'BG', 'CA', 'CL', 'CO', 'CR', 'CY', 'CZ', 'DK', 'DO', 'EC', 'SV', 'EE', 'FI', 'FR', 'DE', 'GR', 'GT', 'HN', 'HK', 'HU', 'IS', 'ID', 'IE', 'IT', 'JP', 'LV', 'LI', 'LT', 'LU', 'MY', 'MT', 'MX', 'MC', 'NL', 'NZ', 'NI', 'NO', 'PA', 'PY', 'PE', 'PH', 'PL', 'PT', 'SG', 'ES', 'SK', 'SE', 'CH', 'TW', 'TR', 'GB', 'US', 'UY']

myTrack = sp.track(TRACK_ID, market=None )
preview_url = myTrack['preview_url']
print( preview_url)

for cc in country_codes:
	myTrack = sp.track(TRACK_ID, market=cc )

	#print( myTrack )
	name = myTrack['name']
	preview_url = myTrack['preview_url']

	if preview_url == None:
		print( "market {} - {} - preview is none".format(cc, name) )
	else:
		print( "market {} - {} - preview is: {}".format(cc, name, preview_url) )

	time.sleep(0.1)
