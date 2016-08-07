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
function hexi(width, height, setup, thingsToLoad = undefined, load = undefined) {

  //If you need to, you can also instantiate Hexi with a configuration
  //object, which lets you fine-tune the options.
  let hexi = new Hexi({

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
    interpolate: true,

    //To change PIXI's renderer, set the `renderer` option to
    //"auto", "canvas" or "webgl", like this:
    //renderer: "auto"  
    //Add any other Pixi initialization options you need, depending
    //on which Pixi renderer you're using
  });

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

class Hexi {

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
  constructor(o) {

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
      this.renderer = PIXI.autoDetectRenderer(
        o.width,
        o.height,
        o,
        o.noWebGL
      );

      //Canvas renderer
    } else if (o.renderer === "canvas") {
      this.renderer = new PIXI.CanvasRenderer(
        o.width,
        o.height,
        o
      );

      //WebGL renderer
    } else if (o.renderer === "webgl") {
      this.renderer = new PIXI.WebGLRenderer(
        o.width,
        o.height,
        o
      );
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

    //NOTE: MOVE TINK INITIALIZATION HERE AND INITIALIZE WITH THE CANVAS ELEMENT

    //Add `halfWidth` and `halfHeight` properties to the canvas
    Object.defineProperties.bind(this, this.canvas, {
      "halfWidth": {
        get() {
          return this.canvas.width / 2
        },
        enumerable: true,
        configurable: true
      },
      "halfHeight": {
        get() {
          return this.canvas.height / 2
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
      throw new Error(
        "Please supply the setup option in the constructor to tell Hexi which function should run first when it starts."
      );
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
  start() {

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
  load(assetsToLoad, callbackFunction = undefined) {

    //Handle special file types that Pixi's loader doesn't understand
    //The `findAssets` function will return an array to get an array just
    //containing those file source paths you're interested in
    let findAssets = fileExtensionArray => {
      let fileSourcePaths = assetsToLoad.filter(source => {

        //Find the file extension of the asset
        let extension = source.split(".").pop();
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
    let fontExtensions = ["ttf", "otf", "ttc", "woff"];

    //Get the font source paths
    let fontFiles = findAssets(fontExtensions);

    //If there are any font files, load them into the browser using an
    //old trick that forces the browser to load them
    if (fontFiles.length > 0) {
      this.spanElements = [];
      fontFiles.forEach(source => {

        //Loads the font files by writing CSS code to the HTML document head.
        //Use the font's filename as the `fontFamily` name. This code captures 
        //the font file's name without the extension or file path
        let fontFamily = source.split("/").pop().split(".")[0];

        //Push the font family name into Hexi's `fontFamilies` array
        if (this.fontFamilies) this.fontFamilies.push(fontFamily);

        //Append an `@afont-face` style rule to the head of the HTML document
        let newStyle = document.createElement("style");
        let fontFace = "@font-face {font-family: '" + fontFamily + "'; src: url('" + source + "');}";
        newStyle.appendChild(document.createTextNode(fontFace));
        document.head.appendChild(newStyle);

        //Trick the browser into loading the font file by 
        //displaying an invisible element
        let span = document.createElement("span");
        span.style.fontFamily = fontFamily;
        document.body.appendChild(span);
        span.innerHTML = "?";
        span.style.display = "block";
        span.style.opacity = "0";
        this.spanElements.push(span);
      });
    }

    /* Load sound */

    //Set default loading mechanism for sound file extensions to use XHR
    let Resource = PIXI.loaders.Resource;
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

    let loadProgressHandler = (loader, resource) => {

      //Display the file `url` currently being loaded
      this.loadingFile = resource.url;

      //Display the percentage of files currently loaded
      this.loadingProgress = loader.progress;
    };

    //Load the files and call the `loadProgressHandler` while they're
    //loading
    this.loader.reset();
    this.loadingProgress = 0;
    this.loadingFile = "";
    this.loader
      .add(assetsToLoad)
      .on("progress", loadProgressHandler)
      .load(callbackFunction.bind(this));
  }

  //The `validateAssets` method runs when all the assets have finished
  //loading. It checks to see if there are any sounds files and, if
  //there are, decodes them and turns them into sound objects using the 
  //`sounds.js` module's `makeSound` function. If there are no sounds
  //to load, the loading state is finished and the setup state is run.
  //But, if there are sounds to load, the setup state will only run
  //after the sounds have been decoded.
  validateAssets() {
    console.log("All assets loaded");

    //The `finishLoadingState` method will be called if everything has
    //finished loading and any possible sounds have been decoded
    let finishLoadingState = () => {

      //Reset the `assetsToLoad` array
      this.assetsToLoad = [];

      //Clear the `loadState`
      this.loadState = undefined;

      //Clear the game `state` function for now to stop the loop.
      this.state = undefined;

      //Remove the loading progress bar if the user invoked the `loadingBar`
      //function
      if (this._progressBarAdded) {
        this.progressBar.remove();
      }

      //If any fonts were tricked into loading 
      //make the <span> tags that use them invisible
      if (this.spanElements) {
        this.spanElements.forEach(element => {
          element.style.display = "none";
        });
      }

      //Call the `setup` state
      this.setupState();
    };

    //We need to check if any possible sound file have been loaded
    //because, if there have, they need to fist be decoded before we
    //can launch the `setup` state.

    //Variables to count the number of sound files and the sound files
    //that have been decoded. If both these numbers are the same at
    //some point, then we know all the sounds have been decoded and we
    //can call the `finishLoadingState` function
    let soundsToDecode = 0,
      soundsDecoded = 0;

    //First, create a list of the kind of sound files we want to check
    let soundExtensions = ["wav", "mp3", "ogg", "webm"];

    //The `decodeHandler` will run when each sound file is decoded
    let decodeHandler = () => {

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
    Object.keys(this.loader.resources).forEach(resource => {

      //Find the file extension of the asset
      let extension = resource.split(".").pop();

      //If one of the resource file extensions matches the sound file
      //extensions, then we know we have a sound file
      if (soundExtensions.indexOf(extension) !== -1) {

        //Count one more sound to load
        soundsToDecode += 1;

        //Create aliases for the sound's `xhr` object and `url` (its
        //file name)
        let xhr = this.loader.resources[resource].xhr,
          url = this.loader.resources[resource].url;

        //Create a sound sprite using the `sound.js` module's
        //`makeSound` function. Notice the 4th argument is the loaded
        //sound's `xhr` object. Setting the 3rd argument to `false`
        //means that `makeSound` won't attempt to load the sounds
        //again. When the sound has been decoded, the `decodeHandler`
        //(see above!) will be run
        let soundSprite = makeSound(url, decodeHandler.bind(this), false, xhr);

        //Get the sound file name.
        soundSprite.name = this.loader.resources[resource].name;

        //Add the sound object to Hexi's `soundObjects` object.
        //You'll be able to access them in your application through
        //Hexi's higher-level `sound` method, like this:
        //`hexi.sound("soundFileName.wav");`
        this.soundObjects[soundSprite.name] = soundSprite;
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
  update() {

    //Update all the modules in the `modulesToUpdate` array.
    //These are modules that contain `update` methods that need to be
    //called every frame
    this.modulesToUpdate.forEach(module => module.update());
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
  pause() {
    this.paused = true;
  }
  resume() {
    this.paused = false;
  }

  //4. MODULE INTERFACES

  //A method that helpfully creates local, top-level references to the
  //most useful properties and methods from the loaded modules
  createModulePropertyAliases() {

    //Pixi - Rendering
    this.Container = PIXI.Container;
    this.loader = PIXI.loader;
    this.TextureCache = PIXI.utils.TextureCache;
    this.filters = PIXI.filters;
    //Filters
    this.dropShadowFilter = () => new this.filters.DropShadowFilter();
    this.asciiFilter = () => new this.filters.AsciiFilter();
    this.alphaMaskFilter = () => new this.filters.AlphaMaskFilter();
    this.bloomFilter = () => new this.filters.BloomFilter();
    this.blurDirFilter = () => new this.filters.BlurDirFilter();
    this.blurFilter = () => new this.filters.BlurFilter();
    this.colorMatrixFilter = () => new this.filters.ColorMatrixFilter();
    this.colorStepFilter = () => new this.filters.ColorStepFilter();
    this.crossHatchFilter = () => new this.filters.CrossHatchFilter();
    this.displacementFilter = () => new this.filters.DisplacementFilter();
    this.dotScreenFilter = () => new this.filters.DotScreenFilter();
    this.grayFilter = () => new this.filters.GrayFilter();
    this.invertFilter = () => new this.filters.InvertFilter();
    this.pixelateFilter = () => new this.filters.PixelateFilter();
    this.sepiaFilter = () => new this.filters.SepiaFilter();
    this.shockwaveFilter = () => new this.filters.ShockwaveFilter();
    this.twistFilter = () => new this.filters.TwistFilter();
    this.rgbSplitFilter = () => new this.filters.RGBSplitFilter();
    this.smartBlurFilter = () => new this.filters.SmartBlurFilter();
    this.tiltShiftFilter = () => new this.filters.TiltShiftFilter();

    //Tink - Interactivity
    this.draggableSprites = this.tink.draggableSprites;
    this.pointers = this.tink.pointers;
    this.buttons = this.tink.buttons;
    this.makePointer = (canvas, scale) => this.tink.makePointer(canvas, scale);
    this.makeDraggable = (...sprites) => this.tink.makeDraggable(...sprites);
    this.makeUndraggable = (...sprites) => this.tink.makeUndraggable(...sprites);
    this.makeInteractive = (o) => this.tink.makeInteractive(o);
    this.keyboard = this.tink.keyboard;
    this.arrowControl = (sprite, speed) => this.tink.arrowControl(sprite, speed);

    //Add the arrow key objects
    /*
    this.upArrow = this.keyboard(38);
    this.rightArrow = this.keyboard(39);
    this.downArrow = this.keyboard(40);
    this.leftArrow = this.keyboard(37);
    this.spaceBar = this.keyboard(32);
    */

    //Dust - Particle effects
    this.createParticles = (
      x, y, spriteFunction, container, numberOfParticles, gravity, randomSpacing, minAngle, maxAngle, minSize, maxSize,
      minSpeed, maxSpeed, minScaleSpeed, maxScaleSpeed, minAlphaSpeed, maxAlphaSpeed, minRotationSpeed, maxRotationSpeed
    ) => this.dust.create(
      x, y, spriteFunction, container, numberOfParticles, gravity, randomSpacing, minAngle, maxAngle, minSize, maxSize,
      minSpeed, maxSpeed, minScaleSpeed, maxScaleSpeed, minAlphaSpeed, maxAlphaSpeed, minRotationSpeed, maxRotationSpeed
    );
    this.particleEmitter = (interval, particleFunction) => this.dust.emitter(interval, particleFunction);

    //SpriteUtilities - Sprite creation tools
    this.filmstrip = (texture, frameWidth, frameHeight, spacing) => this.spriteUtilities.filmstrip(texture, frameWidth, frameHeight, spacing);
    this.frame = (source, x, y, width, height) => this.spriteUtilities.frame(source, x, y, width, height);
    this.frames = (source, coordinates, frameWidth, frameHeight) => this.spriteUtilities.frames(source, coordinates, frameWidth, frameHeight);
    this.frameSeries = (startNumber, endNumber, baseName, extension) => this.spriteUtilities.frames(startNumber, endNumber, baseName, extension);
    this.colorToRGBA = value => this.spriteUtilities.colorToRGBA(value);
    this.colorToHex = value => this.spriteUtilities.colorToHex(value);
    this.byteToHex = value => this.spriteUtilities.byteToHex(value);
    this.color = value => this.spriteUtilities.color(value);
    this.shoot = (shooter, angle, x, y, container, bulletSpeed, bulletArray, bulletSprite) => {
      return this.spriteUtilities.shoot(shooter, angle, x, y, container, bulletSpeed, bulletArray, bulletSprite)
    };
    this.shake = (sprite, magnitude = 16, angular = false) => {
      console.log("shake")
      return this.spriteUtilities.shake(sprite, magnitude, angular);
    }

    //Charm - Tweening
    this.fadeOut = (sprite, frames = 60) => this.charm.fadeOut(sprite, frames);
    this.fadeIn = (sprite, frames = 60) => this.charm.fadeIn(sprite, frames);
    this.pulse = (sprite, frames = 60, minAlpha = 0) => this.charm.pulse(sprite, frames, minAlpha);
    this.slide = (sprite, endX, endY, frames = 60, type = "smoothstep", yoyo = false, delayBeforeRepeat = 0) => {
      return this.charm.slide(sprite, endX, endY, frames, type, yoyo, delayBeforeRepeat = 0);
    };
    this.breathe = (sprite, endScaleX = 0.8, endScaleY = 0.8, frames = 60, yoyo = true, delayBeforeRepeat = 0) => {
      return this.charm.breathe(sprite, endScaleX, endScaleY, frames, yoyo, delayBeforeRepeat);
    };
    this.scale = (sprite, endScaleX = 0.5, endScaleY = 0.5, frames = 60) => this.charm.scale(sprite, endScaleX, endScaleY, frames);
    this.strobe = (sprite, scaleFactor = 1.3, startMagnitude = 10, endMagnitude = 20, frames = 10, yoyo = true, delayBeforeRepeat = 0) => {
      return this.charm.strobe(sprite, scaleFactor, startMagnitude, endMagnitude, frames, yoyo, delayBeforeRepeat);
    };
    this.wobble = (
      sprite, scaleFactorX = 1.2, scaleFactorY = 1.2, frames = 10, xStartMagnitude = 10, xEndMagnitude = 10,
      yStartMagnitude = -10, yEndMagnitude = -10, friction = 0.98, yoyo = true, delayBeforeRepeat = 0
    ) => {
      return this.charm.wobble(
        sprite, scaleFactorX = 1.2, scaleFactorY = 1.2, frames = 10, xStartMagnitude = 10, xEndMagnitude = 10,
        yStartMagnitude = -10, yEndMagnitude = -10, friction = 0.98, yoyo = true, delayBeforeRepeat = 0
      );
    };
    this.followCurve = (sprite, pointsArray, totalFrames, type = "smoothstep", yoyo = false, delayBeforeRepeat = 0) => {
      return this.charm.followCurve(sprite, pointsArray, totalFrames, type, yoyo, delayBeforeRepeat);
    };
    this.walkPath = (sprite, originalPathArray, totalFrames = 300, type = "smoothstep", loop = false, yoyo = false, delayBetweenSections = 0) => {
      return this.charm.walkPath(sprite, originalPathArray, totalFrames, type, loop, yoyo, delayBetweenSections);
    };
    this.walkCurve = (sprite, pathArray, totalFrames = 300, type = "smoothstep", loop = false, yoyo = false, delayBeforeContinue = 0) => {
      return this.charm.walkCurve(sprite, pathArray, totalFrames, type, loop, yoyo, delayBeforeContinue);
    };
    this.removeTween = (tweenObject) => this.charm.removeTween(tweenObject);
    this.makeTween = (tweensToAdd) => this.charm.makeTween(tweensToAdd);
    this.tweenProperty = (sprite, property, startValue, endValue, totalFrames, type = "smoothstep", yoyo = false, delayBeforeRepeat = 0) => {
      return this.charm.tweenProperty(sprite, property, startValue, endValue, totalFrames, type, yoyo, delayBeforeRepeat);
    };

    //Bump - Collision
    this.hitTestPoint = (point, sprite) => this.bump.hitTestPoint(point, sprite);
    this.hitTestCircle = (c1, c2, global = false) => this.bump.hitTestCircle(c1, c2, global);
    this.circleCollision = (c1, c2, bounce = false, global = false) => this.bump.circleCollision(c1, c2, bounce, global);
    this.movingCircleCollision = (c1, c2, global = false) => this.bump.movingCircleCollision(c1, c2, global);
    this.multipleCircleCollision = (arrayOfCircles, global = false) => this.bump.multipleCircleCollision(arrayOfCircles, global);
    this.rectangleCollision = (r1, r2, bounce = false, global = true) => this.bump.rectangleCollision(r1, r2, bounce, global);
    this.hitTestRectangle = (r1, r2, global = false) => this.bump.hitTestRectangle(r1, r2, global);
    this.hitTestCircleRectangle = (c1, r1, global = false) => this.bump.hitTestCircleRectangle(c1, r1, global);
    this.hitTestCirclePoint = (c1, point, global = false) => this.bump.hitTestCirclePoint(c1, point, global);
    this.circleRectangleCollision = (c1, r1, bounce = false, global = false) => this.bump.circleRectangleCollision(c1, r1, bounce, global);
    this.circlePointCollision = (c1, point, bounce = false, global = false) => this.bump.circlePointCollision(c1, point, bounce, global);
    this.bounceOffSurface = (o, s) => this.bump.bounceOffSurface(o, s);
    this.hit = (a, b, react = false, bounce = false, global, extra = undefined) => this.bump.hit(a, b, react, bounce, global, extra);

    //Intercept the Bump library's `contain` and `outsideBounds` methods to make sure that
    //the stage `width` and `height` match the canvas width and height
    this.contain = (sprite, container, bounce = false, extra = undefined) => {
      let o = {};
      if (container._stage) {
        o = this.compensateForStageSize(container);
      } else {
        o = container
      }
      return this.bump.contain(sprite, o, bounce, extra);
    };

    this.outsideBounds = (sprite, container, extra = undefined) => {
      let o = {};
      if (container._stage) {
        o = this.compensateForStageSize(container);
      } else {
        o = container
      }
      return this.bump.outsideBounds(sprite, o, extra);
    };

    //GameUtilities - Useful utilities
    this.distance = (s1, s2) => this.gameUtilities.distance(s1, s2);
    this.followEase = (follower, leader, speed) => this.gameUtilities.followEase(follower, leader, speed);
    this.followConstant = (follower, leader, speed) => this.gameUtilities.followConstant(follower, leader, speed);
    this.angle = (s1, s2) => this.gameUtilities.angle(s1, s2);
    this.rotateAroundSprite = (rotatingSprite, centerSprite, distance, angle) => this.gameUtilities.rotateAroundSprite(rotatingSprite, centerSprite, distance, angle);
    this.rotateAroundPoint = this.gameUtilities.rotateAroundPoint;
    this.randomInt = this.gameUtilities.randomInt;
    this.randomFloat = this.gameUtilities.randomFloat;
    this.move = this.gameUtilities.move;
    this.wait = this.gameUtilities.wait;
    this.worldCamera = (world, worldWidth, worldHeight, canvas = this.canvas) => this.gameUtilities.worldCamera(world, worldWidth, worldHeight, canvas);

    //Sound.js - Sound
    this.soundEffect = (
      frequencyValue, attack, decay, type, volumeValue, panValue, wait, pitchBendAmount, reverse,
      randomValue, dissonance, echo, reverb
    ) => {
      return soundEffect(
        frequencyValue, attack, decay, type, volumeValue, panValue, wait, pitchBendAmount, reverse,
        randomValue, dissonance, echo, reverb
      );
    };

    //FullScreen
    //this.enableFullScreen = (exitKeyCodes) => this.fullScreen.enableFullScreen(exitKeyCodes);

    //TileUtilities
    this.hitTestTile = (sprite, mapArray, gidToCheck, world, pointsToCheck) => {
      return this.tileUtilities.hitTestTile(sprite, mapArray, gidToCheck, world, pointsToCheck);
    };
    this.getIndex = (x, y, tilewidth, tileheight, mapWidthInTiles) => {
      return this.tileUtilities.getIndex(x, y, tilewidth, tileheight, mapWidthInTiles);
    };
    this.getTile = this.tileUtilities.getTile;
    this.surroundingCells = this.tileUtilities.surroundingCells;
    this.getPoints = this.tileUtilities.getPoints;
    this.updateMap = (mapArray, spritesToUpdate, world) => {
      return this.tileUtilities.updateMap(mapArray, spritesToUpdate, world);
    };
    this.byDepth = this.tileUtilities.byDepth;
    this.hitTestIsoTile = (sprite, mapArray, gidToCheck, world, pointsToCheck) => {
      return this.tileUtilities.hitTestIsoTile(sprite, mapArray, gidToCheck, world, pointsToCheck);
    };
    this.getIsoPoints = this.tileUtilities.getIsoPoints;
    this.makeIsoPointer = (pointer, world) => {
      return this.tileUtilities.makeIsoPointer(pointer, world);
    };
    this.isoRectangle = (width, height, fillStyle) => {
      return this.tileUtilities.isoRectangle(width, height, fillStyle);
    };
    this.addIsoProperties = (sprite, x, y, width, height) => {
      return this.tileUtilities.addIsoProperties(sprite, x, y, width, height);
    };
    this.makeIsoTiledWorld = (jsonTiledMap, tileset) => {
      return this.tileUtilities.makeIsoTiledWorld(jsonTiledMap, tileset);
    };

  }

  //Getters and setters

  //Pixi's loader resources
  get resources() {
    return this.loader.resources
  }

  //Add Smoothie getters and setters to access the `fps`,
  //`properties`, `renderFps` and `interpolate` properties
  get fps() {
    return this.smoothie.fps;
  }
  set fps(value) {
    this.smoothie.fps = value;
  }

  get renderFps() {
    return this.smoothie.renderFps;
  }
  set renderFps(value) {
    this.smoothie.renderFps = value;
  }

  get interpolate() {
    return this.smoothie.interpolate;
  }
  set interpolate(value) {
    this.smoothie.interpolate = value;
  }

  get interpolationProperties() {
    return this.smoothie.properties;
  }
  set interpolationProperties(value) {
    this.smoothie.properties = value;
  }

  //The `border` property lets you set the border style on the canvas
  set border(value) {
    this.canvas.style.border = value;
  }

  //The `backgroundColor` property lets you set the background color
  //of the renderer
  set backgroundColor(value) {
    this.renderer.backgroundColor = this.color(value);
  }


  //5. SPRITE CREATION METHODS

  //Hexi uses methods from the
  //SpriteUtilities module to help create sprites. But, as a helpful bonus, Hexi automatically adds sprites 
  //to the `stage` container. (The `stage` is Hexi's root container for all
  //Hexi sprites.) Hexi also adds a whole bunch of
  //extra, useful properties and methods to sprites with the
  //`addProperties` method

  //Universal sprites
  sprite(source, x = 0, y = 0, tiling = false, width, height) {
    let o = this.spriteUtilities.sprite(source, x, y, tiling, width, height);
    this.addProperties(o);
    this.stage.addChild(o);
    return o;
  }

  //Tiling sprites
  tilingSprite(source, width, height, x = 0, y = 0) {
    let o = this.spriteUtilities.tilingSprite(source, width, height, x, y);
    this.addProperties(o);
    this.stage.addChild(o);
    return o;
  }

  //Hexi's `text` method is a quick way to create a Pixi Text sprite
  //and add it to the stage
  text(content = "message", font = "16px sans", fillStyle = "red", x = 0, y = 0) {
    let message = this.spriteUtilities.text(content, font, fillStyle, x, y);
    this.addProperties(message);
    this.stage.addChild(message);
    return message;
  }

  //The `bitmapText` method is a quick way to create a Pixi BitmapText sprite
  bitmapText(content = "message", font, align, tint, x = 0, y = 0) {
    let message = this.spriteUtilities.bitmapText(content, font, align, tint, x, y);
    this.addProperties(message);
    this.stage.addChild(message);
    return message;
  }

  //Make a rectangle and add it to the stage
  rectangle(width = 32, height = 32, fillStyle = 0xFF3300, strokeStyle = 0x0033CC, lineWidth = 0, x = 0, y = 0) {
    let o = this.spriteUtilities.rectangle(width, height, fillStyle, strokeStyle, lineWidth, x, y);
    this.addProperties(o);
    this.stage.addChild(o);
    return o;
  }

  //Make a circle and add it to the stage
  circle(diameter = 32, fillStyle = 0xFF3300, strokeStyle = 0x0033CC, lineWidth = 0, x = 0, y = 0) {
    let o = this.spriteUtilities.circle(diameter, fillStyle, strokeStyle, lineWidth, x, y);
    this.addProperties(o);

    //Add diameter and radius properties to the circle
    o.circular = true;
    this.stage.addChild(o);
    return o;
  }

  //Draw a line
  line(strokeStyle = 0x000000, lineWidth = 1, ax = 0, ay = 0, bx = 32, by = 32) {
    let o = this.spriteUtilities.line(strokeStyle, lineWidth, ax, ay, bx, by);
    this.addProperties(o);
    this.stage.addChild(o);
    return o;
  }

  //Make a button and add it to the stage
  button(source, x, y) {
    let o = this.tink.button(source, x, y);
    this.addProperties(o);
    this.stage.addChild(o);
    return o;
  }

  //6. DISPLAY UTILITIES
  //--------------------

  //Use `group` to create a Container
  group(...sprites) {
    let o = this.spriteUtilities.group(...sprites);
    this.addProperties(o);
    this.stage.addChild(o);
    return o;
  }

  //`batch` creates a Pixi ParticleContainer
  batch(size, options) {
    let o = this.spriteUtilities.batch(size, options);
    this.addProperties(o);
    this.stage.addChild(o);
    return o;
  }

  //Create a grid of sprite
  grid(
    columns = 0, rows = 0, cellWidth = 32, cellHeight = 32,
    centerCell = false, xOffset = 0, yOffset = 0,
    makeSprite = undefined,
    extra = undefined
  ) {

    let o = this.spriteUtilities.grid(
      columns, rows, cellWidth, cellHeight,
      centerCell, xOffset, yOffset, makeSprite, extra
    );
    this.addProperties(o);
    this.stage.addChild(o);
    return o;
  }

  //`makeTiledWorld` uses a Tiled Editor JSON file to generate a game
  //world. It uses the `makeTiledWorld` method from the
  //`tileUtilities` module to do help do this.
  makeTiledWorld(jsonTiledMap, tileset) {
    let o = this.tileUtilities.makeTiledWorld(jsonTiledMap, tileset);
    this.addProperties(o);

    //Add Hexi's special sprite properties to the world object and all
    //its child objects
    let addHexiSpriteProperties = object => {
      this.addProperties(object);
      if (object.children) {
        if (object.children.length > 0) {
          object.children.forEach(child => {
            addHexiSpriteProperties(child);
          });
        }
      }
    };
    if (o.children) {
      if (o.children.length > 0) {
        o.children.forEach(child => {
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
  remove(...sprites) {
    this.spriteUtilities.remove(...sprites);
  }

  //The flow methods: `flowRight`, `flowDown`, `flowLeft` and
  //`flowUp`.
  //Use them to easily align a row of sprites horizontally or
  //vertically. The flow methods take two arguments: the padding (in
  //pixels) between the sprites, and list of sprites (or an array
  //containing sprites) that you want to align.
  //(This feature was inspired by the Elm programming language)

  //flowRight
  flowRight(padding, ...sprites) {

    //A function to flow the sprites
    let flowSprites = (spritesToFlow) => {
      if (spritesToFlow.length > 0) {
        for (let i = 0; i < spritesToFlow.length - 1; i++) {
          let sprite = spritesToFlow[i];
          sprite.putRight(spritesToFlow[i + 1], +padding);
        }
      }
    };

    //Check if `sprites` is a an array of sprites, or an 
    //array containing sprite objects
    if (!(sprites[0] instanceof Array)) {

      //It's an array of sprites
      flowSprites(sprites);
    } else {

      //It's an array containing sprite objects
      let spritesArray = sprites[0];
      flowSprites(spritesArray);
    }
  }

  //flowDown
  flowDown(padding, ...sprites) {
    let flowSprites = (spritesToFlow) => {
      if (spritesToFlow.length > 0) {
        for (let i = 0; i < spritesToFlow.length - 1; i++) {
          let sprite = spritesToFlow[i];
          sprite.putBottom(spritesToFlow[i + 1], 0, +padding);
        }
      }
    };
    if (!(sprites[0] instanceof Array)) {
      flowSprites(sprites);
    } else {
      let spritesArray = sprites[0];
      flowSprites(spritesArray);
    }
  }

  //flowLeft
  flowLeft(padding, ...sprites) {
    let flowSprites = (spritesToFlow) => {
      if (spritesToFlow.length > 0) {
        for (let i = 0; i < spritesToFlow.length - 1; i++) {
          let sprite = spritesToFlow[i];
          sprite.putLeft(spritesToFlow[i + 1], -padding);
        }
      }
    };
    if (!(sprites[0] instanceof Array)) {
      flowSprites(sprites);
    } else {
      let spritesArray = sprites[0];
      flowSprites(spritesArray);
    }
  }

  //flowUp
  flowUp(padding, ...sprites) {
    let flowSprites = (spritesToFlow) => {
      if (spritesToFlow.length > 0) {
        for (let i = 0; i < spritesToFlow.length - 1; i++) {
          let sprite = spritesToFlow[i];
          sprite.putTop(spritesToFlow[i + 1], 0, -padding);
        }
      }
    };
    if (!(sprites[0] instanceof Array)) {
      flowSprites(sprites);
    } else {
      let spritesArray = sprites[0];
      flowSprites(spritesArray);
    }
  }

  //7. SPRITE PROPERTIES

  //The sprite creation methods above all run the `addProperties`
  //method on each sprite they create. `addProperties` adds special
  //properties and methods (super powers!) to Hexi sprites.

  addProperties(o) {

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
    o.swapChildren = (child1, child2) => {
      let index1 = o.children.indexOf(child1),
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
    o.add = (...sprites) => {
      if (sprites.length > 1) {
        sprites.forEach(sprite => o.addChild(sprite));
      } else {
        o.addChild(sprites[0]);
      }
    };
    o.remove = (...sprites) => {
      if (sprites.length > 1) {
        sprites.forEach(sprite => o.removeChild(sprite));
      } else {
        o.removeChild(sprites[0]);
      }
    };

    //The `put` methods are conveniences that help you position a
    //another sprite in and around this sprite.
    //First, get a short form reference to the sprite to make the code
    //easier to read
    let a = o;

    //The `nudgeAnchor`, `compensateForAnchor` and
    //`compensateForAnchors` (with an "s"!) methods are used by
    //the `put` methods to adjust the position of the sprite based on
    //its x/y anchor point.
    let nudgeAnchor = (o, value, axis) => {
      if (o.anchor !== undefined) {
        if (o.anchor[axis] !== 0) {
          return value * ((1 - o.anchor[axis]) - o.anchor[axis]);
        } else {
          return value;
        }
      } else {
        return value;
      }
    };

    let compensateForAnchor = (o, value, axis) => {
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

    let compensateForAnchors = (a, b, property1, property2) => {
      return compensateForAnchor(a, a[property1], property2) + compensateForAnchor(b, b[property1], property2)
    };

    //The `put` methods:
    //Center a sprite inside this sprite. `xOffset` and `yOffset`
    //arguments determine by how much the other sprite's position
    //should be offset from the center. These methods use the
    //sprites' global coordinates (`gx` and `gy`).
    //In all these functions, `b` is the second sprite that is being
    //positioned relative to the first sprite (this one), `a`.
    //Center `b` inside `a`.
    o.putCenter = (b, xOffset = 0, yOffset = 0) => {
      if (o._stage) a = this.compensateForStageSize(o);
      //b.x = (a.x + a.halfWidth - (b.halfWidth * ((1 - b.anchor.x) - b.anchor.x))) + xOffset;
      b.x = (a.x + nudgeAnchor(a, a.halfWidth, "x") - nudgeAnchor(b, b.halfWidth, "x")) + xOffset;
      b.y = (a.y + nudgeAnchor(a, a.halfHeight, "y") - nudgeAnchor(b, b.halfHeight, "y")) + yOffset;

      //Compensate for the parent's position
      if (!o._stage) o.compensateForParentPosition(a, b);
    };

    //Position `b` to the left of `a`.
    o.putLeft = (b, xOffset = 0, yOffset = 0) => {
      if (o._stage) a = this.compensateForStageSize(o);
      b.x = (a.x - nudgeAnchor(b, b.width, "x")) + xOffset - compensateForAnchors(a, b, "width", "x");
      b.y = (a.y + nudgeAnchor(a, a.halfHeight, "y") - nudgeAnchor(b, b.halfHeight, "y")) + yOffset;

      //Compensate for the parent's position
      if (!o._stage) o.compensateForParentPosition(a, b);
    };

    //Position `b` above `a`.
    o.putTop = (b, xOffset = 0, yOffset = 0) => {
      if (o._stage) a = this.compensateForStageSize(o);
      b.x = (a.x + nudgeAnchor(a, a.halfWidth, "x") - nudgeAnchor(b, b.halfWidth, "x")) + xOffset;
      b.y = (a.y - nudgeAnchor(b, b.height, "y")) + yOffset - compensateForAnchors(a, b, "height", "y");

      //Compensate for the parent's position
      if (!o._stage) o.compensateForParentPosition(a, b);
    };

    //Position `b` to the right of `a`.
    o.putRight = (b, xOffset = 0, yOffset = 0) => {
      if (o._stage) a = this.compensateForStageSize(o);
      b.x = (a.x + nudgeAnchor(a, a.width, "x")) + xOffset + compensateForAnchors(a, b, "width", "x");
      b.y = (a.y + nudgeAnchor(a, a.halfHeight, "y") - nudgeAnchor(b, b.halfHeight, "y")) + yOffset;
      //b.x = (a.x + a.width) + xOffset;
      //b.y = (a.y + a.halfHeight - b.halfHeight) + yOffset;

      //Compensate for the parent's position
      if (!o._stage) o.compensateForParentPosition(a, b);
    };

    //Position `b` below `a`.
    o.putBottom = (b, xOffset = 0, yOffset = 0) => {
      if (o._stage) a = this.compensateForStageSize(o);
      //b.x = (a.x + a.halfWidth - b.halfWidth) + xOffset;
      b.x = (a.x + nudgeAnchor(a, a.halfWidth, "x") - nudgeAnchor(b, b.halfWidth, "x")) + xOffset;
      //b.y = (a.y + a.height) + yOffset;
      b.y = (a.y + nudgeAnchor(a, a.height, "y")) + yOffset + compensateForAnchors(a, b, "height", "y");

      //Compensate for the parent's position
      if (!o._stage) o.compensateForParentPosition(a, b);
    };

    //`compensateForParentPosition` is a helper function for the above
    //`put` methods that subracts the parent's global position from
    //the nested child's position.
    o.compensateForParentPosition = (a, b) => {
      if (b.parent.gx !== 0 || b.parent.gy !== 0) {
        b.x -= a.gx;
        b.y -= a.gy;
      }
    };

    let self = this;
    Object.defineProperties(o, {
      "gx": {
        get() {
          return o.getGlobalPosition().x
        },
        enumerable: true,
        configurable: true
      },
      "gy": {
        get() {
          return o.getGlobalPosition().y
        },
        enumerable: true,
        configurable: true
      },
      "centerX": {
        get() {
          return o.x + (o.width / 2) - o.xAnchorOffset
        },
        enumerable: true,
        configurable: true
      },
      "centerY": {
        get() {
          return o.y + (o.height / 2) - o.yAnchorOffset
        },
        enumerable: true,
        configurable: true
      },
      "halfWidth": {
        get() {
          return o.width / 2
        },
        enumerable: true,
        configurable: true
      },
      "halfHeight": {
        get() {
          return o.height / 2
        },
        enumerable: true,
        configurable: true
      },
      "scaleModeNearest": {
        set(value) {
          if (o.texture.baseTexture) {
            if (value) {
              o.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
            } else {
              o.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.LINEAR;
            }
          } else {
            throw new Error(`The scale mode of ${o} cannot be modified`)
          }
        },
        enumerable: true,
        configurable: true
      },
      "pivotX": {
        get() {
          return o.anchor.x
        },
        set(value) {
          if (o.anchor === undefined) {
            throw new Error(`${o} does not have a PivotX value`);
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
        get() {
          return o.anchor.y
        },
        set(value) {
          if (o.anchor === undefined) {
            throw new Error(`${o} does not have a PivotY value`);
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
        get() {
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
        get() {
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
        get() {
          return o.scale.x
        },
        set(value) {
          o.scale.x = value;
        },
        enumerable: true,
        configurable: true
      },
      "scaleY": {
        get() {
          return o.scale.y
        },
        set(value) {
          o.scale.y = value;
        },
        enumerable: true,
        configurable: true
      },

      //Depth layer
      "layer": {
        get() {
          return o._layer
        },
        set(value) {
          o._layer = value;
          if (o.parent) {

            //Sort the sprite’s parent’s `children` array so that sprites with a
            //higher `layer` value are moved to the end of the array
            o.parent.children.sort((a, b) => a.layer - b.layer);
          }
        },
        enumerable: true,
        configurable: true
      },

      //Interactivity
      "interact": {
        get() {
          return o._interact
        },
        set(value) {
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
        get() {
          return o._draggable
        },
        set(value) {
          if (value === true) {
            if (!o._draggable) {
              self.makeDraggable(o);
              o._draggable = true;
            }
          } else {
            self.makeUndraggable(o)
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
        get() {
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
        get() {
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
        get() {
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
        get() {
          return o._circular;
        },
        set(value) {

          //Give the sprite `diameter` and `radius` properties
          //if `circular` is `true`
          if (value === true && o._circular === false) {
            Object.defineProperties(o, {
              "diameter": {
                get() {
                  return o.width;
                },
                set(value) {
                  o.width = value;
                  o.height = value;
                },
                enumerable: true,
                configurable: true
              },
              "radius": {
                get() {
                  return o.halfWidth;
                },
                set(value) {
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
    o.setPosition = (x, y) => {
      o.x = x;
      o.y = y;
    };

    //A similar `setScale` convenience method
    o.setScale = (xScale, yScale) => {
      o.scale.x = xScale;
      o.scale.y = yScale;
    };

    //And a matching `setPivot` method
    o.setPivot = (xPivot, yPivot) => {
      o.pivotX = xPivot;
      o.pivotY = yPivot;
    };

    if (o.circular) {
      Object.defineProperty(o, "radius", {
        get() {
          return o.width / 2
        },
        enumerable: true,
        configurable: true
      });
    }

  }

  //8. Utilities

  //A method to scale and align the canvas in the browser
  //window using the `scaleToWindow.js` function module
  scaleToWindow(scaleBorderColor = "#2C3539") {

    //Set the default CSS padding and margins of HTML elements to 0 
    //<style>* {padding: 0; margin: 0}</style>
    let newStyle = document.createElement("style");
    let style = "* {padding: 0; margin: 0}";
    newStyle.appendChild(document.createTextNode(style));
    document.head.appendChild(newStyle);

    //Use the `scaleToWindow` function module to scale the canvas to
    //the maximum window size
    this.scale = scaleToWindow(this.canvas, scaleBorderColor);
    console.log("new scale: " + this.scale)
    this.pointer.scale = this.scale;
    //this.pointer = this.makePointer(this.canvas, this.scale);
    console.log(this.pointer)

    //Re-scale on each browser resize
    window.addEventListener("resize", event => {
      //Scale the canvas and update Hexi's global `scale` value and
      //the pointer's `scale` value
      this.scale = scaleToWindow(this.canvas, scaleBorderColor);
      this.pointer.scale = this.scale;
    });

    //Flag that the canvas has been scaled
    this.canvas.scaled = true;
  }

  //`log` is a shortcut for `console.log`, so that you have less to
  //type when you're debugging
  log(value) {
    return console.log(value);
  }

  //The `makeProgressBar` method creates a `progressBar` object with
  //`create`, `update` and `remove` methods. It's called by the
  //`loadingBar` method, which should be run inside the `load`
  //function of your application code. 
  makeProgressBar(hexiObject) {

    let hexi = hexiObject;

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
      create() {

        //Set the maximum width to half the width of the canvas
        this.maxWidth = hexi.canvas.width / 2;

        //Build the progress bar using two rectangle sprites and
        //one text sprite

        //1. Create the background bar's gray background
        this.backBar = hexi.rectangle(this.maxWidth, 32, this.backgroundColor);
        this.backBar.x = (hexi.canvas.width / 2) - (this.maxWidth / 2);
        this.backBar.y = (hexi.canvas.height / 2) - 16;

        //2. Create the blue foreground bar. This is the element of the
        //progress bar that will increase in width as assets load
        this.frontBar = hexi.rectangle(this.maxWidth, 32, this.foregroundColor);
        this.frontBar.x = (hexi.canvas.width / 2) - (this.maxWidth / 2);
        this.frontBar.y = (hexi.canvas.height / 2) - 16;

        //3. A text sprite that will display the percentage
        //of assets that have loaded
        this.percentage = hexi.text("0%", "28px sans-serif", "black");
        this.percentage.x = (hexi.canvas.width / 2) - (this.maxWidth / 2) + 12;
        this.percentage.y = (hexi.canvas.height / 2) - 17;
      },

      //Use the `update` method to update the width of the bar and 
      //percentage loaded each frame
      update() {

        //Change the width of the blue `frontBar` to match the
        //ratio of assets that have loaded.
        let ratio = hexi.loadingProgress / 100;
        //console.log(`ratio: ${ratio}`);
        this.frontBar.width = this.maxWidth * ratio;

        //Display the percentage
        this.percentage.content = `${Math.round(hexi.loadingProgress)} %`;
      },

      //Use the `remove` method to remove the progress bar when all the
      //game assets have finished loading
      remove() {

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
  loadingBar() {

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
  compensateForStageSize(o) {
    if (o._stage === true) {
      let a = {};
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
  image(imageFileName) {
    if (this.TextureCache[imageFileName]) {
      return this.TextureCache[imageFileName];
    } else {
      throw new Error(`${imageFileName} does not appear to be an image`);
    }
  }
  id(textureAtlasFrameId) {
    if (this.TextureCache[textureAtlasFrameId]) {
      return this.TextureCache[textureAtlasFrameId];
    } else {
      throw new Error(`${textureAtlasFrameId} does not appear to be a texture atlas frame id`);
    }
  }
  json(jsonFileName) {
    if (this.loader.resources[jsonFileName].data) {
      return this.resources[jsonFileName].data;
    } else {
      throw new Error(`${jsonFileName} does not appear to be a JSON data file`);
    }
  }
  xml(xmlFileName) {
    if (this.loader.resources[xmlFileName].data) {
      return this.resources[xmlFileName].data;
    } else {
      throw new Error(`${xmlFileName} does not appear to be a XML data file`);
    }
  }
  sound(soundFileName) {
    if (this.soundObjects[soundFileName]) {
      return this.soundObjects[soundFileName];
    } else {
      throw new Error(`${soundFileName} does not appear to be a sound object`);
    }
  }
}