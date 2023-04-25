// for debugging purposes
let NUM_PARTICLE_TO_BE_CONSIDERED = 300;
//let PARTICLE_SUBSET;


// don't touch here below ******************************************************
let particles = [];
//let sampleLoadedCounter = 0;
//let TMP_SONG_LOADED = false;
let LOAD_LOCAL_MP3 = false;
let NUM_VALID_PREVIEWS = 0;
//let ALL_SONGS_LOADED = true;
let axis = [];
let jsonDB;
let JSON_LOADED = false;

let COLOR_FROM;
let COLOR_TO;

let loadingBar;
let particleLookingForPlace;

let SAVED_SONGS_JSON = []
let SAVED_SONGS_OBJECTS = [] // a place where we collect SavedSongs instances
// a ref to a specific DOM element where to list all the saver tracks
let SAVED_SONGS_TABLE
let SAVE_SELECTION_BUTTON

//let INFO_BOX

// PHYSICS STUFF ***************************************************************
let EVERYTHING_ON_ITS_RIGHT_PLACE = false;


// PRELOAD /////////////////////////////////////////////////////////////////////
function preload() {
	//jsonDB = loadJSON("./myDatasets/20230424_LikedSongsDB.json", function() {
  jsonDB = loadJSON("./myDatasets/20230403_LikedSongsDB.json", function() {
    print("JSON data base loaded");
    JSON_LOADED = true;
  });
}




// SETUP ///////////////////////////////////////////////////////////////////////
function setup() {
	print( "setup")
	// Found a way to place the cnavas in a specific position inside the HTML
	// ref: https://stackoverflow.com/questions/67423267/how-to-use-div-appendchildcanvas-in-p5js
	const canvas = createCanvas(1200, 800);
  canvas.parent("canvas_goes_here");
  canvas.style("display", "block");


	//smooth()

  // some graphics stuff
  COLOR_FROM = color(81, 127, 255);
  COLOR_TO = color(255, 114, 48);

  // we have to take care of the AudioContext an make it work only if necessary
  getAudioContext().suspend();

  while( !JSON_LOADED ) {
    print("waiting for the JSON DB to be loaded;")
  }

  // convert json to array
  let songList = Object.values(jsonDB);
  print( "There are ", songList.length, " songs inside the database");

  // we also need to find some interesting value like
  let min_x =  9999;
  let max_x = -9999;
  let range_x = 0;
  let min_y =  9999;
  let max_y = -9999;
  let range_y = 0;
  // maybe later we should use also come other scale
  // with its min an max values. Like for the color, and the radius
  let min_w =  9999;
  let max_w = -9999;
  let range_w = 0;
  let min_z =  9999;
  let max_z = -9999;
  let range_z = 0;

  for(let i=0; i<songList.length;i++) {
  //for(let i=0; i<NUM_PARTICLE_TO_BE_CONSIDERED;i++) {
    let tempo = songList[i]["tempo"];
    let danceability = songList[i]["danceability"];
    let energy = songList[i]["energy"];
    let valence = songList[i]["valence"];

    // using BPM as x-axis
    if( tempo > max_x ) max_x = tempo;
    if( tempo < min_x ) min_x = tempo;
    // using danceability as y-axis
    if( danceability > max_y ) max_y = danceability;
    if( danceability < min_y ) min_y = danceability;
    // using energy as a dimension scale
    if( energy > max_w ) max_w = energy;
    if( energy < min_w ) min_w = energy;
    // using valence as color scale
    if( valence > max_z ) max_z = valence;
    if( valence < min_z ) min_z = valence;
  }

  axis.push( new Axis("x_tempo", min_x, max_x, 30.0, width*0.8) );
  axis.push( new Axis("y_dance", min_y, max_y, 30.0, height*0.8) );
  axis.push( new Axis("w_energy", min_w, max_w, 2, 10) );
  axis.push( new Axis("z_valence", min_z, max_z, 0.0, 1.0) );

  // now its time to create all the particles

  for(let i=0; i<songList.length;i++) {
  //for(let i=0; i<NUM_PARTICLE_TO_BE_CONSIDERED;i++) {

    // retrieve the song informations
    let id = songList[i]["id"]
    let tempo = songList[i]["tempo"];
    let danceability = songList[i]["danceability"];
    let energy = songList[i]["energy"];
    let valence = songList[i]["valence"];


    // now let's do some scaling and mapping
    let x = axis[0].getConverted( tempo );
    let y = axis[1].getConverted( danceability );
    let r = axis[2].getConverted( energy );
    let c = axis[3].getConverted( valence );



    particles.push( new Particle(id,
      x,y,r,c,
      songList[i]
    ));
    if( songList[i]["preview_url"] != null ) {
      NUM_VALID_PREVIEWS ++;
    }
  }

  print( "We have ", particles.length, " songs but with ", NUM_VALID_PREVIEWS," valid preview" );

  let e = select('#num_songs');
  e.elt.textContent = particles.length ;
  e = select('#num_failed_previews');
  e.elt.textContent = particles.length-NUM_VALID_PREVIEWS;
	e = select('#num_failed_previews_percentage');
  e.elt.textContent = Math.round( ((particles.length-NUM_VALID_PREVIEWS) * 100 ) / particles.length );

  loadingBar = new LoadingBar(
    width*0.5,
    height*0.5,
    200,
    20,
    particles.length
  );

  // font stuff
  textSize(24);
  textAlign(CENTER, CENTER);

  // INFO BOX stuff
  //infoBox = new InfoBox(width*0.05, height*0.1, 200, 50);
	INFO_BOX = document.getElementById("song_info_box");
	INFO_BOX.setAttribute("style", "display:none");

	// FILTER BOX
	filterBox = new FilterBox( 20, 400, 100, 100, axis[0], axis[1], axis[2], axis[3]);


	SAVED_SONGS_TABLE = document.getElementById("saved_songs_table");
	SAVE_SELECTION_BUTTON = document.getElementById("save_selection_button");
	SAVE_SELECTION_BUTTON.addEventListener("click", save_my_track_selection );
	SAVE_SELECTION_BUTTON.disabled = true;


} // end of SETUP


