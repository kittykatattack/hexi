"use strict";

/*
A demonstration of how to use Hexi's `shortestPath` function to help you create
a game character that can navigate a maze
*/

var thingsToLoad = ["images/timeBombPanic.png", "maps/walkThePath.json"];

//Create a new Hexi instance, and start it.
var g = hexi(832, 768, setup, thingsToLoad);

//Set the background color and scale the canvas
//g.backgroundColor = "black";
g.scaleToWindow();

//Start Hexi
g.start();

//Game variables
var alien = undefined,
    wayPoints2DArray = undefined,
    calculateNewPath = undefined,
    destinationX = undefined,
    destinationY = undefined,
    world = undefined,
    wallMapArray = undefined;

//The `setup` function to initialize your application
function setup() {

  //Make the world from the Tiled JSON data and the tileset PNG image
  world = g.makeTiledWorld("maps/walkThePath.json", "images/timeBombPanic.png");

  //Create the alien sprite
  alien = world.getObject("alien");

  //Create the bomb sprite
  //bomb = world.getObject("bomb");

  //Get a reference to the array that stores all the wall data
  wallMapArray = world.getObject("wallLayer").data;

  //An array that will be used to store sub-arrays of
  //x/y position value pairs that we're going to use
  //to change the velocity of the alien sprite
  wayPoints2DArray = [];

  //A Boolean that will be set to true when the pointer
  //is clicked, and set to false when the new path
  //is calculated
  calculateNewPath = false;

  //The mouse pointer's `release` function runs the code that
  //calculates the shortest path and draws that sprites that
  //represent it
  g.pointer.release = function () {

    //Set the new path's desination to the pointer's
    //current x and y position
    destinationX = g.pointer.x;
    destinationY = g.pointer.y;

    //Set `calculateNewPath` to true
    calculateNewPath = true;
  };

  //Change the game state to `play` to start the game loop
  g.state = play;
}

function play() {

  //Find out if the alien is centered over a tile cell
  if (isCenteredOverCell(alien)) {

    //If `calculateNewPath` has been set to `true` by the pointer,
    //Find the new shortest path between the alien and the pointer's
    //x and y position (`destinationX` and `destinationY`)
    if (calculateNewPath) {

      //calculate the shortest path
      var path = g.shortestPath(g.getIndex(alien.centerX, alien.centerY, 64, 64, 13), //The start map index
      g.getIndex(destinationX, destinationY, 64, 64, 13), //The destination index
      wallMapArray, //The map array
      13, //Map width, in tiles
      [2, 3], //Obstacle gid array
      "manhattan", //Heuristic to use
      false //Use diagonals (true) or only use orthogonally adjacent tiles (false)
      );

      //Remove the first node of the `path` array. That's because we
      //don't need it: the alien sprite's current location and the
      //first node in the `path` array share the same location.
      //In the code ahead we're going to tell the alien sprite to move
      //from its current location, to first new node in the path.
      path.shift();

      //If the path isn't empty, fill the `wayPoints2DArray` with
      //sub arrays of x/y position value pairs.
      if (path.length !== 0) {

        //Get a 2D array of x/y points
        wayPoints2DArray = path.map(function (node) {

          //Figure out the x and y location of each square in the path by
          //multiplying the node's `column` and `row` by the height, in
          //pixels, of each cell: 64
          var x = node.column * 64,
              y = node.row * 64;

          //Return a sub-array containing the x and y position of each node
          return [x, y];
        });
      }

      //Set `calculateNewPath` to `false` so that this block of code.
      //won't run again inside the game loop. (It can be set to `true`
      //again by clicking the pointer.)
      calculateNewPath = false;
    }

    //Set the alien's new velocity based on
    //the alien's relative x/y position to the current, next, way point.
    //Because we are always going to
    //remove a way point element after we set this new
    //velocity, the first element in the `wayPoints2DArray`
    //will always refer to the next way point that the
    //alien sprite has to move to 
    if (wayPoints2DArray.length !== 0) {

      //Left
      if (wayPoints2DArray[0][0] < alien.x) {
        alien.vx = -4;
        alien.vy = 0;

        //Right
      } else if (wayPoints2DArray[0][0] > alien.x) {
          alien.vx = 4;
          alien.vy = 0;

          //Up
        } else if (wayPoints2DArray[0][1] < alien.y) {
            alien.vx = 0;
            alien.vy = -4;

            //Down
          } else if (wayPoints2DArray[0][1] > alien.y) {
              alien.vx = 0;
              alien.vy = 4;
            }

      //Remove the current way point, so that next time around
      //the first element in the `wayPoints2DArray` will correctly refer
      //to the next way point that that alien sprite has
      //to move to
      wayPoints2DArray.shift();

      //If there are no way points remaining,
      //set the alien's velocity to 0
    } else {
        alien.vx = 0;
        alien.vy = 0;
      }
  }

  //Move the alien based on the new velocity
  alien.x += alien.vx;
  alien.y += alien.vy;
}

//Helper functions
//`isCenteredOverCell` returns true or false depending on whether a
//sprite is exactly aligned to an intersection in the maze corridors
function isCenteredOverCell(sprite) {
  return Math.floor(sprite.x) % world.tilewidth === 0 && Math.floor(sprite.y) % world.tileheight === 0;
}
//# sourceMappingURL=walkThePath.js.map