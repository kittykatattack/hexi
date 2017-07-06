"use strict";

var thingsToLoad = ["images/monsterMaze.png", "maps/monsterMaze.json"];

//Create a new Hexi instance, and start it.
var g = hexi(704, 512, setup, thingsToLoad);

//Set the background color and scale the canvas
//g.backgroundColor = "black";
g.scaleToWindow();

//Start Hexi
g.start();

//Game variables
var world = undefined,
    alien = undefined,
    message = undefined,
    wallMapArray = undefined,
    monsterFrames = undefined,
    bombMapArray = undefined,
    bombSprites = undefined,
    bombLayer = undefined,
    monsters = undefined,
    leftArrow = undefined,
    upArrow = undefined,
    downArrow = undefined,
    rightArrow = undefined;

//The `setup` function to initialize your application
function setup() {

  //Make the world from the Tiled JSON data and the tileset PNG image
  world = g.makeTiledWorld("maps/monsterMaze.json", "images/monsterMaze.png");

  //Create the alien sprite and set its speed
  alien = world.getObject("alien");
  alien.speed = 4;

  //Get a reference to the array that stores all the wall data
  wallMapArray = world.getObject("wallLayer").data;

  //We're just using the monsters sprites in the Tiled Editor
  //map as generic placeholders.  We're going to use their size and
  //position data to build new monster sprites from scratch and place
  //them in the world. That's because we want to give the monsters
  //custom animation frames. Here's how to do this:

  //1. Get a reference to the map's monster sprites and the
  //layer container that those sprites are one
  var mapMonsters = world.getObjects("monster");
  var monsterLayer = world.getObject("monsterLayer");

  //2.Define the monster's animation frames. In this example there are just
  //two: the monster mouth open, and the monster's mouth closed.
  monsterFrames = g.frames("images/monsterMaze.png", //The tileset image
  [[128, 0], [128, 64]], //The `x` and `y` positions of frames
  64, 64 //The `width` and `height` of each frame
  );

  //3.Create a new array called `monsters` that contains a new `monster`
  //sprite for each `mapMonster` in the original array. The new
  //`monster` sprites are created using the `monsterFrames` we defined
  //above and have the same `x` and `y` positions as the original
  //placeholder monsters from the Tiled Editor map. We're also going
  //to give them new `direction` and `speed`. Finally, we need to make the
  //placeholder monsters invisible and add the new `monster` sprite
  //to the `monsterLayer` container.
  monsters = mapMonsters.map(function (mapMonster) {
    var monster = g.sprite(monsterFrames);
    monster.x = mapMonster.x;
    monster.y = mapMonster.y;
    monster.direction = "none";
    monster.speed = 4;
    monsterLayer.addChild(monster);
    mapMonster.visible = false;

    //Define the monster's two states: `normal` and `scared`
    //`0` and `1` refer to the monster's two animation frames
    monster.states = {
      normal: 0,
      scared: 1
    };
    return monster;
  });

  //Give the `alien` a `direction` property and initilize it to "none"
  alien.direction = "none";

  //Configure Hexi's built in arrow keys to assign the alien a direction
  //Create some keyboard objects
  leftArrow = g.keyboard(37);
  upArrow = g.keyboard(38);
  rightArrow = g.keyboard(39);
  downArrow = g.keyboard(40);

  //Program the keyboard objects
  leftArrow.press = function () {
    return alien.direction = "left";
  };
  upArrow.press = function () {
    return alien.direction = "up";
  };
  rightArrow.press = function () {
    return alien.direction = "right";
  };
  downArrow.press = function () {
    return alien.direction = "down";
  };

  //Change the game state to `play`
  g.state = play;
}

