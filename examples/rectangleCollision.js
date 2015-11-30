/*
Learn how to test for a collision between a two circles
*/

//Create a new Hexi instance, and start it.
let g = hexi(256, 256, setup);

//Set the background color and scale the canvas
//g.backgroundColor = "black";
g.scaleToWindow();

//Declare variables used in more than one function
let blue, red, message;

//If you're not loading any files, start Hexi after
//you've declared your global variables
g.start();

//The `setup` function to initialize your application
function setup() {

//Make a blue circle
  blue = g.circle(64, "blue");
  g.stage.putCenter(blue, blue.halfWidth + 16, blue.halfHeight +16);
  blue.draggable = true;
  
  //Make a red circle
  red = g.circle(64, "red");
  g.stage.putCenter(red, -red.radius -16, -red.radius -16);
  red.draggable = true;

  //Add some text 
  message = g.text(
    "Drag the circles...", 
    "16px sans-serif",
    "black", 10, 10
  );
    
  //Change the state to `play`
  g.state = play;  
}

//The `play` function will run in a loop
function play() {

  //Set the default message content 
  message.content = "Drag the circles...";

//Check for a collision between the blue and red circles using
  //the universal `hit` method.
  //The collision variable will be `true`
  //if there's a collision and `false` if there isn't
  //var collision = g.hit(blue, red);

  //Alternatively, you can use the lower-level `hitTestCircle` method.
  //`hitTestCircle` arguments:
  //sprite, sprite
  let collision = g.hitTestCircle(blue, red);

  //Change the message if there's a collision between the circles
  if(collision) {
    message.content = "Collision!"; 
  }
}

