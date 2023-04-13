#!/usr/bin/python3


def print_subset_of_artists_w_name_alphabetical_order( j, character ):
	ARTISTS_NAME_LIST = []
	for track in j:
		name = track["name"]
		artists = ['_'.join(str(x) for x in track['artist'])][0]
		artists_name = '_'.join( [artists, name] )
		#print( artists_name )
		ARTISTS_NAME_LIST.append( artists_name )

	ARTISTS_NAME_LIST.sort()

	for an in ARTISTS_NAME_LIST:
		if( an.lower().startswith( character ) ):
			print( an )


def find_duplicates( j ):
	ARTISTS_NAME_LIST = []
	for track in j:
		name = track["name"].lower()
		artists = ['_'.join(str(x) for x in track['artist'])][0].lower()
		artists_name = '___'.join( [artists, name] )
		#print( artists_name )
		ARTISTS_NAME_LIST.append( artists_name )

	ARTISTS_NAME_LIST.sort()

	#for an in ARTISTS_NAME_LIST:
	#	print( an )

	DUPLICATE_DICTIONARY = {}

	for a_n in ARTISTS_NAME_LIST:
		if a_n not in DUPLICATE_DICTIONARY:
			DUPLICATE_DICTIONARY.update({a_n:1})
		else:
			value = DUPLICATE_DICTIONARY[ a_n ]
			DUPLICATE_DICTIONARY[ a_n ] = value + 1

	DUPLICATE_DICTIONARY_SORTED = dict(sorted( DUPLICATE_DICTIONARY.items(), key=lambda item: item[1], reverse=True))

	duplicate_counter = 0

	# keep track of all the key that has no duplicate
	# we will use this later to remove elmenets from the dictionary
	KEY_TO_DELETE = []
	for k, v in DUPLICATE_DICTIONARY_SORTED.items():
		if( v > 1):
			duplicate_counter = duplicate_counter + 1
		else:
			KEY_TO_DELETE.append( k )

	for k in KEY_TO_DELETE:
		del DUPLICATE_DICTIONARY_SORTED[k]

	print( "list contains {} duplicates".format( len(DUPLICATE_DICTIONARY_SORTED)))
	return DUPLICATE_DICTIONARY_SORTED

def sort_and_make_an_artist_statistics( j ):
	ARTIST_DICTIONARY = {}

	for track in j:
		artists = ['_'.join(str(x) for x in track['artist'])][0]
		#print( artists )

		if artists not in ARTIST_DICTIONARY:
			ARTIST_DICTIONARY.update({artists:1})
		else:
			#if we are here it means the artist is already there in the dictionary
			# we should incremente the index of the artist
			value = ARTIST_DICTIONARY[ artists ]
			ARTIST_DICTIONARY[ artists ] = value + 1


	ARTIST_DICTIONARY_SORTED = dict(sorted( ARTIST_DICTIONARY.items(), key=lambda item: item[1], reverse=True))
	#{k: v for k, v in sorted(ARTIST_DICTIONARY.items(), key=lambda item: item[1])}
	print( ARTIST_DICTIONARY_SORTED )

	for k, v in ARTIST_DICTIONARY_SORTED.items():
		print( k, v)


################################################################################


import json

try:
	fp = open("../myDatasets/20230403_LikedSongsDB.json", "r")
except:
	print("failed to open the Json file")
	exit()

j = json.load(fp)
NUM_TRACK = len(j)
print( "We have {} tracks inside the list".format(NUM_TRACK) )
print( j[0] )

#print_subset_of_artists_w_name_alphabetical_order( j, 'c' )
DUPLICATE_DICTIONARY_SORTED = find_duplicates( j )

ARTISTS_NAME_INDEXES = {}
for k, v in DUPLICATE_DICTIONARY_SORTED.items():
	artists = k.split('___')[0]
	name = k.split('___')[1]
	#print( "{} - {}".format(artists, name) )

	ARTISTS_NAME_INDEXES.update({k:[]})
	for index, obj in enumerate(j):
		#print( obj )

		track_name    = obj["name"].lower()
		track_artists = ['_'.join(str(x) for x in obj['artist'])][0].lower()
		if( track_name == name and track_artists == artists):
			#print( index )
			ARTISTS_NAME_INDEXES[k].append( index )

for a_n, dup_indexes in ARTISTS_NAME_INDEXES.items():
	print(a_n,dup_indexes)
	AT_LEAST_ONE_PRESERVED = False
	for i, value in enumerate(dup_indexes):
		if j[value]["preview_url"] == None and not(AT_LEAST_ONE_PRESERVED):
			print("deleting index {} in tracklist".format(value) )
			del j[value]
			AT_LEAST_ONE_PRESERVED = True
		if( i == (len(dup_indexes)-1) ):
			print("this is the last duplicate")
		print( "{} - {} - preview: {}".format(j[value]["artist"], j[value]["name"], j[value]["preview_url"]) )
