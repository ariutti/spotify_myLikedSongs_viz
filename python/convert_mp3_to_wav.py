#!/usr/bin/env python3

import os, zipfile, subprocess

MY_PATH       = "/home/nicola/Documenti/progetto_spotify_API/previews/"
OUTPUT_FOLDER = "/home/nicola/Documenti/progetto_spotify_API/previews/WAV"

# a function to enter a folder and examine its contents.
# This function can be called recursively
def enterFolderAndExamine( folder ):
	os.chdir( folder )
	print( "Entering folder {}".format(os.getcwd()) )
	FILE_LIST = [f for f in os.scandir( os.getcwd()) if ( f.is_file() ) and f.name.lower().endswith(".mp3") ]

	for f in FILE_LIST:
		#subprocess.run(["ffmpeg", "-i", f.name, "-acodec", "mp3", "-ab", "192k", str(f.name[:-4])+".mp3"])
		subprocess.run(["ffmpeg", "-i", f.name, "{}/{}.wav".format(OUTPUT_FOLDER, str(f.name[:-4]) ) ])

# MAIN #########################################################################
if __name__ == "__main__":
	enterFolderAndExamine( MY_PATH )
