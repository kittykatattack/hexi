"use strict";

/*
Learn how to make a ball bounce around the canvas
with gravity, friction and mass.
*/

//Create a new Hexi instance, and start it.
var g = hexi(512, 512, setup);

//Set the background color and scale the canvas
//g.backgroundColor = "black";
g.scaleToWindow();

//Declare variables used in more than one function
var ball = undefined;

//If you 're not loading any files, start Hexi after
//you've decalred your global variables
g.start();

//The `setup` function to initialize your application
function setup() {

  //Make a ball sprite.
  //circle arguments: diameter, fillStyle, strokeStyle, lineWidth, x, y
  ball = g.circle(64, "powderBlue", "black", 2, 192, 256);

  //Set the ball's velocity to 0
  ball.vx = g.randomInt(5, 15);
  ball.vy = g.randomInt(5, 15);

  //Physics properties
  ball.gravity = 0.3;
  ball.frictionX = 1;
  ball.frictionY = 0;

  //Adding mass will let the `contain` method
  //make the ball gradually lose momentum in a
  //very natural looking way each time the ball
  //hits a surface. Value between 1.1 and 1.4 work
  //well for mass
  ball.mass = 1.3;

  //Acceleration and friction properties
  ball.accelerationX = 0.2;
  ball.accelerationY = -0.2;
  ball.frictionX = 1;
  ball.frictionY = 1;

  //When the pointer is tapped, center the ball
  //over the pointer and give it a new random velocity
  g.pointer.tap = function () {

    //Position the ball over the pointer
    ball.x = g.pointer.x - ball.halfWidth;
    ball.y = g.pointer.y - ball.halfHeight;

    //Give it a random velocity
    ball.vx = g.randomInt(-15, 15);
    ball.vy = g.randomInt(-15, 15);
  };

  //Add the instructions
  var message = g.text("Tap to give the ball a new random velocity", "18px Futura", "black", 6, 6);

  //Change the game state to `play`.
  g.state = play;
}

//The `play` function will run in a loop
function play() {

  //Apply gravity to the vertical velocity
  ball.vy += ball.gravity;

  //Apply friction. ball.frictionX will be 0.96 if the ball is
  //on the ground, and 1 if it's in the air
  ball.vx *= ball.frictionX;

  //Move the ball by applying the new calculated velocity
  //to the ball's x and y position
  ball.x += ball.vx;
  ball.y += ball.vy;

  //Use Ga's custom `contain` method to bounce the ball
  //off the canvas edges and slow it to a stop:

  //1. Use the `contain` method to create a `collision` object
  //that checks for a collision between the ball and the
  //rectangular area of the stage. Setting `contain`'s 3rd
  //argument to `true` will make the ball bounce off the
  //stage's edges.
  var collision = g.contain(ball, g.stage, true);

  //2. If the collision object has a value of "bottom", it means
  //the ball has hit the bottom of the stage. In that case, use
  //friction to slow it down.
  if (collision) {
    if (collision.has("bottom")) {

      //Slow the ball down if it hits the bottom of the stage.
      ball.frictionX = 0.98;
    } else {

      //If the ball isn't touching the bottom of the stage, it must
      //still be in the air. In that case,
      //give the ball a `frictionX` value of `1`, which essentially
      //means "don't apply friction" so that it moves freely.
      ball.frictionX = 1;
    }
  }

  //You can optionally write the bounce code manually using the following 4 if
  //statements.
  //These if statements all work in the same way:
  //If the ball crosses the canvas boundaries:
  //1. It's repositioned inside the canvas.
  //2. Its velocity is reversed to make it bounce, with
  //the mass subtracted so that it looses force over time.
  //3. If it's on the ground, friction is added to slow it down
  /*
  //Left
  if (ball.x < 0) {
    ball.x = 0;
    ball.vx = -ball.vx / ball.mass;
  }
  //Right
  if (ball.x + ball.diameter > canvas.width) {
    ball.x = canvas.width - ball.diameter;
    ball.vx = -ball.vx / ball.mass;
  }
  //Top
  if (ball.y < 0) {
    ball.y = 0;
    ball.vy = -ball.vy / ball.mass;
  }
  //Bottom
  if(ball.y + ball.diameter > canvas.height) {
     //Position the ball inside the canvas
    ball.y = canvas.height - ball.diameter;
     //Reverse its velocity to make it bounce, and dampen the effect with mass
    ball.vy = -ball.vy / ball.mass;
     //Add some friction if it's on the ground
    ball.frictionX = 0.96;
  } else {
     //Remove friction if it's not on the ground
    ball.frictionX = 1;
  }
  */

  //Add any extra optional game loop code here.
}
//# sourceMappingURL=bouncingBall.js.map