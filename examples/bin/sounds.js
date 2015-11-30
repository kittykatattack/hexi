"use strict";

/*
This file is a working example of how to use sounds in Hexi.
Hexi implements the latest version of "Sound.js" under the
hood.
Check out the "Sound.js" repository for full details on how
to control and generate sounds:

https://github.com/kittykatattack/sound.js

The only difference in Hexi's implementation is that you can pre-load sounds 
the same way that you can pre-load images and data files.
Also, after sounds have loaded you can access them like this:

    g.sound("sounds/anySound.mp3")

Let's find out how it all works:
*/

//Add the sounds you want to load to your `thingsToLoad` array
var thingsToLoad = ["sounds/shoot.wav", "sounds/music.wav", "sounds/explosion.wav", "fonts/PetMe64.ttf"];

//Create a new Hexi instance, and start it.
var g = hexi(512, 512, setup, thingsToLoad);
g.start();

//Set the background color and scale the canvas
g.backgroundColor = "black";
g.scaleToWindow();

//Declare variables used in more than one function
var button = undefined,
    stateMessage = undefined,
    actionMessage = undefined;

//The `setup` function to initialize your application
function setup() {

  //First, create some sound objects
  //Use the `sounds` method to create sound objects. The `sound`
  //method takes one argument: a string that describes the sound file path
  var shoot = g.sound("sounds/shoot.wav"),
      explosion = g.sound("sounds/explosion.wav"),
      music = g.sound("sounds/music.wav");

  //Next, setup the sounds

  //Make the music loop
  music.loop = true;

  //Set the pan
  shoot.pan = 0.8;
  music.pan = -0.8;

  //Set the volume
  shoot.volume = 0.5;
  music.volume = 0.3;

  //Create the keyboard objects to play the sounds
  var one = g.keyboard(49),
      a = g.keyboard(65),
      b = g.keyboard(66),
      c = g.keyboard(67),
      d = g.keyboard(68),
      e = g.keyboard(69),
      f = g.keyboard(70),
      gee = g.keyboard(71),
      h = g.keyboard(72),
      i = g.keyboard(73),
      j = g.keyboard(74);

  //Create `press` actions for each sound
  a.press = function () {

    //Allow the music to start playing only once
    if (!music.playing) music.play();
  };
  b.press = function () {
    return music.pause();
  };
  c.press = function () {
    return music.restart();
  };
  d.press = function () {
    return music.playFrom(10);
  };
  e.press = function () {
    return music.fadeOut(3);
  };
  f.press = function () {
    return music.fadeIn(3);
  };
  one.press = function () {
    return shoot.play();
  };

  //You can also generate sound effects from scratch using Hexi's
  //versatile `soundEffect` function.

  //First, define your sounds as re-usable functions, Play around with
  //the parameters and listen to how they change the sounds

  //The shoot sound
  function shootSound() {
    g.soundEffect(1046.5, //frequency
    0, //attack
    0.3, //decay
    "sawtooth", //waveform
    1, //Volume
    -0.8, //pan
    0, //wait before playing
    1200, //pitch bend amount
    false, //reverse bend
    0, //random pitch range
    25, //dissonance
    [0.2, 0.2, 2000], //echo: [delay, feedback, filter]
    undefined //reverb: [duration, decay, reverse?]
    );
  }

  //The jump sound
  function jumpSound() {
    g.soundEffect(523.25, //frequency
    0.05, //attack
    0.2, //decay
    "sine", //waveform
    3, //volume
    0.8, //pan
    0, //wait before playing
    600, //pitch bend amount
    true, //reverse
    100, //random pitch range
    0, //dissonance
    undefined, //echo: [delay, feedback, filter]
    undefined //reverb: [duration, decay, reverse?]
    );
  }

  //The explosion sound
  function explosionSound() {
    g.soundEffect(16, //frequency
    0, //attack
    1, //decay
    "sawtooth", //waveform
    1, //volume
    0, //pan
    0, //wait before playing
    0, //pitch bend amount
    false, //reverse
    0, //random pitch range
    50, //dissonance
    undefined, //echo: [delay, feedback, filter]
    undefined //reverb: [duration, decay, reverse?]
    );
  }

  //The bonus points sound
  function bonusSound() {
    //D
    g.soundEffect(587.33, 0, 0.2, "square", 1, 0, 0);
    //A
    g.soundEffect(880, 0, 0.2, "square", 1, 0, 0.1);
    //High D
    g.soundEffect(1174.66, 0, 0.3, "square", 1, 0, 0.2);
  }

  //Program keyboard keys to play the sounds.
  gee.press = function () {
    return shootSound();
  };
  h.press = function () {
    return jumpSound();
  };
  i.press = function () {
    return explosionSound();
  };
  j.press = function () {
    return bonusSound();
  };

  //Display the instructions
  var instructions = g.text("", "12px PetMe64", "yellowGreen");
  instructions.setPosition(10, 0);

  //Here's an example of how to create multiline text
  //using ES6 template strings (surounding the text with
  //backtick characters)
  instructions.content = "\nTo shoot, press 1\n\nTo control music:\n  a - Play\n  b - Pause\n  c - Restart\n  d - Go to 10 second mark\n  e - Fade out\n  f - Fade in\n\nGenerated sound effects\n  g - Shoot \n  h - Jump\n  i - Explosion\n  j - Bonus\n";
}
//# sourceMappingURL=sounds.js.map