"use strict";

/*
Learn how to test for a collision between a point and a shape 
*/

//Create a new Hexi instance, and start it.
var g = hexi(256, 256, setup);

//Set the background color and scale the canvas
//g.backgroundColor = "black";
g.scaleToWindow();

//Declare variables used in more than one function
var box = undefined,
    ball = undefined,
    message = undefined;

//If you're not loading any files, start Hexi after
//you've declared your global variables
g.start();

//The `setup` function to initialize your application
function setup() {

  //Make a square
  box = g.rectangle(64, 64, "blue");
  g.stage.putCenter(box, box.halfWidth + 16, box.halfHeight + 16);

  //Make a circle
  ball = g.circle(64, "red");
  g.stage.putCenter(ball, -ball.radius - 16, -ball.radius - 16);

  //Add some text
  message = g.text("No collision...", "16px sans-serif", "black", 10, 10);

  //Change the state to `play`
  g.state = play;
}

//The `play` function will run in a loop
function play() {

  //Set the default message content
  message.content = "No collision...";

  /*
  Check for a collision between the pointer and the 
  ball and box. The collision variables will be `true`
  if there's a collision and `false` if there isn't.
  Use the universal `hit` method to do the collision check.
  `hit` arguments (only the first two are required):
  spriteA, spriteB, reactToCollision?, bounce?, useGlobalCoordinates?
  actionWhenCollisionOccurs
  */

  var boxCollision = g.hit(g.pointer, box),
      ballCollision = g.hit(g.pointer, ball);

  //You can alternatively use the lower-level `hitTestPoint` method
  //`hitTestPoint` arguments:
  //pointObject, sprite

  /*
  let boxCollision = g.hitTestPoint(g.pointer.position, box),
      ballCollision = g.hitTestPoint(g.pointer.position, ball);
   */

  //Change the message if there's a collision with the box
  if (boxCollision) {
    message.content = "Box!";
  }

  //Change the message if there's a collision with the ball
  if (ballCollision) {
    message.content = "Ball!";
  }
}
//# sourceMappingURL=pointCollision.js.map