/*
A marble game prototyple illustrating collisions between moving circles
*/

//Create a new Hexi instance, and start it.
let g = hexi(512, 512, setup, ["images/marbles.png"]);

//Set the background color and scale the canvas
g.backgroundColor = "black";
g.scaleToWindow();

//Declare variables used in more than one function
let sling, marbles, capturedMarble;;

//If you're not loading any files, start Hexi after
//you've declared your global variables
g.start();

//The `setup` function to initialize your application
function setup() {

  /*
  Create the grid of marbles using the `grid` function. `grid` returns a
  `group` sprite object that contains a sprite for every cell in the
  grid. You can define the rows and columns in the grid, whether or
  not the sprites should be centered inside each cell, or what their offset from the
  top left corner of each cell should be. Supply a function that
  returns the sprite that you want to make for each cell. You can
  supply an optional final function that runs any extra code after
  each sprite has been created. Here's the format for creating a grid:

      gridGroup = grid(

        //Set the grid's properties
        columns, rows, cellWidth, cellHeight, 
        areSpirtesCentered?, xOffset, yOffset,

        //A function that returns a sprite
        () => {return g.circle(16, "blue"),

        //An optional final function that runs some extra code
        () => {console.log("extra!")
      );
  */
  marbles = g.grid(

    //Set the grid's properties
    5, 5, 128, 128,
    true, 0, 0,

    //A function that describes how to make each marble in the grid
    () => {
      let frames = g.filmstrip("images/marbles.png", 32, 32);
      let marble = g.sprite(frames);
      marble.show(g.randomInt(0, 5));
      marble.circular = true;
      let sizes = [8, 12, 16, 20, 24, 28, 32];
      marble.diameter = sizes[g.randomInt(0, 6)];
      marble.vx = g.randomInt(-10, 10);
      marble.vy = g.randomInt(-10, 10);
      marble.frictionX = 0.99;
      marble.frictionY = 0.99;
      marble.mass = 0.75 + (marble.diameter / 32);
      return marble;
    },

    //Run any extra code after each peg is made, if you want to
    () => console.log("extra!")
  );

  //Create the "sling" which is a line that will connect
  //the pointer to the marbles
  sling = g.line("Yellow", 4);
  sling.visible = false;

  //A variable to store the captured marble
  capturedMarble = null;

  //Change the state to `play`
  g.state = play;
}

