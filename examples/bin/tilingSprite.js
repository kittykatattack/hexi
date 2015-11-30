"use strict";

/*
Learn how to create and use a `tilingSprite`: a sprite with a 
tiled repeating background pattern. You use them as the basis for making a 
scrolling background image.
*/

//Create a new Hexi instance, and start it.
var g = hexi(256, 256, setup, ["images/tile.png"]);
g.start();

//Set the background color and scale the canvas
//g.backgroundColor = "black";
g.scaleToWindow();

//Declare variables used in more than one function
var box = undefined;

//The `setup` function to initialize your application
function setup() {

  //Create a sprite with an image that you can tile across its surface. The first argument is
  //the source for the tile image. You can use ordinary images,
  //texture atlas frames, or an array of image sources if you want to
  //tiling sprite with multiple frames. The second and third arguments
  //are the sprite's width and height, which determine the entire area that
  //the tile pattern should fill. You can optionally supply the x and y
  //position as the fourth and fifth arguments
  box = g.tilingSprite("images/tile.png", 128, 128);

  //Center the box
  g.stage.putCenter(box);

  //Set the game state to `play`
  g.state = play;
}

//The `play` function will run in a loop
function play() {

  //Tiling sprites have `tileX`, `tileY`, `tileScaleX` and
  //`tileScaleY` properties that you can use to scroll and scale the
  //sprite's background image

  //Scroll the sprite's tile pattern using the
  //`tileX` and `tileY` properties
  box.tileX += 1;
  box.tileY += 1;

  //Optionally use the `tileScaleX` and `tileScaleY` properties to
  //change the tiling sprite's scale
  //box.tileScaleX += 0.001;
  //box.tileScaleY += 0.001;
}
//# sourceMappingURL=tilingSprite.js.map