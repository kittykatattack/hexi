"use strict";

/*
This example illustrates how you can use `addChild` and
`removeChild` to make sprites the children of other sprites.
All sprites have local and global x and y coordinates. The local
coordinates, `x` and `y`, are relative to the top left corner of the
sprite's parent. The global coordinates, `gx` and `gy` are relative
to the top left corner of the `stage`. (The `stage` is the root
container that contains all the sprites in the game.)
*/

//The files you want to load
var thingsToLoad = ["images/cat.png", "images/star.png"];

//Create a new Hexi instance, and start it.
var g = hexi(512, 512, setup, thingsToLoad);
g.start();

//Set the background color and scale the canvas
//g.backgroundColor = "black";
g.scaleToWindow();

//Declare variables used in more than one function
var cat = undefined,
    square = undefined,
    message = undefined,
    star = undefined,
    ball = undefined,
    line = undefined,
    localMessage = undefined,
    globalMessage = undefined,
    collisionMessage = undefined;

//The `setup` function to initialize your application
function setup() {

  //Make a square and position it
  square = g.rectangle(256, 256, "lightblue", "black", 1);

  //Set the square's pivot point to its center, so that it will rotate
  //around its center.
  //IMPORTANT: Shifting the pivot point doesn't move the position of
  //the sprite, but it does shift its x/y origin point. The x/y point of the
  //square will now be at its center.
  square.setPivot(0.5, 0.5);

  //Use the stage's `putCenter` method to put the square
  //in the center of the stage. You can also use `putTop`,
  //`putRight`, `putBottom` and `putLeft`. If you want to offset
  //the position, use x and y offset values as the second and third
  //arguments: `sprite.putTop(anySprite, -10, -5)`
  g.stage.putCenter(square);

  //Add a drop shadow filter to the square
  var shadow = g.dropShadowFilter();
  shadow.alpha = 0.4;
  shadow.blur = 6;
  shadow.distance = 8;
  square.filters = [shadow];

  //Make the cat sprite
  cat = g.sprite("images/cat.png");

  //Control the cat with the keyboard
  g.arrowControl(cat, 5);

  //Make a star sprite and add it as a child of the cat.
  //Set the star's pivot point to 0.5 so that it will rotate around
  //its center
  star = g.sprite("images/star.png");
  star.setPivot(0.5, 0.5);

  //Add the star to the cat and position it to the right of the cat 
  cat.addChild(star);
  cat.putRight(star);

  //Add the cat as a child of the square, and put it at the bottom of
  //the square
  square.addChild(cat);
  square.putBottom(cat, 0, -cat.height);

  //Create some text that we'll use to display the cat's local position
  localMessage = g.text("Test", "14px Futura", "black");

  //Add the text as a child of the square
  square.addChild(localMessage);

  //Use the text's local `x` and local `y` values to set its top left
  //corner position relative to the square's top left corner. Because
  //the square's pivot point was set to its center, its x/y origin
  //point has also been moved to it's center. That means if you want
  //to position something at the square's top left corner you need to
  //subtract half the square's width and height.
  localMessage.x = -square.halfWidth + 6;
  localMessage.y = -square.halfHeight + 2;

  //Add an `angle` property to the star that we'll use to
  //help make the star rotate around the cat
  star.angle = 0;

  //Create some text that will display the cat's global position
  globalMessage = g.text("This is some text to start", "14px Futura", "black");
  globalMessage.x = 6;
  globalMessage.y = g.canvas.height - globalMessage.height - 4;

  //Add some text to display the side on which
  //the cat is colliding with the edges of the square
  collisionMessage = g.text("Use the arrow keys to move...", "16px Futura", "black", 4);

  //If you change the square's `alpha`, the child sprites inside it will
  //be similarly affected
  //square.alpha = 0.2;

  //Change the state to `play`
  g.state = play;
}

//The `play` function will run in a loop
function play() {

  //Move the cat
  g.move(cat);

  //You can also move a sprite the good old-fashioned way
  //cat.x += cat.vx;
  //cat.y += cat.vy;

  //Rotate the square
  square.rotation += 0.005;

  //Display the cat's local `x` and local `y` coordinates. These are
  //relative to the square's center point. (The square is the cat's
  //parent.) If we hadn't changed the square's pivot point, the cat's
  //x and y values would have been relative to the square's top left corner
  localMessage.content = "Local position: cat.x: " + Math.round(cat.x) + ", cat.y: " + Math.round(cat.y);

  //Display the cat's global `gx` and global `gy` coordinates. These are
  //relative to the `stage`, which is the root container for all the
  //sprites and groups.
  globalMessage.content = "Global position: cat.gx: " + Math.round(cat.gx) + ", cat.gy: " + Math.round(cat.gy);

  //Contain the cat inside the square's boundary
  var catHitsEdges = g.contain(cat, square);

  //Display the edge of the canvas that the cat hit
  if (catHitsEdges) {

    //Find the collision side
    var collisionSide = "";
    if (catHitsEdges.has("left")) collisionSide = "left";
    if (catHitsEdges.has("right")) collisionSide = "right";
    if (catHitsEdges.has("top")) collisionSide = "top";
    if (catHitsEdges.has("bottom")) collisionSide = "bottom";

    //Display it
    collisionMessage.content = "The cat hit the " + collisionSide + " of the square";
  }
  //Make the star rotate
  star.rotation += 0.2;

  //Update the star's angle
  star.angle += 0.05;

  //The `rotateAroundSprite` method lets you rotate a sprite around
  //another sprite. The first argument is the sprite you want to
  //rotate, and the second argument is the sprite around which it
  //should rotate. The third argument is the distance
  g.rotateAroundSprite(star, cat, 64, star.angle);

  //if you want the rotation to happen around a point that's offset
  //from the center of the sprite, change the center sprite's x and y pivot values
  //to point that you need
}
//# sourceMappingURL=parentsAndChildren.js.map