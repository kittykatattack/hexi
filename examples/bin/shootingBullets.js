"use strict";

/*
Learn how to use the `shoot` method to create a sprite 
that can shoot bullets
*/

//Create a new Hexi instance, and start it.
var g = hexi(256, 256, setup);

//Set the background color and scale the canvas
//g.backgroundColor = "black";
g.scaleToWindow();

//Declare variables used in more than one function
var box = undefined,
    turret = undefined,
    bullets = undefined,
    message = undefined;

//If you're not loading any files, start Hexi after
//you've declared your global variables
g.start();

//The `setup` function to initialize your application
function setup() {

  //Make a square and center it in the stage
  box = g.rectangle(32, 32, "gray", "black", 2);

  //Rotating sprites look best if their pivot points are centered
  box.setPivot(0.5, 0.5);
  g.stage.putCenter(box);

  //Make a turret by drawing a red, 4 pixel wide line that's 32 pixels
  //long
  turret = g.line("red", 4, 0, 0, 32, 0);

  //Add the line as a child of the box and place its
  //start point at the box's center. (Because we centered the box's
  //pivot point, its center has an x/y value of 0)
  box.addChild(turret);
  turret.x = 0;
  turret.y = 0;

  //Make an array to store the bullets
  bullets = [];

  //Call the `shoot` method every time the user presses
  //the pointer
  g.pointer.press = function () {
    g.shoot(box, //The shooter
    box.rotation, //The angle at which to shoot
    32, //The x point on the shooter where the bullet should start
    0, //The y point on the shooter where the bullet should start
    g.stage, //The container you want to add the bullet to
    7, //The bullet's speed (pixels per frame)
    bullets, //The array used to store the bullets

    //A function that returns the sprite that should
    //be used to make each bullet
    function () {
      return g.circle(8, "red");
    });
  };

  //Add some text
  message = g.text("Click or tap to shoot", "16px sans-serif", "black", 10, 10);

  //Change the state to `play`
  g.state = play;
}

//The `play` function will run in a loop
function play() {

  //Make the box and turret angle towards the pointer
  box.rotation = g.angle(box, g.pointer);

  //Id you just want to move all the bullets without removing them
  //they hit the screen boundaries, you can just use the help of the `move` method
  //g.move(bullets);

  //Remove the bullets if they cross the screen boundaries
  //Loop through the bullets using `filter` so that we can remove
  //the bullet easily
  bullets = bullets.filter(function (bullet) {

    //Move the bullet
    g.move(bullet);

    //Check for a collision with the stage boundary
    var collision = g.outsideBounds(bullet, g.stage);

    //If there's a collision, display the side that the collision
    //happened on, remove the bullet sprite and filter it out of
    //the `bullets` array
    if (collision) {

      //Find out on which side the collision happened
      var collisionSide = undefined;
      if (collision.has("left")) collisionSide = "left";
      if (collision.has("right")) collisionSide = "right";
      if (collision.has("top")) collisionSide = "top";
      if (collision.has("bottom")) collisionSide = "bottom";

      //Display the result in a text sprite
      message.content = "The bullet hit the " + collisionSide;

      //The `remove` function will remove a sprite for its parent.
      g.remove(bullet);

      //Remove the bullet from the `bullets` array
      return false;
    }

    //If the bullet hasn't hit the edge of the screen,
    //keep it in the `bullets` array
    return true;
  });
}
//# sourceMappingURL=shootingBullets.js.map