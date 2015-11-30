/*
Use the `particleEmitter` method to create a constant stream of particles
at fixed intervals. The emitter is a simple timer that calls the 
`createParticles` method repeatedly at intervals in milliseconds that
you define. Here's how to create a particle emitter

let particleStream = g.particleEmitter(intervalInMilliseconds, createParticlesMethod);

Use the emitter's `play` and `stop` methods to start and 
stop the particle stream.

This example shows you how to create a particle emitter, and how to use the 
pointer's `press` and `release` methods to start and stop the particle stream.
*/

//Create a new Hexi instance, and start it.
//Load the texture atlas that inlcudes the animation frames you want
//to load
let g = hexi(256, 256, setup, ["images/star.png"]);
g.start();

//Set the background color and scale the canvas
g.backgroundColor = "black";
g.scaleToWindow();

//The `setup` function to initialize your application
function setup() {

  let particleStream = g.particleEmitter(
    100,                                   //The interval, in milliseconds
    () => g.createParticles(               //The `createParticles` method
      g.pointer.x, 
      g.pointer.y, 
      () => g.sprite("images/star.png"),
      g.stage,
      50
    )
  );

  //Make the emitter create particles when the pointer is pressed
  g.pointer.press = () => particleStream.play();

  //Stop creating particles when the pointer is released
  g.pointer.release = () => particleStream.stop();

  //Add text instructions
  g.text("Press and hold to make stars", "14px Futura", "white", 6, 4);
}


