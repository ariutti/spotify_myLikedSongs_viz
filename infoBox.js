class InfoBox {
  constructor( _x, _y, _w, _h) {
    this.position = createVector( _x, _y );
    this.size = createVector( _w, _h );
    this.text = "";
  }

  update( _text ) {
    this.text = _text;
    //print( this.text )
  }

  display() {
    //print( "display" )
    push();

    textSize( 12 );
    textAlign(LEFT, TOP);
    strokeWeight(4);
    stroke(255);

    translate( this.position.x, this.position.y );
    noStroke();
    fill(0, 255, 0, 120);
    rect(0, 0, this.size.x, this.size.y);
    fill(0);
    text( this.text, 0, 0);
    pop();
  }
};
