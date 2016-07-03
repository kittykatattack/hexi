/*
Learn how to use Hexi to build a simple game prototype
*/

//An array that contains all the files you want to load
let thingsToLoad = [
  "images/alienArmada.json",
  "sounds/explosion.mp3",
  "sounds/music.mp3",
  "sounds/shoot.mp3",
  "fonts/emulogic.ttf" //<- The custom font
];

//Create a new Hexi instance, and start it
let g = hexi(480, 320, setup, thingsToLoad, load);

//Set the background color and scale the canvas
//g.backgroundColor = "black";
g.scaleToWindow();

//Start Hexi
g.start();

//Declare your global variables (global to this game, which means you
//want to use them in more than one function)
let cannon,
  scoreDisplay,
  music,
  bullets,
  winner,
  shootSound,
  explosionSound,
  aliens,
  score,
  scoreNeededToWin,
  alienFrequency,
  alienTimer,
  gameOverMessage;

//Use the `load` function to run any code while the assets are
//loading. The `load` function runs in the game loop.
function load() {

  //Use Hexi's built in `loadingBar` to display a loading progress
  //percentage bar while the assets are loading.
  g.loadingBar();
}

//The `setup` function runs once and is used to initializes your game 
function setup() {

  //Make the background.
  let background = g.sprite("background.png");

  //Create the cannon.
  cannon = g.sprite("cannon.png");

  //Center the canon 40 pixels above the bottom of the stage.
  //`putBottom` arguments: spriteToPosition, xOffset, yOffset.
  g.stage.putBottom(cannon, 0, -40);

  //An array to store the bullets.
  bullets = [];

  //An array to store the aliens
  aliens = [];

  //Create the score message
  //`text` arguments: stringContent, font, color, x, y.
  scoreDisplay = g.text("0", "20px emulogic", "#00FF00", 400, 10);

  //Create the sounds.
  //Music.
  music = g.sound("sounds/music.mp3");
  music.play();

  //Shoot sound.
  //Create the sound.
  shootSound = g.sound("sounds/shoot.mp3");

  //Pan the `shootSound` so that it's 75% in the left speaker.
  //Panning values range between -1 (left speaker) and 1 (right
  //speaker.) A pan value of 0 means that the sound is equal
  //in both speakers.
  shootSound.pan = -0.5;

  //Explosion sound.
  //Create the sound.
  explosionSound = g.sound("sounds/explosion.mp3");

  //Pan the `explosionSound` so that it's 75% in the right speaker.
  explosionSound.pan = 0.5;

  //Set up the keyboard arrow keys to move the cannon.
  let leftArrow = g.keyboard(37),
    rightArrow = g.keyboard(39),
    spaceBar = g.keyboard(32);

  //Left arrow key.
  //Assign key `press` method.
  leftArrow.press = () => {

    //Change the player's velocity when the key is pressed.
    cannon.vx = -5;
    cannon.vy = 0;
  };

  //Assign key `release` method.
  leftArrow.release = () => {

    //If the left arrow has been released, and the right arrow isn't down,
    //and the player isn't moving vertically:
    //Stop the player.
    if (!rightArrow.isDown && cannon.vy === 0) {
      cannon.vx = 0;
    }
  };

  //Right arrow key.
  //Assign key `press` method.
  rightArrow.press = () => {
    cannon.vx = 5;
    cannon.vy = 0;
  };

  //Assign key `release` method.
  rightArrow.release = () => {
    if (!leftArrow.isDown && cannon.vy === 0) {
      cannon.vx = 0;
    }
  };

  //Space key.
  spaceBar.press = () => {

    //Shoot the bullet.
    g.shoot(
      cannon, //The shooter
      4.71, //The angle at which to shoot (4.71 is up)
      cannon.halfWidth, //Bullet's x position on the cannon
      0, //Bullet's y position on the canon
      g.stage, //The container to which the bullet should be added
      7, //The bullet's speed (pixels per frame)
      bullets, //The array used to store the bullets

      //A function that returns the sprite that should
      //be used to make each bullet
      () => g.sprite("bullet.png")
    );

    //Play the shoot sound.
    shootSound.play();
  };

  //Game variables
  score = 0;
  scoreNeededToWin = 60;
  alienTimer = 0;
  alienFrequency = 100;
  winner = "";

  //Set the game state to `play`
  g.state = play;
}

