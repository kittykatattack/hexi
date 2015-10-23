//Make sure to load Pixi and the modules before instantiating Hexi

class Hexi{

  /*
  Initialize Hexi's constructor with an options object literal called `o`. 
  Here are the required options:

  `width`: Value in pixels that describes the canvas's width
  `height`: Value in pixels that describes the canvas's height
  `setup`: A function that should run as soon as Hexi is initialized

  Here are the optional options:

  `assets`: Array of assets (files) that should be loaded
  `load`: A function that should run while Hexi is loading asssets
  `renderer`: The tpe of renderer to use: "auto" (the default), "canvas" or "webgl"
  `backgroundColor`: Hexadecimal color code that defines the canvas color
  `border`: The canvas border style as a CSS border string, such as "1px dashed black"
  `scaleToWindow`: A Boolean that determines whether the canvas should scale to maximum window size
  `scaleBorderColor`: Color string that defines the color of the border around a scaled canvas.
  `interpolationProperties: An object that defines 5 Boolean properties that determines which sprite properties are interpolated 
                            (smoothly animated) by Hexi's rendering engine (Smoothie): `position`, `size`, `rotation`, `scale` or `alpha`
  `interpolate`: A Boolean which should be `false` if you *don't* want any sprite animation smoothing
  `fps`: The frames-per-second the engine's game logic loop should run at (the default is 60)

  You can also add any of Pixi's initialization options, and those will be applied 
  to Pixi's renderer when Hexi creates it.

  */
  constructor(o){

    //Initialize all the helper libraries
    this.charm = new Charm(PIXI);
    this.dust = new Dust(PIXI);
    this.bump = new Bump(PIXI);
    this.tink = new Tink(PIXI);
    this.spriteUtilities = new SpriteUtilities(PIXI);

    //Any modules that have an `update` method that should updated
    //each frame in the game loop should be added to the
    //`modulesToUpdate` array. The game loop will call the `update`
    //method on each of these modules while the game is running.
    //This is very efficient and does not effect performance: no modules are updated unless they
    //contain objects that need updating.
    this.modulesToUpdate = [];
    this.modulesToUpdate.push(this.charm);
    this.modulesToUpdate.push(this.dust);
    this.modulesToUpdate.push(this.tink);

    //Create local alias for the important methods and properties of
    //these libraries, including the most useful Pixi properties
    this.createModulePropertyAliases();

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
    } else if(o.renderer === "canvas") {
      this.renderer = new PIXI.CanvasRenderer(
        o.width, 
        o.height,
        o
      );

    //WebGL renderer
    } else if(o.renderer === "webgl") {
      this.renderer = new PIXI.WebGLRenderer(
        o.width, 
        o.height,
        o
      );
    }

    //Get a reference to the `renderer.view`, which is the
    //HTML canvas element
    this.canvas = this.renderer.view;

    //Add `halfWidth` and `halfHeight` properties to the canvas
    Object.defineProperties.bind(this, this.canvas, {
      "halfWidth": {
        get(){return this.canvas.width / 2},
        enumerable: true, configurable: true
      },
      "halfHeight": {
        get(){return this.canvas.height / 2},
        enumerable: true, configurable: true
      }
    });

    //Set the canvas's optional background color and border style
    if (o.backgroundColor) {
      this.renderer.backgroundColor = o.backgroundColor;
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

      //Set the default CSS padding and margins of HTML elements to 0 
      //<style>* {padding: 0; margin: 0}</style>
      let newStyle = document.createElement("style");
      let style = "* {padding: 0; margin: 0}";
      newStyle.appendChild(document.createTextNode(style));
      document.head.appendChild(newStyle);
      
      //Use the `scaleToWindow` function module to scale the canvas to
      //the maximum window size
      this.scale = scaleToWindow(this.canvas, o.scaleBorderColor);
      window.addEventListener("resize", event => { 
        scaleToWindow(this.canvas, o.scaleBorderColor);
      });
    } else {
      this.scale = 1;
    }

