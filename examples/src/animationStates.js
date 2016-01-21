/*
Learn how to make a complex walking game character by assigning animation
sequences to specific sprite states.
*/

let thingsToLoad = [
  "images/forest.png",
  "images/walkcycle.png"
];

//Create a new Hexi instance, and start it.
//Load the texture atlas that inlcudes the animation frames you want
//to load
let g = hexi(256, 256, setup, thingsToLoad);
g.start();

//Set the background color and scale the canvas
//g.backgroundColor = "black";
g.scaleToWindow();

//Declare variables used in more than one function
let elf, forest, leftArrow, upArrow, downArrow, rightArrow; 

//The `setup` function to initialize your application
function setup() {

//Make the forest background
  forest = g.sprite("images/forest.png");

  /*
  If you have a complex animation made up of sequential 
  tileset frames in a single image,  you can use 
  `filmStrip` to automatically create an array of x,y
  coordinates for each animation frame.
  `filmStrip` arguments:
  imageName, frameWidth, frameHeight, spacing
  (Use the final optional `spacing` argument if there is any default
  spacing (padding) around tileset frame images)
  */

  var walkingAnimation = g.filmstrip("images/walkcycle.png", 64, 64);

  //Now initialize the sprite with the film strip to create a sprite
  elf = g.sprite(walkingAnimation);

  //The sprite is now loaded up with all 36 frames of the animation

  //Set the elf's x and y position
  elf.setPosition(32, 128);

  /*
  Define the elf's animation states. These are names that correspond
  to frames and frame sequences in the elf's animation frames. It's
  entirely up to you to decide what you want to call these states.
  Define animation sequences as a 2-value array:

      wallkleft: [startFrame, endFrame]

  The first value is the frame number that the sequence should start
  at, and the second value is the frame number that the sequence
  should end at.
  */

  elf.states = {
    up: 0,
    left: 9,
    down: 18,
    right: 27,
    walkUp: [0, 8],
    walkLeft: [10, 17],
    walkDown: [19, 26],
    walkRight: [28, 35]
  };

  //Use the `show` method to display the elf's `right` state
  elf.show(elf.states.right);
 
  //Create some keyboard objects
  leftArrow = g.keyboard(37);
  upArrow = g.keyboard(38);
  rightArrow = g.keyboard(39);
  downArrow = g.keyboard(40);
  
  //Assign key `press` and release methods that
  //show and play the elf's different states
  leftArrow.press = () => {
    elf.playAnimation(elf.states.walkLeft);
    elf.vx = -1;
    elf.vy = 0;
  };
  leftArrow.release = () => {
    if (!rightArrow.isDown && elf.vy === 0) {
      elf.vx = 0;
      elf.show(elf.states.left);
    }
  };
  upArrow.press = () => {
    elf.playAnimation(elf.states.walkUp);
    elf.vy = -1;
    elf.vx = 0;
  };
  upArrow.release = () => {
    if (!downArrow.isDown && elf.vx === 0) {
      elf.vy = 0;
      elf.show(elf.states.up);
    }
  };
  rightArrow.press = () => {
    elf.playAnimation(elf.states.walkRight);
    elf.vx = 1;
    elf.vy = 0;
  };
  rightArrow.release = () => {
    if (!leftArrow.isDown && elf.vy === 0) {
      elf.vx = 0;
      elf.show(elf.states.right);
    }
  };
  downArrow.press = () => {
    elf.playAnimation(elf.states.walkDown);
    elf.vy = 1;
    elf.vx = 0;
  };
  downArrow.release = () => {
    if (!upArrow.isDown && elf.vx === 0) {
      elf.vy = 0;
      elf.show(elf.states.down);
    }
  };

  //Add text instructions
  g.text("Use the arrow keys to walk", "14px Futura", "white", 6, 4);    

  g.state = play;    
}

function play() {

  //Move the elf and constrain it to the canvas boundaries
  //(-18 and +18 are to compensate for image padding around the sprite)
  elf.x = Math.max(-18, Math.min(elf.x + elf.vx, g.canvas.width - elf.width + 18)); 
  elf.y = Math.max(64, Math.min(elf.y + elf.vy, g.canvas.height - elf.height));

}


