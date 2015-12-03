/*
Learn how to use Hexi to build a simple game prototype
*/

//Create a new Hexi instance, and start it
let g = hexi(512, 512, setup, ["sounds/chimes.wav"]);

//Set the background color and scale the canvas
//g.backgroundColor = "black";
g.scaleToWindow();

//Start Hexi
g.start();

//Declare your global variables (global to this game, which means you
//want to use them in more than one function)
let dungeon, player, treasure, enemies, chimes, exit,
    healthBar, message, gameScene, gameOverScene;

//The `setup` function runs once and is used to initializes your game 
function setup() {

  //Create the `chimes` sound object
  chimes = g.sound("sounds/chimes.wav");

  //Create the `gameScene` group
  gameScene = g.group();

  //The exit door
  exit = g.rectangle(48, 48, "green");
  exit.x = 8;
  exit.y = 8;
  gameScene.addChild(exit);

  //The player sprite
  player = g.rectangle(32, 32, "blue");
  player.x = 68;
  player.y = g.canvas.height / 2 - player.halfHeight;
  gameScene.addChild(player);

  //Create the treasure
  treasure = g.rectangle(16, 16, "gold");

  //Position it next to the left edge of the canvas
  //treasure.x = g.canvas.width - treasure.width - 10;
  treasure.y = g.canvas.height / 2 - treasure.halfHeight;

  //Alternatively, you could use Ga's built in convience method
  //called `putCenter` to postion the sprite like this:
  g.stage.putCenter(treasure, 208, 0);

  //Create a `pickedUp` property on the treasure to help us Figure
  //out whether or not the treasure has been picked up by the player
  treasure.pickedUp = false;

  //Add the treasure to the `gameScene`
  gameScene.addChild(treasure);

  //Make the enemies
  let numberOfEnemies = 6,
      spacing = 48,
      xOffset = 150,
      speed = 2,
      direction = 1;

  //An array to store all the enemies    
  enemies = [];

  //Make as many enemies as there are `numberOfEnemies`
  for (let i = 0; i < numberOfEnemies; i++) {

    //Each enemy is a red rectangle
    let enemy = g.rectangle(32, 32, "red");

    //Space each enemey horizontally according to the `spacing` value.
    //`xOffset` determines the point from the left of the screen
    //at which the first enemy should be added.
    let x = spacing * i + xOffset;

    //Give the enemy a random y position
    let y = g.randomInt(0, g.canvas.height - enemy.height);

    //Set the enemy's direction
    enemy.x = x;
    enemy.y = y;

    //Set the enemy's vertical velocity. `direction` will be either `1` or
    //`-1`. `1` means the enemy will move down and `-1` means the enemy will
    //move up. Multiplying `direction` by `speed` determines the enemy's
    //vertical direction
    enemy.vy = speed * direction;

    //Reverse the direction for the next enemy
    direction *= -1;

    //Push the enemy into the `enemies` array
    enemies.push(enemy);

    //Add the enemy to the `gameScene`
    gameScene.addChild(enemy);
  }

  //Create the health bar
  let outerBar = g.rectangle(128, 16, "black"),
      innerBar = g.rectangle(128, 16, "yellowGreen");

  //Group the inner and outer bars
  healthBar = g.group(outerBar, innerBar);

  //Set the `innerBar` as a property of the `healthBar`
  healthBar.inner = innerBar;

  //Position the health bar
  healthBar.x = g.canvas.width - 148;
  healthBar.y = 16;

  //Add the health bar to the `gameScene`
  gameScene.addChild(healthBar);

  //Add some text for the game over message
  message = g.text("Game Over!", "64px Futura", "black", 20, 20);
  message.x = 120;
  message.y = g.canvas.height / 2 - 64;

  //Create a `gameOverScene` group and add the message sprite to it
  gameOverScene = g.group(message);

  //Make the `gameOverScene` invisible for now
  gameOverScene.visible = false;

  //Let the user control the player character using the keyboard.
  //Hexi's `arrowControl` method lets you do this easily. Supply the
  //sprite you want to move as the first argument, and the number of
  //pixels per frame that it should move as the second argument
  g.arrowControl(player, 5);

  //The `arrowControl` method is great for prototyping a game
  //but for more flexibility you can also program the arrow keys
  //manually, like this:
  /*
  //Left arrow key `press` method
  g.leftArrow.press = () => {
    //Change the player's velocity when the key is pressed
    player.vx = -5;
    player.vy = 0;
  };
  //Left arrow key `release` method
  g.leftArrow.release = () => {
    //If the left arrow has been released, and the right arrow isn't down,
    //and the player isn't moving vertically:
    //Stop the player
    if (!g.rightArrow.isDown && player.vy === 0) {
      player.vx = 0;
    }
  };
  g.upArrow.press = () => {
    player.vy = -5;
    player.vx = 0;
  };
  g.upArrow.release = () => {
    if (!g.downArrow.isDown && player.vx === 0) {
      player.vy = 0;
    }
  };
  g.rightArrow.press = () => {
    player.vx = 5;
    player.vy = 0;
  };
  g.rightArrow.release = () => {
    if (!g.leftArrow.isDown && player.vy === 0) {
      player.vx = 0;
    }
  };
  g.downArrow.press = () => {
    player.vy = 5;
    player.vx = 0;
  };
  g.downArrow.release = () => {
    if (!g.upArrow.isDown && player.vx === 0) {
      player.vy = 0;
    }
  };

  //Hexi also has a built in `spaceBar` key objec that you can program
  //in the same way, if you need to
  */ 

  //set the game state to `play`
  g.state = play;
}

