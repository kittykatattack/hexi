"use strict";

/*
A mask is a shape that hides any part of a sprite that’s 
outside of the shape’s area. Learn to use a sprite's `mask`
property to use a shape to mask a sprite.
*/

//Create an array of files you want to load
var thingsToLoad = ["images/animals.json"];

//Create a new Hexi instance, and start it, using the `thingsToLoad`
//array.
var g = hexi(256, 256, setup, thingsToLoad);
g.start();

//Set the background color and scale the canvas
//g.backgroundColor = "black";
g.scaleToWindow();

//Declare variables used in more than one function
var cat = undefined,
    box = undefined;

//The `setup` function to initialize your application
function setup() {

  //Create some sprites
  cat = g.sprite("cat.png");
  box = g.rectangle(64, 64);

  //Scale the cat to twice its size
  cat.setScale(2, 2);

  //Center the cat
  g.stage.putCenter(cat);

  //Center the box over the cat
  cat.putCenter(box);

  //Set the cat's `mask` property to the `box`
  cat.mask = box;
}

//The `play` function will run in a loop
function play() {

  //The play state is not needed in this example
}
//# sourceMappingURL=masking.js.map