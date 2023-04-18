#!/usr/bin/env python3

import spotipy
from spotipy.oauth2 import SpotifyOAuth
import subprocess

scope = "user-library-read"
sp = spotipy.Spotify(auth_manager=SpotifyOAuth(scope=scope))


LIMIT = 5
RANGE = 1


# download track information a block of 'LIMIT' at a time
for i in range( RANGE ):
	offset = i * LIMIT

	# get all the saved tracks!!!
	results = sp.current_user_saved_tracks(limit=LIMIT, offset=offset) #here's where the magic happens!!!

	#print(results)

	for idx, item in enumerate(results['items']):
		track = item['track']
		#print( "\n", track, "\n" )

		# in case the name of the track contains a comma', we should replace it
		# with another character in order for the csv we will create later
		# not to make error in parsing it
		name	= track['name'].replace(',','_')

		albumObj = track['album']
		release_year = albumObj['release_date'].split('-')[0]
		albumId = albumObj['id']
		albumImgUrl = albumObj['images'][-1]['url']
		print(release_year, albumId, albumImgUrl)

		# for each artist get:
		# + the name
		# + a list of his genres
		# + its img urs
		for a in track['artists']:
			aName = a['name']
			aID = a['id']
			aObj = sp.artist( aID )
			aImgUrl = aObj['images'][-1]['url']

			#print( artistObj )
			print( aName, [ g.replace(' ', '_') for g in aObj['genres'] ], aImgUrl)
