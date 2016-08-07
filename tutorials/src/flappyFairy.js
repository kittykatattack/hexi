/*
Learn how to use Hexi to build a simple game prototype
*/

//An array that contains all the files you want to load
let thingsToLoad = [
  "images/flappyFairy/flappyFairy.json"
];

//Create a new Hexi instance, and start it
let g = hexi(910, 512, setupTitleScreen, thingsToLoad);

//Start Hexi
g.start();

//Warning: The experimental fullscreen feature below has been removed for now
//until a more reliable system can be built. There were too many
//cross-platform bugs to implement this reliably inside Hexi.
//Enable fullscreen mode using `enableFullscreen`.
//Fullscreen mode will be activated as soon as the 
//user clicks or touches the canvas.
//You can supply an optional list of ascii keycodes for keys that
//will exit fullscreen mode. In this example you can exit fullscreen
//mode by pressing lowercase `x` (88) or uppercase `X` (120) on 
//the keyboard. If you leave these arguments out, the default `esc`
//key will do the trick.
//g.enableFullScreen(88, 120);

//Set the background color and scale the canvas
g.backgroundColor = "black";
g.scaleToWindow();

//Declare your global variables (global to this game, which means you
//want to use them in more than one function)
let pointer, canvas, fairy, sky, blocks,
  title, goButton, finish, dust, dustFrames;

function setupTitleScreen() {

  //Make the sky background
  sky = g.tilingSprite(
    "sky.png",
    g.canvas.width,
    g.canvas.height
  );

  //Create the title sprite
  title = g.sprite("title.png");

  //Center the title
  g.stage.putCenter(title, 0, -70);

  //Create the play button
  goButton = g.button([
    "up.png",
    "over.png",
    "down.png"
  ]);

  //Center the play button
  g.stage.putCenter(goButton, 0, 150);

  //Make the play button's `press` action
  //start the game when the button is pressed.
  goButton.release = () => {
    console.log("test")
    g.state = setupGame;
  };

  //Start the `playTitleScreen` state.
  g.state = playTitleScreen;
}

function playTitleScreen() {

  //Make the sky background scroll by shifting the `tileX`
  //of the `sky` tiling sprite.
  sky.tileX -= 1;

}

function setupGame() {

  //Make the title and play button invisible.
  title.visible = false;
  goButton.visible = false;

  //Disable the play button so that it can't be pressed
  //by setting its `enabled` property to `false`.
  goButton.enabled = false;

  //Make the world
  //Create a `group` for all the blocks
  blocks = g.group();

  //What should the initial size of the gap be between the pillars?
  let gapSize = 4;

  //How many pillars?
  let numberOfPillars = 15;

  //Loop 15 times to make 15 pillars
  for (let i = 0; i < numberOfPillars; i++) {

    //Randomly place the gap somewhere inside the pillar
    let startGapNumber = g.randomInt(0, 8 - gapSize);

    //Reduce the `gapSize` by one after every fifth pillar. This is
    //what makes gaps gradually become narrower
    if (i > 0 && i % 5 === 0) gapSize -= 1;

    //Create a block if it's not within the range of numbers
    //occupied by the gap
    for (let j = 0; j < 8; j++) {
      if (j < startGapNumber || j > startGapNumber + gapSize - 1) {
        let block = g.sprite("greenBlock.png");
        blocks.addChild(block);

        //Space each pillar 384 pixels apart. The first pillar will be
        //placed at an x position of 512
        block.x = (i * 384) + 512;
        block.y = j * 64;
      }
    }

    //After the pillars have been created, add the finish image
    //right at the end
    if (i === numberOfPillars - 1) {
      finish = g.sprite("finish.png");
      blocks.addChild(finish);
      finish.x = (i * 384) + 896;
      finish.y = 192;
    }
  }

  //Make the fairy 
  let fairyFrames = [
    "0.png",
    "1.png",
    "2.png"
  ];
  fairy = g.sprite(fairyFrames);
  fairy.fps = 12;
  fairy.setPosition(232, 32);
  fairy.vy = 0;
  fairy.oldVy = 0;

  //Create the frames array for the fairy dust images
  //that trail the fairy 
  dustFrames = [
    "pink.png",
    "yellow.png",
    "green.png",
    "violet.png"
  ];

  //Create the emitter
  dust = g.particleEmitter(
    300, //The interval
    () => {
      g.createParticles( //The function
        fairy.x + 8, //x position
        fairy.y + fairy.halfHeight + 8, //y position
        () => g.sprite(dustFrames), //Particle sprite
        g.stage, //The container to add the particles to               
        3, //Number of particles
        0, //Gravity
        true, //Random spacing
        2.4, 3.6, //Min/max angle
        12, 18, //Min/max size
        1, 2, //Min/max speed
        0.005, 0.01, //Min/max scale speed
        0.005, 0.01, //Min/max alpha speed
        0.05, 0.1 //Min/max rotation speed
      );
    }
  );

  //Make the particle stream start playing when the game starts
  dust.play();

  //Make the pointer and increase the fairy's 
  //vertical velocity when it's tapped
  g.pointer.tap = () => {
    fairy.vy += 1.5;
  };

  //set the game state to `play`
  g.state = play;
}

