class Particle {

  constructor(_id, _x, _y, _r, _c,
    _artists, _name, _preview_url, _analysis_url,
    _tempo, _time_signature, _duration_ms, _key, _mode, _loudness,
    _danceability, _energy, _acousticness, _instrumentalness,
    _liveness, _speechiness, _valence)
    {
    // data point stuff
    this.id = _id;
    this.artists = _artists;
    this.name = _name;
    this.preview_url = _preview_url;
    this.analysis_url = _analysis_url;
    this.tempo = _tempo;
    this.time_signature = _time_signature;
    this.duration_ms = _duration_ms;
    this.key = _key
    this.mode = _mode;
    this.loudness = _loudness;

    this.danceability = _danceability;
    this.energy = _energy;
    this.acousticness = _acousticness;
    this.instrumentalness = _instrumentalness;
    this.liveness = _liveness;
    this.speechiness = _speechiness;
    this.valence = _valence;

    // audio stuff
    this.song;

    // physics stuff
    this.position = createVector( _x, _y);
    this.r = _r;
  }

  loadTheSong() {
    // do nothing if the song has no preview
    if( this.preview_url == null ) {
      print( "song '", this.id, "' doesn't have a preview");
      return;
    }

    let songURL;


    if( LOAD_LOCAL_MP3 ) {
      songURL = "/previews/".concat( this.id );
      songURL = songURL.concat( ".mp3" );
      print( typeof songURL  )

      //songURL = "./assets/0aegbRrg4oVF2kSMZwmnq8.mp3"
    } else {
      songURL = this.preview_url;
    }
    this.song = loadSound( songURL, function() {
      //print("sample loaded");
      sampleLoadedCounter++;
    } );
    this.song.setLoop( true );
  }

  getId() {
    return this.id;
  }

  getRadius() {
    return this.r;
  }


  update() {
    // do nothing for the moment
  }

  display() {
    push();
    stroke(0);
    translate( this.position.x, this.position.y );

    if( this.isInside ) {
      fill(255,0,0);
    } else {
      fill(120);
    }

    if( this.preview_url == null) {
      fill(0);
    }


    ellipse(0, 0, this.r*2, this.r*2);
    pop();
  }

  checkIfInside( _mouseX, _mouseY ) {
    //this.song.play();

    if( dist( _mouseX, mouseY, this.position.x, this.position.y) < this.r) {
      // if we are here it means mouse is inside the particle
      if( !this.isInside ) {
        this.isInside = true;
        //print( "inside" );
        if( !this.song.isPlaying() ) {
          print("playback started/resumed");
          this.song.play();
        }
      }
    } else {
      // if we are here it means mouse is outside the particle
      if( this.isInside ) {
        this.isInside = false;
        //print("outside")
        if( this.song.isPlaying() ) {
          print("playback paused");
          this.song.pause();
        }
      }
    }

  }
};