//The `play` function contains all the game logic and runs in a loop
function play() {

  //Move the player
  g.move(player);

  //Keep the player contained inside the stage's area
  g.contain(player, g.stage);

  //Move the enemies and check for a collision

  //Set `playerHit` to `false` before checking for a collision
  let playerHit = false;

  //Loop through all the sprites in the `enemies` array
  enemies.forEach(enemy => {

    //Move the enemy
    g.move(enemy);

    //Check the enemy's screen boundaries
    let enemyHitsEdges = g.contain(enemy, g.stage);

    //If the enemy hits the top or bottom of the stage, reverse
    //its direction
    if (enemyHitsEdges) {
      if (enemyHitsEdges.has("top") || enemyHitsEdges.has("bottom")) {
        enemy.vy *= -1;
      }
    }

    //Test for a collision. If any of the enemies are touching
    //the player, set `playerHit` to `true`
    if (g.hitTestRectangle(player, enemy)) {
     playerHit = true;
    }
  });

  //If the player is hit...
  if (playerHit) {

    //Make the player semi-transparent
    player.alpha = 0.5;

    //Reduce the width of the health bar's inner rectangle by 1 pixel
    healthBar.inner.width -= 1;
  } else {

    //Make the player fully opaque (non-transparent) if it hasn't been hit
    player.alpha = 1;
  }

  //Check for a collision between the player and the treasure
  if (g.hitTestRectangle(player, treasure)) {

    //If the treasure is touching the player, center it over the player
    treasure.x = player.x + 8;
    treasure.y = player.y + 8;

    if (!treasure.pickedUp) {

      //If the treasure hasn't already been picked up,
      //play the `chimes` sound
      chimes.play();
      treasure.pickedUp = true;
    };
  }

  //Check for the end of the game

  //Does the player have enough health? If the width of the `innerBar`
  //is less than zero, end the game and display "You lost!"
  if (healthBar.inner.width < 0) {
    g.state = end;
    message.content = "You lost!";
  }

  //If the player has brought the treasure to the exit,
  //end the game and display "You won!"
  if (g.hitTestRectangle(treasure, exit)) {
    g.state = end;
    message.content = "You won!";
  }  
}

function end() {

  //Hide the `gameScene` and display the `gameOverScene`
  gameScene.visible = false;
  gameOverScene.visible = true;
}


