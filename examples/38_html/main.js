//1. Initialize and start Hexi

var thingsToLoad = [
  "images/scale.png",
  "images/arrow.png"
];
var g = hexi(512, 512, setup, thingsToLoad, load);
g.start();

//Set the background color and scale Hexi's main canvas
g.backgroundColor = 0x000000;
g.scaleToWindow();

//Scale the html UI <div> container.
//It will scale and align itself automatically with Hexi's canvas.
//(Find out more about how `scaleToWindow` works here: https://github.com/kittykatattack/scaleToWindow)
scaleToWindow(document.querySelector("#ui"));
window.addEventListener("resize", function(event){ 
  scaleToWindow(document.querySelector("#ui"));
});

//2. The `load` function that will run while your files are loading

function load(){

  //Display an optional loading bar
  g.loadingBar();
}

//3. The `setup` function, which initializes your game objects, variables and sprites
var mysteryNumber = 50,
    guessesRemaining = 10,
    guessesMade = 0,
    gameWon = false,
    playersGuess = 0,
    message,
    scale,
    arrow;

function setup() {

  //Create your game objects here

  //Html elements
  var button = document.querySelector("button");
  button.addEventListener("click", buttonClickHandler, false);
  var input = document.querySelector("#input");

  //Hexi elements
  message = g.text("I am thinking of a number between 0 and 99.", "18px Futura", "white", 0, 0);
  g.stage.putTop(message, 0, 100);

  scale = g.sprite("images/scale.png");
  arrow = g.sprite("images/arrow.png");
  
  g.stage.putTop(scale, 0, 220);
  arrow.x = scale.x;
  arrow.y = scale.y + arrow.height;

  //Set the game state to `play` to start the game loop
  //(It's not required in this example)
  //g.state = play;
}

//4. The `play` function, which is your game or application logic that runs in a loop
//(Not required in this example)
function play(){
  //This is your game loop, where you can move sprites and add your
  //game logic
  //console.log("Game loop running")
}

//Html element event handlers
function buttonClickHandler(event) {

  //Capture the player's input from the HTML text input field
  if (input.value) playersGuess = parseInt(input.value);

  //Use Hexi's `slide` method to move the arrow on the slider to match the arrow's position
  //`slide` arguments: sprite, destinationX, destinationY
  g.slide(arrow, scale.x + (playersGuess * 3), arrow.y);

  //Figure out the current game state
  guessesRemaining = guessesRemaining - 1;
  guessesMade = guessesMade + 1;
  var gameState = " Guess: " + guessesMade + ", Remaining:  " + guessesRemaining;

  //Find out if the player guessed to high or too low
  if (playersGuess > mysteryNumber) {
    message.content = "That's too high." + gameState;
  }
  else if (playersGuess < mysteryNumber) {
    message.content = "That's too low." + gameState;
  }

  //Find out if the player won or lost the game
  if (playersGuess === mysteryNumber) {
    gameWon = true;
    endGame();
  }
  if (guessesRemaining < 1) {
    gameWon = false;
    endGame();
  }
  
}

//The `endGame` function
function endGame() {
  if (gameWon) {
    message.content 
      = "Yes, it's " + mysteryNumber + "! "
      + "It only took you " + guessesMade + " guesses.";

  } else {
    message.content
      = "No more guesses left! "
      + "The number was: " + mysteryNumber + ".";
  }
}
