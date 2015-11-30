"use strict";

/*
Learn how to make an animated sprite using multiple frames 
in a texture atlas
*/

//Create a new Hexi instance, and start it.
//Load the texture atlas that inlcudes the animation frames you want
//to load
var g = hexi(256, 256, setup, ["images/pixieAtlas.json"]);
g.start();

//Set the background color and scale the canvas
//g.backgroundColor = "black";
g.scaleToWindow();

//Declare variables used in more than one function
var pixie = undefined;

//The `setup` function to initialize your application
function setup() {

  /*
    An easier way to create animated sprites is to use a texture atlas,
    made with a software tool like Texture Packer. Save the PNG and JSON 
    files that Texture Packer
    produces in the same "images" folder. Then load the JSON file when you
    initialize Hexi, as you can see at the beginning of this file. Next, create an array that
    lists the frame id names of all the images from the texture atlas
    that you want your sprite to contain. 
    */

  var pixieFrames = ["pixie0.png", "pixie1.png", "pixie2.png"];

  //Finally, initialize the sprite using the array of frames.
  pixie = g.sprite(pixieFrames);

  //That's a lot easier than the previous example!
  //You can now control the animation just like you did in the
  //previous example

  //Use the `play` method to play the pixie's frames.
  //The animation will loop unless you set the sprite's `loop`
  //property to `false`. Change the frame-rate with the
  //`fps` property (it's default value is `12`)

  pixie.fps = 24;
  pixie.playAnimation();

  //Use the `stop` method to stop an animation.
  //Here's an example of how you could stop the
  //pixie from flapping her wings after 3 seconds
  /*
  g.wait(3000, function(){
     pixie.stopAnimation(); 
  });
  */

  //You can use `gotoAndStop` to go to a specific frame number
  //pixie.gotoAndStop(2);

  /*
  You can also use the `show` method to display
  a specific frame. This is usually better to use than `gotoAndStop`
  because its more tightly integrated into the sprite's 
  state and animation manager.
  
      pixie.show(1);
  */

  //Optionally supply `playAnimation` with a range range of frames
  //that you'd like it to play.
  //pixie.fps = 1;
  //pixie.playAnimation([0, 1]);

  g.state = play;
}

function play() {

  //Make the pixie ease towards the pointer.
  //`followEase` arguments: follower, leader, speed
  g.followEase(pixie, g.pointer, 0.1);
}
//# sourceMappingURL=textureAtlasAnimation.js.map