//The `play` function contains all the game logic and runs in a loop
function play() {

  //Change the alien's direction if it's directly centered
  //over a tile cell

  if (isCenteredOverCell(alien)) {
    var velocity = directionToVelocity(alien.direction, alien.speed);
    alien.vx = velocity.vx;
    alien.vy = velocity.vy;
  }

  //Move the alien
  g.move(alien);

  //Check for a collision between the alien and the floor
  var alienVsFloor = g.hitTestTile(alien, wallMapArray, 0, world, "every");

  //If every corner point on the alien isn't touching a floor
  //tile (array gridIDNumber: 0) then prevent the alien from moving
  if (!alienVsFloor.hit) {

    //To prevent the alien from moving, subtract its velocity from its position
    alien.x -= alien.vx;
    alien.y -= alien.vy;
    alien.vx = 0;
    alien.vy = 0;
  }

  monsters.forEach(function (monster) {

    //1. Is the monster directly centered over a map tile cell?
    if (isCenteredOverCell(monster)) {

      //2. Yes, it is, so find out which are valid directions to move.
      //`findValidDirections` returns an array which can include any
      //of these string values: "up", "right", "down", "left" or "none"
      monster.validDirections = validDirections(monster, wallMapArray, 0, world);

      //3. Can the monster change its direction?
      if (canChangeDirection(monster.validDirections)) {

        //4. If it can, randomly select a new direction
        monster.direction = randomDirection(monster, monster.validDirections);
      }

      //5. Use the monster's direction and speed to find its
      //new velocity
      var velocity = directionToVelocity(monster.direction, monster.speed);
      monster.vx = velocity.vx;
      monster.vy = velocity.vy;
    }

    //6. Move the monster
    monster.x += monster.vx;
    monster.y += monster.vy;

    //Change the monster's state

    //1. Plot a vector between the monster and the alien
    var vx = alien.centerX - monster.centerX,
        vy = alien.centerY - monster.centerY;

    //2. Find the vector's magnitude. This tells you how far
    //apart the sprites are
    var magnitude = Math.sqrt(vx * vx + vy * vy);

    //3. If the monster is less than 192 pixels away from the alien,
    //change the monster's state to `scared`. Otherwise, set its
    //state to `normal`
    if (magnitude < 192) {
      monster.show(monster.states.scared);
    } else {
      monster.show(monster.states.normal);
    }
  });
}

//Helper functions

//`isAtIntersection` returns true or false depending on whether a
//sprite is exactly aligned to anintersection in the maze corridors
function isCenteredOverCell(sprite) {
  return Math.floor(sprite.x) % world.tilewidth === 0 && Math.floor(sprite.y) % world.tileheight === 0;
}

function directionToVelocity() {
  var direction = arguments.length <= 0 || arguments[0] === undefined ? "" : arguments[0];
  var speed = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

  //Convert the direction string to an object with `vx` and `vy`
  //velocity properties
  switch (direction) {
    case "up":
      return {
        vy: -speed,
        vx: 0
      };
      break;
    case "down":
      return {
        vy: speed,
        vx: 0
      };
      break;
    case "left":
      return {
        vx: -speed,
        vy: 0
      };
      break;
    case "right":
      return {
        vx: speed,
        vy: 0
      };
      break;
    default:
      return {
        vx: 0,
        vy: 0
      };
  }
};

function changeDirection(sprite, direction, speed) {

  //Change the sprite's velocity if it's centered
  //over a tile grid cell
  switch (direction) {
    case "up":
      sprite.vy = -speed;
      sprite.vx = 0;
      break;
    case "down":
      sprite.vy = speed;
      sprite.vx = 0;
      break;
    case "left":
      sprite.vx = -speed;
      sprite.vy = 0;
      break;
    case "right":
      sprite.vx = speed;
      sprite.vy = 0;
      break;
    default:
      sprite.vx = 0;
      sprite.vy = 0;
      break;
  }
};

function surroundingCrossCells(index, widthInTiles) {
  return [index - widthInTiles, index - 1, index + 1, index + widthInTiles];
}

function surroundingDiagonalCells(index, widthInTiles) {
  return [index - widthInTiles - 1, index - widthInTiles + 1, index + widthInTiles - 1, index + widthInTiles + 1];
}

