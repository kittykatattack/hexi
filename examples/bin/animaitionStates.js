"use strict";

/*
Learn how to make an animated sprite using multiple frames 
in a texture atlas
*/

var thingsToLoad = ["images/forest.png", "images/walkcycle.png"];

//Create a new Hexi instance, and start it.
//Load the texture atlas that inlcudes the animation frames you want
//to load
var g = hexi(256, 256, setup, thingsToLoad);
g.start();

//Set the background color and scale the canvas
//g.backgroundColor = "black";
g.scaleToWindow();

//Declare variables used in more than one function
var elf = undefined,
    forest = undefined,
    leftArrow = undefined,
    upArrow = undefined,
    downArrow = undefined,
    rightArrow = undefined;

//The `setup` function to initialize your application
function setup() {

  //Make the forest background
  forest = g.sprite("images/forest.png");

  /*
  If you have a complex animation made up of sequential 
  tileset frames in a single image,  you can use 
  `filmStrip` to automatically create an array of x,y
  coordinates for each animation frame.
  `filmStrip` arguments:
  imageName, frameWidth, frameHeight, spacing
  (Use the final optional `spacing` argument if there is any default
  spacing (padding) around tileset frame images)
  */

  var walkingAnimation = g.filmstrip("images/walkcycle.png", 64, 64);

  //Now initialize the sprite with the film strip to create a sprite
  elf = g.sprite(walkingAnimation);

  //The sprite is now loaded up with all 36 frames of the animation

  //Set the elf's x and y position
  elf.setPosition(32, 128);

  //g.state = play;  
}

function play() {}
//# sourceMappingURL=animaitionStates.js.map