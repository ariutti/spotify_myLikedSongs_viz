// for debugging purposes
let NUM_PARTICLE_TO_BE_CONSIDERED = 300;







let particles = [];
let sampleLoadedCounter = 0;
let LOAD_LOCAL_MP3 = true;
let NUM_VALID_PREVIEW = 0;
let READY_TO_PLAY_AUDIO = false;
let axis = [];
let jsonDB;
let JSON_LOADED = false;



let COLOR_FROM;
let COLOR_TO;

// PRELOAD /////////////////////////////////////////////////////////////////////
function preload() {
  jsonDB = loadJSON("./assets/db/20230403_LikedSongsDB.json", function() {
    print("JSON data base loaded");
    JSON_LOADED = true;
  });
}


// SETUP ///////////////////////////////////////////////////////////////////////
function setup() {
  createCanvas(1200, 800);


  COLOR_FROM = color(218, 165, 32);
  COLOR_TO = color(72, 61, 139);

  // we have to take care of the AudioContext
  // an make it work only if necessary
  getAudioContext().suspend();

  while( !JSON_LOADED ) {
    print("waiting for the JSON DB to be loaded;")
  }

  // convert json to array
  let songList = Object.values(jsonDB);
  print( "There are ", songList.length, " inside the database");

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

  axis.push( new Axis("x_tempo", min_x, max_x, 10.0, width*0.8) );
  axis.push( new Axis("y_dance", min_y, max_y, 10.0, height*0.8) );
  axis.push( new Axis("w_energy", min_w, max_w, 0.0, 20.0) );
  axis.push( new Axis("z_valence", min_z, max_z, 0.0, 1.0) );

  // now its time to create all the particles
  for(let i=0; i<songList.length;i++) {
    // retrieve the song informations
    let id = songList[i]["id"];
    let artists = songList[i]["artist"];
    let name = songList[i]["name"];
    let analysis_url = songList[i]["analysis_url"];
    let preview_url = songList[i]["preview_url"];

    let tempo = songList[i]["tempo"];
    let time_signature = songList[i]["time_signature"];
    let duration_ms = songList[i]["duration_ms"];
    let key = songList[i]["key"];
    let mode = songList[i]["mode"];
    let loudness = songList[i]["loudness"];

    let danceability = songList[i]["danceability"];
    let energy = songList[i]["energy"];
    let acousticness = songList[i]["acousticness"];
    let instrumentalness = songList[i]["instrumentalness"];
    let liveness = songList[i]["liveness"];
    let speechiness = songList[i]["speechiness"];
    let valence = songList[i]["valence"];

    // now let's do some scaling and mapping
    let x = axis[0].getConverted( tempo );
    let y = axis[1].getConverted( danceability );
    let r = axis[2].getConverted( energy );
    let c = axis[3].getConverted( valence );

    particles.push( new Particle(id,
      x,y,r,c,
      artists, name, preview_url, analysis_url,
      tempo, time_signature, duration_ms, key, mode, loudness,
      danceability, energy, acousticness, instrumentalness,
      liveness, speechiness, valence
    ));
    if( preview_url != null ) {
      NUM_VALID_PREVIEW ++;
    }
  }

  print( "We have ", particles.length, " songs but with ", NUM_VALID_PREVIEW," valid preview" );

  // load all the songs
  NUM_VALID_PREVIEW = 0;
  //for(let i=0; i<particles.length; i++) {
  for(let i=0; i<NUM_PARTICLE_TO_BE_CONSIDERED; i++) {
    particles[i].loadTheSong();

    if( particles[i].getPreviewUrl() != null ) {
      NUM_VALID_PREVIEW ++;
    }
  }
  print( "the subgroup we are considering is made of ", NUM_PARTICLE_TO_BE_CONSIDERED, " songs but with ", NUM_VALID_PREVIEW," valid preview" );


  // font stuff
  textSize(12);
  textAlign(CENTER, CENTER);


}


// DRAW ////////////////////////////////////////////////////////////////////////
function draw() {
  background(120);

  // a workaround to play audio only when all samples have been loaded
  if( !READY_TO_PLAY_AUDIO ) {
    print( sampleLoadedCounter );
    if( sampleLoadedCounter == NUM_VALID_PREVIEW) {
      READY_TO_PLAY_AUDIO = true;
    }
  }


  axis[0].displayHorizontal( 10.0, 1);
  axis[1].displayVertical( 10.0, 1);

  if( READY_TO_PLAY_AUDIO ) {
    for(let i=0; i<NUM_PARTICLE_TO_BE_CONSIDERED; i++) {
      particles[i].checkIfInside( mouseX, mouseY);
      particles[i].playSongIfInside();
    }
  }


  for(let i=0; i<NUM_PARTICLE_TO_BE_CONSIDERED; i++) {
    particles[i].display();
  }

  // once we have drawn the particles, we can show the text
  for(let i=0; i<NUM_PARTICLE_TO_BE_CONSIDERED; i++) {
    particles[i].showText( );
  }
}


function mouseClicked() {
  getAudioContext().resume();
}
