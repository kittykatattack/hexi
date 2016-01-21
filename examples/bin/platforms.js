"use strict";

/*
Learn how to use Hexi to build a complex
platform game prototype
*/

var thingsToLoad = ["images/platforms.png", "fonts/puzzler.otf"];

//Create a new Hexi instance, and start it.
var g = hexi(512, 512, setup, thingsToLoad);

//Set the background color and scale the canvas
//g.backgroundColor = "black";
g.scaleToWindow();

//Declare variables used in more than one function
var level = undefined,
    world = undefined,
    player = undefined,
    output = undefined,
    score = undefined;

//If you're not loading any files, start Hexi after
//you've declared your global variables
g.start();

//The `setup` function to initialize your application
function setup() {

  //Create a `level` object with some basic data about the game world
  var level = {

    //The height and width of the level, in tiles
    widthInTiles: 16,
    heightInTiles: 16,

    //The width and height of each tile, in pixels
    tilewidth: 32,
    tileheight: 32,

    //Tileset image properties. You could use a texture atlas, but
    //let's go old-skool on this one and just blit from directly from
    //an image
    tileset: {

      //The source image
      source: "images/platforms.png",

      //The x/y coordinates for the sprites on the tileset
      player: [32, 32],
      treasure: [32, 0],
      cloud: [64, 0],
      sky: [64, 32],
      rock: [0, 32],
      grass: [0, 0]
    }
  };

  //Use the level to make the game world. See the `makeWorld` function
  //below for details on how it works. It creates a random platform
  //game environment procedurally. It returns a `group` sprite that
  //contains all the game objects we'll need.
  world = makeWorld(level);

  //Get a reference to the `player` sprite
  player = world.player;

  //Add some text to display the score
  output = g.text("score: ", "16px puzzler", "white", 32, 8);

  //Intialize the game score
  score = 0;

  //Assign the player's keyboard keys
  var leftArrow = g.keyboard(37),
      rightArrow = g.keyboard(39),
      spaceBar = g.keyboard(32);

  //Left arrow key
  leftArrow.press = function () {
    if (rightArrow.isUp) {
      player.accelerationX = -0.2;
    }
  };
  leftArrow.release = function () {
    if (rightArrow.isUp) {
      player.accelerationX = 0;
    }
  };
  //Right arrow key
  rightArrow.press = function () {
    if (leftArrow.isUp) {
      player.accelerationX = 0.2;
    }
  };
  rightArrow.release = function () {
    if (leftArrow.isUp) {
      player.accelerationX = 0;
    }
  };
  //Space key (jump)
  spaceBar.press = function () {
    if (player.isOnGround) {
      player.vy += player.jumpForce;
      player.isOnGround = false;
      player.frictionX = 1;
    }
  };

  //Change the state to `play`
  g.state = play;
}

