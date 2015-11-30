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

  //Make a blue square
  blue = g.rectangle(64, 64, "blue");
  g.stage.putCenter(blue, blue.halfWidth + 16, blue.halfHeight + 16);
  blue.draggable = true;
  
  //Make a red circle
  red = g.circle(64, "red");
  g.stage.putCenter(red, -red.halfWidth -16, -red.halfWidth -16);
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
  message.content = "Drag the shapes...";

  //Check for a collision between the blue and red squares.
  //The collision variable will be `true`
  //if there's a collision and `false` if there isn't
  let collision = g.hit(red, blue);

  //Alternatively, you can use the lower-level hitTestRectangle method.
  //`hitTestCircleRectangle` arguments:
  //circularSprite, rectangularSprite
  //let collision = g.hitTestCircleRectangle(red, blue);

  //Change the message if there's a collision between the circles
  if(collision) {
    message.content = "Collision!"; 
  }
}


