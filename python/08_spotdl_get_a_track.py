#!/usr/bin/env python3

# use spotdl to download all the tracks given a "selected song" json
# This sketch has been tought to be used after a selection made by
# using the web loved song selection toolkit

#https://open.spotify.com/track/4TrCvd1PrqI14lZb7tEtYo


import json, subprocess, time

JSON_SOURCE_FILENAME = "04_mySavedPlaylist.json"

try:
	fp = open("../mySavedPlaylists/{}".format(JSON_SOURCE_FILENAME), "r")
except:
	print("failed to open the Json file")
	exit()

j = json.load(fp)
NUM_TRACK = len(j)
print( "We have {} tracks inside the list".format(NUM_TRACK) )

for track in j:
	print( track["uri"] )
	# build URL from URI
	URL = "https://open.spotify.com/track/{}".format( track["id"] )
	print( URL )
	# now use spotdl to download the track
	subprocess.run(["spotdl", "--ignore-ffmpeg-version", "-p", '../spotdl_downloads/{artist} - {title}.{ext}', URL])
