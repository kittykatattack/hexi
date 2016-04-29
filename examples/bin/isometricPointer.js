"use strict";

/*
An example of how to use a pointer to select isometric tiles.
*/

//Create a new Hexi instance, and start it.
var g = hexi(512, 512, setup);

//Scale the canvas to the maximum browser dimensions
g.scaleToWindow();

//Declare variables used in more than one function
var world = undefined,
    message = undefined;

//Start Hexi
g.start();

function setup() {

  //Create the `world` container that defines our isometric
  //tile-based world
  world = g.group();

  //Set the `tileWidth` and `tileHeight` of each tile, in pixels
  world.cartTilewidth = 32;
  world.cartTileheight = 32;

  //Define the width and height of the world, in tiles
  world.widthInTiles = 8;
  world.heightInTiles = 8;

  //Create the world layers
  world.layers = [

  //The environment layer. `2` represents the walls,
  //`1` represents the floors
  [2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 2, 2, 1, 2, 1, 1, 2, 1, 2, 2, 1, 1, 1, 1, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 1, 2, 1, 1, 2, 2, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2],

  //The character layer. `3` represents the game character
  //`0` represents an empty cell which won't contain any
  //sprites
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]];

  //Build the game world by looping through each of the arrays
  world.layers.forEach(function (layer) {

    //Loop through each array element
    layer.forEach(function (gid, index) {

      //If the cell isn't empty (0) then create a sprite
      if (gid !== 0) {

        //Find the column and row that the sprite is on and also
        //its x and y pixel values.
        var column = undefined,
            row = undefined,
            x = undefined,
            y = undefined;
        column = index % world.widthInTiles;
        row = Math.floor(index / world.widthInTiles);
        x = column * world.cartTilewidth;
        y = row * world.cartTileheight;

        //Next, create a different sprite based on what its
        //`gid` number is
        var sprite = undefined;
        switch (gid) {

          //The floor
          case 1:

            //Create a sprite using an isometric rectangle
            sprite = g.isoRectangle(world.cartTilewidth, world.cartTileheight, 0xCCCCFF);
            //Cartesian rectangle:
            //sprite = g.rectangle(world.cartTilewidth, world.cartTileheight, 0xCCCCFF);
            break;

          //The walls
          case 2:
            sprite = g.isoRectangle(world.cartTilewidth, world.cartTileheight, 0x99CC00);
            //Cartesian rectangle:
            //sprite = g.rectangle(world.cartTilewidth, world.cartTileheight, 0x99CC00);
            break;

          //The character 
          case 3:
            sprite = g.isoRectangle(world.cartTilewidth, world.cartTileheight, 0xFF0000);
          //Cartesian rectangle:
          //sprite = g.rectangle(world.cartTilewidth, world.cartTileheight, 0xFF0000);
        }

        //Add these properties to the sprite
        g.addIsoProperties(sprite, x, y, world.cartTilewidth, world.cartTileheight);

        //Set the sprite's `x` and `y` pixel position based on its
        //isometric coordinates
        sprite.x = sprite.isoX;
        sprite.y = sprite.isoY;

        //Cartesian positioning
        //sprite.x = sprite.cartX;
        //sprite.y = sprite.cartY;

        //Add the sprite to the `world` container
        world.addChild(sprite);
      }
    });
  });

  //Position the world inside the canvas
  var canvasOffset = g.canvas.width / 2 - world.cartTilewidth;
  world.x += canvasOffset;
  world.y = 150;

  //Make a text object
  message = g.text("", "16px Futura", "black");
  message.setPosition(5, 0);

  //Add isometric properties to the pointer
  g.makeIsoPointer(g.pointer, world);

  //Set the game state to `play`
  g.state = play;
}

function play() {
  message.content = "\n    cartX: " + Math.floor(g.pointer.cartX) + "\n    cartY: " + Math.floor(g.pointer.cartY) + "\n    column: " + g.pointer.column + " \n    row: " + g.pointer.row + "\n    index: " + g.pointer.index + "\n    layer 1 gid: " + world.layers[0][Math.floor(g.pointer.index)] + "\n    layer 2 gid: " + world.layers[1][Math.floor(g.pointer.index)] + "\n  ";
}
//# sourceMappingURL=isometricPointer.js.map