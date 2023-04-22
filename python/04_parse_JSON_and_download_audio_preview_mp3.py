#!/usr/bin/python3

import json, subprocess, time

DATABASE_FOLDER = "../myDatasets"
PREVIEW_FOLDER = "../previews"

try:
	fp = open("{}/20230403_LikedSongsDB.json".format(DATABASE_FOLDER), "r")
except:
	print("failed to open the Json file")
	exit()

j = json.load(fp)
NUM_TRACK = len(j)
print( "We have {} tracks inside the list".format(NUM_TRACK) )


from os.path import exists

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
		# add here a check to see if we already have downloaded the mp3 preview
		# don't need to download it againg if we already have it
		if exists("{}/{}.mp3".format(PREVIEW_FOLDER, id) ):
			print("the preview file already exhist, trying with the next...")
			continue


		print( "Downloading '{}' preview".format(preview_url) )
		subprocess.run(["curl", preview_url, "--output", "{}/{}.mp3".format(PREVIEW_FOLDER, id)])
		#time.sleep(0.5)
