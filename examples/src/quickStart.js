/*
Hexi Quick Start
================

This is a quick tour of all the most important things you need to
know to set up and start using Hexi. Use this same model
for structuring your own applications and games. Thanks
to Hexi's streamlined, modular design, you can create a complex interactive
application like this in less than 50 lines of compact and readable code.

Hexi's Application Architecture is made up of four main parts:

1. Setting up and starting Hexi.
2. The `load` function, that will run while your files are loading.
3. The `setup` function, which initializes your game objects, variables and sprites.
4. The `play` function, which is your game or application logic that runs in a loop.

This simple model is all you need to create any kind of game or application.
You can use it as the starting template for your own projects, and this same
basic model can scale to any size.
Take a look at the code ahead to see how it all works. 
*/

/* 
1. Setting up and starting Hexi 
-------------------------------
*/

//Create an array of files you want to load. If you don't need to load
//any files, you can leave this out. Hexi lets you load a wide variety
//of files: images, texture atlases, bitmap fonts, ordinary font files, and
//sounds
let thingsToLoad = [
  "images/cat.png",
  "fonts/puzzler.otf",
  "sounds/music.wav"
];

//Initialize Hexi with the `hexi` function. It has 5 arguments,
//although only the first 3 are required:
//a. Canvas width.
//b. Canvas height. 
//c. The `setup` function.
//d. The `thingsToLoad` array you defined above. This is optional.
//e. The `load` function. This is also optional.
//If you skip the last two arguments, Hexi will skip the loading
//process and jump straight to the `setup` function.
let g = hexi(512, 512, setup, thingsToLoad, load);

//Optionally Set the frames per second at which the game logic loop should run.
//(Sprites will be rendered independently, with interpolation, at full 60 or 120 fps)
//If you don't set the `fps`, Hexi will default to an fps of 60
g.fps = 30;

//Optionally add a border and set the background color
//g.border = "2px red dashed";
//g.backgroundColor = 0x000000;

//Optionally scale and align the canvas inside the browser window
g.scaleToWindow();

//Start Hexi. This is important - without this line of code, Hexi
//won't run!
g.start();


/* 
2. Loading Files 
----------------
*/

//The `load` function will run while assets are loading. This is the
//same `load` function you assigned as Hexi's 4th initialization argument. 
//Its optional. You can leave it out if you don't have any files to
//load, or you don't need to monitor their loading progress

function load() {

  //Display the file currently being loaded
  console.log(`loading: ${g.loadingFile}`);

  //Display the percentage of files currently loaded
  console.log(`progress: ${g.loadingProgress}`);

  //Add an optional loading bar. 
  g.loadingBar();

  //This built-in loading bar is fine for prototyping, but I
  //encourage to to create your own custom loading bar using Hexi's
  //`loadingFile` and `loadingProgress` values. See the `loadingBar`
  //and `makeProgressBar` methods in Hexi's `core.js` file for ideas
}


/* 
3. Initialize and Set up your game objects 
------------------------------------------
*/

//Declare any variables that need to be used in more than one function
let cats, message;

//The `setup` function will run when all the assets have loaded. This
//is the `setup` function you assigned as Hexi's 3rd argument. It's
//mandatory - every Hexi application has to have a `setup` function
//(although you can give it any name you want)

