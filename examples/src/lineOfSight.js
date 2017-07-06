let thingsToLoad = [
  "images/alien.png",
  "images/monsterNormal.png",
  "images/monsterAngry.png"
];

//Create a new Hexi instance, and start it.
let g = hexi(704, 512, setup, thingsToLoad);

//Set the background color and scale the canvas
//g.backgroundColor = "black";
g.scaleToWindow();

//Start Hexi
g.start();

//Game variables
let alien, monster, boxes, line;

//The `setup` function to initialize your application
function setup() {

  //Create the alien using the `alienFrames`
  alien = g.sprite("images/alien.png");

  //Center the alien on the left side of the canvas
  g.stage.putCenter(alien, -g.canvas.width / 4);

  //Create the monster sprite using the `monsterFrames`
  monster = g.sprite([
    "images/monsterNormal.png",
    "images/monsterAngry.png"
  ]);

  //Define the monster's two states: `normal` and `scared`
  //`0` and `1` refer to the monster's two animation frames
  monster.states = {
    normal: 0,
    angry: 1
  };

  //Center the monster on the right side of the canvas
  g.stage.putCenter(monster, g.canvas.width / 4);

  //Create the boxes
  boxes = [];
  let numberOfboxes = 4;
  for (let i = 0; i < numberOfboxes; i++) {
    boxes.push(g.sprite("images/box.png"));
  }

  //Position the boxes in a square shape around the 
  //center of the canvas
  g.stage.putCenter(boxes[0], -32, -64);
  g.stage.putCenter(boxes[1], 32, -64);
  g.stage.putCenter(boxes[2], -32)
  g.stage.putCenter(boxes[3], 32);

  //Switch on drag-and-drop for all the sprites
  alien.draggable = true;
  monster.draggable = true;
  boxes.forEach(wall => wall.draggable = true);

  //Create a `line` sprite.
  //`line` arguments:
  //strokeStyle, lineWidth, ax, ay, bx, by
  //`ax` and `ay` define the line's start x/y point,
  //`bx`, `by` define the line's end x/y point.
  line = g.line(
    "red",
    4,
    monster.centerX,
    monster.centerY,
    alien.centerX,
    alien.centerY
  );

  //Set the line's alpha to 0.3
  line.alpha = 0.3

  let message = g.text("Drag and drop the sprites", "16px Futura", "black");
  message.x = 30;
  message.y = 10;

  //Change the game state to `play`
  g.state = play;
}

//The `play` function contains all the game logic and runs in a loop
function play() {

  //Update the position of the line
  line.ax = monster.centerX;
  line.ay = monster.centerY;
  line.bx = alien.centerX;
  line.by = alien.centerY;

  //Check whether the monster can see the alien by setting its 
  //`lineOfSight` property. `lineOfSight` will be `true` if there
  //are no boxes obscuring the view, and `false` if there are
  monster.lineOfSight = lineOfSight(
    monster, //Sprite one
    alien, //Sprite two
    boxes, //An array of obstacle sprites
    16 //The distance between each collision point
  );

  //If the monster has line of sight, set its state to "angry" and 
  if (monster.lineOfSight) {
    monster.show(monster.states.angry)
    line.alpha = 1;
  } else {
    monster.show(monster.states.normal)
    line.alpha = 0.3;
  }

}

//Helper functions
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