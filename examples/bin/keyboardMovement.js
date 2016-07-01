"use strict";

/*
Learn how to move a game character using the keyboard arrow keys
*/

//Create a new Hexi instance, and start it.
var g = hexi(512, 512, setup, ["images/cat.png"]);
g.start();

//Set the background color and scale the canvas
//g.backgroundColor = "black";
g.scaleToWindow();

//Declare variables used in more than one function
var cat = undefined,
    message = undefined;

//The `setup` function to initialize your application
function setup() {

  //Create the cat
  cat = g.sprite("images/cat.png");
  g.stage.putCenter(cat);

  //Use the `arrowControl` method to update the cat's
  //velocity at 5 pixels per frame
  g.arrowControl(cat, 5);

  /*
  //Alternatively, create some keyboard objects using Hexi's `keyboard` method.
  //You would usually use this code in the `setup` function
  let leftArrow = g.keyboard(37),
    upArrow = g.keyboard(38),
    rightArrow = g.keyboard(39),
    downArrow = g.keyboard(40);
   console.log(rightArrow)
   //Here 's how to customize the `press` and `release` methods of   
  //these new arrow keys: 
   //Assign key `press` methods
  leftArrow.press = () => {
    //Change the cat's velocity when the key is pressed
    cat.vx = -5;
    cat.vy = 0;
  };
  leftArrow.release = () => {
    //If the left arrow has been released, and the right arrow isn't down,
    //and the cat isn't moving vertically: 
    //Stop the cat
    if (!rightArrow.isDown && cat.vy === 0) {
      cat.vx = 0;
    }
  };
  upArrow.press = () => {
    cat.vy = -5;
    cat.vx = 0;
  };
  upArrow.release = () => {
    if (!downArrow.isDown && cat.vx === 0) {
      cat.vy = 0;
    }
  };
  rightArrow.press = () => {
    cat.vx = 5;
    cat.vy = 0;
  };
  rightArrow.release = () => {
    if (!leftArrow.isDown && cat.vy === 0) {
      cat.vx = 0;
    }
  };
  downArrow.press = () => {
    cat.vy = 5;
    cat.vx = 0;
  };
  downArrow.release = () => {
    if (!upArrow.isDown && cat.vx === 0) {
      cat.vy = 0;
    }
  };
  */

  //Add the instruction text
  message = g.text("Use the arrow keys to move the cat", "18px Futura", "black", 6, 6);

  //Change the game state to `play`.
  g.state = play;
}

//The `play` function will run in a loop
function play() {

  //Make the cat move
  g.move(cat);

  //Of course you can also move a sprite the good old-fashioned way if
  //really want to!
  //cat.x += cat.vx;
  //cat.y += cat.vy;

  //Keep the cat contained inside the stage
  g.contain(cat, g.stage);
}

/*

//Alternatively, create some keyboard objects using Hexi's `keyboard` method.
//You would usually use this code in the `setup` function
let leftArrow = g.keyboard(37),
    upArrow = g.keyboard(38),
    rightArrow = g.keyboard(39),
    downArrow = g.keyboard(40);

Here's how to customize the `press` and `release` methods of   
these new arrow keys: 

//Assign key `press` methods
leftArrow.press = () => {
  //Change the cat's velocity when the key is pressed
  cat.vx = -5;
  cat.vy = 0;
};
leftArrow.release = () => {
  //If the left arrow has been released, and the right arrow isn't down,
  //and the cat isn't moving vertically: 
  //Stop the cat
  if (!g.rightArrow.isDown && cat.vy === 0) {
    cat.vx = 0;
  }
};
upArrow.press = () => {
  cat.vy = -5;
  cat.vx = 0;
};
upArrow.release = () => {
  if (!g.downArrow.isDown && cat.vx === 0) {
    cat.vy = 0;
  }
};
rightArrow.press = () => {
  cat.vx = 5;
  cat.vy = 0;
};
rightArrow.release = () => {
  if (!g.leftArrow.isDown && cat.vy === 0) {
    cat.vx = 0;
  }
};
downArrow.press = () => {
  cat.vy = 5;
  cat.vx = 0;
};
downArrow.release = () => {
  if (!g.upArrow.isDown && cat.vx === 0) {
    cat.vy = 0;
  }
};
*/
//# sourceMappingURL=keyboardMovement.js.map