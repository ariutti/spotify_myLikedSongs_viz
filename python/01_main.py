#!/usr/bin/env python3
#ref: https://stmorse.github.io/journal/spotify-api.html

import requests

CLIENT_ID     = 'myClientID'
CLIENT_SECRET = 'mySuperSecretkey'


AUTH_URL = 'https://accounts.spotify.com/api/token'

# POST
auth_response = requests.post(AUTH_URL, {
    'grant_type': 'client_credentials',
	#'grant_type': 'authorization_code',
    'client_id': CLIENT_ID,
    'client_secret': CLIENT_SECRET,
})

# convert the response to JSON
auth_response_data = auth_response.json()

# save the access token
access_token = auth_response_data['access_token']
#print( access_token )



headers = {
    'Authorization': 'Bearer {token}'.format(token=access_token)
}

# check some info of a specific track: https://open.spotify.com/track/7lNltzNCgEKUF6hJI7smRW?si=af0608cd7906466c

# base URL of all Spotify API endpoints
BASE_URL = 'https://api.spotify.com/v1/'

# Track ID from the URI
track_id = '7lNltzNCgEKUF6hJI7smRW'

# actual GET request with proper header
r = requests.get(BASE_URL + 'audio-features/' + track_id, headers=headers)
r = r.json()
print(r)

# Json data meanings:
# https://developer.spotify.com/documentation/web-api/reference/#/operations/get-audio-features
# https://developer.spotify.com/documentation/web-api/reference/get-audio-analysis


"""
# Track ID from the URI
track_id = '7lNltzNCgEKUF6hJI7smRW'
r = requests.get(BASE_URL + "audio-analysis/" + track_id, headers=headers)
r = r.json()
print(r)
"""

"""
# doesn't work
# ref: https://developer.spotify.com/documentation/web-api/reference/#/operations/get-users-saved-tracks
r = requests.get(BASE_URL + 'me/tracks/', headers=headers)
r = r.json()
print(r)
"""