    //Make the pointer
    this.pointer = this.makePointer(this.canvas, this.scale);

    //Set the game `state`
    this.state = undefined;

    //Set the user-defined `load` and `setup` states
    if(o.load !== undefined) this.loadState = o.load;
    
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
    if(o.assets !== undefined) {
      this.assetsToLoad = o.assets;
    }

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
      renderFps: o.renderFps
    });

    //Add smoothie aliases to Hexi
    //this.interpolate = this.smoothie.interpolate;
    //this.fps = this.smoothie.fps;

    /*
    //A Boolean to let us pause the game
    this.paused = false;

    //The upper-limit frames per second that the game should run at.
    //Ga defaults to 60 fps.
    this._fps = 12;
    this._startTime = Date.now();
    this._frameDuration = 1000 / this._fps;
    this._lag = 0;

    //Set sprite rendering position interpolation to
    //`true` by default
    this.interpolate = true;
    console.log(`interpolate: ${this.interpolate}`);
    */
  }

  //Use the `load` method to load any files into Hexi. Pass it a 
  //callback function as the second argument to launch a function that
  //should run when all the assets have finished loading.
  load(assetsToLoad, callbackFunction = undefined) {
    this.loader.reset();
    this.loadingProgress = 0;
    this.loadingFile = "";
    this.loader
      .add(assetsToLoad)
      .on("progress", loadProgressHandler)
      .load(callbackFunction.bind(this));

    function loadProgressHandler(loader, resource){

      //Display the file `url` currently being loaded
      //console.log(`loading: ${resource.url}`); 
      this.loadingFile = resource.url;

      //Display the percentage of files currently loaded
      //console.log(`progress: ${loader.progress}`); 
      this.loadingProgress = loader.progress;
    }
  }

  validateAssets(){
    console.log("All assets loaded");

    //Reset the `assetsToLoad` array
    this.assetsToLoad = [];

    //Clear the `loadState`
    this.loadState = undefined;

    //Clear the game `state` function for now to stop the loop.
    this.state = undefined;

    //Call the `setup` state
    this.setupState();
  }

  start(){

    //If there are assets to load, load them, and set the game's state
    //to the user-defined `loadState`
    if (this.assetsToLoad) {
      this.load(this.assetsToLoad, this.validateAssets);
      if (this.loadState) this.state = this.loadState;
    }
    else {

      //If there's nothing to load, run the `setup` state, which will
      //just run once
      this.setupState();
    }

    //Start the game loop
    //this.gameLoop();
    this.smoothie.start();
  }

  //A function that helpfully creates local references to the
  //most useful properties and methods from the loaded modules
  createModulePropertyAliases() {

    //Pixi
    this.Container = PIXI.Container;
    this.loader = PIXI.loader;
    this.resources = PIXI.loader.resources;
    this.TextureCache = PIXI.utils.TextureCache;

    //Tink
    this.draggableSprites = this.tink.draggableSprites;
    this.pointers = this.tink.pointers;
    this.buttons = this.tink.buttons;
    this.makePointer = (canvas, scale) => this.tink.makePointer(canvas, scale);
    this.makeDraggable = (...sprites) => this.tink.makeDraggable(...sprites);
    this.makeUndraggable = (...sprites) => this.tink.makeUndraggable(...sprites);
    this.makeInteractive = (o) => this.tink.makeInteractive(o);
    this.button = (source, x = 0, y = 0) => this.tink.button(source, x, y);
    this.keyboard = this.tink.keyboard;

    //SpriteUtilities
    this.filmstrip = (texture, frameWidth, frameHeight, spacing) => this.spriteUtilities.filmstrip(texture, frameWidth, frameHeight, spacing);
    this.frame = (source, x, y, width, height) => this.spriteUtilities.frame(source, x, y, width, height);
    this.frames = (source, coordinates, frameWidth, frameHeight) => this.spriteUtilities.frames(source, coordinates, frameWidth, frameHeight);
    this.frameSeries = (startNumber, endNumber, baseName, extension) => this.spriteUtilities.frames(startNumber, endNumber, baseName, extension);

    //Charm
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
      return this.strobe(sprite, scaleFactor, startMagnitude, endMagnitude, frames, yoyo, delayBeforeRepeat);
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
      return this.walkCurve(sprite, pathArray, totalFrames, type, loop, yoyo, delayBeforeContinue);
    };
    this.removeTween = (tweenObject) => this.charm.removeTween(tweenObject);
    this.makeTween = (tweensToAdd) => this.charm.makeTween(tweensToAdd);
    this.tweenProperty = (sprite, property, startValue, endValue, totalFrames, type = "smoothstep", yoyo = false, delayBeforeRepeat = 0) => {
      return this.charm.tweenProperty(sprite, property, startValue, endValue, totalFrames, type, yoyo, delayBeforeRepeat);
    };

    //Bump
    this.hitTestPoint = (point, sprite) => this.bump.hitTestPoint(point, sprite);
    this.hitTestCircle = (c1, c2, global = false) => this.bump.hitTestCircle(c1, c2, global);
    this.circleCollision = (c1, c2, bounce = false, global = false) => this.bump.circleCollision(c1, c2, bounce, global);
    this.movingCircleCollision = (c1, c2, global = false) => this.bump.movingCircleCollision(c1, c2, global);
    this.multipleCircleCollision = (arrayOfCircles, global = false) => this.bump.multipleCircleCollision(arrayOfCircles, global);
    this.rectangleCollision = (r1, r2, bounce = false, global = true) => this.bump.rectangleCollision( r1, r2, bounce, global);
    this.hitTestRectangle = (r1, r2, global = false) => this.hitTestRectangle(r1, r2, global);
    this.hitTestCircleRectangle = (c1, r1, global = false) => this.bump.hitTestCircleRectangle(c1, r1, global);
    this.hitTestCirclePoint = (c1, point, global = false) => hitTestCirclePoint(c1, point, global);
    this.circleRectangleCollision = (c1, r1, bounce = false, global = false) => this.bump.circleRectangleCollision(c1, r1, bounce, global);
    this.circlePointCollision = (c1, point, bounce = false, global = false) => this.bump.circlePointCollision(c1, point, bounce, global);
    this.bounceOffSurface = (o, s) => this.bump.bounceOffSurface(o, s);
    this.hit = (a, b, react = false, bounce = false, global, extra = undefined) => this.bump.hit(a, b, react, bounce, global, extra);
  }

  //Intercept the Bump library's `contain` method to make sure that
  //the stage `width` and `height` match the canvas width and height
  contain(sprite, container) {
    let o = {};
    if (container._stage) {
      o = this.compensateForStageSize(container);
    } else {
      console.log("stage!")
      o = container
    }
    return this.bump.contain(sprite, o);
  }

  //Hexi's root `stage` object will have a width and height equal to
  //its contents, not the size of the canvas. So, let's use the more
  //useful canvas width and height for relative positioning instead 
  compensateForStageSize(o) {
    if(o._stage) {
      a = {};
      a.x = 0;
      a.y = 0;
      a.width = this.canvas.width;
      a.height = this.canvas.height;
      a.halfWidth = this.canvas.width / 2;
      a.halfHeight = this.canvas.height / 2;
      return a
    }
  }

  //Add Smoothie getters and setters to access the `fps` and
  //`interpolate` properties
  get fps() {return this.smoothie.fps;}
  set fps(value) {this.smoothie.fps = value;}
  get interpolate() {return this.smoothie.interpolate;}
  set interpolate(value) {this.smoothie.interpolate = value;}

  update() {

    //Update all the modules in the `modulesToUpdate` array.
    //These are modules that contain `update` methods that need to be
    //called every frame
    this.modulesToUpdate.forEach(module => module.update());

    //Run the current game `state` function if it's been defined and
    //the game isn't `paused`
    if (this.state && !this.paused) {
      this.state();
    }

    //Render the stage
    //this.renderer.render(this.stage);
  }

  //Pause and resume methods
  pause() {
    this.paused = true;
  }
  resume() {
    this.paused = false;
  }

  //Hexi's `sprite` method uses the `sprite` method from
  //SpriteUtilities but, as a helpful bonus, automatically adds it to Hexi's 
  //`stage` container. (The `stage` is Hexi's root container for all
  //Hexi sprites.) Hexi's sprite method also adds a whole bunch of
  //extra, useful properties and methods to the base Pixi `Sprite` and
  //`MovieClip` objects
  sprite(source, x = 0, y = 0, tiling = false, width, height){
    let sprite = this.spriteUtilities.sprite(source, x, y, tiling, width, height);
    this.addProperties(sprite);
    this.stage.addChild(sprite);
    return sprite;
  }

  //Hexi's `text` method is a quick way to create a Pixi Text sprite
  //and add it to the stage
  text(content = "message", font = "16px sans", fillStyle = "red", x = 0, y = 0) {
    let message = this.spriteUtilities.text(content, font, fillStyle, x, y);
    this.addProperties(message);
    this.stage.addChild(message);
    return message;
  }

  //A method that adds extra properties and methods to the base Pixi
  //Container, `Sprite`,`MovieClip` objects.
  addProperties(o){

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
        sprites.forEach(sprite  => o.addChild(sprite));
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
    //First, get a short form reference to the sprite to make the code more
    //easier to read
    let a = o;

    //Center a sprite inside this sprite. `xOffset` and `yOffset`
    //arguments determine by how much the other sprite's position
    //should be offset from the center. These methods use the
    //sprites' global coordinates (`gx` and `gy`).
    //In all these functions, `b` is the second sprite that is being
    //positioned relative to the first sprite (this one), `a`.
    //Center `b` inside `a`.
    o.putCenter = (b, xOffset = 0, yOffset = 0) => {
      if (o._stage) a = this.compensateForStageSize(o);
      xOffset = xOffset || 0;
      yOffset = yOffset || 0;
      b.x = (a.x + a.halfWidth - b.halfWidth) + xOffset;
      b.y = (a.y + a.halfHeight - b.halfHeight) + yOffset;

      //Compensate for the parent's position
      if(!o._stage) o.compensateForParentPosition(a, b);
    };

    //Position `b` above `a`.
    o.putTop = (b, xOffset = 0, yOffset = 0) => {
      if (o._stage) a = this.compensateForStageSize(o);
      xOffset = xOffset || 0;
      yOffset = yOffset || 0;
      b.x = (a.x + a.halfWidth - b.halfWidth) + xOffset;
      b.y = (a.x - b.height) + yOffset;

      //Compensate for the parent's position
      if(!o._stage) o.compensateForParentPosition(a, b);
    };

    //Position `b` to the right of `a`.
    o.putRight = (b, xOffset = 0, yOffset = 0) => {
      if (o._stage) a = this.compensateForStageSize(o);
      xOffset = xOffset || 0;
      yOffset = yOffset || 0;
      b.x = (a.x + a.width) + xOffset;
      b.y = (a.y + a.halfHeight - b.halfHeight) + yOffset;

      //Compensate for the parent's position
      if(!o._stage) o.compensateForParentPosition(a, b);
    };

    //Position `b` below `a`.
    o.putBottom = (b, xOffset = 0, yOffset = 0) => {
      if (o._stage) a = this.compensateForStageSize(o);
      xOffset = xOffset || 0;
      yOffset = yOffset || 0;
      b.x = (a.x + a.halfWidth - b.halfWidth) + xOffset;
      b.y = (a.y + a.height) + yOffset;

      //Compensate for the parent's position
      if(!o._stage) o.compensateForParentPosition(a, b);
    };

    //Position `b` to the left of `a`.
    o.putLeft = (b, xOffset = 0, yOffset = 0) => {
      if (o._stage) a = this.compensateForStageSize(o);
      xOffset = xOffset || 0;
      yOffset = yOffset || 0;
      b.x = (a.x - b.width) + xOffset;
      b.y = (a.y + a.halfHeight - b.halfHeight) + yOffset;

      //Compensate for the parent's position
      if(!o._stage) o.compensateForParentPosition(a, b);
    };

    //`compensateForParentPosition` is a helper funtion for the above
    //`put` methods that subracts the parent's global position from
    //the nested child's position.
    o.compensateForParentPosition = (a, b) => {
      if (b.parent.gx !== 0 || b.parent.gy !== 0) {
        b.x -= a.gx;
        b.y -= a.gy;
      }
    };


    /*
    let createPivotContainer = (o) => {
      let pivotContainer = new this.Container();
      this.addProperties(pivotContainer);
      o.parent.addChild(pivotContainer);
      pivotContainer.x = o.x;
      pivotContainer.y = o.y;
      pivotContainer.addChild(o);
      o.x = 0;
      o.y = 0;
      o.pivotContainer = pivotContainer;
    };
    */

    Object.defineProperties(o, {
      "gx": {
        get(){return o.getGlobalPosition().x},
        enumerable: true, configurable: true
      },
      "gy": {
        get(){return o.getGlobalPosition().y},
        enumerable: true, configurable: true
      },
      "centerX": {
        get(){return o.x + o.width / 2},
        enumerable: true, configurable: true
      },
      "centerY": {
        get(){return o.y + o.height / 2},
        enumerable: true, configurable: true
      },
      "halfWidth": {
        get(){return o.width / 2},
        enumerable: true, configurable: true
      },
      "halfHeight": {
        get(){return o.height / 2},
        enumerable: true, configurable: true
      },
      /*
      "pivotX": {
        get(){return o.anchor.x},
        set(value) {
          if(!o.pivotContainer) createPivotContainer(o);
          let tempX = o.x;
          o.anchor.x = value;
          let difference = o.x - (value * o.width);
          o.pivotContainer.x -= difference; 
        },
        enumerable: true, configurable: true
      },
      "pivotY": {
        get(){return o.anchor.y},
        set(value) {
          if(!o.pivotContainer) createPivotContainer(o);
          let tempY = o.y;
          o.anchor.y = value;
          let difference = o.y - (value * o.height);
          o.pivotContainer.y -= difference; 
        },
        enumerable: true, configurable: true
      }
      */
      "pivotX": {
        get(){return o.anchor.x},
        set(value) {
          o.anchor.x = value;
          if (o._previousPivotX) {
            if (o_previousPivotX >= value) {
              o.x -= value * o.width; 
            } else {
              o.x += value * o.width;
            }
          } else {
             o.x += value * o.width; 
          }
          o_previousPivotX = value;
        },
        enumerable: true, configurable: true
      },
      "pivotY": {
        get(){return o.anchor.y},
        set(value) {
          o.anchor.y = value;
          if (o._previousPivotY) {
            if (o_previousPivotY >= value) {
              o.y -= value * o.height; 
            } else {
              o.y += value * o.height;
            }
          } else {
             o.y += value * o.height; 
          }
          o_previousPivotY = value;
        },
        enumerable: true, configurable: true
      }
    });
    //A `setPosition` convenience method to let you set the
    //x any y position of a sprite with one line of code.
    o.setPosition = (x, y) => {
      o.x = x;
      o.y = y;
    };

    //A similar `setScale` convenince method
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
        get(){return o.width / 2},
        enumerable: true, configurable: true
      });
    }

  }

  image(imageFileName) {}
  json(jsonFileName) {}
  sound(soundFileName) {}

}
