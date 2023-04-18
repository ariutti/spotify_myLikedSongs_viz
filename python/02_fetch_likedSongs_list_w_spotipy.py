#!/usr/bin/env python3

# a python sketch to fetch all my "liked Songs" from Spotify
# and save them in a JSON and CSV database

# before running this code you need to execute these lines in terminal
# export SPOTIPY_CLIENT_ID='replace with your Spotify Cliend ID'
# export SPOTIPY_CLIENT_SECRET='replace with your Spotify Client Secret'
# export SPOTIPY_REDIRECT_URI='replace with you redirect id (for example http://127.0.0.1:9090)'

import spotipy
from spotipy.oauth2 import SpotifyOAuth

import subprocess

scope = "user-library-read"

sp = spotipy.Spotify(auth_manager=SpotifyOAuth(scope=scope))


# create an array where to store all the 'track dictionaries'
# we are going to create
myTracks = []

# from the spotify website I see I have
# 1159 liked tracks =(approx) 20 * 58 so
LIMIT = 5
RANGE = 1

# for testing purposes
#LIMIT = 20
#RANGE = 5

# download track information a block of 'LIMIT' at a time
for i in range( RANGE ):
	offset = i * LIMIT

	# get all the saved tracks!!!
	results = sp.current_user_saved_tracks(limit=LIMIT, offset=offset) #here's where the magic happens!!!

	for idx, item in enumerate(results['items']):
		track = item['track']
		#print( "\n", track, "\n" )

		# in case the name of the track contains a comma', we should replace it
		# with another character in order for the csv we will create later
		# not to make error in parsing it
		name	= track['name'].replace(',','_')
		# get all the artists fo the song (yes sometimes we have more than one)
		artists	= [ track['artists'][i]['name'] for i in range( len(track['artists']) ) ]
		uri		= track['uri'].split(':')[2]
		preview = track['preview_url']

		print( idx+offset, ")", name, " - ", artists) #, "[", uri," - ", preview, "]")


		# get the audio features of the current track
		af = sp.audio_features( [uri] )

		#print(af)

		track_dict = af[0]
		# delete the unwanted associations
		del track_dict["type"]
		#del track_dict["id"]
		del track_dict["uri"]
		del track_dict["track_href"]
		#del track_dict["analysis_url"]

		# and also add the items you want
		track_dict.update({"name": name})
		track_dict.update({"artist": artists})
		track_dict.update({"preview_url": preview})
		#print( track_dict )

		# add this obj to the list
		myTracks.append( track_dict )


#print( myTracks )


#save the list of tracks inside a Json file
OUTPUT_FILE_NAME = "20230411_LikedSongsDB_pre"


# EXPORT JSON ******************************************************************
import json

OUTPUT_FILE_JSON = OUTPUT_FILE_NAME + ".json"

with open(OUTPUT_FILE_JSON, "w") as outfile:
	json.dump(myTracks, outfile)

# EXPORT CSV *******************************************************************
import csv

OUTPUT_FILE_CSV = OUTPUT_FILE_NAME + ".csv"

with open(OUTPUT_FILE_CSV, mode='w') as of:
	myCsv_writer = csv.writer(of, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)

	HEADER = ['id','name','artist','key','mode','tempo','time_signature','duration_ms','danceability','energy','loudness','speechiness','acousticness','instrumentalness','liveness','valence','analysis_url','preview_url']
	myCsv_writer.writerow( HEADER )

	for track in myTracks:
		row = []
		row.append( track['id'] )
		row.append( track['name'] )

		row.append( '_'.join(str(x) for x in track['artist']) )

		row.append( track['key'] )
		row.append( track['mode'] )
		row.append( track['tempo'] )
		row.append( track['time_signature'] )
		row.append( track['duration_ms'] )
		row.append( track['danceability'] )
		row.append( track['energy'] )
		row.append( track['loudness'] )
		row.append( track['speechiness'] )
		row.append( track['acousticness'] )
		row.append( track['instrumentalness'] )
		row.append( track['liveness'] )
		row.append( track['valence'] )
		row.append( track['analysis_url'] )
		row.append( track['preview_url'] )
		myCsv_writer.writerow( row )