function setup() {

  //Create a `group` called `cats` to store all the cats
  cats = g.group();

  //Create a function to make a cat sprite. `makeCat` takes two arguments:
  //the `x` and `y` screen position values where the cat should start.
  //As you'll see ahead, this function is going to be called by Hexi's
  //`pointer` object each time it's clicked.
  let makeCat = (x, y) => {

    //Create the cat sprite. Supply the `sprite` method with 
    //the name of the loaded image that should be displayed
    let cat = g.sprite("images/cat.png");

    //Hexi exposes Pixi (the 2D rendering engine) as a top level global object called `PIXI`. That
    //means you can use the `PIXI` object to write any low-level Pixi code,
    //directly in your Hexi application. All of Hexi's sprites are just
    //ordinary Pixi sprites under the hood, so any Pixi code you write to modify
    //them will work

    //Set the cat's position
    cat.setPosition(x, y);

    //You can alternatively set the position my modifying the sprite's `x` and
    //`y` properties directly, like this
    //cat.x = x;
    //cat.y = y;

    //Add some optional tween animation effects from the Hexi's 
    //built-in tween library (called Charm). `breathe` makes the
    //sprite scale in and out. `pulse` oscillates its transparency
    g.breathe(cat, 2, 2, 20);
    g.pulse(cat, 10, 0.5);

    //Set the cat's velocity to a random number between -10 and 10
    cat.vx = g.randomInt(-10, 10);
    cat.vy = g.randomInt(-10, 10);

    //Add the cat to the `cats` group
    cats.addChild(cat);
  };

  //Create a text sprite. Display the initial text, set the font
  //style and colour
  message = g.text("Tap for cats!", "38px puzzler", "red");

  //You can re-assign the text sprite's style at any time by assigning
  //a custom options object to the `style` property. See Pixi's
  //documentation on the `Text` class for the complete list of options
  //you can set
  //message.style = {fill: "black", font: "16px Helvetica"};

  //You can also create bitmap text with the `bitmapText` method
  //Make sure to load the bitmap text's XML file first.
  //message = g.bitmapText("Tap to make cats!", "32p disko");

  //Center the `message` sprite relative to the `stage` 
  g.stage.putCenter(message);

  //You can also use
  //`putLeft`, `putRight`, `putTop` or `putBottom` methods to help you
  //align objects relative to other objects. The optional 2nd and 3rd
  //arguments of these methods define the x and y offset, which help
  //you fine-tune positioning.

  //Center the message text's rotation point
  //around its center by setting its `pivotX` and `pivotY` properties.
  //(These are normalized, 0 to 1 values - 0.5 means dead center)
  message.pivotX = 0.5;
  message.pivotY = 0.5;

  //You can also use this alternative syntax to set the pivot point:
  //message.setPivot(0.5, 0.5);

  //Hexi has a built-in universal pointer object that works for both
  //touch and the mouse.
  //Create a cat sprite when you `tap` Hexi's `pointer`.
  //(The pointer also has `press` and `release` methods) 
  g.pointer.tap = () => {

    //Supply `makeCat` with the pointer's `x` and `y` coordinates.
    makeCat(g.pointer.x, g.pointer.y);

    //Make the `message.content` display the number of cats 
    message.content = `${cats.children.length}`;
  };

  //Play an optional loaded sound file.
  let music = g.sound("sounds/music.wav");
  music.loop = true;
  music.play();

  //Set the game state to play. This is very important! Whatever
  //function you assign to Hexi's `state` property will be run by
  //Hexi in a loop.
  g.state = play;

}


/*
4. The game logic 
------------------
*/

//The `play` function is called in a continuous loop, at whatever fps
//(frames per second) value you set. This is your *game logic loop*. (The
//render loop will be run by Hexi in the background at the maximum fps
//your system can handle.) You can pause Hexi's game loop at any time
//with the `pause` method, and restart it with the `resume` method

function play() {
  //console.log(g.soundObjects["sounds/music.wav"].buffer);

  //Optionally, here's how you can make cats continuously if the pointer `isDown`
  //inside the game loop:
  /*
  if (g.pointer.isDown) {
    makeCat(g.pointer.x, g.pointer.y);
    message.content = `${cats.children.length} cats!`;
  }
  */

  //Rotate the text 
  message.rotation += 0.1;

  //Loop through all of the cats to make them move and bounce off the
  //edges of the stage
  cats.children.forEach(cat => {

    //Check for a collision between the cat and the stage boundaries
    //using Hexi's `contain` method. Setting `true` as the third
    //argument will make the cat bounce when it hits the stage
    //boundaries
    let collision = g.contain(cat, g.stage, true);

    //If there's no collision, the `collision` variable will be
    //`undefined`. But if there is a collision, it will have any of
    //the string values "left", "right", "top", or "bottom", depending
    //on which side of the stage the cat hit

    //Move the cat with the `move` method. The `move` method updates
    //the sprite's position by its `vx` and `vy` velocity values. (All Hexi
    //sprites have `vx` and `vy` properties, which are initialized to
    //zero). You can move more than one sprite at a time by supplying
    //`move` with a list of sprites, separated by commas.
    g.move(cat);

    //Here's what `move` is actually doing under the hood:
    //cat.x += cat.vx;
    //cat.y += cat.vy;
  });
}

/*
With this basic Hexi architecture, you can create anything. Just set
Hexi's `state` property to any other function to switch the
behaviour of your application. Here's how:

   g.state = anyStateFunction;

Write as many state functions as you need.
If it's a small project, you can keep all these functions in one file. But,
for a big project, load your functions from
external JS files as you need them. Use any module system you
prefer, like ES6 modules, CommonJS, AMD, or good old HTML `<script>` tags.
This simple architectural model can scale to any size, and is the only
architectural model you need to know. Keep it simple and stay happy!
*/