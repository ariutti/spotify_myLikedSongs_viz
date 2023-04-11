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

    // graphics stuff
    this.c = _c;

    // physics stuff
    this.r = _r;
    this.mass = this.r*2;
    this.position = createVector( _x, _y );
    this.velocity = createVector(0, 0);
    this.acceleration = createVector(0, 0);
    this.maxForce = 100;
    this.maxSpeed = 2;
    this.readyToSettle = false;
    this.settled = false;
  }

  // LOAD THE SONG /////////////////////////////////////////////////////////////
  // this function must be called only if the preview URL is not null
  loadTheSong( _callback ) {
    let songURL;
    if( LOAD_LOCAL_MP3 ) {
      songURL = "/previews/".concat( this.id );
      songURL = songURL.concat( ".mp3" );
    } else {
      songURL = this.preview_url;
    }
    this.song = loadSound(songURL, _callback );
    this.song.setLoop( true );
  }

  // DISPLAY ///////////////////////////////////////////////////////////////////
  display() {

    push();
    stroke(0);
    strokeWeight(1);
    translate( this.position.x, this.position.y );

    if( this.settled ) {
      // if the particle already has found its spot
      // then, display it with graph colours
      if( this.isInside ) {
        fill(0,255,0);
      } else {
        let interColor = lerpColor(COLOR_FROM, COLOR_TO, this.c);
        fill( interColor );
      }

      if( this.preview_url == null) {
        fill(0);
      }

    } else if( this.readyToSettle ) {
      // it is grey if it is ready to settle down
      fill(175);
    } else {
      // the particle is red if not settled down yet
      fill(255,0,0);
    }
    ellipse(0, 0, this.r*2, this.r*2);

    // showCenter
    strokeWeight(2);
    stroke(120)
    point( 0,0 )
    pop();
  }




  showText() {
    let text_size = 24;
    textSize(text_size);
    textAlign(CENTER, CENTER);
    push();
    strokeWeight(4);
    stroke(255);
    translate( this.position.x, this.position.y-(text_size*3));
    if( this.isInside ) {
      text(this.name, 0, 0);
      text(this.artists, 0, text_size);
      text(this.tempo, 0, text_size*2);
    }
    pop();
  }




  playSongIfInside() {
    if( this.preview_url == null ) {
      return;
    }

    if( this.isInside ) {
      if( !this.song.isPlaying() ) {
        //print("playback started/resumed");
        this.song.play();
      }
    } else {
      if( this.song.isPlaying() ) {
        //print("playback paused");
        this.song.pause();
      }
    }
  }



  checkIfInside( _mouseX, _mouseY ) {
    if( dist( _mouseX, mouseY, this.position.x, this.position.y) < this.r) {
      // if we are here it means mouse is inside the particle
      if( !this.isInside ) {
        this.isInside = true;
        //print( "inside" )
      }
    } else {
      // if we are here it means mouse is outside the particle
      if( this.isInside ) {
        this.isInside = false;
        //print("outside")
      }
    }
  }

  // PHYSICS STUFF /////////////////////////////////////////////////////////////
  applyForce(_force) {
    // We could add mass here if we want A = F / M
    let f = _force.copy()
    f.div( this.mass );
    this.acceleration.add( f );
  }

  applyFriction( c ) {
    let friction = this.velocity.copy();
    friction.mult(-1.0);
    friction.normalize();
    friction.mult(c*1.0);
    this.applyForce( friction );
  }

  // Separation(method checks for nearby vehicles and steers away) ///////////////////////////////////////////////////////
  // ref: look for "separation": https://natureofcode.com/book/chapter-6-autonomous-agents/
  separate( otherVehicles ) {
    //print("otherVehicles lenght = ", otherVehicles.length)
    // if the particle is already happy with its position
    // do nothing
    if( this.settled ) {
      return;
    };

    let sum = createVector(0.0, 0.0);
    let count = 0;

    // For every boid in the system, check if it's too close
    for (let i=0; i<otherVehicles.length; i++ ) { //Particle other : vehicles) {

      let otherID = otherVehicles[i].getId();
      // discard myself
      if( this.id == otherID) {
        continue;
      }

      let desiredseparation = ( this.r+otherVehicles[i].getRadius() * 1.1);
      let d = p5.Vector.dist(this.position, otherVehicles[i].position);

      // If the distance is less than an arbitrary amount (0 when you are yourself)
      // don't do calculation for yourself
      if( d < desiredseparation ) {
        //print( "my id (", this.id, ") is not the other id (", otherID,")")

        while( d==0.0 ) {
          print("d is equal to zero");
          // if we are here it means that, between the others, we have found a particle
          // with the same exact position of the current one.
          // To prevent this from happening, better to move a bit the current particle
          //this.position.add( createVector(random(0.0, 1.0), random(0.0, 1.0) ) ); // random vectorv
          this.position.add( createVector(random(0.1, 0.2), random(0.1, 0.2) ) );

          d = p5.Vector.dist(this.position, otherVehicles[i].position);
        }

        // Calculate vector pointing away from neighbor
        let diff = p5.Vector.sub(this.position, otherVehicles[i].position);
        diff.normalize();

        // what is the magnitude of the vector pointing away from the other particle?
        // The closer it is, the more we should flee;
        // The farther, the less.
        // So we divide by the distance to scale them appropriately.
        diff.div(d);        // Weight by distance

        sum.add(diff);
        count++;            // Keep track of how many
      }
    }

    // Average -- divide by how many
    if (count > 0) {
      sum.div(count);
      sum.normalize();
      // Our desired vector is moving away maximum speed
      sum.mult( this.maxSpeed );
      //sum.setMag( this.maxspeed );

      // Implement Reynolds: Steering = Desired - Velocity
      let steer = p5.Vector.sub(sum, this.velocity);
      steer.limit( this.maxForce );
      this.applyForce( steer );
    } else {
      //println("particle ", id, " is quite separated now");
      this.readyToSettle = true;
    }
  }

  // Method to update position
  update() {
    if( ! this.settled ) {
      // Update velocity
      this.velocity.add( this.acceleration );
      // Limit speed
      this.velocity.limit( this.maxspeed );
      this.position.add( this.velocity );
      // Reset accelertion to 0 each cycle
      this.acceleration.mult(0.0);
    } else {
      // no need to update position if already separated
    }
  }

  /*
  // Wraparound
  borders() {
    if ( this.position.x < - this.r) this.position.x = width+this.r;
    if ( this.position.y < - this.r) this.position.y = height+this.r;
    if ( this.position.x > width+this.r) this.position.x = -this.r;
    if ( this.position.y > height+this.r) this.position.y = -this.r;
  }
  */

  // SETTERS ///////////////////////////////////////////////////////////////////
  settleDown() {
    this.settled = true;
    //this.readyToSettle = true;
  }


  // GETTERS ///////////////////////////////////////////////////////////////////
  getId() {
    return this.id;
  }

  getRadius() {
    return this.r;
  }

  getStatus() {
    return this.readyToSettle;
  }

  getPreviewUrl() {
    return this.preview_url;
  }
};