//The `play` function will run in a loop
function play() {

  //Regulate the amount of friction acting on the player.
  //The is the most important variable to set if you want to
  //fine-tune the feel of the player control
  if (player.isOnGround) {

    //Add some friction if the player is on the ground
    player.frictionX = 0.92;
  } else {

    //Add less friction if it's in the air
    player.frictionX = 0.97;
  }

  //Apply the acceleration
  player.vx += player.accelerationX;
  player.vy += player.accelerationY;

  //Apply friction
  player.vx *= player.frictionX;

  //Apply gravity
  player.vy += player.gravity;

  //Move the player
  g.move(player);

  //Use the `hit` method to check for a collision between the
  //player and the platforms
  var playerVsPlatforms = g.hit(player, world.platforms, true, false, false, function (collision, platform) {

    //Use the collision variable to figure out what side of the player
    //is hitting the platform
    if (collision) {
      if (collision === "bottom" && player.vy >= 0) {

        //Tell the game that the player is on the ground if
        //it's standing on top of a platform
        player.isOnGround = true;

        //Neutralize gravity by applying its
        //exact opposite force to the character's vy
        //player.vy = -player.gravity;
        player.vy = -player.gravity;
      } else if (collision === "top" && player.vy <= 0) {
        player.vy = 0;
      } else if (collision === "right" && player.vx >= 0) {
        player.vx = 0;
      } else if (collision === "left" && player.vx <= 0) {
        player.vx = 0;
      }

      //Set `isOnGround` to `false` if the bottom of the player
      //isn't touching the platform
      if (collision !== "bottom" && player.vy > 0) {
        player.isOnGround = false;
      }
    }
  });

  //Alternatively, use `forEach` and the lower-level
  //`rectangleCollision` method to achieve the same thing
  /*
  //Check for collisions between the player and the platforms
  world.platforms.forEach(function(platform) {
     //Use `rectangleCollision` to prevent the player and platforms
    //from overlapping  
    let collision = g.rectangleCollision(player, platform);
    
    //Use the collision variable to figure out what side of the player
    //is hitting the platform
    if(collision === "bottom" && player.vy >= 0) {
      //Tell the game that the player is on the ground if 
      //it's standing on top of a platform
      player.isOnGround = true;
      //Neutralize gravity by applying its
      //exact opposite force to the character's vy
      player.vy = -player.gravity;
    }
    else if(collision === "top" && player.vy <= 0) {
      player.vy = 0;
    }
    else if(collision === "right" && player.vx >= 0) {
      player.vx = 0;
    }
    else if(collision === "left" && player.vx <= 0) {
      player.vx = 0;
    }
    //Set `isOnGround` to `false` if the bottom of the player
    //isn't touching the platform
    if(collision !== "bottom" && player.vy > 0) {
      player.isOnGround = false;
    }
  });
  */

  //Treasure collection
  //Use `filter` and `hit` to check whether the player is touching a
  //star. If it is, add 1 to the score, remove the `star` sprite and filter it out of the
  //`world.treasure` array
  world.treasure = world.treasure.filter(function (star) {
    if (g.hit(player, star)) {
      score += 1;
      g.remove(star);
      return false;
    } else {
      return true;
    }
  });

  //Display the score
  output.content = "score: " + score;

  //That's it! The game code is finished here
  //Just keep reading if you want to find out how the
  //`makeWorld` function works
}

//`makeWorld` is a function that uses data from the level` object
//to create a random platform game world procedurally. There are many
//way you could do this, so this is just an idea to help you get
//started making your own procedural game levels

