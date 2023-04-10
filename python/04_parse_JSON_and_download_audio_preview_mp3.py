#!/usr/bin/python3

import json, subprocess, time

try:
	fp = open("myTracks.json", "r")
except:
	print("failed to open the Json file")
	exit()

j = json.load(fp)
NUM_TRACK = len(j)
print( "We have {} tracks inside the list".format(NUM_TRACK) )

PREVIEW_FOLDER = "./previews"
for i, track_obj in enumerate(j):

	# now we should download the audio preview of the track
	# rename it like the id of the track
	# and save it inside a specific folder.

	# every 30s MP3 weight approx 360KB
	# so 1152 MP3s will weight approw 405 MB

	#for i, track_obj in enumerate( myTracks ):
	name 		= track_obj['name']
	artists		= track_obj['artist']
	preview_url = track_obj["preview_url"]
	id 			= track_obj["id"]

	if( preview_url is not None):
		print( "Downloading '{}' preview".format(preview_url) )
		subprocess.run(["curl", preview_url, "--output", "{}/{}.mp3".format(PREVIEW_FOLDER, id)])
		#time.sleep(0.5)