//The `play` function contains all the game logic and runs in a loop
function play() {

  /* The Cannon */

  //Move the cannon.
  g.move(cannon);

  //Keep the cannon contained to the stage boundary.
  g.contain(cannon, g.stage);

  /* The Bullets */

  //Use the `move` method to move all the bullet sprites in the
  //`bullets` array. The `move` method automatically loops through
  //all the sprites in the array and updates their x and y positions
  //with the value of their `vx` and `vy` velocity values.
  g.move(bullets);

  /* Make the Aliens */

  //Make the aliens with the help of an `alienTimer` that
  //creates aliens with ever-increasing frequency. The 
  //`alienTimer` starts at 0, and is updated by 1 each frame.
  //When it reaches the value of `alienFrequency` (100), 
  //a new alien is created, and the value
  //of `alienFrequency` is reduced by one. That means the next
  //Alien will be created when the timer reacher 99, and the
  //one after that when the timer reaches 98. This creates a
  //slowly increasing number of aliens which gradually becomes
  //a deluge.

  //Add one to the alienTimer.
  alienTimer++;

  //Make a new alien if `alienTimer` equals the `alienFrequency`.
  if (alienTimer === alienFrequency) {

    //Create the alien.
    //Assign two frames from the texture atlas as the 
    //alien's two states.
    let alienFrames = [
      "alien.png",
      "explosion.png"
    ];

    //Initialize the alien sprite with the frames
    let alien = g.sprite(alienFrames);

    //Define some states on the alien that correspond
    //to the its two frames.
    alien.states = {
      normal: 0,
      destroyed: 1
    };

    //Set its y position above the screen boundary.
    alien.y = 0 - alien.height;

    //Assign the alien a random x position.
    alien.x = g.randomInt(0, 14) * alien.width;

    //Set its speed.
    alien.vy = 1;

    //Push the alien into the `aliens` array.
    aliens.push(alien);

    //Set the `alienTimer` back to zero.
    alienTimer = 0;

    //Reduce `alienFrequency` by one to gradually increase
    //the frequency that aliens are created
    if (alienFrequency > 2) {
      alienFrequency--;
    }
  }

  /* Move the aliens */

  //Use the `move` method to move all the alien sprites in the
  //`aliens` array.
  g.move(aliens);

  //Check for a collision between the aliens and the bullets.
  //Filter through each alien in the `aliens` array.
  aliens = aliens.filter(alien => {

    //A variable to help check if the alien is
    //alive or dead.
    let alienIsAlive = true;

    //Filter though all the bullets.
    bullets = bullets.filter(bullet => {

      //Check for a collision between an alien and bullet.
      if (g.hitTestRectangle(alien, bullet)) {

        //Remove the bullet sprite.
        g.remove(bullet);

        //Show the alien's `destroyed` state.
        alien.show(alien.states.destroyed);

        //You could alternatively use the frame number,
        //like this:
        //alien.show(1);

        //Play the explosion sound.
        explosionSound.play();

        //Stop the alien from moving.
        alien.vy = 0;

        //Set `alienAlive` to false so that it can be
        //removed from the array.
        alienIsAlive = false;

        //Wait for 1 second (1000 milliseconds) then 
        //remove the alien sprite.
        g.wait(1000, () => g.remove(alien));

        //Update the score.
        score += 1;

        //Remove the bullet from the `bullets array.
        return false;

      } else {

        //If there's no collision, keep the bullet in the
        //bullets array.
        return true;
      }
    });

    //Return the value of `alienIsAlive` back to the 
    //filter loop. If it's `true`, the alien will be
    //kept in the `aliens` array. 
    //If it's `false` it will be removed from the `aliens` array.
    return alienIsAlive;
  });

  /* Display the score */

  scoreDisplay.content = score;

  /* Check for the end of the game */

  //The player wins if the score matches the value
  //of `scoreNeededToWin`, which is 60
  if (score === scoreNeededToWin) {

    //Set the player as the winner.
    winner = "player";

    //Change the game's state to `end`.
    g.state = end;
  }

  //The aliens win if one of them reaches the bottom of
  //the stage.
  aliens.forEach(alien => {

    //Check to see if the `alien`'s `y` position is greater
    //than the `stage`'s `height`
    if (alien.y > g.canvas.height) {

      //Set the aliens as the winner.
      winner = "aliens";

      //Change the game's state to `end`.
      g.state = end;
    }
  });
}

function end() {

  //Pause the game loop.
  g.pause();

  //Create the game over message text.
  gameOverMessage = g.text("", "20px emulogic", "#00FF00", 90, 120);

  //Reduce the music volume by half.
  //1 is full volume, 0 is no volume, and 0.5 is half volume.
  music.volume = 0.5;

  //Display "Earth Saved!" if the player wins.
  if (winner === "player") {
    gameOverMessage.content = "Earth Saved!";
    gameOverMessage.x = 120;
  }

  //Display "Earth Destroyed!" if the aliens win.
  if (winner === "aliens") {
    gameOverMessage.content = "Earth Destroyed!";
  }

  //Wait for 3 seconds then run the `reset` function.
  g.wait(3000, () => reset());
}

//The `reset` function resets all the game variables.
function reset() {

  //Reset the game variables.
  score = 0;
  alienFrequency = 100;
  alienTimer = 0;
  winner = "";

  //Set the music back to full volume.
  music.volume = 1;

  //Remove any remaining alien and bullet sprites.
  //The universal `remove` method will loop through
  //all the sprites in an array of sprites, removed them
  //from their parent container, and splice them out of the array.
  g.remove(aliens);
  g.remove(bullets);

  //You can also use the universal `remove` function to remove.
  //a single sprite.
  g.remove(gameOverMessage);

  //Re-center the cannon.
  g.stage.putBottom(cannon, 0, -40);

  //Change the game state back to `play`.
  g.state = play;
  g.resume();
}