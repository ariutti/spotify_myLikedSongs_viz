class Particle {

  constructor(_id, _x, _y, _r, _songUrl) {
    this.id = _id;
    this.position = createVector( _x, _y);
    this.r = _r*0.5;
    this.songUrl = _songUrl;
    this.song;
  }

  loadTheSong() {
    this.song = loadSound( this.songUrl, function() {print("sample loaded"); sampleLoaded = true;} );
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
