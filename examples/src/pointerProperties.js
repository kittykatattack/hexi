/*
Learn how to make use and access Hexi's built in universal `pointer`
that works with both touch and the mouse.
*/

//Create a new Hexi instance, and start it.
let g = hexi(256, 256, setup);

//Set the background color and scale the canvas
g.backgroundColor = "gray";
//g.scaleToWindow();

//Declare variables used in more than one function
let output;

//Start Hexi
g.start();

//The `setup` function to initialize your application
function setup() {

  //Get a reference to the output <p> tag 
  output = document.querySelector("p");

  //Add a custom `press` method
  g.pointer.press = () => {console.log("The pointer was pressed");}

  //Add a custom `release` method
  g.pointer.release = () => {console.log("The pointer was released");}

  //Add a custom `tap` method
  g.pointer.tap = () => {console.log("The pointer was tapped");}

  //Change the game state to `play`
  g.state = play;  
}

//The `play` function will run in a loop
function play() {

  //Display the pointer properties in the 
  //HTML <p> tag called `output`
  output.innerHTML = 
    `Pointer properties: <br>
     pointer.x: ${g.pointer.x} <br>
     pointer.y: ${g.pointer.y} <br>
     pointer.isDown: ${g.pointer.isDown} <br>
     pointer.isUp: ${g.pointer.isUp} <br>
     pointer.tapped: ${g.pointer.tapped}<br>
     <br>
     Open the console window to see the result of the "press", 
     "release" and "tap" methods.`;
}

