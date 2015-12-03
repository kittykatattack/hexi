![Hexi](/tutorials/screenshots/logoAndIllustration.png)

Hexi
====

*Hexi* is a fun and easy way to make HTML5 games or any other
kind interactive media using pure JavaScript code (ES6/2015). Take a look at 
the feature list and the [examples](https://github.com/kittykatattack/hexi/tree/master/examples) folder to get started. Keep scrolling, 
and you'll find a complete beginner's tutorial ahead. If you've never
made a game before, the tutorials are the best place to start.

What's great about Hexi? You get all the power of WebGL rendering with
a streamlined API that lets you write your code in a
[minimalist](https://en.wikipedia.org/wiki/Haiku),
[declarative](http://latentflip.com/imperative-vs-declarative/) way.
It makes coding a game as easy and fun as writing poetry or drawing. Try it! If you
need any help or have any questions, post something in this
repository's [Issues](https://github.com/kittykatattack/hexi/issues).

You only need one file from this repository to get started using Hexi:
[`hexi.min.js`](https://github.com/kittykatattack/hexi/blob/master/bin/hexi.min.js). [Link it to your HTML document with a `<script>` tag](http://www.quackit.com/javascript/tutorial/external_javascript_file.cfm), and go for it! 
Hexi has been written, from the ground up, in the latest version of
JavaScript (ES6/7, 20015/6) but is compiled down to ES5 (using [Babel](https://babeljs.io)) so that it
will run anywhere.

### Table of contents:
1. [Features](#features)
2. [Modules](#modules)
3. [Tutorials](#tutorials)

<a id='features'></a>
Features
--------

Here's Hexi's core feature list:

- All the most important sprites you need: rectangles, circles, lines,
  text, image sprites and animated "MovieClip" style sprites. You can make any of these
  sprites with one only line of code. You can also create your own custom sprite
  types.
- A complete scene graph with nested child-parent hierarchies (including
  a `stage`, and `addChild`/`removeChild` methods), local and global
  coordinates, depth layers, and rotation pivots.
- `group` sprites together to make game scenes. 
- A game loop with a user-definable `fps` and fully customizable and
  drop-dead-simple game state manager. `pause` and `resume` the game
  loop at any time.
- Tileset (spritesheet) support using `frame` and `filmstrip` methods to make
  sprites using tileset frames.
- Built-in texture atlas support for the popular Texture Packer
  format. 
- A keyframe animation and state manager for sprites. Use `show` to
  display a sprite's image state. Use `playAnimation` to play
  a sequence of frames (in a `loop` if you want to). Use
  `show` to display a specific frame number. Use `fps` to set the
  frame rate for sprite animations which is independent from the game's
  frame rate.
- Interactive `button` sprites with `up`, `over` and `down` states.
- Any sprite can be set to `interact` to receive mouse and touch
  actions.
  Intuitive `press`, `release`, `over`, `out` and `tap` methods for buttons and interactive
  sprites.
- Easy-to-use keyboard key bindings. The arrow and space keys are
  built-in, and you can easily define your own with the `keyboard`
  method.
- A built-in universal `pointer` that works with both the mouse and
  touch. Assign your own custom `press`, `release` and `tap` methods
  or use any of the pointer's built-in properties: `isUp`, `isDown`,
  `tapped`, `x` and `y`. Define as many pointers as you need for multi-touch.
- Conveniently position sprites relative to other sprites using
  `putTop`, `putRight`, `putBottom`, `putLeft` and `putCenter`. Algin
  sprites horizontally or vertically using `flowRight`, `flowLeft`,
  `flowUp` or `flowDown`.
- A universal asset loader to pre-load images, fonts, sounds and JSON
  data files. All popular file formats are supported. You can load new assets into the game at
  any time.
- An optional `load` state that lets you run actions while assets are
  loading. You can use the `load` state to add a loading progress bar.
- A fast and focused [Pixi-based](https://github.com/pixijs/pixi.js/) rendering engine. If Pixi can do it, so can Hexi! Hexi 
  is just a thin layer of code that sits on top of Pixi. And you can acess the
  global `PIXI` object at any time to write pure Pixi code directly if you want
  to. Hexi includes the latest stable version of Pixi v3.0 automatically bundled for you.
- A sophisticated game loop using a fixed timestep with variable rendering
  and sprite interpolation. That means you get butter-smooth sprite animations
  at any framerate.
- A compact and powerful "Haiku" style API that's centered on shallow,
  composable components. Get more done writing less code.
- Import and play sounds using a built-in WebAudio API sound manager.
  Control sounds with `play`, `pause`, `stop`, `restart`,
  `playFrom`, `fadeIn` and `fadeOut` methods. Change a sound's `volume` and `pan`.
- Generate your own custom sound effects from pure code with
  the versatile `soundEffect` method.
- Shake sprites or the screen with `shake`.
- Tween functions for sprite and scene transitions: `slide`,
  `fadeIn`, `fadeOut`, `pulse`, `breathe`, `wobble`, `strobe` and
  some useful low-level tweening methods to help you create your own
  custom tweens.
- Make a sprite follow a connected series of waypoints with `walkPath`
  and `walkCurve`. 
- A handful of useful convenience functions: `followEase`,
  `followConstant`,
  `angle`, `distance`, `rotateAroundSprite`, `rotateAroundPoint`, `wait`,
  `randomInt`, `randomFloat`, `contain` and `outsideBounds`.
- A fast, universal `hit` method that handles collision testing and
  reactions (blocking and bounce) for all types of sprites. Use one collision method for
  everything: rectangles, circles, points, and arrays of sprites.
  Easy!
- A companion suite of lightweight, low-level 2D geometric collision methods.
- A loading progress bar for game assets.
- Make sprites shoot things with `shoot`. 
- Easily plot sprites in a grid formation with `grid`.
- Use a `tilingSprite` to easily create a seamless scrolling background.
- A `createParticles` function for creating all kinds of particle
  effects for games. Use the `particleEmitter` function to create a constant
  stream of particles.
- Use `scaleToWindow` to make the game automatically scale to its maximum size and align itself 
  for the best fit inside the browser window. Use `enableFullscreen` to make the 
  browser enter full screen mode.

Coming very soon:

- Tiled Editor support using `makeTiledWorld`. Design your game in
  Tiled Editor and access all the sprites, layers and objects directly
  in your game code. It's an extremely fun, quick and easy way to make
  games.
- A versatile, `hitTestTile` method that handles all the collision
  checking you'll need for tile-based games. You can use it in combination
  with the any of the 2D geometric collision methods for optimized
  broadphase/narrowphase collision checking if you want to.
- Use `updateMap` to keep a tile-based world's map data array up-to-date
  with moving sprites.
- Create a `worldCamera` that follows sprites around a scrolling game
  world.

<a id='features'></a>
### Hexi's modules

Hexi contains a collection of useful modules, and you use any of the
properties or methods of these modules in your high-level Hexi code. 

- [Pixi](https://github.com/pixijs/pixi.js/): The fasted 2D WebGL renderer.
- [Bump](https://github.com/kittykatattack/bump): A complete suite of 2D collision functions for games.
- [Tink](https://github.com/kittykatattack/tink): Drag-and-drop, buttons, a universal pointer and other
  helpful interactivity tools.
- [Charm](https://github.com/kittykatattack/charm): Easy-to-use tweening animation effects for Pixi sprites.
- [Dust](https://github.com/kittykatattack/dust): Particle effects for creating things like explosions, fire
  and magic.
- [Sprite Utilities](https://github.com/kittykatattack/spriteUtilities): Easier and more intuitive ways to
  create and use Pixi sprites, as well adding a state machine and
  animation player
- [Game Utilities](https://github.com/kittykatattack/gameUtilities): A collection of useful methods for games.
- [Sound.js](https://github.com/kittykatattack/sound.js): A micro-library for loading, controlling and generating
  sound and music effects. Everything you need to add sound to games.
- [Smoothie](https://github.com/kittykatattack/smoothie): Ultra-smooth sprite animation using 
  true delta-time interpolation. It also lets you specify the fps (frames-per-second) at which 
  your game or application runs, and completely separates your sprite rendering loop from your
  application logic loop.

Read the documents at code repositories for these modules to find out
what you can do with them.

Hexi lets you access most of these module methods and properties as
top-level objects. For example, if you want to access the `hit` method
from the Bump collision module, you can do it like this:
```js
g.hit(spriteOne, spriteTwo);
```
But you can also access the Bump module directly if you need to, like this:
```js
g.bump.hit(spriteOne, spriteTwo);
```
(This assumes that your Hexi instance is called `g`);

Just refer to the module name using lowerCamelCase. That means you can
access the Smoothie module as `smoothie` and the Sprite Utilities
module as `spriteUtilities`.

There are two exceptions to this convention. You can access the Pixi
global object directly as `PIXI`. The functions in the Sound.js module
are also only accessible as top-level global objects. This is was done
to simplify the way these modules are integrated with Hexi, and
maintain the widest possible cross-platform compatibility.

<a id='tutorials'></a>
Tutorials
---------

The first game we're going to make is a simple object collection and
enemy avoidance game called Treasure Hunter. Open the file
`01_treasureHunter.html` in a web browser. (You'll find it in Hexi's
`tutorials` folder, and you'll need to run it in a
[webserver](https://github.com/nodeapps/http-server)). If you don't
want to bother setting up a webserver, use a text-editor like
[Brackets](http://brackets.io) that will launch one for you
automatically (see Brackets' documentation for this feature).

[![Treasure Hunter](/tutorials/screenshots/01.png)](https://gitcdn.xyz/repo/kittykatattack/hexi/master/tutorials/01_treasureHunter.html)

(Follow the link in the image above to play the game.) Use the keyboard to move the explorer (the blue square), collect the
treasure (the yellow square), avoid the monsters (the red squares) and
reach the exit (the green square.) Yes, you have to use your
imagination - for now. 

Here's the complete JavaScript source code:

[!Treasure Hunter Source](https://github.com/kittykatattack/hexi/blob/master/tutorials/src/treasureHunter.js)

Don't be fooled by it's apparent simplicity. Treasure Hunter contains
everything a video game needs:

- Interactivity
- Collision
- Sprites
- A game loop
- Scenes
- game logic
- "Juice" (in the form of sounds)

(What's juice? [Watch this
video](https://www.youtube.com/watch?v=Fy0aCDmgnxg) and 
[read this article](http://www.gamasutra.com/view/feature/130848/how_to_prototype_a_game_in_under_7_.php?print=1) to learn
about this essential game design ingredient.)

If you can make a simple game like Treasure Hunter, you can make
almost any other kind of game. Yes, really! Getting from Treasure
Hunter to Skyrim or Zelda
is just a matter of lots of small steps; adding more
detail as you go. How much detail you want to add is up to you. 

In the first stage of this tutorial you'll learn how the basic
Treasure Hunter game was made, and then we'll add some fun features like images and
character animation that will give you a complete overview of how the
Hexi works. 

If you're an experienced game programmer and
quick self-starter, you might find the code in [Hexi's `examples` folder](https://github.com/kittykatattack/hexi/tree/master/examples) to
be a more productive place to start learning - check it out. The fully
commented
code in the `examples` folder also details specific, and advanced uses
of features, that aren't
covered in these tutorials. When you're finished working through these
tutorials, the `examples` will take you on the next stage of your
journey.

<a id='setingup'></a>
#### Setting up the HTML container page

Before you can start programming in JavaScript, you need to set up a
minimal HTML container page. The HTML page loads `hexi.min.js` which
is the only file you need to use all of Hexi's
features. It also load the `treasureHunter.js` file, which is the
JavaScript file that contains all the game code. 
```
<!doctype html>
<meta charset="utf-8">
<title>Treasure hunter</title>
<body>
<!-- Hexi -->
<script src="../bin/hexi.min.js"></script>

<!-- Main application file -->
<script src="bin/treasureHunter.js"></script>
</body>
```
This is the [minimum amount of HTML code you need for a valid HTML5
document](http://stackoverflow.com/questions/9797046/whats-a-valid-html5-document).

The file paths may be different on your system, depending on how
you've set up your project file structure.

<a id='initializing'></a>
#### Initializing Hexi 

The next step is to write some JavaScript code that initializes and starts Hexi 
according to some parameters that you specify. This bit of
code below initializes a game with a screen size of 512 by 512 pixels.
It also pre-loads the `chimes.wav` sound file from the `sounds`
folder.

```
//Initialize Hexi and load the chimes sound file
let g = hexi(512, 512, setup, ["sounds/chimes.wav"]);

//Scale the game canvas to the maximum size in the browser
g.scaleToWindow();

//Start the Hexi engine.
g.start();

```

You can see that the result of the `hexi` function is being assigned to
an variable called `g`. 
```js
let g = hexi(
```
Now, whenever you want to use any of Hexi's custom
methods or objects in your game, just prefix it with `g`. (You don't
have to use `g` to represent the game engine, you can use any variable
name you want. `g` is just nice, short, and easy to remember; `g` =
"game".)

In this example Hexi creates a canvas element with a size of 512 by 512
pixels. That's specified by the first two arguments:
```js 
512, 512, setup,
```
The third argument, `setup`, means that as soon as Hexi is initialized,
it should look for and run a function in your game code called `setup`.
Whatever code is in the `setup` function is entirely up to you, and
you'll soon see how you can used it to initialize a game. (You don't
have to call this function `setup`, you can use any name you like.) 

Hexi lets you pre-load game assets with an optional 4th argument, which
is an array of file names. In this first example, you only need to preload one file: `chimes.wav`
You can see that the full file path to `chimes.wav` is listed as a
string in the
initialization array:
```js
["sounds/chimes.wav"]

```
You can list as many game assets as you like here, including images,
fonts, and JSON files. Hexi will load all these assets for you before
running any of the game code.

We want the game canvas to scale to
the maximum size of the browser window, so that it displays as large
as possible. We can use a useful method called `scaleToWindow` to do
this for us.
```js
g.scaleToWindow();
```
The last thing you need to do is call Hexi's `start` method. 
```js
g.start();
```
This is the switch that turns the Hexi engine on.

<a id='definingglobals'></a>
#### Define your "global" variables

After Hexi has been started, declare all the variables that your game
functions will need to use.
```js
let dungeon, player, treasure, enemies, chimes, exit,
    healthBar, message, gameScene, gameOverScene;
```
Because they're not enclosed inside a function, these variables are "global" 
in the sense that you can use them across all of your game functions.
(They're not necessarily "global" in the sense that they inhabit the
global JavaScript name-space. If you want to ensure that they aren't, [wrap all of
your JavaScript code in an enclosing **immediate function** to isolate it
from the global
space](http://stackoverflow.com/questions/17058606/why-using-self-executing-function-in-javascript). Or, if you want to
do it the fancy way, use JavaScript ES6/2015 [modules](http://exploringjs.com/es6/ch_modules.html) or [classes](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Classes), to enforce local scope.

<a id='setupfunction'></a>
#### Initialize your game with a setup function

As soon as Hexi starts, it will look for and run a function in your game
code called `setup` (or whatever other name you want to give this
function.) The `setup` function is only run once, and lets you perform
one-time setup tasks for your game. It's a great place to create and initialize
objects, create sprites, game scenes, populate data arrays or parse
loaded JSON game data. 

Here's an abridged, birds-eye view of the `setup` function in Treasure Hunter,
and the tasks that it performs.
```js
function setup() {
  //Create the `chimes` sound object
  //Create the `gameScene` group
  //Create the `exit` door sprite
  //Create the `player` sprite
  //Create the `treasure` sprite
  //Make the enemies
  //Create the health bar
  //Add some text for the game over message
  //Create a `gameOverScene` group 
  //Assign the player's keyboard controllers

  //set the game state to `play`
  g.state = play;
}
```
The last line of code, `g.state = play` is perhaps the most important
because it starts the `play` function. The `play` function runs all the game logic
in a loop. But before we look at how that works, let's see what the
specific code inside the `setup` function does.

<a id='creatingsound'></a>
##### Creating the `chimes` sound object

You'll remember from the code above that we preloaded a sound file
into the game called `chimes.wav`. Before you can use it in your game,
you have to make a reference to it using Hexi's `sound` method,
like this:
```js
chimes = g.sound("sounds/chimes.wav");
```
<a id='gamescenes'></a>
##### Creating game scenes

Hexi has a useful method called `group` that lets you group game objects
together so that you can work with them as one unit. Groups are used for
grouping together special objects called **sprites**  (which you'll
learn all about in the next section.) But they're also used for making game scenes. 

Treasure Hunter uses two game scenes: `gameScene` which is the main game, 
and `gameOverScene` which is displayed when the game is finished. 
Here's how the `gameScene` is made using the `group` method:
```js
gameScene = g.group();
```
After you've made the group, you can add sprites (game objects) to the `gameScene`, using
the `addChild` method.
```js    
gameScene.addChild(anySprite);
```
Or, you can add multiple sprites at one time with the `add` method, like this:
```js
gameScene.add(spriteOne, spriteTwo, spriteThree);
```
Or, if you prefer, you can create the game scene after you've made all
the sprites, and group all the sprites together with one line of code, like this:
```js
gameScene = g.group(spriteOne, spriteTwp, spriteThree);
```
You'll see a few different examples of how to add sprites to groups in
the examples ahead.

But what are sprites, and how do you make them?

<a id='makingsprites'></a>
##### Making sprites

Sprites are the most important elements in any game. Sprites are
just graphics (shapes or images) that you can control with
special properties. Everything you can see in your games, like
game characters, objects and backgrounds, are sprites. Hexi lets you make
5 kinds of basic sprites: `rectangle`, `circle`, `line`, `text`, and
`sprite` (an image-based sprite). You can make almost any 2D action game
with these basic sprite types. (If they aren't enough, you can also define your own custom
sprite types.) This first version of Treasure Hunter
only uses `rectangle` sprites. You can make a rectangle sprite like
this:
```js
let box = g.rectangle(
  widthInPixels, 
  heightInPixels, 
  "fillColor", 
  "strokeColor", 
  lineWidth, 
  xPosition, 
  yPosition
);
```
You can use Hexi's `circle` method to make a circular shaped sprite:
```js
let ball = g.circle(
  diameterInPixels, 
  "fillColor", 
  "strokeColor", 
  lineWidth,
  xPosition, 
  yPosition 
);
```
It's often useful to prototype a new game using only `rectangle` and
`circle` sprites, because that can help you focus on the mechanics of your
game in a pure, elemental way. That's what this first version of
Treasure Hunter does. Here's the code from the `setup` function that
creates the `exit`, `player` and `treasure` sprites.
```js
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
treasure.x = g.canvas.width - treasure.width - 10;
treasure.y = g.canvas.height / 2 - treasure.halfHeight;

//Alternatively, you could use Ga's built in convience method
//called `putCenter` to postion the sprite like this:
//g.stage.putCenter(treasure, 208, 0);

//Create a `pickedUp` property on the treasure to help us Figure
//out whether or not the treasure has been picked up by the player
treasure.pickedUp = false;

//Add the treasure to the `gameScene`
gameScene.addChild(treasure);
``` 
Notice that after each sprite is created, it's added to the
`gameScene` using `addChild`. Here's what the above code produces:

![Treasure Hunter](/tutorials/screenshots/03.png)

Let's find out a little more about how these sprites are positioned on
the canvas.

<a id='positioningsprites'></a>
##### Positioning sprites

All sprites have `x` and `y` properties that you can use to precisely
position sprites on the canvas. The `x` and `y` values refer to the sprites' pixel
coordinates relative to the canvas's top left corner. The top
left corner has `x` and `y` values of 0. That means any
positive `x` and `y` values you assign to sprites will position them left (`x`) and down
(`y`) relative to that corner point. For example, Here's the
code that positions the `exit` door (the green square). 
```
exit.x = 8;
exit.y = 8;
```
You can see that this code places the door 8 pixel to the right and 8 pixels below the
canvas's top left corner. Positive `x` values position sprites to the
right of the canvas's left edge. Positive `y` values position them
below the canvas's top edge.

Sprites also have `width` and `height`
properties that tell you their width and height in pixels. If you need
to find out what half the width or half the height of a sprite is, use
`halfWidth` and `halfHeight`.

Hexi also has a some convenience methods that help you quickly position
sprites relative to other sprites: `putTop`, `putRight`, `putBottom`, `putLeft` and `putCenter`.
For example, here are the lines from the code above that
position the treasure sprite (the gold box). The code places the
treasure 26 pixels to the left of the
canvas's right edge, and centers it vertically.
```
treasure.x = g.canvas.width - treasure.width - 10;
treasure.y = g.canvas.height / 2 - treasure.halfHeight;
```
That's a lot of complicated positioning code to write. Instead, you
could use Hexi's built-in `putCenter` method to achieve the same effect
like this:
```
g.stage.putCenter(treasure, 220, 0);
```
What is the `stage`? It's the root container for all the sprites, and
has exactly the same dimensions as the canvas. You can think of the
`stage` as a big, invisible sprite, the same size as the canvas, that contains
all the sprites in your game, as well as any containers those sprites
might be grouped in (Like the `gameScene`). `putCenter` works by
centering the `treasure` inside the `stage`, and then offsetting its
`x` position by 220 pixels. Here's the format for using `putCenter`:
```
anySprite.putCenter(anyOtherSprite, xOffset, yOffset);
```
You can use the other `put` methods in the same way. For example, if
you wanted to position a sprite directly to the left of another
sprite, without any offset, you could use `putLeft`, like this:
```
spriteOne.putLeft(spriteTwo);
```
This would place `spriteTwo` directly to the left of `spriteOne`, and
align it vertically .You'll see many examples of how to use these `put` methods throughout
these tutorials.

<a id='dynamicproperties'></a>
##### Assigning dynamic properties

Before we continue, there's one small detail you need to notice. The
code that creates the sprites also adds a `pickedUp` property to the
`treasure` sprite:
```
treasure.pickedUp = false;
```
You'll see how we're going to use `treasure.pickedUp` later in the game logic to help us determine the
progress of the game. You can dynamically assign any custom properties or methods to sprites like this, if you need to.

<a id='enemysprites'></a>
##### Creating the enemy sprites

There are 6 enemies sprites (red squares) in Treasure Hunter. They're
spaced evenly horizontally but but have random initial vertical
positions. All the enemies sprites are created in a `for` loop using
this code in the `setup` function:

```
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

```
Here's what this code produces:

![Treasure Hunter](/tutorials/screenshots/04.png)

The code gives each of the enemies a random `y` position with the help
of Hexi's `randomInt` method:
```js
var y = g.randomInt(0, g.canvas.height - enemy.height);
```
`randomInt` will give you a random number between any two integers that you
provide in the arguments. (If you need a random decimal number, use
`randomFloat` instead).

All sprites have properties called `vx` and `vy`. They determine the
speed and direction that the sprite will move in the horizontal
direction (`vx`) and vertical direction (`vy`).  The enemies in
Treasure Hunter only move up and down, so they just need a `vy` value.
Their `vy` is `speed` (2) multiplied by `direction` (which will be
either `1` or `-1`).
```js
enemy.vy = speed * direction;
```
If `direction` is `1`, the enemy's `vy` will be `2`. That means the
enemy will move down the screen at a rate of 2 pixels per frame. If
`direction` is `-1`, the enemy's speed will be `-2`. That means the
enemy will move up the screen at 2 pixels per frame. 

After the enemy's `vy` is set, `direction` is reversed so that the next
enemy will move in the opposite direction.
```js
direction *= -1;
```
You can see that each enemy that's created is pushed into an array
called `enemies`.
```js
enemies.push(enemy);
```
Later in the code you'll see how we'll access all the enemies in this
array to figure out if they're touching the player.

<a id='healthbar'></a>
##### The health bar

You'll notice that when the player
touches one of the enemies, the width of the health bar at the top right corner of
the screen decreases. 

![Treasure Hunter](/tutorials/screenshots/05.png)

How was this health bar made? It's just two rectangle sprites at the same
position: a black rectangle behind, and a green rectangle in front. They're grouped
together to make a single compound sprite called `healthBar`. The
`healthBar` is then added to the `gameScene`.
```js
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
```
You can see that a property called `inner` has been added to the
`healthBar`. It just references the `innerBar` (the green rectangle) so that
it will be convenient to access later.
```js
healthBar.inner = innerBar;
```
You don't *have* to do this; but, hey why not! It means that if you
want to control the width of the `innerBar`, you can write some smooth code
that looks like this:
```js
healthBar.inner.width = 30;
```
That's pretty neat and readable, so we'll keep it!

<a id='gameoverscene'></a>
##### The game over scene

If the player's health drops to zero, or the player manages to
carry the treasure to the exit, the game ends and the game over screen
is displayed.  The game over scene is just some text that displays "You won!" or "You
lost!" depending on the outcome. 

![Treasure Hunter](/tutorials/screenshots/06.png)

How was this made? The text is made with a `text` sprite. 
```js
let anyText = g.text(
  "Hello!", "CSS font properties", "fillColor", xPosition, yPosition
);
```
The first argument, "Hello!" in the above example, is the text content
you want to display. Use the `content` property to change the text
sprite's content later.
```js
anyText.content = "Some new content";
```
Here's how the game over message text is created in the `setup`
function. 
```js
//Add some text for the game over message
message = g.text("Game Over!", "64px Futura", "black", 20, 20);
message.x = 120;
message.y = g.canvas.height / 2 - 64;
```
Next, a new `group` is created called `gameOverScene`. The `message` text
is added to it. The `gameOverScene`'s `visible` property is set to
`false` so that it's not visible when the game first starts.
```js
//Create a `gameOverScene` group and add the message sprite to it
gameOverScene = g.group(message);

//Make the `gameOverScene` invisible for now
gameOverScene.visible = false;
```
At the end of the game we'll set the `gameOverScene`'s `visible`
property to `true` to display the text message. We'll also set the
`gameScene`'s `visible` property to `false` so that all the game
sprites are hidden.

<a id='keyboard'></a>
##### Keyboard interactivity

You control the player (the blue square) with the keyboard arrow keys.
Hexi has a built-in `arrowControl` method that lets you quickly add
arrow key interactivity to games. Supply the sprite you want to move as 
the first argument, and the number of pixels per frame that it 
should move as the second argument. Here's how the `arrowControl`
method is used to help make the player character move 5 pixels per
frame when the arrow keys are pressed.
```js
g.arrowControl(player, 5);
```
Using `arrowControl` is an easy and fast way to implement keyboard
interactivity, but usually need finer control over what happens when
keys are pressed. Hexi has a built-in keyboard objects with bindings 
to the arrow keys and space bar. Access them like this:
`g.leftArray`, `g.rightArrow`, `g.upArrow`, `g.downArrow`,
`g.spaceBar`. All these keys have `press` and
`release` methods that you can define. Here's how you could optionally use these
keyboard objects to help move the player character in
Treasure Hunter. (You would define this code in the `setup` function.):
```js
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

//The up arrow
g.upArrow.press = () => {
  player.vy = -5;
  player.vx = 0;
};
g.upArrow.release = () => {
  if (!g.downArrow.isDown && player.vx === 0) {
    player.vy = 0;
  }
};

//The right arrow
g.rightArrow.press = () => {
  player.vx = 5;
  player.vy = 0;
};
g.rightArrow.release = () => {
  if (!g.leftArrow.isDown && player.vy === 0) {
    player.vx = 0;
  }
};

//The down arrow
g.downArrow.press = () => {
  player.vy = 5;
  player.vx = 0;
};
g.downArrow.release = () => {
  if (!g.upArrow.isDown && player.vx === 0) {
    player.vy = 0;
  }
};

```
You can see that the value of the player's `vx` and `vy` properties is
changed depending on which keys are being pressed or released.
A positive `vx` value will make the player move right, a negative
value will make it move left. A positive `vy` value will make the
player move down, a negative value will make it move up. 

The first argument is the sprite you want to control: `player`. The
second argument is the number of pixels that the sprite should move each frame: `5`.
The last four arguments are the [ascii key code numbers](http://www.asciitable.com) for the top,
right, bottom and left keys. (You can remember this because their
order is listed clockwise, starting from the top.)

Reference to the arrow keys and space key are built-in to Hexi, but you
if want to use other keys, you can easily create and assign your own
with Hexi's `keyboard` method:
```js
let customKey = g.keyboard(asciiCode);
```
Supply the [ascii key code number](http://www.asciitable.com) for key
you want to to use as the first argument.

Your new `customKey` has `press` and `release` methods
that you can program in the same way as the examples above. 

<a id='gamestate'></a>
##### Setting the game state

The **game state** is the function that Hexi is currently running. When
Hexi first starts, it runs the `setup` function (or whatever other
function you specify in Hexi's constructor function arguments.) If you
want to change the game state, assign a new function to Hexi's `state`
property. Here's how:
```js
g.state = anyFunction;
```
In Treasure Hunter, when the `setup` function is finished, the game
`state` is set to `play`:
```js
g.state = play;
```
This makes Hexi look for and run a function called `play`. By default,
any function assigned to the game state will run in a continuous loop, at
60 frames per second. (You can change the frame rate at any time by setting Hexi's
`fps` property). Game logic usually runs in a continuous loop, which
is known as the **game loop**. Hexi handles the loop management for you,
so you don't need to worry about how it works. 

(In case you're curious, Hexi uses
a `requestAnimationFrame` loop with a [fixed logic time step and variable rendering time](http://gameprogrammingpatterns.com/game-loop.html). It
also does sprite position interpolation to smoothe out any inconsistent
spikes in the frame rate. It runs [Smoothie](https://github.com/kittykatattack/smoothie)
under-the-hood to do all this, so you can use any of Smoothie's properties to
fine-tune your Hexi application game loops for the best possible effect.)

If you ever need to pause the loop, just use Hexi's `pause`method, like
this:
```js
g.pause();
```
You can start the game loop again with the `resume` method, like this:
```js
g.resume();
```
Now let's find out how Treasure Hunter's `play` function works. 

<a id='gamelogic'></a>
#### Game logic with the play function loop

As you've just learned, everything in the `play` function runs in a
continuous loop.
```js
function play() {
  //This code loops from top to bottom 60 times per second  
}
```
This is where all the game logic happens. It's the fun part,
so let's find out what the code inside the `play` function does.

<a id='movingplayer'></a>
##### Moving the player sprite

Treasure Hunter uses Hexi's `move` method inside the `play` function to move the sprites in the
game.
```js
g.move(player);
```
This is the equivalent of writing code like this:
```js
player.x += player.vx;
player.y += player.vy;
```
It just updates the player's `x` and `y` position by adding its `vx`
and `vy` velocity values. (Remember, those values were
set by the key `press` and `release` methods.) Using `move` just saves
you from having to type-in and look-at this very standard boilerplate
code.

You can also move a whole array of sprites with one line of code by
supplying the array as the argument.
```js
g.move(arrayOfSprites);
```
So now you can easily move the player, but what happens when the
player reaches the edges of the screen?

<a id='boundries'></a>
##### Containing sprites inside the screen boundaries

Use Hexi's `contain` method to keep sprites inside the boundaries of
the screen.
```js
g.contain(player, g.stage);
```
The first argument is the sprite you want to contain, and the second
argument is any JavaScript object with an `x`, `y`, `width`, and
`height` property. 

As you learnt earlier, `stage` is the root container object for all Hexi's sprites, and it has
the same width and height as the `canvas`. 

But you can alternatively supply the `contain` method with a custom 
object to do the same thing. Here's how:

```js
g.contain(
  player, 
  {
    x: 0,
    y: 0,
    width: 512,
    height: 512
  }
);
```
This will contain the `player` sprite to an area defined by the
dimensions of the object. This is really convenient if you want to
precisely fine-tune the area in which the object should be contained.

`contain` has an extra useful feature. If the sprite reaches one of
the containment edges, `contain` will return a [JavaScript Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) that tells you
which edge it reached: "top", "right", "bottom", or "left". Here's how
you could use this feature to find out which edge of the canvas the
sprite is touching:

```js
let playerHitsEdges = g.contain(player, g.stage);

if(playerHitsEdges) {

  //Find out on which side the collision happened
  let collisionSide;
  if (playerHitsEdges.has("left")) collisionSide = "left";
  if (playerHitsEdges.has("right")) collisionSide = "right";
  if (playerHitsEdges.has("top")) collisionSide = "top";
  if (playerHitsEdges.has("bottom")) collisionSide = "bottom";

  //Display the result in a text sprite
  message.content = `The player hit the ${collisionSide} of the canvas`; 
} 

```
<a id='collisionenemy'></a>
##### Collision with the enemies

When the player hits any of the enemies, the width of the health bar
decreases and the player becomes semi-transparent.

![Treasure Hunter](/tutorials/screenshots/07.png)

How does this work?

Hexi has a full suite of useful 2D geometric and tile-based collision
detection methods. Hexi implements the [Bump collision module](https://github.com/kittykatattack/bump) so all
of Bump's collision methods work with Hexi. 

Treasure Hunter only uses one of these collision methods:
`hitTestRectangle`. It takes two rectangular sprites and tells you
whether they're overlapping. It will return `true` if they are, and
`false` if they aren't.
```js
g.hitTestRectangle(spriteOne, spriteTwo);
```
Here's how the code in the `play` function uses `hitTestRectangle` to
check for a collision between any of the enemies and the player.
```js
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
```
This bit of code creates a variable called `playerHit`, which is
initialized to `false` just before the `forEach` loop checks all the
enemies for a collision.
```js
let playerHit = false;
```
(Because the `play` function runs 60 times per second, `playerHit`
will be reinitialized to `false` on every new frame.)

If `hitTestRectangle` returns `true`, the `forEach` loop sets
`playerHit` to `true`.
```js
if(g.hitTestRectangle(player, enemy)) {
  playerHit = true;
}
```
If the player has been hit, the code makes the player semi-transparent by
setting its `alpha` value to 0.5. It also reduces the width of the
`healthBar`'s `inner` sprite by 1 pixel.
```js
if(playerHit) {

  //Make the player semi-transparent
  player.alpha = 0.5;

  //Reduce the width of the health bar's inner rectangle by 1 pixel
  healthBar.inner.width -= 1;

} else {

  //Make the player fully opaque (non-transparent) if it hasn't been hit
  player.alpha = 1;
}
```
You can set the `alpha` property of sprites to any value between `0`
(fully transparent) to `1` (fully opaque). A value of `0.5` makes it
semi-transparent.b (**Alpha** is a
well-worn graphic design term that just means **transparency**.)

This bit of code also uses the `move` method to move the enemies, and
`contain` to keep them contained inside the canvas. The code also uses
the return value of `contain` to find out if the enemy is hitting the
top or bottom of the canvas. If it hits the top or bottom, the enemy's direction is
reversed with the help of this code:
```js
//Check the enemy's screen boundaries
let enemyHitsEdges = g.contain(enemy, g.stage);

//If the enemy hits the top or bottom of the stage, reverse
//its direction
if (enemyHitsEdges) {
  if (enemyHitsEdges.has("top") || enemyHitsEdges.has("bottom")) {
    enemy.vy *= -1;
  }
}
```
Multiplying the enemy's `vy` (vertical velocity) value by negative 1
makes it go in the opposite direction. It's a really simple **bounce**
effect.

<a id='collisiontreasure'></a>
###### Collision with the treasure

If the player touches the treasure (the yellow square), the `chimes`
sound plays. The player can then
carry the treasure to the exit. The treasure is centered over the player and
moves along with it. 

![Treasure Hunter](/tutorials/screenshots/08.png)

Here's the code from the `play` function that achieves these effects.

```js
//Check for a collision between the player and the treasure
if (g.hitTestRectangle(player, treasure)) {

  //If the treasure is touching the player, center it over the player
  treasure.x = player.x + 8;
  treasure.y = player.y + 8;

  if(!treasure.pickedUp) {

    //If the treasure hasn't already been picked up,
    //play the `chimes` sound
    chimes.play();
    treasure.pickedUp = true;
  };
}
```
You can see that the code uses `hitTestRectangle` inside an `if`
statement to test for a collision between the player and the treasure.
```js
if (g.hitTestRectangle(player, treasure)) {
```
If it's `true`, the treasure is centered over the player.
```js
treasure.x = player.x + 8;
treasure.y = player.y + 8;
```
If `treasure.pickedUp` is `false`, then you know that the treasure hasn't already been 
picked up, and you can play the `chimes` sound:
```js
chimes.play();
```
In addition to `play` Hexi's sound objects also have a few more methods that you can use to control them:
`pause`, `restart` and `playFrom`. (Use `playFrom` to start playing
the sound from a specific second in the sound file, like this:
`soundObject.playFrom(5)`. This will make the sound start playing from
the 5 second mark.)

You can also set the sound object's `volume` by assigning
a value between 0 and 1. Here's how to set the `volume` to mid-level
(50%).
```js
soundObject.volume = 0.5;
```
You can set the sound object's `pan` by assigning a value between -1 (left speaker)
to 1 (right speaker). A pan value of 0 makes the sound equal volume in
both speakers. Here's how you could set the `pan` to be slightly more
prominent in the left speaker.
```js
soundObject.pan = -0.2;
```
If you want to make a sound repeat continuously, set its `loop` property to `true`.
```js
soundObject.loop = true;
```
Hexi implements the [Sound.js module](https://github.com/kittykatattack/sound.js) to control sounds, so you
can use any of Sound.js's properties and methods in your Hexi
applications.

Because you don't want to play the `chimes` sound more than once after
the treasure has been picked up, the code sets `treasure.pickedUp` to
`true` just after the sound plays.
```js
treasure.pickedUp = true;
```
Now that the player has picked up the treasure, how can you check for
the end of the game?

<a id='endinggame1'></a>
##### Ending the game

There are two ways the game can end. The player's health can run out,
in which case the game is lost. Or, the player can successfully carry
the treasure to the exit, in which case the game is won. If either of
these two conditions are met,  the game's `state` is set to `end` and
the `message` text's `content` displays the outcome. Here's the last
bit of code in the `play` function that does this:
```js
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
```
The `end` function is really simple. It just hides the `gameScene` and
displays the `gameOverScene`.
```js
function end() {
  gameScene.visible = false;
  gameOverScene.visible = true;
}
```
And that's it for Treasure Hunter! Before you continue, try making
your own game from scratch using some of these same techniques. When
you're ready, read on!

<a id='usingimages'></a>
### Using images

There are three main ways you can use images in your Hexi games. 

- Use individual image files for each sprite.
- Use a **texture atlas**. This is a single image file that includes
  sub-images for each sprite in your game. The image file is
  accompanied by a matching JSON
  data file that describes the name, size and location of each
  sub-image.
- Use a **tileset** (also known as a **spritesheet**). This is also a single
  image file that includes sub-images for each sprite. However, unlike a
  texture atlas, it doesn't come with a JSON file describing the
  sprite data. Instead, you need to specify the size and location of
  each sprite in your game code with JavaScript. This can have some
  advantages over a texture atlas in certain circumstances.

All three ways of making image sprites use Hexi's `sprite` method.
Here's the simplest way of using it to make an image sprite.
```js
let imageSprite = g.sprite("images/theSpriteImage.png");
```
In this next section we'll update Treasure Hunter with image sprites, and
you'll learn all three ways of adding images to your games.

(All the images in this section were created by Lanea Zimmerman. You
can find more of her artwork [here](http://opengameart.org/users/sharm). Thanks, Lanea!)

<a id='individualimages'></a>
#### Individual images

Open and play the next version of Treasure Hunter:
`02_treasureHunterImages.html` (you'll find it in the `tutorials`
folder.) It plays exactly the same as the first version, but all the
colored squares have been replaced by images.

[![Treasure Hunter](/tutorials/screenshots/09.png)](https://cdn.gitcdn.xyz/cdn/kittykatattack/hexi/7349658f295c120ca7f3bab94d31379a0c02952e/tutorials/02_treasureHunterImages.html)

(Click the image and follow the link to play the game.) Take a look at the source code, and you'll notice that the game logic
and structure is exactly the same as the first version of the game.
The only thing that's changed is the appearance of the sprites.
How was this done?

<a id='loadingimagefile'></a>
##### Loading image files 

Each sprite in the game uses an individual PNG image file. You'll find
all the images in the tutorials' `images` sub-folder.

![Treasure Hunter](/tutorials/screenshots/10.png)

Before you can use them to make sprites, you need to pre-load them into
Ga's `assets`. The easiest way to do this is to list the image names,
with their full file paths, in Hexi's assets array when you first
initialize the engine.
```
var g = ga(
  512, 512, setup,
  [
    "images/explorer.png",
    "images/dungeon.png",
    "images/blob.png",
    "images/treasure.png",
    "images/door.png",
    "sounds/chimes.wav"
  ]
);
g.start();
```
(If you open up the JavaScript console in the web browser, you can
monitor the loading progress of these assets.)

Now you can access any of these images in your game code like this:

    g.image("images/blob.png")

This is just a short-cut for accessing the image directly in the
`assets` object like this:

    g.assets["images/blob.png"]

You can use whichever style you prefer. In any case, the image file
is just an ordinary JavaScript `Image` object, so you can use
it the same way you would any other `Image` object. 

Although pre-loading the images and other assets is the simplest way
to get them into your game, you can also load assets at any other time
using the `assets` object's `load` method. Just supply an array of strings
that list the asset names and their file paths.
```
g.assets.load([
  "images/imageOne.png", 
  "images/imageTwo.png",
  "sounds/chimes.wav"
]);
```
Next, assign a callback function called `whenLoaded` that will run when the assets have
loaded. 
```
g.assets.whenLoaded = function() {
  //Do something when the assets have loaded
};
```
Now that you've loaded the images into the game, let's find out how to
use them to make sprites.

<a id='makingsprites'></a>
##### Making sprites with images

Create an image sprite using the `sprite` method using the same format you learnt
earlier. Here's how to create a sprite using the `dungeon.png` image.
(`dungeon.png` is a 512 by 512 pixel background image.)

    dungeon = g.sprite("images/dungeon.png");

That's all! Now instead of displaying as a simple colored rectangle,
the sprite will be displayed as a 512 by 512 image. There's no need
to specify the width or height, because Hexi figures that our for you
automatically based on the size of the image. You can use all the other
sprite properties, like `x`, `y`, `width`, and `height`, just as you
would with ordinary rectangle sprites. 

Here's the code from the `setup` function that creates the dungeon
background, exit door, player and treasure, and adds them all to the
`gameScene` group. 
```
//The dungeon background
dungeon = g.sprite("images/dungeon.png");

//The exit door
exit = g.sprite("images/door.png");
exit.x = 32;

//The player sprite
player = g.sprite("images/explorer.png");
player.x = 68;
player.y = g.canvas.height / 2 - player.halfWidth;

//Create the treasure
treasure = g.sprite("images/treasure.png");

//Position it next to the left edge of the canvas
treasure.x = g.canvas.width - treasure.width - 32;
treasure.y = g.canvas.height / 2 - treasure.halfHeight;

//Create a `pickedUp` property on the treasure to help us Figure
//out whether or not the treasure has been picked up by the player
treasure.pickedUp = false;

//Create the `gameScene` group and add all the sprites
gameScene = g.group(dungeon, exit, player, treasure);
```
(As a slightly more efficient improvement to the
original version of this code, `group` creates the `gameScene` and groups
the sprites in a single step.)

Look familiar? That's right, the only code that has changed are the
lines that create the sprites. This modularity is a feature of Hexi that lets you create quick
game prototypes using simple shapes that you can easily swap out for
detailed images as your game ideas develops. The rest of the code in the
game can remain as-is.

<a id='finetuning'></a>
##### Fine-tuning the containment area

One small improvement that was made to this new version Treasure
Hunter is the new way that the sprites are contained inside the walls of the
dungeon. They're contained in such a way that naturally matches the 2.5D perspective of the
artwork, as shown by the green square in this screen shot:

![Treasure Hunter](/tutorials/screenshots/11.png)

This is a very easy modification to make. All you need to do is supply
the `contain` method with a custom object that defines the size and
position of the containing rectangle. Here's how:
```
g.contain(
  player,
  {
    x: 32, y: 16,
    width: g.canvas.width - 32,
    height: g.canvas.height - 32
  }
);
```
Just tweak the `x`, `y`, `width` and `height` values so that the
containing area looks natural for the game you're making.

<a id='textureatlas'></a>
#### Using a texture atlas

If you’re working on a big, complex game, you’ll want a fast and
efficient way to work with images. A texture atlas can help you do
this. A texture atlas is actually two separate files that are closely
related:

- A single PNG **tileset** image file that contains all the images you
  want to use in your game. (A tileset image is sometimes called a
  spritesheet.)
-	A JSON file that describes the size and position of those sub-images
  in the tileset.

Using a texture atlas is a big time saver. You can arrange the
tileset’s sub-images in any order and the JSON file will keep
track of their sizes and positions for you. This is really convenient
because it means the sizes and positions of the sub-images aren’t
hard-coded into your game program. If you make changes to the tileset,
like adding images, resizing them, or removing them, just re-publish
the JSON file and your game will use that updated data to display the
images correctly. If you’re going to be making anything bigger than a
very small game, you’ll definitely want to use a texture atlas.

The de-facto standard for tileset JSON data is the format that is
output by a popular software tool called [Texture Packer](https://www.codeandweb.com/texturepacker) (Texture
Packer's "Essential" license is free ). Even if you
don’t use Texture Packer, similar tools like [Shoebox](http://renderhjs.net/shoebox/) output JSON files
in the same format. Let’s find out how to use it to make a texture
atlas with Texture Packer, and how to load it into a game.

<a id='preparingimages'></a>
##### Preparing the images

You first need individual PNG images for each image in your game.
You've already got them for Treasure Hunter, so you're all set. Open Texture
Packer and choose the {JS} configuration option. Drag your game images
into its workspace. You can also point Texture Packer to any folder that contains
your images. Texture Packer will automatically arrange the images on a
single tileset image, and give them names that match their original
image file names. It will give them a 2 pixel padding by default.

![Texture Packer](/tutorials/screenshots/12.png)

Each of the sub-images in the atlas is called a **frame**. Although
it's just one big image, the texture atlas has 5 frames. The name of each
frame is the same its original PNG file name: "dungeon.png",
"blob.png", "explorer.png", "treasure.png" and "door.png". These
frames names are used to help the atlas reference each sub-image.

When you’re done, make sure the Data Format is set to JSON (Hash) and
click the Publish button. Choose the file name and location, and save the
published files. You’ll end up with a PNG file and a JSON file. In
this example my file names are `treasureHunter.json` and
`treasureHunter.png`. To make
your life easier, just keep both files in your project’s `images`
folder. (Think of the JSON file as extra metadata for the image file.)

<a id='loadingatlas'></a>
##### loading the texture atlas

To load the texture atlas into your game, just include the JSON file
in Hexi's assets array when you initialize the game.

```
var g = ga(
  512, 512, setup,
  [
    "images/treasureHunter.json",
    "sounds/chimes.wav"
  ]
);
g.start();
```
That's all! You don't have to load the PNG file - Hexi does that
automatically in the background. The JSON file is all you need to tell
Ga which tileset frame (sub-image) to display.

Now if you want to use a frame from the texture atlas to make a
sprite, you can do it like this:

```
anySprite = g.sprite("frameName.png");
```
Ga will create the sprite and display the correct image from the
texture atlas's tileset.

Here's how to you could create the sprites in Treasure Hunter using
texture atlas frames:
```
//The dungeon background image
dungeon = g.sprite("dungeon.png");

//The exit door
exit = g.sprite("door.png");
exit.x = 32;

//The player sprite
player = g.sprite("explorer.png");
player.x = 68;
player.y = g.canvas.height / 2 - player.halfWidth;

//The treasure
treasure = g.sprite("treasure.png");
```
That's all! Hexi knows that those are texture atlas frame names, not individual
images, and it displays them directly from the tileset.

If you ever need to access the texture atlas's JSON file in your game,
you can get it like this:
```
jsonFile = g.json("jsonFileName.json");
```
Take a look at `treasureHunterAtlas.html` file in the `tutorials` folder
to see a working example of how to load a texture atlas and use it to
make sprites.

<a id='alienarmada'></a>
### Alien Armada

The next example game in this series of tutorials is Alien Armada. Can you
destroy 60 aliens before one of them lands and destroys the Earth? Click the
image link below to play the game:

[![Alien Armada](/tutorials/screenshots/13.png)](https://cdn.rawgit.com/kittykatattack/ga/master/tutorials/04_alienArmada.html)

Use the arrow keys to move and press the space bar to shoot. The
aliens descend from the top of the screen with
increasing frequency as the game progresses. Here's how the game is played:

![Alien Armada gameplay](/tutorials/screenshots/14.png)

Alien Armada illustrates some new techniques that you'll definitely want
to use in your games:

- Load and use custom fonts.
- Automatically scale and center the game to the browser window. 
- Display a loading progress bar while the game assets load.
- Shoot bullets.
- Create sprites with multiple image states.
- Generate random enemies.
- Remove sprites from a game.
- Display a game score.
- Reset and restart a game.

You'll find the fully commented Alien Armada source code in the
`tutorials` folder. Make sure to take a look at it so that you can see
all of this code in its proper context. Its general structure is identical
to Treasure Hunter, with the addition of these new techniques. Let's
find out how they were implemented.

<a id='customfonts'></a>
#### Load and use a custom font

Alien Armada uses a custom font called `emulogic.ttf` to display the
score at the top right corner of the screen. The font file is
preloaded with the rest of the asset files (sounds and images) in the assets array that
initializes the game. 
```
var g = ga(
  480, 320, setup,
  [
    "images/alienArmada.json",
    "sounds/explosion.mp3",
    "sounds/music.mp3",
    "sounds/shoot.mp3",
    "fonts/emulogic.ttf"  //<- The custom font.
  ],
  load
);
```
To use the font, create a `text` sprite in the game's `setup`
function. The `text` method's second argument is a
string that describes the font's point size and name: "20px emulogic".  
```
scoreDisplay = g.text("0", "20px emulogic", "#00FF00", 400, 10);
```
You can and load and use any fonts in TTF, OTF, TTC or WOFF format.

<a id='scalebrowser'></a>
#### Scale and center the game in the browser

You'll notice that when you play Alien Armada, the game is centered
inside the browser window, and automatically fills to the window's maximum
width and height.

![Alien Armada gameplay](/tutorials/screenshots/15.png)

The browser background that borders the game is set to a dark gray
color. This
is thanks to one of Hexi's built-in features: the
`scaleToWindow` method. To use it, call `scaleToWindow` just after
you call Hexi's `start` method, like this:
```
g.start();
g.scaleToWindow();
```
`scaleToWindow` will center your game for the best fit. Long, wide
game screens are centered vertically. Tall or square screens are
centered horizontally. If you want to specify your own browser
background color that borders the game, supply it in `scaleToWindow`'s
arguments, like this:
```
g.scaleToWindow("seaGreen");
```
For best results, make sure you set the default margins and paddings
on all your HTML elements to `0`. The following bit of CSS does the
trick: 
```
<style> * {margin: 0; padding: 0;} </style>
```
Here's how this `<style>` tag is inserted into Alien Armada's HTML
container page:
```
<!doctype html>
<meta charset="utf-8">
<title>Alien Armada</title>
<style> * {margin: 0; padding: 0;} </style>
```
Optionally, if you want to make sure that your game dynamically
re-sizes and re-centers itself if the user changes the browser window
size, just drop in this bit of code: 
```
window.addEventListener("resize", function(event){ 
  g.scaleToWindow();
});
```
Add it just after you've
called `scaleToWindow` the first time. Here's what all this code looks
like in context:
```
//...Initialize Hexi...

g.start();
g.scaleToWindow();
window.addEventListener("resize", function(event){ 
  g.scaleToWindow();
});

//...The rest of your game code...

```
If you want to find out how it works, or you want to customize it further, you'll
find the `scaleToWindow` method in Hexi's `plugins.js` file. 

<a id='progressbar'></a>
####A loading progress bar

Alien Armada loads three MP3 sound files: a shooting sound, an
explosion sound, and music. The music sound is about 2 MB in size so
on a slow network connection this sound could take a few seconds to
load. While this is happening players would just see the blank canvas while Alien Armada
loads. Some players might think the game has frozen, so the game
helpfully implements a loading bar to inform
players that the assets are loading. It's a blue rectangle that expands from left to right, and
displays a number that tells you the percentage of game assets
loaded so far.

![Loading progress bar](/tutorials/screenshots/16.png)

This is a feature that's built into the Hexi engine. 
Ga has a optional loading state that runs while game assets are being
loaded. You can decide what you want to have happen during the loading
state. All you need to do is write a function with code that should
run while the assets are loading, and tell Hexi what the name of that
function is. Hexi's engine will automatically run that function in a
loop until the assets have finished loading.

Let's find out how this works in Alien Armada. The game code tells 
Ga to use a function called `load` during the loading state. It does
this by listing `load` as the final argument
in Hexi's initialization constructor. (Look for `load` in the code below):
```
var g = ga(
  480, 320, setup,
  [
    "images/alienArmada.json",
    "sounds/explosion.mp3",
    "sounds/music.mp3",
    "sounds/shoot.mp3",
    "fonts/emulogic.ttf"
  ],
  load  //<- This is the function that will run while loading.
);
```
This tells Hexi to run the `load` function in a loop while the assets
are loading. 

Here's the `load` function from Alien Armada. It creates a `progressBar` object, and then calls the progress bar's
`update` method each frame. 
```
function load(){

    //Use Hexi's built in `progressBar` to display a loading progress
    //percentage bar while the assets are loading.
    g.progressBar.create(g.canvas, g.assets);

    //Call the `progressBar`'s `update` method each frame. 
    g.progressBar.update();
}
```
After the assets have loaded, the `setup` state runs automatically. The first
thing it does is call the `progressBar`'s `remove` method to make the
bar disappear:
```
function setup() {

  g.progressBar.remove();
 
  //... the rest of the setup function...
}
```
You'll find the `progressBar` code in the `plugins.js` file. It's
meant to be a very simple example that you can use as the basis for
writing your own custom loading animation, if you want to. You can run any code you
like in the `load` function, so it's entirely up to you to decide what
should happen or what is displayed while your game is loading.

<a id='shootingbullets'></a>
#### Shooting bullets

How can you make the cannon fire bullets? 

When you press the space bar, the cannon fires bullets at the enemies.
The bullets start from the end of the cannon's turret, and travel up the
canvas at 7 pixels per frame. If they hit an alien, the alien
explodes. If a bullet misses and flies past the top of the stage, the
game code removes it.

![Firing bullets](/tutorials/screenshots/17.png)

To implement a bullet-firing system in your game, the first thing you
need is an array to store the all the bullet sprites.
```
bullets = [];
```
This `bullets` array is initialized in the game's `setup` function.

You can then use Hexi's custom `shoot` method to make any sprite fire
bullets in any direction. Here's the general format you can use to
implement the `shoot` method.
```
g.shoot(
  cannon,      //The shooting sprite
  4.71,        //The angle, in radians, at which to shoot (4.71 is up)
  16,          //The bullet's offset from the center of the sprite
  7,           //The bullet's speed (pixels per frame)
  bullets,     //The array used to store the bullets

  //A function that returns the sprite that should
  //be used to make each bullet
  function() {
    return g.sprite("bullet.png");
  }
);

```
The second argument determines the angle, in radians, at which the
bullet should travel. 4.71 radians, used in this example, is up. 0 is
to the right, 1.57 is down, and 3.14 is to the left.

The last argument is a function that returns a sprite that should be
used as the bullet. In this example the bullet is created using using the 
"bullet.png" frame from the game's loaded texture atlas.
```
function() {
  return g.sprite("bullet.png");
}
```
Replace this function with your own to create any kind of custom
bullet you might need.

When will your bullets be fired? You can call the `shoot` method
whenever you want to make bullets, at any point in your code. In Alien
Armada, bullets are fired when the player presses the space key. So
the game implements this by calling `shoot` inside the space key's
`press` method. Here's how:
```
g.key.space.press = function() {

  g.shoot(
    cannon,      //The shooting sprite
    4.71,        //The angle at which to shoot (4.71 is up)
    16,          //The bullet's offset from the center
    7,           //The bullet's speed (pixels per frame)
    bullets,     //The array used to store the bullets

    //A function that returns the sprite that should
    //be used to make each bullet
    function() {
      return g.sprite("bullet.png");
    }
  );

  //Play the shoot sound.
  shootSound.play();
};

```
You can see that the `press` method also makes the `shootSound` play.
(The code above is initialized in the game's `setup` function.)

There's one more thing you need to do: you have to make the bullets move.
You can do this with some code inside the game's looping `play` function. Use Hexi's
`move` method and supply the `bullets` array as an argument:
```
g.move(bullets);

```
The `move` method automatically loops through all the sprites in the
array and updates their x and y positions with the value of their `vx` and `vy` velocity values.

So now you know how the bullets are created and animated. But what happens when
they hit one of the aliens?

<a id='spritestates'></a>
#### Sprite states

When a bullet hits an alien, a yellow explosion image appears. This
simple effect is created by giving each alien sprite two states: a `normal`
state and a `destroyed` state. Aliens are created with their states
set to `normal`. If they're hit, their states change to `destroyed`.

![The sprite's states](/tutorials/screenshots/18.png)

How does this system work?

First, let's take a look at the Alien Armada tileset, shown here:

![The Alien Armada tileset](/tutorials/screenshots/19.png)

You can see two image frames that define these two states: `alien.png`
and `explosion.png`. Before you create the sprite, first create an
array that lists these two frames: 
```
var alienFrames = [
  "alien.png", 
  "explosion.png"
];
```
Next use the `alienFrames` array to initialize the `alien` sprite.
```
alien = g.sprite(alienFrames);
```
If you prefer, you could combine these two steps into one, like this:
```
alien = g.sprite([
  "alien.png", 
  "explosion.png"
]);
```
This loads the sprite up with two frames. Frame `0` is the `alien.png`
frame, and frame `1` is the `explosion.png` frame. Frame `0` is
displayed by default by when the sprite is first created. 

You can use the sprite's `show` method to display any other frame number on the
sprite, like this:
```
alien.show(1);
```
The code above will set the alien to frame number one, which is the
`explosion.png` frame.

To make your code a little more readable, its a good idea to define
your sprite's states in a special `states` object. Give each state a
name, with a value that corresponds to that state's frame number.
Here's how you could define two states on the alien: `normal` and
`destroyed`:
```
alien.states = {
  normal: 0,
  destroyed: 1
};
```
`alien.states.normal` now has the value `0`, and
`alien.states.destroyed` now has the value `1`. That means you could
display the alien's `normal` state like this:
```
alien.show(alien.states.normal);
```
And display the alien's `destroyed` state like this:
```
alien.show(alien.states.destroyed);
```
This makes your code a little more readable because you can tell at a
glance which sprite state is being displayed.

(Note: Hexi also has a lower-level `gotoAndStop` method that does
exactly the
same thing as `show`. Although you're free use `gotoAndStop` in your
game code, by convention it's only used internally by Hexi's rendering
engine.)

<a id='randomaliens'></a>
#### Generating random aliens

Alien Armada generates aliens at any 1 of 14 randomly chosen positions
just above the top boundary of the stage. The aliens first appear
infrequently, but gradually start to
appear at an ever-increasing rate. This makes the game gradually more
difficult as it
progresses. Let's find out how these two features are implemented.

<a id='timingaliens'></a>
##### Timing the aliens

When the game starts, the first new alien is generated after 100
frames have elapsed. A variable called `alienFrequency`, initialized in
the game's `setup` function is used to help track this. it's
initialized to 100.
```
alienFrequency = 100;
```
Another variable called `alienTimer` is used to count the number of
of frames that have elapsed between the previously generated alien,
and the next one. 
```
alienTimer = 0;
```
`alienTimer` is updated by 1 each frame in the `play` function (the game loop).
When `alienTimer` reaches the value of `alienFrequency`, a new alien
sprite is generated. Here's the code from the `play` function that
does this. (This code omits the actual code that generates the alien
sprite - we'll look at that ahead)
```
//Add one to the alienTimer.
alienTimer++;

//Make a new alien if `alienTimer` equals the `alienFrequency`.
if(alienTimer === alienFrequency) {

  //... Create the alien: see ahead for the missing code that does this...

  //Set the `alienTimer` back to zero.
  alienTimer = 0;

  //Reduce `alienFrequency` by one to gradually increase
  //the frequency that aliens are created
  if(alienFrequency > 2){  
    alienFrequency--;
  }
}
```
You can see in the code above that `alienFrequency` is reduced by 1
after the sprite has been created. That will make the next alien appear 1 frame earlier than the
previous alien, and which is why the rate of falling aliens slowly
increases. You can also see that the `alienTimer` is set back to 0 after the sprite
has been created so that it can restart counting towards making
the next new alien. 

<a id='randomposition'></a>
##### The aliens' random start positions

Before we generate any aliens, we need an array to store all the alien
sprites. An empty array called `aliens` is initialized in the `setup`
function for this purpose.
```
aliens = [];
```
Each alien is then created in the `play` function, inside the same
`if` statement we looked at above. This code has a lot of work to do:

- It sets the alien's image frames and states. 
- Its sets the alien's velocity (`vx` and `vy`.) 
- It positions the alien at a random horizontal position above the top stage boundary.
- And, finally, it pushes the alien into the `aliens` array. 

Here's the full code that does all this:
```
//Add one to the alienTimer.
alienTimer++;

//Make a new alien if `alienTimer` equals the `alienFrequency`.
if(alienTimer === alienFrequency) {

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
  //to its two frames.
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
  if(alienFrequency > 2){  
    alienFrequency--;
  }
}
```
You can see in the code above that th alien's `y` position places it
out of sight just above the stage's top boundary.
```
alien.y = 0 - alien.height;
```
It's `x` position, however, is random. 
``` 
alien.x = g.randomInt(0, 14) * alien.width;
```
This code places it in one of 15 possible random positions (0 to 14) above the
top of the stage. Here's an illustration of these positions:

![The Alien Armada tileset](/tutorials/screenshots/20.png)

Finally, and very importantly, the code pushes the alien sprite into
the `aliens` array.
```
aliens.push(alien);
```
All this code starts pumping out aliens at a steadily increasing rate.

<a id='movingaliens'></a>
#### Moving the aliens

How do we make the aliens move? In exactly the same way made the
bullets move. You'll notice in the code above that
each alien is initialized with a `vy` (vertical velocity) value of 1.
```
alien.vy = 1;
```
When this value is applied to the alien's `y` position, it will make the alien move down, towards the bottom of the stage,
at the rate of 1 pixel per frame. All the alien sprites in the game are in
the `aliens` array. So to make all of them move you need to loop
through each sprite in the `aliens` array each frame and add their
`vy` values to their `y` positions. Some code like this in the `play`
function would work:
```
aliens.forEach(function(alien){
  alien.y += alien.vy;
});
```
However, its easier just to use Hexi's convenient built-in `move` function. Just
supply `move` with the array of sprites that you want to move, like
this:
```
g.move(aliens);
```
This updates the aliens positions with their velocities automatically.

<a id='explodealiens'></a>
#### Making the aliens explode

Now that you know how to change the alien's state, how can you use
this skill to create the explosion effect? Here's the simplified code
from Alien Armada that shows you how to do this. Use `hitTestRectangle` to
check for a collision between an alien and bullet. If a collision is detected,
remove the bullet, show the alien's `destroyed` state, and then remove
the alien after a delay of one second.

```
if (g.hitTestRectangle(alien, bullet)) {

  //Remove the bullet sprite.
  g.remove(bullet);

  //Show the alien's `destroyed` state.
  alien.show(alien.states.destroyed);

  //Wait for 1 second (1000 milliseconds) then 
  //remove the alien sprite.
  g.wait(1000, function(){
    g.remove(alien);
  });
}

```
You can use Hexi's universal `remove` function to remove any sprite from a
a game, like this:
```
g.remove(anySprite);
```
You can optionally use it to remove more than one sprite at a time by
listing the sprites to remove in the arguments, like this:
```
g.remove(spriteOne, spriteTwo, spriteThree);
```
You can even use it to remove all the sprites in an array of sprites. Just
supply the sprite array as `remove`'s only argument:
```
g.remove(arrayOfSprites);
```
This will both make the sprites disappear from the screen, and also
empty them out of the array that they were in.

Ga also has a convenient method called `wait` that will run a function
after any delay (in milliseconds) that you specify. The Alien Armada
game code uses `wait` to remove the alien after a one second delay,
like this:
```
g.wait(1000, function(){
  g.remove(alien);
});

```
This allows the alien to display its `explosion` image state for one
second before it disappears from the game.

These are the basic techniques involved in making the aliens explode
and removing the aliens and bullets from the game when they collide.
But the actual code used in Alien Armada is a little more complex. That's
because the code uses nested `filter` loops to loop through all the bullets
and aliens so that they can be checked against each other for
collisions. The code also plays an explosion sound when a collision
occurs, and updates the score by 1. Here's all the code from the
game's `play` function that does this. (If you're new to JavaScript's
`filter` loops, you can [read about how to use them here.](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/filter))

```
//Check for a collision between the aliens and the bullets.
//Filter through each alien in the `aliens` array.
aliens = aliens.filter(function(alien) {

  //A variable to help check if the alien is
  //alive or dead.
  let alienIsAlive = true;

  //Filter though all the bullets.
  bullets = bullets.filter(function(bullet) {

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
      g.wait(1000, function(){
        g.remove(alien);
      });

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
```
As long as the filter loops return `true`, the current sprite being
checked will remain in the array. If there's a collision, however, the
loops return `false` and the current alien and bullet will be removed
from their arrays. 

And that's how the game's collision works!

<a id='displayingscore'></a>
#### Displaying the score

Another new feature introduced by Alien Armada is a dynamic score
display. Each time an alien is hit, the score at the top right corner
of the game screen increases by one. How does this work?

Alien Armada initializes a `text` sprite called `scoreDisplay` in the
game's `setup` function.
```
scoreDisplay = g.text("0", "20px emulogic", "#00FF00", 400, 10);
```
You saw in the previous section
that 1 is added to the game's `score` variable each time an alien is
hit:
```
score += 1;
```
To visibly update the score, all you need to do is set the `score`
value as the `scoreDisplay`'s `content`, like this:
```
scoreDisplay.content = score;
```
And that's all there is to it!

<a id='endinggame2'></a>
#### Ending and resetting the game

There are two ways the game can end. Either the player shoots down 60
aliens, in which case the player wins. Or, one of the aliens has to travel
beyond the bottom edge of the stage, in which case the aliens win. 

A simple if statement in the `play` function checks for this. If
either condition becomes `true`, the `winner` is set to either
"player" or "aliens" and the game's `state` is changed to `end`.
```
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
aliens.forEach(function(alien){

  //Check to see if the `alien`'s `y` position is greater
  //than the `stage`'s `height`
  if (alien.y > g.stage.height) { 

    //Set the aliens as the winner.
    winner = "aliens";

    //Change the game's state to `end`.
    g.state = end;
  }
});
```
The `end` function pauses the game, so that the animation freezes. It
then displays the `gameOverMessage`, which will either be "Earth
Saved!" or "Earth Destroyed!", depending on the outcome. As an extra
touch, the music `volume` is also set to 50%. Then after a
delay of 3 seconds, a function named `reset` is called. Here's the
complete `end` function that does all this:

```
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
  g.wait(3000, function(){
    reset(); 
  });
}
```
The `reset` function resets all of the game variables back to their
starting values. It also turns the music volume back up to 1. It uses
the `remove` function to remove any remaining sprites from the
`aliens` and `bullets` arrays, so that those arrays can be
re-populated when the game starts again. `remove` is also used to
remove the `gameOverMessage`, and the `cannon` sprite is re-centered
at the bottom of the stage. Finally, the game `state` is set back to
`play`, and the game loop is un-paused by calling Hexi's `resume`
method.
```
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
```
And this is all the code needed to start the game again. You can play
Alien Armada as many times as you like and it will reset and restart
itself like this endlessly.


