let thingsToLoad = [
  "images/monsterMaze.png",
  "maps/monsterMaze.json"
];

//Create a new Hexi instance, and start it.
let g = hexi(704, 512, setup, thingsToLoad);

//Set the background color and scale the canvas
//g.backgroundColor = "black";
g.scaleToWindow();

//Start Hexi
g.start();

//Game variables
let world, alien, message, wallMapArray, monsterFrames,
  bombMapArray, bombSprites, bombLayer, monsters,
  leftArrow, upArrow, downArrow, rightArrow;

//The `setup` function to initialize your application
function setup() {

  //Make the world from the Tiled JSON data and the tileset PNG image
  world = g.makeTiledWorld(
    "maps/monsterMaze.json",
    "images/monsterMaze.png"
  );

  //Create the alien sprite and set its speed
  alien = world.getObject("alien");
  alien.speed = 4

  //Get a reference to the array that stores all the wall data
  wallMapArray = world.getObject("wallLayer").data;

  //We're just using the monsters sprites in the Tiled Editor
  //map as generic placeholders.  We're going to use their size and
  //position data to build new monster sprites from scratch and place
  //them in the world. That's because we want to give the monsters
  //custom animation frames. Here's how to do this:

  //1. Get a reference to the map's monster sprites and the 
  //layer container that those sprites are one
  let mapMonsters = world.getObjects("monster");
  let monsterLayer = world.getObject("monsterLayer");

  //2.Define the monster's animation frames. In this example there are just
  //two: the monster mouth open, and the monster's mouth closed.
  monsterFrames = g.frames(
    "images/monsterMaze.png", //The tileset image
    [
      [128, 0],
      [128, 64]
    ], //The `x` and `y` positions of frames
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
  monsters = mapMonsters.map(mapMonster => {
    let monster = g.sprite(monsterFrames);
    monster.x = mapMonster.x;
    monster.y = mapMonster.y;
    monster.direction = "none";
    monster.speed = 4;
    monsterLayer.addChild(monster);
    mapMonster.visible = false;

    //Define the monster's two states: `normal` and `angry`
    //`0` and `1` refer to the monster's two animation frames
    monster.states = {
      normal: 0,
      angry: 1
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
  leftArrow.press = () => alien.direction = "left";
  upArrow.press = () => alien.direction = "up";
  rightArrow.press = () => alien.direction = "right";
  downArrow.press = () => alien.direction = "down";

  //Change the game state to `play`
  g.state = play;
}

//The `play` function contains all the game logic and runs in a loop
function play() {

  //Change the alien's direction if it's directly centered
  //over a tile cell

  if (isCenteredOverCell(alien)) {
    let velocity = directionToVelocity(alien.direction, alien.speed);
    alien.vx = velocity.vx;
    alien.vy = velocity.vy;
  }

  //Move the alien
  g.move(alien);

  //Check for a collision between the alien and the floor
  let alienVsFloor = g.hitTestTile(alien, wallMapArray, 0, world, "every");

  //If every corner point on the alien isn't touching a floor 
  //tile (array gridIDNumber: 0) then prevent the alien from moving
  if (!alienVsFloor.hit) {

    //To prevent the alien from moving, subtract its velocity from its position
    alien.x -= alien.vx;
    alien.y -= alien.vy;
    alien.vx = 0;
    alien.vy = 0;
  }

  //Move he monsters
  monsters.forEach(monster => {

    //1. Is the monster directly centered over a map tile cell?
    if (isCenteredOverCell(monster)) {

      //2. Yes, it is, so find out which are valid directions to move.
      //`findValidDirections` returns an array which can include any
      //of these string values: "up", "right", "down", "left" or "none"
      monster.validDirections = validDirections(
        monster, wallMapArray, 0, world
      );

      //3. Check whether the monster has line of sight
      monster.hasLineOfSight = tileBasedLineOfSight(
        monster, //The first sprite
        alien, //The second sprite
        wallMapArray, //The tile map array
        world, //The `world` object
        0, //The Gid that represents and empty tile
        16, //The distance between collision points
        [90, -90, 0, 180, -180] //The angles to limit the line-of-sight
      );

      //4. Can the monster change its direction?
      if (canChangeDirection(monster.validDirections)) {

        //5. If it can, change the monster's direction to the closest direction
        //if it has line of sight. If it doesn't have line of sight,
        //choose a new random direction
        if (monster.hasLineOfSight) {
          monster.direction = closestDirection(monster, alien, monster.validDirections);
        } else {
          monster.direction = randomDirection(monster, monster.validDirections)
        }
      }

      //6. Use the monster's direction and speed to find its new velocity
      let velocity = directionToVelocity(monster.direction, monster.speed);
      monster.vx = velocity.vx;
      monster.vy = velocity.vy;
    }

    //7. Move the monster
    monster.x += monster.vx;
    monster.y += monster.vy;

    //8. Optionally Change the monster's state.
    //If the monster has line of sight,
    //change the monster's state to `angry`. Otherwise, set its
    //state to `normal`
    if (monster.hasLineOfSight) {
      monster.show(monster.states.angry);
    } else {
      monster.show(monster.states.normal);
    }
  });
}

//Helper functions

//`isCenteredOverCell` returns true or false depending on whether a 
//sprite is exactly aligned to anintersection in the maze corridors
function isCenteredOverCell(sprite) {
  return Math.floor(sprite.x) % world.tilewidth === 0 && Math.floor(sprite.y) % world.tileheight === 0
}

//Convert the direction string to an object with `vx` and `vy`
//velocity properties
function directionToVelocity(direction = "", speed = 0) {
  switch (direction) {
    case "up":
      return {
        vy: -speed,
        vx: 0
      }
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

//Change the sprite's velocity if it's centered 
//over a tile grid cell 
function changeDirection(sprite, direction, speed) {
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
  return [
    index - widthInTiles,
    index - 1,
    index + 1,
    index + widthInTiles,
  ];
}

function surroundingDiagonalCells(index, widthInTiles) {
  return [
    index - widthInTiles - 1,
    index - widthInTiles + 1,
    index + widthInTiles - 1,
    index + widthInTiles + 1,
  ];
}

function validDirections(sprite, mapArray, validGid, world) {

  //Get the sprite's current map index position number
  let index = g.getIndex(
    sprite.x,
    sprite.y,
    world.tilewidth,
    world.tileheight,
    world.widthInTiles
  );

  //An array containing the index numbers of tile cells
  //above, below and to the left and right of the sprite
  let surroundingCrossCells = (index, widthInTiles) => {
    return [
      index - widthInTiles,
      index - 1,
      index + 1,
      index + widthInTiles,
    ];
  };

  //Get the index position numbers of the 4 cells to the top, right, left
  //and bottom of the sprite
  let surroundingIndexNumbers = surroundingCrossCells(index, world.widthInTiles);

  //Find all the tile gid numbers that match the surrounding index numbers
  let surroundingTileGids = surroundingIndexNumbers.map(index => mapArray[index]);

  //`directionList` is an array of 4 string values that can be either
  //"up", "left", "right", "down" or "none", depending on 
  //whether there is a cell with a valid gid that matches that direction.
  let directionList = surroundingTileGids.map((gid, i) => {

    //The possible directions
    let possibleDirections = ["up", "left", "right", "down"];

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
  let filteredDirectionList = directionList.filter(direction => direction != "none");

  //Return the filtered list of valid directions
  return filteredDirectionList;
}

function canChangeDirection(validDirections = []) {

  //Is the sprite in a dead-end (cul de sac.) This will be true if there's only
  //one element in the `validDirections` array
  let inCulDeSac = validDirections.length === 1;

  //Is the sprite trapped? This will be true if there are no elements in
  //the `validDirections` array
  let trapped = validDirections.length === 0;

  //Is the sprite in a passage? This will be `true` if the the sprite
  //is at a location that contain the values 
  //“left” or “right” and “up” or “down” 
  let up = validDirections.find(x => x === "up"),
    down = validDirections.find(x => x === "down"),
    left = validDirections.find(x => x === "left"),
    right = validDirections.find(x => x === "right"),
    atIntersection = (up || down) && (left || right);

  //Return `true` if the sprite can change direction or
  //`false` if it can't
  return trapped || atIntersection || inCulDeSac;
}

function randomDirection(sprite, validDirections = []) {

  //The `randomInt` helper function returns a random integer between a minimum
  //and maximum value
  let randomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  //Is the sprite trapped? 
  let trapped = validDirections.length === 0;

  //If the sprite isn't trapped, randomly choose one of the valid
  //directions. Otherwise, return the string "trapped"
  if (!trapped) {
    return validDirections[randomInt(0, validDirections.length - 1)];
  } else {
    return "trapped"
  }
}

function closestDirection(spriteOne, spriteTwo, validDirections = []) {

  //A helper function to find the closest direction
  let closest = () => {

    //Plot a vector between spriteTwo and spriteOne
    let vx = spriteTwo.centerX - spriteOne.centerX,
      vy = spriteTwo.centerY - spriteOne.centerY;

    //If the distance is greater on the X axis...
    if (Math.abs(vx) >= Math.abs(vy)) {

      //Try left and right
      if (vx <= 0) {
        return "left";
      } else {
        return "right";
      }
    }

    //If the distance is greater on the Y axis...
    else {

      //Try up and down
      if (vy <= 0) {
        return "up"
      } else {
        return "down"
      }
    }
  };

  //The closest direction that's also a valid direction
  let closestValidDirection = validDirections.find(x => x === closest());

  //The `randomInt` helper function returns a random integer between a minimum
  //and maximum value
  let randomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  //Is the sprite trapped? 
  let trapped = validDirections.length === 0;

  //If the sprite isn't trapped, choose the closest direction
  //from the `validDirections` array. If there's no closest valid
  //direction, then choose a valid direction at random.
  if (!trapped) {
    if (closestValidDirection) {
      return closestValidDirection;
    } else {
      return validDirections[randomInt(0, validDirections.length - 1)];
    }
  } else {
    return "trapped"
  }
}

function tileBasedLineOfSight(
  spriteOne, //The first sprite, with `centerX` and `centerY` properties
  spriteTwo, //The second sprite, with `centerX` and `centerY` properties
  mapArray, //The tile map array
  world, //The `world` object that contains the `tilewidth
  //`tileheight` and `widthInTiles` properties
  emptyGid = 0, //The Gid that represents and empty tile, usually `0`
  segment = 32, //The distance between collision points
  angles = [] //An array of angles to which you want to 
  //restrict the line of sight
) {

  //Plot a vector between spriteTwo and spriteOne
  let vx = spriteTwo.centerX - spriteOne.centerX,
    vy = spriteTwo.centerY - spriteOne.centerY;

  //Find the vector's magnitude (its length in pixels)
  let magnitude = Math.sqrt(vx * vx + vy * vy);

  //How many points will we need to test?
  let numberOfPoints = magnitude / segment;

  //Create an array of x/y points that
  //extends from `spriteOne` to `spriteTwo`  
  let points = () => {

    //Initialize an array that is going to store all our points
    //along the vector
    let arrayOfPoints = [];

    //Create a point object for each segment of the vector and 
    //store its x/y position as well as its index number on
    //the map array 
    for (let i = 1; i <= numberOfPoints; i++) {

      //Calculate the new magnitude for this iteration of the loop
      let newMagnitude = segment * i;

      //Find the unit vector
      let dx = vx / magnitude,
        dy = vy / magnitude;

      //Use the unit vector and newMagnitude to figure out the x/y
      //position of the next point in this loop iteration
      let x = spriteOne.centerX + dx * newMagnitude,
        y = spriteOne.centerY + dy * newMagnitude;


      //The getIndex function converts x/y coordinates into
      //map array index positon numbers
      let getIndex = (x, y, tilewidth, tileheight, mapWidthInTiles) => {

        //Convert pixel coordinates to map index coordinates
        let index = {};
        index.x = Math.floor(x / tilewidth);
        index.y = Math.floor(y / tileheight);

        //Return the index number
        return index.x + (index.y * mapWidthInTiles);
      };

      //Find the map index number that this x and y point corresponds to
      let index = getIndex(
        x, y,
        world.tilewidth,
        world.tileheight,
        world.widthInTiles
      );

      //Push the point into the `arrayOfPoints`
      arrayOfPoints.push({
        x, y, index
      });
    }

    //Return the array
    return arrayOfPoints;
  };

  //The tile-based collision test.
  //The `noObstacles` function will return `true` if all the tile
  //index numbers along the vector are `0`, which means they contain 
  //no walls. If any of them aren't 0, then the function returns
  //`false` which means there's a wall in the way 
  let noObstacles = points().every(point => {
    return mapArray[point.index] === emptyGid
  });

  //Restrict the line of sight to right angles only (we don't want to
  //use diagonals)
  let validAngle = () => {

    //Find the angle of the vector between the two sprites
    let angle = Math.atan2(vy, vx) * 180 / Math.PI;

    //If the angle matches one of the valid angles, return
    //`true`, otherwise return `false`
    if (angles.length !== 0) {
      return angles.some(x => x === angle);
    } else {
      return true;
    }
  };

  //Return `true` if there are no obstacles and the line of sight
  //is at a 90 degree angle
  if (noObstacles === true && validAngle() === true) {
    return true;
  } else {
    return false;
  }
}

//Geometry based Line of sight
function lineOfSight(
  spriteOne, //The first sprite, with `centerX` and `centerY` properties
  spriteTwo, //The second sprite, with `centerX` and `centerY` properties
  obstacles, //An array of sprites which act as obstacles
  segment = 32 //The distance between collision points
) {

  //Plot a vector between spriteTwo and spriteOne
  let vx = spriteTwo.centerX - spriteOne.centerX,
    vy = spriteTwo.centerY - spriteOne.centerY;

  //Find the vector's magnitude (its length in pixels)
  let magnitude = Math.sqrt(vx * vx + vy * vy);

  //How many points will we need to test?
  let numberOfPoints = magnitude / segment;

  //Create an array of x/y points, separated by 64 pixels, that
  //extends from `spriteOne` to `spriteTwo`  
  let points = () => {

    //Initialize an array that is going to store all our points
    //along the vector
    let arrayOfPoints = [];

    //Create a point object for each segment of the vector and 
    //store its x/y position as well as its index number on
    //the map array 
    for (let i = 1; i <= numberOfPoints; i++) {

      //Calculate the new magnitude for this iteration of the loop
      let newMagnitude = segment * i;

      //Find the unit vector. This is a small, scaled down version of
      //the vector between the sprites that's less than one pixel long.
      //It points in the same direction as the main vector, but because it's
      //the smallest size that the vector can be, we can use it to create
      //new vectors of varying length
      let dx = vx / magnitude,
        dy = vy / magnitude;

      //Use the unit vector and newMagnitude to figure out the x/y
      //position of the next point in this loop iteration
      let x = spriteOne.centerX + dx * newMagnitude,
        y = spriteOne.centerY + dy * newMagnitude;

      //Push a point object with x and y properties into the `arrayOfPoints`
      arrayOfPoints.push({
        x, y
      });
    }

    //Return the array of point objects
    return arrayOfPoints;
  };

  //Test for a collision between a point and a sprite
  let hitTestPoint = (point, sprite) => {

    //Find out if the point's position is inside the area defined
    //by the sprite's left, right, top and bottom sides
    let left = point.x > sprite.x,
      right = point.x < (sprite.x + sprite.width),
      top = point.y > sprite.y,
      bottom = point.y < (sprite.y + sprite.height);

    //If all the collision conditions are met, you know the
    //point is intersecting the sprite
    return left && right && top && bottom;
  };

  //The `noObstacles` function will return `true` if all the tile
  //index numbers along the vector are `0`, which means they contain 
  //no obstacles. If any of them aren't 0, then the function returns
  //`false` which means there's an obstacle in the way 
  let noObstacles = points().every(point => {
    return obstacles.every(obstacle => {
      return !(hitTestPoint(point, obstacle))
    });
  });

  //Return the true/false value of the collision test
  return noObstacles;
}