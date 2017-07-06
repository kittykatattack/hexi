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
let car, world, aiCar, previousMapAngle, targetAngle;

function setup() {

  //Create the `world` container that defines our
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

    //The character layer. `3` represents the player's car,
    //`4` represents the AI car and
    //`0` represents an empty cell which won't contain any
    //sprites
    [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 3, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 4, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0
    ],

    //Angles map
    [
      45, 45, 45, 45, 45, 45, 45, 45, 135, 135,
      315, 0, 0, 0, 0, 0, 0, 90, 135, 135,
      315, 0, 0, 0, 0, 0, 0, 90, 135, 135,
      315, 315, 270, 315, 315, 315, 315, 90, 90, 135,
      315, 315, 270, 135, 135, 135, 135, 90, 90, 135,
      315, 315, 270, 180, 180, 180, 180, 180, 180, 135,
      315, 315, 270, 180, 180, 180, 180, 180, 180, 135,
      315, 270, 270, 225, 225, 225, 225, 225, 225, 225
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

            //The player's car 
          case 3:
            sprite = g.sprite(g.frame("images/tileSet.png", 192, 192, 48, 48));
            car = sprite;
            break;

            //The AI car 
          case 4:
            sprite = g.sprite(g.frame("images/tileSet.png", 192, 128, 48, 48));
            aiCar = sprite;
        }


        if (sprite) {

          //Position the sprite using the calculated `x` and `y` values
          //that match its column and row in the tile map
          sprite.x = x;
          sprite.y = y;

          //Add the sprite to the `world` container
          world.addChild(sprite);
        }

      }
    });
  });

  //A function to add physics properties to the cars
  let addCarProperties = carSprite => {
    carSprite.vx = 0;
    carSprite.vy = 0;
    carSprite.accelerationX = 0.2;
    carSprite.accelerationY = 0.2;
    carSprite.rotationSpeed = 0;
    carSprite.friction = 0.96;
    carSprite.speed = 0;

    //Center the car's rotation point
    carSprite.setPivot(0.5, 0.5);

    //Whether or not the car should move forward
    carSprite.moveForward = false;
  };

  //Add physics properties to the player's car
  addCarProperties(car);

  //Add physics properties and set it to move forward
  //when the game begins
  addCarProperties(aiCar);
  aiCar.moveForward = true;

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

  //Move the AI car

  //If `aICar.moveForward` is `true`, increase the speed as long
  //it is under the maximum speed limit of 3
  if (aiCar.moveForward && aiCar.speed <= 3) {
    aiCar.speed += 0.08;
  }

  //Find the AI car's current angle, in degrees
  let currentAngle = aiCar.rotation * (180 / Math.PI);

  //Constrain the calculated angle to a value between 0 and 360
  currentAngle = currentAngle + Math.ceil(-currentAngle / 360) * 360;

  //Find out its index position on the map
  let aiCarIndex = getIndex(aiCar.x, aiCar.y, 64, 64, 10);

  //Find out what the target angle is for that map position
  let angleMap = world.layers[2];
  let mapAngle = angleMap[aiCarIndex];

  //Add an optional random variation of 20 degrees each time the aiCar
  //encounters a new map angle
  if (mapAngle !== previousMapAngle) {
    targetAngle = mapAngle + randomInt(-20, 20);
    previousMapAngle = mapAngle;
  }

  //If you don't want any random variation in the iaCar's angle
  //replace the above if statement with this line of code:
  //targetAngle = mapAngle;

  //Calculate the difference between the current 
  //angle and the target angle
  let difference = currentAngle - targetAngle;

  //Figure out whether to turn the car left or right
  if (difference > 0 && difference < 180) {

    //Turn left
    aiCar.rotationSpeed = -0.03;
  } else {

    //Turn right
    aiCar.rotationSpeed = 0.03;
  }

  //Use the `rotationSpeed` to set the car's rotation
  aiCar.rotation += aiCar.rotationSpeed;

  //Use the `speed` value to figure out the acceleration in the
  //direction of the aiCar’s rotation
  aiCar.accelerationX = aiCar.speed * Math.cos(aiCar.rotation);
  aiCar.accelerationY = aiCar.speed * Math.sin(aiCar.rotation);

  //Apply the acceleration and friction to the aiCar's velocity
  aiCar.vx = aiCar.accelerationX
  aiCar.vy = aiCar.accelerationY
  aiCar.vx *= aiCar.friction;
  aiCar.vy *= aiCar.friction;

  //Apply the aiCar's velocity to its position to make the aiCar move
  aiCar.x += aiCar.vx;
  aiCar.y += aiCar.vy;

  //Move the player's car

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
  car.vy *= car.friction;

  //Apply the car's velocity to its position to make the car move
  car.x += car.vx;
  car.y += car.vy;

  //Slow the cars down if they're stuck in the grass

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
    car.friction = 0.96;
  }

  //Slow the aiCar if it's on a grass tile (gid 1) by setting
  //its friction to 0.25, to make it sluggish
  if (trackMap[aiCarIndex] === 1) {
    aiCar.friction = 0.25;

    //If the car isn't on a grass tile, restore its
    //original friction value  
  } else {
    aiCar.friction = 0.96;
  }
}

//Helper functions
function isCenteredOverCell(sprite) {
  return Math.floor(sprite.x) % world.tilewidth === 0 && Math.floor(sprite.y) % world.tileheight === 0
}

//The `randomInt` helper function returns a random integer between a minimum
//and maximum value
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

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