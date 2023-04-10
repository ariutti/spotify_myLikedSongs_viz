let particle;
let sampleLoaded = false;


// SETUP ///////////////////////////////////////////////////////////////////////
function setup() {
  createCanvas(1200, 800);

  // we have to take care of the AudioContext
  // an make it work only if necessary
  getAudioContext().suspend();

  particle = new Particle(0, width*0.5, height*0.5, 100, './assets/0aegbRrg4oVF2kSMZwmnq8.mp3');
  //soundFormats('mp3', 'ogg');
  particle.loadTheSong();
}


// DRAW ////////////////////////////////////////////////////////////////////////
function draw() {
  background(155);

  print( sampleLoaded )

  if( sampleLoaded ) {
    userStartAudio();
    particle.checkIfInside(mouseX, mouseY);
  }
  particle.update();
  particle.display();

  textAlign(CENTER, CENTER);
  text(getAudioContext().state, width/2, height/2);

}
