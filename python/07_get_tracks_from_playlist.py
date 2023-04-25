#!/usr/bin/env python3
# ref: https://stackoverflow.com/questions/59441606/spotipy-how-do-i-get-songs-from-a-playlist-starting-at-a-given-index

PLAYLIST_ID = "6jz3zoIPh7yoHPIOQ9YsFt"
USER = "1191414926"



import spotipy
from spotipy.oauth2 import SpotifyOAuth
scope = "playlist-read-private"
sp = spotipy.Spotify(auth_manager=SpotifyOAuth(scope=scope))

#playlist = sp.playlist(PLAYLIST_ID)
#print( playlist )


def user_playlist_tracks_full(spotify, user, playlist_id=None, fields=None, market=None):
    """ Get full details of the tracks of a playlist owned by a user.
        Parameters:
            - spotify - spotipy instance
            - user - the id of the user
            - playlist_id - the id of the playlist
            - fields - which fields to return
            - market - an ISO 3166-1 alpha-2 country code.
    """

    # first run through also retrieves total no of songs in library
    response = spotify.user_playlist_tracks(user, playlist_id, fields=fields, limit=100, market=market)
    results = response["items"]

    # subsequently runs until it hits the user-defined limit or has read all songs in the library
    while len(results) < response["total"]:
        response = spotify.user_playlist_tracks(
            user, playlist_id, fields=fields, limit=100, offset=len(results), market=market
        )
        results.extend(response["items"])

    return results

r = user_playlist_tracks_full(sp, USER, PLAYLIST_ID)
print( len(r) )

for i, el in enumerate(r):
	print(i, el["name"] )
	print()
