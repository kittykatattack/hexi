"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
Hexi
====

Welcome to Hexi's source code!
This file, `core.js` is the glue that holds Hexi together. Most of Hexi's functionality comes
from some external libraries, written for Hexi, that `core.js` instantiates and wires
together. Here are the external libraries that Hexi is currently using:

- [Pixi](https://github.com/pixijs/pixi.js/): The world's fastest 2D WebGL and canvas renderer.
- [Bump](https://github.com/kittykatattack/bump): A complete suite of 2D collision functions for games.
- [Tink](https://github.com/kittykatattack/tink): Drag-and-drop, buttons, a universal pointer and other
  helpful interactivity tools.
- [Charm](https://github.com/kittykatattack/charm): Easy-to-use tweening animation effects for Pixi sprites.
- [Dust](https://github.com/kittykatattack/dust): Particle effects for creating things like explosions, fire
  and magic.
- [Sprite Utilities](https://github.com/kittykatattack/spriteUtilities): Easier and more intuitive ways to
  create and use Pixi sprites, as well adding a state machine and animation player
- [Game Utilities](https://github.com/kittykatattack/gameUtilities): A collection of useful methods for games.
- [Tile Utilities](https://github.com/kittykatattack/tileUtilities): A collection of useful methods for making tile-based game worlds with [Tiled Editor](http://www.mapeditor.org).
- [Sound.js](https://github.com/kittykatattack/sound.js): A micro-library for loading, controlling and generating
  sound and music effects. Everything you need to add sound to games.
- [fullScreen.js](https://github.com/kittykatattack/fullScreen): Adds an easy-to-implement full screen feature.
- [Smoothie](https://github.com/kittykatattack/smoothie): Ultra-smooth sprite animation using
  true delta-time interpolation. It also lets you specify the fps (frames-per-second) at which
  your game or application runs, and completely separates your sprite rendering loop from your
  application logic loop.

The job of `core.js` (this file!) is to instantiate Hexi, load the assets, start the game loop, and
create top-level access to most of the properties and methods in the external libraries.
It also customizes some of those methods and runs them with some useful side-effects, such as
automatically adding sprites to Hexi's `stage`. (Hexi's `stage` is the root Pixi `Container` for the display list.)

I've divided this `core.js` file into "Chapters" which describes what each major section of code does.
You'll find a "Table of Contents" ahead, which is your guide to this file.
All this code is fully commented, but if there's something you don't understand, please ask
in this repository's Issues and we will do our best to help. All this code is in one single file for now, just for the sake of simplicity,
until the total scope of this project stabilizes.

Hexi's build system
-------------------

All of Hexi's source code is written in JavaScript ES6, transpiled to ES5 using Babel, and minified using Uglify2.
Make is currently being used as the build
system. So, to build Hexi, make sure you have Node, Babel and Uglify2 installed, and call `make` in the
command line from Hexi's root directory. Make will compile the `core.js` file, concatenate all files (including
the modules) and produce the `hexi.min.js` file using Uglify2.

You can also use Make to build individual sections of Hexi's code base.
If you just want to watch and compile the core.js file from ES6 to ES5, run:

   make watchSrc

If you want to concatenate all the modules, run:

  make concatModules

If you want to concatenate all the files, run:

  make concatAllFiles

To watch and compile the example files from ES6 to ES5, run:

  make watchExamples

To watch and compile the tutorial files from ES6 to ES5, run:

  make watchTutorials

If anyone reading this wishes to contribute a simpler, more automated system using Grunt of Gulp,
we would welcome the contribution!

Table of Contents
-----------------

Here's your handy guide to this `core.js` file.

1. Setup and instantiation.
2. The `Hexi` class constructor.
3. Hexi's engine: `start`, `load` and `update` methods.
4. Module interfaces: Hexi's top-level access to the module properties and methods.
5. Sprite creation methods: `sprite`, `tilingSprite`, `text`, `bitmapText`, `rectangle`, `circle`, `line`, `button`.
6. Display utilities: `group`, `batch`, `grid`, `makeTiledWorld`, `remove`, `flowRight`, `flowDown`, `flowLeft`, `flowUp`.
7. Sprite properties: Hexi's custom sprite properties (also known as super-powers!).
8. Utilities: `scaleToWindow`, `log`, `makeProgressBar`, `loadingBar`, `compensateForStageSize`, `image`, `id`, `json`, `xml`, `sound`

*/

//1. SETUP AND INSTANTIATION
//---------------------------

//IMPORTANT: Make sure to load Pixi and the modules before instantiating Hexi!

//The high level `hexi` function lets you quickly create an instance
//of Hexi using sensible defaults.
function hexi(width, height, setup) {
  var thingsToLoad = arguments.length <= 3 || arguments[3] === undefined ? undefined : arguments[3];
  var load = arguments.length <= 4 || arguments[4] === undefined ? undefined : arguments[4];

  //If you need to, you can also instantiate Hexi with a configuration
  //object, which lets you fine-tune the options.
  var hexi = new Hexi({

    //Required options:
    width: width, //Width, in pixels
    height: height, //Height, in pixels
    setup: setup, //Function to run when Hexi starts

    //Optional options:
    assets: thingsToLoad, //Array of assets that should be loaded
    load: load, //Function to run while Hexi is loading asssets
    /*
    renderer: "auto",             //"auto", "canvas" or "webgl"
    backgroundColor: 0xCCCCCC,    //Hexadecimal color code
    border: "1px dashed black",   //CSS border string
    scaleToWindow: true,          //Boolean
    scaleBorderColor: "gray",     //Color string
    fps: 30,                      //The frames per second the logic loop should run at
     //An an object of Boolean (true/false) properties that describe which sprite
    //properties should  be smoothly animated. These can be any of 5
    //properties: `position`, `rotation`, `size`, `scale` or `alpha`.
    //(Position and rotation are on by default, unless you set Hexi's
    //`interpolate` property to `false`)
    */
    interpolationProperties: {
      position: true,
      rotation: true,
      size: true,
      alpha: true
    },
    interpolate: true

  });

  //To change PIXI's renderer, set the `renderer` option to
  //"auto", "canvas" or "webgl", like this:
  //renderer: "auto"
  //Add any other Pixi initialization options you need, depending
  //on which Pixi renderer you're using
  return hexi;
}

//The Hexi main class. It contains all of Hexi's properties and
//methods, and sets up bindings between Hexi and the module libraries.
//If you need more find control over Hexi's initialization options,
//you can create a new instance of the Hexi class directly in your application
//code. See how it's done in the `hexi` function above for a good example
//of how to do that.

//2. THE HEXI CLASS CONSTRUCTOR
//----------------------------

var Hexi = (function () {

  /*
  Initialize Hexi's constructor with an options object literal called `o`.
  Here are the required options:
   `width`: Value in pixels that describes the canvas's width
  `height`: Value in pixels that describes the canvas's height
  `setup`: A function that should run as soon as Hexi is initialized
   Here are the optional options:
   `assets`: Array of assets (files) that should be loaded
  `load`: A function that should run while Hexi is loading assets
  `renderer`: The type of renderer to use: "auto" (the default), "canvas" or "webgl"
  `backgroundColor`: Hexadecimal color code that defines the canvas color
  `border`: The canvas border style as a CSS border string, such as "1px dashed black"
  `scaleToWindow`: A Boolean that determines whether the canvas should scale to maximum window size.
  `scaleBorderColor`: Color string that defines the color of the border around a scaled canvas.
  `interpolationProperties: An object that defines 5 Boolean properties that determines which sprite properties are interpolated
                            (smoothly animated) by Hexi's rendering engine (Smoothie): `position`, `size`, `rotation`, `scale` or `alpha`
  `interpolate`: A Boolean which should be `false` if you *don't* want any sprite animation smoothing.
  `fps`: The frames-per-second the engine's game logic loop should run at (the default is 60).
  `renderFps`: Clamps the fps rendering to the supplied frame rate.
   You can also add any of Pixi's initialization options, and those will be applied
  to Pixi's renderer when Hexi creates it.
   */

  function Hexi(o) {
    _classCallCheck(this, Hexi);

    //Initialize all the helper modules.
    //(See Hexi's README.md on information about these libraries)
    this.charm = new Charm(PIXI);
    this.dust = new Dust(PIXI);
    this.bump = new Bump(PIXI);
    this.spriteUtilities = new SpriteUtilities(PIXI);
    this.tileUtilities = new TileUtilities(PIXI);
    this.gameUtilities = new GameUtilities();

    //Any modules that have an `update` method that should updated
    //each frame in the game loop should be added to the
    //`modulesToUpdate` array. The game loop will call the `update`
    //method on each of these modules while the game is running.
    //This is very efficient and does not effect performance: no modules are updated unless they
    //contain objects that need updating.
    this.modulesToUpdate = [];
    this.modulesToUpdate.push(this.charm);
    this.modulesToUpdate.push(this.dust);
    this.modulesToUpdate.push(this.spriteUtilities);

    //Create the stage and renderer
    //Auto renderer (default)
    if (o.renderer === "auto" || o.renderer === undefined) {
      this.renderer = PIXI.autoDetectRenderer(o.width, o.height, o, o.noWebGL);

      //Canvas renderer
    } else if (o.renderer === "canvas") {
        this.renderer = new PIXI.CanvasRenderer(o.width, o.height, o);

        //WebGL renderer
      } else if (o.renderer === "webgl") {
          this.renderer = new PIXI.WebGLRenderer(o.width, o.height, o);
        }

    //Get a reference to the `renderer.view`, which is the
    //HTML canvas element
    this.canvas = this.renderer.view;

    //Initialize the Tink interactive module (it needs a reference to the canvas)
    this.tink = new Tink(PIXI, this.canvas);
    this.modulesToUpdate.push(this.tink);

    //Create local aliases for the important methods and properties of
    //these libraries, including the most useful Pixi properties.
    //Take a look at Hexi's `createModulePropertyAliases` method in the
    //source code ahead to see how this works
    this.createModulePropertyAliases();

    //Add `halfWidth` and `halfHeight` properties to the canvas
    Object.defineProperties.bind(this, this.canvas, {
      "halfWidth": {
        get: function get() {
          return this.canvas.width / 2;
        },

        enumerable: true,
        configurable: true
      },
      "halfHeight": {
        get: function get() {
          return this.canvas.height / 2;
        },

        enumerable: true,
        configurable: true
      }
    });

    //A Boolean to flag whether the canvas has been scaled
    this.canvas.scaled = false;

    //Add the FullScreen module and supply it with the canvas element
    //this.fullScreen = new FullScreen(this.canvas);

    //Note: Hexi's `update` function checks whether we're in full screen
    //mode and updates the global scale value accordingly

    //Set the canvas's optional background color and border style
    if (o.backgroundColor) {
      this.renderer.backgroundColor = this.color(o.backgroundColor);
    } else {
      this.renderer.backgroundColor = 0xFFFFFF;
    }
    if (o.border) this.canvas.style.border = o.border;

    //Add the canvas to the HTML document
    document.body.appendChild(this.canvas);

    //Create a container object called the `stage`
    this.stage = new this.Container();

    //Add Hexi's special sprite properties to the stage
    this.addProperties(this.stage);
    this.stage._stage = true;

    //The game's scale
    if (o.scaleToWindow) {
      this.scaleToWindow(o.scaleBorderColor);
    } else {
      this.scale = 1;
    }

    //Make the pointer
    this.pointer = this.makePointer(this.canvas, this.scale);

    //Set the game `state`
    this.state = undefined;

    //Set the user-defined `load` and `setup` states
    if (o.load !== undefined) this.loadState = o.load;

    //The `setup` function is required, so throw an error if it's
    //missing
    if (!o.setup) {
      throw new Error("Please supply the setup option in the constructor to tell Hexi which function should run first when it starts.");
    } else {
      this.setupState = o.setup;
    }

    //A variable to track the current percentage of loading assets
    this.loadingProgress = 0;

    //A variable to track the currently loading asset
    this.loadingFile = "";

    //Load any assets if they've been provided
    if (o.assets !== undefined) {
      this.assetsToLoad = o.assets;
    }

    //Tell Hexi that we're not using a loading progress bar.
    //(This will be set to `true` if the user invokes the `loadingBar`
    //function, which you'll see ahead)
    this._progressBarAdded = false;

    //The `soundObjects` object is used to store all sounds
    this.soundObjects = {};

    //Create a new instance of Smoothie, which manages Hexi's game
    //loop and adds smooth sprite interpolation
    this.smoothie = new Smoothie({
      engine: PIXI,
      renderer: this.renderer,
      root: this.stage,
      update: this.update.bind(this),
      properties: o.interpolationProperties,
      interpolate: o.interpolate,
      fps: o.fps,
      renderFps: o.renderFps,
      properties: {
        position: true,
        scale: true,
        tile: true
      }
    });
  }

  //3. HEXI'S ENGINE: START, LOAD AND SETUP
  //---------------------------------------

  //The `start` method must be called by the user after Hexi has been
  //initialized to start the loading process and turn on the engine.

  _createClass(Hexi, [{
    key: "start",
    value: function start() {

      //If there are assets to load, load them, and set the game's state
      //to the user-defined `loadState` (which can be supplied by the user in the
      //constructor)
      if (this.assetsToLoad) {

        //Call Hexi's `load` method (ahead) to load the assets
        this.load(this.assetsToLoad, this.validateAssets);

        //After the assets have been loaded, a method called
        //`validateAssets` will run (see `validateAssets` ahead.)
        //`validateAssets` checks to see what has been loaded and,
        //in the case of sound files, decodes them and creates sound
        //objects.

        //If the user has supplied Hexi with a `load` function (in
        //Hexi's constructor), it will be assigned to Hexi's current
        //`state` and, as you'll see ahead, called in a loop while the
        //assets load
        if (this.loadState) this.state = this.loadState;
      } else {

        //If there's nothing to load, run the `setup` state, which will
        //just run once
        this.setupState();
      }

      //Start the game loop
      this.smoothie.start();
    }

    //Use the `load` method to load any files into Hexi. Pass it a
    //callback function as the second argument to launch a function that
    //should run when all the assets have finished loading. Hexi's
    //default callback function is `validateAssets`, which you'll find
    //in the code ahead

  }, {
    key: "load",
    value: function load(assetsToLoad) {
      var _this = this;

      var callbackFunction = arguments.length <= 1 || arguments[1] === undefined ? undefined : arguments[1];

      //Handle special file types that Pixi's loader doesn't understand
      //The `findAssets` function will return an array to get an array just
      //containing those file source paths you're interested in
      var findAssets = function findAssets(fileExtensionArray) {
        var fileSourcePaths = assetsToLoad.filter(function (source) {

          //Find the file extension of the asset
          var extension = source.split(".").pop();
          if (fileExtensionArray.indexOf(extension) !== -1) {
            return true;
          }
        });

        return fileSourcePaths;
      };

      /* Load fonts */

      //First, define the file extensions for the special file types
      //you're interested in
      //Fonts
      var fontExtensions = ["ttf", "otf", "ttc", "woff"];

      //Get the font source paths
      var fontFiles = findAssets(fontExtensions);

      //If there are any font files, load them into the browser using an
      //old trick that forces the browser to load them
      if (fontFiles.length > 0) {
        this.spanElements = [];
        fontFiles.forEach(function (source) {

          //Loads the font files by writing CSS code to the HTML document head.
          //Use the font's filename as the `fontFamily` name. This code captures
          //the font file's name without the extension or file path
          var fontFamily = source.split("/").pop().split(".")[0];

          //Push the font family name into Hexi's `fontFamilies` array
          if (_this.fontFamilies) _this.fontFamilies.push(fontFamily);

          //Append an `@afont-face` style rule to the head of the HTML document
          var newStyle = document.createElement("style");
          var fontFace = "@font-face {font-family: '" + fontFamily + "'; src: url('" + source + "');}";
          newStyle.appendChild(document.createTextNode(fontFace));
          document.head.appendChild(newStyle);

          //Trick the browser into loading the font file by
          //displaying an invisible element
          var span = document.createElement("span");
          span.style.fontFamily = fontFamily;
          document.body.appendChild(span);
          span.innerHTML = "?";
          span.style.display = "block";
          span.style.opacity = "0";
          _this.spanElements.push(span);
        });
      }

      /* Load sound */

      //Set default loading mechanism for sound file extensions to use XHR
      var Resource = PIXI.loaders.Resource;
      Resource.setExtensionLoadType("wav", Resource.LOAD_TYPE.XHR);
      Resource.setExtensionLoadType("mp3", Resource.LOAD_TYPE.XHR);
      Resource.setExtensionLoadType("ogg", Resource.LOAD_TYPE.XHR);
      Resource.setExtensionLoadType("webm", Resource.LOAD_TYPE.XHR);

      //Set default loading type for sound file extensions to be arraybuffer
      Resource.setExtensionXhrType("wav", Resource.XHR_RESPONSE_TYPE.BUFFER);
      Resource.setExtensionXhrType("mp3", Resource.XHR_RESPONSE_TYPE.BUFFER);
      Resource.setExtensionXhrType("ogg", Resource.XHR_RESPONSE_TYPE.BUFFER);
      Resource.setExtensionXhrType("webm", Resource.XHR_RESPONSE_TYPE.BUFFER);

      /* Load ordinary assets */

      var loadProgressHandler = function loadProgressHandler(loader, resource) {

        //Display the file `url` currently being loaded
        _this.loadingFile = resource.url;

        //Display the percentage of files currently loaded
        _this.loadingProgress = loader.progress;
      };

      //Load the files and call the `loadProgressHandler` while they're
      //loading
      this.loader.reset();
      this.loadingProgress = 0;
      this.loadingFile = "";
      this.loader.add(assetsToLoad).on("progress", loadProgressHandler).load(callbackFunction.bind(this));
    }

    //The `validateAssets` method runs when all the assets have finished
    //loading. It checks to see if there are any sounds files and, if
    //there are, decodes them and turns them into sound objects using the
    //`sounds.js` module's `makeSound` function. If there are no sounds
    //to load, the loading state is finished and the setup state is run.
    //But, if there are sounds to load, the setup state will only run
    //after the sounds have been decoded.

  }, {
    key: "validateAssets",
    value: function validateAssets() {
      var _this2 = this;

      console.log("All assets loaded");

      //The `finishLoadingState` method will be called if everything has
      //finished loading and any possible sounds have been decoded
      var finishLoadingState = function finishLoadingState() {

        //Reset the `assetsToLoad` array
        _this2.assetsToLoad = [];

        //Clear the `loadState`
        _this2.loadState = undefined;

        //Clear the game `state` function for now to stop the loop.
        _this2.state = undefined;

        //Remove the loading progress bar if the user invoked the `loadingBar`
        //function
        if (_this2._progressBarAdded) {
          _this2.progressBar.remove();
        }

        //If any fonts were tricked into loading
        //make the <span> tags that use them invisible
        if (_this2.spanElements) {
          _this2.spanElements.forEach(function (element) {
            element.style.display = "none";
          });
        }

        //Call the `setup` state
        _this2.setupState();
      };

      //We need to check if any possible sound file have been loaded
      //because, if there have, they need to fist be decoded before we
      //can launch the `setup` state.

      //Variables to count the number of sound files and the sound files
      //that have been decoded. If both these numbers are the same at
      //some point, then we know all the sounds have been decoded and we
      //can call the `finishLoadingState` function
      var soundsToDecode = 0,
          soundsDecoded = 0;

      //First, create a list of the kind of sound files we want to check
      var soundExtensions = ["wav", "mp3", "ogg", "webm"];

      //The `decodeHandler` will run when each sound file is decoded
      var decodeHandler = function decodeHandler() {

        //Count 1 more sound as having been decoded
        soundsDecoded += 1;

        //If the decoded sounds match the number of sounds to decode,
        //then we know all the sounds have been decoded and we can call
        //`finishLoadingState`
        if (soundsToDecode === soundsDecoded) {
          finishLoadingState();
        }
      };

      //Loop through all the loader's resources and look for sound files
      Object.keys(this.loader.resources).forEach(function (resource) {

        //Find the file extension of the asset
        var extension = resource.split(".").pop();

        //If one of the resource file extensions matches the sound file
        //extensions, then we know we have a sound file
        if (soundExtensions.indexOf(extension) !== -1) {

          //Count one more sound to load
          soundsToDecode += 1;

          //Create aliases for the sound's `xhr` object and `url` (its
          //file name)
          var xhr = _this2.loader.resources[resource].xhr,
              url = _this2.loader.resources[resource].url;

          //Create a sound sprite using the `sound.js` module's
          //`makeSound` function. Notice the 4th argument is the loaded
          //sound's `xhr` object. Setting the 3rd argument to `false`
          //means that `makeSound` won't attempt to load the sounds
          //again. When the sound has been decoded, the `decodeHandler`
          //(see above!) will be run
          var soundSprite = makeSound(url, decodeHandler.bind(_this2), false, xhr);

          //Get the sound file name.
          soundSprite.name = _this2.loader.resources[resource].name;

          //Add the sound object to Hexi's `soundObjects` object.
          //You'll be able to access them in your application through
          //Hexi's higher-level `sound` method, like this:
          //`hexi.sound("soundFileName.wav");`
          _this2.soundObjects[soundSprite.name] = soundSprite;
        }
      });

      //If there are no sound files, we can skip the decoding step and
      //just call `finishLoadingState` directly
      if (soundsToDecode === 0) {
        finishLoadingState();
      }
    }

    //The `update` method is run by Hexi's game loop each frame.
    //It manages the game state and updates the modules

  }, {
    key: "update",
    value: function update() {

      //Update all the modules in the `modulesToUpdate` array.
      //These are modules that contain `update` methods that need to be
      //called every frame
      this.modulesToUpdate.forEach(function (module) {
        return module.update();
      });
      //If the application is in full screen mode, make sure that Hexi
      //is using the correct scale value
      /*
      if (document.fullscreenEnabled === true) {
        console.log("fullscreenEnabled")
         //Note: Check Firefox's current FullScreen API and specifically:
        //https://github.com/neovov/Fullscreen-API-Polyfill/blob/master/fullscreen-api-polyfill.js
        //if (this.fullScreen.fullscreenScale !== 1) {
        this.scale = this.fullScreen.fullscreenScale;
        //console.log("this.fullScreen.fullscreenScale: " + this.fullScreen.fullscreenScale)
        this.pointer.scale = this.scale;
        //Find out if the pointer scale is propagating to Tink's pointer?
        console.log(this.pointer.scale)
      } else {
        if (!this.canvas.scaled) {
          this.scale = 1;
          this.pointer.scale = 1;
        }
      }
      */

      //Run the current game `state` function if it's been defined and
      //the game isn't `paused`
      if (this.state && !this.paused) {
        this.state();
      }
    }

    //Pause and resume methods

  }, {
    key: "pause",
    value: function pause() {
      this.paused = true;
    }
  }, {
    key: "resume",
    value: function resume() {
      this.paused = false;
    }

    //4. MODULE INTERFACES

    //A method that helpfully creates local, top-level references to the
    //most useful properties and methods from the loaded modules

  }, {
    key: "createModulePropertyAliases",
    value: function createModulePropertyAliases() {
      var _this3 = this;

      //Pixi - Rendering
      this.Container = PIXI.Container;
      this.loader = PIXI.loader;
      this.TextureCache = PIXI.utils.TextureCache;
      this.filters = PIXI.filters;
      //Filters
      this.dropShadowFilter = function () {
        return new _this3.filters.DropShadowFilter();
      };
      this.asciiFilter = function () {
        return new _this3.filters.AsciiFilter();
      };
      this.alphaMaskFilter = function () {
        return new _this3.filters.AlphaMaskFilter();
      };
      this.bloomFilter = function () {
        return new _this3.filters.BloomFilter();
      };
      this.blurDirFilter = function () {
        return new _this3.filters.BlurDirFilter();
      };
      this.blurFilter = function () {
        return new _this3.filters.BlurFilter();
      };
      this.colorMatrixFilter = function () {
        return new _this3.filters.ColorMatrixFilter();
      };
      this.colorStepFilter = function () {
        return new _this3.filters.ColorStepFilter();
      };
      this.crossHatchFilter = function () {
        return new _this3.filters.CrossHatchFilter();
      };
      this.displacementFilter = function () {
        return new _this3.filters.DisplacementFilter();
      };
      this.dotScreenFilter = function () {
        return new _this3.filters.DotScreenFilter();
      };
      this.grayFilter = function () {
        return new _this3.filters.GrayFilter();
      };
      this.invertFilter = function () {
        return new _this3.filters.InvertFilter();
      };
      this.pixelateFilter = function () {
        return new _this3.filters.PixelateFilter();
      };
      this.sepiaFilter = function () {
        return new _this3.filters.SepiaFilter();
      };
      this.shockwaveFilter = function () {
        return new _this3.filters.ShockwaveFilter();
      };
      this.twistFilter = function () {
        return new _this3.filters.TwistFilter();
      };
      this.rgbSplitFilter = function () {
        return new _this3.filters.RGBSplitFilter();
      };
      this.smartBlurFilter = function () {
        return new _this3.filters.SmartBlurFilter();
      };
      this.tiltShiftFilter = function () {
        return new _this3.filters.TiltShiftFilter();
      };

      //Tink - Interactivity
      this.draggableSprites = this.tink.draggableSprites;
      this.pointers = this.tink.pointers;
      this.buttons = this.tink.buttons;
      this.makePointer = function (canvas, scale) {
        return _this3.tink.makePointer(canvas, scale);
      };
      this.makeDraggable = function () {
        var _tink;

        return (_tink = _this3.tink).makeDraggable.apply(_tink, arguments);
      };
      this.makeUndraggable = function () {
        var _tink2;

        return (_tink2 = _this3.tink).makeUndraggable.apply(_tink2, arguments);
      };
      this.makeInteractive = function (o) {
        return _this3.tink.makeInteractive(o);
      };
      this.keyboard = this.tink.keyboard;
      this.arrowControl = function (sprite, speed) {
        return _this3.tink.arrowControl(sprite, speed);
      };

      //Add the arrow key objects
      /*
      this.upArrow = this.keyboard(38);
      this.rightArrow = this.keyboard(39);
      this.downArrow = this.keyboard(40);
      this.leftArrow = this.keyboard(37);
      this.spaceBar = this.keyboard(32);
      */

      //Dust - Particle effects
      this.createParticles = function (x, y, spriteFunction, container, numberOfParticles, gravity, randomSpacing, minAngle, maxAngle, minSize, maxSize, minSpeed, maxSpeed, minScaleSpeed, maxScaleSpeed, minAlphaSpeed, maxAlphaSpeed, minRotationSpeed, maxRotationSpeed) {
        return _this3.dust.create(x, y, spriteFunction, container, numberOfParticles, gravity, randomSpacing, minAngle, maxAngle, minSize, maxSize, minSpeed, maxSpeed, minScaleSpeed, maxScaleSpeed, minAlphaSpeed, maxAlphaSpeed, minRotationSpeed, maxRotationSpeed);
      };
      this.particleEmitter = function (interval, particleFunction) {
        return _this3.dust.emitter(interval, particleFunction);
      };

      //SpriteUtilities - Sprite creation tools
      this.filmstrip = function (texture, frameWidth, frameHeight, spacing) {
        return _this3.spriteUtilities.filmstrip(texture, frameWidth, frameHeight, spacing);
      };
      this.frame = function (source, x, y, width, height) {
        return _this3.spriteUtilities.frame(source, x, y, width, height);
      };
      this.frames = function (source, coordinates, frameWidth, frameHeight) {
        return _this3.spriteUtilities.frames(source, coordinates, frameWidth, frameHeight);
      };
      this.frameSeries = function (startNumber, endNumber, baseName, extension) {
        return _this3.spriteUtilities.frames(startNumber, endNumber, baseName, extension);
      };
      this.colorToRGBA = function (value) {
        return _this3.spriteUtilities.colorToRGBA(value);
      };
      this.colorToHex = function (value) {
        return _this3.spriteUtilities.colorToHex(value);
      };
      this.byteToHex = function (value) {
        return _this3.spriteUtilities.byteToHex(value);
      };
      this.color = function (value) {
        return _this3.spriteUtilities.color(value);
      };
      this.shoot = function (shooter, angle, x, y, container, bulletSpeed, bulletArray, bulletSprite) {
        return _this3.spriteUtilities.shoot(shooter, angle, x, y, container, bulletSpeed, bulletArray, bulletSprite);
      };
      this.shake = function (sprite) {
        var magnitude = arguments.length <= 1 || arguments[1] === undefined ? 16 : arguments[1];
        var angular = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

        console.log("shake");
        return _this3.spriteUtilities.shake(sprite, magnitude, angular);
      };

      //Charm - Tweening
      this.fadeOut = function (sprite) {
        var frames = arguments.length <= 1 || arguments[1] === undefined ? 60 : arguments[1];
        return _this3.charm.fadeOut(sprite, frames);
      };
      this.fadeIn = function (sprite) {
        var frames = arguments.length <= 1 || arguments[1] === undefined ? 60 : arguments[1];
        return _this3.charm.fadeIn(sprite, frames);
      };
      this.pulse = function (sprite) {
        var frames = arguments.length <= 1 || arguments[1] === undefined ? 60 : arguments[1];
        var minAlpha = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];
        return _this3.charm.pulse(sprite, frames, minAlpha);
      };
      this.slide = function (sprite, endX, endY) {
        var frames = arguments.length <= 3 || arguments[3] === undefined ? 60 : arguments[3];
        var type = arguments.length <= 4 || arguments[4] === undefined ? "smoothstep" : arguments[4];
        var yoyo = arguments.length <= 5 || arguments[5] === undefined ? false : arguments[5];
        var delayBeforeRepeat = arguments.length <= 6 || arguments[6] === undefined ? 0 : arguments[6];

        return _this3.charm.slide(sprite, endX, endY, frames, type, yoyo, delayBeforeRepeat = 0);
      };
      this.breathe = function (sprite) {
        var endScaleX = arguments.length <= 1 || arguments[1] === undefined ? 0.8 : arguments[1];
        var endScaleY = arguments.length <= 2 || arguments[2] === undefined ? 0.8 : arguments[2];
        var frames = arguments.length <= 3 || arguments[3] === undefined ? 60 : arguments[3];
        var yoyo = arguments.length <= 4 || arguments[4] === undefined ? true : arguments[4];
        var delayBeforeRepeat = arguments.length <= 5 || arguments[5] === undefined ? 0 : arguments[5];

        return _this3.charm.breathe(sprite, endScaleX, endScaleY, frames, yoyo, delayBeforeRepeat);
      };
      this.scale = function (sprite) {
        var endScaleX = arguments.length <= 1 || arguments[1] === undefined ? 0.5 : arguments[1];
        var endScaleY = arguments.length <= 2 || arguments[2] === undefined ? 0.5 : arguments[2];
        var frames = arguments.length <= 3 || arguments[3] === undefined ? 60 : arguments[3];
        return _this3.charm.scale(sprite, endScaleX, endScaleY, frames);
      };
      this.strobe = function (sprite) {
        var scaleFactor = arguments.length <= 1 || arguments[1] === undefined ? 1.3 : arguments[1];
        var startMagnitude = arguments.length <= 2 || arguments[2] === undefined ? 10 : arguments[2];
        var endMagnitude = arguments.length <= 3 || arguments[3] === undefined ? 20 : arguments[3];
        var frames = arguments.length <= 4 || arguments[4] === undefined ? 10 : arguments[4];
        var yoyo = arguments.length <= 5 || arguments[5] === undefined ? true : arguments[5];
        var delayBeforeRepeat = arguments.length <= 6 || arguments[6] === undefined ? 0 : arguments[6];

        return _this3.charm.strobe(sprite, scaleFactor, startMagnitude, endMagnitude, frames, yoyo, delayBeforeRepeat);
      };
      this.wobble = function (sprite) {
        var scaleFactorX = arguments.length <= 1 || arguments[1] === undefined ? 1.2 : arguments[1];
        var scaleFactorY = arguments.length <= 2 || arguments[2] === undefined ? 1.2 : arguments[2];
        var frames = arguments.length <= 3 || arguments[3] === undefined ? 10 : arguments[3];
        var xStartMagnitude = arguments.length <= 4 || arguments[4] === undefined ? 10 : arguments[4];
        var xEndMagnitude = arguments.length <= 5 || arguments[5] === undefined ? 10 : arguments[5];
        var yStartMagnitude = arguments.length <= 6 || arguments[6] === undefined ? -10 : arguments[6];
        var yEndMagnitude = arguments.length <= 7 || arguments[7] === undefined ? -10 : arguments[7];
        var friction = arguments.length <= 8 || arguments[8] === undefined ? 0.98 : arguments[8];
        var yoyo = arguments.length <= 9 || arguments[9] === undefined ? true : arguments[9];
        var delayBeforeRepeat = arguments.length <= 10 || arguments[10] === undefined ? 0 : arguments[10];

        return _this3.charm.wobble(sprite, scaleFactorX = 1.2, scaleFactorY = 1.2, frames = 10, xStartMagnitude = 10, xEndMagnitude = 10, yStartMagnitude = -10, yEndMagnitude = -10, friction = 0.98, yoyo = true, delayBeforeRepeat = 0);
      };
      this.followCurve = function (sprite, pointsArray, totalFrames) {
        var type = arguments.length <= 3 || arguments[3] === undefined ? "smoothstep" : arguments[3];
        var yoyo = arguments.length <= 4 || arguments[4] === undefined ? false : arguments[4];
        var delayBeforeRepeat = arguments.length <= 5 || arguments[5] === undefined ? 0 : arguments[5];

        return _this3.charm.followCurve(sprite, pointsArray, totalFrames, type, yoyo, delayBeforeRepeat);
      };
      this.walkPath = function (sprite, originalPathArray) {
        var totalFrames = arguments.length <= 2 || arguments[2] === undefined ? 300 : arguments[2];
        var type = arguments.length <= 3 || arguments[3] === undefined ? "smoothstep" : arguments[3];
        var loop = arguments.length <= 4 || arguments[4] === undefined ? false : arguments[4];
        var yoyo = arguments.length <= 5 || arguments[5] === undefined ? false : arguments[5];
        var delayBetweenSections = arguments.length <= 6 || arguments[6] === undefined ? 0 : arguments[6];

        return _this3.charm.walkPath(sprite, originalPathArray, totalFrames, type, loop, yoyo, delayBetweenSections);
      };
      this.walkCurve = function (sprite, pathArray) {
        var totalFrames = arguments.length <= 2 || arguments[2] === undefined ? 300 : arguments[2];
        var type = arguments.length <= 3 || arguments[3] === undefined ? "smoothstep" : arguments[3];
        var loop = arguments.length <= 4 || arguments[4] === undefined ? false : arguments[4];
        var yoyo = arguments.length <= 5 || arguments[5] === undefined ? false : arguments[5];
        var delayBeforeContinue = arguments.length <= 6 || arguments[6] === undefined ? 0 : arguments[6];

        return _this3.charm.walkCurve(sprite, pathArray, totalFrames, type, loop, yoyo, delayBeforeContinue);
      };
      this.removeTween = function (tweenObject) {
        return _this3.charm.removeTween(tweenObject);
      };
      this.makeTween = function (tweensToAdd) {
        return _this3.charm.makeTween(tweensToAdd);
      };
      this.tweenProperty = function (sprite, property, startValue, endValue, totalFrames) {
        var type = arguments.length <= 5 || arguments[5] === undefined ? "smoothstep" : arguments[5];
        var yoyo = arguments.length <= 6 || arguments[6] === undefined ? false : arguments[6];
        var delayBeforeRepeat = arguments.length <= 7 || arguments[7] === undefined ? 0 : arguments[7];

        return _this3.charm.tweenProperty(sprite, property, startValue, endValue, totalFrames, type, yoyo, delayBeforeRepeat);
      };

      //Bump - Collision
      this.hitTestPoint = function (point, sprite) {
        return _this3.bump.hitTestPoint(point, sprite);
      };
      this.hitTestCircle = function (c1, c2) {
        var global = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];
        return _this3.bump.hitTestCircle(c1, c2, global);
      };
      this.circleCollision = function (c1, c2) {
        var bounce = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];
        var global = arguments.length <= 3 || arguments[3] === undefined ? false : arguments[3];
        return _this3.bump.circleCollision(c1, c2, bounce, global);
      };
      this.movingCircleCollision = function (c1, c2) {
        var global = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];
        return _this3.bump.movingCircleCollision(c1, c2, global);
      };
      this.multipleCircleCollision = function (arrayOfCircles) {
        var global = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
        return _this3.bump.multipleCircleCollision(arrayOfCircles, global);
      };
      this.rectangleCollision = function (r1, r2) {
        var bounce = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];
        var global = arguments.length <= 3 || arguments[3] === undefined ? true : arguments[3];
        return _this3.bump.rectangleCollision(r1, r2, bounce, global);
      };
      this.hitTestRectangle = function (r1, r2) {
        var global = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];
        return _this3.bump.hitTestRectangle(r1, r2, global);
      };
      this.hitTestCircleRectangle = function (c1, r1) {
        var global = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];
        return _this3.bump.hitTestCircleRectangle(c1, r1, global);
      };
      this.hitTestCirclePoint = function (c1, point) {
        var global = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];
        return _this3.bump.hitTestCirclePoint(c1, point, global);
      };
      this.circleRectangleCollision = function (c1, r1) {
        var bounce = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];
        var global = arguments.length <= 3 || arguments[3] === undefined ? false : arguments[3];
        return _this3.bump.circleRectangleCollision(c1, r1, bounce, global);
      };
      this.circlePointCollision = function (c1, point) {
        var bounce = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];
        var global = arguments.length <= 3 || arguments[3] === undefined ? false : arguments[3];
        return _this3.bump.circlePointCollision(c1, point, bounce, global);
      };
      this.bounceOffSurface = function (o, s) {
        return _this3.bump.bounceOffSurface(o, s);
      };
      this.hit = function (a, b) {
        var react = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];
        var bounce = arguments.length <= 3 || arguments[3] === undefined ? false : arguments[3];
        var global = arguments[4];
        var extra = arguments.length <= 5 || arguments[5] === undefined ? undefined : arguments[5];
        return _this3.bump.hit(a, b, react, bounce, global, extra);
      };
      this.shortestPath = function (startIndex, destinationIndex, mapArray, mapWidthInTiles) {
        var obstacleGids = arguments.length <= 4 || arguments[4] === undefined ? [] : arguments[4];
        var heuristic = arguments.length <= 5 || arguments[5] === undefined ? "manhattan" : arguments[5];
        var useDiagonalNodes = arguments.length <= 6 || arguments[6] === undefined ? true : arguments[6];
        return _this3.tileUtilities.shortestPath(startIndex, destinationIndex, mapArray, mapWidthInTiles, obstacleGids, heuristic, useDiagonalNodes);
      };
      this.tileBasedLineOfSight = function (spriteOne, spriteTwo, mapArray, world) {
        var emptyGid = arguments.length <= 4 || arguments[4] === undefined ? 0 : arguments[4];
        var segment = arguments.length <= 5 || arguments[5] === undefined ? 32 : arguments[5];
        var angles = arguments.length <= 6 || arguments[6] === undefined ? [] : arguments[6];
        return _this3.tileUtilities.tileBasedLineOfSight(spriteOne, spriteTwo, mapArray, world, emptyGid, segment, angles);
      };

      //Intercept the Bump library's `contain` and `outsideBounds` methods to make sure that
      //the stage `width` and `height` match the canvas width and height
      this.contain = function (sprite, container) {
        var bounce = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];
        var extra = arguments.length <= 3 || arguments[3] === undefined ? undefined : arguments[3];

        var o = {};
        if (container._stage) {
          o = _this3.compensateForStageSize(container);
        } else {
          o = container;
        }
        return _this3.bump.contain(sprite, o, bounce, extra);
      };

      this.outsideBounds = function (sprite, container) {
        var extra = arguments.length <= 2 || arguments[2] === undefined ? undefined : arguments[2];

        var o = {};
        if (container._stage) {
          o = _this3.compensateForStageSize(container);
        } else {
          o = container;
        }
        return _this3.bump.outsideBounds(sprite, o, extra);
      };

      //GameUtilities - Useful utilities
      this.distance = function (s1, s2) {
        return _this3.gameUtilities.distance(s1, s2);
      };
      this.followEase = function (follower, leader, speed) {
        return _this3.gameUtilities.followEase(follower, leader, speed);
      };
      this.followConstant = function (follower, leader, speed) {
        return _this3.gameUtilities.followConstant(follower, leader, speed);
      };
      this.angle = function (s1, s2) {
        return _this3.gameUtilities.angle(s1, s2);
      };
      this.rotateAroundSprite = function (rotatingSprite, centerSprite, distance, angle) {
        return _this3.gameUtilities.rotateAroundSprite(rotatingSprite, centerSprite, distance, angle);
      };
      this.rotateAroundPoint = this.gameUtilities.rotateAroundPoint;
      this.randomInt = this.gameUtilities.randomInt;
      this.randomFloat = this.gameUtilities.randomFloat;
      this.move = this.gameUtilities.move;
      this.wait = this.gameUtilities.wait;
      this.worldCamera = function (world, worldWidth, worldHeight) {
        var canvas = arguments.length <= 3 || arguments[3] === undefined ? _this3.canvas : arguments[3];
        return _this3.gameUtilities.worldCamera(world, worldWidth, worldHeight, canvas);
      };
      this.lineOfSight = function (spriteOne, spriteTwo, obstacles) {
        var segment = arguments.length <= 3 || arguments[3] === undefined ? 32 : arguments[3];
        return _this3.gameUtilities.lineOfSight(spriteOne, spriteTwo, obstacles, segment);
      };

      //Sound.js - Sound
      this.soundEffect = function (frequencyValue, attack, decay, type, volumeValue, panValue, wait, pitchBendAmount, reverse, randomValue, dissonance, echo, reverb) {
        return soundEffect(frequencyValue, attack, decay, type, volumeValue, panValue, wait, pitchBendAmount, reverse, randomValue, dissonance, echo, reverb);
      };

      //FullScreen
      //this.enableFullScreen = (exitKeyCodes) => this.fullScreen.enableFullScreen(exitKeyCodes);

      //TileUtilities
      this.hitTestTile = function (sprite, mapArray, gidToCheck, world, pointsToCheck) {
        return _this3.tileUtilities.hitTestTile(sprite, mapArray, gidToCheck, world, pointsToCheck);
      };
      this.getIndex = function (x, y, tilewidth, tileheight, mapWidthInTiles) {
        return _this3.tileUtilities.getIndex(x, y, tilewidth, tileheight, mapWidthInTiles);
      };
      this.getTile = this.tileUtilities.getTile;
      this.surroundingCells = this.tileUtilities.surroundingCells;
      this.getPoints = this.tileUtilities.getPoints;
      this.updateMap = function (mapArray, spritesToUpdate, world) {
        return _this3.tileUtilities.updateMap(mapArray, spritesToUpdate, world);
      };
      this.byDepth = this.tileUtilities.byDepth;
      this.hitTestIsoTile = function (sprite, mapArray, gidToCheck, world, pointsToCheck) {
        return _this3.tileUtilities.hitTestIsoTile(sprite, mapArray, gidToCheck, world, pointsToCheck);
      };
      this.getIsoPoints = this.tileUtilities.getIsoPoints;
      this.makeIsoPointer = function (pointer, world) {
        return _this3.tileUtilities.makeIsoPointer(pointer, world);
      };
      this.isoRectangle = function (width, height, fillStyle) {
        return _this3.tileUtilities.isoRectangle(width, height, fillStyle);
      };
      this.addIsoProperties = function (sprite, x, y, width, height) {
        return _this3.tileUtilities.addIsoProperties(sprite, x, y, width, height);
      };
      this.makeIsoTiledWorld = function (jsonTiledMap, tileset) {
        return _this3.tileUtilities.makeIsoTiledWorld(jsonTiledMap, tileset);
      };
    }

    //Getters and setters

    //Pixi's loader resources

  }, {
    key: "sprite",

    //5. SPRITE CREATION METHODS

    //Hexi uses methods from the
    //SpriteUtilities module to help create sprites. But, as a helpful bonus, Hexi automatically adds sprites
    //to the `stage` container. (The `stage` is Hexi's root container for all
    //Hexi sprites.) Hexi also adds a whole bunch of
    //extra, useful properties and methods to sprites with the
    //`addProperties` method

    //Universal sprites
    value: function sprite(source) {
      var x = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
      var y = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];
      var tiling = arguments.length <= 3 || arguments[3] === undefined ? false : arguments[3];
      var width = arguments[4];
      var height = arguments[5];

      var o = this.spriteUtilities.sprite(source, x, y, tiling, width, height);
      this.addProperties(o);
      this.stage.addChild(o);
      return o;
    }

    //Tiling sprites

  }, {
    key: "tilingSprite",
    value: function tilingSprite(source, width, height) {
      var x = arguments.length <= 3 || arguments[3] === undefined ? 0 : arguments[3];
      var y = arguments.length <= 4 || arguments[4] === undefined ? 0 : arguments[4];

      var o = this.spriteUtilities.tilingSprite(source, width, height, x, y);
      this.addProperties(o);
      this.stage.addChild(o);
      return o;
    }

    //Hexi's `text` method is a quick way to create a Pixi Text sprite
    //and add it to the stage

  }, {
    key: "text",
    value: function text() {
      var content = arguments.length <= 0 || arguments[0] === undefined ? "message" : arguments[0];
      var font = arguments.length <= 1 || arguments[1] === undefined ? "16px sans" : arguments[1];
      var fillStyle = arguments.length <= 2 || arguments[2] === undefined ? "red" : arguments[2];
      var x = arguments.length <= 3 || arguments[3] === undefined ? 0 : arguments[3];
      var y = arguments.length <= 4 || arguments[4] === undefined ? 0 : arguments[4];

      var message = this.spriteUtilities.text(content, font, fillStyle, x, y);
      this.addProperties(message);
      this.stage.addChild(message);
      return message;
    }

    //The `bitmapText` method is a quick way to create a Pixi BitmapText sprite

  }, {
    key: "bitmapText",
    value: function bitmapText() {
      var content = arguments.length <= 0 || arguments[0] === undefined ? "message" : arguments[0];
      var font = arguments[1];
      var align = arguments[2];
      var tint = arguments[3];
      var x = arguments.length <= 4 || arguments[4] === undefined ? 0 : arguments[4];
      var y = arguments.length <= 5 || arguments[5] === undefined ? 0 : arguments[5];

      var message = this.spriteUtilities.bitmapText(content, font, align, tint, x, y);
      this.addProperties(message);
      this.stage.addChild(message);
      return message;
    }

    //Make a rectangle and add it to the stage

  }, {
    key: "rectangle",
    value: function rectangle() {
      var width = arguments.length <= 0 || arguments[0] === undefined ? 32 : arguments[0];
      var height = arguments.length <= 1 || arguments[1] === undefined ? 32 : arguments[1];
      var fillStyle = arguments.length <= 2 || arguments[2] === undefined ? 0xFF3300 : arguments[2];
      var strokeStyle = arguments.length <= 3 || arguments[3] === undefined ? 0x0033CC : arguments[3];
      var lineWidth = arguments.length <= 4 || arguments[4] === undefined ? 0 : arguments[4];
      var x = arguments.length <= 5 || arguments[5] === undefined ? 0 : arguments[5];
      var y = arguments.length <= 6 || arguments[6] === undefined ? 0 : arguments[6];

      var o = this.spriteUtilities.rectangle(width, height, fillStyle, strokeStyle, lineWidth, x, y);
      this.addProperties(o);
      this.stage.addChild(o);
      return o;
    }

    //Make a circle and add it to the stage

  }, {
    key: "circle",
    value: function circle() {
      var diameter = arguments.length <= 0 || arguments[0] === undefined ? 32 : arguments[0];
      var fillStyle = arguments.length <= 1 || arguments[1] === undefined ? 0xFF3300 : arguments[1];
      var strokeStyle = arguments.length <= 2 || arguments[2] === undefined ? 0x0033CC : arguments[2];
      var lineWidth = arguments.length <= 3 || arguments[3] === undefined ? 0 : arguments[3];
      var x = arguments.length <= 4 || arguments[4] === undefined ? 0 : arguments[4];
      var y = arguments.length <= 5 || arguments[5] === undefined ? 0 : arguments[5];

      var o = this.spriteUtilities.circle(diameter, fillStyle, strokeStyle, lineWidth, x, y);
      this.addProperties(o);

      //Add diameter and radius properties to the circle
      o.circular = true;
      this.stage.addChild(o);
      return o;
    }

    //Draw a line

  }, {
    key: "line",
    value: function line() {
      var strokeStyle = arguments.length <= 0 || arguments[0] === undefined ? 0x000000 : arguments[0];
      var lineWidth = arguments.length <= 1 || arguments[1] === undefined ? 1 : arguments[1];
      var ax = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];
      var ay = arguments.length <= 3 || arguments[3] === undefined ? 0 : arguments[3];
      var bx = arguments.length <= 4 || arguments[4] === undefined ? 32 : arguments[4];
      var by = arguments.length <= 5 || arguments[5] === undefined ? 32 : arguments[5];

      var o = this.spriteUtilities.line(strokeStyle, lineWidth, ax, ay, bx, by);
      this.addProperties(o);
      this.stage.addChild(o);
      return o;
    }

    //Make a button and add it to the stage

  }, {
    key: "button",
    value: function button(source, x, y) {
      var o = this.tink.button(source, x, y);
      this.addProperties(o);
      this.stage.addChild(o);
      return o;
    }

    //6. DISPLAY UTILITIES
    //--------------------

    //Use `group` to create a Container

  }, {
    key: "group",
    value: function group() {
      var _spriteUtilities;

      var o = (_spriteUtilities = this.spriteUtilities).group.apply(_spriteUtilities, arguments);
      this.addProperties(o);
      this.stage.addChild(o);
      return o;
    }

    //`batch` creates a Pixi ParticleContainer

  }, {
    key: "batch",
    value: function batch(size, options) {
      var o = this.spriteUtilities.batch(size, options);
      this.addProperties(o);
      this.stage.addChild(o);
      return o;
    }

    //Create a grid of sprite

  }, {
    key: "grid",
    value: function grid() {
      var columns = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
      var rows = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
      var cellWidth = arguments.length <= 2 || arguments[2] === undefined ? 32 : arguments[2];
      var cellHeight = arguments.length <= 3 || arguments[3] === undefined ? 32 : arguments[3];
      var centerCell = arguments.length <= 4 || arguments[4] === undefined ? false : arguments[4];
      var xOffset = arguments.length <= 5 || arguments[5] === undefined ? 0 : arguments[5];
      var yOffset = arguments.length <= 6 || arguments[6] === undefined ? 0 : arguments[6];
      var makeSprite = arguments.length <= 7 || arguments[7] === undefined ? undefined : arguments[7];
      var extra = arguments.length <= 8 || arguments[8] === undefined ? undefined : arguments[8];

      var o = this.spriteUtilities.grid(columns, rows, cellWidth, cellHeight, centerCell, xOffset, yOffset, makeSprite, extra);
      this.addProperties(o);
      this.stage.addChild(o);
      return o;
    }

    //`makeTiledWorld` uses a Tiled Editor JSON file to generate a game
    //world. It uses the `makeTiledWorld` method from the
    //`tileUtilities` module to do help do this.

  }, {
    key: "makeTiledWorld",
    value: function makeTiledWorld(jsonTiledMap, tileset) {
      var _this4 = this;

      var o = this.tileUtilities.makeTiledWorld(jsonTiledMap, tileset);
      this.addProperties(o);

      //Add Hexi's special sprite properties to the world object and all
      //its child objects
      var addHexiSpriteProperties = function addHexiSpriteProperties(object) {
        _this4.addProperties(object);
        if (object.children) {
          if (object.children.length > 0) {
            object.children.forEach(function (child) {
              addHexiSpriteProperties(child);
            });
          }
        }
      };
      if (o.children) {
        if (o.children.length > 0) {
          o.children.forEach(function (child) {
            addHexiSpriteProperties(child);
          });
        }
      }

      //Return the world object
      this.stage.addChild(o);
      return o;
    }

    //Use `remove` to remove a sprite from its parent. You can supply a
    //single sprite, a list of sprites, or an array of sprites

  }, {
    key: "remove",
    value: function remove() {
      var _spriteUtilities2;

      (_spriteUtilities2 = this.spriteUtilities).remove.apply(_spriteUtilities2, arguments);
    }

    //The flow methods: `flowRight`, `flowDown`, `flowLeft` and
    //`flowUp`.
    //Use them to easily align a row of sprites horizontally or
    //vertically. The flow methods take two arguments: the padding (in
    //pixels) between the sprites, and list of sprites (or an array
    //containing sprites) that you want to align.
    //(This feature was inspired by the Elm programming language)

    //flowRight

  }, {
    key: "flowRight",
    value: function flowRight(padding) {

      //A function to flow the sprites
      var flowSprites = function flowSprites(spritesToFlow) {
        if (spritesToFlow.length > 0) {
          for (var i = 0; i < spritesToFlow.length - 1; i++) {
            var sprite = spritesToFlow[i];
            sprite.putRight(spritesToFlow[i + 1], +padding);
          }
        }
      };

      //Check if `sprites` is a an array of sprites, or an
      //array containing sprite objects

      for (var _len = arguments.length, sprites = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        sprites[_key - 1] = arguments[_key];
      }

      if (!(sprites[0] instanceof Array)) {

        //It's an array of sprites
        flowSprites(sprites);
      } else {

        //It's an array containing sprite objects
        var spritesArray = sprites[0];
        flowSprites(spritesArray);
      }
    }

    //flowDown

  }, {
    key: "flowDown",
    value: function flowDown(padding) {
      var flowSprites = function flowSprites(spritesToFlow) {
        if (spritesToFlow.length > 0) {
          for (var i = 0; i < spritesToFlow.length - 1; i++) {
            var sprite = spritesToFlow[i];
            sprite.putBottom(spritesToFlow[i + 1], 0, +padding);
          }
        }
      };

      for (var _len2 = arguments.length, sprites = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        sprites[_key2 - 1] = arguments[_key2];
      }

      if (!(sprites[0] instanceof Array)) {
        flowSprites(sprites);
      } else {
        var spritesArray = sprites[0];
        flowSprites(spritesArray);
      }
    }

    //flowLeft

  }, {
    key: "flowLeft",
    value: function flowLeft(padding) {
      var flowSprites = function flowSprites(spritesToFlow) {
        if (spritesToFlow.length > 0) {
          for (var i = 0; i < spritesToFlow.length - 1; i++) {
            var sprite = spritesToFlow[i];
            sprite.putLeft(spritesToFlow[i + 1], -padding);
          }
        }
      };

      for (var _len3 = arguments.length, sprites = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
        sprites[_key3 - 1] = arguments[_key3];
      }

      if (!(sprites[0] instanceof Array)) {
        flowSprites(sprites);
      } else {
        var spritesArray = sprites[0];
        flowSprites(spritesArray);
      }
    }

    //flowUp

  }, {
    key: "flowUp",
    value: function flowUp(padding) {
      var flowSprites = function flowSprites(spritesToFlow) {
        if (spritesToFlow.length > 0) {
          for (var i = 0; i < spritesToFlow.length - 1; i++) {
            var sprite = spritesToFlow[i];
            sprite.putTop(spritesToFlow[i + 1], 0, -padding);
          }
        }
      };

      for (var _len4 = arguments.length, sprites = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
        sprites[_key4 - 1] = arguments[_key4];
      }

      if (!(sprites[0] instanceof Array)) {
        flowSprites(sprites);
      } else {
        var spritesArray = sprites[0];
        flowSprites(spritesArray);
      }
    }

    //7. SPRITE PROPERTIES

    //The sprite creation methods above all run the `addProperties`
    //method on each sprite they create. `addProperties` adds special
    //properties and methods (super powers!) to Hexi sprites.

  }, {
    key: "addProperties",
    value: function addProperties(o) {
      var _this5 = this;

      //Velocity
      o.vx = 0;
      o.vy = 0;

      //A "private" `_layer` property
      o._layer = 0;

      //Is the sprite circular? If it is, it will be given a `radius`
      //and `diameter`
      o._circular = false;

      //Is the sprite interactive? Setting this to `true` makes the
      //sprite behave like a button
      o._interact = false;

      //Is the sprite draggable?
      o._draggable = false;

      //Flag this object for compatibility with the Bump collision
      //library
      o._bumpPropertiesAdded = true;

      //Swap the depth layer positions of two child sprites
      o.swapChildren = function (child1, child2) {
        var index1 = o.children.indexOf(child1),
            index2 = o.children.indexOf(child2);
        if (index1 !== -1 && index2 !== -1) {

          //Swap the indexes
          child1.childIndex = index2;
          child2.childIndex = index1;

          //Swap the array positions
          o.children[index1] = child2;
          o.children[index2] = child1;
        } else {
          throw new Error(child + " Both objects must be a child of the caller " + o);
        }
      };

      //`add` and `remove` convenience methods let you add and remove
      //many sprites at the same time.
      o.add = function () {
        for (var _len5 = arguments.length, sprites = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
          sprites[_key5] = arguments[_key5];
        }

        if (sprites.length > 1) {
          sprites.forEach(function (sprite) {
            return o.addChild(sprite);
          });
        } else {
          o.addChild(sprites[0]);
        }
      };
      o.remove = function () {
        for (var _len6 = arguments.length, sprites = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
          sprites[_key6] = arguments[_key6];
        }

        if (sprites.length > 1) {
          sprites.forEach(function (sprite) {
            return o.removeChild(sprite);
          });
        } else {
          o.removeChild(sprites[0]);
        }
      };

      //The `put` methods are conveniences that help you position a
      //another sprite in and around this sprite.
      //First, get a short form reference to the sprite to make the code
      //easier to read
      var a = o;

      //The `nudgeAnchor`, `compensateForAnchor` and
      //`compensateForAnchors` (with an "s"!) methods are used by
      //the `put` methods to adjust the position of the sprite based on
      //its x/y anchor point.
      var nudgeAnchor = function nudgeAnchor(o, value, axis) {
        if (o.anchor !== undefined) {
          if (o.anchor[axis] !== 0) {
            return value * (1 - o.anchor[axis] - o.anchor[axis]);
          } else {
            return value;
          }
        } else {
          return value;
        }
      };

      var compensateForAnchor = function compensateForAnchor(o, value, axis) {
        if (o.anchor !== undefined) {
          if (o.anchor[axis] !== 0) {
            return value * o.anchor[axis];
          } else {
            return 0;
          }
        } else {
          return 0;
        }
      };

      var compensateForAnchors = function compensateForAnchors(a, b, property1, property2) {
        return compensateForAnchor(a, a[property1], property2) + compensateForAnchor(b, b[property1], property2);
      };

      //The `put` methods:
      //Center a sprite inside this sprite. `xOffset` and `yOffset`
      //arguments determine by how much the other sprite's position
      //should be offset from the center. These methods use the
      //sprites' global coordinates (`gx` and `gy`).
      //In all these functions, `b` is the second sprite that is being
      //positioned relative to the first sprite (this one), `a`.
      //Center `b` inside `a`.
      o.putCenter = function (b) {
        var xOffset = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
        var yOffset = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];

        if (o._stage) a = _this5.compensateForStageSize(o);
        //b.x = (a.x + a.halfWidth - (b.halfWidth * ((1 - b.anchor.x) - b.anchor.x))) + xOffset;
        b.x = a.x + nudgeAnchor(a, a.halfWidth, "x") - nudgeAnchor(b, b.halfWidth, "x") + xOffset;
        b.y = a.y + nudgeAnchor(a, a.halfHeight, "y") - nudgeAnchor(b, b.halfHeight, "y") + yOffset;

        //Compensate for the parent's position
        if (!o._stage) o.compensateForParentPosition(a, b);
      };

      //Position `b` to the left of `a`.
      o.putLeft = function (b) {
        var xOffset = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
        var yOffset = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];

        if (o._stage) a = _this5.compensateForStageSize(o);
        b.x = a.x - nudgeAnchor(b, b.width, "x") + xOffset - compensateForAnchors(a, b, "width", "x");
        b.y = a.y + nudgeAnchor(a, a.halfHeight, "y") - nudgeAnchor(b, b.halfHeight, "y") + yOffset;

        //Compensate for the parent's position
        if (!o._stage) o.compensateForParentPosition(a, b);
      };

      //Position `b` above `a`.
      o.putTop = function (b) {
        var xOffset = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
        var yOffset = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];

        if (o._stage) a = _this5.compensateForStageSize(o);
        b.x = a.x + nudgeAnchor(a, a.halfWidth, "x") - nudgeAnchor(b, b.halfWidth, "x") + xOffset;
        b.y = a.y - nudgeAnchor(b, b.height, "y") + yOffset - compensateForAnchors(a, b, "height", "y");

        //Compensate for the parent's position
        if (!o._stage) o.compensateForParentPosition(a, b);
      };

      //Position `b` to the right of `a`.
      o.putRight = function (b) {
        var xOffset = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
        var yOffset = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];

        if (o._stage) a = _this5.compensateForStageSize(o);
        b.x = a.x + nudgeAnchor(a, a.width, "x") + xOffset + compensateForAnchors(a, b, "width", "x");
        b.y = a.y + nudgeAnchor(a, a.halfHeight, "y") - nudgeAnchor(b, b.halfHeight, "y") + yOffset;
        //b.x = (a.x + a.width) + xOffset;
        //b.y = (a.y + a.halfHeight - b.halfHeight) + yOffset;

        //Compensate for the parent's position
        if (!o._stage) o.compensateForParentPosition(a, b);
      };

      //Position `b` below `a`.
      o.putBottom = function (b) {
        var xOffset = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
        var yOffset = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];

        if (o._stage) a = _this5.compensateForStageSize(o);
        //b.x = (a.x + a.halfWidth - b.halfWidth) + xOffset;
        b.x = a.x + nudgeAnchor(a, a.halfWidth, "x") - nudgeAnchor(b, b.halfWidth, "x") + xOffset;
        //b.y = (a.y + a.height) + yOffset;
        b.y = a.y + nudgeAnchor(a, a.height, "y") + yOffset + compensateForAnchors(a, b, "height", "y");

        //Compensate for the parent's position
        if (!o._stage) o.compensateForParentPosition(a, b);
      };

      //`compensateForParentPosition` is a helper function for the above
      //`put` methods that subracts the parent's global position from
      //the nested child's position.
      o.compensateForParentPosition = function (a, b) {
        if (b.parent.gx !== 0 || b.parent.gy !== 0) {
          b.x -= a.gx;
          b.y -= a.gy;
        }
      };

      var self = this;
      Object.defineProperties(o, {
        "gx": {
          get: function get() {
            return o.getGlobalPosition().x;
          },

          enumerable: true,
          configurable: true
        },
        "gy": {
          get: function get() {
            return o.getGlobalPosition().y;
          },

          enumerable: true,
          configurable: true
        },
        "centerX": {
          get: function get() {
            return o.x + o.width / 2 - o.xAnchorOffset;
          },

          enumerable: true,
          configurable: true
        },
        "centerY": {
          get: function get() {
            return o.y + o.height / 2 - o.yAnchorOffset;
          },

          enumerable: true,
          configurable: true
        },
        "halfWidth": {
          get: function get() {
            return o.width / 2;
          },

          enumerable: true,
          configurable: true
        },
        "halfHeight": {
          get: function get() {
            return o.height / 2;
          },

          enumerable: true,
          configurable: true
        },
        "scaleModeNearest": {
          set: function set(value) {
            if (o.texture.baseTexture) {
              if (value) {
                o.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
              } else {
                o.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.LINEAR;
              }
            } else {
              throw new Error("The scale mode of " + o + " cannot be modified");
            }
          },

          enumerable: true,
          configurable: true
        },
        "pivotX": {
          get: function get() {
            return o.anchor.x;
          },
          set: function set(value) {
            if (o.anchor === undefined) {
              throw new Error(o + " does not have a PivotX value");
            }
            o.anchor.x = value;
            if (!o._previousPivotX) {
              o.x += value * o.width;
            } else {
              o.x += (value - o._previousPivotX) * o.width;
            }
            o._previousPivotX = value;
          },

          enumerable: true,
          configurable: true
        },
        "pivotY": {
          get: function get() {
            return o.anchor.y;
          },
          set: function set(value) {
            if (o.anchor === undefined) {
              throw new Error(o + " does not have a PivotY value");
            }
            o.anchor.y = value;
            if (!o._previousPivotY) {
              o.y += value * o.height;
            } else {
              o.y += (value - o._previousPivotY) * o.height;
            }
            o._previousPivotY = value;
          },

          enumerable: true,
          configurable: true
        },
        "xAnchorOffset": {
          get: function get() {
            if (o.anchor !== undefined) {
              return o.height * o.anchor.x;
            } else {
              return 0;
            }
          },

          enumerable: true,
          configurable: true
        },
        "yAnchorOffset": {
          get: function get() {
            if (o.anchor !== undefined) {
              return o.width * o.anchor.y;
            } else {
              return 0;
            }
          },

          enumerable: true,
          configurable: true
        },
        "scaleX": {
          get: function get() {
            return o.scale.x;
          },
          set: function set(value) {
            o.scale.x = value;
          },

          enumerable: true,
          configurable: true
        },
        "scaleY": {
          get: function get() {
            return o.scale.y;
          },
          set: function set(value) {
            o.scale.y = value;
          },

          enumerable: true,
          configurable: true
        },

        //Depth layer
        "layer": {
          get: function get() {
            return o._layer;
          },
          set: function set(value) {
            o._layer = value;
            if (o.parent) {

              //Sort the sprite’s parent’s `children` array so that sprites with a
              //higher `layer` value are moved to the end of the array
              o.parent.children.sort(function (a, b) {
                return a.layer - b.layer;
              });
            }
          },

          enumerable: true,
          configurable: true
        },

        //Interactivity
        "interact": {
          get: function get() {
            return o._interact;
          },
          set: function set(value) {
            if (value === true) {
              if (!o._interact) {
                self.makeInteractive(o);
                o._interact = true;
              }
            } else {
              if (self.tink.buttons.indexOf(o) !== -1) {
                self.tink.buttons.splice(self.tink.buttons.indexOf(o), 1);
                o._interact = false;
              }
            }
          },

          enumerable: true,
          configurable: true
        },

        //Drag and drop
        "draggable": {
          get: function get() {
            return o._draggable;
          },
          set: function set(value) {
            if (value === true) {
              if (!o._draggable) {
                self.makeDraggable(o);
                o._draggable = true;
              }
            } else {
              self.makeUndraggable(o);
              o._draggable = false;
            }
          },

          enumerable: true,
          configurable: true
        },

        //The `localBounds` and `globalBounds` methods return an object
        //with `x`, `y`, `width`, and `height` properties that define
        //the dimensions and position of the sprite. This is a convenience
        //to help you set or test boundaries without having to know
        //these numbers or request them specifically in your code.
        "localBounds": {
          get: function get() {
            return {
              x: 0,
              y: 0,
              width: o.width,
              height: o.height
            };
          },

          enumerable: true,
          configurable: true
        },
        "globalBounds": {
          get: function get() {
            return {
              x: o.gx,
              y: o.gy,
              width: o.gx + o.width,
              height: o.gy + o.height
            };
          },

          enumerable: true,
          configurable: true
        },

        //`empty` is a convenience property that will return `true` or
        //`false` depending on whether or not this sprite's `children`
        //array is empty
        "empty": {
          get: function get() {
            if (o.children.length === 0) {
              return true;
            } else {
              return false;
            }
          },

          enumerable: true,
          configurable: true
        },

        //The `circular` property lets you define whether a sprite
        //should be interpreted as a circular object. If you set
        //`circular` to `true`, the sprite is given `radius` and `diameter`
        //properties. If you set `circular` to `false`, the `radius`
        //and `diameter` properties are deleted from the sprite
        "circular": {
          get: function get() {
            return o._circular;
          },
          set: function set(value) {

            //Give the sprite `diameter` and `radius` properties
            //if `circular` is `true`
            if (value === true && o._circular === false) {
              Object.defineProperties(o, {
                "diameter": {
                  get: function get() {
                    return o.width;
                  },
                  set: function set(value) {
                    o.width = value;
                    o.height = value;
                  },

                  enumerable: true,
                  configurable: true
                },
                "radius": {
                  get: function get() {
                    return o.halfWidth;
                  },
                  set: function set(value) {
                    o.width = value * 2;
                    o.height = value * 2;
                  },

                  enumerable: true,
                  configurable: true
                }
              });

              //Set o.sprite's `_circular` property to `true`
              o._circular = true;
            }

            //Remove the sprite's `diameter` and `radius` properties
            //if `circular` is `false`
            if (value === false && o._circular === true) {
              delete o.diameter;
              delete o.radius;
              o._circular = false;
            }
          },

          enumerable: true,
          configurable: true
        }
      });

      //A `setPosition` convenience method to let you set the
      //x any y position of a sprite with one line of code.
      o.setPosition = function (x, y) {
        o.x = x;
        o.y = y;
      };

      //A similar `setScale` convenience method
      o.setScale = function (xScale, yScale) {
        o.scale.x = xScale;
        o.scale.y = yScale;
      };

      //And a matching `setPivot` method
      o.setPivot = function (xPivot, yPivot) {
        o.pivotX = xPivot;
        o.pivotY = yPivot;
      };

      if (o.circular) {
        Object.defineProperty(o, "radius", {
          get: function get() {
            return o.width / 2;
          },

          enumerable: true,
          configurable: true
        });
      }
    }

    //8. Utilities

    //A method to scale and align the canvas in the browser
    //window using the `scaleToWindow.js` function module

  }, {
    key: "scaleToWindow",
    value: (function (_scaleToWindow) {
      function scaleToWindow() {
        return _scaleToWindow.apply(this, arguments);
      }

      scaleToWindow.toString = function () {
        return _scaleToWindow.toString();
      };

      return scaleToWindow;
    })(function () {
      var _this6 = this;

      var scaleBorderColor = arguments.length <= 0 || arguments[0] === undefined ? "#2C3539" : arguments[0];

      //Set the default CSS padding and margins of HTML elements to 0
      //<style>* {padding: 0; margin: 0}</style>
      var newStyle = document.createElement("style");
      var style = "* {padding: 0; margin: 0}";
      newStyle.appendChild(document.createTextNode(style));
      document.head.appendChild(newStyle);

      //Use the `scaleToWindow` function module to scale the canvas to
      //the maximum window size
      this.scale = scaleToWindow(this.canvas, scaleBorderColor);
      this.pointer.scale = this.scale;
      //this.pointer = this.makePointer(this.canvas, this.scale);
      console.log(this.pointer);

      //Re-scale on each browser resize
      window.addEventListener("resize", function (event) {
        //Scale the canvas and update Hexi's global `scale` value and
        //the pointer's `scale` value
        _this6.scale = scaleToWindow(_this6.canvas, scaleBorderColor);
        _this6.pointer.scale = _this6.scale;
      });

      //Flag that the canvas has been scaled
      this.canvas.scaled = true;
    })

    //`log` is a shortcut for `console.log`, so that you have less to
    //type when you're debugging

  }, {
    key: "log",
    value: function log(value) {
      return console.log(value);
    }

    //The `makeProgressBar` method creates a `progressBar` object with
    //`create`, `update` and `remove` methods. It's called by the
    //`loadingBar` method, which should be run inside the `load`
    //function of your application code.

  }, {
    key: "makeProgressBar",
    value: function makeProgressBar(hexiObject) {

      var hexi = hexiObject;

      //The `progressBar` object
      hexi.progressBar = {
        maxWidth: 0,
        height: 0,
        backgroundColor: "0x808080",
        foregroundColor: "0x00FFFF",
        backBar: null,
        frontBar: null,
        percentage: null,
        assets: null,
        initialized: false,

        //Use the `create` method to create the progress bar
        create: function create() {

          //Set the maximum width to half the width of the canvas
          this.maxWidth = hexi.canvas.width / 2;

          //Build the progress bar using two rectangle sprites and
          //one text sprite

          //1. Create the background bar's gray background
          this.backBar = hexi.rectangle(this.maxWidth, 32, this.backgroundColor);
          this.backBar.x = hexi.canvas.width / 2 - this.maxWidth / 2;
          this.backBar.y = hexi.canvas.height / 2 - 16;

          //2. Create the blue foreground bar. This is the element of the
          //progress bar that will increase in width as assets load
          this.frontBar = hexi.rectangle(this.maxWidth, 32, this.foregroundColor);
          this.frontBar.x = hexi.canvas.width / 2 - this.maxWidth / 2;
          this.frontBar.y = hexi.canvas.height / 2 - 16;

          //3. A text sprite that will display the percentage
          //of assets that have loaded
          this.percentage = hexi.text("0%", "28px sans-serif", "black");
          this.percentage.x = hexi.canvas.width / 2 - this.maxWidth / 2 + 12;
          this.percentage.y = hexi.canvas.height / 2 - 17;
        },

        //Use the `update` method to update the width of the bar and
        //percentage loaded each frame
        update: function update() {

          //Change the width of the blue `frontBar` to match the
          //ratio of assets that have loaded.
          var ratio = hexi.loadingProgress / 100;
          //console.log(`ratio: ${ratio}`);
          this.frontBar.width = this.maxWidth * ratio;

          //Display the percentage
          this.percentage.content = Math.round(hexi.loadingProgress) + " %";
        },

        //Use the `remove` method to remove the progress bar when all the
        //game assets have finished loading
        remove: function remove() {

          //Remove the progress bar using the universal sprite `remove`
          //function
          hexi.stage.removeChild(this.frontBar);
          hexi.stage.removeChild(this.backBar);
          hexi.stage.removeChild(this.percentage);
        }
      };
    }

    //The `loadingBar` method should be called inside the user-definable
    //`load` method in the application code. This function will run in a
    //loop. It will create the loading bar, and then call the loading
    //bar's `update` method each frame. After all the assets have been
    //loaded, Hexi's `validateAssets` method removes the loading bar.

  }, {
    key: "loadingBar",
    value: function loadingBar() {

      if (!this._progressBarAdded) {

        //Run the method that creates the progress bar object
        this.makeProgressBar(this);

        //Create the loading bar
        this.progressBar.create();

        //Tell Hexi that a progress bar has been added
        this._progressBarAdded = true;
      } else {

        //Update the progress bar each frame
        this.progressBar.update();
      }
    }

    //Hexi's root `stage` object will have a width and height equal to
    //its contents, not the size of the canvas. So, let's use the more
    //useful canvas width and height for relative positioning instead

  }, {
    key: "compensateForStageSize",
    value: function compensateForStageSize(o) {
      if (o._stage === true) {
        var a = {};
        a.x = 0;
        a.y = 0;
        a.width = this.canvas.width;
        a.height = this.canvas.height;
        a.halfWidth = this.canvas.width / 2;
        a.halfHeight = this.canvas.height / 2;
        a.xAnchorOffset = 0;
        a.yAnchorOffset = 0;
        return a;
      }
    }

    //High level functions for accessing the loaded resources and custom parsed
    //objects, like sounds.

  }, {
    key: "image",
    value: function image(imageFileName) {
      if (this.TextureCache[imageFileName]) {
        return this.TextureCache[imageFileName];
      } else {
        throw new Error(imageFileName + " does not appear to be an image");
      }
    }
  }, {
    key: "id",
    value: function id(textureAtlasFrameId) {
      if (this.TextureCache[textureAtlasFrameId]) {
        return this.TextureCache[textureAtlasFrameId];
      } else {
        throw new Error(textureAtlasFrameId + " does not appear to be a texture atlas frame id");
      }
    }
  }, {
    key: "json",
    value: function json(jsonFileName) {
      if (this.loader.resources[jsonFileName].data) {
        return this.resources[jsonFileName].data;
      } else {
        throw new Error(jsonFileName + " does not appear to be a JSON data file");
      }
    }
  }, {
    key: "xml",
    value: function xml(xmlFileName) {
      if (this.loader.resources[xmlFileName].data) {
        return this.resources[xmlFileName].data;
      } else {
        throw new Error(xmlFileName + " does not appear to be a XML data file");
      }
    }
  }, {
    key: "sound",
    value: function sound(soundFileName) {
      if (this.soundObjects[soundFileName]) {
        return this.soundObjects[soundFileName];
      } else {
        throw new Error(soundFileName + " does not appear to be a sound object");
      }
    }
  }, {
    key: "resources",
    get: function get() {
      return this.loader.resources;
    }

    //Add Smoothie getters and setters to access the `fps`,
    //`properties`, `renderFps` and `interpolate` properties

  }, {
    key: "fps",
    get: function get() {
      return this.smoothie.fps;
    },
    set: function set(value) {
      this.smoothie.fps = value;
    }
  }, {
    key: "renderFps",
    get: function get() {
      return this.smoothie.renderFps;
    },
    set: function set(value) {
      this.smoothie.renderFps = value;
    }
  }, {
    key: "interpolate",
    get: function get() {
      return this.smoothie.interpolate;
    },
    set: function set(value) {
      this.smoothie.interpolate = value;
    }
  }, {
    key: "interpolationProperties",
    get: function get() {
      return this.smoothie.properties;
    },
    set: function set(value) {
      this.smoothie.properties = value;
    }

    //The `border` property lets you set the border style on the canvas

  }, {
    key: "border",
    set: function set(value) {
      this.canvas.style.border = value;
    }

    //The `backgroundColor` property lets you set the background color
    //of the renderer

  }, {
    key: "backgroundColor",
    set: function set(value) {
      this.renderer.backgroundColor = this.color(value);
    }
  }]);

  return Hexi;
})();

//# sourceMappingURL=core.js.map