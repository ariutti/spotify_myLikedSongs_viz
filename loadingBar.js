class LoadingBar {
  constructor(_x, _y,_w, _h, _maxCounter) {
    this.size = createVector( _w, _h );
    this.center = createVector( _x, _y );
    this.upperLeft = createVector( _x-(_w*0.5), _y-(_h*0.5) );

    this.max = _maxCounter;
    this.counter = 0;
    this.filled = 0.0;
    this.completed = false;

  }

  // DISPLAY ///////////////////////////////////////////////////////////////////
  display() {
    push()

    // draw filling percentage
    noStroke()
    fill(255)
    rect( this.upperLeft.x, this.upperLeft.y, this.filled, this.size.y);

    // draw poutline
    stroke(255);
    noFill();
    rect( this.upperLeft.x, this.upperLeft.y, this.size.x, this.size.y);

    // print some text
    stroke(0);
    strokeWeight(1);
    textSize(12);
    textAlign(CENTER, CENTER);

    let message = join( [this.counter, this.max], '/' )


    text( message, this.center.x, this.center.y);
    //text( "porco dio", this.center.x, this.center.y);


    pop()
  }

  // SETTERS ///////////////////////////////////////////////////////////////////
  setCounter( _newValue ) {
    this.counter = _newValue;
    if( this.counter == this.max ) {
      this.completed = true;
    } else {
      // if we are here it means we are not completed yet
      this.filled = (this.counter / this.max) * this.size.x;
    }


  }

  // GETTERS ///////////////////////////////////////////////////////////////////
  getConter() {
    return this.counter;
  }

  getStatus() {
    return this.completed;
  }

}
