![Hexi](/tutorials/screenshots/hexiLogo_256x256.png)![Hexi](/tutorials/screenshots/hexiIllustration.png)

Hexi
====

*Hexi* is a complete system for making HTML5 games or any other
kind interactive media. Take a look at the feature list and the `examples` folder to get
started. Keep scrolling, and you'll find a complete beginner's
tutorial ahead. If you've never made a game before, the tutorials are
the best place to start.

### Table of contents:
1. [Features](#features)
2. [Tutorials](#tutorials)

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
- Use `scaleToWindow` to make the game automatically scale to its maximum size and align itself for the best fit inside the browser window. Use `enableFullscreen` to make the browser enter full screen mode.

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

<a id='tutorials'></a>
Tutorials
---------

Coming Soon!
