/*
Learn how to test for a collisions between a circle and 
a grid of rectangles
*/

//Create a new Hexi instance, and start it.
let g = hexi(512, 512, setup);

//Set the background color and scale the canvas
g.backgroundColor = "black";
g.scaleToWindow();

//Declare variables used in more than one function
let ball, bricks;

//If you're not loading any files, start Hexi after
//you've declared your global variables
g.start();

//The `setup` function to initialize your application
function setup() {

//Figure out a random diameter for the falling ball
  let randomDiameter = g.randomInt(16, 64);
 
  //Create the ball using the random diameter
  ball = g.circle(randomDiameter, "red");

  //Position the ball randomly somewhere across the top of the canvas
  ball.x = g.randomInt(0, g.canvas.width - ball.diameter);
  ball.y = 0;

  //Set the ball's velocity
  ball.vx = g.randomInt(-12, 12);
  ball.vy = 0;

  //Set the ball's gravity, friction and mass
  ball.gravity = 0.6;
  ball.frictionX = 1;
  ball.frictionY = 0;

  //Set the mass based on the ball's diameter
  ball.mass = 0.75 + (ball.diameter / 32);

  //An array of colors that will be chosen randomly for each
  //circular peg in the grid
  let colors = [
    "#FFABAB", "#FFDAAB", "#DDFFAB", "#ABE4FF", "#D9ABFF"
  ];
  
  /*
  Create the grid of bricks using the `grid` function. `grid` returns a
  `group` sprite object that contains a sprite for every cell in the
  grid. You can define the rows and columns in the grid, whether or
  not the sprites should be centered inside each cell, or what their offset from the
  top left corner of each cell should be. Supply a function that
  returns the sprite that you want to make for each cell. You can
  supply an optional final function that runs any extra code after
  each sprite has been created. Here's the format for creating a grid:

      gridGroup = grid(

        //Set the grid's properties
        rows, columns, cellWidth, cellHeight, 
        areSpirtesCentered?, xOffset, yOffset,

        //A function that returns a sprite
        () => g.circle(16, "blue"),

        //A optional final function that runs some extra code
        () => console.log("extra!")
      );
  */

  bricks = g.grid(

    //Set the grid's properties
    5, 4, 96, 96, 
    true, 0, 0,

    //A function that describes how to make each peg in the grid
    () => {
      let brick = g.rectangle(g.randomInt(16, 64), g.randomInt(16, 64));
      brick.fillStyle = colors[g.randomInt(0, 4)];
      return brick;
    },
    //Run any extra code after each peg is made, if you want to
    () => console.log("extra!")
  );

  //Position the grid of bricks
  bricks.setPosition(16, 96);

  //Change the state to `play`
  g.state = play;  
}

//The `play` function will run in a loop
function play() {

  //Apply gravity to the ball's vertical velocity
  ball.vy += ball.gravity;
  
  //Apply friction. ball.frictionX will be 0.96 if the ball is
  //on the ground, and 1 if it's in the air
  ball.vx *= ball.frictionX;

  //Move the ball by applying the new calculated velocity
  //to the ball's x and y position
  g.move(ball);

  //Check for a collision with the ball and the stage's boundary, and
  //make the ball bounce by setting setting the last argument 
  //in the `contain` method to `true`
  let stageCollision = g.contain(ball, g.stage, true);

  //If the ball hit the bottom of the stage, add some so
  //that the ball gradually rolls to a stop
  if (stageCollision) {
    if(stageCollision.has("bottom")) {
      ball.frictionX = 0.96;
    } else {
      ball.frictionX = 1;
    }
  }

  //Check for a collision between the ball and the pegs using the
  //universal `hit` method.
  //arguments: circle, arrayOfCircles, reactToCollision?,
  //bounceApart?, useGlobalPosition? 
  g.hit(ball, bricks.children, true, true, true);

  //Alternatively, use a `forEach` loop and the lower-level
  //`circleCollision` method
 
  /*
  bricks.children.forEach(brick => {
    
    //Make the ball bounce if it hits any of the pegs. Use the 
    //`circleCollision` function to check for collisions between
    //a moving circle and a stationary circle. Set the third argument to
    //`false` to prevent the circles from bouncing, and set the fourth
    //argument to `false` if you want to use the circle's local x/y
    //coordinates. (The global coordinates will be used by default)
    //`circleCollision` arguments:
    //movingCircle, stationaryCircle, bounce?, globalCoordinates?
    
    g.circleRectangleCollision(ball, brick, true, true);
  });
  */

}


