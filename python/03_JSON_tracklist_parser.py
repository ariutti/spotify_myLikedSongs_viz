#!/usr/bin/python3

import json

try:
	fp = open("../myDatasets/20230403_LikedSongsDB.json", "r")
except:
	print("failed to open the Json file")
	exit()

j = json.load(fp)
NUM_TRACK = len(j)
print( "We have {} tracks inside the list".format(NUM_TRACK) )


ARTIST_DICTIONARY = {}

for track in j:
	print( track["preview_url"] )
