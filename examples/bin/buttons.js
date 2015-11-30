"use strict";

/*
Learn how to make an interactive button with three
states: up, over and down.
*/

var thingsToLoad = ["images/buttonFrames.png", "fonts/puzzler.otf", "images/button.json"];

//Create a new Hexi instance, and start it.
var g = hexi(256, 256, setup, thingsToLoad);
g.start();

//Set the background color and scale the canvas
//g.backgroundColor = "black";
g.scaleToWindow();

//Declare variables used in more than one function
var button = undefined,
    stateMessage = undefined,
    actionMessage = undefined;

//The `setup` function to initialize your application
function setup() {

  //Create and array with texture atlas frame id names of each
  //button state, in this order: up, over and down. If only two frames
  //are supplied, they'll be used for the up and down states
  var buttonFrames = ["up.png", "over.png", "down.png"];

  //Alternatively, you can use the `frames` method to make a button
  //from a single tileset image that contains sub-images which
  //represent each button state
  /*
  let buttonFrames = g.frames(
    "images/buttonFrames.png",   //The tileset image
    [[0,0],[0,96],[0,192]],      //The `x` and `y` positions of the frames
    192, 96                      //The `width` and `height` of each frame
  );
  */

  //Make a `button` using the frames
  button = g.button(buttonFrames);

  //Assign the button's optional and customizable `press`, `release`,
  //`over`, `out` and `tap` actions
  button.press = function () {
    return console.log("pressed");
  };
  button.release = function () {
    return console.log("released");
  };
  button.over = function () {
    return console.log("over");
  };
  button.out = function () {
    return console.log("out");
  };
  button.tap = function () {
    return console.log("tapped");
  };

  //Position the button
  button.x = g.canvas.width / 2 - 96;
  button.y = g.canvas.height / 2 - 48;

  //Some text to display the button's state and action
  stateMessage = g.text("State not set", "14px puzzler", "black");
  stateMessage.x = 12;
  stateMessage.y = 12;

  actionMessage = g.text("Action not set", "14px puzzler", "black");
  actionMessage.x = 12;
  actionMessage.y = 32;

  //Buttons remain interactive even if there's no game loop running.
  g.state = play;
}

//The `play` function will run in a loop
function play() {

  //Display the button's current state and action
  stateMessage.content = "State: " + button.state;
  actionMessage.content = "Action: " + button.action;
}
//# sourceMappingURL=buttons.js.map