// DRAW ////////////////////////////////////////////////////////////////////////
function draw() {

  background(255);
  // draw axis
  axis[0].displayHorizontal( 30.0, 1);
  axis[1].displayVertical( 30.0, 1);

  computeSeparation();
  loadingBar.setCounter( particles.length- particleLookingForPlace );


  for(let i=0; i<particles.length; i++) {
    particles[i].display();
  }


  if( !EVERYTHING_ON_ITS_RIGHT_PLACE ) {
    push()
    noStroke()
    fill(120, 200)
    rect(0,0,width, height);
    pop()


    loadingBar.display();
    return;
  }

	filterBox.updateFilters();



  for(let i=0; i<particles.length; i++) {
		// check if mouse inside only if particle is visible
		if( particles[i].visible ) {
	    particles[i].checkIfInside( mouseX, mouseY );
	    particles[i].playSongIfInside();
		}
  }


  for(let i=0; i<particles.length; i++) {
    particles[i].display();
  }

  // once we have drawn the particles, we can show the text
  for(let i=0; i<particles.length; i++) {
		//particles[i].showText( infoBox );
		particles[i].showText( INFO_BOX );
  }

	//filterBox.display();

} //end of DRAW

// Filter functions ************************************************************
function filterByValence( _min, _max) {
	for(let i=0; i<particles.length; i++) {
    let value = particles[i].getValence();
		if( value < _min || value > _max) {
			particles[i].filteredByValence = true ;
		}
  }
}

function filterByEnergy( _min, _max) {
	for(let i=0; i<particles.length; i++) {
    let value = particles[i].getEnergy();
		if( value < _min || value > _max) {
			particles[i].filteredByEnergy = true ;
		}
  }
}

function filterByDanceability( _min, _max) {
	for(let i=0; i<particles.length; i++) {
    let value = particles[i].getDanceability();
		if( value < _min || value > _max) {
			particles[i].filteredByDanceability = true ;
		}
  }
}

function filterByTempo( _min, _max) {
	for(let i=0; i<particles.length; i++) {
    let value = particles[i].getTempo();
		if( value < _min || value > _max) {
			particles[i].filteredByTempo = true ;
		}
  }
}

function resetFilterValence() {
	for(let i=0; i<particles.length; i++) {
		particles[i].filteredByValence = false ;
  }
}

function resetFilterEnergy() {
	for(let i=0; i<particles.length; i++) {
		particles[i].filteredByEnergy = false ;
  }
}

function resetFilterDanceability() {
	for(let i=0; i<particles.length; i++) {
		particles[i].filteredByDanceability = false ;
  }
}

function resetFilterTempo() {
	for(let i=0; i<particles.length; i++) {
		particles[i].filteredByTempo = false ;
	}
}

function resetFilterAll() {
	resetFilterValence();
	resetFilterEnergy();
	resetFilterDanceability();
	resetFilterTempo();
}

function resetFilteredByCenterClick() {
	for(let i=0; i<particles.length; i++) {
		particles[i].filteredByCenterClick = false ;
	}
}

// SEARCH FUNCTIONS ************************************************************
function resetSearch() {
	for(let i=0; i<particles.length; i++) {
		particles[i].foundInSearch = false;
	}
}

