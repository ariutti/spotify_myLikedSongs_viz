#!/usr/bin/env python3

# a python sketch to fetch all my "liked Songs" from Spotify
# and save them in a JSON and CSV database

# before running this code you need to execute these lines in terminal
# export SPOTIPY_CLIENT_ID='replace with your Spotify Cliend ID'
# export SPOTIPY_CLIENT_SECRET='replace with your Spotify Client Secret'
# export SPOTIPY_REDIRECT_URI='replace with you redirect id (for example http://127.0.0.1:9090)'

import spotipy
from spotipy.oauth2 import SpotifyOAuth
scope = "user-library-read"
sp = spotipy.Spotify(auth_manager=SpotifyOAuth(scope=scope))


import subprocess, math
# create an array where to store all the 'track dictionaries'
# we are going to create
myTracks = []

# from the spotify website I see I have
# 1159 liked tracks =(approx) 20 * 58 so
NUM_LIKED_SONGS = 1262
LIMIT = 20
RANGE = math.ceil( NUM_LIKED_SONGS / LIMIT )

# for testing purposes
#LIMIT = 20
#RANGE = 5

# a function expecting the track's artist object
def getGenreFromArtist( artist ):
	aName = a['name']
	aID = a['id']
	aObj = sp.artist( aID )
	# in case we need also the artist image we can get it
	#aImgUrl = aObj['images'][-1]['url']
	#genres = [ g.replace(' ', '-') for g in aObj['genres'] ]
	genres = [ g for g in aObj['genres'] ]
	return genres


NUM_FAILED_PREVIEWS = 0


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

		uri		= track['uri'].split(':')[2]
		preview = track['preview_url']
		if preview == None:
			NUM_FAILED_PREVIEWS = NUM_FAILED_PREVIEWS + 1



		# we want also to save the name of the album the track is taken from
		# and modify it a little bit in order not to make a mess with the CSV export:
		# + converting it to lowercase;
		# + replacing commas with undescores;
		# + replacing all whitespaces with undescores;
		albumObj = track['album']
		albumName = albumObj['name'].lower().replace(',','_').replace(' ','_')
		# we also want to save the pubblication date of the album
		albumReleaseYear = albumObj['release_date'].split('-')[0]

		# in case we also want the Album ID or the Album image we can do this.
		#albumId = albumObj['id']
		#albumImgUrl = albumObj['images'][-1]['url']



		# get all the artists for the song (yes sometimes we have more than one)
		artists	= [ track['artists'][i]['name'] for i in range( len(track['artists']) ) ]

		genres = []
		for a in track['artists']:
			genres = genres + getGenreFromArtist( a )
		# TODO: improvements
		# don't know if but now, genres array could contain duplicates (especially
		# if track has more than one artist and artsts are, somewhat correllated)
		# Find a way to epurate this genres array from duplicates


		print("{}) track name: {}\nartist(s) - {}:{}\nalbum:{}({})\ngenres:{}\n".format(idx+offset, name,len(track['artists']), artists,albumName,albumReleaseYear, genres))

		#https://open.spotify.com/track/50f0mt35cIwwu3Krk7nS7b?si=1fe19624930c4850

		# get the audio features of the current track
		af = sp.audio_features( [uri] )
		#print(af)

		track_dict = af[0]
		# delete the unwanted associations
		del track_dict["type"]
		#del track_dict["id"]
		#del track_dict["uri"] # preserver uri in order to use later with spotdl
		del track_dict["track_href"]
		#del track_dict["analysis_url"]

		# and also add the items you want
		track_dict.update({"name": name})
		track_dict.update({"artist": artists})
		track_dict.update({"album":albumName})
		track_dict.update({"genres":genres})
		track_dict.update({"release_year":albumReleaseYear})
		track_dict.update({"preview_url": preview})
		#print( track_dict )

		# add this obj to the list
		myTracks.append( track_dict )


#print( myTracks )


#save the list of tracks inside a Json file
OUTPUT_FILE_NAME = "20230424_LikedSongsDB"
print( "{} over {} have a null preview ({}%)".format(NUM_FAILED_PREVIEWS,NUM_LIKED_SONGS, math.ceil((NUM_FAILED_PREVIEWS*100)/NUM_LIKED_SONGS) ) )


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

	HEADER = ['id','name','artist','album','release_year','genres','key','mode','tempo','time_signature','duration_ms','danceability','energy','loudness','speechiness','acousticness','instrumentalness','liveness','valence','analysis_url','preview_url']
	myCsv_writer.writerow( HEADER )

	for track in myTracks:
		row = []
		row.append( track['id'] )
		row.append( track['name'] )

		# using a pipe to separate artists
		row.append( '|'.join(str(x) for x in track['artist']) )

		row.append( track['album'] )
		row.append( track['release_year'] )
		# I'm using a pipe to separate genres for the same track
		row.append( '|'.join(str(x) for x in track['genres']) )

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
