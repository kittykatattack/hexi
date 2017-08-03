"use strict";

/*
A demonstration of how to use Hexi's `shortestPath` function to help you find
the shortest path between two index points in a map array
*/

var thingsToLoad = ["images/timeBombPanic.png", "maps/AStar.json"];

//Create a new Hexi instance, and start it.
var g = hexi(832, 768, setup, thingsToLoad);

//Set the background color and scale the canvas
//g.backgroundColor = "black";
g.scaleToWindow();

//Start Hexi
g.start();

//Game variables
var alien = undefined,
    bomb = undefined,
    currentPath = undefined,
    world = undefined,
    wallMapArray = undefined,
    currentPathSprites = undefined;

//The `setup` function to initialize your application
function setup() {

  //Make the world from the Tiled JSON data and the tileset PNG image
  world = g.makeTiledWorld("maps/AStar.json", "images/timeBombPanic.png");

  //Create the alien sprite
  alien = world.getObject("alien");

  //Create the bomb sprite
  //bomb = world.getObject("bomb");

  //Get a reference to the array that stores all the wall data
  wallMapArray = world.getObject("wallLayer").data;

  //An array to store the sprites that will be used to display
  //the shortest path
  currentPathSprites = [];

  //The mouse pointer's `release` function runs the code that
  //calculates the shortest path and draws that sprites that
  //represent it
  g.pointer.release = function () {

    //calculate the shortest path
    var path = g.shortestPath(g.getIndex(alien.x, alien.y, 64, 64, 13), //The start map index
    g.getIndex(g.pointer.x, g.pointer.y, 64, 64, 13), //The destination index
    wallMapArray, //The map array
    13, //Map width, in tiles
    [2, 3], //Obstacle gid array
    "manhattan", //Heuristic to use
    true //Either use all diagonal nodes (true) or orthagonally adjacent nodes (false)
    );

    //Use Hexi's `remove` method to remove any possible
    //sprites in the `currentPathSprites` array
    g.remove(currentPathSprites);

    //Display the shortest path
    path.forEach(function (node) {

      //Figure out the x and y location of each square in the path by
      //multiplying the node's `column` and `row` by the height, in
      //pixels, of each square: 64
      var x = node.column * 64,
          y = node.row * 64;

      //Create the square sprite and set it to the x and y location
      //we calculated above
      var square = g.rectangle(64, 64, "black");
      square.x = x;
      square.y = y;

      //Push the sprites into the `currentPath` array,
      //so that we can easily remove them the next time
      //the mouse is clicked
      currentPathSprites.push(square);
    });
  };
}
//# sourceMappingURL=shortestPath.js.map