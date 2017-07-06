"use strict";

/*
Learn to create sprites that you can drag and drop
with the mouse or touch
*/

//Create a new Hexi instance, and start it.
var g = hexi(512, 512, setup, ["images/animals.json"]);
g.start();

//Set the background color and scale the canvas
//g.backgroundColor = "black";
g.scaleToWindow();

//Declare variables used in more than one function
var cat = undefined,
    hedgehog = undefined,
    tiger = undefined;

//The `setup` function to initialize your application
function setup() {

  //Create three sprites from images and set their `draggable` properties to `true`
  cat = g.sprite("cat.png");
  cat.draggable = true;

  tiger = g.sprite("tiger.png");
  tiger.draggable = true;
  tiger.setPosition(64, 64);

  hedgehog = g.sprite("hedgehog.png");
  hedgehog.draggable = true;
  hedgehog.setPosition(128, 128);

  //If you ever need to disable drag and drop, set Hexi's
  //`draggable` property to `false`, like this:
  //tiger.draggable = false;

  //Drag and drop sprite remain interactive even if there's no game loop
  //running in your application (like the `play` function, for example).
  //That's because they're updated by Hexi's internal game loop.
}
//# sourceMappingURL=dragAndDrop.js.map