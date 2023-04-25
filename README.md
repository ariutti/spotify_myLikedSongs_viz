# README

Still a work in progress. This readme will be fixed in later releases.

## preprocessing - python3

We are goning to use python to first get information from your spotify account using the spotify API, via
the useful 'spotipy' python-wrapper:

1. First: install 'spotipy' with the command `pip install spotipy --upgrade`;
2. use python to retrieve your "loved songs" (script `02_fetch_likedSongs_list_w_spotipy.py`);
3. once you have a Json file with all your loved songs inside, you can aim it in your javascript in order for the code to create the corresponding visualization. To do that modify the JS code and, inside this root folder, evaluate the command `http-server`;
4. Select songs from the web interface and click `save selection` button. You will be prompted to save the Json somewhere;
5. now use python script `08_spotdl_get_a_track.py` to download the tracks;