//The `play` state
function play() {

  //Make the sky background scroll by shifting the `tileX`
  //of the `sky` tiling sprite
  sky.tileX -= 1;

  //Move the blocks 2 pixels to the left each frame.
  //This will just happen while the finish image is off-screen.
  //As soon as the finish image scrolls into view, the blocks
  //container will stop moving
  if (finish.gx > 256) {
    blocks.x -= 2;
  }

  //Add gravity to the fairy
  fairy.vy += -0.05;
  fairy.y -= fairy.vy;

  //Decide whether or not the fairy should flap her wings 
  //If she's starting to go up, make her flap her wings and emit fairy dust
  if (fairy.vy > fairy.oldVy) {
    if (!fairy.playing) {
      fairy.playAnimation();
      if (fairy.visible && !dust.playing) dust.play();
    }
  }

  //If she's staring to go down, stop flapping her wings, show the first frame 
  //and stop the fairy dust
  if (fairy.vy < 0 && fairy.oldVy > 0) {
    if (fairy.playing) fairy.stopAnimation();
    fairy.show(0);
    if (dust.playing) dust.stop();
  }

  //Store the fairy's current vy so we can use it
  //to find out if the fairy has changed direction
  //in the next frame. (You have to do this as the last step)
  fairy.oldVy = fairy.vy;

  //Keep the fairy contained inside the stage and 
  //neutralize her velocity if she hits the top or bottom boundary
  let fairyVsStage = g.contain(fairy, g.stage);
  if (fairyVsStage) {
    if (fairyVsStage.has("bottom") || fairyVsStage.has("top")) {
      fairy.vy = 0;
    }
  }

  //Loop through all the blocks and check for a collision between
  //each block and the fairy. (`some` will quit the loop as soon as
  //`hitTestRectangle` returns `true`). Set `hitTestRectangle`s third argument
  //to `true` to use the sprites' global coordinates
  let fairyVsBlock = blocks.children.some(block => {
    return g.hitTestRectangle(fairy, block, true);
  });

  //If there's a collision and the fairy is currently visible,
  //create the explosion effect and reset the game after
  //a three second delay

  if (fairyVsBlock && fairy.visible) {

    //Make the fairy invisible
    fairy.visible = false;

    //Create a fairy dust explosion
    g.createParticles(
      fairy.centerX, fairy.centerY, //x and y position
      () => g.sprite(dustFrames), //Particle sprite
      g.stage, //The container to add the particles to  
      20, //Number of particles
      0, //Gravity
      false, //Random spacing
      0, 6.28, //Min/max angle
      16, 32, //Min/max size
      1, 3 //Min/max speed
    );

    //Stop the dust emitter that's trailing the fairy
    dust.stop();

    //Wait 3 seconds and then reset the game
    g.wait(3000, reset);
  }

  //Alternatively, you can achieve the same collision effect
  //using the higher level universal `hit` function
  /*
  //Check for a collision between the fairy and the blocks
  let fairyVsBlock = g.hit(

    //arguments: sprite, array, react, bounce, global 
    fairy, blocks.children, false, false, true,

    //collision function
    () => {
      if (fairy.visible) {

        //Make the fairy invisible
        fairy.visible = false;

        //Create a fairy dust explosion
        g.particleEffect(
          fairy.centerX, fairy.centerY, //x and y position
          function() {                  //Particle sprite
            return g.sprite(dustFrames)
          },     
          20,                           //Number of particles
          0,                            //Gravity
          false,                        //Random spacing
          0, 6.28,                      //Min/max angle
          16, 32,                       //Min/max size
          1, 3                          //Min/max speed
        );
        
        //Stop the dust emitter
        dust.stop();

        //Wait 3 seconds and then reset the game
        g.wait(3000, reset);
      }
    }
  );
  */

}

function reset() {

  //Reset the game if the fairy hits a block
  fairy.visible = true;
  fairy.y = 32;
  fairy.vy = 0;
  dust.play();
  blocks.x = 0;
}