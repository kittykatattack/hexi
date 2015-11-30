"use strict";

/*
This is a quick introduction on how to make game scenes and
use Hexi's tweening effects. (For more details on how to use
tweening effects, see the `tweening.html` example file.)
*/

//Create a new Hexi instance, and start it.
var g = hexi(256, 256, setup, ["fonts/puzzler.otf"]);
g.start();

//Set the background color and scale the canvas
//g.backgroundColor = "black";
g.scaleToWindow();

//Declare variables used in more than one function
var sceneOne, blackSquare, messageOne, sceneTwo, blueSquare, messageTwo, oneTween, twoTween;

//The `setup` function to initialize your application
function setup() {

  //Make a black square and some text
  blackSquare = g.rectangle(128, 128, "black");
  messageOne = g.text("One", "16px puzzler", "white");

  //Use `setPosition` to set the `x` and `y`
  //value with one line of code
  messageOne.setPosition(40, 52);

  /*
  Create a `group` called `sceneOne` and add the
  `blackSquare` and `messageOne` to it.
  Groups are empty containers for sprites. You can think of them
  as a special kind of sprite that doesn't display its own image. a
  group's job is 
  just to display the sprites that are inside it. Groups have the
  all same properties as ordinary sprites, so any changes that you
  make the parent, such as its size, position or visibility, will
  affect the child sprites that it contains. The `width` and
  `height` of the group is determined by the size and position of
  the sprites inside it. Whenever you use `addChild` or `removeChild` to 
  add or remove a sprite from a group, the group's `width` and `height`
  is recalculated based on what it contains
  */

  sceneOne = g.group(blackSquare, messageOne);

  //Alternatively, you could first create an empty group and
  //use `addChild` to add the sprites, like this:
  /*
  sceneOne = g.group();
  sceneOne.addChild(blackSquare);
  sceneOne.addChild(messageOne);
  */

  //Make a blue square and some text.
  blueSquare = g.rectangle(128, 128, "cyan");
  messageTwo = g.text("Two", "16px puzzler", "red");
  messageTwo.setPosition(40, 52);

  //Create a `sceneTwo` group and add `blueSquare` and
  //`messageTwo`
  sceneTwo = g.group(blueSquare, messageTwo);
  sceneTwo.x = 128;
  sceneTwo.y = 128;

  //You can change the depth layers of sprites
  //or groups or sprites using the `layer` property
  //sceneOne.layer = 1;
  //sceneTwo.layer = 2;

  /*
  Tweening
  Use one of Ga's many built in tween functions to make the 
  scene groups move. Here's how to use the `slide` method to 
  make the scenes move, in a continuous loop, between the top and
  bottom corners of the screen. There's a delay of 2000 milliseconds
  between each repetition of the tween.
  `slide` arguments: sprite, endX, endY, durationInFrames,
  easingType, yoyo?, delayInMilleseconsBeforeRepeating
  (Only the first 3 arguments are required, the rest are optional and
  default to sensible values.)
  The easing type (the 5th argument) can be any of the following
  string values:
     "linear"
    "smoothstep" (the default value)
    "smoothstepSquared"
    "smoothstepCubed"
    "acceleration"
    "accelertationCubed"
    "deceleration"
    "decelerationCubed"
    "sine"
    "sineSquared"
    "sineCubed"
    "inverseSine"
    "inverseSineSquared"
    "inverseSineCubed"
   Experiment by assigning different easing types and observe the
  effect.
    
  If you don't what the effect to repeat in a continuous loop, just
  set `yoyo` (the 6th argument) to `false`.
  */

  oneTween = g.slide(sceneOne, 128, 128, 60, "smoothstep", true, 2000);
  twoTween = g.slide(sceneTwo, 0, 0, 60, "smoothstep", true, 2000);

  /*
  There are many more tween effects you can use, including `pulse`,
  `breathe`, `fadeIn`, `fadeOut`, `scale`, `wobble`, and `strobe`.
  (See the `tweening.html file for more examples.)
  */

  //All tween objects have a user-definable `onComplete` methods that
  //will be called automatically when tweens are finished.
  oneTween.onComplete = function () {

    //Write a message to the console that the tween is finished
    console.log("Slide finished");

    //Here's a neat effect. Use the stage's (the root container's)
    //`swapChildren` method to swap the scene depth layers when
    //the `slide` is finished. This makes it look like the scenes
    //are circling above and below each other in shallow 3D space.
    g.stage.swapChildren(sceneOne, sceneTwo);
  };

  /*
  You can combine tween effects so that one sprite can have multiple
  effects acting on it at any one time. Here's how you can use Ga's
  built-in `wait` method to wait for for 5 seconds (5000 milliseconds)
  and then run a `pulse` tween on `sceneOne`:
  */

  //Wait for 5 seconds
  g.wait(5000, function () {

    //... then use `pulse` to make a sprite fade in and out, in a
    //continuous loop.
    //`pulse` arguments: sprite, durationInFrames, minimumAlphaValue
    g.pulse(sceneOne, 30, 0.3);
  });

  /*
  You can use `fadeIn` and `fadeOut` if you just want the fade effect
  to happen once. Here's the format those methods use:
  var spriteFade = g.fadeIn(sprite, durationInFrames);
  */
}
//# sourceMappingURL=scenesAndTweening.js.map