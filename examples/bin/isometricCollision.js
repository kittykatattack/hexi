"use strict";

/*
Isometric tile collision detection using `hitTestIsoTile`
*/

//Create a new Hexi instance, and start it.
var g = hexi(512, 512, setup);

//Scale the canvas to the maximum browser dimensions
g.scaleToWindow();

//Declare variables used in more than one function
var world = undefined,
    leftArrow = undefined,
    upArrow = undefined,
    rightArrow = undefined,
    downArrow = undefined,
    message = undefined,
    player = undefined,
    groundLayer = undefined,
    wallMapArray = undefined;

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

            //Define this sprite as the `player`
            player = sprite;
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
  world.y = 0;

  //Make a text object
  message = g.text("", "16px Futura", "black");
  message.setPosition(5, 0);

  //Create the keyboard objects
  leftArrow = g.keyboard(37);
  upArrow = g.keyboard(38);
  rightArrow = g.keyboard(39);
  downArrow = g.keyboard(40);

  //Assign the key `press` actions
  player.direction = "none";
  leftArrow.press = function () {
    return player.direction = "left";
  };
  upArrow.press = function () {
    return player.direction = "up";
  };
  rightArrow.press = function () {
    return player.direction = "right";
  };
  downArrow.press = function () {
    return player.direction = "down";
  };
  leftArrow.release = function () {
    return player.direction = "none";
  };
  upArrow.release = function () {
    return player.direction = "none";
  };
  rightArrow.release = function () {
    return player.direction = "none";
  };
  downArrow.release = function () {
    return player.direction = "none";
  };

  //Set the game state to `play`
  g.state = play;
}

function play() {

  //Change the player character's velocity if it's centered over a grid cell
  if (Math.floor(player.cartX) % world.cartTilewidth === 0 && Math.floor(player.cartY) % world.cartTileheight === 0) {
    switch (player.direction) {
      case "up":
        player.vy = -2;
        player.vx = 0;
        break;
      case "down":
        player.vy = 2;
        player.vx = 0;
        break;
      case "left":
        player.vx = -2;
        player.vy = 0;
        break;
      case "right":
        player.vx = 2;
        player.vy = 0;
        break;
      case "none":
        player.vx = 0;
        player.vy = 0;
        break;
    }
  }

  //Update the player's Cartesian position
  //based on its velocity
  player.cartY += player.vy;
  player.cartX += player.vx;

  //Wall collision
  //Get a reference to the wall map array
  wallMapArray = world.layers[0];

  //Use `hiteTestIsoTile` to check for a collision
  var playerVsGround = g.hitTestIsoTile(player, wallMapArray, 1, world, "every");

  //If there's a collision, prevent the player from moving.
  //Subtract its velocity from its position and then set its velocity to zero
  if (!playerVsGround.hit) {
    player.cartX -= player.vx;
    player.cartY -= player.vy;
    player.vx = 0;
    player.vy = 0;
  }

  //Add world boundaries
  var top = 0,
      bottom = world.heightInTiles * world.cartTileheight,
      left = 0,
      right = world.widthInTiles * world.cartTilewidth;

  //Prevent the player from crossing any of the world boundaries
  //Top
  if (player.cartY < 0) {
    player.cartY = top;
  }

  //Bottom
  if (player.cartY + player.cartHeight > bottom) {
    player.cartY = bottom - player.cartHeight;
  }

  //Left
  if (player.cartX < left) {
    player.cartX = left;
  }

  //Right
  if (player.cartX + player.cartWidth > right) {
    player.cartX = right - player.cartWidth;
  }

  //Position the sprite's screen `x` and `y` position
  //using its isometric coordinates
  player.x = player.isoX;
  player.y = player.isoY;

  //Get the player's index position in the map array
  player.index = g.getIndex(player.cartX, player.cartY, world.cartTilewidth, world.cartTileheight, world.widthInTiles);

  //Display the player's x, y and index values
  message.content = "index: " + player.index;
}
//# sourceMappingURL=isometricCollision.js.map