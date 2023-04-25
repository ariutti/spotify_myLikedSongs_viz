class Particle {

  constructor(_id, _x, _y, _r, _c,
    _data
  )
    {
    this.id = _id;
    // data point stuff
    this.data = _data;

    // audio stuff
    this.song;

    // graphics stuff
    this.c = _c;
    //this.visited = false;

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

    // data retrieval by interaction stuff
    this.saved = false;


		// filters stuff
		// The particle should be visible if
		// + not filtered by Tempo;
		// + not filtered by Danceability;
		// + not filtered by Energy;
		// + not filtered by Valence;
		this.filteredByTempo = false;
		this.filteredByDanceability = false;
		this.filteredByEnergy  = false;
		this.filteredByValence = false;
		this.filteredByCenterClick = false;
		this.visible = true;

		// search stuff
		this.foundInSearch = false;
  }

  // LOAD THE SONG /////////////////////////////////////////////////////////////
  // this function must be called only if the preview URL is not null
  loadTheSong( _callback ) {
    let songURL;
    if( LOAD_LOCAL_MP3 ) {
      songURL = "/previews/".concat( this.data.id );
      songURL = songURL.concat( ".mp3" );
    } else {
      songURL = this.data.preview_url;
    }
    this.song = loadSound(songURL, _callback );
    this.song.setLoop( true );
  }

  // DISPLAY ///////////////////////////////////////////////////////////////////
  display() {

		// update visibility status
		this.visible = true;
		if( this.filteredByTempo || this.filteredByDanceability || this.filteredByEnergy || this.filteredByValence || this.filteredByCenterClick ) {
			this.visible = false;
		}


    push();

    translate( this.position.x, this.position.y );

    if( this.settled ) {
      // if the particle already has found its spot
      // then, display it with graph colours

      if( this.isInside ) {
        strokeWeight(4);
      } else {
				if( this.foundInSearch ) {
					strokeWeight(4);
				} else {
					noStroke();
				}
      }

      let interColor = lerpColor(COLOR_FROM, COLOR_TO, this.c);
      if( !this.saved ) {
				if( this.foundInSearch ) {
					stroke(50, 255,0);
				}
        interColor.setAlpha( 255 );
        fill( interColor );
      } else {
        interColor.setAlpha( 25 );
        stroke(0)
        fill( interColor );
      }

      if( this.data.preview_url == null) {
        fill(0);
      }



    } else if( this.readyToSettle ) {
      // it is grey if it is ready to settle down
      stroke(255);
      strokeWeight(1);
      fill(175);
    } else {
      // the particle is red if not settled down yet
      stroke(255);
      strokeWeight(1);
      fill(255,0,0);
    }

		// but, if particle has been filtered out, don't show it
		if( this.visible ) {
			ellipse(0, 0, this.r*2, this.r*2);
		} // if visible;

    // showCenter
    // strokeWeight(2);
    // stroke(120)
    // point( 0,0 )

    pop();
  }

	showText( _infoBoxElement ) {
    if( this.isInside && this.visible) {
      let text = this.data.name + "</br>" + this.data.artist.join(', ') + "</br>" + this.data.tempo;
			_infoBoxElement.innerHTML = text;
			_infoBoxElement.setAttribute("style", "display:block");
    }
  }


	/*
	// old way of doing
  showText( _infoBox ) {
    if( this.isInside && this.visible) {
      let text = this.data.name + "\n" + this.data.artist.join(', ') + "\n" + this.data.tempo;
      _infoBox.update( text );
      _infoBox.display();
    }
  }
	*/

  playSongIfInside() {
    if( this.data.preview_url == null ) {
      return;
    }

    let songURL;
    if( LOAD_LOCAL_MP3 ) {
      songURL = "/previews/".concat( this.id );
      songURL = songURL.concat( ".mp3" );
    } else {
      songURL = this.data.preview_url;
    }


    // if we are here it means the song has a valid preview
    if( this.isInside ) {
      if( !this.song ) {
        //print( songURL )
        this.song = new Audio( songURL );
        //print("playback started/resumed");
        // TODO: implement a loop playback system

				this.song.loop = true; // song will loop if mouse over
				//this.song.volume = 0.1;
        this.song.play();
      } else {
				this.song.play();
			}
    } else {
      if( this.song ) {
        //print("playback paused");
        this.song.pause();
        //this.song = null;
      }
    }
  }



  checkIfInside( _mouseX, _mouseY ) {
    if( dist( _mouseX, mouseY, this.position.x, this.position.y) < this.r) {
      // if we are here it means mouse is inside the particle
      if( !this.isInside ) {
        this.isInside = true;
        //this.visited = true;
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

  // SETTERS ///////////////////////////////////////////////////////////////////
  settleDown() {
    this.settled = true;
    //this.readyToSettle = true;
  }

	setVisible( _value ) { this.visible = _value; }

	setSaved() { this.saved = true; }

	setFilteredByCenterClick() {
		this.filteredByCenterClick = true;
		if( this.song ) {
			this.song.pause();
			this.song = null;
		}
	}

  /*
  resetVisited() {
    this.saved = false;
  }
  */




  // GETTERS ///////////////////////////////////////////////////////////////////
	getId() { return this.data.id; }
	getPreviewUrl() { return this.data.preview_url; }
	getName() { return this.data.name; }
	getArtist() { return this.data.artist; }
	//getAlbum() {}

	getValence() { return this.data.valence; }
	getTempo() { return this.data.tempo; }
	getDanceability() { return this.data.danceability; }
	getEnergy() { return this.data.energy; }

	getSongInfo() {
		//print( "you are inside particle ", this.id, "(", this.name,",",this.artists,")")
		return this.data;
	}

  getRadius() { return this.r; }
  getStatus() { return this.readyToSettle; }


  getSaved() { return this.saved; }
  getInside() { return this.isInside; }
	getVisible() { return this.visible; }
	//getVisited() { return this.visited; }

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



};
