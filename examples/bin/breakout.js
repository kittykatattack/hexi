"use strict";

/*
Learn how to use Hexi to build a
breakout game prototype
*/

var thingsToLoad = ["images/bloxyee/bloxyee.json", "fonts/puzzler.otf", "sounds/music.wav", "sounds/bounce.wav"];

//Create a new Hexi instance, and start it.
var g = hexi(512, 512, setup, thingsToLoad, load);

//Set the background color and scale the canvas
//g.backgroundColor = "black";
g.scaleToWindow();

//Start Hexi
g.start();

//Game variables
var paddle = undefined,
    ball = undefined,
    topBorder = undefined,
    blocks = undefined,
    blockFrames = undefined,
    music = undefined,
    bounceSound = undefined,
    message = undefined,
    titleMessage = undefined,

//The size of the grid of blocks
gridWidth = 8,
    gridHeight = 5,
    cellWidth = 64,
    cellHeight = 64,

//title sprites
title = undefined,
    playButton = undefined,

//Groups
titleScene = undefined,
    gameScene = undefined,

//Score
score = 0,

//The paddle wobble tween
paddleWobble = undefined;

//The `load` function will run while assets are loading. This is the
//same `load` function you assigned as Hexi's 4th initialization argument.
//Its optional. You can leave it out if you don't have any files to
//load, or you don't need to monitor their loading progress

function load() {

  //Display the file currently being loaded
  console.log("loading: " + g.loadingFile);

  //Display the percentage of files currently loaded
  console.log("progress: " + g.loadingProgress);

  //Add an optional loading bar
  g.loadingBar();

  //This built-in loading bar is fine for prototyping, but I
  //encourage to to create your own custom loading bar using Hexi's
  //`loadingFile` and `loadingProgress` values. See the `loadingBar`
  //and `makeProgressBar` methods in Hexi's `core.js` file for ideas
}

//The `setup` function to initialize your application
function setup() {

  //Sound and music
  bounceSound = g.sound("sounds/bounce.wav");
  music = g.sound("sounds/music.wav");
  music.loop = true;

  //Create the sprites
  //1. The `titleScene` sprites

  //The `title`
  title = g.sprite("title.png");

  //The play button
  playButton = g.button(["up.png", "over.png", "down.png"]);

  //Set the `playButton`'s x property to 514 so that
  //it's offscreen when the sprite is created
  playButton.x = 514;
  playButton.y = 350;

  //Set the `titleMessage` x position to -200 so that it's offscreen
  titleMessage = g.text("start game", "20px puzzler", "white", -200, 300);

  //Make the `playButton` and `titleMessage` slide in from the 
  //edges of the screen using the `slide` function
  g.slide(playButton, 250, 350, 30, "decelerationCubed");
  g.slide(titleMessage, 250, 300, 30, "decelerationCubed");

  //Create the `titleScene` group
  titleScene = g.group(title, playButton, titleMessage);

  //2. The `gameScene` sprites

  //The paddle
  paddle = g.sprite("paddle.png");
  g.stage.putBottom(paddle, 0, -24);

  //The ball
  ball = g.sprite("ball.png");
  g.stage.putBottom(ball, 0, -128);

  //Set the ball's initial velocity
  ball.vx = 12;
  ball.vy = 8;

  //Add a black border along the top of the screen
  topBorder = g.rectangle(512, 32, "black");

  //Plot the blocks
  //First create an array that stores references to all the
  //blocks frames in the texture atlas
  blockFrames = ["blue.png", "green.png", "orange.png", "red.png", "violet.png"];

  //Use the `grid` function to randomly plot the
  //blocks in a grid pattern
  blocks = g.grid(gridWidth, gridHeight, 64, 64, false, 0, 0, function () {

    //Choose a random block from the tileset for each grid cell
    var randomBlock = g.randomInt(0, 4);
    return g.sprite(blockFrames[randomBlock]);
  });

  //Position the blocks 32 pixels below the top of the canvas
  blocks.y = 32;

  //A text sprite for the score
  message = g.text("test", "20px puzzler", "white");
  message.x = 8;
  message.y = 8;

  //Add the game sprites to the `gameScene` group
  gameScene = g.group(paddle, ball, topBorder, blocks, message);

  //Position the `gameScene` offscreen at -514 so that its
  //not visible when the game starts
  gameScene.x = -514;

  //Program the play button's `press` function to start the game.
  //Start the music, set the `state` to `play`
  //make `titleScene` slide out to the right and
  //the `gameScene` slide in from the left
  playButton.press = function () {
    if (!music.playing) music.play();
    g.state = play;
    g.slide(titleScene, 514, 0, 30, "decelerationCubed");
    g.slide(gameScene, 0, 0, 30, "decelerationCubed");
  };
}

