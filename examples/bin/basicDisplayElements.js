"use strict";

/*
Most of what you need to know to display 
images, text, access the pointer and do animation
*/

//Create an array of files you want to load
var thingsToLoad = ["images/star.png", //An image file
"images/rocket.png", //An image file
"fonts/puzzler.otf", //A font file
"fonts/PetMe64.ttf", //A font file
"fonts/disko.xml", //A bitmap font data file
"images/animals.json", //A texture atlas in Texture Packer JSON format
"sounds/bounce.wav" //A sound file
];

/*
Here's how you'll be able to access the loaded files 
later in your application:

1. An image:

   g.image("images/rocket.png")

2. A texture atlas frame id
    
   g.id("cat.png");

3. JSON data file:

   g.json("images/animals.json");

4. A texture atlas image
   
   g.image("images/animals.png");

5. A sound object

   g.sound("sounds/bounce.wav");

6. A XML data file

   g.xml("fonts/disko.xml");

Hexi uses Pixi's resource loader to load and manage files.
You can access the loader's `resources` object through Hexi's 
`resources` property. You can access Pixi's `loader` object
though Hexi's `loader` property
    
*/

//Create a new Hexi instance, and start it, using the `thingsToLoad`
//array. Hexi will pre-load all the files before it launches your
//application
var g = hexi(256, 256, setup, thingsToLoad);
g.start();

//Set an optional fps for the game.
//The frame rate will default to 60 fps if you don't set it
//g.fps = 30;

//Set the background color
g.backgroundColor = "grey";

//Scale and align Hexi's canvas inside the browser window
g.scaleToWindow();

//Declare global sprites, objects, and variables
//that you want to access in all the game functions and states
var box = undefined,
    ball = undefined,
    line = undefined,
    message = undefined,
    cat = undefined,
    pathA = undefined,
    pathB = undefined,
    rocket = undefined,
    star = undefined,
    pointerDisplay = undefined;

//A `setup` function that will run only once.
//Use it for initialization tasks
function setup() {

  //Optionally hide the mouse pointer
  //g.pointer.visible = false;

  //Create a square called `box`, using the `rectangle` method.
  //`rectangle` arguments:
  //width, height, fillColor, strokeColor, lineWidth, x, y
  box = g.rectangle(32, 32, "cyan", "white", 4, 52, 42);

  //Colors can be HTML color strings, RGBA values or Hexadecimal
  //values

  //Set the box's rotation pivot point to its center. The two
  //arguments refer to the x and y pivot positions, as normalized
  //values between 0 and 1. `0.5` is the very center of the sprite.
  //Setting the pivot changes the sprite's `x` and `y` position
  //values, but it won't shift the position of the sprite on the
  //canvas
  box.setPivot(0.5, 0.5);

  //You can also set the x and y pivot point using the `pivotX` and
  //`pivotY` properties

  //Rotate the box by 0.5 radians
  box.rotation = 0.5;

  //Create a `circle` sprite called `ball`
  //`circle` argumenets:
  //diameter, fillstyle, stroketyle, lineWidth, x, y
  ball = g.circle(42, "Plum", "PowderBlue", 8, 20, 110);

  //Create a `text` sprite called `message`
  //`text` arguments:
  //content, font, fillStyle, x, y
  //The font family name will be the same as the font's file name

  message = g.text("Tap the circle!", "14px puzzler", "white");
  message.x = 30;
  message.y = 10;

  //Create a sprite from a single image by supplying the
  //image name as the first argument
  rocket = g.sprite("images/rocket.png");

  //Optionally change the rocket's `width` and `height`
  //rocket.width = 50;
  //rocket.height = 50;

  //Set the rocket's pivot point to its center, so that it rotates
  //around its center point
  rocket.setPivot(0.5, 0.5);

  console.log(rocket.x);

  /*
  Use the `putCenter` convenience method to put the rocket
  in the center of the stage. The stage and all sprites can use
  `put` methods like this.
  `putCenter` arguments:
  sprite, xOffset, yOffset
  */

  g.stage.putCenter(rocket, 20, 10);

  /*
  You can also use `putLeft`, `putTop`, `putRight` and `putBottom`
  to precisely position a sprite around any other sprite.
  */

  /*
  You can make a sprite using a frame JSON tileset file in 
  Texture Packer format. Just load the JSON file that contains the
  frame and supply the frame name in the sprite's argument. (The
  tileset image file will be loaded automatically when the JSON file
  loads)
  */

  cat = g.sprite("cat.png");
  //Use `setPosition` to set the sprite's `x` and `y` values
  //with one line of code

  cat.setPosition(10, 190);

  //Use `scaleX` and `scaleY` to scale a sprite proportionately.
  //cat.scaleX = 0.5;
  //cat.scaleY = 0.5;

  //Use `width` and `height` to change a sprite's size
  cat.width = 42;
  cat.height = 42;

  //Use the `slide` tween method to make the cat move back and forth
  //along the bottom of the canvas.
  //`slide` arguments:
  //sprite, xDestination, yDestination, durationInFrames, easingType, yoyo?
  g.slide(cat, g.canvas.width - 60, cat.y, 120, "smoothstep", true);

  //Create a star sprite from an image
  star = g.sprite("images/star.png");

  //You can add `radius` and `diameter` properties
  //to a sprite by setting its `circular` property
  //to `true`.
  star.circular = true;
  console.log("star.radius: " + star.radius);
  console.log("star.diameter: " + star.diameter);

  //If you ever have texture-bleed problems with a
  //sprite, set `scaleModeNearest` to `true`
  //star.scaleModeNearest = true;
  //Setting it back to `false` returns the scale mode to `linear`

  //Set `circular` back to `false` if you want to remove
  //the `radius` and `diameter` properties.

  //Hexi has a `pointer` object with a `x` and `y` property
  //that tells you the position of the mouse or touch pointer.
  //Here's how to display the pointer position with a `text` sprite:
  pointerDisplay = g.text("", "8px PetMe64", "white");
  pointerDisplay.x = 10;
  pointerDisplay.y = 235;

  //Every time you create a sprite it's added to the
  //`stage` object's `children` array.
  console.log("stage.children: " + g.stage.children);

  //Make any sprite interactive by setting its
  //`interact` property to `true`. You can then assign
  //`press` and `release` actions to sprites. You can also
  //access its `state` and `action` properties.
  ball.interact = true;
  ball.press = function () {

    //An array of color names
    var colors = ["Gold", "Lavender", "Crimson", "DarkSeaGreen"];

    //Set the ball's `fillStyle` and `strokeStyle` to a random color
    //using the `randomInt` method
    ball.fillStyle = colors[g.randomInt(0, 3)];
    ball.strokeStyle = colors[g.randomInt(0, 3)];

    //Play a sound
    g.sound("sounds/bounce.wav").play();
  };

  //Create a `line` sprite.
  //`line` arguments:
  //strokeStyle, lineWidth, ax, ay, bx, by
  //`ax` and `ay` define the line's start x/y point,
  //`bx`, `by` define the line's end x/y point.
  line = g.line("Yellow", 4, 162, 52, 220, 94);

  //We're going to make the line's start and end points
  //rotate in space. The line will need two new angle properties
  //to help us do this. Both are initialized to 0
  line.angleA = 0;
  line.angleB = 0;

  //Depth layering
  //If you want a sprite to appear stacked above other sprites,
  //set its `layer` property. Sprites appear stacked in the order
  //that they are created, but those with higher `layer` values
  //will appear above those with lower values. To make sure the
  //sprites stack the way you expect them to,
  //set the `layer` values after you've created all your sprites
  star.layer = 1;

  //Change the game state to `play`
  g.state = play;
}

