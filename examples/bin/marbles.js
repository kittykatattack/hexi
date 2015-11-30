"use strict";

/*
A marble game prototyple illustrating collisions between moving circles
*/

//Create a new Hexi instance, and start it.
var g = hexi(512, 512, setup, ["images/marbles.png"]);

//Set the background color and scale the canvas
g.backgroundColor = "black";
g.scaleToWindow();

//Declare variables used in more than one function
var sling = undefined,
    marbles = undefined,
    capturedMarble = undefined;;

//If you're not loading any files, start Hexi after
//you've declared your global variables
g.start();

//The `setup` function to initialize your application
function setup() {

  /*
  Create the grid of marbles using the `grid` function. `grid` returns a
  `group` sprite object that contains a sprite for every cell in the
  grid. You can define the rows and columns in the grid, whether or
  not the sprites should be centered inside each cell, or what their offset from the
  top left corner of each cell should be. Supply a function that
  returns the sprite that you want to make for each cell. You can
  supply an optional final function that runs any extra code after
  each sprite has been created. Here's the format for creating a grid:
       gridGroup = grid(
         //Set the grid's properties
        columns, rows, cellWidth, cellHeight, 
        areSpirtesCentered?, xOffset, yOffset,
         //A function that returns a sprite
        () => {return g.circle(16, "blue"),
         //An optional final function that runs some extra code
        () => {console.log("extra!")
      );
  */
  marbles = g.grid(

  //Set the grid's properties
  5, 5, 128, 128, true, 0, 0,

  //A function that describes how to make each peg in the grid
  function () {
    var frames = g.filmstrip("images/marbles.png", 32, 32);
    var marble = g.sprite(frames);
    marble.show(g.randomInt(0, 5));
    marble.circular = true;
    var sizes = [8, 12, 16, 20, 24, 28, 32];
    marble.diameter = sizes[g.randomInt(0, 6)];
    marble.vx = g.randomInt(-10, 10);
    marble.vy = g.randomInt(-10, 10);
    marble.frictionX = 0.99;
    marble.frictionY = 0.99;
    marble.mass = 0.75 + marble.diameter / 32;
    return marble;
  },

  //Run any extra code after each peg is made, if you want to
  function () {
    return console.log("extra!");
  });

  //Create the "sling" which is a line that will connect
  //the pointer to the marbles
  sling = g.line("Yellow", 4);
  sling.visible = false;

  //A variable to store the captured marble
  capturedMarble = null;

  //Change the state to `play`
  g.state = play;
}

//The `play` function will run in a loop
function play() {

  //If a marble has been captured, draw the
  //sling (the yellow line) between the pointer and
  //the center of the captured marble
  if (capturedMarble !== null) {
    sling.visible = true;
    sling.ax = capturedMarble.centerX;
    sling.ay = capturedMarble.centerY;
    sling.bx = g.pointer.x;
    sling.by = g.pointer.y;
  }

  //Shoot the marble if the pointer has been released
  if (g.pointer.isUp) {
    sling.visible = false;
    if (capturedMarble !== null) {

      //Find out how long the sling is
      sling.length = g.distance(capturedMarble, g.pointer);

      //Get the angle between the center of the marble and the pointer
      sling.angle = g.angle(g.pointer, capturedMarble);

      //Shoot the marble away from the pointer with a velocity
      //proportional to the sling's length
      capturedMarble.vx = Math.cos(sling.angle) * sling.length / 5;
      capturedMarble.vy = Math.sin(sling.angle) * sling.length / 5;

      //Release the captured marble
      capturedMarble = null;
    }
  }

  marbles.children.forEach(function (marble) {

    //Check for a collision with the pointer and marble
    if (g.pointer.isDown && capturedMarble === null) {
      if (g.hit(g.pointer, marble)) {

        //If there's a collision, capture the marble
        capturedMarble = marble;
        capturedMarble.vx = 0;
        capturedMarble.vy = 0;
      }
    }

    //Apply friction
    marble.vx *= marble.frictionX;
    marble.vy *= marble.frictionY;

    //Move the marble by applying the new calculated velocity
    //to the marble's x and y position
    g.move(marble);

    //Contain the marble inside the stage and make it bounce
    //off the edges
    g.contain(marble, g.stage, true);
  });

  //Make each circle in the `marbles.children` array
  //bounce off another circle in the same array
  g.multipleCircleCollision(marbles.children);

  //You can alternatively check for for multiple circle collisions
  //the good old fashioned way, like this:

  /*
  for (let i = 0; i < marbles.children.length; i++) {
    //The first marble to use in the collision check 
    var c1 = marbles.children[i];
    for (let j = i + 1; j < marbles.children.length; j++) {
      //The second marble to use in the collision check 
      let c2 = marbles.children[j];
      //Check for a collision and bounce the marbles apart if
      //they collide. Use an optional mass property on the sprite
      //to affect the bounciness of each marble
      g.movingCircleCollision(c1, c2);
    }
  }
  */
}
//# sourceMappingURL=marbles.js.map