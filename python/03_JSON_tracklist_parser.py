#!/usr/bin/python3

import json

try:
	fp = open("myTracks.json", "r")
except:
	print("failed to open the Json file")
	exit()

j = json.load(fp)
NUM_TRACK = len(j)
print( "We have {} tracks inside the list".format(NUM_TRACK) )

for track in j:
	print(track['preview_url'])
