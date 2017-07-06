"use strict";

/*
Learn how to create a generic tank vehicle.
*/

//Create a new Hexi instance, and start it.
var g = hexi(256, 256, setup, ["fonts/puzzler.otf"]);

//Set the background color and scale the canvas
//g.backgroundColor = "black";
g.scaleToWindow();

//Declare variables used in more than one function
var tank = undefined,
    turret = undefined,
    message = undefined;

//If you're not loading any files, start Hexi after
//you've declared your global variables
g.start();

//The `setup` function to initialize your application
function setup() {

  //Make the ship and turret
  tank = g.rectangle(32, 32, "gray"), turret = g.line("red", 4, 0, 0, 32, 0);

  //Center the ship's rotation point
  tank.setPivot(0.5, 0.5);

  //Add the turret to the ship and place it in the center
  tank.addChild(turret);
  turret.x = 0;
  turret.y = 0;

  //Center the ship on the stage
  g.stage.putCenter(tank);

  //Add some physics properties
  tank.vx = 0;
  tank.vy = 0;
  tank.accelerationX = 0.2;
  tank.accelerationY = 0.2;
  tank.rotationSpeed = 0;
  tank.friction = 0.96;
  tank.speed = 0;

  //The speed at which the tank should rotate,
  //initialized to 0
  tank.rotationSpeed = 0;

  //Whether or not the tank should move forward
  tank.moveForward = false;

  //Define the arrow keys to move the tank
  var leftArrow = g.keyboard(37),
      upArrow = g.keyboard(38),
      rightArrow = g.keyboard(39),
      downArrow = g.keyboard(40);

  //Set the tank's `rotationSpeed` to -0.1 (to rotate left) if the
  //left arrow key is being pressed
  leftArrow.press = function () {
    tank.rotationSpeed = -0.1;
  };

  //If the left arrow key is released and the right arrow
  //key isn't being pressed down, set the `rotationSpeed` to 0
  leftArrow.release = function () {
    if (!rightArrow.isDown) tank.rotationSpeed = 0;
  };

  //Do the same for the right arrow key, but set
  //the `rotationSpeed` to 0.1 (to rotate right)
  rightArrow.press = function () {
    tank.rotationSpeed = 0.1;
  };

  rightArrow.release = function () {
    if (!leftArrow.isDown) tank.rotationSpeed = 0;
  };

  //Set `tank.moveForward` to `true` if the up arrow key is
  //pressed, and set it to `false` if it's released
  upArrow.press = function () {
    tank.moveForward = true;
  };
  upArrow.release = function () {
    tank.moveForward = false;
  };

  //Make a text sprite
  message = g.text("", "12px puzzler", "black", 8, 8);

  //Change the state to `play`
  g.state = play;
}

//The `play` function will run in a loop
function play() {

  //Use the `rotationSpeed` to set the tank's rotation
  tank.rotation += tank.rotationSpeed;

  //If `tank.moveForward` is `true`, increase the speed
  if (tank.moveForward) {
    tank.speed += 0.1;
  }

  //If `tank.moveForward` is `false`, use
  //friction to slow the tank down
  else {
      tank.speed *= tank.friction;
    }

  //Use the `speed` value to figure out the acceleration in the
  //direction of the tank’s rotation
  tank.accelerationX = tank.speed * Math.cos(tank.rotation);
  tank.accelerationY = tank.speed * Math.sin(tank.rotation);

  //Apply the acceleration to the tank's velocity
  tank.vx = tank.accelerationX;
  tank.vy = tank.accelerationY;

  //Apply the tank's velocity to its position to make the tank move
  tank.x += tank.vx;
  tank.y += tank.vy;

  //Display the tank's angle of rotation
  message.content = tank.rotation;
}
//# sourceMappingURL=tankVehicle.js.map