/*
Learn how to make an animated sprite
*/

//Create a new Hexi instance, and start it.
//Load an image file with more than one animation frame
let g = hexi(256, 256, setup, ["images/pixieFrames.png"]);
g.start();

//Set the background color and scale the canvas
//g.backgroundColor = "black";
g.scaleToWindow();

//Declare variables used in more than one function
let pixie;

//The `setup` function to initialize your application
function setup() {

/*
  Hexi has three way that you can make sprites with animation frames.
  The first, lower level way, is to use the `frames` method. `frames`
  lets you list an array of x/y positions on an image that refer to
  each sub-image that you wan to use. Here's how to use it:
  */   

  //Create the pixie's animation frames using the `frames` method
  let pixieFrames = g.frames(
    "images/pixieFrames.png", //The tileset image
    [[0,0],[48,0],[96,0]],    //The `x` and `y` positions of frames
    48, 32                    //The `width` and `height` of each frame
  );

  //Make a sprite using the frames
  pixie = g.sprite(pixieFrames);

  //You can also make a sprite with multiple frames by supplying the
  //sprite with an array of image file names. See the next example file
  //if you want to find out how to do that.
  //But the best way to make a sprite with multiple frames is to use
  //a texture atlas. Another example file ahead will show you how. But 
  //no matter how you add frames to a sprite, you control those frames
  //same way, which you'll learn next.

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


