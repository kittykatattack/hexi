![Hexi](/tutorials/screenshots/logoAndIllustration.png)

Hexi
====

**Hexi** is a fun and easy way to make HTML5 games or any other
kind interactive media using pure JavaScript code. Take a look at 
the feature list and the [examples](https://github.com/kittykatattack/hexi/tree/master/examples) folder to get started. Keep scrolling, 
and you'll find a complete Quick Start Guide and beginner's tutorials ahead. If you've never made a game before, the tutorials are the best place to start.

What's great about Hexi? You get all the power of WebGL rendering with
a streamlined API that lets you write your code in a
[minimalist](https://en.wikipedia.org/wiki/Haiku),
[declarative](http://latentflip.com/imperative-vs-declarative/) way.
It makes coding a game as easy and fun as writing poetry or drawing. Try it! If you
need any help or have any questions, post something in this
repository's [Issues](https://github.com/kittykatattack/hexi/issues).
The Issues page is is Hexi's friendly chat room - don't be afraid to
ask for help :) 

You only need one file from this repository to get started using Hexi:
[`hexi.min.js`](https://github.com/kittykatattack/hexi/blob/master/bin/hexi.min.js). That's all! [Link it to your HTML document with a `<script>` tag](http://www.quackit.com/javascript/tutorial/external_javascript_file.cfm), and go for it! 
Hexi has been written, from the ground up, in the latest version of
JavaScript (ES6/7, 20015/6) but is compiled down to ES5 (using [Babel](https://babeljs.io)) so that it will run anywhere. What do you need to know before you start using Hexi? You should have a reasonable understanding of HTML and JavaScript. You don't have to be an expert, just an ambitious beginner with an eagerness to learn. If you don't know HTML and JavaScript, the best place to start learning it is this book:

[Foundation Game Design with HTML5 and JavaScript](http://www.apress.com/9781430247166)

I know for a fact that it's the best book, because I wrote it!

Ok, got it? Do you know what JavaScript variables, functions, arrays and objects are and how to use them? Do you know what [JSON data files](http://www.copterlabs.com/blog/json-what-it-is-how-it-works-how-to-use-it/) are? Have you used the [Canvas Drawing API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Drawing_graphics_with_canvas)? Then you're ready to start using Hexi!  

Of course, Hexi is completely free to use: for-anything, for-ever! It was written in Canada (Toronto, Hamilton), India (Kullu Valley, Ladakh), Nepal (Kathmandu, Pokhara, Annapurna Base Camp), Thailand (Ko Phangan, Ko Tao) and South Africa (Cape Town), and is the result of 15 years' research into API usability for game design. The name, "Hexi" comes from ["Hex"](https://en.wiktionary.org/wiki/hex) + ["Pixi"](https://github.com/pixijs/pixi.js/) = "Hexi". [It has absolutely no other meaning](https://www.youtube.com/watch?v=XYGmNs6274A).

### Table of contents:
1. [Hexi's Features](#features)
2. [Modules](#modules)
3. [Quick start](#quickstart)
  1. [The HTML container page](#thehtmlcontainer)
  3. [Hexi's architecture](#hexisarchitecture)
  2. [Setting up and starting Hexi](#settingupandstartinghexi)
  4. [The load function](#theloadfunction)
  5. [The setup function](#thesetupfunction)
  6. [The play function](#thesplayfunction)
  7. [Taking it further](#takingitfurther)
4. [Tutorials](#tutorials)
  1. [Treasure Hunter](#treasure)
    1. [Setting up the HTML container page](#settingup)
    2. [Initializing the Ga engine](#initializing)
    3. [Define your "global" variables](#defineglobals)
    4. [Initialize your game with a setup function](#setupfunction)
      1. [Customizing the canvas](#customizing)
      2. [Creating the `chimes` sound object](#creatingsound)
      3. [Creating game scenes](#gamescenes)
      4. [Making sprites](#makingsprites)
      5. [Positioning sprites](#positioningsprites)
      6. [Assigning dynamic properties](#dynamicproperties)
      7. [Creating the enemy sprites](#enemysprites)
      8. [The health bar](#healthbar)
      9. [The game over scene](#gameoverscene)
      10. [Keyboard interactivity](#keyboard)
      11. [Setting the game state](#gamestate)
    5. [Game logic with the play function loop](#gamelogic)
      1. [Moving the player sprite](#movingplayer)
      2. [Containing sprites inside the screen boundaries](#boundries)
      3. [Collision with the enemies](#collisionenemy)
        1. [Collision with the treasure](#collisiontreasure)
      4. [Ending the game](#endinggame1)
    6. [Using images](#usingimages)
      1. [Individual images](#individualimages)
        1. [Loading image files](#loadingimagefile)
        2. [Making sprites with images](#makingsprites)
        3. [Fine-tuning the containment area](#finetuning)
    7. [Using a texture atlas](#textureatlas)
      1. [Preparing the images](#preparingimages)
      2. [loading the texture atlas](#loadingatlas)
  2. [Alien Armada](#alienarmada)
    1. [Load and use a custom font](#customfonts)
    2. [Scale and center the game in the browser](#scalebrowser)
    3. [A loading progress bar](#progressbar)
    4. [Shooting bullets](#shootingbullets)
    5. [Sprite states](#spritestates)
    6. [Generating random aliens](#randomaliens)
      1. [Timing the aliens](#timingaliens)
      2. [The aliens' random start positions](#randomposition)
    7. [Moving the aliens](#movingaliens)
    8. [Making the aliens explode](#explodealiens)
    9. [Displaying the score](#displayingscore)
    10. [Ending and resetting the game](#endinggame2)
  3. [Flappy Fairy!](#flappyfairy)
    1. [Make a button](#makeabutton)
    2. [Making the fairy fly](#makingthefairyfly)
    3. [Make a scrolling background](#makeascrollingbackground)
    4. [The fairy dust explosions](#thefairydustexplosions)
    5. [Use a particle emitter](#useaparticleemitter)
    6. [Creating and moving the pillars](#creatingandmovingthepillars)
5. [Integration with HTML and CSS](#htmlIntegration)
6. [A Guide to the examples](#aguidetotheexamples)

<a id='features'></a>
Features
--------

Here's Hexi's core feature list:

- All the most important sprites you need: rectangles, circles, lines,
  text, image sprites and animated "MovieClip" style sprites. You can make any of these sprites with one only line of code. You can also create your own custom sprite types.
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
- Easy-to-use keyboard key bindings. Easily define your own with the `keyboard`
  method.
- A built-in universal `pointer` that works with both the mouse and
  touch. Assign your own custom `press`, `release` and `tap` methods
  or use any of the pointer's built-in properties: `isUp`, `isDown`,
  `tapped`, `x` and `y`. Define as many pointers as you need for multi-touch. (It also works with isometric maps!)
- Conveniently position sprites relative to other sprites using
  `putTop`, `putRight`, `putBottom`, `putLeft` and `putCenter`. Align
  sprites horizontally or vertically using `flowRight`, `flowLeft`,
  `flowUp` or `flowDown`.
- A universal asset loader to pre-load images, fonts, sounds and JSON
  data files. All popular file formats are supported. You can load new assets into the game at any time.
- An optional `load` state that lets you run actions while assets are
  loading. You can use the `load` state to add a loading progress bar.
- A fast and focused [Pixi-based](https://github.com/pixijs/pixi.js/) rendering engine. If Pixi can do it, so can Hexi! Hexi 
  is just a thin layer of code that sits on top of Pixi. And you can access the
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
- Use `scaleToWindow` to make the game automatically scale to its maximum size and align itself for the best fit inside the browser window. 
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
- Seamless integration with HTML and CSS elements for creating rich
  user interfaces. Use Hexi also works with Angular, React and Elm!
- A complete suite of tools for easily creating isometric game worlds, including: an isometric mouse/touch pointer, isometric tile collision using `hitTestIsoTile`, and full Tiled Editor isometric map support using `makeIsoTiledWorld`.
- Yes, Hexi applications meet W3C accessibilty guidelines thanks to the [`accessible`](http://www.goodboydigital.com/pixi-becomes-accessible/) property provided by the Pixi renderer.

<a id='features'></a>
### Hexi's modules

Hexi contains a collection of useful modules, and you use any of the
properties or methods of these modules in your high-level Hexi code.

- [Pixi](https://github.com/pixijs/pixi.js/): The world's fastest 2D WebGL and canvas renderer.
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
- [Tile Utilities](https://github.com/kittykatattack/tileUtilities): A collection of useful methods for making tile-based game worlds with [Tiled Editor](http://www.mapeditor.org). Includes a full suite of isometric map utilities.
- [Sound.js](https://github.com/kittykatattack/sound.js): A micro-library for loading, controlling and generating
  sound and music effects. Everything you need to add sound to games.
- [Smoothie](https://github.com/kittykatattack/smoothie): Ultra-smooth sprite animation using 
  true delta-time interpolation. It also lets you specify the fps (frames-per-second) at which 
  your game or application runs, and completely separates your sprite rendering loop from your
  application logic loop.

Read the documents at the code repositories for each of these modules to find out
what you can do with them and exactly how they work. Because they're
all built into Hexi, you don't have to install them yourself - they
just work right out-of-the-box.

Hexi lets you access most of these module methods and properties as
**top-level objects**. For example, if you want to access the `hit` method
from the Bump collision module, you can do it like this:
```js
g.hit(spriteOne, spriteTwo);
```
But you can also access the Bump module directly if you need to, like this:
```js
g.bump.hit(spriteOne, spriteTwo);
```
(This assumes that your Hexi instance is called `g`);

Just refer to the module name using **lowerCamelCase**. That means you can
access the Smoothie module as `smoothie` and the Sprite Utilities
module as `spriteUtilities`.

There are two exceptions to this convention. You can access the Pixi
global object directly as `PIXI`. Also, the functions in the Sound.js module
are also only accessible as top-level global objects. This is was done
to simplify the way these modules are integrated with Hexi, and
maintain the widest possible cross-platform compatibility.

If you're a developer and would like to contribute to Hexi, the best
way is to contribute new and improved features to these modules. Or,
if you're really ambitious, propose a new module to the Hexi
development team (in this repo's [Issues](https://github.com/kittykatattack/hexi/issues),
and maybe we'll add it to Hexi's core!)

<a id='quickstart'></a>
Hexi quick start
----------------

To start working with Hexi quickly, take a look at the Quick Start
project in Hexi's [examples
folder](https://github.com/kittykatattack/hexi/tree/master/examples).
You'll find the [HTML container page here](https://github.com/kittykatattack/hexi/blob/master/examples/01_quickStart.html) and the [JavaScript
source file here](https://github.com/kittykatattack/hexi/blob/master/examples/src/quickStart.js). The source code is fully commented and explains how all everything works so, if you want to, you can just skip straight to that file and read through it. (You'll find the complied, ES5, version of the JavaScript file [in the `bin` folder](https://github.com/kittykatattack/hexi/tree/master/examples/bin).) 

The Quick Start project is a tour of all of Hexi's main features, and you can use it as a template for making your own new Hexi applications. Click on the image below to try a working example:

[![Quick start](/tutorials/screenshots/30.png)](https://cdn.gitcdn.xyz/cdn/kittykatattack/hexi/a1713aa19bdcc9a0c661e67d079a205d7c221917/examples/01_quickStart.html)

You'll first see a loading bar that shows you the percentage of files
(sounds and images) being loaded. You'll then see a spinning message that asks to you to tap on the screen to create cats. Cats will appear on the screen wherever you click with the pointer while music plays in
the background. (Oops, Sorry! I forgot to warn you about the music!) A text field rotates and counts the number of cats
you've created. The cats themselves move and bounce around the
screen, while scaling in size and oscillating their transparency.
Here's an illustration of what you'll see:

![Quick start illustration](/tutorials/screenshots/31.png)

Why cats? [Because](http://motherboard.vice.com/blog/toxo-terror-are-our-brains-controlled-by-cat-loving-parasites).

If you know how this Quick Start application was made, you'll be well on your
way to being productive with Hexi fast - so let's find out!

(Note: If you're new to game programming and feel you need a gentler,
more methodical, introduction to Hexi, check out the [Tutorials](#tutorials) section ahead. You'll learn how to make 3 complete games from scratch, and each game gradually builds on the skills you learnt in the previous game.)

<a id='thehtmlcontainer'></a>
###The HTML container

The only file you need to start using Hexi is
[`hexi.min.js`](https://github.com/kittykatattack/hexi/blob/master/bin/hexi.min.js). It has an incredibly simple "installation": Just link it to an HTML page with a `<script>` tag. Then link your main JavaScript file that will contain your game or application code. Here's what a typical Hexi HTML container page might look like:
```html
<!doctype html>
<meta charset="utf-8">
<title>Hexi</title>
<body>
<script src="hexi.min.js"></script>
<script src="main.js"></script>
</body>
```
You can, of course, load as many external script files that you need
for your game.

If you need a little more fine-control, you can alternatively load
Hexi using three separate files: The Pixi renderer, Hexi's modules, and Hexi's `core.js`file. 
```html
<!doctype html>
<meta charset="utf-8">
<title>Hexi</title>
<body>

<!-- Pixi renderer, Hexi's modules, and Hexi's core  -->
<script src="pixi.js"></script>
<script src="modules.js"></script>
<script src="core.js"></script>

<!-- Main application file -->
<script src="bin/quickStart.js"></script>
</body>
```
An advantage to doing this is that it lets you swap out Hexi's
internal version of Pixi, with your own custom build of Pixi, or a
specific version of Pixi that you want to use. Or maybe you made some
other crazy modifications to Hexi's modules that you want to try out. But typically, you'll probably never need to do this.

<a id='hexisarchitecture'></a>
###Hexi's Architecture

All the fun happens in your main JavaScript file. Hexi
applications have a very simple but flexible architecture that you can
scale to any size you need. Small games with a few hundred lines of code or big games with a few hundred files - Hexi can do it!
Here's the structure of at typical Hexi application:

1. Start Hexi.
2. The `load` function, that will run while your files are loading.
3. The `setup` function, which initializes your game objects, variables and sprites.
4. The `play` function, which is your game or application logic that runs in a loop.

And Here's what this actually looks like in real code:

```js
//1. Setting up and starting Hexi

//An array of files you want to load
let thingsToLoad = ["anyFiles", "youWant", "toLoad"];

//Initialize and start Hexi
let g = hexi(canvasWidth, canvasHeight, setup, thingsToLoad, load);
g.start();

//2. The `load` function that will run while your files are loading

function load(){
  
  //Display an optional loading bar
  g.loadingBar();
}

//3. The `setup` function, which initializes your game objects, variables and sprites

function setup() {

  //Create your game objects here

  //Set the game state to `play` to start the game loop
  g.state = play;
}

//4. The `play` function, which is your game or application logic that runs in a loop

function play(){
  //This is your game loop, where you can move sprites and add your
  //game logic
}
```
This simple model is all you need to create any kind of game or application.
You can use it as the starting template for your own projects, and this same
basic model can scale to any size.

Let's find out how this architectural model was used to build the Quick
Start application.

<a id='settingupandstartinghexi'></a>
###1. Setting up and starting Hexi

First, create an array that lists all the files you want to load. The Quick
Start project loads an image file, a font file, and a music file.
```js
let thingsToLoad = [
  "images/cat.png",
  "fonts/puzzler.otf",
  "sounds/music.wav"
];
```
If you don't have any files you want to load, just skip this step.

Next, initialize Hexi with the `hexi` function. Here's how to initialize a
new Hexi application with a screen size of 512x512 pixels. It tells
Hexi to load the files in the `thingsToLoad` array, run a function called `load` while
its loading, and then run a function called `setup` when everything is ready to go.
```js
let g = hexi(512, 512, setup, thingsToLoad, load);
```
You can now access the instance of Hexi in your application through an
object called `g` (Although, you can give this any name you like. I
like using "g" because it stands for "game", and is short to type.)

The `hexi` function has 5 arguments, although only the first 3 are required.

1. Canvas width.
2. Canvas height. 
3. The `setup` function.
4. The `thingsToLoad` array you defined above. This is optional.
5. The `load` function. This is also optional.

If you skip the last two arguments, Hexi will skip the loading process and jump straight to the `setup` function.

Optionally Set the frames per second at which the game logic loop should run.
(Sprites will be rendered independently, with interpolation, at full 60 fps)
If you don't set the `fps`, Hexi will default to an fps of 60.
```js
g.fps = 30;
```
Setting an fps lower than 60 gives you much more performance overhead to play
with, and your games will still look great.

You can also optionally add a border and set the background color.
```js
g.border = "2px red dashed";
g.backgroundColor = 0x000000;
```
And, if you want to scale and align the game screen to the maximum browser
window size, you can use the `scaleToWindow` method.
```js
g.scaleToWindow();
```
Finally, call the `start` method to get Hexi running
```js
g.start();
```
This is important! Without calling the `start` method Hexi won't
start!

<a id='theloadfunction'></a>
###2. The `load` function, that runs while things are loading

If you supplied Hexi with a function called `load` when you initialized it, you can display a loading bar and loading progress information. Just create a function called `load`, like this:
```js
function load(){

  //Display the file currently being loaded
  console.log(`loading: ${g.loadingFile}`); 

  //Display the percentage of files currently loaded
  console.log(`progress: ${g.loadingProgress}`);

  //Add an optional loading bar 
  g.loadingBar();
}
```
<a id='thesetupfunction'></a>
###3. The `setup` function, which initializes and creates your game objects

Now that you've started Hexi and loaded all your files, you can start
making things! This happens in the `setup` function. If you have any
objects or variables that you want to use across more than one
function, define them outside the `setup` function, like this:
```js
//These things will be used in more than one function
let cats, message;

//Use the `setup` function to create things
function setup(){

  //... create things here! ... 
}
```
Let's find out how the code inside the `setup` function works. We're going
to be making cats - lots of cats! - so it's useful to create a `group` called
`cats`to keep them all together.
```js
cats = g.group();
```
In the Quick Start project you can make a new cat by tapping the
screen with the mouse (or touch.) So, we need a function that will
produce new cat **sprites** for us. (Sprites are interactive graphics that you can animate and move around the screen.) Hexi lets you create a new sprite using the `sprite` method. Just supply `sprite` with file name that you want to use for the sprite. Each new cat sprite that's created should be positioned and added add to the cats `group`, using the `addChild` method. We also want the cat to animate its scale using the `breathe` method and animate its transparency using the `pulse` method. A function called `makeCats` does all this. `makeCats` takes two arguments: the x and y
position where you want the cat to appear, relative to the top left corner of the screen.
```js
makeCat = (x, y) => {

  //Create the cat sprite. Supply the `sprite` method with 
  //the name of the loaded image that should be displayed
  let cat = g.sprite("images/cat.png");

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

```
(You can find out more about how the `breathe` and `pulse` methods work to
animate the cat in the [tweening example](https://github.com/kittykatattack/hexi/blob/master/examples/src/tweening.js) in the [examples folder](https://github.com/kittykatattack/hexi/tree/master/examples).)

We also need to create a `text` sprite to display the words "Tap for
cats!" We can use Hexi's `text` method to do that.
```js
message = g.text("Tap for cats!", "38px puzzler", "red");
```
The `text` method's arguments are the text you want to display, the
font size and family, and the color (You can use any HTML/CSS color
string value, RGBA or HSLA values).

Use Hexi's `putCenter` method to center the text inside the `stage`.
```js
g.stage.putCenter(message);
```
What's the `stage`? It's the root container that all Hexi sprites
belong to when they're first created. 

You can also use `putLeft`, `putRight`, `putTop` or `putBottom` methods to help you align objects relative to other objects. The optional 2nd and 3rd arguments of these methods define the x and y offset, which help you fine-tune positioning.

Because we want the text message to rotate around its center point we
have to set its `pivotX` and `pivotY` values to 0.5.
```js
message.pivotX = 0.5;
message.pivotY = 0.5;
```
0.5 means "the very center of the sprite".

You can also use this alternative syntax to set the pivot point:
```js
message.setPivot(0.5, 0.5);
```
We need some way to tell Hexi to create a new cat whenever the screen
is clicked or tapped. We also want the text message to tell us how many cats are currently on the screen. Hexi has a built in `pointer` object with a `tap` method that we can program to help us do this.
```js
g.pointer.tap = () => {
  
  //Supply `makeCat` with the pointer's `x` and `y` coordinates.
  makeCat(g.pointer.x, g.pointer.y);

  //Make the `message.content` display the number of cats 
  message.content = `${cats.children.length}`;
};
```
We also want the music file that we loaded to start playing. We can
access the music sound object with Hexi's `sound` method. Use the sound object's `loop`
method to make it loop continuously, and use `play` to start it playing right away.
```js
let music = g.sound("sounds/music.wav");
music.loop = true;
music.play();
```
We're now done setting everything up! That means we're finished with
our application's `setup` state and can now switch the state to `play`. Here's how to do that: 
```js
g.state = play;
```
The `play` state is a function that will run in a loop, and is where
all our application logic is. Let's find out how that works next.

<a id='thesplayfunction'></a>
###4. The `play` function: the looping application logic

The last thing you need in your Hexi application is a `play` function.
```js
function play() {

  //All this code will run in a loop
}
```
The `play` function is called in a continuous loop, at whatever fps
(frames per second) value you set. This is your **game logic loop**. (The
render loop will be run by Hexi in the background at the maximum fps
your system can handle.) You can pause Hexi's game loop at any time
with the `pause` method, and restart it with the `resume` method.
(Check out the [Flappy Fairy](https://github.com/kittykatattack/hexi/blob/master/tutorials/src/flappyFairy.js) project to find out how `pause` and
`resume` can be used to manage an application with complex states.)

The Quick Start project's `play` function just does two things: It
makes the text rotate, and moves and bounces the cats around the
screen. Here's the entire `play` function that does all this.
```js
function play() {
  
  //Rotate the text 
  message.rotation += 0.1;

  //Loop through all of the cats to make them move and bounce off the
  //edges of the stage
  cats.children.forEach(cat => {

    //Make the cat bounce off the screen edges
    let collision = g.contain(cat, g.stage, true);

    //Move the cat
    g.move(cat);
  });
}
```
That's all! Compared to all the work we put into the `setup` function, the
`play` function does practically nothing! But how does it work?

It first makes the text rotate around its center by updating the
`message` text sprite's `rotation` property by 0.1 radians.
```js
message.rotation += 0.1;
```
Because this new rotation value is being applied to the old rotation value inside a continuous loop, it gradually increases the value and makes the text rotate.

The next thing the code does is loop through all the sprites in the
`cat` group's `children` array.
```js
cats.children.forEach(cat => {
  //Loop through each `cat` sprite in the `chidren` array
});
```
All Hexi groups have an array called `children` which
tells you which sprites they contain. Whenever you add a sprite to a
group using the `addChild` method, the sprite is added to the group's
`children` array. Hexi's root container, called the `stage`, also has
a `children` array that contains all the sprites and groups in your
Hexi application. Even `sprite` objects have a `children` array, and
that means you can use `addChild` to group sprites with other sprites
to create complex game objects.

When the code loops through each cat, it first checks whether the cat
is touching the edges of the screen and, if it is, it bounces it away
in the opposite direction. Hexi's `contain` method helps us do this.
```js
let collision = g.contain(cat, g.stage, true);
```
Setting the third argument to `true` is what causes the cat to bounce.

The cat moves around the screen with the help of the `move` method.
```js
g.move(cat);
```
The `move` method updates the sprite's position by its `vx` and `vy` velocity values. (All Hexi sprites have `vx` and `vy` values, which are initialized to zero). You can move more than one sprite at a time by supplying `move` with a list of sprites, separated by commas. You can even supply it with an array that that contains all the sprites you want to move. Here's what `move` is actually doing under the hood:
```js
cat.x += cat.vx;
cat.y += cat.vy;
```
And that's all there is to it! This is everything you know about the Quick Start application, and almost everything you need to know about Hexi!

<a id='takingitfurther'></a>
###Taking it further

With this basic Hexi architecture, you can create anything. Just set Hexi's `state` property to any other function to switch the behaviour of your application. Here's how:
```js
g.state = anyStateFunction;
```
Nice and simple!

Write as many state functions as you need. If it's a small project, you can keep all these functions in one file. But, for a big project, load your functions from external JS files as you need them. Use any module system you prefer, like ES6 modules, CommonJS, AMD, or good old HTML `<script>` tags.  This simple architectural model can scale to any size, and is the only architectural model you need to know. Keep it simple and stay happy!

Now that you've got a broad overview of how Hexi works, read through
the tutorials to dive into the details.

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
```js
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
```js
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
let g = hexi(//...
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

Hexi just implement's [Pixi's superb resource loader](https://github.com/englercj/resource-loader)
under-the-hood.  You can access the loader directly through Hexi's `loader`
property, and you can access the resources through the `resources` property. Or, just use `PIXI.loader` directly, if you want to. You can
find out more about [how Pixi's loader works here](https://github.com/kittykatattack/learningPixi#loading).

We want the game canvas to scale to
the maximum size of the browser window, so that it displays as large
as possible. We can use a useful method called `scaleToWindow` to do
this for us.
```js
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
```js
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
```js
treasure.x = g.canvas.width - treasure.width - 10;
treasure.y = g.canvas.height / 2 - treasure.halfHeight;
```
That's a lot of complicated positioning code to write. Instead, you
could use Hexi's built-in `putCenter` method to achieve the same effect
like this:
```js
g.stage.putCenter(treasure, 220, 0);
```
What is the `stage`? It's the root container for all the sprites, and
has exactly the same dimensions as the canvas. You can think of the
`stage` as a big, invisible sprite, the same size as the canvas, that contains
all the sprites in your game, as well as any containers those sprites
might be grouped in (Like the `gameScene`). `putCenter` works by
centering the `treasure` inside the `stage`, and then offsetting its
`x` position by 220 pixels. Here's the format for using `putCenter`:
```js
anySprite.putCenter(anyOtherSprite, xOffset, yOffset);
```
You can use the other `put` methods in the same way. For example, if
you wanted to position a sprite directly to the left of another
sprite, without any offset, you could use `putLeft`, like this:
```js
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
```js
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
```js
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
let y = g.randomInt(0, g.canvas.height - enemy.height);
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
Hexi's `assets`. The easiest way to do this is to list the image names,
with their full file paths, in Hexi's assets array when you first
initialize the engine. Create an array called `thingsToLoad`, list the
file names, as strings, that you want to load. Then supply that array
as the `hexi` method's fourth argument. Here's how:
```js
//An array that contains all the files you want to load
let thingsToLoad = [
  "images/explorer.png",
  "images/dungeon.png",
  "images/blob.png",
  "images/treasure.png",
  "images/door.png",
  "sounds/chimes.wav"
];

//Create a new Hexi instance, and start it
let g = hexi(512, 512, setup, thingsToLoad);

//Start Hexi
g.start();
```
(If you open up the JavaScript console in the web browser, you can
monitor the loading progress of these assets.)

Now you can access any of these images in your game code like this:
```js
g.image("images/blob.png")
```
Although pre-loading the images and other assets is the simplest way
to get them into your game, you can also load assets at any other time
using the `loader` object and its methods. As I mentioned earlier,
the `loader` is just an alias for Pixi's loader that's running
under-the-hood, and you can [learn more about how to use it here](https://github.com/kittykatattack/learningPixi#loading).

Now that you've loaded the images into the game, let's find out how to
use them to make sprites.

<a id='makingsprites'></a>
##### Making sprites with images

Create an image sprite using the `sprite` method using the same format you learnt
earlier. Here's how to create a sprite using the `dungeon.png` image.
(`dungeon.png` is a 512 by 512 pixel background image.)
```js
dungeon = g.sprite("images/dungeon.png");
```
That's all! Now instead of displaying as a simple colored rectangle,
the sprite will be displayed as a 512 by 512 image. There's no need
to specify the width or height, because Hexi figures that our for you
automatically based on the size of the image. You can use all the other
sprite properties, like `x`, `y`, `width`, and `height`, just as you
would with ordinary rectangle sprites. 

Here's the code from the `setup` function that creates the dungeon
background, exit door, player and treasure, and adds them all to the
`gameScene` group. 
```js
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
//g.stage.putCenter(treasure, 208, 0);

//Create a `pickedUp` property on the treasure to help us Figure
//out whether or not the treasure has been picked up by the player
treasure.pickedUp = false;

//Create the `gameScene` group and add the sprites
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
dungeon. They're contained in such a way that naturally matches the 2.5D perspective of the artwork, as shown by the green square in this screen shot:

![Treasure Hunter](/tutorials/screenshots/11.png)

This is a very easy modification to make. All you need to do is supply
the `contain` method with a custom object that defines the size and
position of the containing rectangle. Here's how:
```js
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
output by a popular software tool called [Texture Packer](https://www.codeandweb.com/texturepacker) (Texture Packer's "Essential" license is free ). Even if you
don’t use Texture Packer, similar tools like [Shoebox](http://renderhjs.net/shoebox/) output JSON files in the same format. Let’s find out how to use it to make a texture
atlas with Texture Packer, and how to load it into a game.

<a id='preparingimages'></a>
##### Preparing the images

You first need individual PNG images for each image in your game.
You've already got them for Treasure Hunter, so you're all set. Open Texture
Packer and choose the **{JS}** configuration option. Drag your game images
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

Texture Packer can often be a pain to use, because you need to get all
these settings just right for it to publish properly without telling
you there are errors. And, it will try to trick you into upgrading to
the paid version by using default settings not supported by the free
version. So you need to explicitly turn these off (as I've described
above) for it to work without errors. Still, it's worth the effort in
the end - so keep trying and post an issue in this repository if you
get impossibly stuck!

<a id='loadingatlas'></a>
##### loading the texture atlas

To load the texture atlas into your game, just include the JSON file
in Hexi's assets array when you initialize the game.
```js
let thingsToLoad = [
  "images/treasureHunter.json",
  "sounds/chimes.wav"
];
let g = hexi(512, 512, setup, thingsToLoad);
g.scaleToWindow();
g.start();
```
That's all! You don't have to load the PNG file - Hexi does that
automatically in the background. The JSON file is all you need to tell
Hexi which tileset frame (sub-image) to display.

Now if you want to use a frame from the texture atlas to make a
sprite, you can do it like this:
```js
anySprite = g.sprite("frameName.png");
```
Ga will create the sprite and display the correct image from the
texture atlas's tileset.

Here's how to you could create the sprites in Treasure Hunter using
texture atlas frames:
```js
//The dungeon background
dungeon = g.sprite("dungeon.png");

//The exit door
exit = g.sprite("door.png");
exit.x = 32;

//The player sprite
player = g.sprite("explorer.png");
player.x = 68;
player.y = g.canvas.height / 2 - player.halfWidth;

//Create the treasure
treasure = g.sprite("treasure.png");
```
Hexi knows that those are texture atlas frame names, not individual
images, and it displays them directly from the tileset.

If you ever need to access the texture atlas's JSON file in your game,
you can get it like this:
```js
jsonFile = g.json("jsonFileName.json");
```
Take a look at `treasureHunterAtlas.js` file in the `tutorials` folder
to see a working example of how to load a texture atlas and use it to
make sprites.

<a id='alienarmada'></a>
### Alien Armada

The next example game in this series of tutorials is Alien Armada. Can you
destroy 60 aliens before one of them lands and destroys the Earth? Click the
image link below to play the game:

[![Alien Armada](/tutorials/screenshots/13.png)](https://gitcdn.xyz/repo/kittykatattack/hexi/master/tutorials/04_alienArmada.html)

Use the arrow keys to move and press the space bar to shoot. The
aliens descend from the top of the screen with
increasing frequency as the game progresses. Here's how the game is played:

![Alien Armada gameplay](/tutorials/screenshots/14.png)

Alien Armada illustrates some new techniques that you'll definitely want
to use in your games:

- Load and use custom fonts.
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
```js
let thingsToLoad = [
  "images/alienArmada.json",
  "sounds/explosion.mp3",
  "sounds/music.mp3",
  "sounds/shoot.mp3",
  "fonts/emulogic.ttf" //<- The custom font
];
let g = hexi(480, 320, setup, thingsToLoad, load);
g.scaleToWindow();
g.start();
```
To use the font, create a `text` sprite in the game's `setup`
function. The `text` method's second argument is a
string that describes the font's point size and name: "20px emulogic".  
```js
scoreDisplay = g.text("0", "20px emulogic", "#00FF00", 400, 10);
```
You can and load and use any fonts in TTF, OTF, TTC or WOFF format.

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
Hexi has a optional loading state that runs while game assets are being
loaded. You can decide what you want to have happen during the loading
state. All you need to do is write a function with code that should
run while the assets are loading, and tell Hexi what the name of that
function is. Hexi's engine will automatically run that function in a
loop until the assets have finished loading.

Let's find out how this works in Alien Armada. The game code tells 
Hexi to use a function called `load` during the loading state. It does
this by listing `load` as the final argument
in Hexi's initialization constructor. (Look for `load` in the code below):
```js
let g = hexi(480, 320, setup, thingsToLoad, load); //<- It's here!
```
This tells Hexi to run the `load` function in a loop while the assets
are loading. 

Here's the `load` function from Alien Armada. It implements a
`loadingBar` object, which is what displays the expanding blue bar and
the percentage of files loaded.
```js
function load(){
  g.loadingBar();
}

```
After the assets have loaded, the `setup` state runs automatically. 

You'll find the `loadingBar` code in Hexi's the `core.js` file. It's
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
```js
bullets = [];
```
This `bullets` array is initialized in the game's `setup` function.

You can then use Hexi's custom `shoot` method to make any sprite fire
bullets in any direction. Here's the general format you can use to
implement the `shoot` method.
```js
g.shoot(
  cannon,            //The shooter
  4.71,              //The angle at which to shoot (4.71 is up)
  cannon.halfWidth,  //Bullet's x position on the cannon
  0,                 //Bullet's y position on the canon
  g.stage,           //The container to which the bullet should be added
  7,                 //The bullet's speed (pixels per frame)
  bullets,           //The array used to store the bullets

  //A function that returns the sprite that should
  //be used to make each bullet
  () => g.sprite("bullet.png")
);
```
The second argument determines the angle, in radians, at which the
bullet should travel. 4.71 radians, used in this example, is up. 0 is
to the right, 1.57 is down, and 3.14 is to the left. 

The 3rd and 4th arguments are the bullet's start x and y position on
the canon. The 5th argument is the container that the bullet should be
added to, and the 6th is the array that the bullets should be put
into.

The last argument is a function that returns a sprite that should be
used as the bullet. In this example the bullet is created using using the 
"bullet.png" frame from the game's loaded texture atlas.
```js
() => g.sprite("bullet.png")
```
Replace this function with your own to create any kind of custom
bullet you might need.

When will your bullets be fired? You can call the `shoot` method
whenever you want to make bullets, at any point in your code. In Alien
Armada, bullets are fired when the player presses the space bar. So
the game implements this by calling `shoot` inside the space bar's
`press` method. Here's how:
```js
g.spaceBar.press = () => {

  //Shoot the bullet
  g.shoot(
    cannon,            //The shooter
    4.71,              //The angle at which to shoot (4.71 is up)
    cannon.halfWidth,  //Bullet's x position on the cannon
    0,                 //Bullet's y position on the canon
    g.stage,           //The container to which the bullet should be added
    7,                 //The bullet's speed (pixels per frame)
    bullets,           //The array used to store the bullets

    //A function that returns the sprite that should
    //be used to make each bullet
    () => g.sprite("bullet.png")
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
```js
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
```js
let alienFrames = [
  "alien.png", 
  "explosion.png"
];
```
Next use the `alienFrames` array to initialize the `alien` sprite.
```js
alien = g.sprite(alienFrames);
```
If you prefer, you could combine these two steps into one, like this:
```js
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
```js
alien.show(1);
```
The code above will set the alien to frame number one, which is the
`explosion.png` frame.

To make your code a little more readable, its a good idea to define
your sprite's states in a special `states` object. Give each state a
name, with a value that corresponds to that state's frame number.
Here's how you could define two states on the alien: `normal` and
`destroyed`:
```js
alien.states = {
  normal: 0,
  destroyed: 1
};
```
`alien.states.normal` now has the value `0`, and
`alien.states.destroyed` now has the value `1`. That means you could
display the alien's `normal` state like this:
```js
alien.show(alien.states.normal);
```
And display the alien's `destroyed` state like this:
```js
alien.show(alien.states.destroyed);
```
This makes your code a little more readable because you can tell at a
glance which sprite state is being displayed.

(Note: Hexi also has a lower-level `gotoAndStop` method that does
exactly the same thing as `show`. Although you're free use `gotoAndStop` in your
game code, by convention it's only used internally by Hexi's rendering
engine.)

<a id='randomaliens'></a>
#### Generating random aliens

Alien Armada generates aliens at any 1 of 14 randomly chosen positions
just above the top boundary of the stage. The aliens first appear
infrequently, but gradually start to appear at an ever-increasing rate. This makes the game gradually more difficult as it progresses. Let's find out how these two features are implemented.

<a id='timingaliens'></a>
##### Timing the aliens

When the game starts, the first new alien is generated after 100
frames have elapsed. A variable called `alienFrequency`, initialized in
the game's `setup` function is used to help track this. it's
initialized to 100.
```js
alienFrequency = 100;
```
Another variable called `alienTimer` is used to count the number of
of frames that have elapsed between the previously generated alien,
and the next one. 
```js
alienTimer = 0;
```
`alienTimer` is updated by 1 each frame in the `play` function (the game loop).
When `alienTimer` reaches the value of `alienFrequency`, a new alien
sprite is generated. Here's the code from the `play` function that
does this. (This code omits the actual code that generates the alien
sprite - we'll look at that ahead)
```js
//Add one to the alienTimer
alienTimer++;

//Make a new alien if `alienTimer` equals the `alienFrequency`
if(alienTimer === alienFrequency) {

  //... Create the alien: see ahead for the missing code that does this...

  //Set the `alienTimer` back to zero
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
```js
aliens = [];
```
Each alien is then created in the `play` function, inside the same
`if` statement we looked at above. This code has a lot of work to do:

- It sets the alien's image frames and states. 
- Its sets the alien's velocity (`vx` and `vy`.) 
- It positions the alien at a random horizontal position above the top stage boundary.
- And, finally, it pushes the alien into the `aliens` array. 

Here's the full code that does all this:
```js
//Add one to the alienTimer
alienTimer++;

//Make a new alien if `alienTimer` equals the `alienFrequency`
if(alienTimer === alienFrequency) {

  //Create the alien.
  //Assign two frames from the texture atlas as the 
  //alien's two states
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
  
  //Set its y position above the screen boundary
  alien.y = 0 - alien.height;
  
  //Assign the alien a random x position
  alien.x = g.randomInt(0, 14) * alien.width;
  
  //Set its speed
  alien.vy = 1;
  
  //Push the alien into the `aliens` array
  aliens.push(alien);

  //Set the `alienTimer` back to zero
  alienTimer = 0;

  //Reduce `alienFrequency` by one to gradually increase
  //the frequency that aliens are created
  if(alienFrequency > 2){  
    alienFrequency--;
  }
}
```
You can see in the code above that the alien's `y` position places it
out of sight just above the stage's top boundary.
```js
alien.y = 0 - alien.height;
```
It's `x` position, however, is random. 
```js
alien.x = g.randomInt(0, 14) * alien.width;
```
This code places it in one of 15 possible random positions (0 to 14) above the
top of the stage. Here's an illustration of these positions:

![The Alien Armada tileset](/tutorials/screenshots/20.png)

Finally, and very importantly, the code pushes the alien sprite into
the `aliens` array.
```js
aliens.push(alien);
```
All this code starts pumping out aliens at a steadily increasing rate.

<a id='movingaliens'></a>
#### Moving the aliens

How do we make the aliens move? In exactly the same way made the
bullets move. You'll notice in the code above that
each alien is initialized with a `vy` (vertical velocity) value of 1.
```js
alien.vy = 1;
```
When this value is applied to the alien's `y` position, it will make the alien move down, towards the bottom of the stage,
at the rate of 1 pixel per frame. All the alien sprites in the game are in
the `aliens` array. So to make all of them move you need to loop
through each sprite in the `aliens` array each frame and add their
`vy` values to their `y` positions. Some code like this in the `play`
function would work:
```js
aliens.forEach(alien => {
  alien.y += alien.vy;
});
```
However, its easier just to use Hexi's convenient built-in `move` function. Just
supply `move` with the array of sprites that you want to move, like
this:
```js
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
```js
if (g.hitTestRectangle(alien, bullet)) {

  //Remove the bullet sprite.
  g.remove(bullet);

  //Show the alien's `destroyed` state.
  alien.show(alien.states.destroyed);

  //Wait for 1 second (1000 milliseconds) then 
  //remove the alien sprite.
  g.wait(1000, () => g.remove(alien));
}
```
You can use Hexi's universal `remove` function to remove any sprite from a game, like this:
```js
g.remove(anySprite);
```
You can optionally use it to remove more than one sprite at a time by
listing the sprites to remove in the arguments, like this:
```js
g.remove(spriteOne, spriteTwo, spriteThree);
```
You can even use it to remove all the sprites in an array of sprites. Just
supply the sprite array as `remove`'s only argument:
```js
g.remove(arrayOfSprites);
```
This will both make the sprites disappear from the screen, and also
empty them out of the array that they were in.

Hexi also has a convenient method called `wait` that will run a function
after any delay (in milliseconds) that you specify. The Alien Armada
game code uses `wait` to remove the alien after a one second delay,
like this:
```js
g.wait(1000, () => g.remove(alien));
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
```js
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
```js
scoreDisplay = g.text("0", "20px emulogic", "#00FF00", 400, 10);
```
You saw in the previous section
that 1 is added to the game's `score` variable each time an alien is
hit:
```js
score += 1;
```
To visibly update the score, all you need to do is set the `score`
value as the `scoreDisplay`'s `content`, like this:
```js
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
```js
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
```js
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
```js
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

<a id='flappyfairy'></a>
### Flappy Fairy!

Flappy Fairy is a homage to one of the most infamous games ever made: [Flappy
Bird](http://en.wikipedia.org/wiki/Flappy_Bird). Click the
image link below to play the game:

[![FlappyFairy](/tutorials/screenshots/21.png)](https://gitcdn.xyz/repo/kittykatattack/hexi/master/tutorials/04_flappyFairy.html)

Click the "Go" button, and game will launch in full screen mode. Tap
anywhere on the screen to make the fairy fly, and help her navigate
through the gaps in 15 pillars to reach the finish. A trail of multicolored 
fairy dust follows the fairy as she flies through the maze. 
If she hits one of the green blocks she explodes in a shower of dust. 
But if she manages to navigate through the increasingly narrowing gaps between 
all 15 pillars, she reaches a big floating “Finish” sign. 

![Flappy Fairy gameplay](/tutorials/screenshots/22.png)

If you can make a game like Flappy Fairy, you can make almost any
other kind of 2D action game. In addition to using the all techniques you've
already learnt, Flappy Fairy introduces some exciting new ones:

- Launching a game in full screen mode.
- Make a click-able button. 
- Create an animated sprite.
- Use a `tilingSprite` to make a scrolling background.
- Use particle effects.

You'll find the fully commented Flappy Fairy source code in the
`tutorials` folder. Make sure to take a look at it so that you can see
all of this code in its proper context. Its general structure is identical
to the other games in this tutorial, with the addition of these new techniques. Let's
find out how they were implemented.

<a id='makeabutton'></a>
#### Make a button

The game starts when you press the "Go" button. The "Go" button is a special sprite
called a `button`. `button` sprites have 3 image frame states: up, over and
down. You can create a `button` with three states like this:
```js
goButton = g.button([
  "up.png",
  "over.png",
  "down.png"
]);
```
`up.png` is an image that shows what the button should look like when the it's not
interacting with the pointer. `over.png` shows what the button looks
like when the pointer is over it, and `down.png` is the image that is
displayed when the pointer presses down on the button.

![Button states](/tutorials/screenshots/23.png)

(The `down.png` image is offset slightly down and to the right, so it
looks like its being pressed down.) You can assign any images you like
to these states, and the `button` will display them automatically based on how the pointer is interacting with it. 

(Note: If your game is touch-only, you might have only two button states: up and down. In that case, just assign two image frames, and Hexi will assume they refer to the up and down states.)

Buttons have special methods that you can define: `press`,
`release`,`over`, `out` and `tap`. You can assign any code you like to
these methods. For example, here's how you could change the game's
state when the user releases the `playButton`:
```js
goButton.release = () => {
  g.state = setupGame;
};
```
Buttons also have a Boolean (true/false) property called `enabled`
that you
can set to `false` if you want to disable the button. (Set `enabled`
to `true` to re-enable it.) You can also use the button's `state`
property to find out if the button state is currently `"up"`, `"over"`
or `"down"`. (These state values are strings.)

Important! You can give **any** sprite the qualities of a button just by
setting its `interact` property to `true`, like this:
```js
anySprite.interact = true;
```
This will give the sprite `press`, `release`, `over`, `out` and `tap`
methods, and the same `state` property as ordinary buttons. This means
that you can make any sprite click-able, which is really useful for a
wide variety of interactive games.

You can also make the `stage` object interactive, which turns the whole 
game screen into an interactive button:
```js
g.stage.interact = true;
```
For more detail on how to use buttons, see the `buttons.html` file
in the `examples` folder.

<a id='animatingsprites'></a>
#### Animating sprites

A neat feature of Flappy Fairy is that the fairy character flaps her wings
when she's flying up. This animation was created by rapidly displaying 3
simple images in a continuous loop. Each image displays a slightly different
frame of the animation, as shown below:

![Animation frames](/tutorials/screenshots/24.png)

These three images are just three ordinary frames in the game's texture atlas, called
`0.png`, `1.png` and `2.png`.  But how can you turn a sequence of frames like this into a sprite animation?

First, create an array that defines the frames of the animation, like
this:
```js
let fairyFrames = [
  "0.png", 
  "1.png", 
  "2.png"
];
```
Then create a sprite using those frames, like this:
```js
let fairy = g.sprite(fairyFrames);
```
Or, if you prefer, you can combine this into one step:
```js
let fairy = g.sprite([
  "0.png", 
  "1.png", 
  "2.png"
]);

```
Any sprite with more than one image frame automatically becomes an
animated sprite. If you want the animation frames to start playing,
just call the sprite's `playAnimation` method:
```js
fairy.playAnimation();
```
The frames will automatically play in a continuous loop. If you don't want them
to loop, set `loop` to `false`.
```js
fairy.loop = false;
```
Use the `stopAnimation` method to stop an animation:
```js
fairy.stopAnimation();
```
If you want to know whether or not a sprite's animation is currently
playing, use the Boolean (true/false) `playing` property to find out.

How quickly or slowly do you want the animation to play? You can set
the animation's frames-per-second (`fps`) like this:
```js
fairy.fps = 24;
```
A sprite animation's frame rate is independent of the game's frame
rate. That gives you a lot of flexibility to fine-tune sprite
animations.

What if you don't want to use all the sprite's image frames in the animation, only some of them? For example, imagine that you have a sprite with 30 frames, but you only want to play frames 10 to 15 as part of the animation. Supply the `playAnimation` method with an array containing two numbers: the first and last frames of the sequence you want to play.
```js
animatedSprite.playAnimation([10, 15]);
```
Now only the frames between 10 to 15 will play as part of the animation. To make
this more readable, you can define the sequence as an array that
describes what those animated frames actually do. For example, perhaps
they define a character's walk cycle. You could create an array called
`walkCycle` that defines those frames:
```js
let walkCycle = [10, 15];
```
Then use that array with `playAnimation`, like this:
```js
animatedSprite.playAnimation(walkCycle);
```
That's a bit more code to write, but much more readable!

For more details on Hexi's sprite animation system and what you can do
with it, see the `keyframeAnimation.html`,
`textureAtlasAnimation.html` and  `animationStates.html` file in the `examples` folder.

<a id='makingthefairyfly'></a>
#### Making the fairy fly

Now that you know how to animate a sprite, how is Flappy Fairy's
flying animation triggered when you tap on the game screen?

A value of `0.05`, which represents gravity, is subtracted from the
fairy's `y` position each frame in the `play` function. This is the
gravity effect that pulls the fairy to the bottom of the screen. 
```js
fairy.vy += -0.05;
fairy.y -= fairy.vy;
```
But when you tap the screen, the fairy flies up. This is thanks to
Hexi's built-in `pointer` object. It has a `tap` method which you can define to
perform any action you like. In Flappy Fairy, the `tap` method increases the fairy's vertical velocity, `vy`, by 1.5 pixels each time you tap.
```js
g.pointer.tap = () => {
  fairy.vy += 1.5;
};  
```
Hexi's built-in `pointer` object also has `press` and `release` methods
that you can define in the same way. It also has Boolean (true/false)
`isUp`, `isDown` and `tapped` properties that you can use to find the
pointer's state, if you need to.

But you'll notice that the fairy only flaps her wings when she's
starting to fly up, and stops flapping when she looses momentum and
starts going down. To make this work, you need to know whether the fairy is
currently on the way up, or on the way down, based on a change in the
fairy's vertical velocity (vy) value. The game implements a well-worn
old trick to help figure this out. The `play` function captures the
fairy's velocity for this current frame in a new value called `oldVy`. But
it does this *only after the fairy's position has changed*. 
```js
function play(){

  //...
  //... all of the code that moves the fairy comes first...
  //...

  //Then, after the fairy's position has been changed, capture
  //her velocity for this current frame
  fairy.oldVy = fairy.vy;
}
```
This means that when the next game frame swings around, `oldVy` will still be storing the fairy's velocity value from the *previous frame*. And that means you
can use that value to figure out the change in the fairy's velocity from the
previous frame to the current frame. If she's starting to go up (if `vy` is
greater than `oldVy`), play the fairy's animation: 
```js
if (fairy.vy > fairy.oldVy) {
  if(!fairy.playing) {
    fairy.playAnimation();
  }
}
```
If she's starting to go down, stop the animation and just show the
fairy's first frame.
```js
if (fairy.vy < 0 && fairy.oldVy > 0) {
  if (fairy.playing) fairy.stopAnimation();
  fairy.show(0);
}
```
And that's how the fairy flies!

<a id='makeascrollingbackground'></a>
#### Make a scrolling background

A fun new feature of Flappy Fairy is that it has an infinitely scrolling
background of clouds moving from right to left.

![Scrolling background](/tutorials/screenshots/25.png)

The background moves at a slower rate than the green pillars, and that
creates the illusion that the clouds are further away. (This is a
shallow, pseudo 3D effect called **paralax scrolling**.) 

The background is just a single image.

![Scrolling background](/tutorials/screenshots/26.png)

The image has been designed so that the clouds **tile seamlessly**:
the clouds on the top and left match up with the clouds on the right
and bottom. That means you can connect multiple instances of the same
image and they will appear to create a single, unbroken continuous
image. ([Image from OpenGameArt.](opengameart.org/content/cartoony-sky)) 

Because this is really useful for games, Hexi has a sprite type
called a `tilingSprite` that's designed just for such infinite
scrolling effects. Here's how to create a `tilingSprite`: 
```js
sky = g.tilingSprite(
  "sky.png"              //The image to use
  g.canvas.width,        //The width
  g.canvas.height,       //The height
);
```
The first argument the image your want to use, and the last two
arguments are the sprite's width and height. 

Tiling sprites have the same properties as normal sprites, with the addition of two new properties: `tileX` and `tileY`. Those two properties let you set the image offset from the sprite's top left corner. If you want to make a tiling sprite scroll continuously, just increase its `tileX` value by some small amount each frame in the game loop, like this:
```js
sky.tileX -= 1;
```
And that's all you need to do to make an infinitely scrolling
background.

<a id='particleeffects'></a>
####Particle effects

How do you create effects like fire, smoke, magic, and explosions? 
You make lots of tiny sprites; dozens, hundreds or thousands of them. 
Then apply some physical or gravitational constraints to those sprites 
so that they behave like the element you’re trying to simulate. You 
also need to give them some rules about how they should appear and 
disappear, and what kinds of patterns they should form. These tiny 
sprites are called particles. You can use them to make a wide range 
of special effects for games.

Hexi has a versatile built-in method called `ceateParticles` that can
create most kinds of particle effects you'll need for games. Here's
the format for using it:
```js
createParticles(
  pointer.x,                           //The particle’s starting x position
  pointer.y,                           //The particle’s starting y position
  () => sprite("images/star.png"),     //Particle function
  g.stage,                             //The container to add the particles to   
  20,                                  //Number of particles
  0.1,                                 //Gravity
  true,                                //Random spacing
  0, 6.28,                             //Min/max angle
  12, 24,                              //Min/max size
  1, 2,                                //Min/max speed
  0.005, 0.01,                         //Min/max scale speed
  0.005, 0.01,                         //Min/max alpha speed
  0.05, 0.1                            //Min/max rotation speed
);
```
You can see that most of the arguments describe a range between the 
minimum and maximum values that should be used to change the sprites’ 
speed, rotation, scale, or alpha. You can also assign the number of 
particles that should be created, and add optional gravity. 
You can make particles using any sprites by customizing the third argument.
Just supply a function that returns the kind of sprite you want to use
for each particle:
```js
() => ("images/star.png"),
```
If you supply a sprite that has multiple frames, the `createParticles` 
method will automatically choose a random frame for each particle.
The minimum and maximum angle values are important for defining the 
circular spread of particles as they radiate out from the origin point. 
For a completely circular explosion effect, use a minimum angle of 0 and 
a maximum angle of 6.28.
```js
0, 6.28,
```
(These values are radians; the equivalent in degrees is 0 and 360.) 
0 starts at the 3 o’clock position, pointing directly to the right. 3.14 
is the 9 o’clock position, and 6.28 takes you around back to 0 again.
If you want to constrain the particle range to a narrower angle, just 
supply the minimum and maximum values that describe that range. Here are 
values you could use to constrain the angle to a pizza-slice with the 
crust pointing left.
```js
2.4, 3.6,
```
You could use a constrained angle range like this to create a particle
stream, like those used to create a fountain or rocket engine flames. 
(You’ll see exactly how to do this ahead.) The random spacing value 
(the sixth argument) determines whether the particles should be spaced 
evenly (`false`) or randomly (`true`) within this range.
By carefully choosing the sprite for the particle and finely adjusting 
each parameter, you can use this all-purpose `createParticles` method 
to simulate everything from liquid to fire. In Flappy Fairy, it's used
to create fairy dust.

<a id='thefairydustexplosions'></a>
#####The fairy dust explosions

When Flappy Fairy hits a block, she disappears in a puff of dust. 

![Fairy dust explosion](/tutorials/screenshots/27.png)

How does that effect work?

Before we can create the explosion effect, we have to define an array
that lists the images we want to use for each particle.
As you learned above, the `createParticles` method will randomly 
display a frame on a sprite, if that sprite contains multiple frames. 
To make this work, first define an array of texture atlas frames that 
you want to use for the fairy's dust explosion:
```js
dustFrames = [
  "pink.png",
  "yellow.png",
  "green.png",
  "violet.png"
];
```
The explosion happens when the fairy hits one of the green blocks.
The game loop does this with the help of the `hitTestRectangle` 
method. The code loops through the `blocks.children` array and tests for 
a collision between each green block and the fairy. If `hitTestRectangle` 
returns `true`, the loop quits and a collision object called
`fairyVsBlock` becomes `true`.
```js
let fairyVsBlock = blocks.children.some(block => {
  return g.hitTestRectangle(fairy, block, true);  
});
```
`hitTestRectangle`’s third argument needs to be `true` so that the collision 
detection is done using the sprite’s global coordinates (`gx` and `gy`). 
That’s because the fairy is a child of the `stage`, but each block is a child 
of the `blocks` group. That means they don’t share the same local coordinate space. 
Using the blocks sprites' global coordinates forces `hitTestRectangle`
to use their positions relative to the canvas. 

If `fairyVsBlock` is `true`, and the fairy is currently visible, the 
collision code runs. It makes the fairy invisible, creates the particle 
explosion, and calls the game’s `reset` function after a delay of 3 seconds.
```js
if (fairyVsBlock && fairy.visible) {

  //Make the fairy invisible
  fairy.visible = false;

  //Create a fairy dust explosion
  g.createParticles(
    fairy.centerX, fairy.centerY, //x and y position
    () => g.sprite(dustFrames),   //Particle sprite
    g.stage,                      //The container to add the particles to  
    20,                           //Number of particles
    0,                            //Gravity
    false,                        //Random spacing
    0, 6.28,                      //Min/max angle
    16, 32,                       //Min/max size
    1, 3                          //Min/max speed
  );
  
  //Stop the dust emitter that's trailing the fairy
  dust.stop();

  //Wait 3 seconds and then reset the game
  g.wait(3000, reset);
}
```

<a id='useaparticleemitter'></a>
#####Use a particle emitter

A particle emitter is just a simple timer that creates particles at 
fixed intervals. That means instead of just calling the 
`createParticles` method once, the emitter calls it periodically.
Hexi has a built-in `particleEmitter` method that let's you do this easily.
Here’s how to use it:
```js
let particleStream = g.particleEmitter(
  100,                                      //The interval
  () => g.createParticles(                  //The `particleEffect` function
    //Assign particle parameters...
  )
);
```
The `particleEmitter` method just wraps around the `createParticles` method. 
Its first argument is a number, in milliseconds, that determines how 
frequently the particles should be created. The second argument is 
the `createParticles` method, which you can customize however you like. 
The `particleEmitter` method returns an object with `play` and `stop` methods 
that you can use to control the particle stream. You can use them 
just like the `play` and `stop` methods you use to control a sprite’s 
animation.
```js
particleStream.play();
particleStream.stop();
```
The emitter object also has a `playing` property that will be either 
`true` or `false` depending on the emitter’s current state. (See the
`particleEmitter.html` file in the `examples` folder for more details
on how to create and use a particle emitter.)

A particle emitter is used in Flappy Fairy to make the fairy emit a 
stream of multicolored particles while she’s flapping her wings. The 
particles are constrained to an angle between 2.4 and 3.6 radians, so 
they’re emitted in a cone-shaped wedge to the left of the fairy. 

![Emitting fairy dust](/tutorials/screenshots/28.png)

The particle stream randomly emits pink, yellow, green, or violet 
particles, each of which is a separate frame on the texture atlas.

Here's the code that creates this effect: 
```js
dustFrames = [
  "pink.png",
  "yellow.png",
  "green.png",
  "violet.png"
];

//Create the emitter
dust = g.particleEmitter(
  300,                                   //The interval
  () => {                         
      g.createParticles(                 //The function
      fairy.x + 8,                       //x position
      fairy.y + fairy.halfHeight + 8,    //y position
      () => g.sprite(dustFrames),        //Particle sprite
      g.stage,                           //The container to add the particles to               
      3,                                 //Number of particles
      0,                                 //Gravity
      true,                              //Random spacing
      2.4, 3.6,                          //Min/max angle
      12, 18,                            //Min/max size
      1, 2,                              //Min/max speed
      0.005, 0.01,                       //Min/max scale speed
      0.005, 0.01,                       //Min/max alpha speed
      0.05, 0.1                          //Min/max rotation speed
    );
  }
);
```
You can now control the `dust` emitter with `play` and `stop` methods.

<a id='creatingandmovingthepillars'></a>
####Creating and moving the pillars

You now know how Flappy Fairy implements some of Hexi's special features
for some fun and useful effects. But, if you're new to game
programming, you might also be wondering how the world that Flappy Fairy flies
through was created. Let's take a quick look at the code that creates
and moves the green pillars that the fairy has to navigate to reach
the Finish sign.

There are fifteen green pillars in the game. Every five pillars, the 
gap between the top and bottom sections becomes narrower. The first five 
pillars have a gap of four blocks, the next five have a gap of three blocks 
and the last five have a gap of two blocks. This makes the game increasingly 
difficult as Flappy Fairy flies further. The exact position of the gap is 
random for each pillar, and different every time game is played. Each pillar 
is spaced by 384 pixels, and here's how they would look like if 
they were right next to each other.

![The green pillars](/tutorials/screenshots/29.png)

You can see how the gap gradually narrows from four spaces on the left 
down to two on the right. 

All the blocks that make up the pillars are in a `group` called
`blocks`.
```js
blocks = g.group();
```
A nested for loop creates each block and adds it to the `blocks` container. 
The outer loop runs 15 times; once to create each pillar. The inner loop 
runs eight times; once for each block in the pillar. The blocks are only 
added if they’re not occupying the range that’s been randomly chosen for 
the gap. Every fifth time the outer loop runs, the size of the gap narrows by one.
```js
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
```
The last part of the code adds the big `finish` sprite to the world, which 
Flappy Fairy will see if she manages to make it through to the end.

The game loop moves the group of blocks by 2 pixels to the right each 
frame, but only while the finish sprite is off-screen:
```js
if (finish.gx > 256) {
  blocks.x -= 2;
}
```
When the `finish` sprite scrolls into the center of the canvas, the 
`blocks` container will stop moving. Notice that the code uses the 
`finish` sprite’s global x position (`gx`) to test whether it’s inside 
the area of the canvas. Because global coordinates are relative to 
the canvas, not the parent container, they’re really useful for 
just these kinds of situations where you want to want to find a 
nested sprite’s position on the canvas.

Make sure you check out the complete Flappy Fairy source code in the
`examples` folder so that you can see all this code in its proper context.

<a id='htmlIntegration'></a>
#Integration with HTML and CSS

Hexi works seamlessly with HTML and CSS. You can freely mix Hexi sprites and
code with HTML elements, and use Hexi's architecture to build an HTML
based application. And, you can use HTML to build a rich user
interface for your Hexi games.

How does it work? Hexi takes a completely hands-off approach. Just write plain old HTML and CSS, however you like,
and then reference your HTML in your Hexi code. That's all! Hexi
doesn't re-invent the wheel, so you can write as much low level HTML/CSS code you like and blend it 
into your Hexi application however you choose.

You can find a working example in the [`html` folder in Hexi's `examples`](https://github.com/kittykatattack/hexi/tree/master/examples/38_html) in this code repository.
It's a simple number guessing game:

![Number guessing game](/tutorials/screenshots/32.png)

The gray box that contains the button and text input field are HTML
elements. Those HTML elements, including the button, are completely styled
using CSS. The dynamic text and images are Hexi sprites. 

There's also
an invisible `<div>` element that's exactly the same size, and in
exactly the same position, as Hexi's canvas. The big `<div>` element
floats over the canvas and contains the gray box, button and input
field. 

Let's take a quick look at how this works. The `main.html` file looks like
this:
```html
<!doctype html>
<meta charset="utf-8">
<title>Html integration</title>
<link rel="stylesheet" href="style.css">
<body>

<!-- UI -->
<div id="ui">
  <div id="box">
    <button>Guess!</button>
    <input id="input" type="text" placeholder="X..." maxlength="10" autofocus>
  <div>
</div>

<!-- Hexi -->
<script src="../../src/modules/pixi.js/bin/pixi.js"></script>
<script src="../../bin/modules.js"></script>
<script src="../../bin/core.js"></script>

<!-- Main application file -->
<script src="main.js"></script>
</body>
```
The important part is the `UI` section, just below the `<body>` tag. A
`div` with the id `ui` is used to enclose the box, button and input.

The magic happens in the `style.css` file. Here's the most important
part:
```css
canvas
  { position : relative
  }

#ui
  { position : absolute
  ; left : 0
  ; top : 0
  ; width : 512px
  ; height : 512px

  /*Important: set the z-index to 1 so that it appears above Hexi's canvas*/
  ; z-index: 1
  }
```
Hexi's `canvas` is set to `relative` and the `ui` div is set to
`absolute`. `ui` is also set to **exactly** the same width and height, `512px`,
as Hexi's canvas. Very importantly, `ui` has a `z-index` of `1`
to force it to display above the canvas. The other HTML elements (the
box, button, and input field) are all positioned absolutely relative
to the `ui` div - check the full CSS code for details.

To access the button and input field in your Hexi code, just create
references to them in Hexi's `setup` function:
```js
function setup() {

  //Html elements
  var button = document.querySelector("button");
  button.addEventListener("click", buttonClickHandler, false);
  var input = document.querySelector("#input");

  //...The rest of the setup code creates Hexi sprites...
```
Then just create an ordinary function to handle the button clicks,
like this:
```js
function buttonClickHandler(event) {

  //Capture the player's input from the HTML text input field
  if (input.value) playersGuess = parseInt(input.value);

  //...the rest of the code...
}
```
`input.value` gives you access to whatever the user entered in the
input field. This is just plain old vanilla Web API code - nothing
special!. You can use that value to change any Hexi sprite properties.
Take a look at the source code for details, but there are no surprises.

But the example code does have one trick up it's sleeve. The entire Hexi
application scales up and aligns itself inside the browser. That means
both Hexi's canvas and the UI div scale up **and** stay aligned. They
even re-scale and re-align if the user changes the size of the browser window. How
does that work? Here's the JavaScript code that does this (in the `main.js`
file, just after Hexi's standard initialization code):
```js
//Scale Hexi's canvas
g.scaleToWindow();

//Scale the html UI <div> container
scaleToWindow(document.querySelector("#ui"));
window.addEventListener("resize", function(event){ 
  scaleToWindow(document.querySelector("#ui"));
});
```
Hexi's canvas is scaled internally by the Hexi engine, but the UI layer
is scaled using the global `scaleToWindow` function. (You can find out
about the `scaleToWindow` function [here](https://github.com/kittykatattack/scaleToWindow).)

This loose integration between HTML and Hexi means you're free to customize this however you
like. You can do crazy low-level HTML/CSS programming if you want to, mix the logic in 
with your Hexi sprites, and design any kind of custom layout that you
need. It's just HTML! And, yes, you can write your HTML
with Angular, React or [Elm](http://elm-lang.org) (Go Elm!!) if you want to.

<a id='aguidetotheexamples'></a>
#Coming soon: A guide to the examples






