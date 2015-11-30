/*
Hexi has a suite of easy-to-use and versatile tweening
effects for games. See the code below to find out how 
to use them.
*/

//Create a new Hexi instance, and start it.
let g = hexi(1024, 512, setup, ["images/animals.json"]);
g.start();

//Set the background color and scale the canvas
//g.backgroundColor = "black";
g.scaleToWindow();

//Declare variables used in more than one function
let cat1, cat2, hedgehog1, hedgehog2, tiger1, tiger2,
    text1, text2, text3, text4, text5, text6;

//The `setup` function to initialize your application
function setup() {

  //Create some sprites 
  cat1 = g.sprite("cat.png");
  text1 = g.text("slide", "20px Futura", "black");
  tiger1 = g.sprite("tiger.png");
  tiger1.setPosition(128, 128);
  text2 = g.text("slide with bounce", "20px Futura", "black");
  hedgehog1 = g.sprite("hedgehog.png");
  hedgehog1.setPosition(20, 300);
  text3 = g.text("pulse", "20px Futura", "black");
  cat2 = g.sprite("cat.png");
  cat2.setPosition(212, 300);
  text4 = g.text("breathe", "20px Futura", "black");
  tiger2 = g.sprite("tiger.png");
  tiger2.setPosition(404, 300);
  text5 = g.text("strobe", "20px Futura", "black");
  hedgehog2 = g.sprite("hedgehog.png");
  hedgehog2.setPosition(596, 300);
  text6 = g.text("wobble", "20px Futura", "black");

  //Add the text to the sprites
  cat1.addChild(text1);
  cat1.putRight(text1, 32);
  tiger1.addChild(text2);
  tiger1.putBottom(text2, 32);
  hedgehog1.addChild(text3);
  hedgehog1.putBottom(text3, -8, 16);
  cat2.addChild(text4);
  cat2.putBottom(text4, -32, 16);
  tiger2.addChild(text5);
  tiger2.putBottom(text5, -32, 16);
  hedgehog2.addChild(text6);
  hedgehog2.putBottom(text6, -32, 16);

  /*Slide effects*/

  /*
  Make the cat move back and forth. Create a new tween object
  using the `slide` method.

  `slide` arguments: sprite, endX, endY, durationInFrames,
  easingType, yoyo?, delayInMilleseconsBeforeRepeating

  If you want the effect to repeat in a continuous loop, just
  set `yoyo` (the 6th argument) to `true`.

  (Only the first 3 arguments are required, the rest are optional.)
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

  Try using different easing types to see the effect.
  */

  let catSlide = g.slide(cat1, 400, 0, 60, "smoothstep", true, 0);

  //Tween objects have an `onComplete` callback function that you can
  //define. It will run when the tween is finished. Use it like this:

  //catSlide.onComplete = () => console.log("Cat slide complete");

  //A special easing type (the 5th argument) called "bounce" has two
  //additional values you can assign: a start magnitude and an end
  //magnitude. This gives the tween a bit of extra bounce at its start
  //and end points. "5" and "-5" are good values to start, but
  //experiment with different values
  let tigerSlide = g.slide(tiger1, 528, tiger1.y, 120, "bounce 5 -5", true, 0);

  /* Fade effects */

  //Use `pulse` to make a sprite fade in and out.
  //`pulse` arguments: sprite, durationInFrames, minimumAlphaValue
  let hedgehogPulse = g.pulse(hedgehog1, 120, 0.3); 

  //Optionally, find out when the each portion of the tween has
  //completed by using an `onComplete` method.
  //hedgehogPulse.onComplete = () => {console.log("Hedgehog pulse complete")};

  /*
  You can also use `fadeIn` and `fadeOut`, using this format:
  var spriteFade = g.fadeIn(sprite, durationInFrames);
  */

  /* Scale effects */
  //These scale effects look best if the sprites have their
  //`pivotX` and `pivotY` properties set to 0.5
  cat2.setPivot(0.5, 0.5);
  tiger2.setPivot(0.5, 0.5);
  hedgehog2.setPivot(0.5, 0.5);

  //Use `breathe` to scale a sprite in and out in a simulated
  //breathing effect.
  //`breathe` arguments: sprite, finalXScale, finalYScale, 
  //durationInFrames, delayInMillsecondsBeforeRepeating
  let catBreathe = g.breathe(cat2, 1.4, 1.4, 60, true, 300);

  /*
  You can also use `scale` to smoothly scale a sprite by a fixed
  scaled amount. Use this format:
  var spriteScale = g.scale(sprite, finalScaleX, finalScaleY, frames);
  */

  //Use `strobe` to create a flashing effect.
  //`strobe` arguments: sprite, scaleFactor, startMagnitude, endMagnitude, 
  //frames, yoyo?, delayInMillisecondsBeforeRepeating
  let tigerStrobe = g.strobe(tiger2, 1.3, 10, 20, 10);

  //Use `wobble` to make a sprite wobble like a plate of jelly.
  //Use the default values, or experiment with your own values
  //to find an effect you like.
  //`wobble` arguments: sprite, scaleFactorX, scaleFactorY, frames,
  //xStartMagnitude, xEndMagnitude, yStartMagnitude, yEndMagnitude,
  //friction, yoyo, delayBeforeRepeat
 
  let hedgehogWobble = g.wobble(hedgehog2, 1.8, 1.8);

  //Tweens are updated independently in Hexi's internal 
  //game engine loop, so there's no need to update them in
  //your own `play` state to make them work.
}


