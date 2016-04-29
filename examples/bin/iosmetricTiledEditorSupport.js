"use strict";

/*

An example of how to use `makeIsoTiledWorld` to create
an isometric game world using Tiled Editor JSON map data. 
It uses the same API as its Cartesian equivalent `makeTiledWorld` method. 
However, you need to make sure you set Tile Editor up correctly and add s
ome custom map properties to make it work. Let's find out how.

###Configuring and building the map
Before you start creating your Tiled Editor map, prepare a sprite 
sheet with the isometric tiles that you want to use. And, 
very importantly, note down the isometric dimensions of sprites. 
Here are the pixel dimensions you need to know:

•   `tilewidth`: The width of the sprite, from its left to right edge.
•   `tileheight`: The height of the tileheighte’s base area. This is just the height of the squashed diamond shape which defines the base on which the isometric sprite is standing. Usually its half the `tilewidth` value.

These properties are the property names that are used by Tiled Editor, 
and you’ll be able to access them in the JSON data file 
that Tiled Editor generates.

You can now use the values to create a new isometric map in Tiled Editor. 
Open Tiled Editor and select File ~TRA New from the main menu. 
In the New Map dialog box, select isometric as the Orientation, 
and use the tilewidth and tileheight values I described above 
for the Width and Height. 

But we’re not done yet! There are three more values we need to figure out:

•   tileDepth: The total height of the isometric sprite, in pixels. 
•   cartWidth: The Cartesian width of each tile grid cell, in pixels.
•   cartHeight: The Cartesian height of each tile grid cell, in pixels.

You need to add these values as custom properties in Tiled Editor’s 
Map Properties panel.

When Tiled Editor generates the JSON map data, you'll be able to access these values in the `properties` field.
```
"properties":
    {
     "cartTileheight":"32",
     "cartTilewidth":"32",
     "tileDepth":"64"
    },
```
Now that you’ve got the Map Properties all set up, use your 
isometric tileset to build your world. 
When you're finished designing your map, export it as a JSON file, 
and you’re now ready to use it to start coding a game. Here's how to use 
`makeIsoTiledWorld` from the JSON map data and isometric `cubes.png` tileset. 
```
world = tu.makeIsoTiledWorld(
  "images/cubes.json",
  "images/cubes.png"
);
```
*/

//The files we want to load
var thingsToLoad = ["images/cubes.png", "images/cubes.json"];

//Create a new Hexi instance, and start it.
var g = hexi(512, 512, setup, thingsToLoad);

//Scale the canvas to the maximum browser dimensions
g.scaleToWindow();

//Declare variables used in more than one function
var world = undefined,
    leftArrow = undefined,
    upArrow = undefined,
    rightArrow = undefined,
    downArrow = undefined,
    message = undefined,
    wallLayer = undefined,
    player = undefined,
    wallMapArray = undefined;

//Start Hexi
g.start();

function setup() {

  //Make the world from the Tiled JSON data
  world = g.makeIsoTiledWorld("images/cubes.json", "images/cubes.png");

  //Add the world to the `stage`
  g.stage.addChild(world);

  //Position the world inside the canvas
  var canvasOffset = g.canvas.width / 2 - world.tilewidth / 2;
  world.x += canvasOffset;
  world.y = 0;

  //Get the objects we need from the world
  player = world.getObject("player");
  wallLayer = world.getObject("wallLayer");

  //Add the player to the wall layer and set it at
  //the same depth level as the walls
  wallLayer.addChild(player);
  player.z = 0;
  wallLayer.children.sort(byDepth);

  //Initialize the player's velocity to zero
  player.vx = 0;
  player.vy = 0;

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
  wallMapArray = wallLayer.data;

  //Use `hitTestIsoTile` to check for a collision
  var playerVsGround = g.hitTestIsoTile(player, wallMapArray, 0, world, "every");

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

  //Depth sort the sprites if the player is moving
  if (player.vx !== 0 || player.vy !== 0) {
    wallLayer.children.sort(g.byDepth);
  }

  //Display the player's x, y and index values
  message.content = "index: " + player.index;
}
//# sourceMappingURL=iosmetricTiledEditorSupport.js.map