function search( _string ) {
	// first of all, reset previous searches
	resetSearch();

	let foundSomething = false;
	let searchResults = [];

	for(let i=0; i<particles.length; i++) {
		let name  = particles[i].getName();
		let artist = particles[i].getArtist().join(', ');
		//let album = particles[i].getAlbum();


		let nameContains   = name.toLowerCase().search( _string.toLowerCase() );
		let artistContains = artist.toLowerCase().search( _string.toLowerCase() );
		//let albumContains  = album.toLowerCase().search( _string.toLowerCase() );

		if( nameContains == -1 ){ nameContains = false; } else { nameContains = true; }
		if( artistContains == -1 ){ artistContains = false; } else { artistContains = true; }
		//if( albumContains == -1 ){ albumContains = false; } else { albumContains = true; }

		if( nameContains || artistContains ) {
			//print("FOUND!!!!")
			//print( name )
			//print( artist )
			foundSomething = true;
			searchResults.push( particles[i] );
		}
  }

	for(let i=0; i<searchResults.length; i++) {
		searchResults[i].foundInSearch = true;
		//print( searchResults[i].getName()  );
		//print( searchResults[i].getArtist().join(', ')  );
	}
}

// PHYSICS FUNCTIONS ***********************************************************
function computeSeparation() {
  particleLookingForPlace = 0;

  for (let i = 0; i < particles.length; i++) {
    // Path following and separation are worked on in this function
    particles[i].separate( particles );
    particles[i].applyFriction(0.5);
    // Call the generic run method (update, borders, display, etc.)
    particles[i].update();

    if( !particles[i].getStatus() ) {
      //println("particle ", v.getId(), " didn't find its position yet");
      particleLookingForPlace ++;
    }
    //vehicles[i].borders();
  }

  if( !EVERYTHING_ON_ITS_RIGHT_PLACE) {
    //print("looking for a place: ", particleLookingForPlace);
    if( particleLookingForPlace == 0) {
      print( "everything is on its own place");
      EVERYTHING_ON_ITS_RIGHT_PLACE = true;
      for (let i = 0; i < particles.length; i++) {
        particles[i].settleDown();
      }
    }
  }
}

// OTHER FUNCS /////////////////////////////////////////////////////////////////
function mouseClicked() {
  getAudioContext().resume();
}

function keyPressed() {
}

function save_my_track_selection() {
	// if we are here it means we clicked on the "save songs" button so
	// 1. we have to collect all the saved songs data inside a JSON

	for( let i=0; i < SAVED_SONGS_OBJECTS.length; i++) {
		let songInfo = SAVED_SONGS_OBJECTS[i].particleRef.getSongInfo();
		SAVED_SONGS_JSON.push( songInfo );
	}



	// save JSON
	//print("save json")
	//print( SAVED_SONGS_JSON )
	saveJSON(SAVED_SONGS_JSON, "mySavedPlaylist.json")
}


// this function has an erratic behaviour, try to find a way to solve this
function removeSavedSongFromTable( _event ) {

	// remove object from the saved songs list
	let song_id = _event["target"].getAttribute("song_id") ;
	//print( index )
	// traverse the saved songs list to find the corrisponding song to be removed
	for( let i=0; i < SAVED_SONGS_OBJECTS.length; i++) {
		if( SAVED_SONGS_OBJECTS[i].getId() == song_id) {
			SAVED_SONGS_OBJECTS.splice(i, 1)
			break;
		}
	}

	// remove also the song row from the table
	let rowToBeRemoved = _event["target"].parentNode;
	rowToBeRemoved.remove()

	// and also update the "saved song counter"
	let e = select('#num_saved_songs');
	e.elt.textContent = SAVED_SONGS_OBJECTS.length ;

	if( SAVED_SONGS_OBJECTS.length == 0) {
		SAVE_SELECTION_BUTTON.disabled = true;
	}

}


function mousePressed() {
  for (let i = 0; i < particles.length; i++) {
    if( !particles[i].getInside() || !particles[i].visible ) {
      continue;
    } else {

			if(mouseButton === CENTER) {
				particles[i].setFilteredByCenterClick();
			} else {
				// if we are here is because we have clicked woth LEFT button


	      // if song has not been saved previously,
				// collect the track inside the saved table
	      if( !particles[i].getSaved() ){
					particles[i].setSaved();

					// create a saved song instance a pass
					// + the index of the object inside the list
					// + reference to the particle inside the graph
					// + the DOM table ref
					// + the "saved songs object list" ref
					let savedSongObj = new SavedSong( SAVED_SONGS_OBJECTS.length, particles[i], SAVED_SONGS_TABLE, removeSavedSongFromTable);

					// put a reference to this very object inside the object array
					SAVED_SONGS_OBJECTS.push( savedSongObj );

					//print( SAVED_SONGS_OBJECTS.length );
					// update the text
					let e = select('#num_saved_songs');
					e.elt.textContent = SAVED_SONGS_OBJECTS.length ;
					SAVE_SELECTION_BUTTON.disabled = false;

	        break;
	      } else {
	        print( "you have already saved this song");
	        return;
	    	}
			}
    }

  }
}