//The `play` function will run in a loop
function play() {

  //If a marble has been captured, draw the 
  //sling (the yellow line) between the pointer and
  //the center of the captured marble
  if (capturedMarble !== null) {
    sling.visible = true;
    sling.ax = capturedMarble.centerX;
    sling.ay = capturedMarble.centerY;
    sling.bx = g.pointer.x;
    sling.by = g.pointer.y;
  }

  //Shoot the marble if the pointer has been released 
  if (g.pointer.isUp) {
    sling.visible = false;
    if (capturedMarble !== null) {

      //Find out how long the sling is
      sling.length = g.distance(capturedMarble, g.pointer);

      //Get the angle between the center of the marble and the pointer
      sling.angle = g.angle(g.pointer, capturedMarble);

      //Shoot the marble away from the pointer with a velocity
      //proportional to the sling's length
      capturedMarble.vx = Math.cos(sling.angle) * sling.length / 5;
      capturedMarble.vy = Math.sin(sling.angle) * sling.length / 5;

      //Release the captured marble
      capturedMarble = null;
    }
  }


  marbles.children.forEach(marble => {

    //Check for a collision with the pointer and marble
    if (g.pointer.isDown && capturedMarble === null) {
      if (g.hit(g.pointer, marble)) {

        //If there's a collision, capture the marble
        capturedMarble = marble;
        capturedMarble.vx = 0;
        capturedMarble.vy = 0;
      }
    }

    //Apply friction
    marble.vx *= marble.frictionX;
    marble.vy *= marble.frictionY;

    //Move the marble by applying the new calculated velocity
    //to the marble's x and y position
    g.move(marble);

    //Contain the marble inside the stage and make it bounce
    //off the edges
    g.contain(marble, g.stage, true);
  });

  //Add the marbles to the spatial grid
  marbles.children.forEach(marble => {
    getIndex(marble)

  });

  //1. Create the spatial grid

  //A function to initialize the spatial grid
  let spatialGrid = (widthInPixels, heightInPixels, cellSizeInPixels, spritesArray) => {

    //Find out how many cells we need and how long the
    //grid array should be
    let width = widthInPixels / cellSizeInPixels,
      height = heightInPixels / cellSizeInPixels,
      length = width * height;

    //Initialize an empty grid
    let gridArray = [];

    //Add empty sub-arrays to element 
    for (let i = 0; i < length; i++) {

      //Add empty arrays to each element. This is where
      //we're going to store sprite references
      gridArray.push([]);
    }

    //Add the sprites to the grid
    spritesArray.forEach(sprite => {

      //Find out the sprite's current map index position
      let index = getIndex(sprite.x, sprite.y, cellSizeInPixels, cellSizeInPixels, width);

      //Add the sprite to the array at that index position
      gridArray[index].push(sprite);

    });

    return gridArray;
  };

  //Create the spatial grid and add the marble sprites to it
  let grid = spatialGrid(512, 512, 64, marbles.children);

  //2. Check for collisions between sprites in the grid

  //Loop through all the sprites
  for (let i = 0; i < marbles.children.length; i++) {

    //Get a reference to the current sprite in the loop
    let sprite = marbles.children[i];

    //Find out the sprite's current map index position
    let gridWidthInTiles = 512 / 64;
    let index = getIndex(sprite.x, sprite.y, 64, 64, gridWidthInTiles);

    //Find out what all the surrounding nodes are, including those that
    //might be beyond the borders of the grid
    let allSurroundingCells = [
      grid[index - gridWidthInTiles - 1],
      grid[index - gridWidthInTiles],
      grid[index - gridWidthInTiles + 1],
      grid[index - 1],
      grid[index],
      grid[index + 1],
      grid[index + gridWidthInTiles - 1],
      grid[index + gridWidthInTiles],
      grid[index + gridWidthInTiles + 1]
    ];

    //Find all the sprites that might be colliding with this current sprite
    for (let j = 0; j < allSurroundingCells.length; j++) {

      //Get a reference to the current surrounding cell
      let cell = allSurroundingCells[j]

      //If the cell isn't `undefined` (beyond the grid borders) 
      //and it's not empty, check for a collision between 
      //the current sprite and sprites in the cell
      if (cell && cell.length !== 0) {

        //Loop through all the sprites in the cell
        for (let k = 0; k < cell.length; k++) {

          //Get a reference to the current sprite being checked
          //in the cell
          let surroundingSprite = cell[k];

          //If the sprite in the cell is not the same as the current
          //sprite in the main loop, then check for a collision
          //between those sprites
          if (surroundingSprite !== sprite) {

            //Perform a narrow-phase collision check to bounce
            //the sprites apart
            g.movingCircleCollision(sprite, surroundingSprite);
          }
        }
      }
    }

    //Finally, remove this current sprite from the current 
    //spatial grid cell because all possible collisions 
    //involving this sprite have been checked
    grid[index] = grid[index].filter(x => x !== sprite);
  }
}

//The `getIndex` helper function
//converts a sprite's x and y position to an array index number.
//It returns a single index value that tells you the map array
//index number that the sprite is in
function getIndex(x, y, tilewidth, tileheight, mapWidthInTiles) {
  let index = {};

  //Convert pixel coordinates to map index coordinates
  index.x = Math.floor(x / tilewidth);
  index.y = Math.floor(y / tileheight);

  //Return the index number
  return index.x + (index.y * mapWidthInTiles);
}