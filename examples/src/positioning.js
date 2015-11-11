/*
This example demonstrates how to use Hexi's sprite positioning methods
to easily position sprites relative to each other. All these
methods follow this same basic format:

spriteA.putTop(spriteB, xOffset, yOffSet)
spriteA.putBottom(spriteB, xOffset, yOffSet)
spriteA.putLeft(spriteB, xOffset, yOffSet)
spriteA.putRight(spriteB, xOffset, yOffSet)
spriteA.putBottom(spriteB, xOffset, yOffSet)

These methods save you from having to write a lot of tedious positioning
code, and automatically compensate for any possible to change to 
each sprite's x/y anchor point.
Take a look at this example file to see how to use these very helpful
methods in practise.
*/

//The file you want to load
let thingsToLoad = [
  "images/rocket.png",
  "images/animals.json",
  "images/star.png"
];

//Create a new Hexi instance, and start it.
let g = hexi(256, 256, setup, thingsToLoad);
g.start();

//Scale and align the canvas inside the browser window
g.scaleToWindow();

//Declare global sprites, objects, and variables
//that you want to access in all the game functions and states
let box, ball, line, cat, tiger, 
    rocket, star, hedgehog;

//A `setup` function that will run only once.
//Use it for initialization tasks
function setup() {

  //Create a box
  box = g.rectangle(64, 64, "seaGreen", "hotPink", 4);

  //Set the box's pivot point to 0.5 so that it rotates around its
  //center point
  box.setPivot(0.5, 0.5);

  //Put the box in the center of the stage
  g.stage.putCenter(box);

  //Create a cat sprite and center its rotation pivot point
  cat = g.sprite("cat.png");
  cat.setPivot(0.5, 0.5);

  //Position the cat to the
  //left of the box, with an additional x offset of -16 pixels
  box.putLeft(cat, -16);

  tiger = g.sprite("tiger.png");
  tiger.setPivot(0.5, 0.5);
  box.putRight(tiger);

  hedgehog = g.sprite("hedgehog.png");
  hedgehog.setPivot(0.5, 0.5);
  box.putBottom(hedgehog);

  rocket = g.sprite("images/rocket.png");
  rocket.setPivot(0.5, 0.5);

  //Position the rocket on top of the box with a y offset of -20
  //pixels
  box.putTop(rocket, 0, -20);

  //Create a star and position it in the center of the box
  star = g.sprite("images/star.png");
  star.setPivot(0.5, 0.5);
  box.putCenter(star);

  //Change the game state to `play`
  g.state = play;  
}

//The `play` function will run in a loop
function play() {

  //Make the sprites rotate
  cat.rotation -= 0.01;
  tiger.rotation -= 0.01;
  hedgehog.rotation += 0.01;
  rocket.rotation += 0.01;
  star.rotation += 0.01;
}