//The `play` function contains all the game logic and runs in a loop
function play() {

  //Move the paddle to the mouse's position
  paddle.x = g.pointer.x - paddle.halfWidth;

  //Keep the paddle within the screen boundaries
  g.contain(paddle, g.stage);

  //Move the ball
  g.move(ball);

  //Bounce the ball off the screen edges. Use the `contain` method
  //with a custom `bounds` object (the second argument) that defines
  //the area that the ball should bounce around in.
  //Play the bounceSound when the ball hits one of these edges,
  //and reduce the score by one if it hits the ground
  var ballHitsWall = g.contain(ball, { x: 0, y: 32, width: g.canvas.width, height: g.canvas.height }, true,

  //what should happen when the ball hits the edges of the boundary?
  function (collision) {

    //Play the bounce sound
    bounceSound.play();

    //If the ball hits the bottom, perform these additional tasks:
    if (collision.has("bottom")) {

      //Subract 1 from the score
      score -= 1;

      //Add optional screen shake

      //Shake the screen (the `gameScene` sprite)
      //`shake` arguments: sprite, magnitude, angularShake?
      //g.shake(gameScene, 0.05, true);

      //If `angularShake?` (the 3rd argument) is `true`, the sprite will shake around
      //its axis. (Make sure that you've set your sprite's x/y pivot
      //point to 0.5 for this to work effectively) The `magnitude` will be the maximum value, in
      //radians, that it should shake. If `angularShake?` is `false`
      //the shake effect will happen on the x/y axis.

      //g.shake(gameScene, 16, false);

      //In that case
      //the magnitude will be the maximum amount of displacement,
      //in pixels.
    }
  });

  /*
  Check for a collision between the ball and the paddle, and 
  bounce the ball off the paddle. Play the `bounceSound` when 
  the collision occurs. 
  You can use the universal `hit` collision function to do this.
  `hit` arguments:
  spriteA, spriteB, reactToCollision?, bounce?, useGlobalCoordinates?
  actionWhenCollisionOccurs
  */

  var ballHitsPaddle = g.hit(ball, paddle, true, true, true, function (collision) {

    //1. Play the bounce sound
    bounceSound.play();

    //2. Make the paddle wobble when the ball hits it.

    //a. Remove any possible previous instances of the
    //`paddleWobble` tween, and reset the paddle's scale
    if (paddleWobble) {
      paddle.scaleX = 1;
      paddle.scaleY = 1;
      g.removeTween(paddleWobble);
    };

    //b. Create the wobble tween
    paddleWobble = g.wobble(paddle, 1.3, 1.2, 5, 10, 10, -10, -10, 0.96);
  });

  /*
  Check for a collision between the ball and the all 
  the blocks in the grid.
  You can use the universal `hit` collision function to do this. If one
  of the first two arguments is an array, the `hit` function will loop
  through all the sprites in that array and check it for a collision
  with the other sprite.
  `hit` arguments:
  spriteA, spriteB, reactToCollision?, bounce?, useGlobalCoordinates?
  actionWhenCollisionOccurs
  */

  var ballHitsBlock = g.hit(ball, blocks.children, true, true, true, function (collision, block) {

    //Add 1 to the score, play the bounce sound
    //and remove the block that was hit
    score += 1;
    bounceSound.play();
    g.remove(block);

    //Create the particle effect

    //1. Find the globalCenterX and globalCenterY
    //position for the block that was hit
    var globalCenterX = block.gx + block.halfWidth,
        globalCenterY = block.gy + block.halfHeight;

    //2. Create the effect
    g.createParticles(globalCenterX, globalCenterY, //x and y position
    function () {
      return g.sprite("star.png");
    }, //Particle function
    g.stage, //The container to add it to
    20, //Number of particles
    0.3, //Gravity
    true, //Random spacing
    0, 6.28, //Min/max angle
    12, 24, //Min/max size
    5, 10, //Min/max speed
    0.005, 0.01, //Min/max scale speed
    0.005, 0.01, //Min/max alpha speed
    0.05, 0.1 //Min/max rotation speed
    );
  });

  //Display the current score
  message.content = "Score: " + score;

  //Check for the end of the game
  if (blocks.empty) {

    //Pause the game, wait for 1 second, and then
    //call the `end` function
    g.pause();
    g.wait(1000, function () {
      end();
    });
  }
}

//A function that will run when the game ends
function end() {

  //Display the `titleScene` and hide the `gameScene`
  g.slide(titleScene, 0, 0, 30, "decelerationCubed");
  g.slide(gameScene, -514, 0, 30, "decelerationCubed");

  //Display the final score
  titleMessage.content = "Score: " + score;

  //Lower the music volume
  music.volume = 0.3;

  //Assign a new button `press` action to
  //`restart` the game
  playButton.press = function () {
    restart();
  };
}

//A function to restart the game
function restart() {

  //Remove any remaining blocks if there are any
  g.remove(blocks);

  //Plot a new grid of blocks
  blocks = g.grid(gridWidth, gridHeight, 64, 64, false, 0, 0, function () {

    //Choose a random block from the
    //`blockFrames` array for each grid cell
    var randomBlock = g.randomInt(0, 4);
    return g.sprite(blockFrames[randomBlock]);
  });

  //Add the blocks to the `gameScene` and position it
  gameScene.addChild(blocks);
  blocks.y = 32;
  blocks.x = 0;

  //Reset the ball and paddle positions
  g.stage.putBottom(paddle, 0, -22);
  g.stage.putBottom(ball, 0, -128);

  //Reset the ball's velocity
  ball.vx = 12;
  ball.vy = 8;

  //Reset the score
  score = 0;

  //Set the music volume to full
  music.volume = 1;

  //Hide the titleScene and reveal the gameScene
  g.slide(titleScene, 514, 0, 30, "decelerationCubed");
  g.slide(gameScene, 0, 0, 30, "decelerationCubed");

  //Set the game state to `play` and `resume` the game
  g.state = play;
  g.resume();
}
//# sourceMappingURL=breakout.js.map