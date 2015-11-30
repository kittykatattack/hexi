"use strict";

/*
Learn how to prevent rectangles from intersecting
*/

//Create a new Hexi instance, and start it.
var g = hexi(256, 256, setup);

//Set the background color and scale the canvas
//g.backgroundColor = "black";
g.scaleToWindow();

//Declare variables used in more than one function
var blue = undefined,
    red = undefined,
    message = undefined;

//If you're not loading any files, start Hexi after
//you've declared your global variables
g.start();

//The `setup` function to initialize your application
function setup() {

  //Make a blue square
  blue = g.rectangle(64, 64, "blue");
  blue.setPivot(0.5, 0.5);
  g.stage.putCenter(blue, blue.halfWidth + 16, blue.halfHeight + 16);
  blue.draggable = true;

  //Make a red square
  red = g.rectangle(64, 64, "red");
  red.setPivot(0.5, 0.5);
  g.stage.putCenter(red, -red.halfWidth - 16, -red.halfWidth - 16);
  red.draggable = true;

  //Add some text
  message = g.text("Drag the circles...", "16px sans-serif", "black", 10, 10);

  //Change the state to `play`
  g.state = play;
}

//The `play` function will run in a loop
function play() {

  /*
  Use the universal `hit` method to prevent two rectangles from
  overlapping. It returns a `collision` variable that tells you the side on which
  the first rectangle touched the second rectangle. (The `collision`
  variable will be `undefined` if there's no collision.). The second
  sprite in the argument will block the movement of the first sprite.
  The second sprite in the argument can push the first sprite.
  //`hit` arguments:
  //spriteOne, spriteTwo, reactToCollision?, bounceApart?
  */
  var collision = g.hit(blue, red, true, false);

  /*
  You can alternatively use the lower-level `rectangleCollision`
  method
  `rectangleCollision` arguments:
  sprite1, sprite2, bounce?, useGlobalCoordinates?
  (the third and fourth arguments default to `true`);
  */
  //let collision = g.rectangleCollision(blue, red);

  //Change the message if there's a collision between the rectangles
  if (collision) {
    message.content = "Collision on: " + collision;
  } else {
    message.content = "Drag the squares...";
  }
}
//# sourceMappingURL=blockRectangles.js.map