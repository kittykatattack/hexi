"use strict";

/*
Learn how to make an animated sprite using multiple image files as
animation frames
*/

//Load all the individual images that you want to use as animation
//frames
var thingsToLoad = ["images/pixie0.png", "images/pixie1.png", "images/pixie2.png"];

//Create a new Hexi instance, and start it.
var g = hexi(256, 256, setup, thingsToLoad);
g.start();

//Set the background color and scale the canvas
//g.backgroundColor = "black";
g.scaleToWindow();

//Declare variables used in more than one function
var pixie = undefined;

//The `setup` function to initialize your application
function setup() {

  /*
  Hexi has three main way that you can make sprites with animation frames.
  The first, lower level way, is to use the `frames` method. `frames`
  lets you list an array of x/y positions on an image that refer to
  each sub-image that you wan to use. The previous example showed you
  how to do that.
  You can also make animation frames from individual images files.
  Just feed the sprite any array containing the image files that you
  want to use for each frame.
  (The best way to make a sprite with multiple frames is to use a 
  texture atlas - see the next example.)
  */

  //You can make a sprite from an array of images, like this:
  pixie = g.sprite(["images/pixie0.png", "images/pixie1.png", "images/pixie2.png"]);

  //You can control the sprites using the same methods and properties
  //you learned in the previous example.

  //Use the `playAnimation` method to play the pixie's frames.
  //The animation will loop unless you set the sprite's `loop`
  //property to `false`. Change the frame-rate with the
  //`fps` property (it's default value is `12`)
  pixie.fps = 24;
  pixie.playAnimation();

  //Use the `stopAnimation` method to stop an animation.
  //Here's an example of how you could stop the
  //pixie from flapping her wings after 3 seconds
  /*
  g.wait(3000, function(){
     pixie.stopAnimation(); 
  });
  */

  //You can use `gotoAndStop` to go to a specific frame number
  //pixie.gotoAndStop(2);

  //You can also use the `show` method to display
  //a specific frame. This is usually better to use than `gotoAndStop`
  //because its more tightly integrated into the sprite's
  //state and animation manager.
  //pixie.show(1);

  //You can also use `playAnimation` to play a range of frames by
  //supplying it with an array of the numbers that you want to play
  //pixie.fps = 1;
  //pixie.playAnimation([0, 1]);

  g.state = play;
}

function play() {

  //Make the pixie ease towards the pointer.
  //`followEase` arguments: follower, leader, speed
  g.followEase(pixie, g.pointer, 0.1);
}
//# sourceMappingURL=keyframeAnimationImages.js.map