function validDirections(sprite, mapArray, validGid, world) {

  //Get the sprite's current map index position number
  var index = g.getIndex(sprite.x, sprite.y, world.tilewidth, world.tileheight, world.widthInTiles);

  //An array containing the index numbers of tile cells
  //above, below and to the left and right of the sprite
  var surroundingCrossCells = function surroundingCrossCells(index, widthInTiles) {
    return [index - widthInTiles, index - 1, index + 1, index + widthInTiles];
  };

  //Get the index position numbers of the 4 cells to the top, right, left
  //and bottom of the sprite
  var surroundingIndexNumbers = surroundingCrossCells(index, world.widthInTiles);

  //Find all the tile gid numbers that match the surrounding index numbers
  var surroundingTileGids = surroundingIndexNumbers.map(function (index) {
    return mapArray[index];
  });

  //`directionList` is an array of 4 string values that can be either
  //"up", "left", "right", "down" or "none", depending on
  //whether there is a cell with a valid gid that matches that direction.
  var directionList = surroundingTileGids.map(function (gid, i) {

    //The possible directions
    var possibleDirections = ["up", "left", "right", "down"];

    //If the direction is valid, choose the matching string
    //identifier for that direction. Otherwise, return "none"
    if (gid === validGid) {
      return possibleDirections[i];
    } else {
      return "none";
    }
  });

  //We don't need "none" in the list of directions
  //(it's just a placeholder), so let's filter it out
  var filteredDirectionList = directionList.filter(function (direction) {
    return direction != "none";
  });

  //Return the filtered list of valid directions
  return filteredDirectionList;
}

function canChangeDirection() {
  var validDirections = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

  //Is the sprite in a dead-end (cul de sac.) This will be true if there's only
  //one element in the `validDirections` array
  var inCulDeSac = validDirections.length === 1;

  //Is the sprite trapped? This will be true if there are no elements in
  //the `validDirections` array
  var trapped = validDirections.length === 0;

  //Is the sprite in a passage? This will be `true` if the the sprite
  //is at a location that contain the values
  //“left” or “right” and “up” or “down”
  var up = validDirections.find(function (x) {
    return x === "up";
  }),
      down = validDirections.find(function (x) {
    return x === "down";
  }),
      left = validDirections.find(function (x) {
    return x === "left";
  }),
      right = validDirections.find(function (x) {
    return x === "right";
  }),
      atIntersection = (up || down) && (left || right);

  //Return `true` if the sprite can change direction or
  //`false` if it can't
  return trapped || atIntersection || inCulDeSac;
}

function randomDirection(sprite) {
  var validDirections = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];

  //The `randomInt` helper function returns a random integer between a minimum
  //and maximum value
  var randomInt = function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  //Is the sprite trapped?
  var trapped = validDirections.length === 0;

  //If the sprite isn't trapped, randomly choose one of the valid
  //directions. Otherwise, return the string "trapped"
  if (!trapped) {
    return validDirections[randomInt(0, validDirections.length - 1)];
  } else {
    return "trapped";
  }
}
/*
function randomDirection(sprite, currentDirection = "none", validDirections = []) {

  //Some values that help find out what the sprite's situation in the maze is
  //Is the sprite in an up/down passage?
  //let inUpOrDownPassage = validDirections.indexOf("up") !== -1 || validDirections.indexOf("down") !== -1;
  let inUpOrDownPassage = validDirections.indexOf("up") !== -1 || validDirections.indexOf("down") !== -1;

  //Is the sprite in a left/right passage?
  let inLeftOrRightPassage = validDirections.indexOf("left") !== -1 || validDirections.indexOf("right") !== -1;

  //Is the sprite in a dead-end (cul de sac.) This will be true if there's only
  //one element in the `validDirections` array
  let inCulDeSac = validDirections.length === 1;

  //Is the sprite trapped? This will be true if there are no elements in
  //the `validDirections` array
  let trapped = validDirections.length === 0;

  //The `randomInt` helper function returns a random integer between a minimum
  //and maximum value
  let randomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  //Randomly select one of the valid directions
  let randomDirection = () => {
    if (!trapped) {
      return validDirections[randomInt(0, validDirections.length - 1)];
    } else {
      return "none"
    }
  };

  //If the sprite isn't trapped and it's in a passage intersection or
  //cul-de-sac, assign the newRandomDirecton to the sprite's
  //`direction` property. Otherwise, keep the sprite's directon the 
  //same as it was before
  if (!trapped) {
    if (inLeftOrRightPassage && inUpOrDownPassage || inCulDeSac) {
      return randomDirection();
    } else {
      return currentDirection;
    }
  } else {
    return currentDirection;
  }
}
*/
//# sourceMappingURL=randomMovement.js.map