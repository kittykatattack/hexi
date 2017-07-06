let thingsToLoad = [
  "images/tileSet.png",
];

//Create a new Hexi instance, and start it.
let g = hexi(640, 512, setup, thingsToLoad);

//Scale the canvas to the maximum browser dimensions
g.scaleToWindow();

//Start Hexi
g.start();

//Intiialize variables
let car, world;

function setup() {

  //Create the `world` container that defines our isometric 
  //tile-based world
  world = g.group();

  //Set the `tileWidth` and `tileHeight` of each tile, in pixels
  world.tileWidth = 64;
  world.tileHeight = 64;

  //Define the width and height of the world, in tiles
  world.widthInTiles = 10;
  world.heightInTiles = 8;

  //Create the world layers
  world.layers = [

    //The environment layer. `2` represents the walls,
    //`1` represents the floors
    [
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
      1, 2, 2, 2, 2, 2, 2, 2, 2, 1,
      1, 2, 2, 2, 2, 2, 2, 2, 2, 1,
      1, 2, 2, 1, 1, 1, 1, 2, 2, 1,
      1, 2, 2, 1, 1, 1, 1, 2, 2, 1,
      1, 2, 2, 2, 2, 2, 2, 2, 2, 1,
      1, 2, 2, 2, 2, 2, 2, 2, 2, 1,
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1
    ],

    //The character layer. `3` represents the game character
    //`0` represents an empty cell which won't contain any
    //sprites
    [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 3, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0
    ]
  ];

  //Build the game world by looping through each 
  //of the layers arrays one after the other
  world.layers.forEach(layer => {

    //Loop through each array element
    layer.forEach((gid, index) => {

      //If the cell isn't empty (0) then create a sprite
      if (gid !== 0) {

        //Find the column and row that the sprite is on and also
        //its x and y pixel values that match column and row position
        let column, row, x, y;
        column = index % world.widthInTiles;
        row = Math.floor(index / world.widthInTiles);
        x = column * world.tileWidth;
        y = row * world.tileHeight;

        //Next, create a different sprite based on what its 
        //`gid` number is
        let sprite;
        switch (gid) {

          //The track
          case 1:
            sprite = g.sprite(g.frame("images/tileSet.png", 192, 64, 64, 64));
            break;

            //The grass
          case 2:
            sprite = g.sprite(g.frame("images/tileSet.png", 192, 0, 64, 64));
            break;

            //The car 
          case 3:
            sprite = g.sprite(g.frame("images/tileSet.png", 192, 192, 48, 48));
            car = sprite;
        }

        //Position the sprite using the calculated `x` and `y` values
        //that match its column and row in the tile map
        sprite.x = x;
        sprite.y = y;

        //Add the sprite to the `world` container
        world.addChild(sprite);
      }
    });
  });

  //Add some physics properties to the car
  car.vx = 0;
  car.vy = 0;
  car.accelerationX = 0.2;
  car.accelerationY = 0.2;
  car.rotationSpeed = 0;
  car.friction = 0.96;
  car.speed = 0;

  //Center the car's rotation point
  car.setPivot(0.5, 0.5);

  //Whether or not the car should move forward
  car.moveForward = false;

  //Define the arrow keys to move the car
  let leftArrow = g.keyboard(37),
    upArrow = g.keyboard(38),
    rightArrow = g.keyboard(39),
    downArrow = g.keyboard(40);

  //Set the car's `rotationSpeed` to -0.1 (to rotate left) if the
  //left arrow key is being pressed
  leftArrow.press = () => {
    car.rotationSpeed = -0.05;
  };

  //If the left arrow key is released and the right arrow
  //key isn't being pressed down, set the `rotationSpeed` to 0
  leftArrow.release = () => {
    if (!rightArrow.isDown) car.rotationSpeed = 0;
  };

  //Do the same for the right arrow key, but set
  //the `rotationSpeed` to 0.1 (to rotate right)
  rightArrow.press = () => {
    car.rotationSpeed = 0.05;
  };

  rightArrow.release = () => {
    if (!leftArrow.isDown) car.rotationSpeed = 0;
  };

  //Set `car.moveForward` to `true` if the up arrow key is
  //pressed, and set it to `false` if it's released
  upArrow.press = () => {
    car.moveForward = true;
  };
  upArrow.release = () => {
    car.moveForward = false;
  };

  //Start the game loop by setting the game state to `play`
  g.state = play;
}

//The game loop
function play() {

  //Use the `rotationSpeed` to set the car's rotation
  car.rotation += car.rotationSpeed;

  //If `car.moveForward` is `true`, increase the speed
  if (car.moveForward) {
    car.speed += 0.05;
  }

  //If `car.moveForward` is `false`, use 
  //friction to slow the car down
  else {
    car.speed *= car.friction;
  }

  //Use the `speed` value to figure out the acceleration in the
  //direction of the car’s rotation
  car.accelerationX = car.speed * Math.cos(car.rotation);
  car.accelerationY = car.speed * Math.sin(car.rotation);

  //Apply the acceleration and friction to the car's velocity
  car.vx = car.accelerationX
  car.vy = car.accelerationY
  car.vx *= car.friction;
  car.vy *= car.friction

  //Apply the car's velocity to its position to make the car move
  car.x += car.vx;
  car.y += car.vy;

  //Slow the car down if it's stuck in the grass

  //First find the car's map index position
  let carIndex = getIndex(car.x, car.y, 64, 64, 10);

  //Get a reference to the race track map
  let trackMap = world.layers[0];

  //Slow the car if it's on a grass tile (gid 1) by setting
  //the car's friction to 0.25, to make it sluggish
  if (trackMap[carIndex] === 1) {
    car.friction = 0.25;

    //If the car isn't on a grass tile, restore its
    //original friction value  
  } else {
    car.friction = 0.96
  }

}

//Helper functions

//The `getIndex` helper method
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