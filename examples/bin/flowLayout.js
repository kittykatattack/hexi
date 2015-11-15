"use strict";

/*
Learn to layout sprites using the `flow` methods. Each

flowRight(padding, spriteOne, spriteTwo, spriteThree, etc);

The first argument, `padding` is the space, in pixels, that you want to leave
between sprites. After that, just list the sprites you want to
align. (You can alternatively supply an array containing sprites, if you want to.)

(Historical note: This feature was taken from the Elm programming language)
*/

//Create an array of files you want to load
var thingsToLoad = ["images/animals.json"];

//Create a new Hexi instance, and start it, using the `thingsToLoad`
//array.
//A texture atlas in Texture Packer JSON format
var g = hexi(512, 512, setup, thingsToLoad);
g.start();

//Set the background color and scale the canvas
//g.backgroundColor = "black";
g.scaleToWindow();

//Declare variables used in more than one function
var cat = undefined,
    tiger = undefined,
    hedgehog = undefined;

//The `setup` function to initialize your application
function setup() {

  //Create some sprites
  cat = g.sprite("cat.png");
  tiger = g.sprite("tiger.png");
  hedgehog = g.sprite("hedgehog.png");

  //Put the cat in the center of the canvas
  g.stage.putCenter(cat);

  //Flow the other animals to the right of the
  //cat, with 10 pixels of padding between them
  g.flowRight(10, cat, hedgehog, tiger);

  //You can alternatively flow an array containing sprite objects,
  //like this:
  //let animals = g.group(cat, tiger, hedgehog);
  //g.flowRight(10, animals.children);

  //Here's how to use the other flow methods:
  //g.flowDown(10, cat, hedgehog, tiger);
  //g.flowLeft(10, cat, hedgehog, tiger);
  //g.flowUp(10, cat, hedgehog, tiger);

  //Change the game state to `play`
  //g.state = play;
}

//The `play` function will run in a loop
function play() {

  //The play state is not needed in this example

}
//# sourceMappingURL=flowLayout.js.map