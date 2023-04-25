// SAVED SONG CLASS is a class where to store
// + information about the selected song;
// + a reference to the particle the song is related to
// + a referene to a DOM element which is its representation
class SavedSong {
	constructor( _index, _particleRef, _DOMparentRef, _func) {
		this.index = _index;
		this.particleRef  = _particleRef;
		this.DOMparentRef = _DOMparentRef;
		//this.SavedSongObjectsListRef = _SavedSongObjectsListRef;
		//this.SavedSongsCounterRef = _SavedSongsCounterRef;

		this.myFunc = _func;

		this.songInfo = this.particleRef.getSongInfo();
		this.song = null;

		//print( "saving song: ", songInfo );
		//SAVED_SONGS_JSON.push( songInfo );

		// Give a feedback to the web page appending a new row
		// to the saved songs table
		let newRow			= document.createElement("tr");
		newRow.setAttribute("id", this.songInfo["id"])

		let artistCol		= document.createElement("td");
		let titleCol		= document.createElement("td");
		titleCol.addEventListener("mouseover", (event) => this.onOverAction(event) );
		titleCol.addEventListener("mouseout", (event) => this.onOutAction(event) );


		let idCol				= document.createElement("td");
		let removeButton= document.createElement("button");
		removeButton.addEventListener("click", (event) => this.removeAction(event) );
		// append also a reference to this very object to the button
		removeButton.setAttribute("song_id", this.songInfo["id"] )


		artistCol.innerHTML = this.songInfo["artist"];
		titleCol.innerHTML  = this.songInfo["name"];
		idCol.innerHTML     = this.songInfo["id"];
		removeButton.innerHTML = "Remove";

		newRow.appendChild(artistCol);
		newRow.appendChild(titleCol);
		newRow.appendChild(idCol);
		newRow.appendChild(removeButton);

		this.DOMparentRef.appendChild( newRow );

	}

	onOverAction( _event ) {
		_event["target"].parentNode.setAttribute("style", "background-color: #aaaaaa");

		this.song = new Audio( this.songInfo.preview_url );
		//this.song.volume = 0.1;
		this.song.play();
		this.song.loop = true;
	}

	onOutAction( _event ) {
		_event["target"].parentNode.setAttribute("style", "background-color:#dddddd");
		if( this.song ) {
			this.song.pause();
			this.song = null;
		}
	}

	removeAction( _event ) {
		this.myFunc( _event )
	}

	// GETTERS ///////////////////////////////////////////////////////////////////
	getId() {
		return this.songInfo["id"]
	}
};