function makeWorld(level) {

  //create the `world` object
  var world = g.group();

  //Add some arrays to the world that will store the objects that we're
  //going to create
  world.map = [];
  world.itemLocations = [];
  world.platforms = [];
  world.treasure = [];

  //Important world object that we're going to create
  world.player = null;

  //1. Make the map
  makeMap();

  //2. Terraform the map
  terraformMap();

  //3. Add the items
  addItems();

  //4. Make the sprites
  makeTileSprites();

  //If you want to see what the world looks likes using simple shapes,
  //use `makeSprites` instead of `makeTileSprites`
  //makeSprites();

  function makeMap() {
    //The `cellIsAlive` helper function.
    //Give each cell a 1 in 4 chance to live. If it's "alive", it will
    //be rock, if it's "dead" it will be sky
    var cellIsAlive = function cellIsAlive() {
      return g.randomInt(0, 3) === 0;
    };

    //A loop creates a `cell` object for each
    //grid cell on the map. Each `cell` has a name, and a `x` and `y`
    //position. The loop uses the `cellIsAlive` function to
    //give each cell a 25% chance of being "rock" and a 75%
    //chance of being "sky".
    //First, figure out the number of cells in the grid
    var numberOfCells = level.heightInTiles * level.widthInTiles;

    //Next, create the cells in a loop
    for (var i = 0; i < numberOfCells; i++) {

      //Figure out the x and y position
      var x = i % level.widthInTiles,
          y = Math.floor(i / level.widthInTiles);
      //Create the `cell` object
      var cell = {
        x: x,
        y: y,
        item: ""
      };

      //Decide whether the cell should be "rock" or "sky"
      if (cellIsAlive()) {
        cell.terrain = "rock";
      } else {
        cell.terrain = "sky";
      }

      //Push the cell into the world's `map` array
      world.map.push(cell);
    }
  }

  function terraformMap() {

    //Improve the map by adding a border and grass.
    //A `getIndex` helper function to convert the cell x and y position to an
    //array index number
    var getIndex = function getIndex(x, y) {
      return x + y * level.widthInTiles;
    };

    world.map.forEach(function (cell, index, map) {

      //Some variables to help find the cells to the left, right, below
      //and above the current cell
      var cellTotheLeft = world.map[getIndex(cell.x - 1, cell.y)],
          cellTotheRight = world.map[getIndex(cell.x + 1, cell.y)],
          cellBelow = world.map[getIndex(cell.x, cell.y + 1)],
          cellAbove = world.map[getIndex(cell.x, cell.y - 1)],
          cellTwoAbove = world.map[getIndex(cell.x, cell.y - 2)];

      //If the cell is on the border of the map, change its name to "border"
      if (cell.x === 0 || cell.y === 0 || cell.x === level.widthInTiles - 1 || cell.y === level.heightInTiles - 1) {
        cell.terrain = "border";
      } else {

        //If the cell isn't on the border, find out if we can
        //grow some grass on it. Any rock with a sky cell above
        //it should be made into grass. Here's how to figure this out:
        //1. Is the cell a rock?
        if (cell.terrain === "rock") {

          //2. Is there sky directly above it?
          if (cellAbove && cellAbove.terrain === "sky") {

            //3. Yes there is, so change its name to "grass"
            cell.terrain = "grass";

            //4. Make sure there are 2 sky cells above grass cells
            //so that it's easy to jump to higher platforms
            //without bumping your head. Change any rock cells that are
            //2 above the current grass cell to "sky"
            if (cellTwoAbove) {
              if (cellTwoAbove.terrain === "rock" || cellTwoAbove.terrain === "grass") {
                cellTwoAbove.terrain = "sky";
              }
            }
          }
        }
      }
    });

    //We now have the finished map.
    //Next, we're going to loop through the map one more time
    //to find all the item location cells and push them into the
    //itemLocations array. itemLocations is a list of cells that
    //we'll use later to place the player and treasure
    world.map.forEach(function (cell, index, map) {
      //Is the cell a grass cell?
      if (cell.terrain === "grass") {
        //Yes, so find the cell directly above it and push it
        //into the itemLocations array
        var cellAbove = world.map[getIndex(cell.x, cell.y - 1)];
        world.itemLocations.push(cellAbove);
      }
    });
  }

  function addItems() {

    //The `findStartLocation` helper function returns a random cell
    var findStartLocation = function findStartLocation() {

      //Randomly choose a start location from the itemLocations array
      var randomIndex = g.randomInt(0, world.itemLocations.length - 1);
      var location = world.itemLocations[randomIndex];

      //Splice the cell from the array so we don't choose the
      //same cell for another item
      world.itemLocations.splice(randomIndex, 1);
      return location;
    };

    //1. Add the player
    //Find a random cell from the itemLocations array
    var cell = findStartLocation();
    cell.item = "player";

    //2. Add 3 treasure boxes
    for (var i = 0; i < 3; i++) {
      cell = findStartLocation();
      cell.item = "treasure";
    }
    //console.table(world.map);
  }

  function makeTileSprites() {
    //The map and gameObjects arrays are complete, so we can
    //now use them to create the sprites.
    //All the map sprites will use the same x, y, width and
    //height values as the cell objects in those arrays.
    //rock, grass and border sprites will be pushed into the
    //`platforms` array so that use them for collision in the game loop

    //Make the terrain
    world.map.forEach(function (cell, index, map) {
      var sprite = undefined,
          frame = undefined,
          x = cell.x * level.tilewidth,
          y = cell.y * level.tileheight,
          width = level.tilewidth,
          height = level.tileheight;

      switch (cell.terrain) {
        case "rock":
          frame = g.frame(level.tileset.source, level.tileset.rock[0], level.tileset.rock[1], width, height);
          sprite = g.sprite(frame);
          sprite.setPosition(x, y);
          world.platforms.push(sprite);
          break;

        case "grass":
          frame = g.frame(level.tileset.source, level.tileset.grass[0], level.tileset.grass[1], width, height);
          sprite = g.sprite(frame);
          sprite.setPosition(x, y);
          world.platforms.push(sprite);
          break;

        case "sky":
          //Add clouds every 6 cells and only on the top
          //80% of the level
          var sourceY = undefined;
          if (index % 6 === 0 && index < map.length * 0.8) {
            sourceY = level.tileset.cloud[1];
          } else {
            sourceY = level.tileset.sky[1];
          }
          frame = g.frame(level.tileset.source, level.tileset.sky[0], sourceY, width, height);
          sprite = g.sprite(frame);
          sprite.setPosition(x, y);
          break;

        case "border":
          sprite = g.rectangle();
          sprite.fillStyle = "black";
          sprite.x = cell.x * level.tilewidth;
          sprite.y = cell.y * level.tileheight;
          sprite.width = level.tilewidth;
          sprite.height = level.tileheight;
          world.platforms.push(sprite);
          break;
      }
    });

    //Make the game items. (Do this after the terrain so
    //that the items sprites display above the terrain sprites)
    world.map.forEach(function (cell) {

      //Each game object will be half the size of the cell.
      //They should be centered and positioned so that they align
      //with the bottom of cell
      if (cell.item !== "") {
        var sprite = undefined,
            frame = undefined,
            x = cell.x * level.tilewidth + level.tilewidth / 4,
            y = cell.y * level.tileheight + level.tilewidth / 2,
            width = level.tilewidth / 2,
            height = level.tileheight / 2;

        switch (cell.item) {
          case "player":
            frame = g.frame("images/platforms.png", 32, 32, 32, 32);
            sprite = g.sprite(frame);
            sprite.width = width;
            sprite.height = height;
            sprite.setPosition(x, y);
            sprite.accelerationX = 0;
            sprite.accelerationY = 0;
            sprite.frictionX = 1;
            sprite.frictionY = 1;
            sprite.gravity = 0.3;
            sprite.jumpForce = -6.8;
            sprite.vx = 0;
            sprite.vy = 0;
            sprite.isOnGround = true;
            world.player = sprite;
            break;

          case "treasure":
            frame = g.frame("images/platforms.png", 32, 0, 32, 32);
            sprite = g.sprite(frame);
            sprite.width = width;
            sprite.height = height;
            sprite.setPosition(x, y);
            //Push the treasure into the treasures array
            world.treasure.push(sprite);
            break;
        }
      }
    });
  }

  //OPTIONAL: the `makeSprites` function
  //`makeSprites` is an alternative to `makeTileSprites` that creates
  //the sprites from simple squares and colors, in the style of a
  //Commodore 64 or Vic 20.
  //To see this in action: comment-out the `makeTileSprites` function
  //call at the head of the `makeWorld` function, and un-comment the
  //`makeSprites` function call in the code just after it

  function makeSprites() {
    //The map and gameObjects arrays are complete, so we can
    //now use them to create the sprites.
    //All the map sprites will use the same x, y, width and
    //height values as the cell objects in those arrays.
    //rock, grass and border sprites will be pushed into the
    //`platforms` array so that use them for collision in the game loop

    //Make the terrain
    world.map.forEach(function (cell) {
      var sprite = g.rectangle();
      sprite.x = cell.x * level.tilewidth;
      sprite.y = cell.y * level.tileheight;
      sprite.width = level.tilewidth;
      sprite.height = level.tileheight;

      switch (cell.terrain) {
        case "rock":
          sprite.fillStyle = "black";
          world.platforms.push(sprite);
          break;

        case "grass":
          sprite.fillStyle = "green";
          world.platforms.push(sprite);
          break;

        case "sky":
          sprite.fillStyle = "cyan";
          break;

        case "border":
          sprite.fillStyle = "blue";
          world.platforms.push(sprite);
          break;
      }
    });

    //Make the game items. (Do this after the terrain so
    //that the items sprites display above the terrain sprites)

    world.map.forEach(function (cell) {

      //Each game object will be half the size of the cell.
      //They should be centered and positioned so that they align
      //with the bottom of cell
      if (cell.item !== "") {
        var sprite = g.rectangle();
        sprite.x = cell.x * level.tilewidth + level.tilewidth / 4;
        sprite.y = cell.y * level.tileheight + level.tilewidth / 2;
        sprite.width = level.tilewidth / 2;
        sprite.height = level.tileheight / 2;

        switch (cell.item) {
          case "player":
            sprite.fillStyle = "red";
            sprite.accelerationX = 0;
            sprite.accelerationY = 0;
            sprite.frictionX = 1;
            sprite.frictionY = 1;
            sprite.gravity = 0.3;
            sprite.jumpForce = -6.8;
            sprite.vx = 0;
            sprite.vy = 0;
            sprite.isOnGround = true;
            world.player = sprite;
            break;

          case "treasure":
            sprite.fillStyle = "gold";

            //Push the treasure into the treasures array
            world.treasure.push(sprite);
            break;
        }
      }
    });
  }

  //Return the `world` object
  return world;
}
//# sourceMappingURL=platforms.js.map