//The `play` function will run in a loop
function play() {

  //Make the box rotate
  box.rotation += 0.01;

  //Make the star ease towards the pointer.
  //`followEase` arguments: follower, leader, speed
  g.followEase(star, g.pointer, 0.1);

  //Alternatively, use the `followConstant` method if you want to
  //make a sprite follow at a constant speed. The third argument
  //is the speed, which is the pixels per frame that the follower
  //will move
  //g.followConstant(star, g.pointer, 3);

  //Make the rocket rotate towards the star.
  //`angle` returns the angle between two sprites, in radians.
  rocket.rotation = g.angle(rocket, star);

  //Make the star invisible if the pointer is "over"
  //the ball or being pressed "down" on it
  if (ball.state === "over" || ball.state === "down") {
    star.visible = false;
  } else {
    star.visible = true;
  }

  //Display the position of the pointer
  pointerDisplay.content = "pointer.x: " + Math.round(g.pointer.x) + " pointer.y: " + Math.round(g.pointer.y);

  //Make the line's `ax` and `ay` points rotate clockwise around
  //point 162, 52. Use the `rotateAroundPoint` method to help you do this.
  //`rotateAroundPoint` returns an object with `x` and `y` properties
  //containing the point's new rotated position. Supply different
  //rotationRadiusX/Y arguments if you want the rotation to be ellipical.
  //`rotateAroundPoint` arguments:
  //pointX, pointY, rotationRadiusX, rotationRadiusY, angleOfRotation
  line.angleA += 0.02;
  var rotatingA = g.rotateAroundPoint(162, 52, 10, 10, line.angleA);
  line.ax = rotatingA.x;
  line.ay = rotatingA.y;

  //Make the line's `bx` and `by` point rotate counter
  //clockwise around point 222, 94
  line.angleB -= 0.03;
  var rotatingB = g.rotateAroundPoint(220, 94, 10, 10, line.angleB);
  line.bx = rotatingB.x;
  line.by = rotatingB.y;
}
//# sourceMappingURL=basicDisplayElements.js.map