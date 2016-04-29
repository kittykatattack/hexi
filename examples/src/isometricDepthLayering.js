/*
How to use Hexi's `byDepth` array for function to accurately depth-sort 3D
isometric sprites
*/

//The images we want to load
let thingsToLoad = ["images/isoTileset.png"];

//Create a new Hexi instance, and start it.
let g = hexi(512, 512, setup, thingsToLoad);

//Scale the canvas to the maximum browser dimensions
g.scaleToWindow();

//Declare variables used in more than one function
let world, leftArrow, upArrow,
  rightArrow, downArrow, message,
  player, groundLayer, wallMapArray;

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

    //The floor layer
    [
      1, 1, 1, 1, 1, 1, 1, 1,
      1, 1, 1, 1, 1, 1, 1, 1,
      1, 1, 1, 1, 1, 1, 1, 1,
      1, 1, 1, 1, 1, 1, 1, 1,
      1, 1, 1, 1, 1, 1, 1, 1,
      1, 1, 1, 1, 1, 1, 1, 1,
      1, 1, 1, 1, 1, 1, 1, 1,
      1, 1, 1, 1, 1, 1, 1, 1
    ],

    //The wall layer
    [
      2, 2, 2, 2, 2, 2, 2, 2,
      2, 0, 0, 0, 0, 0, 0, 2,
      2, 0, 2, 0, 0, 2, 0, 2,
      2, 0, 0, 0, 0, 2, 2, 2,
      2, 0, 0, 0, 0, 0, 0, 2,
      2, 2, 2, 0, 2, 0, 0, 2,
      2, 0, 0, 0, 0, 0, 0, 2,
      2, 2, 2, 2, 2, 2, 2, 2
    ],

    //The player layer
    [
      0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 3, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0
    ]
  ];

  //The `z` index
  let z = 0;

  //Build the game world by looping through each of the arrays
  world.layers.forEach(layer => {

    //Loop through each array element
    layer.forEach((gid, index) => {

      //If the cell isn't empty (0) then create a sprite
      if (gid !== 0) {

        //Find the column and row that the sprite is on and also
        //its x and y pixel values.
        let column, row, x, y;
        column = index % world.widthInTiles;
        row = Math.floor(index / world.widthInTiles);
        x = column * world.cartTilewidth;
        y = row * world.cartTileheight;

        //Next, create a different sprite based on what its 
        //`gid` number is
        let sprite;
        switch (gid) {

          //The floor
          case 1:
            sprite = g.sprite(g.frame("images/isoTileset.png", 128, 0, 64, 64));
            break;

            //The walls
          case 2:
            sprite = g.sprite(g.frame("images/isoTileset.png", 0, 0, 64, 64));
            break;

            //The player
          case 3:
            sprite = g.sprite(g.frame("images/isoTileset.png", 64, 0, 64, 64));
            player = sprite;
            break;
        }


        //Add these properties to the sprite
        g.addIsoProperties(sprite, x, y, world.cartTilewidth, world.cartTileheight);

        //Set the sprite's `x` and `y` pixel position based on its
        //isometric coordinates
        sprite.x = sprite.isoX;
        sprite.y = sprite.isoY;

        //Add the new `z` depth property to the sprite
        sprite.z = z;

        //Cartesian positioning
        //sprite.x = sprite.cartX;
        //sprite.y = sprite.cartY;

        //Add the sprite to the `world` container
        world.addChild(sprite);
      }
    });

    //Add `1` to `z` for each new layer  
    z += 1;
  });

  //Move the player into the environment's depth layer
  player.z = 1;

  //Sort the world by depth
  world.children.sort(g.byDepth);

  //Position the world inside the canvas
  let canvasOffset = (g.canvas.width / 2) - world.cartTilewidth;
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
  leftArrow.press = () => player.direction = "left";
  upArrow.press = () => player.direction = "up";
  rightArrow.press = () => player.direction = "right";
  downArrow.press = () => player.direction = "down";
  leftArrow.release = () => player.direction = "none";
  upArrow.release = () => player.direction = "none";
  rightArrow.release = () => player.direction = "none";
  downArrow.release = () => player.direction = "none";

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
  wallMapArray = world.layers[1];

  //Use `hiteTestIsoTile` to check for a collision
  let playerVsGround = g.hitTestIsoTile(player, wallMapArray, 0, world, "every");

  //If there's a collision, prevent the player from moving.
  //Subtract its velocity from its position and then set its velocity to zero
  if (!playerVsGround.hit) {
    player.cartX -= player.vx;
    player.cartY -= player.vy;
    player.vx = 0;
    player.vy = 0;
  }

  //Add world boundaries
  let top = 0,
    bottom = (world.heightInTiles * world.cartTileheight),
    left = 0,
    right = (world.widthInTiles * world.cartTilewidth);

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

  //Position the sprite's sceen `x` and `y` position
  //using its isometric coordinates
  player.x = player.isoX;
  player.y = player.isoY;

  //Get the player's index position in the map array
  player.index = g.getIndex(
    player.cartX, player.cartY,
    world.cartTilewidth, world.cartTileheight, world.widthInTiles
  );

  //Depth sort the sprites if the player is moving
  if (player.vx !== 0 || player.vy !== 0) {
    world.children.sort(g.byDepth);
  }

  //Display the player's x, y and index values
  message.content = `index: ${player.index}`;
}