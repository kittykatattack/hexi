"use strict";

/*
Learn how to create a generic spaceship vehicle.
*/

//Create a new Hexi instance, and start it.
var g = hexi(256, 256, setup, ["fonts/puzzler.otf"]);

//Set the background color and scale the canvas
//g.backgroundColor = "black";
g.scaleToWindow();

//Declare variables used in more than one function
var ship = undefined,
    turret = undefined,
    message = undefined;

//If you're not loading any files, start Hexi after
//you've declared your global variables
g.start();

//The `setup` function to initialize your application
function setup() {

  //Make the ship and turret
  ship = g.rectangle(32, 32, "gray"), turret = g.line("red", 4, 0, 0, 32, 0);

  //Center the ship's rotation point
  ship.setPivot(0.5, 0.5);

  //Add the turret to the ship and place it in the center
  ship.addChild(turret);
  turret.x = 0;
  turret.y = 0;

  //Center the ship on the stage
  g.stage.putCenter(ship);

  //Add some physics properties
  ship.vx = 0;
  ship.vy = 0;
  ship.accelerationX = 0.2;
  ship.accelerationY = 0.2;
  ship.frictionX = 0.96;
  ship.frictionY = 0.96;

  //The speed at which the ship should rotate,
  //initialized to 0
  ship.rotationSpeed = 0;

  //Whether or not the ship should move forward
  ship.moveForward = false;

  //Define the arrow keys to help move the ship
  var leftArrow = g.keyboard(37),
      upArrow = g.keyboard(38),
      rightArrow = g.keyboard(39),
      downArrow = g.keyboard(40);

  //Set the ship's `rotationSpeed` to -0.1 (to rotate left) if the
  //left arrow key is being pressed
  leftArrow.press = function () {
    ship.rotationSpeed = -0.1;
  };

  //If the left arrow key is released and the right arrow
  //key isn't being pressed down, set the `rotationSpeed` to 0
  leftArrow.release = function () {
    if (!rightArrow.isDown) ship.rotationSpeed = 0;
  };

  //Do the same for the right arrow key, but set
  //the `rotationSpeed` to 0.1 (to rotate right)
  rightArrow.press = function () {
    ship.rotationSpeed = 0.1;
  };

  rightArrow.release = function () {
    if (!leftArrow.isDown) ship.rotationSpeed = 0;
  };

  //Set `ship.moveForward` to `true` if the up arrow key is
  //pressed, and set it to `false` if it's released
  upArrow.press = function () {
    ship.moveForward = true;
  };
  upArrow.release = function () {
    ship.moveForward = false;
  };

  //Make a text sprite
  message = g.text("", "12px puzzler", "black", 8, 8);

  //Change the state to `play`
  g.state = play;
}

//The `play` function will run in a loop
function play() {

  //Use the `rotationSpeed` to set the ship's rotation
  ship.rotation += ship.rotationSpeed;

  //If `ship.moveForward` is `true`, use acceleration with a
  //bit of basic trigonometry to make the ship move in the
  //direction of its rotation
  if (ship.moveForward) {
    ship.vx += ship.accelerationX * Math.cos(ship.rotation);
    ship.vy += ship.accelerationY * Math.sin(ship.rotation);
  }

  //If `ship.moveForward` is `false`, use
  //friction to slow the ship down
  else {
      ship.vx *= ship.frictionX;
      ship.vy *= ship.frictionY;
    }

  //Apply the ship's velocity to its position to make the ship move
  ship.x += ship.vx;
  ship.y += ship.vy;

  //Display the ship's angle of rotation
  message.content = ship.rotation;
}
//# sourceMappingURL=spaceshipVehicle.js.map