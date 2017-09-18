
/*
Sound.js
===============

A complete micro library of useful, modular functions that help you load, play, control
and generate sound effects and music for games and interactive applications. All the
code targets the WebAudio API.
*/


/*
Fixing the WebAudio API
--------------------------

The WebAudio API is so new that it's API is not consistently implemented properly across
all modern browsers. Thankfully, Chris Wilson's Audio Context Monkey Patch script
normalizes the API for maximum compatibility.

https://github.com/cwilso/AudioContext-MonkeyPatch/blob/gh-pages/AudioContextMonkeyPatch.js

It's included here.
Thank you, Chris!

*/

(function (global, exports, perf) {
  'use strict';

  function fixSetTarget(param) {
    if (!param)	// if NYI, just return
      return;
    if (!param.setTargetAtTime)
      param.setTargetAtTime = param.setTargetValueAtTime;
  }

  if (window.hasOwnProperty('webkitAudioContext') &&
      !window.hasOwnProperty('AudioContext')) {
    window.AudioContext = webkitAudioContext;

    if (!AudioContext.prototype.hasOwnProperty('createGain'))
      AudioContext.prototype.createGain = AudioContext.prototype.createGainNode;
    if (!AudioContext.prototype.hasOwnProperty('createDelay'))
      AudioContext.prototype.createDelay = AudioContext.prototype.createDelayNode;
    if (!AudioContext.prototype.hasOwnProperty('createScriptProcessor'))
      AudioContext.prototype.createScriptProcessor = AudioContext.prototype.createJavaScriptNode;
    if (!AudioContext.prototype.hasOwnProperty('createPeriodicWave'))
      AudioContext.prototype.createPeriodicWave = AudioContext.prototype.createWaveTable;


    AudioContext.prototype.internal_createGain = AudioContext.prototype.createGain;
    AudioContext.prototype.createGain = function() {
      var node = this.internal_createGain();
      fixSetTarget(node.gain);
      return node;
    };

    AudioContext.prototype.internal_createDelay = AudioContext.prototype.createDelay;
    AudioContext.prototype.createDelay = function(maxDelayTime) {
      var node = maxDelayTime ? this.internal_createDelay(maxDelayTime) : this.internal_createDelay();
      fixSetTarget(node.delayTime);
      return node;
    };

    AudioContext.prototype.internal_createBufferSource = AudioContext.prototype.createBufferSource;
    AudioContext.prototype.createBufferSource = function() {
      var node = this.internal_createBufferSource();
      if (!node.start) {
        node.start = function ( when, offset, duration ) {
          if ( offset || duration )
            this.noteGrainOn( when || 0, offset, duration );
          else
            this.noteOn( when || 0 );
        };
      } else {
        node.internal_start = node.start;
        node.start = function( when, offset, duration ) {
          if( typeof duration !== 'undefined' )
            node.internal_start( when || 0, offset, duration );
          else
            node.internal_start( when || 0, offset || 0 );
        };
      }
      if (!node.stop) {
        node.stop = function ( when ) {
          this.noteOff( when || 0 );
        };
      } else {
        node.internal_stop = node.stop;
        node.stop = function( when ) {
          node.internal_stop( when || 0 );
        };
      }
      fixSetTarget(node.playbackRate);
      return node;
    };

    AudioContext.prototype.internal_createDynamicsCompressor = AudioContext.prototype.createDynamicsCompressor;
    AudioContext.prototype.createDynamicsCompressor = function() {
      var node = this.internal_createDynamicsCompressor();
      fixSetTarget(node.threshold);
      fixSetTarget(node.knee);
      fixSetTarget(node.ratio);
      fixSetTarget(node.reduction);
      fixSetTarget(node.attack);
      fixSetTarget(node.release);
      return node;
    };

    AudioContext.prototype.internal_createBiquadFilter = AudioContext.prototype.createBiquadFilter;
    AudioContext.prototype.createBiquadFilter = function() {
      var node = this.internal_createBiquadFilter();
      fixSetTarget(node.frequency);
      fixSetTarget(node.detune);
      fixSetTarget(node.Q);
      fixSetTarget(node.gain);
      return node;
    };

    if (AudioContext.prototype.hasOwnProperty( 'createOscillator' )) {
      AudioContext.prototype.internal_createOscillator = AudioContext.prototype.createOscillator;
      AudioContext.prototype.createOscillator = function() {
        var node = this.internal_createOscillator();
        if (!node.start) {
          node.start = function ( when ) {
            this.noteOn( when || 0 );
          };
        } else {
          node.internal_start = node.start;
          node.start = function ( when ) {
            node.internal_start( when || 0);
          };
        }
        if (!node.stop) {
          node.stop = function ( when ) {
            this.noteOff( when || 0 );
          };
        } else {
          node.internal_stop = node.stop;
          node.stop = function( when ) {
            node.internal_stop( when || 0 );
          };
        }
        if (!node.setPeriodicWave)
          node.setPeriodicWave = node.setWaveTable;
        fixSetTarget(node.frequency);
        fixSetTarget(node.detune);
        return node;
      };
    }
  }

  if (window.hasOwnProperty('webkitOfflineAudioContext') &&
      !window.hasOwnProperty('OfflineAudioContext')) {
    window.OfflineAudioContext = webkitOfflineAudioContext;
  }

}(window));

/*
Define the audio context
------------------------

All this code uses a single `AudioContext` If you want to use any of these functions
independently of this file, make sure that have an `AudioContext` called `actx`. 
*/
var actx = new AudioContext();

/*
sounds
------

`sounds` is an object that you can use to store all your loaded sound fles. 
It also has a helpful `load` method that manages asset loading. You can load sounds at
any time during the game by using the `sounds.load` method. You don't have to use
the `sounds` object or its `load` method, but it's a really convenient way to 
work with sound file assets.

Here's how could use the `sound` object to load three sound files from a `sounds` folder and 
call a `setup` method when all the files have finished loading:

    sounds.load([
      "sounds/shoot.wav", 
      "sounds/music.wav",
      "sounds/bounce.mp3"
    ]);
    sounds.whenLoaded = setup;

You can now access these loaded sounds in your application code like this:

var shoot = sounds["sounds/shoot.wav"],
    music = sounds["sounds/music.wav"],
    bounce = sounds["sounds/bounce.mp3"];

*/

var sounds = {
  //Properties to help track the assets being loaded.
  toLoad: 0,
  loaded: 0,

  //File extensions for different types of sounds.
  audioExtensions: ["mp3", "ogg", "wav", "webm"],

  //The callback function that should run when all assets have loaded.
  //Assign this when you load the fonts, like this: `assets.whenLoaded = makeSprites;`.
  whenLoaded: undefined,

  //The callback function to run after each asset is loaded
  onProgress: undefined,

  //The callback function to run if an asset fails to load or decode
  onFailed: function(source, error) {
      throw new Error("Audio could not be loaded: " + source);
  },

  //The load method creates and loads all the assets. Use it like this:
  //`assets.load(["images/anyImage.png", "fonts/anyFont.otf"]);`.

  load: function(sources) {
    console.log("Loading sounds..");

    //Get a reference to this asset object so we can
    //refer to it in the `forEach` loop ahead.
    var self = this;

    //Find the number of files that need to be loaded.
    self.toLoad = sources.length;
    sources.forEach(function(source){

      //Find the file extension of the asset.
      var extension = source.split('.').pop();

      //#### Sounds
      //Load audio files that have file extensions that match
      //the `audioExtensions` array.
      if (self.audioExtensions.indexOf(extension) !== -1) {

        //Create a sound sprite.
        var soundSprite = makeSound(source, self.loadHandler.bind(self), true, false, self.onFailed);

        //Get the sound file name.
        soundSprite.name = source;

        //If you just want to extract the file name with the
        //extension, you can do it like this:
        //soundSprite.name = source.split("/").pop();
        //Assign the sound as a property of the assets object so
        //we can access it like this: `assets["sounds/sound.mp3"]`.
        self[soundSprite.name] = soundSprite;
      }

      //Display a message if the file type isn't recognized.
      else {
        console.log("File type not recognized: " + source);
      }
    });
  },

  //#### loadHandler
  //The `loadHandler` will be called each time an asset finishes loading.
  loadHandler: function () {
    var self = this;
    self.loaded += 1;

    if (self.onProgress) {
	self.onProgress(100 * self.loaded / self.toLoad);
    }

    //Check whether everything has loaded.
    if (self.toLoad === self.loaded) {

      //If it has, run the callback function that was assigned to the `whenLoaded` property
      console.log("Sounds finished loading");

      //Reset `loaded` and `toLoaded` so we can load more assets
      //later if we want to.
      self.toLoad = 0;
      self.loaded = 0;
      self.whenLoaded();
    }
  }
};

/*
makeSound
---------

`makeSound` is the function you want to use to load and play sound files.
It creates and returns and WebAudio sound object with lots of useful methods you can
use to control the sound. 
You can use it to load a sound like this:

    var anySound = makeSound("sounds/anySound.mp3", loadHandler);


The code above will load the sound and then call the `loadHandler`
when the sound has finished loading. 
(However, it's more convenient to load the sound file using 
the `sounds.load` method described above, so I don't recommend loading sounds
like this unless you need more low-level control.)

After the sound has been loaded you can access and use it like this:

    function loadHandler() {
      anySound.loop = true;
      anySound.pan = 0.8;
      anySound.volume = 0.5;
      anySound.play();
      anySound.pause();
      anySound.playFrom(second);
      anySound.restart();
      anySound.setReverb(2, 2, false);
      anySound.setEcho(0.2, 0.2, 0);
      anySound.playbackRate = 0.5;
    }
   
For advanced configurations, you can optionally supply `makeSound` with optional 3rd and 
4th arguments:

   var anySound = makeSound(source, loadHandler, loadTheSound?, xhrObject);

`loadTheSound?` is a Boolean (true/false) value that, if `false` prevents the sound file
from being loaded. You would only want to set it to `false` like this if you were
using another file loading library to load the sound, and didn't want it to be loaded
twice.

`xhrObject`, the optional 4th argument, is the XHR object that was used to load the sound. Again, you 
would only supply this if you were using another file loading library to load the sound,
and that library had generated its own XHR object. If you supply the `xhr` argument, `makeSound`
will skip the file loading step (because you've already done that), but still decode the audio buffer for you.
(If you are loading the sound file using another file loading library, make sure that your sound
files are loaded with the XHR `responseType = "arraybuffer"` option.)

For example, here's how you could use this advanced configuration to decode a sound that you've already loaded
using your own custom loading system:

   var soundSprite = makeSound(source, decodeHandler.bind(this), false, xhr);

When the file has finished being decoded, your custom `decodeHandler` will run, which tells you
that the file has finished decoding.

If you're creating more than one sound like this, use counter variables to track the number of sounds
you need to decode, and the number of sounds that have been decoded. When both sets of counters are the
same, you'll know that all your sound files have finished decoding and you can proceed with the rest
of you application. (The [Hexi game engine](https://github.com/kittykatattack/hexi) uses `makeSound` in this way.)

*/

function makeSound(source, loadHandler, loadSound, xhr, failHandler) {

  //The sound object that this function returns.
  var o = {};

  //Set the default properties.
  o.volumeNode = actx.createGain();

  //Create the pan node using the efficient `createStereoPanner`
  //method, if it's available.
  if (!actx.createStereoPanner) {
    o.panNode = actx.createPanner();
  } else {
    o.panNode = actx.createStereoPanner();
  }
  o.delayNode = actx.createDelay();
  o.feedbackNode = actx.createGain();
  o.filterNode = actx.createBiquadFilter();
  o.convolverNode = actx.createConvolver();
  o.soundNode = null;
  o.buffer = null;
  o.source = source;
  o.loop = false;
  o.playing = false;

  //The function that should run when the sound is loaded.
  o.loadHandler = undefined;

  //Values for the `pan` and `volume` getters/setters.
  o.panValue = 0;
  o.volumeValue = 1;

  //Values to help track and set the start and pause times.
  o.startTime = 0;
  o.startOffset = 0;

  //Set the playback rate.
  o.playbackRate = 1;

  //Echo properties.
  o.echo = false;
  o.delayValue = 0.3;
  o.feebackValue = 0.3;
  o.filterValue = 0;

  //Reverb properties
  o.reverb = false;
  o.reverbImpulse = null;
  
  //The sound object's methods.
  o.play = function() {

    //Set the start time (it will be `0` when the sound
    //first starts.
    o.startTime = actx.currentTime;

    //Create a sound node.
    o.soundNode = actx.createBufferSource();

    //Set the sound node's buffer property to the loaded sound.
    o.soundNode.buffer = o.buffer;

    //Set the playback rate
    o.soundNode.playbackRate.value = this.playbackRate;

    //Connect the sound to the pan, connect the pan to the
    //volume, and connect the volume to the destination.
    o.soundNode.connect(o.volumeNode);

    //If there's no reverb, bypass the convolverNode
    if (o.reverb === false) {
      o.volumeNode.connect(o.panNode);
    } 

    //If there is reverb, connect the `convolverNode` and apply
    //the impulse response
    else {
      o.volumeNode.connect(o.convolverNode);
      o.convolverNode.connect(o.panNode);
      o.convolverNode.buffer = o.reverbImpulse;
    }
    
    //Connect the `panNode` to the destination to complete the chain.
    o.panNode.connect(actx.destination);

    //Add optional echo.
    if (o.echo) {

      //Set the values.
      o.feedbackNode.gain.value = o.feebackValue;
      o.delayNode.delayTime.value = o.delayValue;
      o.filterNode.frequency.value = o.filterValue;

      //Create the delay loop, with optional filtering.
      o.delayNode.connect(o.feedbackNode);
      if (o.filterValue > 0) {
        o.feedbackNode.connect(o.filterNode);
        o.filterNode.connect(o.delayNode);
      } else {
        o.feedbackNode.connect(o.delayNode);
      }

      //Capture the sound from the main node chain, send it to the
      //delay loop, and send the final echo effect to the `panNode` which
      //will then route it to the destination.
      o.volumeNode.connect(o.delayNode);
      o.delayNode.connect(o.panNode);
    }

    //Will the sound loop? This can be `true` or `false`.
    o.soundNode.loop = o.loop;

    //Finally, use the `start` method to play the sound.
    //The start time will either be `0`,
    //or a later time if the sound was paused.
    o.soundNode.start(
      0, o.startOffset % o.buffer.duration
    );

    //Set `playing` to `true` to help control the
    //`pause` and `restart` methods.
    o.playing = true;
  };

  o.pause = function() {
    //Pause the sound if it's playing, and calculate the
    //`startOffset` to save the current position.
    if (o.playing) {
      o.soundNode.stop(0);
      o.startOffset += actx.currentTime - o.startTime;
      o.playing = false;
    }
  };

  o.restart = function() {
    //Stop the sound if it's playing, reset the start and offset times,
    //then call the `play` method again.
    if (o.playing) {
      o.soundNode.stop(0);
    }
    o.startOffset = 0;
    o.play();
  };

  o.playFrom = function(value) {
    if (o.playing) {
      o.soundNode.stop(0);
    }
    o.startOffset = value;
    o.play();
  };

  o.setEcho = function(delayValue, feedbackValue, filterValue) {
    if (delayValue === undefined) delayValue = 0.3;
    if (feedbackValue === undefined) feedbackValue = 0.3;
    if (filterValue === undefined) filterValue = 0;
    o.delayValue = delayValue;
    o.feebackValue = feedbackValue;
    o.filterValue = filterValue;
    o.echo = true;
  };

  o.setReverb = function(duration, decay, reverse) {
    if (duration === undefined) duration = 2;
    if (decay === undefined) decay = 2;
    if (reverse === undefined) reverse = false;
    o.reverbImpulse = impulseResponse(duration, decay, reverse, actx);
    o.reverb = true;
  };

  //A general purpose `fade` method for fading sounds in or out.
  //The first argument is the volume that the sound should
  //fade to, and the second value is the duration, in seconds,
  //that the fade should last.
  o.fade = function(endValue, durationInSeconds) {
    if (o.playing) {
      o.volumeNode.gain.linearRampToValueAtTime(
        o.volumeNode.gain.value, actx.currentTime
      );
      o.volumeNode.gain.linearRampToValueAtTime(
        endValue, actx.currentTime + durationInSeconds
      );
    }
  };

  //Fade a sound in, from an initial volume level of zero.
  o.fadeIn = function(durationInSeconds) {
    
    //Set the volume to 0 so that you can fade
    //in from silence
    o.volumeNode.gain.value = 0;
    o.fade(1, durationInSeconds);
  
  };

  //Fade a sound out, from its current volume level to zero.
  o.fadeOut = function(durationInSeconds) {
    o.fade(0, durationInSeconds);
  };
  
  //Volume and pan getters/setters.
  Object.defineProperties(o, {
    volume: {
      get: function() {
        return o.volumeValue;
      },
      set: function(value) {
        o.volumeNode.gain.value = value;
        o.volumeValue = value;
      },
      enumerable: true, configurable: true
    },

    //The pan node uses the high-efficiency stereo panner, if it's
    //available. But, because this is a new addition to the 
    //WebAudio spec, it might not be available on all browsers.
    //So the code checks for this and uses the older 3D panner
    //if 2D isn't available.
    pan: {
      get: function() {
        if (!actx.createStereoPanner) {
          return o.panValue;
        } else {
          return o.panNode.pan.value;
        }
      },
      set: function(value) {
        if (!actx.createStereoPanner) {
          //Panner objects accept x, y and z coordinates for 3D
          //sound. However, because we're only doing 2D left/right
          //panning we're only interested in the x coordinate,
          //the first one. However, for a natural effect, the z
          //value also has to be set proportionately.
          var x = value,
              y = 0,
              z = 1 - Math.abs(x);
          o.panNode.setPosition(x, y, z);
          o.panValue = value;
        } else {
          o.panNode.pan.value = value;
        }
      },
      enumerable: true, configurable: true
    }
  });

  //Optionally Load and decode the sound.
  if (loadSound) {
    this.loadSound(o, source, loadHandler, failHandler);
  }

  //Optionally, if you've loaded the sound using some other loader, just decode the sound
  if (xhr) {
    this.decodeAudio(o, xhr, loadHandler, failHandler);
  }

  //Return the sound object.
  return o;
}

//The `loadSound` function loads the sound file using XHR
function loadSound(o, source, loadHandler, failHandler) {
  var xhr = new XMLHttpRequest();

  //Use xhr to load the sound file.
  xhr.open("GET", source, true);
  xhr.responseType = "arraybuffer";

  //When the sound has finished loading, decode it using the
  //`decodeAudio` function (which you'll see ahead)
  xhr.addEventListener("load", decodeAudio.bind(this, o, xhr, loadHandler, failHandler)); 

  //Send the request to load the file.
  xhr.send();
}

//The `decodeAudio` function decodes the audio file for you and 
//launches the `loadHandler` when it's done
function decodeAudio(o, xhr, loadHandler, failHandler) {

  //Decode the sound and store a reference to the buffer.
  actx.decodeAudioData(
    xhr.response,
    function(buffer) {
      o.buffer = buffer;
      o.hasLoaded = true;

      //This next bit is optional, but important.
      //If you have a load manager in your game, call it here so that
      //the sound is registered as having loaded.
      if (loadHandler) {
        loadHandler();
      }
    },
    function(error) {
      if (failHandler) failHandler(o.source, error);
    }
  );
}


/*
soundEffect
-----------

The `soundEffect` function let's you generate your sounds and musical notes from scratch
(Reverb effect requires the `impulseResponse` function that you'll see further ahead in this file)

To create a custom sound effect, define all the parameters that characterize your sound. Here's how to
create a laser shooting sound:

    soundEffect(
      1046.5,           //frequency
      0,                //attack
      0.3,              //decay
      "sawtooth",       //waveform
      1,                //Volume
      -0.8,             //pan
      0,                //wait before playing
      1200,             //pitch bend amount
      false,            //reverse bend
      0,                //random pitch range
      25,               //dissonance
      [0.2, 0.2, 2000], //echo: [delay, feedback, filter]
      undefined         //reverb: [duration, decay, reverse?]
      3                 //Maximum duration of sound, in seconds
    );

Experiment by changing these parameters to see what kinds of effects you can create, and build
your own library of custom sound effects for games.
*/

function soundEffect(
  frequencyValue,      //The sound's fequency pitch in Hertz
  attack,              //The time, in seconds, to fade the sound in
  decay,               //The time, in seconds, to fade the sound out
  type,                //waveform type: "sine", "triangle", "square", "sawtooth"
  volumeValue,         //The sound's maximum volume
  panValue,            //The speaker pan. left: -1, middle: 0, right: 1
  wait,                //The time, in seconds, to wait before playing the sound
  pitchBendAmount,     //The number of Hz in which to bend the sound's pitch down
  reverse,             //If `reverse` is true the pitch will bend up
  randomValue,         //A range, in Hz, within which to randomize the pitch
  dissonance,          //A value in Hz. It creates 2 dissonant frequencies above and below the target pitch
  echo,                //An array: [delayTimeInSeconds, feedbackTimeInSeconds, filterValueInHz]
  reverb,              //An array: [durationInSeconds, decayRateInSeconds, reverse]
  timeout              //A number, in seconds, which is the maximum duration for sound effects
) {

  //Set the default values
  if (frequencyValue === undefined) frequencyValue = 200;
  if (attack === undefined) attack = 0;
  if (decay === undefined) decay = 1;
  if (type === undefined) type = "sine";
  if (volumeValue === undefined) volumeValue = 1;
  if (panValue === undefined) panValue = 0;
  if (wait === undefined) wait = 0;
  if (pitchBendAmount === undefined) pitchBendAmount = 0;
  if (reverse === undefined) reverse = false;
  if (randomValue === undefined) randomValue = 0;
  if (dissonance === undefined) dissonance = 0;
  if (echo === undefined) echo = undefined;
  if (reverb === undefined) reverb = undefined;
  if (timeout === undefined) timeout = undefined;

  //Create an oscillator, gain and pan nodes, and connect them
  //together to the destination
  var oscillator, volume, pan;
  oscillator = actx.createOscillator();
  volume = actx.createGain();
  if (!actx.createStereoPanner) {
    pan = actx.createPanner();
  } else {
    pan = actx.createStereoPanner();
  }
  oscillator.connect(volume);
  volume.connect(pan);
  pan.connect(actx.destination);

  //Set the supplied values
  volume.gain.value = volumeValue;
  if (!actx.createStereoPanner) {
    pan.setPosition(panValue, 0, 1 - Math.abs(panValue));
  } else {
    pan.pan.value = panValue; 
  }
  oscillator.type = type;

  //Optionally randomize the pitch. If the `randomValue` is greater
  //than zero, a random pitch is selected that's within the range
  //specified by `frequencyValue`. The random pitch will be either
  //above or below the target frequency.
  var frequency;
  var randomInt = function(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min
  };
  if (randomValue > 0) {
    frequency = randomInt(
      frequencyValue - randomValue / 2,
      frequencyValue + randomValue / 2
    );
  } else {
    frequency = frequencyValue;
  }
  oscillator.frequency.value = frequency;

  //Apply effects
  if (attack > 0) fadeIn(volume);
  fadeOut(volume);
  if (pitchBendAmount > 0) pitchBend(oscillator);
  if (echo) addEcho(volume);
  if (reverb) addReverb(volume);
  if (dissonance > 0) addDissonance();

  //Play the sound
  play(oscillator);

  //The helper functions:
  
  function addReverb(volumeNode) {
    var convolver = actx.createConvolver();
    convolver.buffer = impulseResponse(reverb[0], reverb[1], reverb[2], actx);
    volumeNode.connect(convolver);
    convolver.connect(pan);
  }

  function addEcho(volumeNode) {

    //Create the nodes
    var feedback = actx.createGain(),
        delay = actx.createDelay(),
        filter = actx.createBiquadFilter();

    //Set their values (delay time, feedback time and filter frequency)
    delay.delayTime.value = echo[0];
    feedback.gain.value = echo[1];
    if (echo[2]) filter.frequency.value = echo[2];

    //Create the delay feedback loop, with
    //optional filtering
    delay.connect(feedback);
    if (echo[2]) {
      feedback.connect(filter);
      filter.connect(delay);
    } else {
      feedback.connect(delay);
    }

    //Connect the delay loop to the oscillator's volume
    //node, and then to the destination
    volumeNode.connect(delay);

    //Connect the delay loop to the main sound chain's
    //pan node, so that the echo effect is directed to
    //the correct speaker
    delay.connect(pan);
  }

  //The `fadeIn` function
  function fadeIn(volumeNode) {

    //Set the volume to 0 so that you can fade
    //in from silence
    volumeNode.gain.value = 0;

    volumeNode.gain.linearRampToValueAtTime(
      0, actx.currentTime + wait
    );
    volumeNode.gain.linearRampToValueAtTime(
      volumeValue, actx.currentTime + wait + attack
    );
  }

  //The `fadeOut` function
  function fadeOut(volumeNode) {
    volumeNode.gain.linearRampToValueAtTime(
      volumeValue, actx.currentTime + attack + wait
    );
    volumeNode.gain.linearRampToValueAtTime(
      0, actx.currentTime + wait + attack + decay
    );
  }

  //The `pitchBend` function
  function pitchBend(oscillatorNode) {
    //If `reverse` is true, make the note drop in frequency. Useful for
    //shooting sounds

    //Get the frequency of the current oscillator
    var frequency = oscillatorNode.frequency.value;

    //If `reverse` is true, make the sound drop in pitch
    if (!reverse) {
      oscillatorNode.frequency.linearRampToValueAtTime(
        frequency, 
        actx.currentTime + wait
      );
      oscillatorNode.frequency.linearRampToValueAtTime(
        frequency - pitchBendAmount, 
        actx.currentTime + wait + attack + decay
      );
    }

    //If `reverse` is false, make the note rise in pitch. Useful for
    //jumping sounds
    else {
      oscillatorNode.frequency.linearRampToValueAtTime(
        frequency, 
        actx.currentTime + wait
      );
      oscillatorNode.frequency.linearRampToValueAtTime(
        frequency + pitchBendAmount, 
        actx.currentTime + wait + attack + decay
      );
    }
  }

  //The `addDissonance` function
  function addDissonance() {

    //Create two more oscillators and gain nodes
    var d1 = actx.createOscillator(),
        d2 = actx.createOscillator(),
        d1Volume = actx.createGain(),
        d2Volume = actx.createGain();

    //Set the volume to the `volumeValue`
    d1Volume.gain.value = volumeValue;
    d2Volume.gain.value = volumeValue;

    //Connect the oscillators to the gain and destination nodes
    d1.connect(d1Volume);
    d1Volume.connect(actx.destination);
    d2.connect(d2Volume);
    d2Volume.connect(actx.destination);

    //Set the waveform to "sawtooth" for a harsh effect
    d1.type = "sawtooth";
    d2.type = "sawtooth";

    //Make the two oscillators play at frequencies above and
    //below the main sound's frequency. Use whatever value was
    //supplied by the `dissonance` argument
    d1.frequency.value = frequency + dissonance;
    d2.frequency.value = frequency - dissonance;

    //Fade in/out, pitch bend and play the oscillators
    //to match the main sound
    if (attack > 0) {
      fadeIn(d1Volume);
      fadeIn(d2Volume);
    }
    if (decay > 0) {
      fadeOut(d1Volume);
      fadeOut(d2Volume);
    }
    if (pitchBendAmount > 0) {
      pitchBend(d1);
      pitchBend(d2);
    }
    if (echo) {
      addEcho(d1Volume);
      addEcho(d2Volume);
    }
    if (reverb) {
      addReverb(d1Volume);
      addReverb(d2Volume);
    }
    play(d1);
    play(d2);
  }

  //The `play` function
  function play(node) {
    node.start(actx.currentTime + wait);

    //Oscillators have to be stopped otherwise they accumulate in 
    //memory and tax the CPU. They'll be stopped after a default
    //timeout of 2 seconds, which should be enough for most sound 
    //effects. Override this in the `soundEffect` parameters if you
    //need a longer sound
    node.stop(actx.currentTime + wait + 2);
  }
}

/*
impulseResponse
---------------

The `makeSound` and `soundEffect` functions uses `impulseResponse`  to help create an optional reverb effect.  
It simulates a model of sound reverberation in an acoustic space which 
a convolver node can blend with the source sound. Make sure to include this function along with `makeSound`
and `soundEffect` if you need to use the reverb feature.
*/

function impulseResponse(duration, decay, reverse, actx) {

  //The length of the buffer.
  var length = actx.sampleRate * duration;

  //Create an audio buffer (an empty sound container) to store the reverb effect.
  var impulse = actx.createBuffer(2, length, actx.sampleRate);

  //Use `getChannelData` to initialize empty arrays to store sound data for
  //the left and right channels.
  var left = impulse.getChannelData(0),
      right = impulse.getChannelData(1);

  //Loop through each sample-frame and fill the channel
  //data with random noise.
  for (var i = 0; i < length; i++){

    //Apply the reverse effect, if `reverse` is `true`.
    var n;
    if (reverse) {
      n = length - i;
    } else {
      n = i;
    }

    //Fill the left and right channels with random white noise which
    //decays exponentially.
    left[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, decay);
    right[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, decay);
  }

  //Return the `impulse`.
  return impulse;
}


/*
keyboard
--------

This isn't really necessary - I just included it for fun to help with the 
examples in the `index.html` files.
The `keyboard` helper function creates `key` objects
that listen for keyboard events. Create a new key object like
this:

    var keyObject = g.keyboard(asciiKeyCodeNumber);

Then assign `press` and `release` methods like this:

    keyObject.press = function() {
      //key object pressed
    };
    keyObject.release = function() {
      //key object released
    };

Keyboard objects also have `isDown` and `isUp` Booleans that you can check.
This is so much easier than having to write out tedious keyboard even capture 
code from scratch.

Like I said, the `keyboard` function has nothing to do with generating sounds,
so just delete it if you don't want it!
*/

function keyboard(keyCode) {
  var key = {};
  key.code = keyCode;
  key.isDown = false;
  key.isUp = true;
  key.press = undefined;
  key.release = undefined;
  //The `downHandler`
  key.downHandler = function(event) {
    if (event.keyCode === key.code) {
      if (key.isUp && key.press) key.press();
      key.isDown = true;
      key.isUp = false;
    }
    event.preventDefault();
  };

  //The `upHandler`
  key.upHandler = function(event) {
    if (event.keyCode === key.code) {
      if (key.isDown && key.release) key.release();
      key.isDown = false;
      key.isUp = true;
    }
    event.preventDefault();
  };

  //Attach event listeners
  window.addEventListener(
    "keydown", key.downHandler.bind(key), false
  );
  window.addEventListener(
    "keyup", key.upHandler.bind(key), false
  );
  return key;
}

function scaleToWindow(canvas, backgroundColor) {
  var scaleX, scaleY, scale, center;

  //1. Scale the canvas to the correct size
  //Figure out the scale amount on each axis
  scaleX = window.innerWidth / canvas.offsetWidth;
  scaleY = window.innerHeight / canvas.offsetHeight;

  //Scale the canvas based on whichever value is less: `scaleX` or `scaleY`
  scale = Math.min(scaleX, scaleY);
  canvas.style.transformOrigin = "0 0";
  canvas.style.transform = "scale(" + scale + ")";

  //2. Center the canvas.
  //Decide whether to center the canvas vertically or horizontally.
  //Wide canvases should be centered vertically, and 
  //square or tall canvases should be centered horizontally
  if (canvas.offsetWidth > canvas.offsetHeight) {
    if (canvas.offsetWidth * scale < window.innerWidth) {
      center = "horizontally";
    } else {
      center = "vertically";
    }
  } else {
    if (canvas.offsetHeight * scale < window.innerHeight) {
      center = "vertically";
    } else {
      center = "horizontally";
    }
  }

  //Center horizontally (for square or tall canvases)
  var margin;
  if (center === "horizontally") {
    margin = (window.innerWidth - canvas.offsetWidth * scale) / 2;
    canvas.style.marginTop = 0 + "px";
    canvas.style.marginBottom = 0 + "px";
    canvas.style.marginLeft = margin + "px";
    canvas.style.marginRight = margin + "px";
  }

  //Center vertically (for wide canvases) 
  if (center === "vertically") {
    margin = (window.innerHeight - canvas.offsetHeight * scale) / 2;
    canvas.style.marginTop = margin + "px";
    canvas.style.marginBottom = margin + "px";
    canvas.style.marginLeft = 0 + "px";
    canvas.style.marginRight = 0 + "px";
  }

  //3. Remove any padding from the canvas  and body and set the canvas
  //display style to "block"
  canvas.style.paddingLeft = 0 + "px";
  canvas.style.paddingRight = 0 + "px";
  canvas.style.paddingTop = 0 + "px";
  canvas.style.paddingBottom = 0 + "px";
  canvas.style.display = "block";

  //4. Set the color of the HTML body background
  document.body.style.backgroundColor = backgroundColor;

  //Fix some quirkiness in scaling for Safari
  var ua = navigator.userAgent.toLowerCase();
  if (ua.indexOf("safari") != -1) {
    if (ua.indexOf("chrome") > -1) {
      // Chrome
    } else {
      // Safari
      //canvas.style.maxHeight = "100%";
      //canvas.style.minHeight = "100%";
    }
  }

  //5. Return the `scale` value. This is important, because you'll nee this value 
  //for correct hit testing between the pointer and sprites
  return scale;
}"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Bump = (function () {
  function Bump() {
    var renderingEngine = arguments.length <= 0 || arguments[0] === undefined ? PIXI : arguments[0];

    _classCallCheck(this, Bump);

    if (renderingEngine === undefined) throw new Error("Please assign a rendering engine in the constructor before using bump.js");

    this.renderer = "pixi";
  }

  //`addCollisionProperties` adds extra properties to sprites to help
  //simplify the collision code. It won't add these properties if they
  //already exist on the sprite. After these properties have been
  //added, this methods adds a Boolean property to the sprite called `_bumpPropertiesAdded`
  //and sets it to `true` to flag that the sprite has these
  //new properties

  _createClass(Bump, [{
    key: "addCollisionProperties",
    value: function addCollisionProperties(sprite) {

      //Add properties to Pixi sprites
      if (this.renderer === "pixi") {

        //gx
        if (sprite.gx === undefined) {
          Object.defineProperty(sprite, "gx", {
            get: function get() {
              return sprite.getGlobalPosition().x;
            },

            enumerable: true, configurable: true
          });
        }

        //gy
        if (sprite.gy === undefined) {
          Object.defineProperty(sprite, "gy", {
            get: function get() {
              return sprite.getGlobalPosition().y;
            },

            enumerable: true, configurable: true
          });
        }

        //centerX
        if (sprite.centerX === undefined) {
          Object.defineProperty(sprite, "centerX", {
            get: function get() {
              return sprite.x + sprite.width / 2;
            },

            enumerable: true, configurable: true
          });
        }

        //centerY
        if (sprite.centerY === undefined) {
          Object.defineProperty(sprite, "centerY", {
            get: function get() {
              return sprite.y + sprite.height / 2;
            },

            enumerable: true, configurable: true
          });
        }

        //halfWidth
        if (sprite.halfWidth === undefined) {
          Object.defineProperty(sprite, "halfWidth", {
            get: function get() {
              return sprite.width / 2;
            },

            enumerable: true, configurable: true
          });
        }

        //halfHeight
        if (sprite.halfHeight === undefined) {
          Object.defineProperty(sprite, "halfHeight", {
            get: function get() {
              return sprite.height / 2;
            },

            enumerable: true, configurable: true
          });
        }

        //xAnchorOffset
        if (sprite.xAnchorOffset === undefined) {
          Object.defineProperty(sprite, "xAnchorOffset", {
            get: function get() {
              if (sprite.anchor !== undefined) {
                return sprite.width * sprite.anchor.x;
              } else {
                return 0;
              }
            },

            enumerable: true, configurable: true
          });
        }

        //yAnchorOffset
        if (sprite.yAnchorOffset === undefined) {
          Object.defineProperty(sprite, "yAnchorOffset", {
            get: function get() {
              if (sprite.anchor !== undefined) {
                return sprite.height * sprite.anchor.y;
              } else {
                return 0;
              }
            },

            enumerable: true, configurable: true
          });
        }

        if (sprite.circular && sprite.radius === undefined) {
          Object.defineProperty(sprite, "radius", {
            get: function get() {
              return sprite.width / 2;
            },

            enumerable: true, configurable: true
          });
        }

        //Earlier code - not needed now.
        /*
        Object.defineProperties(sprite, {
          "gx": {
            get(){return sprite.getGlobalPosition().x},
            enumerable: true, configurable: true
          },
          "gy": {
            get(){return sprite.getGlobalPosition().y},
            enumerable: true, configurable: true
          },
          "centerX": {
            get(){return sprite.x + sprite.width / 2},
            enumerable: true, configurable: true
          },
          "centerY": {
            get(){return sprite.y + sprite.height / 2},
            enumerable: true, configurable: true
          },
          "halfWidth": {
            get(){return sprite.width / 2},
            enumerable: true, configurable: true
          },
          "halfHeight": {
            get(){return sprite.height / 2},
            enumerable: true, configurable: true
          },
          "xAnchorOffset": {
            get(){
              if (sprite.anchor !== undefined) {
                return sprite.height * sprite.anchor.x;
              } else {
                return 0;
              }
            },
            enumerable: true, configurable: true
          },
          "yAnchorOffset": {
            get(){
              if (sprite.anchor !== undefined) {
                return sprite.width * sprite.anchor.y;
              } else {
                return 0;
              }
            },
            enumerable: true, configurable: true
          }
        });
        */
      }

      //Add a Boolean `_bumpPropertiesAdded` property to the sprite to flag it
      //as having these new properties
      sprite._bumpPropertiesAdded = true;
    }

    /*
    hitTestPoint
    ------------
     Use it to find out if a point is touching a circlular or rectangular sprite.
    Parameters: 
    a. An object with `x` and `y` properties.
    b. A sprite object with `x`, `y`, `centerX` and `centerY` properties.
    If the sprite has a `radius` property, the function will interpret
    the shape as a circle.
    */

  }, {
    key: "hitTestPoint",
    value: function hitTestPoint(point, sprite) {

      //Add collision properties
      if (!sprite._bumpPropertiesAdded) this.addCollisionProperties(sprite);

      var shape = undefined,
          left = undefined,
          right = undefined,
          top = undefined,
          bottom = undefined,
          vx = undefined,
          vy = undefined,
          magnitude = undefined,
          hit = undefined;

      //Find out if the sprite is rectangular or circular depending
      //on whether it has a `radius` property
      if (sprite.radius) {
        shape = "circle";
      } else {
        shape = "rectangle";
      }

      //Rectangle
      if (shape === "rectangle") {

        //Get the position of the sprite's edges
        left = sprite.x - sprite.xAnchorOffset;
        right = sprite.x + sprite.width - sprite.xAnchorOffset;
        top = sprite.y - sprite.yAnchorOffset;
        bottom = sprite.y + sprite.height - sprite.yAnchorOffset;

        //Find out if the point is intersecting the rectangle
        hit = point.x > left && point.x < right && point.y > top && point.y < bottom;
      }

      //Circle
      if (shape === "circle") {

        //Find the distance between the point and the
        //center of the circle
        var _vx = point.x - sprite.x - sprite.width / 2 + sprite.xAnchorOffset,
            _vy = point.y - sprite.y - sprite.height / 2 + sprite.yAnchorOffset,
            _magnitude = Math.sqrt(_vx * _vx + _vy * _vy);

        //The point is intersecting the circle if the magnitude
        //(distance) is less than the circle's radius
        hit = _magnitude < sprite.radius;
      }

      //`hit` will be either `true` or `false`
      return hit;
    }

    /*
    hitTestCircle
    -------------
     Use it to find out if two circular sprites are touching.
    Parameters: 
    a. A sprite object with `centerX`, `centerY` and `radius` properties.
    b. A sprite object with `centerX`, `centerY` and `radius`.
    */

  }, {
    key: "hitTestCircle",
    value: function hitTestCircle(c1, c2) {
      var global = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

      //Add collision properties
      if (!c1._bumpPropertiesAdded) this.addCollisionProperties(c1);
      if (!c2._bumpPropertiesAdded) this.addCollisionProperties(c2);

      var vx = undefined,
          vy = undefined,
          magnitude = undefined,
          combinedRadii = undefined,
          hit = undefined;

      //Calculate the vector between the circles’ center points
      if (global) {
        //Use global coordinates
        vx = c2.gx + c2.width / 2 - c2.xAnchorOffset - (c1.gx + c1.width / 2 - c1.xAnchorOffset);
        vy = c2.gy + c2.width / 2 - c2.yAnchorOffset - (c1.gy + c1.width / 2 - c1.yAnchorOffset);
      } else {
        //Use local coordinates
        vx = c2.x + c2.width / 2 - c2.xAnchorOffset - (c1.x + c1.width / 2 - c1.xAnchorOffset);
        vy = c2.y + c2.width / 2 - c2.yAnchorOffset - (c1.y + c1.width / 2 - c1.yAnchorOffset);
      }

      //Find the distance between the circles by calculating
      //the vector's magnitude (how long the vector is)
      magnitude = Math.sqrt(vx * vx + vy * vy);

      //Add together the circles' total radii
      combinedRadii = c1.radius + c2.radius;

      //Set `hit` to `true` if the distance between the circles is
      //less than their `combinedRadii`
      hit = magnitude < combinedRadii;

      //`hit` will be either `true` or `false`
      return hit;
    }

    /*
    circleCollision
    ---------------
     Use it to prevent a moving circular sprite from overlapping and optionally
    bouncing off a non-moving circular sprite.
    Parameters: 
    a. A sprite object with `x`, `y` `centerX`, `centerY` and `radius` properties.
    b. A sprite object with `x`, `y` `centerX`, `centerY` and `radius` properties.
    c. Optional: true or false to indicate whether or not the first sprite
    should bounce off the second sprite.
    The sprites can contain an optional mass property that should be greater than 1.
     */

  }, {
    key: "circleCollision",
    value: function circleCollision(c1, c2) {
      var bounce = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];
      var global = arguments.length <= 3 || arguments[3] === undefined ? false : arguments[3];

      //Add collision properties
      if (!c1._bumpPropertiesAdded) this.addCollisionProperties(c1);
      if (!c2._bumpPropertiesAdded) this.addCollisionProperties(c2);

      var magnitude = undefined,
          combinedRadii = undefined,
          overlap = undefined,
          vx = undefined,
          vy = undefined,
          dx = undefined,
          dy = undefined,
          s = {},
          hit = false;

      //Calculate the vector between the circles’ center points

      if (global) {
        //Use global coordinates
        vx = c2.gx + c2.width / 2 - c2.xAnchorOffset - (c1.gx + c1.width / 2 - c1.xAnchorOffset);
        vy = c2.gy + c2.width / 2 - c2.yAnchorOffset - (c1.gy + c1.width / 2 - c1.yAnchorOffset);
      } else {
        //Use local coordinates
        vx = c2.x + c2.width / 2 - c2.xAnchorOffset - (c1.x + c1.width / 2 - c1.xAnchorOffset);
        vy = c2.y + c2.width / 2 - c2.yAnchorOffset - (c1.y + c1.width / 2 - c1.yAnchorOffset);
      }

      //Find the distance between the circles by calculating
      //the vector's magnitude (how long the vector is)
      magnitude = Math.sqrt(vx * vx + vy * vy);

      //Add together the circles' combined half-widths
      combinedRadii = c1.radius + c2.radius;

      //Figure out if there's a collision
      if (magnitude < combinedRadii) {

        //Yes, a collision is happening
        hit = true;

        //Find the amount of overlap between the circles
        overlap = combinedRadii - magnitude;

        //Add some "quantum padding". This adds a tiny amount of space
        //between the circles to reduce their surface tension and make
        //them more slippery. "0.3" is a good place to start but you might
        //need to modify this slightly depending on the exact behaviour
        //you want. Too little and the balls will feel sticky, too much
        //and they could start to jitter if they're jammed together
        var quantumPadding = 0.3;
        overlap += quantumPadding;

        //Normalize the vector
        //These numbers tell us the direction of the collision
        dx = vx / magnitude;
        dy = vy / magnitude;

        //Move circle 1 out of the collision by multiplying
        //the overlap with the normalized vector and subtract it from
        //circle 1's position
        c1.x -= overlap * dx;
        c1.y -= overlap * dy;

        //Bounce
        if (bounce) {
          //Create a collision vector object, `s` to represent the bounce "surface".
          //Find the bounce surface's x and y properties
          //(This represents the normal of the distance vector between the circles)
          s.x = vy;
          s.y = -vx;

          //Bounce c1 off the surface
          this.bounceOffSurface(c1, s);
        }
      }
      return hit;
    }

    /*
    movingCircleCollision
    ---------------------
     Use it to make two moving circles bounce off each other.
    Parameters: 
    a. A sprite object with `x`, `y` `centerX`, `centerY` and `radius` properties.
    b. A sprite object with `x`, `y` `centerX`, `centerY` and `radius` properties.
    The sprites can contain an optional mass property that should be greater than 1.
     */

  }, {
    key: "movingCircleCollision",
    value: function movingCircleCollision(c1, c2) {
      var global = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

      //Add collision properties
      if (!c1._bumpPropertiesAdded) this.addCollisionProperties(c1);
      if (!c2._bumpPropertiesAdded) this.addCollisionProperties(c2);

      var combinedRadii = undefined,
          overlap = undefined,
          xSide = undefined,
          ySide = undefined,

      //`s` refers to the distance vector between the circles
      s = {},
          p1A = {},
          p1B = {},
          p2A = {},
          p2B = {},
          hit = false;

      //Apply mass, if the circles have mass properties
      c1.mass = c1.mass || 1;
      c2.mass = c2.mass || 1;

      //Calculate the vector between the circles’ center points
      if (global) {

        //Use global coordinates
        s.vx = c2.gx + c2.radius - c2.xAnchorOffset - (c1.gx + c1.radius - c1.xAnchorOffset);
        s.vy = c2.gy + c2.radius - c2.yAnchorOffset - (c1.gy + c1.radius - c1.yAnchorOffset);
      } else {

        //Use local coordinates
        s.vx = c2.x + c2.radius - c2.xAnchorOffset - (c1.x + c1.radius - c1.xAnchorOffset);
        s.vy = c2.y + c2.radius - c2.yAnchorOffset - (c1.y + c1.radius - c1.yAnchorOffset);
      }

      //Find the distance between the circles by calculating
      //the vector's magnitude (how long the vector is)
      s.magnitude = Math.sqrt(s.vx * s.vx + s.vy * s.vy);

      //Add together the circles' combined half-widths
      combinedRadii = c1.radius + c2.radius;

      //Figure out if there's a collision
      if (s.magnitude < combinedRadii) {

        //Yes, a collision is happening
        hit = true;

        //Find the amount of overlap between the circles
        overlap = combinedRadii - s.magnitude;

        //Add some "quantum padding" to the overlap
        overlap += 0.3;

        //Normalize the vector.
        //These numbers tell us the direction of the collision
        s.dx = s.vx / s.magnitude;
        s.dy = s.vy / s.magnitude;

        //Find the collision vector.
        //Divide it in half to share between the circles, and make it absolute
        s.vxHalf = Math.abs(s.dx * overlap / 2);
        s.vyHalf = Math.abs(s.dy * overlap / 2);

        //Find the side that the collision is occurring on
        c1.x > c2.x ? xSide = 1 : xSide = -1;
        c1.y > c2.y ? ySide = 1 : ySide = -1;

        //Move c1 out of the collision by multiplying
        //the overlap with the normalized vector and adding it to
        //the circles' positions
        c1.x = c1.x + s.vxHalf * xSide;
        c1.y = c1.y + s.vyHalf * ySide;

        //Move c2 out of the collision
        c2.x = c2.x + s.vxHalf * -xSide;
        c2.y = c2.y + s.vyHalf * -ySide;

        //1. Calculate the collision surface's properties

        //Find the surface vector's left normal
        s.lx = s.vy;
        s.ly = -s.vx;

        //2. Bounce c1 off the surface (s)

        //Find the dot product between c1 and the surface
        var dp1 = c1.vx * s.dx + c1.vy * s.dy;

        //Project c1's velocity onto the collision surface
        p1A.x = dp1 * s.dx;
        p1A.y = dp1 * s.dy;

        //Find the dot product of c1 and the surface's left normal (s.lx and s.ly)
        var dp2 = c1.vx * (s.lx / s.magnitude) + c1.vy * (s.ly / s.magnitude);

        //Project the c1's velocity onto the surface's left normal
        p1B.x = dp2 * (s.lx / s.magnitude);
        p1B.y = dp2 * (s.ly / s.magnitude);

        //3. Bounce c2 off the surface (s)

        //Find the dot product between c2 and the surface
        var dp3 = c2.vx * s.dx + c2.vy * s.dy;

        //Project c2's velocity onto the collision surface
        p2A.x = dp3 * s.dx;
        p2A.y = dp3 * s.dy;

        //Find the dot product of c2 and the surface's left normal (s.lx and s.ly)
        var dp4 = c2.vx * (s.lx / s.magnitude) + c2.vy * (s.ly / s.magnitude);

        //Project c2's velocity onto the surface's left normal
        p2B.x = dp4 * (s.lx / s.magnitude);
        p2B.y = dp4 * (s.ly / s.magnitude);

        //4. Calculate the bounce vectors

        //Bounce c1
        //using p1B and p2A
        c1.bounce = {};
        c1.bounce.x = p1B.x + p2A.x;
        c1.bounce.y = p1B.y + p2A.y;

        //Bounce c2
        //using p1A and p2B
        c2.bounce = {};
        c2.bounce.x = p1A.x + p2B.x;
        c2.bounce.y = p1A.y + p2B.y;

        //Add the bounce vector to the circles' velocity
        //and add mass if the circle has a mass property
        c1.vx = c1.bounce.x / c1.mass;
        c1.vy = c1.bounce.y / c1.mass;
        c2.vx = c2.bounce.x / c2.mass;
        c2.vy = c2.bounce.y / c2.mass;
      }
      return hit;
    }
    /*
    multipleCircleCollision
    -----------------------
     Checks all the circles in an array for a collision against
    all the other circles in an array, using `movingCircleCollision` (above)
    */

  }, {
    key: "multipleCircleCollision",
    value: function multipleCircleCollision(arrayOfCircles) {
      var global = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

      for (var i = 0; i < arrayOfCircles.length; i++) {

        //The first circle to use in the collision check
        var c1 = arrayOfCircles[i];
        for (var j = i + 1; j < arrayOfCircles.length; j++) {

          //The second circle to use in the collision check
          var c2 = arrayOfCircles[j];

          //Check for a collision and bounce the circles apart if
          //they collide. Use an optional `mass` property on the sprite
          //to affect the bounciness of each marble
          this.movingCircleCollision(c1, c2, global);
        }
      }
    }

    /*
    rectangleCollision
    ------------------
     Use it to prevent two rectangular sprites from overlapping.
    Optionally, make the first rectangle bounce off the second rectangle.
    Parameters:
    a. A sprite object with `x`, `y` `centerX`, `centerY`, `halfWidth` and `halfHeight` properties.
    b. A sprite object with `x`, `y` `centerX`, `centerY`, `halfWidth` and `halfHeight` properties.
    c. Optional: true or false to indicate whether or not the first sprite
    should bounce off the second sprite.
    */

  }, {
    key: "rectangleCollision",
    value: function rectangleCollision(r1, r2) {
      var bounce = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];
      var global = arguments.length <= 3 || arguments[3] === undefined ? true : arguments[3];

      //Add collision properties
      if (!r1._bumpPropertiesAdded) this.addCollisionProperties(r1);
      if (!r2._bumpPropertiesAdded) this.addCollisionProperties(r2);

      var collision = undefined,
          combinedHalfWidths = undefined,
          combinedHalfHeights = undefined,
          overlapX = undefined,
          overlapY = undefined,
          vx = undefined,
          vy = undefined;

      //Calculate the distance vector
      if (global) {
        vx = r1.gx + Math.abs(r1.halfWidth) - r1.xAnchorOffset - (r2.gx + Math.abs(r2.halfWidth) - r2.xAnchorOffset);
        vy = r1.gy + Math.abs(r1.halfHeight) - r1.yAnchorOffset - (r2.gy + Math.abs(r2.halfHeight) - r2.yAnchorOffset);
      } else {
        //vx = r1.centerX - r2.centerX;
        //vy = r1.centerY - r2.centerY;
        vx = r1.x + Math.abs(r1.halfWidth) - r1.xAnchorOffset - (r2.x + Math.abs(r2.halfWidth) - r2.xAnchorOffset);
        vy = r1.y + Math.abs(r1.halfHeight) - r1.yAnchorOffset - (r2.y + Math.abs(r2.halfHeight) - r2.yAnchorOffset);
      }

      //Figure out the combined half-widths and half-heights
      combinedHalfWidths = Math.abs(r1.halfWidth) + Math.abs(r2.halfWidth);
      combinedHalfHeights = Math.abs(r1.halfHeight) + Math.abs(r2.halfHeight);

      //Check whether vx is less than the combined half widths
      if (Math.abs(vx) < combinedHalfWidths) {

        //A collision might be occurring!
        //Check whether vy is less than the combined half heights
        if (Math.abs(vy) < combinedHalfHeights) {

          //A collision has occurred! This is good!
          //Find out the size of the overlap on both the X and Y axes
          overlapX = combinedHalfWidths - Math.abs(vx);
          overlapY = combinedHalfHeights - Math.abs(vy);

          //The collision has occurred on the axis with the
          //*smallest* amount of overlap. Let's figure out which
          //axis that is

          if (overlapX >= overlapY) {
            //The collision is happening on the X axis
            //But on which side? vy can tell us

            if (vy > 0) {
              collision = "top";
              //Move the rectangle out of the collision
              r1.y = r1.y + overlapY;
            } else {
              collision = "bottom";
              //Move the rectangle out of the collision
              r1.y = r1.y - overlapY;
            }

            //Bounce
            if (bounce) {
              r1.vy *= -1;

              /*Alternative
              //Find the bounce surface's vx and vy properties
              var s = {};
              s.vx = r2.x - r2.x + r2.width;
              s.vy = 0;
               //Bounce r1 off the surface
              //this.bounceOffSurface(r1, s);
              */
            }
          } else {
              //The collision is happening on the Y axis
              //But on which side? vx can tell us

              if (vx > 0) {
                collision = "left";
                //Move the rectangle out of the collision
                r1.x = r1.x + overlapX;
              } else {
                collision = "right";
                //Move the rectangle out of the collision
                r1.x = r1.x - overlapX;
              }

              //Bounce
              if (bounce) {
                r1.vx *= -1;

                /*Alternative
                //Find the bounce surface's vx and vy properties
                var s = {};
                s.vx = 0;
                s.vy = r2.y - r2.y + r2.height;
                 //Bounce r1 off the surface
                this.bounceOffSurface(r1, s);
                */
              }
            }
        } else {
            //No collision
          }
      } else {}
        //No collision

        //Return the collision string. it will be either "top", "right",
        //"bottom", or "left" depending on which side of r1 is touching r2.
      return collision;
    }

    /*
    hitTestRectangle
    ----------------
     Use it to find out if two rectangular sprites are touching.
    Parameters: 
    a. A sprite object with `centerX`, `centerY`, `halfWidth` and `halfHeight` properties.
    b. A sprite object with `centerX`, `centerY`, `halfWidth` and `halfHeight` properties.
     */

  }, {
    key: "hitTestRectangle",
    value: function hitTestRectangle(r1, r2) {
      var global = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

      //Add collision properties
      if (!r1._bumpPropertiesAdded) this.addCollisionProperties(r1);
      if (!r2._bumpPropertiesAdded) this.addCollisionProperties(r2);

      var hit = undefined,
          combinedHalfWidths = undefined,
          combinedHalfHeights = undefined,
          vx = undefined,
          vy = undefined;

      //A variable to determine whether there's a collision
      hit = false;

      //Calculate the distance vector
      if (global) {
        vx = r1.gx + Math.abs(r1.halfWidth) - r1.xAnchorOffset - (r2.gx + Math.abs(r2.halfWidth) - r2.xAnchorOffset);
        vy = r1.gy + Math.abs(r1.halfHeight) - r1.yAnchorOffset - (r2.gy + Math.abs(r2.halfHeight) - r2.yAnchorOffset);
      } else {
        vx = r1.x + Math.abs(r1.halfWidth) - r1.xAnchorOffset - (r2.x + Math.abs(r2.halfWidth) - r2.xAnchorOffset);
        vy = r1.y + Math.abs(r1.halfHeight) - r1.yAnchorOffset - (r2.y + Math.abs(r2.halfHeight) - r2.yAnchorOffset);
      }

      //Figure out the combined half-widths and half-heights
      combinedHalfWidths = Math.abs(r1.halfWidth) + Math.abs(r2.halfWidth);
      combinedHalfHeights = Math.abs(r1.halfHeight) + Math.abs(r2.halfHeight);

      //Check for a collision on the x axis
      if (Math.abs(vx) < combinedHalfWidths) {

        //A collision might be occuring. Check for a collision on the y axis
        if (Math.abs(vy) < combinedHalfHeights) {

          //There's definitely a collision happening
          hit = true;
        } else {

          //There's no collision on the y axis
          hit = false;
        }
      } else {

        //There's no collision on the x axis
        hit = false;
      }

      //`hit` will be either `true` or `false`
      return hit;
    }

    /*
    hitTestCircleRectangle
    ----------------
     Use it to find out if a circular shape is touching a rectangular shape
    Parameters: 
    a. A sprite object with `centerX`, `centerY`, `halfWidth` and `halfHeight` properties.
    b. A sprite object with `centerX`, `centerY`, `halfWidth` and `halfHeight` properties.
     */

  }, {
    key: "hitTestCircleRectangle",
    value: function hitTestCircleRectangle(c1, r1) {
      var global = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

      //Add collision properties
      if (!r1._bumpPropertiesAdded) this.addCollisionProperties(r1);
      if (!c1._bumpPropertiesAdded) this.addCollisionProperties(c1);

      var region = undefined,
          collision = undefined,
          c1x = undefined,
          c1y = undefined,
          r1x = undefined,
          r1y = undefined;

      //Use either global or local coordinates
      if (global) {
        c1x = c1.gx;
        c1y = c1.gy;
        r1x = r1.gx;
        r1y = r1.gy;
      } else {
        c1x = c1.x;
        c1y = c1.y;
        r1x = r1.x;
        r1y = r1.y;
      }

      //Is the circle above the rectangle's top edge?
      if (c1y - c1.yAnchorOffset < r1y - Math.abs(r1.halfHeight) - r1.yAnchorOffset) {

        //If it is, we need to check whether it's in the
        //top left, top center or top right
        if (c1x - c1.xAnchorOffset < r1x - 1 - Math.abs(r1.halfWidth) - r1.xAnchorOffset) {
          region = "topLeft";
        } else if (c1x - c1.xAnchorOffset > r1x + 1 + Math.abs(r1.halfWidth) - r1.xAnchorOffset) {
          region = "topRight";
        } else {
          region = "topMiddle";
        }
      }

      //The circle isn't above the top edge, so it might be
      //below the bottom edge
      else if (c1y - c1.yAnchorOffset > r1y + Math.abs(r1.halfHeight) - r1.yAnchorOffset) {

          //If it is, we need to check whether it's in the bottom left,
          //bottom center, or bottom right
          if (c1x - c1.xAnchorOffset < r1x - 1 - Math.abs(r1.halfWidth) - r1.xAnchorOffset) {
            region = "bottomLeft";
          } else if (c1x - c1.xAnchorOffset > r1x + 1 + Math.abs(r1.halfWidth) - r1.xAnchorOffset) {
            region = "bottomRight";
          } else {
            region = "bottomMiddle";
          }
        }

        //The circle isn't above the top edge or below the bottom edge,
        //so it must be on the left or right side
        else {
            if (c1x - c1.xAnchorOffset < r1x - Math.abs(r1.halfWidth) - r1.xAnchorOffset) {
              region = "leftMiddle";
            } else {
              region = "rightMiddle";
            }
          }

      //Is this the circle touching the flat sides
      //of the rectangle?
      if (region === "topMiddle" || region === "bottomMiddle" || region === "leftMiddle" || region === "rightMiddle") {

        //Yes, it is, so do a standard rectangle vs. rectangle collision test
        collision = this.hitTestRectangle(c1, r1, global);
      }

      //The circle is touching one of the corners, so do a
      //circle vs. point collision test
      else {
          var point = {};

          switch (region) {
            case "topLeft":
              point.x = r1x - r1.xAnchorOffset;
              point.y = r1y - r1.yAnchorOffset;
              break;

            case "topRight":
              point.x = r1x + r1.width - r1.xAnchorOffset;
              point.y = r1y - r1.yAnchorOffset;
              break;

            case "bottomLeft":
              point.x = r1x - r1.xAnchorOffset;
              point.y = r1y + r1.height - r1.yAnchorOffset;
              break;

            case "bottomRight":
              point.x = r1x + r1.width - r1.xAnchorOffset;
              point.y = r1y + r1.height - r1.yAnchorOffset;
          }

          //Check for a collision between the circle and the point
          collision = this.hitTestCirclePoint(c1, point, global);
        }

      //Return the result of the collision.
      //The return value will be `undefined` if there's no collision
      if (collision) {
        return region;
      } else {
        return collision;
      }
    }

    /*
    hitTestCirclePoint
    ------------------
     Use it to find out if a circular shape is touching a point
    Parameters: 
    a. A sprite object with `centerX`, `centerY`, and `radius` properties.
    b. A point object with `x` and `y` properties.
     */

  }, {
    key: "hitTestCirclePoint",
    value: function hitTestCirclePoint(c1, point) {
      var global = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

      //Add collision properties
      if (!c1._bumpPropertiesAdded) this.addCollisionProperties(c1);

      //A point is just a circle with a diameter of
      //1 pixel, so we can cheat. All we need to do is an ordinary circle vs. circle
      //Collision test. Just supply the point with the properties
      //it needs
      point.diameter = 1;
      point.width = point.diameter;
      point.radius = 0.5;
      point.centerX = point.x;
      point.centerY = point.y;
      point.gx = point.x;
      point.gy = point.y;
      point.xAnchorOffset = 0;
      point.yAnchorOffset = 0;
      point._bumpPropertiesAdded = true;
      return this.hitTestCircle(c1, point, global);
    }

    /*
    circleRectangleCollision
    ------------------------
     Use it to bounce a circular shape off a rectangular shape
    Parameters: 
    a. A sprite object with `centerX`, `centerY`, `halfWidth` and `halfHeight` properties.
    b. A sprite object with `centerX`, `centerY`, `halfWidth` and `halfHeight` properties.
     */

  }, {
    key: "circleRectangleCollision",
    value: function circleRectangleCollision(c1, r1) {
      var bounce = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];
      var global = arguments.length <= 3 || arguments[3] === undefined ? false : arguments[3];

      //Add collision properties
      if (!r1._bumpPropertiesAdded) this.addCollisionProperties(r1);
      if (!c1._bumpPropertiesAdded) this.addCollisionProperties(c1);

      var region = undefined,
          collision = undefined,
          c1x = undefined,
          c1y = undefined,
          r1x = undefined,
          r1y = undefined;

      //Use either the global or local coordinates
      if (global) {
        c1x = c1.gx;
        c1y = c1.gy;
        r1x = r1.gx;
        r1y = r1.gy;
      } else {
        c1x = c1.x;
        c1y = c1.y;
        r1x = r1.x;
        r1y = r1.y;
      }

      //Is the circle above the rectangle's top edge?
      if (c1y - c1.yAnchorOffset < r1y - Math.abs(r1.halfHeight) - r1.yAnchorOffset) {

        //If it is, we need to check whether it's in the
        //top left, top center or top right
        if (c1x - c1.xAnchorOffset < r1x - 1 - Math.abs(r1.halfWidth) - r1.xAnchorOffset) {
          region = "topLeft";
        } else if (c1x - c1.xAnchorOffset > r1x + 1 + Math.abs(r1.halfWidth) - r1.xAnchorOffset) {
          region = "topRight";
        } else {
          region = "topMiddle";
        }
      }

      //The circle isn't above the top edge, so it might be
      //below the bottom edge
      else if (c1y - c1.yAnchorOffset > r1y + Math.abs(r1.halfHeight) - r1.yAnchorOffset) {

          //If it is, we need to check whether it's in the bottom left,
          //bottom center, or bottom right
          if (c1x - c1.xAnchorOffset < r1x - 1 - Math.abs(r1.halfWidth) - r1.xAnchorOffset) {
            region = "bottomLeft";
          } else if (c1x - c1.xAnchorOffset > r1x + 1 + Math.abs(r1.halfWidth) - r1.xAnchorOffset) {
            region = "bottomRight";
          } else {
            region = "bottomMiddle";
          }
        }

        //The circle isn't above the top edge or below the bottom edge,
        //so it must be on the left or right side
        else {
            if (c1x - c1.xAnchorOffset < r1x - Math.abs(r1.halfWidth) - r1.xAnchorOffset) {
              region = "leftMiddle";
            } else {
              region = "rightMiddle";
            }
          }

      //Is this the circle touching the flat sides
      //of the rectangle?
      if (region === "topMiddle" || region === "bottomMiddle" || region === "leftMiddle" || region === "rightMiddle") {

        //Yes, it is, so do a standard rectangle vs. rectangle collision test
        collision = this.rectangleCollision(c1, r1, bounce, global);
      }

      //The circle is touching one of the corners, so do a
      //circle vs. point collision test
      else {
          var point = {};

          switch (region) {
            case "topLeft":
              point.x = r1x - r1.xAnchorOffset;
              point.y = r1y - r1.yAnchorOffset;
              break;

            case "topRight":
              point.x = r1x + r1.width - r1.xAnchorOffset;
              point.y = r1y - r1.yAnchorOffset;
              break;

            case "bottomLeft":
              point.x = r1x - r1.xAnchorOffset;
              point.y = r1y + r1.height - r1.yAnchorOffset;
              break;

            case "bottomRight":
              point.x = r1x + r1.width - r1.xAnchorOffset;
              point.y = r1y + r1.height - r1.yAnchorOffset;
          }

          //Check for a collision between the circle and the point
          collision = this.circlePointCollision(c1, point, bounce, global);
        }

      if (collision) {
        return region;
      } else {
        return collision;
      }
    }

    /*
    circlePointCollision
    --------------------
     Use it to boucnce a circle off a point.
    Parameters: 
    a. A sprite object with `centerX`, `centerY`, and `radius` properties.
    b. A point object with `x` and `y` properties.
     */

  }, {
    key: "circlePointCollision",
    value: function circlePointCollision(c1, point) {
      var bounce = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];
      var global = arguments.length <= 3 || arguments[3] === undefined ? false : arguments[3];

      //Add collision properties
      if (!c1._bumpPropertiesAdded) this.addCollisionProperties(c1);

      //A point is just a circle with a diameter of
      //1 pixel, so we can cheat. All we need to do is an ordinary circle vs. circle
      //Collision test. Just supply the point with the properties
      //it needs
      point.diameter = 1;
      point.width = point.diameter;
      point.radius = 0.5;
      point.centerX = point.x;
      point.centerY = point.y;
      point.gx = point.x;
      point.gy = point.y;
      point.xAnchorOffset = 0;
      point.yAnchorOffset = 0;
      point._bumpPropertiesAdded = true;
      return this.circleCollision(c1, point, bounce, global);
    }

    /*
    bounceOffSurface
    ----------------
     Use this to bounce an object off another object.
    Parameters: 
    a. An object with `v.x` and `v.y` properties. This represents the object that is colliding
    with a surface.
    b. An object with `x` and `y` properties. This represents the surface that the object
    is colliding into.
    The first object can optionally have a mass property that's greater than 1. The mass will
    be used to dampen the bounce effect.
    */

  }, {
    key: "bounceOffSurface",
    value: function bounceOffSurface(o, s) {

      //Add collision properties
      if (!o._bumpPropertiesAdded) this.addCollisionProperties(o);

      var dp1 = undefined,
          dp2 = undefined,
          p1 = {},
          p2 = {},
          bounce = {},
          mass = o.mass || 1;

      //1. Calculate the collision surface's properties
      //Find the surface vector's left normal
      s.lx = s.y;
      s.ly = -s.x;

      //Find its magnitude
      s.magnitude = Math.sqrt(s.x * s.x + s.y * s.y);

      //Find its normalized values
      s.dx = s.x / s.magnitude;
      s.dy = s.y / s.magnitude;

      //2. Bounce the object (o) off the surface (s)

      //Find the dot product between the object and the surface
      dp1 = o.vx * s.dx + o.vy * s.dy;

      //Project the object's velocity onto the collision surface
      p1.vx = dp1 * s.dx;
      p1.vy = dp1 * s.dy;

      //Find the dot product of the object and the surface's left normal (s.lx and s.ly)
      dp2 = o.vx * (s.lx / s.magnitude) + o.vy * (s.ly / s.magnitude);

      //Project the object's velocity onto the surface's left normal
      p2.vx = dp2 * (s.lx / s.magnitude);
      p2.vy = dp2 * (s.ly / s.magnitude);

      //Reverse the projection on the surface's left normal
      p2.vx *= -1;
      p2.vy *= -1;

      //Add up the projections to create a new bounce vector
      bounce.x = p1.vx + p2.vx;
      bounce.y = p1.vy + p2.vy;

      //Assign the bounce vector to the object's velocity
      //with optional mass to dampen the effect
      o.vx = bounce.x / mass;
      o.vy = bounce.y / mass;
    }

    /*
    contain
    -------
    `contain` can be used to contain a sprite with `x` and
    `y` properties inside a rectangular area.
     The `contain` function takes four arguments: a sprite with `x` and `y`
    properties, an object literal with `x`, `y`, `width` and `height` properties. The 
    third argument is a Boolean (true/false) value that determines if the sprite
    should bounce when it hits the edge of the container. The fourth argument
    is an extra user-defined callback function that you can call when the
    sprite hits the container
    ```js
    contain(anySprite, {x: 0, y: 0, width: 512, height: 512}, true, callbackFunction);
    ```
    The code above will contain the sprite's position inside the 512 by
    512 pixel area defined by the object. If the sprite hits the edges of
    the container, it will bounce. The `callBackFunction` will run if 
    there's a collision.
     An additional feature of the `contain` method is that if the sprite
    has a `mass` property, it will be used to dampen the sprite's bounce
    in a natural looking way.
     If the sprite bumps into any of the containing object's boundaries,
    the `contain` function will return a value that tells you which side
    the sprite bumped into: “left”, “top”, “right” or “bottom”. Here's how
    you could keep the sprite contained and also find out which boundary
    it hit:
    ```js
    //Contain the sprite and find the collision value
    let collision = contain(anySprite, {x: 0, y: 0, width: 512, height: 512});
     //If there's a collision, display the boundary that the collision happened on
    if(collision) {
      if collision.has("left") console.log("The sprite hit the left");  
      if collision.has("top") console.log("The sprite hit the top");  
      if collision.has("right") console.log("The sprite hit the right");  
      if collision.has("bottom") console.log("The sprite hit the bottom");  
    }
    ```
    If the sprite doesn't hit a boundary, the value of
    `collision` will be `undefined`. 
    */

    /*
     contain(sprite, container, bounce = false, extra = undefined) {
        //Helper methods that compensate for any possible shift the the
       //sprites' anchor points
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
       //Create a set called `collision` to keep track of the
       //boundaries with which the sprite is colliding
       let collision = new Set();
        //Left
       if (sprite.x - compensateForAnchor(sprite, sprite.width, "x") < container.x - sprite.parent.gx - compensateForAnchor(container, container.width, "x")) {
         //Bounce the sprite if `bounce` is true
         if (bounce) sprite.vx *= -1;
          //If the sprite has `mass`, let the mass
         //affect the sprite's velocity
         if(sprite.mass) sprite.vx /= sprite.mass;
          //Keep the sprite inside the container
         sprite.x = container.x - sprite.parent.gx + compensateForAnchor(sprite, sprite.width, "x") - compensateForAnchor(container, container.width, "x");
          //Add "left" to the collision set
         collision.add("left");
       }
        //Top
       if (sprite.y - compensateForAnchor(sprite, sprite.height, "y") < container.y - sprite.parent.gy - compensateForAnchor(container, container.height, "y")) {
         if (bounce) sprite.vy *= -1;
         if(sprite.mass) sprite.vy /= sprite.mass;
         sprite.y = container.x - sprite.parent.gy + compensateForAnchor(sprite, sprite.height, "y") - compensateForAnchor(container, container.height, "y");
         collision.add("top");
       }
        //Right
       if (sprite.x - compensateForAnchor(sprite, sprite.width, "x") + sprite.width > container.width - compensateForAnchor(container, container.width, "x")) {
         if (bounce) sprite.vx *= -1;
         if(sprite.mass) sprite.vx /= sprite.mass;
         sprite.x = container.width - sprite.width + compensateForAnchor(sprite, sprite.width, "x") - compensateForAnchor(container, container.width, "x");
         collision.add("right");
       }
        //Bottom
       if (sprite.y - compensateForAnchor(sprite, sprite.height, "y") + sprite.height > container.height - compensateForAnchor(container, container.height, "y")) {
         if (bounce) sprite.vy *= -1;
         if(sprite.mass) sprite.vy /= sprite.mass;
         sprite.y = container.height - sprite.height + compensateForAnchor(sprite, sprite.height, "y") - compensateForAnchor(container, container.height, "y");
         collision.add("bottom");
       }
        //If there were no collisions, set `collision` to `undefined`
       if (collision.size === 0) collision = undefined;
        //The `extra` function runs if there was a collision
       //and `extra` has been defined
       if (collision && extra) extra(collision);
        //Return the `collision` value
       return collision;
     }
     */

  }, {
    key: "contain",
    value: function contain(sprite, container) {
      var bounce = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];
      var extra = arguments.length <= 3 || arguments[3] === undefined ? undefined : arguments[3];

      //Add collision properties
      if (!sprite._bumpPropertiesAdded) this.addCollisionProperties(sprite);

      //Give the container x and y anchor offset values, if it doesn't
      //have any
      if (container.xAnchorOffset === undefined) container.xAnchorOffset = 0;
      if (container.yAnchorOffset === undefined) container.yAnchorOffset = 0;
      if (sprite.parent.gx === undefined) sprite.parent.gx = 0;
      if (sprite.parent.gy === undefined) sprite.parent.gy = 0;

      //Create a Set called `collision` to keep track of the
      //boundaries with which the sprite is colliding
      var collision = new Set();

      //Left
      if (sprite.x - sprite.xAnchorOffset < container.x - sprite.parent.gx - container.xAnchorOffset) {

        //Bounce the sprite if `bounce` is true
        if (bounce) sprite.vx *= -1;

        //If the sprite has `mass`, let the mass
        //affect the sprite's velocity
        if (sprite.mass) sprite.vx /= sprite.mass;

        //Reposition the sprite inside the container
        sprite.x = container.x - sprite.parent.gx - container.xAnchorOffset + sprite.xAnchorOffset;

        //Make a record of the side which the container hit
        collision.add("left");
      }

      //Top
      if (sprite.y - sprite.yAnchorOffset < container.y - sprite.parent.gy - container.yAnchorOffset) {
        if (bounce) sprite.vy *= -1;
        if (sprite.mass) sprite.vy /= sprite.mass;
        sprite.y = container.y - sprite.parent.gy - container.yAnchorOffset + sprite.yAnchorOffset;;
        collision.add("top");
      }

      //Right
      if (sprite.x - sprite.xAnchorOffset + sprite.width > container.width - container.xAnchorOffset) {
        if (bounce) sprite.vx *= -1;
        if (sprite.mass) sprite.vx /= sprite.mass;
        sprite.x = container.width - sprite.width - container.xAnchorOffset + sprite.xAnchorOffset;
        collision.add("right");
      }

      //Bottom
      if (sprite.y - sprite.yAnchorOffset + sprite.height > container.height - container.yAnchorOffset) {
        if (bounce) sprite.vy *= -1;
        if (sprite.mass) sprite.vy /= sprite.mass;
        sprite.y = container.height - sprite.height - container.yAnchorOffset + sprite.yAnchorOffset;
        collision.add("bottom");
      }

      //If there were no collisions, set `collision` to `undefined`
      if (collision.size === 0) collision = undefined;

      //The `extra` function runs if there was a collision
      //and `extra` has been defined
      if (collision && extra) extra(collision);

      //Return the `collision` value
      return collision;
    }

    //`outsideBounds` checks whether a sprite is outide the boundary of
    //another object. It returns an object called `collision`. `collision` will be `undefined` if there's no
    //collision. But if there is a collision, `collision` will be
    //returned as a Set containg strings that tell you which boundary
    //side was crossed: "left", "right", "top" or "bottom"

  }, {
    key: "outsideBounds",
    value: function outsideBounds(s, bounds, extra) {

      var x = bounds.x,
          y = bounds.y,
          width = bounds.width,
          height = bounds.height;

      //The `collision` object is used to store which
      //side of the containing rectangle the sprite hits
      var collision = new Set();

      //Left
      if (s.x < x - s.width) {
        collision.add("left");
      }
      //Top
      if (s.y < y - s.height) {
        collision.add("top");
      }
      //Right
      if (s.x > width + s.width) {
        collision.add("right");
      }
      //Bottom
      if (s.y > height + s.height) {
        collision.add("bottom");
      }

      //If there were no collisions, set `collision` to `undefined`
      if (collision.size === 0) collision = undefined;

      //The `extra` function runs if there was a collision
      //and `extra` has been defined
      if (collision && extra) extra(collision);

      //Return the `collision` object
      return collision;
    }

    /*
    _getCenter
    ----------
     A utility that finds the center point of the sprite. If it's anchor point is the
    sprite's top left corner, then the center is calculated from that point.
    If the anchor point has been shifted, then the anchor x/y point is used as the sprite's center
    */

  }, {
    key: "_getCenter",
    value: function _getCenter(o, dimension, axis) {
      if (o.anchor !== undefined) {
        if (o.anchor[axis] !== 0) {
          return 0;
        } else {
          //console.log(o.anchor[axis])
          return dimension / 2;
        }
      } else {
        return dimension;
      }
    }

    /*
    hit
    ---
    A convenient universal collision function to test for collisions
    between rectangles, circles, and points.
    */

  }, {
    key: "hit",
    value: function hit(a, b) {
      var react = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];
      var bounce = arguments.length <= 3 || arguments[3] === undefined ? false : arguments[3];
      var global = arguments[4];
      var extra = arguments.length <= 5 || arguments[5] === undefined ? undefined : arguments[5];

      //Local references to bump's collision methods
      var hitTestPoint = this.hitTestPoint.bind(this),
          hitTestRectangle = this.hitTestRectangle.bind(this),
          hitTestCircle = this.hitTestCircle.bind(this),
          movingCircleCollision = this.movingCircleCollision.bind(this),
          circleCollision = this.circleCollision.bind(this),
          hitTestCircleRectangle = this.hitTestCircleRectangle.bind(this),
          rectangleCollision = this.rectangleCollision.bind(this),
          circleRectangleCollision = this.circleRectangleCollision.bind(this);

      var collision = undefined,
          aIsASprite = a.parent !== undefined,
          bIsASprite = b.parent !== undefined;

      //Check to make sure one of the arguments isn't an array
      if (aIsASprite && b instanceof Array || bIsASprite && a instanceof Array) {
        //If it is, check for a collision between a sprite and an array
        spriteVsArray();
      } else {
        //If one of the arguments isn't an array, find out what type of
        //collision check to run
        collision = findCollisionType(a, b);
        if (collision && extra) extra(collision);
      }

      //Return the result of the collision.
      //It will be `undefined` if there's no collision and `true` if
      //there is a collision. `rectangleCollision` sets `collsision` to
      //"top", "bottom", "left" or "right" depeneding on which side the
      //collision is occuring on
      return collision;

      function findCollisionType(a, b) {
        //Are `a` and `b` both sprites?
        //(We have to check again if this function was called from
        //`spriteVsArray`)
        var aIsASprite = a.parent !== undefined;
        var bIsASprite = b.parent !== undefined;

        if (aIsASprite && bIsASprite) {
          //Yes, but what kind of sprites?
          if (a.diameter && b.diameter) {
            //They're circles
            return circleVsCircle(a, b);
          } else if (a.diameter && !b.diameter) {
            //The first one is a circle and the second is a rectangle
            return circleVsRectangle(a, b);
          } else {
            //They're rectangles
            return rectangleVsRectangle(a, b);
          }
        }
        //They're not both sprites, so what are they?
        //Is `a` not a sprite and does it have x and y properties?
        else if (bIsASprite && !(a.x === undefined) && !(a.y === undefined)) {
            //Yes, so this is a point vs. sprite collision test
            return hitTestPoint(a, b);
          } else {
            //The user is trying to test some incompatible objects
            throw new Error("I'm sorry, " + a + " and " + b + " cannot be use together in a collision test.'");
          }
      }

      function spriteVsArray() {
        //If `a` happens to be the array, flip it around so that it becomes `b`
        if (a instanceof Array) {
          var _ref = [_b, _a];
          var _a = _ref[0];
          var _b = _ref[1];
        }
        //Loop through the array in reverse
        for (var i = b.length - 1; i >= 0; i--) {
          var sprite = b[i];
          collision = findCollisionType(a, sprite);
          if (collision && extra) extra(collision, sprite);
        }
      }

      function circleVsCircle(a, b) {
        //If the circles shouldn't react to the collision,
        //just test to see if they're touching
        if (!react) {
          return hitTestCircle(a, b);
        }
        //Yes, the circles should react to the collision
        else {
            //Are they both moving?
            if (a.vx + a.vy !== 0 && b.vx + b.vy !== 0) {
              //Yes, they are both moving
              //(moving circle collisions always bounce apart so there's
              //no need for the third, `bounce`, argument)
              return movingCircleCollision(a, b, global);
            } else {
              //No, they're not both moving
              return circleCollision(a, b, bounce, global);
            }
          }
      }

      function rectangleVsRectangle(a, b) {
        //If the rectangles shouldn't react to the collision, just
        //test to see if they're touching
        if (!react) {
          return hitTestRectangle(a, b, global);
        } else {
          return rectangleCollision(a, b, bounce, global);
        }
      }

      function circleVsRectangle(a, b) {
        //If the rectangles shouldn't react to the collision, just
        //test to see if they're touching
        if (!react) {
          return hitTestCircleRectangle(a, b, global);
        } else {
          return circleRectangleCollision(a, b, bounce, global);
        }
      }
    }
  }]);

  return Bump;
})();
//# sourceMappingURL=bump.js.map"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Charm = (function () {
  function Charm() {
    var _this = this;

    var renderingEngine = arguments.length <= 0 || arguments[0] === undefined ? PIXI : arguments[0];

    _classCallCheck(this, Charm);

    if (renderingEngine === undefined) throw new Error("Please assign a rendering engine in the constructor before using charm.js");

    //Find out which rendering engine is being used (the default is Pixi)
    this.renderer = "";

    //If the `renderingEngine` is Pixi, set up Pixi object aliases
    if (renderingEngine.ParticleContainer && renderingEngine.Sprite) {
      this.renderer = "pixi";
    }

    //An array to store the global tweens
    this.globalTweens = [];

    //An object that stores all the easing formulas
    this.easingFormulas = {

      //Linear

      linear: function linear(x) {
        return x;
      },

      //Smoothstep
      smoothstep: function smoothstep(x) {
        return x * x * (3 - 2 * x);
      },
      smoothstepSquared: function smoothstepSquared(x) {
        return Math.pow(x * x * (3 - 2 * x), 2);
      },
      smoothstepCubed: function smoothstepCubed(x) {
        return Math.pow(x * x * (3 - 2 * x), 3);
      },

      //Acceleration
      acceleration: function acceleration(x) {
        return x * x;
      },
      accelerationCubed: function accelerationCubed(x) {
        return Math.pow(x * x, 3);
      },

      //Deceleration
      deceleration: function deceleration(x) {
        return 1 - Math.pow(1 - x, 2);
      },
      decelerationCubed: function decelerationCubed(x) {
        return 1 - Math.pow(1 - x, 3);
      },

      //Sine
      sine: function sine(x) {
        return Math.sin(x * Math.PI / 2);
      },
      sineSquared: function sineSquared(x) {
        return Math.pow(Math.sin(x * Math.PI / 2), 2);
      },
      sineCubed: function sineCubed(x) {
        return Math.pow(Math.sin(x * Math.PI / 2), 2);
      },
      inverseSine: function inverseSine(x) {
        return 1 - Math.sin((1 - x) * Math.PI / 2);
      },
      inverseSineSquared: function inverseSineSquared(x) {
        return 1 - Math.pow(Math.sin((1 - x) * Math.PI / 2), 2);
      },
      inverseSineCubed: function inverseSineCubed(x) {
        return 1 - Math.pow(Math.sin((1 - x) * Math.PI / 2), 3);
      },

      //Spline
      spline: function spline(t, p0, p1, p2, p3) {
        return 0.5 * (2 * p1 + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t * t + (-p0 + 3 * p1 - 3 * p2 + p3) * t * t * t);
      },

      //Bezier curve
      cubicBezier: function cubicBezier(t, a, b, c, d) {
        var t2 = t * t;
        var t3 = t2 * t;
        return a + (-a * 3 + t * (3 * a - a * t)) * t + (3 * b + t * (-6 * b + b * 3 * t)) * t + (c * 3 - c * 3 * t) * t2 + d * t3;
      }
    };

    //Add `scaleX` and `scaleY` properties to Pixi sprites
    this._addScaleProperties = function (sprite) {
      if (_this.renderer === "pixi") {
        if (!("scaleX" in sprite) && "scale" in sprite && "x" in sprite.scale) {
          Object.defineProperty(sprite, "scaleX", {
            get: function get() {
              return sprite.scale.x;
            },
            set: function set(value) {
              sprite.scale.x = value;
            }
          });
        }
        if (!("scaleY" in sprite) && "scale" in sprite && "y" in sprite.scale) {
          Object.defineProperty(sprite, "scaleY", {
            get: function get() {
              return sprite.scale.y;
            },
            set: function set(value) {
              sprite.scale.y = value;
            }
          });
        }
      }
    };
  }

  //The low level `tweenProperty` function is used as the foundation
  //for the the higher level tween methods.

  _createClass(Charm, [{
    key: "tweenProperty",
    value: function tweenProperty(sprite, //Sprite object
    property, //String property
    startValue, //Tween start value
    endValue, //Tween end value
    totalFrames) //Delay in frames before repeating
    {
      var type = arguments.length <= 5 || arguments[5] === undefined ? "smoothstep" : arguments[5];

      var _this2 = this;

      var yoyo = arguments.length <= 6 || arguments[6] === undefined ? false : arguments[6];
      var delayBeforeRepeat = arguments.length <= 7 || arguments[7] === undefined ? 0 : arguments[7];

      //Create the tween object
      var o = {};

      //If the tween is a bounce type (a spline), set the
      //start and end magnitude values
      var typeArray = type.split(" ");
      if (typeArray[0] === "bounce") {
        o.startMagnitude = parseInt(typeArray[1]);
        o.endMagnitude = parseInt(typeArray[2]);
      }

      //Use `o.start` to make a new tween using the current
      //end point values
      o.start = function (startValue, endValue) {

        //Clone the start and end values so that any possible references to sprite
        //properties are converted to ordinary numbers
        o.startValue = JSON.parse(JSON.stringify(startValue));
        o.endValue = JSON.parse(JSON.stringify(endValue));
        o.playing = true;
        o.totalFrames = totalFrames;
        o.frameCounter = 0;

        //Add the tween to the global `tweens` array. The `tweens` array is
        //updated on each frame
        _this2.globalTweens.push(o);
      };

      //Call `o.start` to start the tween
      o.start(startValue, endValue);

      //The `update` method will be called on each frame by the game loop.
      //This is what makes the tween move
      o.update = function () {

        var time = undefined,
            curvedTime = undefined;

        if (o.playing) {

          //If the elapsed frames are less than the total frames,
          //use the tweening formulas to move the sprite
          if (o.frameCounter < o.totalFrames) {

            //Find the normalized value
            var normalizedTime = o.frameCounter / o.totalFrames;

            //Select the correct easing function from the
            //`ease` object’s library of easing functions

            //If it's not a spline, use one of the ordinary easing functions
            if (typeArray[0] !== "bounce") {
              curvedTime = _this2.easingFormulas[type](normalizedTime);
            }

            //If it's a spline, use the `spline` function and apply the
            //2 additional `type` array values as the spline's start and
            //end points
            else {
                curvedTime = _this2.easingFormulas.spline(normalizedTime, o.startMagnitude, 0, 1, o.endMagnitude);
              }

            //Interpolate the sprite's property based on the curve
            sprite[property] = o.endValue * curvedTime + o.startValue * (1 - curvedTime);

            o.frameCounter += 1;
          }

          //When the tween has finished playing, run the end tasks
          else {
              sprite[property] = o.endValue;
              o.end();
            }
        }
      };

      //The `end` method will be called when the tween is finished
      o.end = function () {

        //Set `playing` to `false`
        o.playing = false;

        //Call the tween's `onComplete` method, if it's been assigned
        if (o.onComplete) o.onComplete();

        //Remove the tween from the `tweens` array
        _this2.globalTweens.splice(_this2.globalTweens.indexOf(o), 1);

        //If the tween's `yoyo` property is `true`, create a new tween
        //using the same values, but use the current tween's `startValue`
        //as the next tween's `endValue`
        if (yoyo) {
          _this2.wait(delayBeforeRepeat).then(function () {
            o.start(o.endValue, o.startValue);
          });
        }
      };

      //Pause and play methods
      o.play = function () {
        return o.playing = true;
      };
      o.pause = function () {
        return o.playing = false;
      };

      //Return the tween object
      return o;
    }

    //`makeTween` is a general low-level method for making complex tweens
    //out of multiple `tweenProperty` functions. Its one argument,
    //`tweensToAdd` is an array containing multiple `tweenProperty` calls

  }, {
    key: "makeTween",
    value: function makeTween(tweensToAdd) {
      var _this3 = this;

      //Create an object to manage the tweens
      var o = {};

      //Create a `tweens` array to store the new tweens
      o.tweens = [];

      //Make a new tween for each array
      tweensToAdd.forEach(function (tweenPropertyArguments) {

        //Use the tween property arguments to make a new tween
        var newTween = _this3.tweenProperty.apply(_this3, _toConsumableArray(tweenPropertyArguments));

        //Push the new tween into this object's internal `tweens` array
        o.tweens.push(newTween);
      });

      //Add a counter to keep track of the
      //number of tweens that have completed their actions
      var completionCounter = 0;

      //`o.completed` will be called each time one of the tweens
      //finishes
      o.completed = function () {

        //Add 1 to the `completionCounter`
        completionCounter += 1;

        //If all tweens have finished, call the user-defined `onComplete`
        //method, if it's been assigned. Reset the `completionCounter`
        if (completionCounter === o.tweens.length) {
          if (o.onComplete) o.onComplete();
          completionCounter = 0;
        }
      };

      //Add `onComplete` methods to all tweens
      o.tweens.forEach(function (tween) {
        tween.onComplete = function () {
          return o.completed();
        };
      });

      //Add pause and play methods to control all the tweens
      o.pause = function () {
        o.tweens.forEach(function (tween) {
          tween.playing = false;
        });
      };
      o.play = function () {
        o.tweens.forEach(function (tween) {
          tween.playing = true;
        });
      };

      //Return the tween object
      return o;
    }

    /* High level tween methods */

    //1. Simple tweens

    //`fadeOut`

  }, {
    key: "fadeOut",
    value: function fadeOut(sprite) {
      var frames = arguments.length <= 1 || arguments[1] === undefined ? 60 : arguments[1];

      return this.tweenProperty(sprite, "alpha", sprite.alpha, 0, frames, "sine");
    }

    //`fadeIn`

  }, {
    key: "fadeIn",
    value: function fadeIn(sprite) {
      var frames = arguments.length <= 1 || arguments[1] === undefined ? 60 : arguments[1];

      return this.tweenProperty(sprite, "alpha", sprite.alpha, 1, frames, "sine");
    }

    //`pulse`
    //Fades the sprite in and out at a steady rate.
    //Set the `minAlpha` to something greater than 0 if you
    //don't want the sprite to fade away completely

  }, {
    key: "pulse",
    value: function pulse(sprite) {
      var frames = arguments.length <= 1 || arguments[1] === undefined ? 60 : arguments[1];
      var minAlpha = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];

      return this.tweenProperty(sprite, "alpha", sprite.alpha, minAlpha, frames, "smoothstep", true);
    }

    //2. Complex tweens

  }, {
    key: "slide",
    value: function slide(sprite, endX, endY) {
      var frames = arguments.length <= 3 || arguments[3] === undefined ? 60 : arguments[3];
      var type = arguments.length <= 4 || arguments[4] === undefined ? "smoothstep" : arguments[4];
      var yoyo = arguments.length <= 5 || arguments[5] === undefined ? false : arguments[5];
      var delayBeforeRepeat = arguments.length <= 6 || arguments[6] === undefined ? 0 : arguments[6];

      return this.makeTween([

      //Create the x axis tween
      [sprite, "x", sprite.x, endX, frames, type, yoyo, delayBeforeRepeat],

      //Create the y axis tween
      [sprite, "y", sprite.y, endY, frames, type, yoyo, delayBeforeRepeat]]);
    }
  }, {
    key: "breathe",
    value: function breathe(sprite) {
      var endScaleX = arguments.length <= 1 || arguments[1] === undefined ? 0.8 : arguments[1];
      var endScaleY = arguments.length <= 2 || arguments[2] === undefined ? 0.8 : arguments[2];
      var frames = arguments.length <= 3 || arguments[3] === undefined ? 60 : arguments[3];
      var yoyo = arguments.length <= 4 || arguments[4] === undefined ? true : arguments[4];
      var delayBeforeRepeat = arguments.length <= 5 || arguments[5] === undefined ? 0 : arguments[5];

      //Add `scaleX` and `scaleY` properties to Pixi sprites
      this._addScaleProperties(sprite);

      return this.makeTween([

      //Create the scaleX tween
      [sprite, "scaleX", sprite.scaleX, endScaleX, frames, "smoothstepSquared", yoyo, delayBeforeRepeat],

      //Create the scaleY tween
      [sprite, "scaleY", sprite.scaleY, endScaleY, frames, "smoothstepSquared", yoyo, delayBeforeRepeat]]);
    }
  }, {
    key: "scale",
    value: function scale(sprite) {
      var endScaleX = arguments.length <= 1 || arguments[1] === undefined ? 0.5 : arguments[1];
      var endScaleY = arguments.length <= 2 || arguments[2] === undefined ? 0.5 : arguments[2];
      var frames = arguments.length <= 3 || arguments[3] === undefined ? 60 : arguments[3];

      //Add `scaleX` and `scaleY` properties to Pixi sprites
      this._addScaleProperties(sprite);

      return this.makeTween([

      //Create the scaleX tween
      [sprite, "scaleX", sprite.scaleX, endScaleX, frames, "smoothstep", false],

      //Create the scaleY tween
      [sprite, "scaleY", sprite.scaleY, endScaleY, frames, "smoothstep", false]]);
    }
  }, {
    key: "strobe",
    value: function strobe(sprite) {
      var scaleFactor = arguments.length <= 1 || arguments[1] === undefined ? 1.3 : arguments[1];
      var startMagnitude = arguments.length <= 2 || arguments[2] === undefined ? 10 : arguments[2];
      var endMagnitude = arguments.length <= 3 || arguments[3] === undefined ? 20 : arguments[3];
      var frames = arguments.length <= 4 || arguments[4] === undefined ? 10 : arguments[4];
      var yoyo = arguments.length <= 5 || arguments[5] === undefined ? true : arguments[5];
      var delayBeforeRepeat = arguments.length <= 6 || arguments[6] === undefined ? 0 : arguments[6];

      var bounce = "bounce " + startMagnitude + " " + endMagnitude;

      //Add `scaleX` and `scaleY` properties to Pixi sprites
      this._addScaleProperties(sprite);

      return this.makeTween([

      //Create the scaleX tween
      [sprite, "scaleX", sprite.scaleX, scaleFactor, frames, bounce, yoyo, delayBeforeRepeat],

      //Create the scaleY tween
      [sprite, "scaleY", sprite.scaleY, scaleFactor, frames, bounce, yoyo, delayBeforeRepeat]]);
    }
  }, {
    key: "wobble",
    value: function wobble(sprite) {
      var scaleFactorX = arguments.length <= 1 || arguments[1] === undefined ? 1.2 : arguments[1];
      var scaleFactorY = arguments.length <= 2 || arguments[2] === undefined ? 1.2 : arguments[2];
      var frames = arguments.length <= 3 || arguments[3] === undefined ? 10 : arguments[3];
      var xStartMagnitude = arguments.length <= 4 || arguments[4] === undefined ? 10 : arguments[4];
      var xEndMagnitude = arguments.length <= 5 || arguments[5] === undefined ? 10 : arguments[5];
      var yStartMagnitude = arguments.length <= 6 || arguments[6] === undefined ? -10 : arguments[6];
      var yEndMagnitude = arguments.length <= 7 || arguments[7] === undefined ? -10 : arguments[7];
      var friction = arguments.length <= 8 || arguments[8] === undefined ? 0.98 : arguments[8];

      var _this4 = this;

      var yoyo = arguments.length <= 9 || arguments[9] === undefined ? true : arguments[9];
      var delayBeforeRepeat = arguments.length <= 10 || arguments[10] === undefined ? 0 : arguments[10];

      var bounceX = "bounce " + xStartMagnitude + " " + xEndMagnitude;
      var bounceY = "bounce " + yStartMagnitude + " " + yEndMagnitude;

      //Add `scaleX` and `scaleY` properties to Pixi sprites
      this._addScaleProperties(sprite);

      var o = this.makeTween([

      //Create the scaleX tween
      [sprite, "scaleX", sprite.scaleX, scaleFactorX, frames, bounceX, yoyo, delayBeforeRepeat],

      //Create the scaleY tween
      [sprite, "scaleY", sprite.scaleY, scaleFactorY, frames, bounceY, yoyo, delayBeforeRepeat]]);

      //Add some friction to the `endValue` at the end of each tween
      o.tweens.forEach(function (tween) {
        tween.onComplete = function () {

          //Add friction if the `endValue` is greater than 1
          if (tween.endValue > 1) {
            tween.endValue *= friction;

            //Set the `endValue` to 1 when the effect is finished and
            //remove the tween from the global `tweens` array
            if (tween.endValue <= 1) {
              tween.endValue = 1;
              _this4.removeTween(tween);
            }
          }
        };
      });

      return o;
    }

    //3. Motion path tweens

  }, {
    key: "followCurve",
    value: function followCurve(sprite, pointsArray, totalFrames) {
      var type = arguments.length <= 3 || arguments[3] === undefined ? "smoothstep" : arguments[3];

      var _this5 = this;

      var yoyo = arguments.length <= 4 || arguments[4] === undefined ? false : arguments[4];
      var delayBeforeRepeat = arguments.length <= 5 || arguments[5] === undefined ? 0 : arguments[5];

      //Create the tween object
      var o = {};

      //If the tween is a bounce type (a spline), set the
      //start and end magnitude values
      var typeArray = type.split(" ");
      if (typeArray[0] === "bounce") {
        o.startMagnitude = parseInt(typeArray[1]);
        o.endMagnitude = parseInt(typeArray[2]);
      }

      //Use `tween.start` to make a new tween using the current
      //end point values
      o.start = function (pointsArray) {
        o.playing = true;
        o.totalFrames = totalFrames;
        o.frameCounter = 0;

        //Clone the points array
        o.pointsArray = JSON.parse(JSON.stringify(pointsArray));

        //Add the tween to the `globalTweens` array. The `globalTweens` array is
        //updated on each frame
        _this5.globalTweens.push(o);
      };

      //Call `tween.start` to start the first tween
      o.start(pointsArray);

      //The `update` method will be called on each frame by the game loop.
      //This is what makes the tween move
      o.update = function () {

        var normalizedTime = undefined,
            curvedTime = undefined,
            p = o.pointsArray;

        if (o.playing) {

          //If the elapsed frames are less than the total frames,
          //use the tweening formulas to move the sprite
          if (o.frameCounter < o.totalFrames) {

            //Find the normalized value
            normalizedTime = o.frameCounter / o.totalFrames;

            //Select the correct easing function

            //If it's not a spline, use one of the ordinary tween
            //functions
            if (typeArray[0] !== "bounce") {
              curvedTime = _this5.easingFormulas[type](normalizedTime);
            }

            //If it's a spline, use the `spline` function and apply the
            //2 additional `type` array values as the spline's start and
            //end points
            else {
                //curve = tweenFunction.spline(n, type[1], 0, 1, type[2]);
                curvedTime = _this5.easingFormulas.spline(normalizedTime, o.startMagnitude, 0, 1, o.endMagnitude);
              }

            //Apply the Bezier curve to the sprite's position
            sprite.x = _this5.easingFormulas.cubicBezier(curvedTime, p[0][0], p[1][0], p[2][0], p[3][0]);
            sprite.y = _this5.easingFormulas.cubicBezier(curvedTime, p[0][1], p[1][1], p[2][1], p[3][1]);

            //Add one to the `elapsedFrames`
            o.frameCounter += 1;
          }

          //When the tween has finished playing, run the end tasks
          else {
              //sprite[property] = o.endValue;
              o.end();
            }
        }
      };

      //The `end` method will be called when the tween is finished
      o.end = function () {

        //Set `playing` to `false`
        o.playing = false;

        //Call the tween's `onComplete` method, if it's been
        //assigned
        if (o.onComplete) o.onComplete();

        //Remove the tween from the global `tweens` array
        _this5.globalTweens.splice(_this5.globalTweens.indexOf(o), 1);

        //If the tween's `yoyo` property is `true`, reverse the array and
        //use it to create a new tween
        if (yoyo) {
          _this5.wait(delayBeforeRepeat).then(function () {
            o.pointsArray = o.pointsArray.reverse();
            o.start(o.pointsArray);
          });
        }
      };

      //Pause and play methods
      o.pause = function () {
        o.playing = false;
      };
      o.play = function () {
        o.playing = true;
      };

      //Return the tween object
      return o;
    }
  }, {
    key: "walkPath",
    value: function walkPath(sprite, //The sprite
    originalPathArray) //Delay, in milliseconds, between sections
    {
      var totalFrames = arguments.length <= 2 || arguments[2] === undefined ? 300 : arguments[2];
      var type = arguments.length <= 3 || arguments[3] === undefined ? "smoothstep" : arguments[3];
      var loop = arguments.length <= 4 || arguments[4] === undefined ? false : arguments[4];

      var _this6 = this;

      var yoyo = arguments.length <= 5 || arguments[5] === undefined ? false : arguments[5];
      var delayBetweenSections = arguments.length <= 6 || arguments[6] === undefined ? 0 : arguments[6];

      //Clone the path array so that any possible references to sprite
      //properties are converted into ordinary numbers
      var pathArray = JSON.parse(JSON.stringify(originalPathArray));

      //Figure out the duration, in frames, of each path section by
      //dividing the `totalFrames` by the length of the `pathArray`
      var frames = totalFrames / pathArray.length;

      //Set the current point to 0, which will be the first waypoint
      var currentPoint = 0;

      //The `makePath` function creates a single tween between two points and
      //then schedules the next path to be made after it
      var makePath = function makePath(currentPoint) {

        //Use the `makeTween` function to tween the sprite's
        //x and y position
        var tween = _this6.makeTween([

        //Create the x axis tween between the first x value in the
        //current point and the x value in the following point
        [sprite, "x", pathArray[currentPoint][0], pathArray[currentPoint + 1][0], frames, type],

        //Create the y axis tween in the same way
        [sprite, "y", pathArray[currentPoint][1], pathArray[currentPoint + 1][1], frames, type]]);

        //When the tween is complete, advance the `currentPoint` by one.
        //Add an optional delay between path segments, and then make the
        //next connecting path
        tween.onComplete = function () {

          //Advance to the next point
          currentPoint += 1;

          //If the sprite hasn't reached the end of the
          //path, tween the sprite to the next point
          if (currentPoint < pathArray.length - 1) {
            _this6.wait(delayBetweenSections).then(function () {
              tween = makePath(currentPoint);
            });
          }

          //If we've reached the end of the path, optionally
          //loop and yoyo it
          else {

              //Reverse the path if `loop` is `true`
              if (loop) {

                //Reverse the array if `yoyo` is `true`
                if (yoyo) pathArray.reverse();

                //Optionally wait before restarting
                _this6.wait(delayBetweenSections).then(function () {

                  //Reset the `currentPoint` to 0 so that we can
                  //restart at the first point
                  currentPoint = 0;

                  //Set the sprite to the first point
                  sprite.x = pathArray[0][0];
                  sprite.y = pathArray[0][1];

                  //Make the first new path
                  tween = makePath(currentPoint);

                  //... and so it continues!
                });
              }
            }
        };

        //Return the path tween to the main function
        return tween;
      };

      //Make the first path using the internal `makePath` function (below)
      var tween = makePath(currentPoint);

      //Pass the tween back to the main program
      return tween;
    }
  }, {
    key: "walkCurve",
    value: function walkCurve(sprite, //The sprite
    pathArray) //Delay, in milliseconds, between sections
    {
      var totalFrames = arguments.length <= 2 || arguments[2] === undefined ? 300 : arguments[2];
      var type = arguments.length <= 3 || arguments[3] === undefined ? "smoothstep" : arguments[3];
      var loop = arguments.length <= 4 || arguments[4] === undefined ? false : arguments[4];

      var _this7 = this;

      var yoyo = arguments.length <= 5 || arguments[5] === undefined ? false : arguments[5];
      var delayBeforeContinue = arguments.length <= 6 || arguments[6] === undefined ? 0 : arguments[6];

      //Divide the `totalFrames` into sections for each part of the path
      var frames = totalFrames / pathArray.length;

      //Set the current curve to 0, which will be the first one
      var currentCurve = 0;

      //The `makePath` function
      var makePath = function makePath(currentCurve) {

        //Use the custom `followCurve` function to make
        //a sprite follow a curve
        var tween = _this7.followCurve(sprite, pathArray[currentCurve], frames, type);

        //When the tween is complete, advance the `currentCurve` by one.
        //Add an optional delay between path segments, and then make the
        //next path
        tween.onComplete = function () {
          currentCurve += 1;
          if (currentCurve < pathArray.length) {
            _this7.wait(delayBeforeContinue).then(function () {
              tween = makePath(currentCurve);
            });
          }

          //If we've reached the end of the path, optionally
          //loop and reverse it
          else {
              if (loop) {
                if (yoyo) {

                  //Reverse order of the curves in the `pathArray`
                  pathArray.reverse();

                  //Reverse the order of the points in each curve
                  pathArray.forEach(function (curveArray) {
                    return curveArray.reverse();
                  });
                }

                //After an optional delay, reset the sprite to the
                //beginning of the path and make the next new path
                _this7.wait(delayBeforeContinue).then(function () {
                  currentCurve = 0;
                  sprite.x = pathArray[0][0];
                  sprite.y = pathArray[0][1];
                  tween = makePath(currentCurve);
                });
              }
            }
        };

        //Return the path tween to the main function
        return tween;
      };

      //Make the first path
      var tween = makePath(currentCurve);

      //Pass the tween back to the main program
      return tween;
    }

    //4. Utilities

    /*
    The `wait` method lets you set up a timed sequence of events
       wait(1000)
        .then(() => console.log("One"))
        .then(() => wait(1000))
        .then(() => console.log("Two"))
        .then(() => wait(1000))
        .then(() => console.log("Three"))
     */

  }, {
    key: "wait",
    value: function wait() {
      var duration = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

      return new Promise(function (resolve, reject) {
        setTimeout(resolve, duration);
      });
    }

    //A utility to remove tweens from the game

  }, {
    key: "removeTween",
    value: function removeTween(tweenObject) {
      var _this8 = this;

      //Remove the tween if `tweenObject` doesn't have any nested
      //tween objects
      if (!tweenObject.tweens) {
        tweenObject.pause();

        //array.splice(-1,1) will always remove last elemnt of array, so this
        //extra check prevents that (Thank you, MCumic10! https://github.com/kittykatattack/charm/issues/5)
        if (this.globalTweens.indexOf(tweenObject) != -1) {
          this.globalTweens.splice(this.globalTweens.indexOf(tweenObject), 1);
        }

        //Otherwise, remove the nested tween objects
      } else {
          tweenObject.pause();
          tweenObject.tweens.forEach(function (element) {
            _this8.globalTweens.splice(_this8.globalTweens.indexOf(element), 1);
          });
        }
    }
  }, {
    key: "update",
    value: function update() {

      //Update all the tween objects in the `globalTweens` array
      if (this.globalTweens.length > 0) {
        for (var i = this.globalTweens.length - 1; i >= 0; i--) {
          var tween = this.globalTweens[i];
          if (tween) tween.update();
        }
      }
    }
  }]);

  return Charm;
})();
//# sourceMappingURL=charm.js.map"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Tink = (function () {
  function Tink(PIXI, element) {
    var scale = arguments.length <= 2 || arguments[2] === undefined ? 1 : arguments[2];

    _classCallCheck(this, Tink);

    //Add element and scale properties
    this.element = element;
    this._scale = scale;

    //An array to store all the draggable sprites
    this.draggableSprites = [];

    //An array to store all the pointer objects
    //(there will usually just be one)
    this.pointers = [];

    //An array to store all the buttons and button-like
    //interactive sprites
    this.buttons = [];

    //A local PIXI reference
    this.PIXI = PIXI;

    //Aliases for Pixi objects
    this.TextureCache = this.PIXI.utils.TextureCache;

    //Note: change MovieClip to AnimatedSprite for Pixi v4
    this.AnimatedSprite = this.PIXI.extras.MovieClip;
    this.Texture = this.PIXI.Texture;
  }

  _createClass(Tink, [{
    key: "makeDraggable",

    //`makeDraggable` lets you make a drag-and-drop sprite by pushing it
    //into the `draggableSprites` array
    value: function makeDraggable() {
      var _this = this;

      for (var _len = arguments.length, sprites = Array(_len), _key = 0; _key < _len; _key++) {
        sprites[_key] = arguments[_key];
      }

      //If the first argument isn't an array of sprites...
      if (!(sprites[0] instanceof Array)) {
        sprites.forEach(function (sprite) {
          _this.draggableSprites.push(sprite);

          //If the sprite's `draggable` property hasn't already been defined by
          //another library, like Hexi, define it
          if (sprite.draggable === undefined) {
            sprite.draggable = true;
            sprite._localDraggableAllocation = true;
          }
        });
      }

      //If the first argument is an array of sprites...
      else {
          var spritesArray = sprites[0];
          if (spritesArray.length > 0) {
            for (var i = spritesArray.length - 1; i >= 0; i--) {
              var sprite = spritesArray[i];
              this.draggableSprites.push(sprite);

              //If the sprite's `draggable` property hasn't already been defined by
              //another library, like Hexi, define it
              if (sprite.draggable === undefined) {
                sprite.draggable = true;
                sprite._localDraggableAllocation = true;
              }
            }
          }
        }
    }

    //`makeUndraggable` removes the sprite from the `draggableSprites`
    //array

  }, {
    key: "makeUndraggable",
    value: function makeUndraggable() {
      var _this2 = this;

      for (var _len2 = arguments.length, sprites = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        sprites[_key2] = arguments[_key2];
      }

      //If the first argument isn't an array of sprites...
      if (!(sprites[0] instanceof Array)) {
        sprites.forEach(function (sprite) {
          _this2.draggableSprites.splice(_this2.draggableSprites.indexOf(sprite), 1);
          if (sprite._localDraggableAllocation === true) sprite.draggable = false;
        });
      }

      //If the first argument is an array of sprites
      else {
          var spritesArray = sprites[0];
          if (spritesArray.length > 0) {
            for (var i = spritesArray.length - 1; i >= 0; i--) {
              var sprite = spritesArray[i];
              this.draggableSprites.splice(this.draggableSprites.indexOf(sprite), 1);
              if (sprite._localDraggableAllocation === true) sprite.draggable = false;
            }
          }
        }
    }
  }, {
    key: "makePointer",
    value: function makePointer() {
      var element = arguments.length <= 0 || arguments[0] === undefined ? this.element : arguments[0];
      var scale = arguments.length <= 1 || arguments[1] === undefined ? this.scale : arguments[1];

      //Get a reference to Tink's global `draggableSprites` array
      var draggableSprites = this.draggableSprites;

      //Get a reference to Tink's `addGlobalPositionProperties` method
      var addGlobalPositionProperties = this.addGlobalPositionProperties;

      //The pointer object will be returned by this function
      var pointer = {
        element: element,
        _scale: scale,

        //Private x and y properties
        _x: 0,
        _y: 0,

        //Width and height
        width: 1,
        height: 1,

        //The public x and y properties are divided by the scale. If the
        //HTML element that the pointer is sensitive to (like the canvas)
        //is scaled up or down, you can change the `scale` value to
        //correct the pointer's position values
        get x() {
          return this._x / this.scale;
        },
        get y() {
          return this._y / this.scale;
        },

        //Add `centerX` and `centerY` getters so that we
        //can use the pointer's coordinates with easing
        //and collision functions
        get centerX() {
          return this.x;
        },
        get centerY() {
          return this.y;
        },

        //`position` returns an object with x and y properties that
        //contain the pointer's position
        get position() {
          return {
            x: this.x,
            y: this.y
          };
        },

        get scale() {
          return this._scale;
        },
        set scale(value) {
          this._scale = value;
        },

        //Add a `cursor` getter/setter to change the pointer's cursor
        //style. Values can be "pointer" (for a hand icon) or "auto" for
        //an ordinary arrow icon.
        get cursor() {
          return this.element.style.cursor;
        },
        set cursor(value) {
          this.element.style.cursor = value;
        },

        //Booleans to track the pointer state
        isDown: false,
        isUp: true,
        tapped: false,

        //Properties to help measure the time between up and down states
        downTime: 0,
        elapsedTime: 0,

        //Optional `press`,`release` and `tap` methods
        press: undefined,
        release: undefined,
        tap: undefined,

        //A `dragSprite` property to help with drag and drop
        dragSprite: null,

        //The drag offsets to help drag sprites
        dragOffsetX: 0,
        dragOffsetY: 0,

        //A property to check whether or not the pointer
        //is visible
        _visible: true,
        get visible() {
          return this._visible;
        },
        set visible(value) {
          if (value === true) {
            this.cursor = "auto";
          } else {
            this.cursor = "none";
          }
          this._visible = value;
        },

        //The pointer's mouse `moveHandler`
        moveHandler: function moveHandler(event) {

          //Get the element that's firing the event
          var element = event.target;

          //Find the pointer’s x and y position (for mouse).
          //Subtract the element's top and left offset from the browser window
          this._x = event.pageX - element.offsetLeft;
          this._y = event.pageY - element.offsetTop;

          //Prevent the event's default behavior
          event.preventDefault();
        },

        //The pointer's `touchmoveHandler`
        touchmoveHandler: function touchmoveHandler(event) {
          var element = event.target;

          //Find the touch point's x and y position
          this._x = event.targetTouches[0].pageX - element.offsetLeft;
          this._y = event.targetTouches[0].pageY - element.offsetTop;
          event.preventDefault();
        },

        //The pointer's `downHandler`
        downHandler: function downHandler(event) {

          //Set the down states
          this.isDown = true;
          this.isUp = false;
          this.tapped = false;

          //Capture the current time
          this.downTime = Date.now();

          //Call the `press` method if it's been assigned
          if (this.press) this.press();
          event.preventDefault();
        },

        //The pointer's `touchstartHandler`
        touchstartHandler: function touchstartHandler(event) {
          var element = event.target;

          //Find the touch point's x and y position
          this._x = event.targetTouches[0].pageX - element.offsetLeft;
          this._y = event.targetTouches[0].pageY - element.offsetTop;

          //Set the down states
          this.isDown = true;
          this.isUp = false;
          this.tapped = false;

          //Capture the current time
          this.downTime = Date.now();

          //Call the `press` method if it's been assigned
          if (this.press) this.press();
          event.preventDefault();
        },

        //The pointer's `upHandler`
        upHandler: function upHandler(event) {

          //Figure out how much time the pointer has been down
          this.elapsedTime = Math.abs(this.downTime - Date.now());

          //If it's less than 200 milliseconds, it must be a tap or click
          if (this.elapsedTime <= 200 && this.tapped === false) {
            this.tapped = true;

            //Call the `tap` method if it's been assigned
            if (this.tap) this.tap();
          }
          this.isUp = true;
          this.isDown = false;

          //Call the `release` method if it's been assigned
          if (this.release) this.release();

          //`event.preventDefault();` needs to be disabled to prevent <input> range sliders
          //from getting trapped in Firefox (and possibly Safari)
          //event.preventDefault();
        },

        //The pointer's `touchendHandler`
        touchendHandler: function touchendHandler(event) {

          //Figure out how much time the pointer has been down
          this.elapsedTime = Math.abs(this.downTime - Date.now());

          //If it's less than 200 milliseconds, it must be a tap or click
          if (this.elapsedTime <= 200 && this.tapped === false) {
            this.tapped = true;

            //Call the `tap` method if it's been assigned
            if (this.tap) this.tap();
          }
          this.isUp = true;
          this.isDown = false;

          //Call the `release` method if it's been assigned
          if (this.release) this.release();

          //event.preventDefault();
        },

        //`hitTestSprite` figures out if the pointer is touching a sprite
        hitTestSprite: function hitTestSprite(sprite) {

          //Add global `gx` and `gy` properties to the sprite if they
          //don't already exist
          addGlobalPositionProperties(sprite);

          //The `hit` variable will become `true` if the pointer is
          //touching the sprite and remain `false` if it isn't
          var hit = false;

          //Find out the sprite's offset from its anchor point
          var xAnchorOffset = undefined,
              yAnchorOffset = undefined;
          if (sprite.anchor !== undefined) {
            xAnchorOffset = sprite.width * sprite.anchor.x;
            yAnchorOffset = sprite.height * sprite.anchor.y;
          } else {
            xAnchorOffset = 0;
            yAnchorOffset = 0;
          }

          //Is the sprite rectangular?
          if (!sprite.circular) {

            //Get the position of the sprite's edges using global
            //coordinates
            var left = sprite.gx - xAnchorOffset,
                right = sprite.gx + sprite.width - xAnchorOffset,
                top = sprite.gy - yAnchorOffset,
                bottom = sprite.gy + sprite.height - yAnchorOffset;

            //Find out if the pointer is intersecting the rectangle.
            //`hit` will become `true` if the pointer is inside the
            //sprite's area
            hit = this.x > left && this.x < right && this.y > top && this.y < bottom;
          }

          //Is the sprite circular?
          else {
              //Find the distance between the pointer and the
              //center of the circle
              var vx = this.x - (sprite.gx + sprite.width / 2 - xAnchorOffset),
                  vy = this.y - (sprite.gy + sprite.width / 2 - yAnchorOffset),
                  distance = Math.sqrt(vx * vx + vy * vy);

              //The pointer is intersecting the circle if the
              //distance is less than the circle's radius
              hit = distance < sprite.width / 2;
            }
          //Check the value of `hit`
          return hit;
        }
      };

      //Bind the events to the handlers
      //Mouse events
      element.addEventListener("mousemove", pointer.moveHandler.bind(pointer), false);
      element.addEventListener("mousedown", pointer.downHandler.bind(pointer), false);

      //Add the `mouseup` event to the `window` to
      //catch a mouse button release outside of the canvas area
      window.addEventListener("mouseup", pointer.upHandler.bind(pointer), false);

      //Touch events
      element.addEventListener("touchmove", pointer.touchmoveHandler.bind(pointer), false);
      element.addEventListener("touchstart", pointer.touchstartHandler.bind(pointer), false);

      //Add the `touchend` event to the `window` object to
      //catch a mouse button release outside of the canvas area
      window.addEventListener("touchend", pointer.touchendHandler.bind(pointer), false);

      //Disable the default pan and zoom actions on the `canvas`
      element.style.touchAction = "none";

      //Add the pointer to Tink's global `pointers` array
      this.pointers.push(pointer);

      //Return the pointer
      return pointer;
    }

    //Many of Tink's objects, like pointers, use collision
    //detection using the sprites' global x and y positions. To make
    //this easier, new `gx` and `gy` properties are added to sprites
    //that reference Pixi sprites' `getGlobalPosition()` values.

  }, {
    key: "addGlobalPositionProperties",
    value: function addGlobalPositionProperties(sprite) {
      if (sprite.gx === undefined) {
        Object.defineProperty(sprite, "gx", {
          get: function get() {
            return sprite.getGlobalPosition().x;
          }
        });
      }

      if (sprite.gy === undefined) {
        Object.defineProperty(sprite, "gy", {
          get: function get() {
            return sprite.getGlobalPosition().y;
          }
        });
      }
    }

    //A method that implments drag-and-drop functionality
    //for each pointer

  }, {
    key: "updateDragAndDrop",
    value: function updateDragAndDrop(draggableSprites) {

      //Create a pointer if one doesn't already exist
      if (this.pointers.length === 0) {
        this.makePointer(this.element, this.scale);
      }

      //Loop through all the pointers in Tink's global `pointers` array
      //(there will usually just be one, but you never know)
      this.pointers.forEach(function (pointer) {

        //Check whether the pointer is pressed down
        if (pointer.isDown) {

          //You need to capture the co-ordinates at which the pointer was
          //pressed down and find out if it's touching a sprite

          //Only run pointer.code if the pointer isn't already dragging
          //sprite
          if (pointer.dragSprite === null) {

            //Loop through the `draggableSprites` in reverse to start searching at the bottom of the stack
            for (var i = draggableSprites.length - 1; i > -1; i--) {

              //Get a reference to the current sprite
              var sprite = draggableSprites[i];

              //Check for a collision with the pointer using `hitTestSprite`
              if (pointer.hitTestSprite(sprite) && sprite.draggable) {

                //Calculate the difference between the pointer's
                //position and the sprite's position
                pointer.dragOffsetX = pointer.x - sprite.gx;
                pointer.dragOffsetY = pointer.y - sprite.gy;

                //Set the sprite as the pointer's `dragSprite` property
                pointer.dragSprite = sprite;

                //The next two lines re-order the `sprites` array so that the
                //selected sprite is displayed above all the others.
                //First, splice the sprite out of its current position in
                //its parent's `children` array
                var children = sprite.parent.children;
                children.splice(children.indexOf(sprite), 1);

                //Next, push the `dragSprite` to the end of its `children` array so that it's
                //displayed last, above all the other sprites
                children.push(sprite);

                //Reorganize the `draggableSpites` array in the same way
                draggableSprites.splice(draggableSprites.indexOf(sprite), 1);
                draggableSprites.push(sprite);

                //Break the loop, because we only need to drag the topmost sprite
                break;
              }
            }
          }

          //If the pointer is down and it has a `dragSprite`, make the sprite follow the pointer's
          //position, with the calculated offset
          else {
              pointer.dragSprite.x = pointer.x - pointer.dragOffsetX;
              pointer.dragSprite.y = pointer.y - pointer.dragOffsetY;
            }
        }

        //If the pointer is up, drop the `dragSprite` by setting it to `null`
        if (pointer.isUp) {
          pointer.dragSprite = null;
        }

        //Change the mouse arrow pointer to a hand if it's over a
        //draggable sprite
        draggableSprites.some(function (sprite) {
          if (pointer.hitTestSprite(sprite) && sprite.draggable) {
            if (pointer.visible) pointer.cursor = "pointer";
            return true;
          } else {
            if (pointer.visible) pointer.cursor = "auto";
            return false;
          }
        });
      });
    }
  }, {
    key: "makeInteractive",
    value: function makeInteractive(o) {

      //The `press`,`release`, `over`, `out` and `tap` methods. They're `undefined`
      //for now, but they can be defined in the game program
      o.press = o.press || undefined;
      o.release = o.release || undefined;
      o.over = o.over || undefined;
      o.out = o.out || undefined;
      o.tap = o.tap || undefined;

      //The `state` property tells you the button's
      //current state. Set its initial state to "up"
      o.state = "up";

      //The `action` property tells you whether its being pressed or
      //released
      o.action = "";

      //The `pressed` and `hoverOver` Booleans are mainly for internal
      //use in this code to help figure out the correct state.
      //`pressed` is a Boolean that helps track whether or not
      //the sprite has been pressed down
      o.pressed = false;

      //`hoverOver` is a Boolean which checks whether the pointer
      //has hovered over the sprite
      o.hoverOver = false;

      //tinkType is a string that will be set to "button" if the
      //user creates an object using the `button` function
      o.tinkType = "";

      //Set `enabled` to true to allow for interactivity
      //Set `enabled` to false to disable interactivity
      o.enabled = true;

      //Add the sprite to the global `buttons` array so that it can
      //be updated each frame in the `updateButtons method
      this.buttons.push(o);
    }

    //The `updateButtons` method will be called each frame
    //inside the game loop. It updates all the button-like sprites

  }, {
    key: "updateButtons",
    value: function updateButtons() {
      var _this3 = this;

      //Create a pointer if one doesn't already exist
      if (this.pointers.length === 0) {
        this.makePointer(this.element, this.scale);
      }

      //Loop through all of Tink's pointers (there will usually
      //just be one)
      this.pointers.forEach(function (pointer) {

        pointer.shouldBeHand = false;

        //Loop through all the button-like sprites that were created
        //using the `makeInteractive` method
        _this3.buttons.forEach(function (o) {

          //Only do this if the interactive object is enabled
          if (o.enabled) {

            //Figure out if the pointer is touching the sprite
            var hit = pointer.hitTestSprite(o);

            //1. Figure out the current state
            if (pointer.isUp) {

              //Up state
              o.state = "up";

              //Show the first image state frame, if this is a `Button` sprite
              if (o.tinkType === "button") o.gotoAndStop(0);
            }

            //If the pointer is touching the sprite, figure out
            //if the over or down state should be displayed
            if (hit) {

              //Over state
              o.state = "over";

              //Show the second image state frame if this sprite has
              //3 frames and it's a `Button` sprite
              if (o.totalFrames && o.totalFrames === 3 && o.tinkType === "button") {
                o.gotoAndStop(1);
              }

              //Down state
              if (pointer.isDown) {
                o.state = "down";

                //Show the third frame if this sprite is a `Button` sprite and it
                //has only three frames, or show the second frame if it
                //only has two frames
                if (o.tinkType === "button") {
                  if (o.totalFrames === 3) {
                    o.gotoAndStop(2);
                  } else {
                    o.gotoAndStop(1);
                  }
                }
              }

              //Flag this pointer to be changed to a hand
              pointer.shouldBeHand = true;
              //if (pointer.visible) pointer.cursor = "pointer";
              // } else {
              //   //Turn the pointer to an ordinary arrow icon if the
              //   //pointer isn't touching a sprite
              //   if (pointer.visible) pointer.cursor = "auto";

              //Change the pointer icon to a hand
              if (pointer.visible) pointer.cursor = "pointer";
            } else {
              //Turn the pointer to an ordinary arrow icon if the
              //pointer isn't touching a sprite
              if (pointer.visible) pointer.cursor = "auto";
            }

            //Perform the correct interactive action

            //a. Run the `press` method if the sprite state is "down" and
            //the sprite hasn't already been pressed
            if (o.state === "down") {
              if (!o.pressed) {
                if (o.press) o.press();
                o.pressed = true;
                o.action = "pressed";
              }
            }

            //b. Run the `release` method if the sprite state is "over" and
            //the sprite has been pressed
            if (o.state === "over") {
              if (o.pressed) {
                if (o.release) o.release();
                o.pressed = false;
                o.action = "released";
                //If the pointer was tapped and the user assigned a `tap`
                //method, call the `tap` method
                if (pointer.tapped && o.tap) o.tap();
              }

              //Run the `over` method if it has been assigned
              if (!o.hoverOver) {
                if (o.over) o.over();
                o.hoverOver = true;
              }
            }

            //c. Check whether the pointer has been released outside
            //the sprite's area. If the button state is "up" and it's
            //already been pressed, then run the `release` method.
            if (o.state === "up") {
              if (o.pressed) {
                if (o.release) o.release();
                o.pressed = false;
                o.action = "released";
              }

              //Run the `out` method if it has been assigned
              if (o.hoverOver) {
                if (o.out) o.out();
                o.hoverOver = false;
              }
            }
          }
        });

        if (pointer.shouldBeHand) {
          pointer.cursor = "pointer";
        } else {
          pointer.cursor = "auto";
        }
      });
    }

    //A function that creates a sprite with 3 frames that
    //represent the button states: up, over and down

  }, {
    key: "button",
    value: function button(source) {
      var x = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
      var y = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];

      //The sprite object that will be returned
      var o = undefined;

      //Is it an array of frame ids or textures?
      if (typeof source[0] === "string") {

        //They're strings, but are they pre-existing texture or
        //paths to image files?
        //Check to see if the first element matches a texture in the
        //cache
        if (this.TextureCache[source[0]]) {

          //It does, so it's an array of frame ids
          o = this.AnimatedSprite.fromFrames(source);
        } else {

          //It's not already in the cache, so let's load it
          o = this.AnimatedSprite.fromImages(source);
        }
      }

      //If the `source` isn't an array of strings, check whether
      //it's an array of textures
      else if (source[0] instanceof this.Texture) {

          //Yes, it's an array of textures.
          //Use them to make a AnimatedSprite o
          o = new this.AnimatedSprite(source);
        }

      //Add interactive properties to the button
      this.makeInteractive(o);

      //Set the `tinkType` to "button"
      o.tinkType = "button";

      //Position the button
      o.x = x;
      o.y = y;

      //Return the new button sprite
      return o;
    }

    //Run the `udpate` function in your game loop
    //to update all of Tink's interactive objects

  }, {
    key: "update",
    value: function update() {

      //Update the drag and drop system
      if (this.draggableSprites.length !== 0) this.updateDragAndDrop(this.draggableSprites);

      //Update the buttons and button-like interactive sprites
      if (this.buttons.length !== 0) this.updateButtons();
    }

    /*
    `keyboard` is a method that listens for and captures keyboard events. It's really
    just a convenient wrapper function for HTML `keyup` and `keydown` events so that you can keep your application code clutter-free and easier to write and read.
     Here's how to use the `keyboard` method. Create a new keyboard object like this:
    ```js
    let keyObject = keyboard(asciiKeyCodeNumber);
    ```
    It's one argument is the ASCII key code number of the keyboard key
    that you want to listen for. [Here's a list of ASCII key codes you can
    use](http://www.asciitable.com).
    Then assign `press` and `release` methods to the keyboard object like this:
    ```js
    keyObject.press = () => {
      //key object pressed
    };
    keyObject.release = () => {
      //key object released
    };
    ```
    Keyboard objects also have `isDown` and `isUp` Boolean properties that you can use to check the state of each key. 
    */

  }, {
    key: "keyboard",
    value: function keyboard(keyCode) {
      var key = {};
      key.code = keyCode;
      key.isDown = false;
      key.isUp = true;
      key.press = undefined;
      key.release = undefined;

      //The `downHandler`
      key.downHandler = function (event) {
        if (event.keyCode === key.code) {
          if (key.isUp && key.press) key.press();
          key.isDown = true;
          key.isUp = false;
        }
        event.preventDefault();
      };

      //The `upHandler`
      key.upHandler = function (event) {
        if (event.keyCode === key.code) {
          if (key.isDown && key.release) key.release();
          key.isDown = false;
          key.isUp = true;
        }
        event.preventDefault();
      };

      //Attach event listeners
      window.addEventListener("keydown", key.downHandler.bind(key), false);
      window.addEventListener("keyup", key.upHandler.bind(key), false);

      //Return the key object
      return key;
    }

    //`arrowControl` is a convenience method for updating a sprite's velocity
    //for 4-way movement using the arrow directional keys. Supply it
    //with the sprite you want to control and the speed per frame, in
    //pixels, that you want to update the sprite's velocity

  }, {
    key: "arrowControl",
    value: function arrowControl(sprite, speed) {

      if (speed === undefined) {
        throw new Error("Please supply the arrowControl method with the speed at which you want the sprite to move");
      }

      var upArrow = this.keyboard(38),
          rightArrow = this.keyboard(39),
          downArrow = this.keyboard(40),
          leftArrow = this.keyboard(37);

      //Assign key `press` methods
      leftArrow.press = function () {
        //Change the sprite's velocity when the key is pressed
        sprite.vx = -speed;
        sprite.vy = 0;
      };
      leftArrow.release = function () {
        //If the left arrow has been released, and the right arrow isn't down,
        //and the sprite isn't moving vertically:
        //Stop the sprite
        if (!rightArrow.isDown && sprite.vy === 0) {
          sprite.vx = 0;
        }
      };
      upArrow.press = function () {
        sprite.vy = -speed;
        sprite.vx = 0;
      };
      upArrow.release = function () {
        if (!downArrow.isDown && sprite.vx === 0) {
          sprite.vy = 0;
        }
      };
      rightArrow.press = function () {
        sprite.vx = speed;
        sprite.vy = 0;
      };
      rightArrow.release = function () {
        if (!leftArrow.isDown && sprite.vy === 0) {
          sprite.vx = 0;
        }
      };
      downArrow.press = function () {
        sprite.vy = speed;
        sprite.vx = 0;
      };
      downArrow.release = function () {
        if (!upArrow.isDown && sprite.vx === 0) {
          sprite.vy = 0;
        }
      };
    }
  }, {
    key: "scale",
    get: function get() {
      return this._scale;
    },
    set: function set(value) {
      this._scale = value;

      //Update scale values for all pointers
      this.pointers.forEach(function (pointer) {
        return pointer.scale = value;
      });
    }
  }]);

  return Tink;
})();
//# sourceMappingURL=tink.js.map"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Dust = (function () {
  function Dust() {
    var renderingEngine = arguments.length <= 0 || arguments[0] === undefined ? PIXI : arguments[0];

    _classCallCheck(this, Dust);

    if (renderingEngine === undefined) throw new Error("Please assign a rendering engine in the constructor before using pixiDust.js");

    //Find out which rendering engine is being used (the default is Pixi)
    this.renderer = "";

    //If the `renderingEngine` is Pixi, set up Pixi object aliases
    if (renderingEngine.ParticleContainer) {
      this.Container = renderingEngine.Container;
      this.renderer = "pixi";
    }

    //The `particles` array stores all the particles you make
    this.globalParticles = [];
  }

  //Random number functions

  _createClass(Dust, [{
    key: "randomFloat",
    value: function randomFloat(min, max) {
      return min + Math.random() * (max - min);
    }
  }, {
    key: "randomInt",
    value: function randomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    //Use the create function to create new particle effects

  }, {
    key: "create",
    value: function create() {
      var x = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
      var y = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
      var spriteFunction = arguments.length <= 2 || arguments[2] === undefined ? function () {
        return console.log("Sprite creation function");
      } : arguments[2];
      var container = arguments.length <= 3 || arguments[3] === undefined ? function () {
        return new _this.Container();
      } : arguments[3];
      var numberOfParticles = arguments.length <= 4 || arguments[4] === undefined ? 20 : arguments[4];
      var gravity = arguments.length <= 5 || arguments[5] === undefined ? 0 : arguments[5];
      var randomSpacing = arguments.length <= 6 || arguments[6] === undefined ? true : arguments[6];
      var minAngle = arguments.length <= 7 || arguments[7] === undefined ? 0 : arguments[7];
      var maxAngle = arguments.length <= 8 || arguments[8] === undefined ? 6.28 : arguments[8];
      var minSize = arguments.length <= 9 || arguments[9] === undefined ? 4 : arguments[9];
      var maxSize = arguments.length <= 10 || arguments[10] === undefined ? 16 : arguments[10];
      var minSpeed = arguments.length <= 11 || arguments[11] === undefined ? 0.3 : arguments[11];
      var maxSpeed = arguments.length <= 12 || arguments[12] === undefined ? 3 : arguments[12];
      var minScaleSpeed = arguments.length <= 13 || arguments[13] === undefined ? 0.01 : arguments[13];
      var maxScaleSpeed = arguments.length <= 14 || arguments[14] === undefined ? 0.05 : arguments[14];
      var minAlphaSpeed = arguments.length <= 15 || arguments[15] === undefined ? 0.02 : arguments[15];
      var maxAlphaSpeed = arguments.length <= 16 || arguments[16] === undefined ? 0.02 : arguments[16];

      var _this = this;

      var minRotationSpeed = arguments.length <= 17 || arguments[17] === undefined ? 0.01 : arguments[17];
      var maxRotationSpeed = arguments.length <= 18 || arguments[18] === undefined ? 0.03 : arguments[18];

      //An array to store the curent batch of particles
      var particles = [];

      //Add the current `particles` array to the `globalParticles` array
      this.globalParticles.push(particles);

      //An array to store the angles
      var angles = [];

      //A variable to store the current particle's angle
      var angle = undefined;

      //Figure out by how many radians each particle should be separated
      var spacing = (maxAngle - minAngle) / (numberOfParticles - 1);

      //Create an angle value for each particle and push that //value into the `angles` array
      for (var i = 0; i < numberOfParticles; i++) {

        //If `randomSpacing` is `true`, give the particle any angle
        //value between `minAngle` and `maxAngle`
        if (randomSpacing) {
          angle = this.randomFloat(minAngle, maxAngle);
          angles.push(angle);
        }

        //If `randomSpacing` is `false`, space each particle evenly,
        //starting with the `minAngle` and ending with the `maxAngle`
        else {
            if (angle === undefined) angle = minAngle;
            angles.push(angle);
            angle += spacing;
          }
      }

      //A function to make particles
      var makeParticle = function makeParticle(angle) {

        //Create the particle using the supplied sprite function
        var particle = spriteFunction();

        //Display a random frame if the particle has more than 1 frame
        if (particle.totalFrames > 0) {
          particle.gotoAndStop(_this.randomInt(0, particle.totalFrames - 1));
        }

        //Set a random width and height
        var size = _this.randomInt(minSize, maxSize);
        particle.width = size;
        particle.height = size;

        //Set the particle's `anchor` to its center
        particle.anchor.set(0.5, 0.5);

        //Set the x and y position
        particle.x = x;
        particle.y = y;

        //Set a random speed to change the scale, alpha and rotation
        particle.scaleSpeed = _this.randomFloat(minScaleSpeed, maxScaleSpeed);
        particle.alphaSpeed = _this.randomFloat(minAlphaSpeed, maxAlphaSpeed);
        particle.rotationSpeed = _this.randomFloat(minRotationSpeed, maxRotationSpeed);

        //Set a random velocity at which the particle should move
        var speed = _this.randomFloat(minSpeed, maxSpeed);
        particle.vx = speed * Math.cos(angle);
        particle.vy = speed * Math.sin(angle);

        //Push the particle into the `particles` array.
        //The `particles` array needs to be updated by the game loop each frame particles.push(particle);
        particles.push(particle);

        //Add the particle to its parent container
        container.addChild(particle);

        //The particle's `updateParticle` method is called on each frame of the
        //game loop
        particle.updateParticle = function () {

          //Add gravity
          particle.vy += gravity;

          //Move the particle
          particle.x += particle.vx;
          particle.y += particle.vy;

          //Change the particle's `scale`
          if (particle.scale.x - particle.scaleSpeed > 0) {
            particle.scale.x -= particle.scaleSpeed;
          }
          if (particle.scale.y - particle.scaleSpeed > 0) {
            particle.scale.y -= particle.scaleSpeed;
          }

          //Change the particle's rotation
          particle.rotation += particle.rotationSpeed;

          //Change the particle's `alpha`
          particle.alpha -= particle.alphaSpeed;

          //Remove the particle if its `alpha` reaches zero
          if (particle.alpha <= 0) {
            container.removeChild(particle);
            particles.splice(particles.indexOf(particle), 1);
          }
        };
      };

      //Make a particle for each angle
      angles.forEach(function (angle) {
        return makeParticle(angle);
      });

      //Return the `particles` array back to the main program
      return particles;
    }

    //A particle emitter

  }, {
    key: "emitter",
    value: function emitter(interval, particleFunction) {
      var emitterObject = {},
          timerInterval = undefined;

      emitterObject.playing = false;

      function play() {
        if (!emitterObject.playing) {
          particleFunction();
          timerInterval = setInterval(emitParticle.bind(this), interval);
          emitterObject.playing = true;
        }
      }

      function stop() {
        if (emitterObject.playing) {
          clearInterval(timerInterval);
          emitterObject.playing = false;
        }
      }

      function emitParticle() {
        particleFunction();
      }

      emitterObject.play = play;
      emitterObject.stop = stop;
      return emitterObject;
    }

    //A function to update the particles in the game loop

  }, {
    key: "update",
    value: function update() {

      //Check so see if the `globalParticles` array contains any
      //sub-arrays
      if (this.globalParticles.length > 0) {

        //If it does, Loop through the particle arrays in reverse
        for (var i = this.globalParticles.length - 1; i >= 0; i--) {

          //Get the current particle sub-array
          var particles = this.globalParticles[i];

          //Loop through the `particles` sub-array and update the
          //all the particle sprites that it contains
          if (particles.length > 0) {
            for (var j = particles.length - 1; j >= 0; j--) {
              var particle = particles[j];
              particle.updateParticle();
            }
          }

          //Remove the particle array from the `globalParticles` array if doesn't
          //contain any more sprites
          else {
              this.globalParticles.splice(this.globalParticles.indexOf(particles), 1);
            }
        }
      }
    }
  }]);

  return Dust;
})();
//# sourceMappingURL=dust.js.map"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SpriteUtilities = (function () {
  function SpriteUtilities() {
    var renderingEngine = arguments.length <= 0 || arguments[0] === undefined ? PIXI : arguments[0];

    _classCallCheck(this, SpriteUtilities);

    if (renderingEngine === undefined) throw new Error("Please supply a reference to PIXI in the SpriteUtilities constructor before using spriteUtilities.js");

    //Find out which rendering engine is being used (the default is Pixi)
    this.renderer = "";

    //If the `renderingEngine` is Pixi, set up Pixi object aliases
    if (renderingEngine.ParticleContainer && renderingEngine.Sprite) {
      this.renderer = "pixi";
      this.Container = renderingEngine.Container;
      this.ParticleContainer = renderingEngine.ParticleContainer;
      this.TextureCache = renderingEngine.utils.TextureCache;
      this.Texture = renderingEngine.Texture;
      this.Rectangle = renderingEngine.Rectangle;
      this.MovieClip = renderingEngine.extras.MovieClip;
      this.BitmapText = renderingEngine.extras.BitmapText;
      this.Sprite = renderingEngine.Sprite;
      this.TilingSprite = renderingEngine.extras.TilingSprite;
      this.Graphics = renderingEngine.Graphics;
      this.Text = renderingEngine.Text;

      //An array to store all the shaking sprites
      this.shakingSprites = [];
    }
  }

  _createClass(SpriteUtilities, [{
    key: "update",
    value: function update() {
      if (this.shakingSprites.length > 0) {
        for (var i = this.shakingSprites.length - 1; i >= 0; i--) {
          var shakingSprite = this.shakingSprites[i];
          if (shakingSprite.updateShake) shakingSprite.updateShake();
        }
      }
    }
  }, {
    key: "sprite",
    value: function sprite(source) {
      var x = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
      var y = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];
      var tiling = arguments.length <= 3 || arguments[3] === undefined ? false : arguments[3];
      var width = arguments[4];
      var height = arguments[5];

      var o = undefined,
          texture = undefined;

      //Create a sprite if the `source` is a string
      if (typeof source === "string") {

        //Access the texture in the cache if it's there
        if (this.TextureCache[source]) {
          texture = this.TextureCache[source];
        }

        //If it's not is the cache, load it from the source file
        else {
            texture = this.Texture.fromImage(source);
          }

        //If the texture was created, make the o
        if (texture) {

          //If `tiling` is `false`, make a regular `Sprite`
          if (!tiling) {
            o = new this.Sprite(texture);
          }

          //If `tiling` is `true` make a `TilingSprite`
          else {
              o = new this.TilingSprite(texture, width, height);
            }
        }
        //But if the source still can't be found, alert the user
        else {
            throw new Error(source + " cannot be found");
          }
      }

      //Create a o if the `source` is a texture
      else if (source instanceof this.Texture) {
          if (!tiling) {
            o = new this.Sprite(source);
          } else {
            o = new this.TilingSprite(source, width, height);
          }
        }

        //Create a `MovieClip` o if the `source` is an array
        else if (source instanceof Array) {

            //Is it an array of frame ids or textures?
            if (typeof source[0] === "string") {

              //They're strings, but are they pre-existing texture or
              //paths to image files?
              //Check to see if the first element matches a texture in the
              //cache
              if (this.TextureCache[source[0]]) {

                //It does, so it's an array of frame ids
                o = this.MovieClip.fromFrames(source);
              } else {

                //It's not already in the cache, so let's load it
                o = this.MovieClip.fromImages(source);
              }
            }

            //If the `source` isn't an array of strings, check whether
            //it's an array of textures
            else if (source[0] instanceof this.Texture) {

                //Yes, it's an array of textures.
                //Use them to make a MovieClip o
                o = new this.MovieClip(source);
              }
          }

      //If the sprite was successfully created, intialize it
      if (o) {

        //Position the sprite
        o.x = x;
        o.y = y;

        //Set optional width and height
        if (width) o.width = width;
        if (height) o.height = height;

        //If the sprite is a MovieClip, add a state player so that
        //it's easier to control
        if (o instanceof this.MovieClip) this.addStatePlayer(o);

        //Assign the sprite
        return o;
      }
    }
  }, {
    key: "addStatePlayer",
    value: function addStatePlayer(sprite) {

      var frameCounter = 0,
          numberOfFrames = 0,
          startFrame = 0,
          endFrame = 0,
          timerInterval = undefined;

      //The `show` function (to display static states)
      function show(frameNumber) {

        //Reset any possible previous animations
        reset();

        //Find the new state on the sprite
        sprite.gotoAndStop(frameNumber);
      }

      //The `stop` function stops the animation at the current frame
      function stopAnimation() {
        reset();
        sprite.gotoAndStop(sprite.currentFrame);
      }

      //The `playSequence` function, to play a sequence of frames
      function playAnimation(sequenceArray) {

        //Reset any possible previous animations
        reset();

        //Figure out how many frames there are in the range
        if (!sequenceArray) {
          startFrame = 0;
          endFrame = sprite.totalFrames - 1;
        } else {
          startFrame = sequenceArray[0];
          endFrame = sequenceArray[1];
        }

        //Calculate the number of frames
        numberOfFrames = endFrame - startFrame;

        //Compensate for two edge cases:
        //1. If the `startFrame` happens to be `0`
        /*
        if (startFrame === 0) {
          numberOfFrames += 1;
          frameCounter += 1;
        }
        */

        //2. If only a two-frame sequence was provided
        /*
        if(numberOfFrames === 1) {
          numberOfFrames = 2;
          frameCounter += 1;
        }  
        */

        //Calculate the frame rate. Set the default fps to 12
        if (!sprite.fps) sprite.fps = 12;
        var frameRate = 1000 / sprite.fps;

        //Set the sprite to the starting frame
        sprite.gotoAndStop(startFrame);

        //Set the `frameCounter` to the first frame
        frameCounter = 1;

        //If the state isn't already `playing`, start it
        if (!sprite.animating) {
          timerInterval = setInterval(advanceFrame.bind(this), frameRate);
          sprite.animating = true;
        }
      }

      //`advanceFrame` is called by `setInterval` to display the next frame
      //in the sequence based on the `frameRate`. When the frame sequence
      //reaches the end, it will either stop or loop
      function advanceFrame() {

        //Advance the frame if `frameCounter` is less than
        //the state's total frames
        if (frameCounter < numberOfFrames + 1) {

          //Advance the frame
          sprite.gotoAndStop(sprite.currentFrame + 1);

          //Update the frame counter
          frameCounter += 1;

          //If we've reached the last frame and `loop`
          //is `true`, then start from the first frame again
        } else {
            if (sprite.loop) {
              sprite.gotoAndStop(startFrame);
              frameCounter = 1;
            }
          }
      }

      function reset() {

        //Reset `sprite.playing` to `false`, set the `frameCounter` to 0, //and clear the `timerInterval`
        if (timerInterval !== undefined && sprite.animating === true) {
          sprite.animating = false;
          frameCounter = 0;
          startFrame = 0;
          endFrame = 0;
          numberOfFrames = 0;
          clearInterval(timerInterval);
        }
      }

      //Add the `show`, `play`, `stop`, and `playSequence` methods to the sprite
      sprite.show = show;
      sprite.stopAnimation = stopAnimation;
      sprite.playAnimation = playAnimation;
    }

    //`tilingSpirte` lets you quickly create Pixi tiling sprites

  }, {
    key: "tilingSprite",
    value: function tilingSprite(source, width, height, x, y) {
      if (width === undefined) {
        throw new Error("Please define a width as your second argument for the tiling sprite");
      }
      if (height === undefined) {
        throw new Error("Please define a height as your third argument for the tiling sprite");
      }
      var o = this.sprite(source, x, y, true, width, height);

      //Add `tileX`, `tileY`, `tileScaleX` and `tileScaleY` properties
      Object.defineProperties(o, {
        "tileX": {
          get: function get() {
            return o.tilePosition.x;
          },
          set: function set(value) {
            o.tilePosition.x = value;
          },

          enumerable: true, configurable: true
        },
        "tileY": {
          get: function get() {
            return o.tilePosition.y;
          },
          set: function set(value) {
            o.tilePosition.y = value;
          },

          enumerable: true, configurable: true
        },
        "tileScaleX": {
          get: function get() {
            return o.tileScale.x;
          },
          set: function set(value) {
            o.tileScale.x = value;
          },

          enumerable: true, configurable: true
        },
        "tileScaleY": {
          get: function get() {
            return o.tileScale.y;
          },
          set: function set(value) {
            o.tileScale.y = value;
          },

          enumerable: true, configurable: true
        }
      });

      return o;
    }
  }, {
    key: "filmstrip",
    value: function filmstrip(texture, frameWidth, frameHeight) {
      var spacing = arguments.length <= 3 || arguments[3] === undefined ? 0 : arguments[3];

      //An array to store the x/y positions of the frames
      var positions = [];

      //Find the width and height of the texture
      var textureWidth = this.TextureCache[texture].width,
          textureHeight = this.TextureCache[texture].height;

      //Find out how many columns and rows there are
      var columns = textureWidth / frameWidth,
          rows = textureHeight / frameHeight;

      //Find the total number of frames
      var numberOfFrames = columns * rows;

      for (var i = 0; i < numberOfFrames; i++) {

        //Find the correct row and column for each frame
        //and figure out its x and y position
        var x = i % columns * frameWidth,
            y = Math.floor(i / columns) * frameHeight;

        //Compensate for any optional spacing (padding) around the tiles if
        //there is any. This bit of code accumlates the spacing offsets from the
        //left side of the tileset and adds them to the current tile's position
        if (spacing > 0) {
          x += spacing + spacing * i % columns;
          y += spacing + spacing * Math.floor(i / columns);
        }

        //Add the x and y value of each frame to the `positions` array
        positions.push([x, y]);
      }

      //Return the frames
      return this.frames(texture, positions, frameWidth, frameHeight);
    }

    //Make a texture from a frame in another texture or image

  }, {
    key: "frame",
    value: function frame(source, x, y, width, height) {

      var texture = undefined,
          imageFrame = undefined;

      //If the source is a string, it's either a texture in the
      //cache or an image file
      if (typeof source === "string") {
        if (this.TextureCache[source]) {
          texture = new this.Texture(this.TextureCache[source]);
        }
      }

      //If the `source` is a texture,  use it
      else if (source instanceof this.Texture) {
          texture = new this.Texture(source);
        }
      if (!texture) {
        throw new Error("Please load the " + source + " texture into the cache.");
      } else {

        //Make a rectangle the size of the sub-image
        imageFrame = new this.Rectangle(x, y, width, height);
        texture.frame = imageFrame;
        return texture;
      }
    }

    //Make an array of textures from a 2D array of frame x and y coordinates in
    //texture

  }, {
    key: "frames",
    value: function frames(source, coordinates, frameWidth, frameHeight) {
      var _this = this;

      var baseTexture = undefined,
          textures = undefined;

      //If the source is a string, it's either a texture in the
      //cache or an image file
      if (typeof source === "string") {
        if (this.TextureCache[source]) {
          baseTexture = new this.Texture(this.TextureCache[source]);
        }
      }
      //If the `source` is a texture,  use it
      else if (source instanceof this.Texture) {
          baseTexture = new this.Texture(source);
        }
      if (!baseTexture) {
        throw new Error("Please load the " + source + " texture into the cache.");
      } else {
        var _textures = coordinates.map(function (position) {
          var x = position[0],
              y = position[1];
          var imageFrame = new _this.Rectangle(x, y, frameWidth, frameHeight);
          var frameTexture = new _this.Texture(baseTexture);
          frameTexture.frame = imageFrame;
          return frameTexture;
        });
        return _textures;
      }
    }
  }, {
    key: "frameSeries",
    value: function frameSeries() {
      var startNumber = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
      var endNumber = arguments.length <= 1 || arguments[1] === undefined ? 1 : arguments[1];
      var baseName = arguments.length <= 2 || arguments[2] === undefined ? "" : arguments[2];
      var extension = arguments.length <= 3 || arguments[3] === undefined ? "" : arguments[3];

      //Create an array to store the frame names
      var frames = [];

      for (var i = startNumber; i < endNumber + 1; i++) {
        var frame = this.TextureCache["" + (baseName + i + extension)];
        frames.push(frame);
      }
      return frames;
    }

    /* Text creation */

    //The`text` method is a quick way to create a Pixi Text sprite

  }, {
    key: "text",
    value: function text() {
      var content = arguments.length <= 0 || arguments[0] === undefined ? "message" : arguments[0];
      var font = arguments.length <= 1 || arguments[1] === undefined ? "16px sans" : arguments[1];
      var fillStyle = arguments.length <= 2 || arguments[2] === undefined ? "red" : arguments[2];
      var x = arguments.length <= 3 || arguments[3] === undefined ? 0 : arguments[3];
      var y = arguments.length <= 4 || arguments[4] === undefined ? 0 : arguments[4];

      //Create a Pixi Sprite object
      var message = new this.Text(content, { font: font, fill: fillStyle });
      message.x = x;
      message.y = y;

      //Add a `_text` property with a getter/setter
      message._content = content;
      Object.defineProperty(message, "content", {
        get: function get() {
          return this._content;
        },
        set: function set(value) {
          this._content = value;
          this.text = value;
        },

        enumerable: true, configurable: true
      });

      //Return the text object
      return message;
    }

    //The`bitmapText` method lets you create bitmap text

  }, {
    key: "bitmapText",
    value: function bitmapText() {
      var content = arguments.length <= 0 || arguments[0] === undefined ? "message" : arguments[0];
      var font = arguments[1];
      var align = arguments[2];
      var tint = arguments[3];
      var x = arguments.length <= 4 || arguments[4] === undefined ? 0 : arguments[4];
      var y = arguments.length <= 5 || arguments[5] === undefined ? 0 : arguments[5];

      //Create a Pixi Sprite object
      var message = new this.BitmapText(content, { font: font, align: align, tint: tint });
      message.x = x;
      message.y = y;

      //Add a `_text` property with a getter/setter
      message._content = content;
      Object.defineProperty(message, "content", {
        get: function get() {
          return this._content;
        },
        set: function set(value) {
          this._content = value;
          this.text = value;
        },

        enumerable: true, configurable: true
      });

      //Return the text object
      return message;
    }

    /* Shapes and lines */

    //Rectangle

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

      var o = new this.Graphics();
      o._sprite = undefined;
      o._width = width;
      o._height = height;
      o._fillStyle = this.color(fillStyle);
      o._strokeStyle = this.color(strokeStyle);
      o._lineWidth = lineWidth;

      //Draw the rectangle
      var draw = function draw(width, height, fillStyle, strokeStyle, lineWidth) {
        o.clear();
        o.beginFill(fillStyle);
        if (lineWidth > 0) {
          o.lineStyle(lineWidth, strokeStyle, 1);
        }
        o.drawRect(0, 0, width, height);
        o.endFill();
      };

      //Draw the line and capture the sprite that the `draw` function
      //returns
      draw(o._width, o._height, o._fillStyle, o._strokeStyle, o._lineWidth);

      //Generate a texture from the rectangle
      var texture = o.generateTexture();

      //Use the texture to create a sprite
      var sprite = new this.Sprite(texture);

      //Position the sprite
      sprite.x = x;
      sprite.y = y;

      //Add getters and setters to the sprite
      var self = this;
      Object.defineProperties(sprite, {
        "fillStyle": {
          get: function get() {
            return o._fillStyle;
          },
          set: function set(value) {
            o._fillStyle = self.color(value);

            //Draw the new rectangle
            draw(o._width, o._height, o._fillStyle, o._strokeStyle, o._lineWidth, o._x, o._y);

            //Generate a new texture and set it as the sprite's texture
            var texture = o.generateTexture();
            o._sprite.texture = texture;
          },

          enumerable: true, configurable: true
        },
        "strokeStyle": {
          get: function get() {
            return o._strokeStyle;
          },
          set: function set(value) {
            o._strokeStyle = self.color(value);

            //Draw the new rectangle
            draw(o._width, o._height, o._fillStyle, o._strokeStyle, o._lineWidth, o._x, o._y);

            //Generate a new texture and set it as the sprite's texture
            var texture = o.generateTexture();
            o._sprite.texture = texture;
          },

          enumerable: true, configurable: true
        },
        "lineWidth": {
          get: function get() {
            return o._lineWidth;
          },
          set: function set(value) {
            o._lineWidth = value;

            //Draw the new rectangle
            draw(o._width, o._height, o._fillStyle, o._strokeStyle, o._lineWidth, o._x, o._y);

            //Generate a new texture and set it as the sprite's texture
            var texture = o.generateTexture();
            o._sprite.texture = texture;
          },

          enumerable: true, configurable: true
        }
      });

      //Get a local reference to the sprite so that we can
      //change the rectangle properties later using the getters/setters
      o._sprite = sprite;

      //Return the sprite
      return sprite;
    }

    //Circle

  }, {
    key: "circle",
    value: function circle() {
      var diameter = arguments.length <= 0 || arguments[0] === undefined ? 32 : arguments[0];
      var fillStyle = arguments.length <= 1 || arguments[1] === undefined ? 0xFF3300 : arguments[1];
      var strokeStyle = arguments.length <= 2 || arguments[2] === undefined ? 0x0033CC : arguments[2];
      var lineWidth = arguments.length <= 3 || arguments[3] === undefined ? 0 : arguments[3];
      var x = arguments.length <= 4 || arguments[4] === undefined ? 0 : arguments[4];
      var y = arguments.length <= 5 || arguments[5] === undefined ? 0 : arguments[5];

      var o = new this.Graphics();
      o._diameter = diameter;
      o._fillStyle = this.color(fillStyle);
      o._strokeStyle = this.color(strokeStyle);
      o._lineWidth = lineWidth;

      //Draw the circle
      var draw = function draw(diameter, fillStyle, strokeStyle, lineWidth) {
        o.clear();
        o.beginFill(fillStyle);
        if (lineWidth > 0) {
          o.lineStyle(lineWidth, strokeStyle, 1);
        }
        o.drawCircle(0, 0, diameter / 2);
        o.endFill();
      };

      //Draw the cirlce
      draw(o._diameter, o._fillStyle, o._strokeStyle, o._lineWidth);

      //Generate a texture from the rectangle
      var texture = o.generateTexture();

      //Use the texture to create a sprite
      var sprite = new this.Sprite(texture);

      //Position the sprite
      sprite.x = x;
      sprite.y = y;

      //Add getters and setters to the sprite
      var self = this;
      Object.defineProperties(sprite, {
        "fillStyle": {
          get: function get() {
            return o._fillStyle;
          },
          set: function set(value) {
            o._fillStyle = self.color(value);

            //Draw the cirlce
            draw(o._diameter, o._fillStyle, o._strokeStyle, o._lineWidth);

            //Generate a new texture and set it as the sprite's texture
            var texture = o.generateTexture();
            o._sprite.texture = texture;
          },

          enumerable: true, configurable: true
        },
        "strokeStyle": {
          get: function get() {
            return o._strokeStyle;
          },
          set: function set(value) {
            o._strokeStyle = self.color(value);

            //Draw the cirlce
            draw(o._diameter, o._fillStyle, o._strokeStyle, o._lineWidth);

            //Generate a new texture and set it as the sprite's texture
            var texture = o.generateTexture();
            o._sprite.texture = texture;
          },

          enumerable: true, configurable: true
        },
        "diameter": {
          get: function get() {
            return o._diameter;
          },
          set: function set(value) {
            o._lineWidth = 10;

            //Draw the cirlce
            draw(o._diameter, o._fillStyle, o._strokeStyle, o._lineWidth);

            //Generate a new texture and set it as the sprite's texture
            var texture = o.generateTexture();
            o._sprite.texture = texture;
          },

          enumerable: true, configurable: true
        },
        "radius": {
          get: function get() {
            return o._diameter / 2;
          },
          set: function set(value) {

            //Draw the cirlce
            draw(value * 2, o._fillStyle, o._strokeStyle, o._lineWidth);

            //Generate a new texture and set it as the sprite's texture
            var texture = o.generateTexture();
            o._sprite.texture = texture;
          },

          enumerable: true, configurable: true
        }
      });
      //Get a local reference to the sprite so that we can
      //change the circle properties later using the getters/setters
      o._sprite = sprite;

      //Return the sprite
      return sprite;
    }

    //Line

  }, {
    key: "line",
    value: function line() {
      var strokeStyle = arguments.length <= 0 || arguments[0] === undefined ? 0x000000 : arguments[0];
      var lineWidth = arguments.length <= 1 || arguments[1] === undefined ? 1 : arguments[1];
      var ax = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];
      var ay = arguments.length <= 3 || arguments[3] === undefined ? 0 : arguments[3];
      var bx = arguments.length <= 4 || arguments[4] === undefined ? 32 : arguments[4];
      var by = arguments.length <= 5 || arguments[5] === undefined ? 32 : arguments[5];

      //Create the line object
      var o = new this.Graphics();

      //Private properties
      o._strokeStyle = this.color(strokeStyle);
      o._width = lineWidth;
      o._ax = ax;
      o._ay = ay;
      o._bx = bx;
      o._by = by;

      //A helper function that draws the line
      var draw = function draw(strokeStyle, lineWidth, ax, ay, bx, by) {
        o.clear();
        o.lineStyle(lineWidth, strokeStyle, 1);
        o.moveTo(ax, ay);
        o.lineTo(bx, by);
      };

      //Draw the line
      draw(o._strokeStyle, o._width, o._ax, o._ay, o._bx, o._by);

      //Define getters and setters that redefine the line's start and
      //end points and re-draws it if they change
      var self = this;
      Object.defineProperties(o, {
        "ax": {
          get: function get() {
            return o._ax;
          },
          set: function set(value) {
            o._ax = value;
            draw(o._strokeStyle, o._width, o._ax, o._ay, o._bx, o._by);
          },

          enumerable: true, configurable: true
        },
        "ay": {
          get: function get() {
            return o._ay;
          },
          set: function set(value) {
            o._ay = value;
            draw(o._strokeStyle, o._width, o._ax, o._ay, o._bx, o._by);
          },

          enumerable: true, configurable: true
        },
        "bx": {
          get: function get() {
            return o._bx;
          },
          set: function set(value) {
            o._bx = value;
            draw(o._strokeStyle, o._width, o._ax, o._ay, o._bx, o._by);
          },

          enumerable: true, configurable: true
        },
        "by": {
          get: function get() {
            return o._by;
          },
          set: function set(value) {
            o._by = value;
            draw(o._strokeStyle, o._width, o._ax, o._ay, o._bx, o._by);
          },

          enumerable: true, configurable: true
        },
        "strokeStyle": {
          get: function get() {
            return o._strokeStyle;
          },
          set: function set(value) {
            o._strokeStyle = self.color(value);

            //Draw the line
            draw(o._strokeStyle, o._width, o._ax, o._ay, o._bx, o._by);
          },

          enumerable: true, configurable: true
        },
        "width": {
          get: function get() {
            return o._width;
          },
          set: function set(value) {
            o._width = value;

            //Draw the line
            draw(o._strokeStyle, o._width, o._ax, o._ay, o._bx, o._by);
          },

          enumerable: true, configurable: true
        }
      });

      //Return the line
      return o;
    }

    /* Compound sprites */

    //Use `grid` to create a grid of sprites

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

      //Create an empty group called `container`. This `container`
      //group is what the function returns back to the main program.
      //All the sprites in the grid cells will be added
      //as children to this container
      var container = new this.Container();

      //The `create` method plots the grid

      var createGrid = function createGrid() {

        //Figure out the number of cells in the grid
        var length = columns * rows;

        //Create a sprite for each cell
        for (var i = 0; i < length; i++) {

          //Figure out the sprite's x/y placement in the grid
          var x = i % columns * cellWidth,
              y = Math.floor(i / columns) * cellHeight;

          //Use the `makeSprite` function supplied in the constructor
          //to make a sprite for the grid cell
          var sprite = makeSprite();

          //Add the sprite to the `container`
          container.addChild(sprite);

          //Should the sprite be centered in the cell?

          //No, it shouldn't be centered
          if (!centerCell) {
            sprite.x = x + xOffset;
            sprite.y = y + yOffset;
          }

          //Yes, it should be centered
          else {
              sprite.x = x + cellWidth / 2 - sprite.width / 2 + xOffset;
              sprite.y = y + cellHeight / 2 - sprite.width / 2 + yOffset;
            }

          //Run any optional extra code. This calls the
          //`extra` function supplied by the constructor
          if (extra) extra(sprite);
        }
      };

      //Run the `createGrid` method
      createGrid();

      //Return the `container` group back to the main program
      return container;
    }

    //Use `shoot` to create bullet sprites

  }, {
    key: "shoot",
    value: function shoot(shooter, angle, x, y, container, bulletSpeed, bulletArray, bulletSprite) {

      //Make a new sprite using the user-supplied `bulletSprite` function
      var bullet = bulletSprite();

      //Set the bullet's anchor point to its center
      bullet.anchor.set(0.5, 0.5);

      //Temporarily add the bullet to the shooter
      //so that we can position it relative to the
      //shooter's position
      shooter.addChild(bullet);
      bullet.x = x;
      bullet.y = y;

      //Find the bullet's global coordinates so that we can use
      //them to position the bullet on the new parent container
      var tempGx = bullet.getGlobalPosition().x,
          tempGy = bullet.getGlobalPosition().y;

      //Add the bullet to the new parent container using
      //the new global coordinates
      container.addChild(bullet);
      bullet.x = tempGx;
      bullet.y = tempGy;

      //Set the bullet's velocity
      bullet.vx = Math.cos(angle) * bulletSpeed;
      bullet.vy = Math.sin(angle) * bulletSpeed;

      //Push the bullet into the `bulletArray`
      bulletArray.push(bullet);
    }

    /*
    grid
    ----
     Helps you to automatically create a grid of sprites. `grid` returns a
    `group` sprite object that contains a sprite for every cell in the
    grid. You can define the rows and columns in the grid, whether or
    not the sprites should be centered inside each cell, or what their offset from the
    top left corner of each cell should be. Supply a function that
    returns the sprite that you want to make for each cell. You can
    supply an optional final function that runs any extra code after
    each sprite has been created. Here's the format for creating a grid:
         gridGroup = grid(
           //Set the grid's properties
          columns, rows, cellWidth, cellHeight,
          areSpirtesCentered?, xOffset, yOffset,
           //A function that returns a sprite
          () => g.circle(16, "blue"),
           //An optional final function that runs some extra code
          () => console.log("extra!")
        );
    */

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

      //Create an empty group called `container`. This `container`
      //group is what the function returns back to the main program.
      //All the sprites in the grid cells will be added
      //as children to this container
      var container = this.group();

      //The `create` method plots the grid
      var createGrid = function createGrid() {

        //Figure out the number of cells in the grid
        var length = columns * rows;

        //Create a sprite for each cell
        for (var i = 0; i < length; i++) {

          //Figure out the sprite's x/y placement in the grid
          var x = i % columns * cellWidth,
              y = Math.floor(i / columns) * cellHeight;

          //Use the `makeSprite` function supplied in the constructor
          //to make a sprite for the grid cell
          var sprite = makeSprite();

          //Add the sprite to the `container`
          container.addChild(sprite);

          //Should the sprite be centered in the cell?

          //No, it shouldn't be centered
          if (!centerCell) {
            sprite.x = x + xOffset;
            sprite.y = y + yOffset;
          }

          //Yes, it should be centered
          else {
              sprite.x = x + cellWidth / 2 - sprite.halfWidth + xOffset;
              sprite.y = y + cellHeight / 2 - sprite.halfHeight + yOffset;
            }

          //Run any optional extra code. This calls the
          //`extra` function supplied by the constructor
          if (extra) extra(sprite);
        }
      };

      //Run the `createGrid` method
      createGrid();

      //Return the `container` group back to the main program
      return container;
    }

    /*
    shake
    -----
     Used to create a shaking effect, like a screen shake
    */

  }, {
    key: "shake",
    value: function shake(sprite) {
      var magnitude = arguments.length <= 1 || arguments[1] === undefined ? 16 : arguments[1];
      var angular = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

      //Get a reference to this current object so that
      //it's easy to maintain scope in the nested sub-functions
      var self = this;

      //A counter to count the number of shakes
      var counter = 1;

      //The total number of shakes (there will be 1 shake per frame)
      var numberOfShakes = 10;

      //Capture the sprite's position and angle so you can
      //restore them after the shaking has finished
      var startX = sprite.x,
          startY = sprite.y,
          startAngle = sprite.rotation;

      //Divide the magnitude into 10 units so that you can
      //reduce the amount of shake by 10 percent each frame
      var magnitudeUnit = magnitude / numberOfShakes;

      //The `randomInt` helper function
      var randomInt = function randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      };

      //Add the sprite to the `shakingSprites` array if it
      //isn't already there
      if (self.shakingSprites.indexOf(sprite) === -1) {

        self.shakingSprites.push(sprite);

        //Add an `updateShake` method to the sprite.
        //The `updateShake` method will be called each frame
        //in the game loop. The shake effect type can be either
        //up and down (x/y shaking) or angular (rotational shaking).
        sprite.updateShake = function () {
          if (angular) {
            angularShake();
          } else {
            upAndDownShake();
          }
        };
      }

      //The `upAndDownShake` function
      function upAndDownShake() {

        //Shake the sprite while the `counter` is less than
        //the `numberOfShakes`
        if (counter < numberOfShakes) {

          //Reset the sprite's position at the start of each shake
          sprite.x = startX;
          sprite.y = startY;

          //Reduce the magnitude
          magnitude -= magnitudeUnit;

          //Randomly change the sprite's position
          sprite.x += randomInt(-magnitude, magnitude);
          sprite.y += randomInt(-magnitude, magnitude);

          //Add 1 to the counter
          counter += 1;
        }

        //When the shaking is finished, restore the sprite to its original
        //position and remove it from the `shakingSprites` array
        if (counter >= numberOfShakes) {
          sprite.x = startX;
          sprite.y = startY;
          self.shakingSprites.splice(self.shakingSprites.indexOf(sprite), 1);
        }
      }

      //The `angularShake` function
      //First set the initial tilt angle to the right (+1)
      var tiltAngle = 1;

      function angularShake() {
        if (counter < numberOfShakes) {

          //Reset the sprite's rotation
          sprite.rotation = startAngle;

          //Reduce the magnitude
          magnitude -= magnitudeUnit;

          //Rotate the sprite left or right, depending on the direction,
          //by an amount in radians that matches the magnitude
          sprite.rotation = magnitude * tiltAngle;
          counter += 1;

          //Reverse the tilt angle so that the sprite is tilted
          //in the opposite direction for the next shake
          tiltAngle *= -1;
        }

        //When the shaking is finished, reset the sprite's angle and
        //remove it from the `shakingSprites` array
        if (counter >= numberOfShakes) {
          sprite.rotation = startAngle;
          self.shakingSprites.splice(self.shakingSprites.indexOf(sprite), 1);
        }
      }
    }

    /*
    _getCenter
    ----------
     A utility that finds the center point of the sprite. If it's anchor point is the
    sprite's top left corner, then the center is calculated from that point.
    If the anchor point has been shifted, then the anchor x/y point is used as the sprite's center
    */

  }, {
    key: "_getCenter",
    value: function _getCenter(o, dimension, axis) {
      if (o.anchor !== undefined) {
        if (o.anchor[axis] !== 0) {
          return 0;
        } else {
          return dimension / 2;
        }
      } else {
        return dimension;
      }
    }

    /* Groups */

    //Group sprites into a container

  }, {
    key: "group",
    value: function group() {
      var container = new this.Container();

      for (var _len = arguments.length, sprites = Array(_len), _key = 0; _key < _len; _key++) {
        sprites[_key] = arguments[_key];
      }

      sprites.forEach(function (sprite) {
        container.addChild(sprite);
      });
      return container;
    }

    //Use the `batch` method to create a ParticleContainer

  }, {
    key: "batch",
    value: function batch() {
      var size = arguments.length <= 0 || arguments[0] === undefined ? 15000 : arguments[0];
      var options = arguments.length <= 1 || arguments[1] === undefined ? { rotation: true, alpha: true, scale: true, uvs: true } : arguments[1];

      var o = new this.ParticleContainer(size, options);
      return o;
    }

    //`remove` is a global convenience method that will
    //remove any sprite, or an argument list of sprites, from its parent.

  }, {
    key: "remove",
    value: function remove() {
      for (var _len2 = arguments.length, sprites = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        sprites[_key2] = arguments[_key2];
      }

      //Remove sprites that's aren't in an array
      if (!(sprites[0] instanceof Array)) {
        if (sprites.length > 1) {
          sprites.forEach(function (sprite) {
            sprite.parent.removeChild(sprite);
          });
        } else {
          sprites[0].parent.removeChild(sprites[0]);
        }
      }

      //Remove sprites in an array of sprites
      else {
          var spritesArray = sprites[0];
          if (spritesArray.length > 0) {
            for (var i = spritesArray.length - 1; i >= 0; i--) {
              var sprite = spritesArray[i];
              sprite.parent.removeChild(sprite);
              spritesArray.splice(spritesArray.indexOf(sprite), 1);
            }
          }
        }
    }

    /* Color conversion */
    //From: http://stackoverflow.com/questions/1573053/javascript-function-to-convert-color-names-to-hex-codes
    //Utilities to convert HTML color string names to hexadecimal codes

  }, {
    key: "colorToRGBA",
    value: function colorToRGBA(color) {
      // Returns the color as an array of [r, g, b, a] -- all range from 0 - 255
      // color must be a valid canvas fillStyle. This will cover most anything
      // you'd want to use.
      // Examples:
      // colorToRGBA('red')  # [255, 0, 0, 255]
      // colorToRGBA('#f00') # [255, 0, 0, 255]
      var cvs, ctx;
      cvs = document.createElement('canvas');
      cvs.height = 1;
      cvs.width = 1;
      ctx = cvs.getContext('2d');
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, 1, 1);
      var data = ctx.getImageData(0, 0, 1, 1).data;
      return data;
    }
  }, {
    key: "byteToHex",
    value: function byteToHex(num) {
      // Turns a number (0-255) into a 2-character hex number (00-ff)
      return ('0' + num.toString(16)).slice(-2);
    }
  }, {
    key: "colorToHex",
    value: function colorToHex(color) {
      var _this2 = this;

      // Convert any CSS color to a hex representation
      // Examples:
      // colorToHex('red')            # '#ff0000'
      // colorToHex('rgb(255, 0, 0)') # '#ff0000'
      var rgba, hex;
      rgba = this.colorToRGBA(color);
      hex = [0, 1, 2].map(function (idx) {
        return _this2.byteToHex(rgba[idx]);
      }).join('');
      return "0x" + hex;
    }

    //A function to find out if the user entered a number (a hex color
    //code) or a string (an HTML color string)

  }, {
    key: "color",
    value: function color(value) {

      //Check if it's a number
      if (!isNaN(value)) {

        //Yes, it is a number, so just return it
        return value;
      }

      //No it's not a number, so it must be a string   
      else {

          return parseInt(this.colorToHex(value));
          /*
           //Find out what kind of color string it is.
          //Let's first grab the first character of the string
          let firstCharacter = value.charAt(0);
           //If the first character is a "#" or a number, then
          //we know it must be a RGBA color
          if (firstCharacter === "#") {
            console.log("first character: " + value.charAt(0))
          }
          */
        }

      /*
      //Find out if the first character in the string is a number
      if (!isNaN(parseInt(string.charAt(0)))) {
        
        //It's not, so convert it to a hex code
        return colorToHex(string);
        
      //The use input a number, so it must be a hex code. Just return it
      } else {
      
        return string;
      }
      
      */
    }
  }]);

  return SpriteUtilities;
})();
//# sourceMappingURL=spriteUtilities.js.map"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GameUtilities = (function () {
  function GameUtilities() {
    _classCallCheck(this, GameUtilities);
  }

  /*
  distance
  ----------------
   Find the distance in pixels between two sprites.
  Parameters: 
  a. A sprite object. 
  b. A sprite object. 
  The function returns the number of pixels distance between the sprites.
      let distanceBetweenSprites = gu.distance(spriteA, spriteB);
   */

  _createClass(GameUtilities, [{
    key: "distance",
    value: function distance(s1, s2) {
      var vx = s2.x + this._getCenter(s2, s2.width, "x") - (s1.x + this._getCenter(s1, s1.width, "x")),
          vy = s2.y + this._getCenter(s2, s2.height, "y") - (s1.y + this._getCenter(s1, s1.height, "y"));
      return Math.sqrt(vx * vx + vy * vy);
    }

    /*
    followEase
    ----------------
     Make a sprite ease to the position of another sprite.
    Parameters: 
    a. A sprite object. This is the `follower` sprite.
    b. A sprite object. This is the `leader` sprite that the follower will chase.
    c. The easing value, such as 0.3. A higher number makes the follower move faster.
        gu.followEase(follower, leader, speed);
     Use it inside a game loop.
    */

  }, {
    key: "followEase",
    value: function followEase(follower, leader, speed) {

      //Figure out the distance between the sprites
      /*
      let vx = (leader.x + leader.width / 2) - (follower.x + follower.width / 2),
          vy = (leader.y + leader.height / 2) - (follower.y + follower.height / 2),
          distance = Math.sqrt(vx * vx + vy * vy);
      */

      var vx = leader.x + this._getCenter(leader, leader.width, "x") - (follower.x + this._getCenter(follower, follower.width, "x")),
          vy = leader.y + this._getCenter(leader, leader.height, "y") - (follower.y + this._getCenter(follower, follower.height, "y")),
          distance = Math.sqrt(vx * vx + vy * vy);

      //Move the follower if it's more than 1 pixel
      //away from the leader
      if (distance >= 1) {
        follower.x += vx * speed;
        follower.y += vy * speed;
      }
    }

    /*
    followConstant
    ----------------
     Make a sprite move towards another sprite at a constant speed.
    Parameters: 
    a. A sprite object. This is the `follower` sprite.
    b. A sprite object. This is the `leader` sprite that the follower will chase.
    c. The speed value, such as 3. The is the pixels per frame that the sprite will move. A higher number makes the follower move faster.
        gu.followConstant(follower, leader, speed);
     */

  }, {
    key: "followConstant",
    value: function followConstant(follower, leader, speed) {

      //Figure out the distance between the sprites
      var vx = leader.x + this._getCenter(leader, leader.width, "x") - (follower.x + this._getCenter(follower, follower.width, "x")),
          vy = leader.y + this._getCenter(leader, leader.height, "y") - (follower.y + this._getCenter(follower, follower.height, "y")),
          distance = Math.sqrt(vx * vx + vy * vy);

      //Move the follower if it's more than 1 move
      //away from the leader
      if (distance >= speed) {
        follower.x += vx / distance * speed;
        follower.y += vy / distance * speed;
      }
    }

    /*
    angle
    -----
     Return the angle in Radians between two sprites.
    Parameters: 
    a. A sprite object.
    b. A sprite object.
    You can use it to make a sprite rotate towards another sprite like this:
         box.rotation = gu.angle(box, pointer);
     */

  }, {
    key: "angle",
    value: function angle(s1, s2) {
      return Math.atan2(
      //This is the code you need if you don't want to compensate
      //for a possible shift in the sprites' x/y anchor points
      /*
      (s2.y + s2.height / 2) - (s1.y + s1.height / 2),
      (s2.x + s2.width / 2) - (s1.x + s1.width / 2)
      */
      //This code adapts to a shifted anchor point
      s2.y + this._getCenter(s2, s2.height, "y") - (s1.y + this._getCenter(s1, s1.height, "y")), s2.x + this._getCenter(s2, s2.width, "x") - (s1.x + this._getCenter(s1, s1.width, "x")));
    }

    /*
    _getCenter
    ----------
     A utility that finds the center point of the sprite. If it's anchor point is the
    sprite's top left corner, then the center is calculated from that point.
    If the anchor point has been shifted, then the anchor x/y point is used as the sprite's center
    */

  }, {
    key: "_getCenter",
    value: function _getCenter(o, dimension, axis) {
      if (o.anchor !== undefined) {
        if (o.anchor[axis] !== 0) {
          return 0;
        } else {
          //console.log(o.anchor[axis])
          return dimension / 2;
        }
      } else {
        return dimension;
      }
    }

    /*
    rotateAroundSprite
    ------------
    Make a sprite rotate around another sprite.
    Parameters:
    a. The sprite you want to rotate.
    b. The sprite around which you want to rotate the first sprite.
    c. The distance, in pixels, that the roating sprite should be offset from the center.
    d. The angle of rotations, in radians.
        gu.rotateAroundSprite(orbitingSprite, centerSprite, 50, angleInRadians);
     Use it inside a game loop, and make sure you update the angle value (the 4th argument) each frame.
    */

  }, {
    key: "rotateAroundSprite",
    value: function rotateAroundSprite(rotatingSprite, centerSprite, distance, angle) {
      rotatingSprite.x = centerSprite.x + this._getCenter(centerSprite, centerSprite.width, "x") - rotatingSprite.parent.x + distance * Math.cos(angle) - this._getCenter(rotatingSprite, rotatingSprite.width, "x");

      rotatingSprite.y = centerSprite.y + this._getCenter(centerSprite, centerSprite.height, "y") - rotatingSprite.parent.y + distance * Math.sin(angle) - this._getCenter(rotatingSprite, rotatingSprite.height, "y");
    }

    /*
    rotateAroundPoint
    -----------------
    Make a point rotate around another point.
    Parameters:
    a. The point you want to rotate.
    b. The point around which you want to rotate the first point.
    c. The distance, in pixels, that the roating sprite should be offset from the center.
    d. The angle of rotations, in radians.
        gu.rotateAroundPoint(orbitingPoint, centerPoint, 50, angleInRadians);
     Use it inside a game loop, and make sure you update the angle value (the 4th argument) each frame.
     */

  }, {
    key: "rotateAroundPoint",
    value: function rotateAroundPoint(pointX, pointY, distanceX, distanceY, angle) {
      var point = {};
      point.x = pointX + Math.cos(angle) * distanceX;
      point.y = pointY + Math.sin(angle) * distanceY;
      return point;
    }

    /*
    randomInt
    ---------
     Return a random integer between a minimum and maximum value
    Parameters: 
    a. An integer.
    b. An integer.
    Here's how you can use it to get a random number between, 1 and 10:
        let number = gu.randomInt(1, 10);
     */

  }, {
    key: "randomInt",
    value: function randomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /*
    randomFloat
    -----------
     Return a random floating point number between a minimum and maximum value
    Parameters: 
    a. Any number.
    b. Any number.
    Here's how you can use it to get a random floating point number between, 1 and 10:
         let number = gu.randomFloat(1, 10);
     */

  }, {
    key: "randomFloat",
    value: function randomFloat(min, max) {
      return min + Math.random() * (max - min);
    }

    /*
    Wait
    ----
     Lets you wait for a specific number of milliseconds before running the
    next function. 
     
      gu.wait(1000, runThisFunctionNext());
    
    */

  }, {
    key: "wait",
    value: function wait(duration, callBack) {
      setTimeout(callBack, duration);
    }

    /*
    Move
    ----
     Move a sprite by adding it's velocity to it's position. The sprite 
    must have `vx` and `vy` values for this to work. You can supply a
    single sprite, or a list of sprites, separated by commas.
         gu.move(sprite);
    */

  }, {
    key: "move",
    value: function move() {
      for (var _len = arguments.length, sprites = Array(_len), _key = 0; _key < _len; _key++) {
        sprites[_key] = arguments[_key];
      }

      //Move sprites that's aren't in an array
      if (!(sprites[0] instanceof Array)) {
        if (sprites.length > 1) {
          sprites.forEach(function (sprite) {
            sprite.x += sprite.vx;
            sprite.y += sprite.vy;
          });
        } else {
          sprites[0].x += sprites[0].vx;
          sprites[0].y += sprites[0].vy;
        }
      }

      //Move sprites in an array of sprites
      else {
          var spritesArray = sprites[0];
          if (spritesArray.length > 0) {
            for (var i = spritesArray.length - 1; i >= 0; i--) {
              var sprite = spritesArray[i];
              sprite.x += sprite.vx;
              sprite.y += sprite.vy;
            }
          }
        }
    }

    /*
    World camera
    ------------
     The `worldCamera` method returns a `camera` object
    with `x` and `y` properties. It has
    two useful methods: `centerOver`, to center the camera over
    a sprite, and `follow` to make it follow a sprite.
    `worldCamera` arguments: worldObject, theCanvas
    The worldObject needs to have a `width` and `height` property.
    */

  }, {
    key: "worldCamera",
    value: function worldCamera(world, worldWidth, worldHeight, canvas) {

      //Define a `camera` object with helpful properties
      var camera = {
        width: canvas.width,
        height: canvas.height,
        _x: 0,
        _y: 0,

        //`x` and `y` getters/setters
        //When you change the camera's position,
        //they shift the position of the world in the opposite direction
        get x() {
          return this._x;
        },
        set x(value) {
          this._x = value;
          world.x = -this._x;
          //world._previousX = world.x;
        },
        get y() {
          return this._y;
        },
        set y(value) {
          this._y = value;
          world.y = -this._y;
          //world._previousY = world.y;
        },

        //The center x and y position of the camera
        get centerX() {
          return this.x + this.width / 2;
        },
        get centerY() {
          return this.y + this.height / 2;
        },

        //Boundary properties that define a rectangular area, half the size
        //of the game screen. If the sprite that the camera is following
        //is inide this area, the camera won't scroll. If the sprite
        //crosses this boundary, the `follow` function ahead will change
        //the camera's x and y position to scroll the game world
        get rightInnerBoundary() {
          return this.x + this.width / 2 + this.width / 4;
        },
        get leftInnerBoundary() {
          return this.x + this.width / 2 - this.width / 4;
        },
        get topInnerBoundary() {
          return this.y + this.height / 2 - this.height / 4;
        },
        get bottomInnerBoundary() {
          return this.y + this.height / 2 + this.height / 4;
        },

        //The code next defines two camera
        //methods: `follow` and `centerOver`

        //Use the `follow` method to make the camera follow a sprite
        follow: function follow(sprite) {

          //Check the sprites position in relation to the inner
          //boundary. Move the camera to follow the sprite if the sprite
          //strays outside the boundary
          if (sprite.x < this.leftInnerBoundary) {
            this.x = sprite.x - this.width / 4;
          }
          if (sprite.y < this.topInnerBoundary) {
            this.y = sprite.y - this.height / 4;
          }
          if (sprite.x + sprite.width > this.rightInnerBoundary) {
            this.x = sprite.x + sprite.width - this.width / 4 * 3;
          }
          if (sprite.y + sprite.height > this.bottomInnerBoundary) {
            this.y = sprite.y + sprite.height - this.height / 4 * 3;
          }

          //If the camera reaches the edge of the map, stop it from moving
          if (this.x < 0) {
            this.x = 0;
          }
          if (this.y < 0) {
            this.y = 0;
          }
          if (this.x + this.width > worldWidth) {
            this.x = worldWidth - this.width;
          }
          if (this.y + this.height > worldHeight) {
            this.y = worldHeight - this.height;
          }
        },

        //Use the `centerOver` method to center the camera over a sprite
        centerOver: function centerOver(sprite) {

          //Center the camera over a sprite
          this.x = sprite.x + sprite.halfWidth - this.width / 2;
          this.y = sprite.y + sprite.halfHeight - this.height / 2;
        }
      };

      //Return the `camera` object
      return camera;
    }
  }, {
    key: "lineOfSight",

    /*
    Line of sight
    ------------
     The `lineOfSight` method will return `true` if there’s clear line of sight 
    between two sprites, and `false` if there isn’t. Here’s how to use it in your game code:
         monster.lineOfSight = gu.lineOfSight(
            monster, //Sprite one
            alien,   //Sprite two
            boxes,   //An array of obstacle sprites
            16       //The distance between each collision point
        );
     The 4th argument determines the distance between collision points. 
    For better performance, make this a large number, up to the maximum 
    width of your smallest sprite (such as 64 or 32). For greater precision, 
    use a smaller number. You can use the lineOfSight value to decide how 
    to change certain things in your game. For example:
         if (monster.lineOfSight) {
          monster.show(monster.states.angry)
        } else {
          monster.show(monster.states.normal)
        }
     */

    value: function lineOfSight(s1, //The first sprite, with `centerX` and `centerY` properties
    s2, //The second sprite, with `centerX` and `centerY` properties
    obstacles) //The distance between collision points
    {
      var segment = arguments.length <= 3 || arguments[3] === undefined ? 32 : arguments[3];

      //Calculate the center points of each sprite
      spriteOneCenterX = s1.x + this._getCenter(s1, s1.width, "x");
      spriteOneCenterY = s1.y + this._getCenter(s1, s1.height, "y");
      spriteTwoCenterX = s2.x + this._getCenter(s2, s2.width, "x");
      spriteTwoCenterY = s2.y + this._getCenter(s2, s2.height, "y");

      //Plot a vector between spriteTwo and spriteOne
      var vx = spriteTwoCenterX - spriteOneCenterX,
          vy = spriteTwoCenterY - spriteOneCenterY;

      //Find the vector's magnitude (its length in pixels)
      var magnitude = Math.sqrt(vx * vx + vy * vy);

      //How many points will we need to test?
      var numberOfPoints = magnitude / segment;

      //Create an array of x/y points, separated by 64 pixels, that
      //extends from `spriteOne` to `spriteTwo` 
      var points = function points() {

        //Initialize an array that is going to store all our points
        //along the vector
        var arrayOfPoints = [];

        //Create a point object for each segment of the vector and
        //store its x/y position as well as its index number on
        //the map array
        for (var i = 1; i <= numberOfPoints; i++) {

          //Calculate the new magnitude for this iteration of the loop
          var newMagnitude = segment * i;

          //Find the unit vector. This is a small, scaled down version of
          //the vector between the sprites that's less than one pixel long.
          //It points in the same direction as the main vector, but because it's
          //the smallest size that the vector can be, we can use it to create
          //new vectors of varying length
          var dx = vx / magnitude,
              dy = vy / magnitude;

          //Use the unit vector and newMagnitude to figure out the x/y
          //position of the next point in this loop iteration
          var x = spriteOneCenterX + dx * newMagnitude,
              y = spriteOneCenterY + dy * newMagnitude;

          //Push a point object with x and y properties into the `arrayOfPoints`
          arrayOfPoints.push({
            x: x, y: y
          });
        }

        //Return the array of point objects
        return arrayOfPoints;
      };

      //Test for a collision between a point and a sprite
      var hitTestPoint = function hitTestPoint(point, sprite) {

        //Find out if the point's position is inside the area defined
        //by the sprite's left, right, top and bottom sides
        var left = point.x > sprite.x,
            right = point.x < sprite.x + sprite.width,
            top = point.y > sprite.y,
            bottom = point.y < sprite.y + sprite.height;

        //If all the collision conditions are met, you know the
        //point is intersecting the sprite
        return left && right && top && bottom;
      };

      //The `noObstacles` function will return `true` if all the tile
      //index numbers along the vector are `0`, which means they contain
      //no obstacles. If any of them aren't 0, then the function returns
      //`false` which means there's an obstacle in the way
      var noObstacles = points().every(function (point) {
        return obstacles.every(function (obstacle) {
          return !hitTestPoint(point, obstacle);
        });
      });

      //Return the true/false value of the collision test
      return noObstacles;
    }
  }]);

  return GameUtilities;
})();
//# sourceMappingURL=gameUtilities.js.map"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Smoothie = (function () {
  function Smoothie() //Refers to `tileposition` and `tileScale` x and y properties
  {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {
      engine: PIXI, //The rendering engine (Pixi)
      renderer: undefined, //The Pixi renderer you created in your application
      root: undefined, //The root Pixi display object (usually the `stage`)
      update: undefined, //A logic function that should be called every frame of the game loop
      interpolate: true, //A Boolean to turn interpolation on or off
      fps: 60, //The frame rate at which the application's looping logic function should update
      renderFps: undefined, //The frame rate at which sprites should be rendered
      properties: { //Sprite roperties that should be interpolated
        position: true,
        rotation: true,
        size: false,
        scale: false,
        alpha: false,
        tile: false }
    } : arguments[0];

    _classCallCheck(this, Smoothie);

    if (options.engine === undefined) throw new Error("Please assign a rendering engine as Smoothie's engine option");

    //Find out which rendering engine is being used (the default is Pixi)
    this.engine = "";

    //If the `renderingEngine` is Pixi, set up Pixi object aliases
    if (options.engine.ParticleContainer && options.engine.Sprite) {
      this.renderingEngine = "pixi";
      this.Container = options.engine.Container;
      this.Sprite = options.engine.Sprite;
      this.MovieClip = options.engine.extras.MovieClip;
    }

    //Check to make sure the user had supplied a renderer. If you're
    //using Pixi, this should be the instantiated `renderer` object
    //that you created in your main application
    if (options.renderer === undefined) {
      throw new Error("Please assign a renderer object as Smoothie's renderer option");
    } else {
      this.renderer = options.renderer;
    }

    //Check to make sure the user has supplied a root container. This
    //is the object is at the top of the display list heirarchy. If
    //you're using Pixi, it would be a `Container` object, often by
    //convention called the `stage`
    if (options.root === undefined) {
      throw new Error("Please assign a root container object (the stage) as Smoothie's rootr option");
    } else {
      this.stage = options.root;
    }

    if (options.update === undefined) {
      throw new Error("Please assign a function that you want to update on each frame as Smoothie's update option");
    } else {
      this.update = options.update;
    }

    //Define the sprite properties that should be interpolated
    if (options.properties === undefined) {
      this.properties = { position: true, rotation: true };
    } else {
      this.properties = options.properties;
    }

    //The upper-limit frames per second that the game' logic update
    //function should run at.
    //Smoothie defaults to 60 fps.
    if (options.fps !== undefined) {
      this._fps = options.fps;
    } else {
      this._fps = undefined;
    }

    //Optionally Clamp the upper-limit frame rate at which sprites should render
    if (options.renderFps !== undefined) {
      this._renderFps = options.renderFps;
    } else {
      this._renderFps = undefined;
    }
    //Set sprite rendering position interpolation to
    //`true` by default
    if (options.interpolate === false) {
      this.interpolate = false;
    } else {
      this.interpolate = true;
    }

    //A variable that can be used to pause and play Smoothie
    this.paused = false;

    //Private properties used to set the frame rate and figure out the interpolation values
    this._startTime = Date.now();
    this._frameDuration = 1000 / this._fps;
    this._lag = 0;
    this._lagOffset = 0;

    this._renderStartTime = 0;
    if (this._renderFps !== undefined) {
      this._renderDuration = 1000 / this._renderFps;
    }
  }

  //Getters and setters

  //Fps

  _createClass(Smoothie, [{
    key: "pause",

    //Methods to pause and resume Smoothie
    value: function pause() {
      this.paused = true;
    }
  }, {
    key: "resume",
    value: function resume() {
      this.paused = false;
    }

    //The `start` method gets Smoothie's game loop running

  }, {
    key: "start",
    value: function start() {

      //Start the game loop
      this.gameLoop();
    }

    //The core game loop

  }, {
    key: "gameLoop",
    value: function gameLoop(timestamp) {
      var _this = this;

      requestAnimationFrame(this.gameLoop.bind(this));

      //Only run if Smoothie isn't paused
      if (!this.paused) {

        //The `interpolate` function updates the logic function at the
        //same rate as the user-defined fps, renders the sprites, with
        //interpolation, at the maximum frame rate the system is capbale
        //of

        var interpolate = function interpolate() {

          //Calculate the time that has elapsed since the last frame
          var current = Date.now(),
              elapsed = current - _this._startTime;

          //Catch any unexpectedly large frame rate spikes
          if (elapsed > 1000) elapsed = _this._frameDuration;

          //For interpolation:
          _this._startTime = current;

          //Add the elapsed time to the lag counter
          _this._lag += elapsed;

          //Update the frame if the lag counter is greater than or
          //equal to the frame duration
          while (_this._lag >= _this._frameDuration) {

            //Capture the sprites' previous properties for rendering
            //interpolation
            _this.capturePreviousSpriteProperties();

            //Update the logic in the user-defined update function
            _this.update();

            //Reduce the lag counter by the frame duration
            _this._lag -= _this._frameDuration;
          }

          //Calculate the lag offset and use it to render the sprites
          _this._lagOffset = _this._lag / _this._frameDuration;
          _this.render(_this._lagOffset);
        };

        //If the `fps` hasn't been defined, call the user-defined update
        //function and render the sprites at the maximum rate the
        //system is capable of
        if (this._fps === undefined) {

          //Run the user-defined game logic function each frame of the
          //game at the maxium frame rate your system is capable of
          this.update();
          this.render();
        } else {
          if (this._renderFps === undefined) {
            interpolate();
          } else {

            //Implement optional frame rate rendering clamping
            if (timestamp >= this._renderStartTime) {

              //Update the current logic frame and render with
              //interpolation
              interpolate();

              //Reset the frame render start time
              this._renderStartTime = timestamp + this._renderDuration;
            }
          }
        }
      }
    }

    //`capturePreviousSpritePositions`
    //This function is run in the game loop just before the logic update
    //to store all the sprites' previous positions from the last frame.
    //It allows the render function to interpolate the sprite positions
    //for ultra-smooth sprite rendering at any frame rate

  }, {
    key: "capturePreviousSpriteProperties",
    value: function capturePreviousSpriteProperties() {
      var _this2 = this;

      //A function that capture's the sprites properties
      var setProperties = function setProperties(sprite) {
        if (_this2.properties.position) {
          sprite._previousX = sprite.x;
          sprite._previousY = sprite.y;
        }
        if (_this2.properties.rotation) {
          sprite._previousRotation = sprite.rotation;
        }
        if (_this2.properties.size) {
          sprite._previousWidth = sprite.width;
          sprite._previousHeight = sprite.height;
        }
        if (_this2.properties.scale) {
          sprite._previousScaleX = sprite.scale.x;
          sprite._previousScaleY = sprite.scale.y;
        }
        if (_this2.properties.alpha) {
          sprite._previousAlpha = sprite.alpha;
        }
        if (_this2.properties.tile) {
          if (sprite.tilePosition !== undefined) {
            sprite._previousTilePositionX = sprite.tilePosition.x;
            sprite._previousTilePositionY = sprite.tilePosition.y;
          }
          if (sprite.tileScale !== undefined) {
            sprite._previousTileScaleX = sprite.tileScale.x;
            sprite._previousTileScaleY = sprite.tileScale.y;
          }
        }

        if (sprite.children && sprite.children.length > 0) {
          for (var i = 0; i < sprite.children.length; i++) {
            var child = sprite.children[i];
            setProperties(child);
          }
        }
      };

      //loop through the all the sprites and capture their properties
      for (var i = 0; i < this.stage.children.length; i++) {
        var sprite = this.stage.children[i];
        setProperties(sprite);
      }
    }

    //Smoothie's `render` method will interpolate the sprite positions and
    //rotation for
    //ultra-smooth animation, if Hexi's `interpolate` property is `true`
    //(it is by default)

  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      var lagOffset = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];

      //Calculate the sprites' interpolated render positions if
      //`this.interpolate` is `true` (It is true by default)

      if (this.interpolate) {
        (function () {

          //A recursive function that does the work of figuring out the
          //interpolated positions
          var interpolateSprite = function interpolateSprite(sprite) {

            //Position (`x` and `y` properties)
            if (_this3.properties.position) {

              //Capture the sprite's current x and y positions
              sprite._currentX = sprite.x;
              sprite._currentY = sprite.y;

              //Figure out its interpolated positions
              if (sprite._previousX !== undefined) {
                sprite.x = (sprite.x - sprite._previousX) * lagOffset + sprite._previousX;
              }
              if (sprite._previousY !== undefined) {
                sprite.y = (sprite.y - sprite._previousY) * lagOffset + sprite._previousY;
              }
            }

            //Rotation (`rotation` property)
            if (_this3.properties.rotation) {

              //Capture the sprite's current rotation
              sprite._currentRotation = sprite.rotation;

              //Figure out its interpolated rotation
              if (sprite._previousRotation !== undefined) {
                sprite.rotation = (sprite.rotation - sprite._previousRotation) * lagOffset + sprite._previousRotation;
              }
            }

            //Size (`width` and `height` properties)
            if (_this3.properties.size) {

              //Only allow this for Sprites or MovieClips. Because
              //Containers vary in size when the sprites they contain
              //move, the interpolation will cause them to scale erraticly
              if (sprite instanceof _this3.Sprite || sprite instanceof _this3.MovieClip) {

                //Capture the sprite's current size
                sprite._currentWidth = sprite.width;
                sprite._currentHeight = sprite.height;

                //Figure out the sprite's interpolated size
                if (sprite._previousWidth !== undefined) {
                  sprite.width = (sprite.width - sprite._previousWidth) * lagOffset + sprite._previousWidth;
                }
                if (sprite._previousHeight !== undefined) {
                  sprite.height = (sprite.height - sprite._previousHeight) * lagOffset + sprite._previousHeight;
                }
              }
            }

            //Scale (`scale.x` and `scale.y` properties)
            if (_this3.properties.scale) {

              //Capture the sprite's current scale
              sprite._currentScaleX = sprite.scale.x;
              sprite._currentScaleY = sprite.scale.y;

              //Figure out the sprite's interpolated scale
              if (sprite._previousScaleX !== undefined) {
                sprite.scale.x = (sprite.scale.x - sprite._previousScaleX) * lagOffset + sprite._previousScaleX;
              }
              if (sprite._previousScaleY !== undefined) {
                sprite.scale.y = (sprite.scale.y - sprite._previousScaleY) * lagOffset + sprite._previousScaleY;
              }
            }

            //Alpha (`alpha` property)
            if (_this3.properties.alpha) {

              //Capture the sprite's current alpha
              sprite._currentAlpha = sprite.alpha;

              //Figure out its interpolated alpha
              if (sprite._previousAlpha !== undefined) {
                sprite.alpha = (sprite.alpha - sprite._previousAlpha) * lagOffset + sprite._previousAlpha;
              }
            }

            //Tiling sprite properties (`tileposition` and `tileScale` x
            //and y values)
            if (_this3.properties.tile) {

              //`tilePosition.x` and `tilePosition.y`
              if (sprite.tilePosition !== undefined) {

                //Capture the sprite's current tile x and y positions
                sprite._currentTilePositionX = sprite.tilePosition.x;
                sprite._currentTilePositionY = sprite.tilePosition.y;

                //Figure out its interpolated positions
                if (sprite._previousTilePositionX !== undefined) {
                  sprite.tilePosition.x = (sprite.tilePosition.x - sprite._previousTilePositionX) * lagOffset + sprite._previousTilePositionX;
                }
                if (sprite._previousTilePositionY !== undefined) {
                  sprite.tilePosition.y = (sprite.tilePosition.y - sprite._previousTilePositionY) * lagOffset + sprite._previousTilePositionY;
                }
              }

              //`tileScale.x` and `tileScale.y`
              if (sprite.tileScale !== undefined) {

                //Capture the sprite's current tile scale
                sprite._currentTileScaleX = sprite.tileScale.x;
                sprite._currentTileScaleY = sprite.tileScale.y;

                //Figure out the sprite's interpolated scale
                if (sprite._previousTileScaleX !== undefined) {
                  sprite.tileScale.x = (sprite.tileScale.x - sprite._previousTileScaleX) * lagOffset + sprite._previousTileScaleX;
                }
                if (sprite._previousTileScaleY !== undefined) {
                  sprite.tileScale.y = (sprite.tileScale.y - sprite._previousTileScaleY) * lagOffset + sprite._previousTileScaleY;
                }
              }
            }

            //Interpolate the sprite's children, if it has any
            if (sprite.children.length !== 0) {
              for (var j = 0; j < sprite.children.length; j++) {

                //Find the sprite's child
                var child = sprite.children[j];

                //display the child
                interpolateSprite(child);
              }
            }
          };

          //loop through the all the sprites and interpolate them
          for (var i = 0; i < _this3.stage.children.length; i++) {
            var sprite = _this3.stage.children[i];
            interpolateSprite(sprite);
          }
        })();
      }

      //Render the stage. If the sprite positions have been
      //interpolated, those position values will be used to render the
      //sprite
      this.renderer.render(this.stage);

      //Restore the sprites' original x and y values if they've been
      //interpolated for this frame
      if (this.interpolate) {
        (function () {

          //A recursive function that restores the sprite's original,
          //uninterpolated x and y positions
          var restoreSpriteProperties = function restoreSpriteProperties(sprite) {
            if (_this3.properties.position) {
              sprite.x = sprite._currentX;
              sprite.y = sprite._currentY;
            }
            if (_this3.properties.rotation) {
              sprite.rotation = sprite._currentRotation;
            }
            if (_this3.properties.size) {

              //Only allow this for Sprites or Movie clips, to prevent
              //Container scaling bug
              if (sprite instanceof _this3.Sprite || sprite instanceof _this3.MovieClip) {
                sprite.width = sprite._currentWidth;
                sprite.height = sprite._currentHeight;
              }
            }
            if (_this3.properties.scale) {
              sprite.scale.x = sprite._currentScaleX;
              sprite.scale.y = sprite._currentScaleY;
            }
            if (_this3.properties.alpha) {
              sprite.alpha = sprite._currentAlpha;
            }
            if (_this3.properties.tile) {
              if (sprite.tilePosition !== undefined) {
                sprite.tilePosition.x = sprite._currentTilePositionX;
                sprite.tilePosition.y = sprite._currentTilePositionY;
              }
              if (sprite.tileScale !== undefined) {
                sprite.tileScale.x = sprite._currentTileScaleX;
                sprite.tileScale.y = sprite._currentTileScaleY;
              }
            }

            //Restore the sprite's children, if it has any
            if (sprite.children.length !== 0) {
              for (var i = 0; i < sprite.children.length; i++) {

                //Find the sprite's child
                var child = sprite.children[i];

                //Restore the child sprite properties
                restoreSpriteProperties(child);
              }
            }
          };
          for (var i = 0; i < _this3.stage.children.length; i++) {
            var sprite = _this3.stage.children[i];
            restoreSpriteProperties(sprite);
          }
        })();
      }
    }
  }, {
    key: "fps",
    get: function get() {
      return this._fps;
    },
    set: function set(value) {
      this._fps = value;
      this._frameDuration = 1000 / this._fps;
    }

    //renderFps

  }, {
    key: "renderFps",
    get: function get() {
      return this._renderFps;
    },
    set: function set(value) {
      this._renderFps = value;
      this._renderDuration = 1000 / this._renderFps;
    }

    //`dt` (Delta time, the `this._lagOffset` value in Smoothie's code)

  }, {
    key: "dt",
    get: function get() {
      return this._lagOffset;
    }
  }]);

  return Smoothie;
})();
//# sourceMappingURL=smoothie.js.map"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TileUtilities = (function () {
  function TileUtilities() {
    var renderingEngine = arguments.length <= 0 || arguments[0] === undefined ? PIXI : arguments[0];

    _classCallCheck(this, TileUtilities);

    if (renderingEngine === undefined) throw new Error("Please assign a rendering engine in the constructor before using bump.js");

    //Find out which rendering engine is being used (the default is Pixi)
    this.renderer = "";

    //If the `renderingEngine` is Pixi, set up Pixi object aliases
    if (renderingEngine.ParticleContainer && renderingEngine.Sprite) {
      this.renderingEngine = renderingEngine;
      this.renderer = "pixi";
      this.Container = this.renderingEngine.Container;
      this.TextureCache = this.renderingEngine.utils.TextureCache;
      this.Texture = this.renderingEngine.Texture;
      this.Sprite = this.renderingEngine.Sprite;
      this.Rectangle = this.renderingEngine.Rectangle;
      this.Graphics = this.renderingEngine.Graphics;
      this.loader = this.renderingEngine.loader;
      this.resources = this.renderingEngine.loader.resources;
    }
  }

  //Make a texture from a frame in another texture or image

  _createClass(TileUtilities, [{
    key: "frame",
    value: function frame(source, x, y, width, height) {

      var texture = undefined,
          imageFrame = undefined;

      //If the source is a string, it's either a texture in the
      //cache or an image file
      if (typeof source === "string") {
        if (this.TextureCache[source]) {
          texture = new this.Texture(this.TextureCache[source]);
        }
      }

      //If the `source` is a texture,  use it
      else if (source instanceof this.Texture) {
          texture = new this.Texture(source);
        }
      if (!texture) {
        throw new Error("Please load the " + source + " texture into the cache.");
      } else {

        //Make a rectangle the size of the sub-image
        imageFrame = new this.Rectangle(x, y, width, height);
        texture.frame = imageFrame;
        return texture;
      }
    }

    //#### getIndex
    //The `getIndex` helper method
    //converts a sprite's x and y position to an array index number.
    //It returns a single index value that tells you the map array
    //index number that the sprite is in

  }, {
    key: "getIndex",
    value: function getIndex(x, y, tilewidth, tileheight, mapWidthInTiles) {
      var index = {};

      //Convert pixel coordinates to map index coordinates
      index.x = Math.floor(x / tilewidth);
      index.y = Math.floor(y / tileheight);

      //Return the index number
      return index.x + index.y * mapWidthInTiles;
    }

    /*
    #### getTile
    The `getTile` helper method
    converts a tile's index number into x/y screen
    coordinates, and capture's the tile's grid index (`gid`) number.
    It returns an object with `x`, `y`, `centerX`, `centerY`, `width`, `height`, `halfWidth`
    `halffHeight` and `gid` properties. (The `gid` number is the value that the tile has in the
    mapArray) This lets you use the returned object
    with the 2d geometric collision functions like `hitTestRectangle`
    or `rectangleCollision`
     The `world` object requires these properties:
    `x`, `y`, `tilewidth`, `tileheight` and `widthInTiles`
    */

  }, {
    key: "getTile",
    value: function getTile(index, mapArray, world) {
      var tile = {};
      tile.gid = mapArray[index];
      tile.width = world.tilewidth;
      tile.height = world.tileheight;
      tile.halfWidth = world.tilewidth / 2;
      tile.halfHeight = world.tileheight / 2;
      tile.x = index % world.widthInTiles * world.tilewidth + world.x;
      tile.y = Math.floor(index / world.widthInTiles) * world.tileheight + world.y;
      tile.gx = tile.x;
      tile.gy = tile.y;
      tile.centerX = tile.x + world.tilewidth / 2;
      tile.centery = tile.y + world.tileheight / 2;

      //Return the tile object
      return tile;
    }

    /*
    #### surroundingCells
    The `surroundingCells` helper method returns an array containing 9
    index numbers of map array cells around any given index number.
    Use it for an efficient broadphase/narrowphase collision test.
    The 2 arguments are the index number that represents the center cell,
    and the width of the map array.
    */

  }, {
    key: "surroundingCells",
    value: function surroundingCells(index, widthInTiles) {
      return [index - widthInTiles - 1, index - widthInTiles, index - widthInTiles + 1, index - 1, index, index + 1, index + widthInTiles - 1, index + widthInTiles, index + widthInTiles + 1];
    }

    //#### getPoints
    /*
    The `getPoints` method takes a sprite and returns
    an object that tells you what all its corner points are. The return
    object has four properties, each of which is an object with `x` and `y` properties:
     - `topLeft`: `x` and `y` properties describing the top left corner
    point.
    - `topRight`: `x` and `y` properties describing the top right corner
    point.
    - `bottomLeft`: `x` and `y` properties describing the bottom left corner
    point.
    - `bottomRight`: `x` and `y` properties describing the bottom right corner
    point.
     If the sprite has a `collisionArea` property that defines a
    smaller rectangular area inside the sprite, that collision
    area can be used instead for collisions instead of the sprite's dimensions. Here's
    How you could define a `collsionArea` on a sprite called `elf`:
    ```js
    elf.collisionArea = {x: 22, y: 44, width: 20, height: 20};
    ```
    Here's how you could use the `getPoints` method to find all the collision area's corner points.
    ```js
    let cornerPoints = tu.getPoints(elf.collisionArea);
    ```
    */

  }, {
    key: "getPoints",
    value: function getPoints(s) {
      var ca = s.collisionArea;
      if (ca !== undefined) {
        return {
          topLeft: {
            x: s.x + ca.x,
            y: s.y + ca.y
          },
          topRight: {
            x: s.x + ca.x + ca.width,
            y: s.y + ca.y
          },
          bottomLeft: {
            x: s.x + ca.x,
            y: s.y + ca.y + ca.height
          },
          bottomRight: {
            x: s.x + ca.x + ca.width,
            y: s.y + ca.y + ca.height
          }
        };
      } else {
        return {
          topLeft: {
            x: s.x,
            y: s.y
          },
          topRight: {
            x: s.x + s.width - 1,
            y: s.y
          },
          bottomLeft: {
            x: s.x,
            y: s.y + s.height - 1
          },
          bottomRight: {
            x: s.x + s.width - 1,
            y: s.y + s.height - 1
          }
        };
      }
    }

    //### hitTestTile
    /*
    `hitTestTile` checks for a
    collision between a sprite and a tile in any map array that you
    specify. It returns a `collision` object.
    `collision.hit` is a Boolean that tells you if a sprite is colliding
    with the tile that you're checking. `collision.index` tells you the
    map array's index number of the colliding sprite. You can check for
    a collision with the tile against "every" corner point on the
    sprite, "some" corner points, or the sprite's "center" point.
    `hitTestTile` arguments:
    sprite, array, collisionTileGridIdNumber, worldObject, spritesPointsToCheck
    ```js
    tu.hitTestTile(sprite, array, collisioGid, world, pointsToCheck);
    ```
    The `world` object (the 4th argument) has to have these properties:
    `tileheight`, `tilewidth`, `widthInTiles`.
    Here's how you could use  `hitTestTile` to check for a collision between a sprite
    called `alien` and an array of wall sprites with map gid numbers of 0.
    ```js
    let alienVsFloor = g.hitTestTile(alien, wallMapArray, 0, world, "every");
    ```
    */

  }, {
    key: "hitTestTile",
    value: function hitTestTile(sprite, mapArray, gidToCheck, world, pointsToCheck) {
      var _this = this;

      //The `checkPoints` helper function Loop through the sprite's corner points to
      //find out if they are inside an array cell that you're interested in.
      //Return `true` if they are
      var checkPoints = function checkPoints(key) {

        //Get a reference to the current point to check.
        //(`topLeft`, `topRight`, `bottomLeft` or `bottomRight` )
        var point = sprite.collisionPoints[key];

        //Find the point's index number in the map array
        collision.index = _this.getIndex(point.x, point.y, world.tilewidth, world.tileheight, world.widthInTiles);

        //Find out what the gid value is in the map position
        //that the point is currently over
        collision.gid = mapArray[collision.index];

        //If it matches the value of the gid that we're interested, in
        //then there's been a collision
        if (collision.gid === gidToCheck) {
          return true;
        } else {
          return false;
        }
      };

      //Assign "some" as the default value for `pointsToCheck`
      pointsToCheck = pointsToCheck || "some";

      //The collision object that will be returned by this function
      var collision = {};

      //Which points do you want to check?
      //"every", "some" or "center"?
      switch (pointsToCheck) {
        case "center":

          //`hit` will be true only if the center point is touching
          var point = {
            center: {
              x: sprite.centerX,
              y: sprite.centerY
            }
          };
          sprite.collisionPoints = point;
          collision.hit = Object.keys(sprite.collisionPoints).some(checkPoints);
          break;
        case "every":

          //`hit` will be true if every point is touching
          sprite.collisionPoints = this.getPoints(sprite);
          collision.hit = Object.keys(sprite.collisionPoints).every(checkPoints);
          break;
        case "some":

          //`hit` will be true only if some points are touching
          sprite.collisionPoints = this.getPoints(sprite);
          collision.hit = Object.keys(sprite.collisionPoints).some(checkPoints);
          break;
      }

      //Return the collision object.
      //`collision.hit` will be true if a collision is detected.
      //`collision.index` tells you the map array index number where the
      //collision occured
      return collision;
    }

    //### updateMap
    /*
    `updateMap` takes a map array and adds a sprite's grid index number (`gid`) to it. 
    It finds the sprite's new index position, and retuns the new map array.
    You can use it to do very efficient collision detection in tile based game worlds.
    `updateMap` arguments:
    array, singleSpriteOrArrayOfSprites, worldObject
    The `world` object (the 4th argument) has to have these properties:
    `tileheight`, `tilewidth`, `widthInTiles`.
    The sprite objects have to have have these properties:
    `centerX`, `centerY`, `index`, `gid` (The number in the array that represpents the sprite)
    Here's an example of how you could use `updateMap` in your game code like this:
    
        blockLayer.data = updateMap(blockLayer.data, blockLayer.children, world);
     The `blockLayer.data` array would now contain the new index position numbers of all the 
    child sprites on that layer.
    */

  }, {
    key: "updateMap",
    value: function updateMap(mapArray, spritesToUpdate, world) {
      var _this2 = this;

      //First create a map a new array filled with zeros.
      //The new map array will be exactly the same size as the original
      var newMapArray = mapArray.map(function (gid) {
        gid = 0;
        return gid;
      });

      //Is `spriteToUpdate` an array of sprites?
      if (spritesToUpdate instanceof Array) {
        (function () {

          //Get the index number of each sprite in the `spritesToUpdate` array
          //and add the sprite's `gid` to the matching index on the map
          var self = _this2;
          spritesToUpdate.forEach(function (sprite) {

            //Find the new index number
            sprite.index = self.getIndex(sprite.centerX, sprite.centerY, world.tilewidth, world.tileheight, world.widthInTiles);

            //Add the sprite's `gid` number to the correct index on the map
            newMapArray[sprite.index] = sprite.gid;
          });
        })();
      }

      //Is `spritesToUpdate` just a single sprite?
      else {
          var sprite = spritesToUpdate;
          //Find the new index number
          sprite.index = this.getIndex(sprite.centerX, sprite.centerY, world.tilewidth, world.tileheight, world.widthInTiles);

          //Add the sprite's `gid` number to the correct index on the map
          newMapArray[sprite.index] = sprite.gid;
        }

      //Return the new map array to replace the previous one
      return newMapArray;
    }

    /*
    ###makeTiledWorld
     `makeTiledWorld` is a quick and easy way to display a game world designed in
    Tiled Editor. Supply `makeTiledWorld` with 2 **string arguments**: 
    
    1. A JSON file generated by Tiled Editor. 
    2. A source image that represents the tile set you used to create the Tiled Editor world.
    ```js
    let world = makeTiledWorld("tiledEditorMapData.json", "tileset.png");
    ```
    (Note: `makeTiledWorld` looks for the JSON data file in Pixi's `loader.resources` object. So, 
    make sure you've loaded the JSON file using Pixi's `loader`.)
     `makeTiledWorld` will return a Pixi `Container` that contains all the things in your Tiled Editor
    map as Pixi sprites.
     All the image tiles you create in Tiled Editor are automatically converted into Pixi sprites
    for you by `makeTiledWorld`. You can access all of them using two methods: `getObject` (for
    single sprites) and `getObjects` (with an "s") for multiple sprites. Let's find out how they work.
    
    ####world.getObject
     Tile Editor lets you assign a "name" properties any object.
    You can access any sprite by this name using the `getObject` method. `getObject` searches for and
    returns a sprite in the `world` that has the same `name` property that you assigned
    in Tiled Editor. Here's how to use `getObject` to look for an object called "alien"
    in the Tiled map data and assign it to a variable called `alien`
    ```js  
    let alien = world.getObject("alien");  
    ```
    `alien` is now an ordinary Pixi sprite that you can control just like any other Pixi
    sprite in your games.
     #### Creating sprites from generic objects
     Tiled Editor lets you create generic objects. These are objects that don't have images associated
    with them. Generic objects are handy to use, because they let you create complex game objects inside
    Tiled Editor, as pure data. You can then use that data your game code to build complex game objects.
     For example, imagine that you want to create a complex animated walking sprite called "elf".
    First, create the elf object in Tiled Editor as a generic object, but don't assign any image tiles
    to it. Next, in your game code, create a new Pixi MovieClip called `elf` and give it any textures you want
    to use for its animation states.
    ```js
    //Create a new Pixi MovieClip sprite
    let elf = new PIXI.MovieClip(elfSpriteTextures);
    ```
    Then use the `x` and `y` data from the generic "elf" object you created in Tiled Editor to position the 
    `elf` sprite.
    ```js
    elf.x = world.getObject("elf").x;
    elf.y = world.getObject("elf").y;
    ```
    This is a simple example, but you could make very complex data objects in Tiled Editor and 
    use them to build complex sprites in the same way.
     ####Accessing Tiled Editor layer groups 
    
    Tiled Editor lets you create **layer groups**. Each layer group you create
    in Tiled Editor is automatically converted by `makeTiledWorld` into a Pixi `Container`
    object. You can access those containers using `getObject` to extract the layer group
    container. 
     Here's how you could extract the layer group called "objects" and add the 
    `elf` sprite to it.
    ```js
    let objectsLayer = world.getObject("objects");
    objectsLayer.addChild(elf);
    ```
    If you want to add the sprite to a different world layer, you can do it like this:
    ```js
    world.getObject("treeTops").addChild(elf);
    ```
    If you want to access all the sprites in a specific Tiled Editor layer, just supply
    `getObject` with the name of the layer. For example, if the layer name is "items", you
    can access it like this:
    ```js
    let itemsLayer = world.getObject("items");
    ```
    `itemsLayer` is now a Pixi container with a `children` array that contains all the sprites
    on that layer.  
     To be safe, clone this array to create a new version
    that doesn't point to the original data file:
    ```js
    items = itemsLayer.children.slice(0);  
    ```
    You can now manipulate the `items` array freely without worrying about changing
    the original array. This can possibly help prevent some weird bugs in a complex game.
     ###Finding the "gid" values
     Tiled Editor uses "gid" numbers to identify different kinds of things in the world.
    If you ever need to extract sprites with specific `gid` numbers in a 
    layer that contains different kinds of things, you can do it like this:
    ```js
    let items = itemsLayer.children.map(sprite => {
      if (sprite.gid !== 0) return sprite; 
    });
    ```
    Every sprite created by `makeTiledWorld` has a `gid` property with a value that matches its
    Tiled Editor "gid" value.
     ####Accessing a layer's "data" array
     Tiled Editor's layers have a `data` property
    that is an array containing all the grid index numbers (`gid`) of
    the tiles in that array. Imagine that you've got a layer full of similar
    tiles representing the walls in a game. How do you access the array
    containing all the "gid" numbers of the wall sprites in that layer? If the layer's name is called "wallLayer", you 
    can access the `wallLayer`'s `data` array of sprites like this: 
    ```js
    wallMapArray = world.getObject("wallLayer").data;
    ```
    `wallMapArray` is now an array of "gid" numbers referring to all the sprites on that
    layer. You can now use this data for collision detection, or doing any other kind
    of world building.
     ###world.getObjects
     There's another method called `getObjects` (with an "s"!) that lets you extract
    an array of sprites from the Tiled Editor data. Imagine that you created three
    game objects in Tiled Editor called "marmot", "skull" and "heart". `makeTiledWorld`
    automatically turns them into sprites, and you can access
    all of them as array of sprites using `getObjects` like this:
    ```js
    let gameItemsArray = world.getObjects("marmot", "skull", "heart");
    ```
    */

  }, {
    key: "makeTiledWorld",
    value: function makeTiledWorld(jsonTiledMap, tileset) {
      var _this3 = this;

      //Create a group called `world` to contain all the layers, sprites
      //and objects from the `tiledMap`. The `world` object is going to be
      //returned to the main game program
      var tiledMap = PIXI.loader.resources[jsonTiledMap].data;
      var world = new this.Container();

      world.tileheight = tiledMap.tileheight;
      world.tilewidth = tiledMap.tilewidth;

      //Calculate the `width` and `height` of the world, in pixels
      world.worldWidth = tiledMap.width * tiledMap.tilewidth;
      world.worldHeight = tiledMap.height * tiledMap.tileheight;

      //Get a reference to the world's height and width in
      //tiles, in case you need to know this later (you will!)
      world.widthInTiles = tiledMap.width;
      world.heightInTiles = tiledMap.height;

      //Create an `objects` array to store references to any
      //named objects in the map. Named objects all have
      //a `name` property that was assigned in Tiled Editor
      world.objects = [];

      //The optional spacing (padding) around each tile
      //This is to account for spacing around tiles
      //that's commonly used with texture atlas tilesets. Set the
      //`spacing` property when you create a new map in Tiled Editor
      var spacing = tiledMap.tilesets[0].spacing;

      //Figure out how many columns there are on the tileset.
      //This is the width of the image, divided by the width
      //of each tile, plus any optional spacing thats around each tile
      var numberOfTilesetColumns = Math.floor(tiledMap.tilesets[0].imagewidth / (tiledMap.tilewidth + spacing));

      //Loop through all the map layers
      tiledMap.layers.forEach(function (tiledLayer) {

        //Make a group for this layer and copy
        //all of the layer properties onto it.
        var layerGroup = new _this3.Container();

        Object.keys(tiledLayer).forEach(function (key) {
          //Add all the layer's properties to the group, except the
          //width and height (because the group will work those our for
          //itself based on its content).
          if (key !== "width" && key !== "height") {
            layerGroup[key] = tiledLayer[key];
          }
        });

        //Set the width and height of the layer to
        //the `world`'s width and height
        //layerGroup.width = world.width;
        //layerGroup.height = world.height;

        //Translate `opacity` to `alpha`
        layerGroup.alpha = tiledLayer.opacity;

        //Add the group to the `world`
        world.addChild(layerGroup);

        //Push the group into the world's `objects` array
        //So you can access it later
        world.objects.push(layerGroup);

        //Is this current layer a `tilelayer`?
        if (tiledLayer.type === "tilelayer") {

          //Loop through the `data` array of this layer
          tiledLayer.data.forEach(function (gid, index) {
            var tileSprite = undefined,
                texture = undefined,
                mapX = undefined,
                mapY = undefined,
                tilesetX = undefined,
                tilesetY = undefined,
                mapColumn = undefined,
                mapRow = undefined,
                tilesetColumn = undefined,
                tilesetRow = undefined;

            //If the grid id number (`gid`) isn't zero, create a sprite
            if (gid !== 0) {
              (function () {

                //Figure out the map column and row number that we're on, and then
                //calculate the grid cell's x and y pixel position.
                mapColumn = index % world.widthInTiles;
                mapRow = Math.floor(index / world.widthInTiles);
                mapX = mapColumn * world.tilewidth;
                mapY = mapRow * world.tileheight;

                //Figure out the column and row number that the tileset
                //image is on, and then use those values to calculate
                //the x and y pixel position of the image on the tileset
                tilesetColumn = (gid - 1) % numberOfTilesetColumns;
                tilesetRow = Math.floor((gid - 1) / numberOfTilesetColumns);
                tilesetX = tilesetColumn * world.tilewidth;
                tilesetY = tilesetRow * world.tileheight;

                //Compensate for any optional spacing (padding) around the tiles if
                //there is any. This bit of code accumlates the spacing offsets from the
                //left side of the tileset and adds them to the current tile's position
                if (spacing > 0) {
                  tilesetX += spacing + spacing * ((gid - 1) % numberOfTilesetColumns);
                  tilesetY += spacing + spacing * Math.floor((gid - 1) / numberOfTilesetColumns);
                }

                //Use the above values to create the sprite's image from
                //the tileset image
                texture = _this3.frame(tileset, tilesetX, tilesetY, world.tilewidth, world.tileheight);

                //I've dedcided that any tiles that have a `name` property are important
                //and should be accessible in the `world.objects` array.

                var tileproperties = tiledMap.tilesets[0].tileproperties,
                    key = String(gid - 1);

                //If the JSON `tileproperties` object has a sub-object that
                //matches the current tile, and that sub-object has a `name` property,
                //then create a sprite and assign the tile properties onto
                //the sprite
                if (tileproperties[key] && tileproperties[key].name) {

                  //Make a sprite
                  tileSprite = new _this3.Sprite(texture);

                  //Copy all of the tile's properties onto the sprite
                  //(This includes the `name` property)
                  Object.keys(tileproperties[key]).forEach(function (property) {

                    //console.log(tileproperties[key][property])
                    tileSprite[property] = tileproperties[key][property];
                  });

                  //Push the sprite into the world's `objects` array
                  //so that you can access it by `name` later
                  world.objects.push(tileSprite);
                }

                //If the tile doesn't have a `name` property, just use it to
                //create an ordinary sprite (it will only need one texture)
                else {
                    tileSprite = new _this3.Sprite(texture);
                  }

                //Position the sprite on the map
                tileSprite.x = mapX;
                tileSprite.y = mapY;

                //Make a record of the sprite's index number in the array
                //(We'll use this for collision detection later)
                tileSprite.index = index;

                //Make a record of the sprite's `gid` on the tileset.
                //This will also be useful for collision detection later
                tileSprite.gid = gid;

                //Add the sprite to the current layer group
                layerGroup.addChild(tileSprite);
              })();
            }
          });
        }

        //Is this layer an `objectgroup`?
        if (tiledLayer.type === "objectgroup") {
          tiledLayer.objects.forEach(function (object) {

            //We're just going to capture the object's properties
            //so that we can decide what to do with it later

            //Get a reference to the layer group the object is in
            object.group = layerGroup;

            //Because this is an object layer, it doesn't contain any
            //sprites, just data object. That means it won't be able to
            //calucalte its own height and width. To help it out, give
            //the `layerGroup` the same `width` and `height` as the `world`
            //layerGroup.width = world.width;
            //layerGroup.height = world.height;

            //Push the object into the world's `objects` array
            world.objects.push(object);
          });
        }
      });

      //Search functions
      //`world.getObject` and `world.getObjects`  search for and return
      //any sprites or objects in the `world.objects` array.
      //Any object that has a `name` propery in
      //Tiled Editor will show up in a search.
      //`getObject` gives you a single object, `getObjects` gives you an array
      //of objects.
      //`getObject` returns the actual search function, so you
      //can use the following format to directly access a single object:
      //sprite.x = world.getObject("anySprite").x;
      //sprite.y = world.getObject("anySprite").y;

      world.getObject = function (objectName) {
        var searchForObject = function searchForObject() {
          var foundObject = undefined;
          world.objects.some(function (object) {
            if (object.name && object.name === objectName) {
              foundObject = object;
              return true;
            }
          });
          if (foundObject) {
            return foundObject;
          } else {
            throw new Error("There is no object with the property name: " + objectName);
          }
        };

        //Return the search function
        return searchForObject();
      };

      world.getObjects = function (objectNames) {
        var foundObjects = [];
        world.objects.forEach(function (object) {
          if (object.name && objectNames.indexOf(object.name) !== -1) {
            foundObjects.push(object);
          }
        });
        if (foundObjects.length > 0) {
          return foundObjects;
        } else {
          throw new Error("I could not find those objects");
        }
        return foundObjects;
      };

      //That's it, we're done!
      //Finally, return the `world` object back to the game program
      return world;
    }

    /* Isometric tile utilities */

    /*
    ### byDepth
    And array `sort` function that depth-sorts sprites according to
    their `z` properties
    */

  }, {
    key: "byDepth",
    value: function byDepth(a, b) {
      //Calculate the depths of `a` and `b`
      //(add `1` to `a.z` and `b.x` to avoid multiplying by 0)
      a.depth = (a.cartX + a.cartY) * (a.z + 1);
      b.depth = (b.cartX + b.cartY) * (b.z + 1);

      //Move sprites with a lower depth to a higher position in the array
      if (a.depth < b.depth) {
        return -1;
      } else if (a.depth > b.depth) {
        return 1;
      } else {
        return 0;
      }
    }

    /*
    ### hitTestIsoTile
    Same API as `hitTestTile`, except that it works with isometric sprites.
    Make sure that your `world` object has properties called
    `cartTileWidth` and `cartTileHeight` that define the Cartesian with and 
    height of your tile cells, in pixels.
     */

  }, {
    key: "hitTestIsoTile",
    value: function hitTestIsoTile(sprite, mapArray, gidToCheck, world, pointsToCheck) {
      var _this4 = this;

      //The `checkPoints` helper function Loop through the sprite's corner points to
      //find out if they are inside an array cell that you're interested in.
      //Return `true` if they are
      var checkPoints = function checkPoints(key) {

        //Get a reference to the current point to check.
        //(`topLeft`, `topRight`, `bottomLeft` or `bottomRight` )
        var point = sprite.collisionPoints[key];

        //Find the point's index number in the map array
        collision.index = _this4.getIndex(point.x, point.y, world.cartTilewidth, world.cartTileheight, world.widthInTiles);

        //Find out what the gid value is in the map position
        //that the point is currently over
        collision.gid = mapArray[collision.index];

        //If it matches the value of the gid that we're interested, in
        //then there's been a collision
        if (collision.gid === gidToCheck) {
          return true;
        } else {
          return false;
        }
      };

      //Assign "some" as the default value for `pointsToCheck`
      pointsToCheck = pointsToCheck || "some";

      //The collision object that will be returned by this function
      var collision = {};

      //Which points do you want to check?
      //"every", "some" or "center"?
      switch (pointsToCheck) {
        case "center":

          //`hit` will be true only if the center point is touching
          var point = {
            center: {
              //x: sprite.centerX,
              //y: sprite.centerY
              x: s.cartX + ca.x + ca.width / 2,
              y: s.cartY + ca.y + ca.height / 2
            }
          };
          sprite.collisionPoints = point;
          collision.hit = Object.keys(sprite.collisionPoints).some(checkPoints);
          break;
        case "every":

          //`hit` will be true if every point is touching
          sprite.collisionPoints = this.getIsoPoints(sprite);
          collision.hit = Object.keys(sprite.collisionPoints).every(checkPoints);
          break;
        case "some":

          //`hit` will be true only if some points are touching
          sprite.collisionPoints = this.getIsoPoints(sprite);
          collision.hit = Object.keys(sprite.collisionPoints).some(checkPoints);
          break;
      }

      //Return the collision object.
      //`collision.hit` will be true if a collision is detected.
      //`collision.index` tells you the map array index number where the
      //collision occured
      return collision;
    }

    /*
    ### getIsoPoints
    The isomertic version of `getPoints`
    */

  }, {
    key: "getIsoPoints",
    value: function getIsoPoints(s) {
      var ca = s.collisionArea;
      if (ca !== undefined) {
        return {
          topLeft: {
            x: s.cartX + ca.x,
            y: s.cartY + ca.y
          },
          topRight: {
            x: s.cartX + ca.x + ca.width,
            y: s.cartY + ca.y
          },
          bottomLeft: {
            x: s.cartX + ca.x,
            y: s.cartY + ca.y + ca.height
          },
          bottomRight: {
            x: s.cartX + ca.x + ca.width,
            y: s.cartY + ca.y + ca.height
          }
        };
      } else {
        return {
          topLeft: {
            x: s.cartX,
            y: s.cartY
          },
          topRight: {
            x: s.cartX + s.cartWidth - 1,
            y: s.cartY
          },
          bottomLeft: {
            x: s.cartX,
            y: s.cartY + s.cartHeight - 1
          },
          bottomRight: {
            x: s.cartX + s.cartWidth - 1,
            y: s.cartY + s.cartHeight - 1
          }
        };
      }
    }

    /*
    ### makeIsoPointer
    Used to add a isometric properties to any mouse/touch `pointer` object with 
    `x` and `y` properties. Supply `makeIsoPointer` with the pointer object and
    the isometric `world` object 
    */

    //Create some useful properties on the pointer

  }, {
    key: "makeIsoPointer",
    value: function makeIsoPointer(pointer, world) {
      Object.defineProperties(pointer, {

        //The isometric's world's Cartesian coordiantes
        cartX: {
          get: function get() {
            var x = (2 * this.y + this.x - (2 * world.y + world.x)) / 2 - world.cartTilewidth / 2;

            return x;
          },

          enumerable: true,
          configurable: true
        },
        cartY: {
          get: function get() {
            var y = (2 * this.y - this.x - (2 * world.y - world.x)) / 2 + world.cartTileheight / 2;

            return y;
          },

          enumerable: true,
          configurable: true
        },

        //The tile's column and row in the array
        column: {
          get: function get() {
            return Math.floor(this.cartX / world.cartTilewidth);
          },

          enumerable: true,
          configurable: true
        },
        row: {
          get: function get() {
            return Math.floor(this.cartY / world.cartTileheight);
          },

          enumerable: true,
          configurable: true
        },

        //The tile's index number in the array
        index: {
          get: function get() {
            var index = {};

            //Convert pixel coordinates to map index coordinates
            index.x = Math.floor(this.cartX / world.cartTilewidth);
            index.y = Math.floor(this.cartY / world.cartTileheight);

            //Return the index number
            return index.x + index.y * world.widthInTiles;
          },

          enumerable: true,
          configurable: true
        }
      });
    }

    /*
    ### isoRectangle
    A function for creating a simple isometric diamond
    shaped rectangle using Pixi's graphics library
    */

  }, {
    key: "isoRectangle",
    value: function isoRectangle(width, height, fillStyle) {

      //Figure out the `halfHeight` value
      var halfHeight = height / 2;

      //Draw the flattened and rotated square (diamond shape)
      var rectangle = new this.Graphics();
      rectangle.beginFill(fillStyle);
      rectangle.moveTo(0, 0);
      rectangle.lineTo(width, halfHeight);
      rectangle.lineTo(0, height);
      rectangle.lineTo(-width, halfHeight);
      rectangle.lineTo(0, 0);
      rectangle.endFill();

      //Generate a texture from the rectangle
      var texture = rectangle.generateTexture();

      //Use the texture to create a sprite
      var sprite = new this.Sprite(texture);

      //Return it to the main program
      return sprite;
    }

    /*
    ### addIsoProperties
    Add properties to a sprite to help work between Cartesian
    and isometric properties: `isoX`, `isoY`, `cartX`, 
    `cartWidth` and `cartHeight`.
    */

  }, {
    key: "addIsoProperties",
    value: function addIsoProperties(sprite, x, y, width, height) {

      //Cartisian (flat 2D) properties
      sprite.cartX = x;
      sprite.cartY = y;
      sprite.cartWidth = width;
      sprite.cartHeight = height;

      //Add a getter/setter for the isometric properties
      Object.defineProperties(sprite, {
        isoX: {
          get: function get() {
            return this.cartX - this.cartY;
          },

          enumerable: true,
          configurable: true
        },
        isoY: {
          get: function get() {
            return (this.cartX + this.cartY) / 2;
          },

          enumerable: true,
          configurable: true
        }
      });
    }

    /*
    ### makeIsoTiledWorld
    Make an isometric world from TiledEditor map data. Uses the same API as `makeTiledWorld`
     */

  }, {
    key: "makeIsoTiledWorld",
    value: function makeIsoTiledWorld(jsonTiledMap, tileset) {
      var _this5 = this;

      //Create a group called `world` to contain all the layers, sprites
      //and objects from the `tiledMap`. The `world` object is going to be
      //returned to the main game program
      var tiledMap = PIXI.loader.resources[jsonTiledMap].data;

      //A. You need to add three custom properties to your Tiled Editor
      //map: `cartTilewidth`,`cartTileheight` and `tileDepth`. They define the Cartesian
      //dimesions of the tiles (32x32x64).
      //Check to make sure that these custom properties exist 
      if (!tiledMap.properties.cartTilewidth && !tiledMap.properties.cartTileheight && !tiledMao.properties.tileDepth) {
        throw new Error("Set custom cartTilewidth, cartTileheight and tileDepth map properties in Tiled Editor");
      }

      //Create the `world` container
      var world = new this.Container();

      //B. Set the `tileHeight` to the `tiledMap`'s `tileDepth` property
      //so that it matches the pixel height of the sprite tile image
      world.tileheight = parseInt(tiledMap.properties.tileDepth);
      world.tilewidth = tiledMap.tilewidth;

      //C. Define the Cartesian dimesions of each tile
      world.cartTileheight = parseInt(tiledMap.properties.cartTileheight);
      world.cartTilewidth = parseInt(tiledMap.properties.cartTilewidth);

      //D. Calculate the `width` and `height` of the world, in pixels
      //using the `world.cartTileHeight` and `world.cartTilewidth`
      //values
      world.worldWidth = tiledMap.width * world.cartTilewidth;
      world.worldHeight = tiledMap.height * world.cartTileheight;

      //Get a reference to the world's height and width in
      //tiles, in case you need to know this later (you will!)
      world.widthInTiles = tiledMap.width;
      world.heightInTiles = tiledMap.height;

      //Create an `objects` array to store references to any
      //named objects in the map. Named objects all have
      //a `name` property that was assigned in Tiled Editor
      world.objects = [];

      //The optional spacing (padding) around each tile
      //This is to account for spacing around tiles
      //that's commonly used with texture atlas tilesets. Set the
      //`spacing` property when you create a new map in Tiled Editor
      var spacing = tiledMap.tilesets[0].spacing;

      //Figure out how many columns there are on the tileset.
      //This is the width of the image, divided by the width
      //of each tile, plus any optional spacing thats around each tile
      var numberOfTilesetColumns = Math.floor(tiledMap.tilesets[0].imagewidth / (tiledMap.tilewidth + spacing));

      //E. A `z` property to help track which depth level the sprites are on
      var z = 0;

      //Loop through all the map layers
      tiledMap.layers.forEach(function (tiledLayer) {

        //Make a group for this layer and copy
        //all of the layer properties onto it.
        var layerGroup = new _this5.Container();

        Object.keys(tiledLayer).forEach(function (key) {
          //Add all the layer's properties to the group, except the
          //width and height (because the group will work those our for
          //itself based on its content).
          if (key !== "width" && key !== "height") {
            layerGroup[key] = tiledLayer[key];
          }
        });

        //Translate `opacity` to `alpha`
        layerGroup.alpha = tiledLayer.opacity;

        //Add the group to the `world`
        world.addChild(layerGroup);

        //Push the group into the world's `objects` array
        //So you can access it later
        world.objects.push(layerGroup);

        //Is this current layer a `tilelayer`?
        if (tiledLayer.type === "tilelayer") {

          //Loop through the `data` array of this layer
          tiledLayer.data.forEach(function (gid, index) {
            var tileSprite = undefined,
                texture = undefined,
                mapX = undefined,
                mapY = undefined,
                tilesetX = undefined,
                tilesetY = undefined,
                mapColumn = undefined,
                mapRow = undefined,
                tilesetColumn = undefined,
                tilesetRow = undefined;

            //If the grid id number (`gid`) isn't zero, create a sprite
            if (gid !== 0) {
              (function () {

                //Figure out the map column and row number that we're on, and then
                //calculate the grid cell's x and y pixel position.
                mapColumn = index % world.widthInTiles;
                mapRow = Math.floor(index / world.widthInTiles);

                //F. Use the Cartesian values to find the
                //`mapX` and `mapY` values
                mapX = mapColumn * world.cartTilewidth;
                mapY = mapRow * world.cartTileheight;

                //Figure out the column and row number that the tileset
                //image is on, and then use those values to calculate
                //the x and y pixel position of the image on the tileset
                tilesetColumn = (gid - 1) % numberOfTilesetColumns;
                tilesetRow = Math.floor((gid - 1) / numberOfTilesetColumns);
                tilesetX = tilesetColumn * world.tilewidth;
                tilesetY = tilesetRow * world.tileheight;

                //Compensate for any optional spacing (padding) around the tiles if
                //there is any. This bit of code accumlates the spacing offsets from the
                //left side of the tileset and adds them to the current tile's position
                if (spacing > 0) {
                  tilesetX += spacing + spacing * ((gid - 1) % numberOfTilesetColumns);
                  tilesetY += spacing + spacing * Math.floor((gid - 1) / numberOfTilesetColumns);
                }

                //Use the above values to create the sprite's image from
                //the tileset image
                texture = _this5.frame(tileset, tilesetX, tilesetY, world.tilewidth, world.tileheight);

                //I've dedcided that any tiles that have a `name` property are important
                //and should be accessible in the `world.objects` array.

                var tileproperties = tiledMap.tilesets[0].tileproperties,
                    key = String(gid - 1);

                //If the JSON `tileproperties` object has a sub-object that
                //matches the current tile, and that sub-object has a `name` property,
                //then create a sprite and assign the tile properties onto
                //the sprite
                if (tileproperties[key] && tileproperties[key].name) {

                  //Make a sprite
                  tileSprite = new _this5.Sprite(texture);

                  //Copy all of the tile's properties onto the sprite
                  //(This includes the `name` property)
                  Object.keys(tileproperties[key]).forEach(function (property) {

                    //console.log(tileproperties[key][property])
                    tileSprite[property] = tileproperties[key][property];
                  });

                  //Push the sprite into the world's `objects` array
                  //so that you can access it by `name` later
                  world.objects.push(tileSprite);
                }

                //If the tile doesn't have a `name` property, just use it to
                //create an ordinary sprite (it will only need one texture)
                else {
                    tileSprite = new _this5.Sprite(texture);
                  }

                //G. Add isometric properties to the sprite
                _this5.addIsoProperties(tileSprite, mapX, mapY, world.cartTilewidth, world.cartTileheight);

                //H. Use the isometric position to add the sprite to the world
                tileSprite.x = tileSprite.isoX;
                tileSprite.y = tileSprite.isoY;
                tileSprite.z = z;

                //Make a record of the sprite's index number in the array
                //(We'll use this for collision detection later)
                tileSprite.index = index;

                //Make a record of the sprite's `gid` on the tileset.
                //This will also be useful for collision detection later
                tileSprite.gid = gid;

                //Add the sprite to the current layer group
                layerGroup.addChild(tileSprite);
              })();
            }
          });
        }

        //Is this layer an `objectgroup`?
        if (tiledLayer.type === "objectgroup") {
          tiledLayer.objects.forEach(function (object) {

            //We're just going to capture the object's properties
            //so that we can decide what to do with it later

            //Get a reference to the layer group the object is in
            object.group = layerGroup;

            //Push the object into the world's `objects` array
            world.objects.push(object);
          });
        }

        //I. Add 1 to the z index (the first layer will have a z index of `1`)
        z += 1;
      });

      //Search functions
      //`world.getObject` and `world.getObjects`  search for and return
      //any sprites or objects in the `world.objects` array.
      //Any object that has a `name` propery in
      //Tiled Editor will show up in a search.
      //`getObject` gives you a single object, `getObjects` gives you an array
      //of objects.
      //`getObject` returns the actual search function, so you
      //can use the following format to directly access a single object:
      //sprite.x = world.getObject("anySprite").x;
      //sprite.y = world.getObject("anySprite").y;

      world.getObject = function (objectName) {
        var searchForObject = function searchForObject() {
          var foundObject = undefined;
          world.objects.some(function (object) {
            if (object.name && object.name === objectName) {
              foundObject = object;
              return true;
            }
          });
          if (foundObject) {
            return foundObject;
          } else {
            throw new Error("There is no object with the property name: " + objectName);
          }
        };

        //Return the search function
        return searchForObject();
      };

      world.getObjects = function (objectNames) {
        var foundObjects = [];
        world.objects.forEach(function (object) {
          if (object.name && objectNames.indexOf(object.name) !== -1) {
            foundObjects.push(object);
          }
        });
        if (foundObjects.length > 0) {
          return foundObjects;
        } else {
          throw new Error("I could not find those objects");
        }
        return foundObjects;
      };

      //That's it, we're done!
      //Finally, return the `world` object back to the game program
      return world;
    }

    /*
    //### The `shortestPath` function
    
    An A-Star search algorithm that returns an array of grid index numbers that
    represent the shortest path between two points on a map. Use it like this:
    
    let shortestPath = tu.shortestPath(
      startIndex,               //The start map index
      destinationIndex,         //The destination index
      mapArray,                 //The map array
      mapWidthInTiles,          //Map wdith, in tiles
      [1,2],                    //Obstacle gid array
      "manhattan"               //Heuristic to use: "manhatten", "euclidean" or "diagonal"
    );
      
    */

  }, {
    key: "shortestPath",
    value: function shortestPath(startIndex, destinationIndex, mapArray, mapWidthInTiles) {
      var obstacleGids = arguments.length <= 4 || arguments[4] === undefined ? [] : arguments[4];
      var heuristic = arguments.length <= 5 || arguments[5] === undefined ? "manhattan" : arguments[5];
      var useDiagonalNodes = arguments.length <= 6 || arguments[6] === undefined ? true : arguments[6];

      //The `nodes` function creates the array of node objects
      var nodes = function nodes(mapArray, mapWidthInTiles) {
        return mapArray.map(function (cell, index) {

          //Figure out the row and column of this cell
          var column = index % mapWidthInTiles;
          var row = Math.floor(index / mapWidthInTiles);

          //The node object
          return node = {
            f: 0,
            g: 0,
            h: 0,
            parent: null,
            column: column,
            row: row,
            index: index
          };
        });
      };

      //Initialize theShortestPath array
      var theShortestPath = [];

      //Initialize the node map
      var nodeMap = nodes(mapArray, mapWidthInTiles);

      //Initialize the closed and open list arrays
      var closedList = [];
      var openList = [];

      //Declare the "costs" of travelling in straight or
      //diagonal lines
      var straightCost = 10;
      var diagonalCost = 14;

      //Get the start node
      var startNode = nodeMap[startIndex];

      //Get the current center node. The first one will
      //match the path's start position
      var centerNode = startNode;

      //Push the `centerNode` into the `openList`, because
      //it's the first node that we're going to check
      openList.push(centerNode);

      //Get the current destination node. The first one will
      //match the path's end position
      var destinationNode = nodeMap[destinationIndex];

      //All the nodes that are surrounding the current map index number
      var surroundingNodes = function surroundingNodes(index, mapArray, mapWidthInTiles, useDiagonalNodes) {

        //Find out what all the surrounding nodes are, including those that
        //might be beyond the borders of the map
        var allSurroundingNodes = [nodeMap[index - mapWidthInTiles - 1], nodeMap[index - mapWidthInTiles], nodeMap[index - mapWidthInTiles + 1], nodeMap[index - 1], nodeMap[index + 1], nodeMap[index + mapWidthInTiles - 1], nodeMap[index + mapWidthInTiles], nodeMap[index + mapWidthInTiles + 1]];

        //Optionaly exlude the diagonal nodes, which is often perferable
        //for 2D maze games
        var crossSurroundingNodes = [nodeMap[index - mapWidthInTiles], nodeMap[index - 1], nodeMap[index + 1], nodeMap[index + mapWidthInTiles]];

        //Use either `allSurroundingNodes` or `crossSurroundingNodes` depending
        //on the the value of `useDiagonalNodes`
        var nodesToCheck = undefined;
        if (useDiagonalNodes) {
          nodesToCheck = allSurroundingNodes;
        } else {
          nodesToCheck = crossSurroundingNodes;
        }

        //Find the valid sourrounding nodes, which are ones inside
        //the map border that don't incldue obstacles. Change `allSurroundingNodes`
        //to `crossSurroundingNodes` to prevent the path from choosing diagonal routes
        var validSurroundingNodes = nodesToCheck.filter(function (node) {

          //The node will be beyond the top and bottom edges of the
          //map if it is `undefined`
          var nodeIsWithinTopAndBottomBounds = node !== undefined;

          //Only return nodes that are within the top and bottom map bounds
          if (nodeIsWithinTopAndBottomBounds) {

            //Some Boolean values that tell us whether the current map index is on
            //the left or right border of the map, and whether any of the nodes
            //surrounding that index extend beyond the left and right borders
            var indexIsOnLeftBorder = index % mapWidthInTiles === 0;
            var indexIsOnRightBorder = (index + 1) % mapWidthInTiles === 0;
            var nodeIsBeyondLeftBorder = node.column % (mapWidthInTiles - 1) === 0 && node.column !== 0;
            var nodeIsBeyondRightBorder = node.column % mapWidthInTiles === 0;

            //Find out whether of not the node contains an obstacle by looping
            //through the obstacle gids and and returning `true` if it
            //finds any at this node's location
            var nodeContainsAnObstacle = obstacleGids.some(function (obstacle) {
              return mapArray[node.index] === obstacle;
            });

            //If the index is on the left border and any nodes surrounding it are beyond the
            //left border, don't return that node
            if (indexIsOnLeftBorder) {
              //console.log("left border")
              return !nodeIsBeyondLeftBorder;
            }

            //If the index is on the right border and any nodes surrounding it are beyond the
            //right border, don't return that node
            else if (indexIsOnRightBorder) {
                //console.log("right border")
                return !nodeIsBeyondRightBorder;
              }

              //Return `true` if the node doesn't contain any obstacles
              else if (nodeContainsAnObstacle) {
                  return false;
                }

                //The index must be inside the area defined by the left and right borders,
                //so return the node
                else {
                    //console.log("map interior")
                    return true;
                  }
          }
        });

        //console.log(validSurroundingNodes)
        //Return the array of `validSurroundingNodes`
        return validSurroundingNodes;
      };

      //Diagnostic
      //console.log(nodeMap);
      //console.log(centerNode);
      //console.log(destinationNode);
      //console.log(wallMapArray);
      //console.log(surroundingNodes(86, mapArray, mapWidthInTiles));

      //Heuristic methods
      //1. Manhattan
      var manhattan = function manhattan(testNode, destinationNode) {
        var h = Math.abs(testNode.row - destinationNode.row) * straightCost + Math.abs(testNode.column - destinationNode.column) * straightCost;
        return h;
      };

      //2. Euclidean
      var euclidean = function euclidean(testNode, destinationNode) {
        var vx = destinationNode.column - testNode.column,
            vy = destinationNode.row - testNode.row,
            h = Math.floor(Math.sqrt(vx * vx + vy * vy) * straightCost);
        return h;
      };

      //3. Diagonal
      var diagonal = function diagonal(testNode, destinationNode) {
        var vx = Math.abs(destinationNode.column - testNode.column),
            vy = Math.abs(destinationNode.row - testNode.row),
            h = 0;

        if (vx > vy) {
          h = Math.floor(diagonalCost * vy + straightCost * (vx - vy));
        } else {
          h = Math.floor(diagonalCost * vx + straightCost * (vy - vx));
        }
        return h;
      };

      //Loop through all the nodes until the current `centerNode` matches the
      //`destinationNode`. When they they're the same we know we've reached the
      //end of the path
      while (centerNode !== destinationNode) {

        //Find all the nodes surrounding the current `centerNode`
        var surroundingTestNodes = surroundingNodes(centerNode.index, mapArray, mapWidthInTiles, useDiagonalNodes);

        //Loop through all the `surroundingTestNodes` using a classic `for` loop
        //(A `for` loop gives us a marginal performance boost)

        var _loop = function _loop(i) {

          //Get a reference to the current test node
          var testNode = surroundingTestNodes[i];

          //Find out whether the node is on a straight axis or
          //a diagonal axis, and assign the appropriate cost

          //A. Declare the cost variable
          var cost = 0;

          //B. Do they occupy the same row or column?
          if (centerNode.row === testNode.row || centerNode.column === testNode.column) {

            //If they do, assign a cost of "10"
            cost = straightCost;
          } else {

            //Otherwise, assign a cost of "14"
            cost = diagonalCost;
          }

          //C. Calculate the costs (g, h and f)
          //The node's current cost
          var g = centerNode.g + cost;

          //The cost of travelling from this node to the
          //destination node (the heuristic)
          var h = undefined;
          switch (heuristic) {
            case "manhattan":
              h = manhattan(testNode, destinationNode);
              break;

            case "euclidean":
              h = euclidean(testNode, destinationNode);
              break;

            case "diagonal":
              h = diagonal(testNode, destinationNode);
              break;

            default:
              throw new Error("Oops! It looks like you misspelled the name of the heuristic");
          }

          //The final cost
          var f = g + h;

          //Find out if the testNode is in either
          //the openList or closedList array
          var isOnOpenList = openList.some(function (node) {
            return testNode === node;
          });
          var isOnClosedList = closedList.some(function (node) {
            return testNode === node;
          });

          //If it's on either of these lists, we can check
          //whether this route is a lower-cost alternative
          //to the previous cost calculation. The new G cost
          //will make the difference to the final F cost
          if (isOnOpenList || isOnClosedList) {
            if (testNode.f > f) {
              testNode.f = f;
              testNode.g = g;
              testNode.h = h;

              //Only change the parent if the new cost is lower
              testNode.parent = centerNode;
            }
          }

          //Otherwise, add the testNode to the open list
          else {
              testNode.f = f;
              testNode.g = g;
              testNode.h = h;
              testNode.parent = centerNode;
              openList.push(testNode);
            }

          //The `for` loop ends here
        };

        for (var i = 0; i < surroundingTestNodes.length; i++) {
          _loop(i);
        }

        //Push the current centerNode into the closed list
        closedList.push(centerNode);

        //Quit the loop if there's nothing on the open list.
        //This means that there is no path to the destination or the
        //destination is invalid, like a wall tile
        if (openList.length === 0) {

          return theShortestPath;
        }

        //Sort the open list according to final cost
        openList = openList.sort(function (a, b) {
          return a.f - b.f;
        });

        //Set the node with the lowest final cost as the new centerNode
        centerNode = openList.shift();

        //The `while` loop ends here
      }

      //Now that we have all the candidates, let's find the shortest path!
      if (openList.length !== 0) {

        //Start with the destination node
        var _testNode = destinationNode;
        theShortestPath.push(_testNode);

        //Work backwards through the node parents
        //until the start node is found
        while (_testNode !== startNode) {

          //Step through the parents of each node,
          //starting with the destination node and ending with the start node
          _testNode = _testNode.parent;

          //Add the node to the beginning of the array
          theShortestPath.unshift(_testNode);

          //...and then loop again to the next node's parent till you
          //reach the end of the path
        }
      }

      //Return an array of nodes that link together to form
      //the shortest path
      return theShortestPath;
    }

    /*
    ### tileBasedLineOfSight
     Use the `tileBasedLineOfSight` function to find out whether two sprites
    are visible to each other inside a tile based maze environment.
     */

  }, {
    key: "tileBasedLineOfSight",
    value: function tileBasedLineOfSight(spriteOne, //The first sprite, with `centerX` and `centerY` properties
    spriteTwo, //The second sprite, with `centerX` and `centerY` properties
    mapArray, //The tile map array
    world) //An array of angles to which you want to
    //restrict the line of sight
    {
      var emptyGid = arguments.length <= 4 || arguments[4] === undefined ? 0 : arguments[4];

      var _this6 = this;

      var segment = arguments.length <= 5 || arguments[5] === undefined ? 32 : arguments[5];
      var angles = arguments.length <= 6 || arguments[6] === undefined ? [] : arguments[6];

      //Plot a vector between spriteTwo and spriteOne
      var vx = spriteTwo.centerX - spriteOne.centerX,
          vy = spriteTwo.centerY - spriteOne.centerY;

      //Find the vector's magnitude (its length in pixels)
      var magnitude = Math.sqrt(vx * vx + vy * vy);

      //How many points will we need to test?
      var numberOfPoints = magnitude / segment;

      //Create an array of x/y points that
      //extends from `spriteOne` to `spriteTwo` 
      var points = function points() {

        //Initialize an array that is going to store all our points
        //along the vector
        var arrayOfPoints = [];

        //Create a point object for each segment of the vector and
        //store its x/y position as well as its index number on
        //the map array
        for (var i = 1; i <= numberOfPoints; i++) {

          //Calculate the new magnitude for this iteration of the loop
          var newMagnitude = segment * i;

          //Find the unit vector
          var dx = vx / magnitude,
              dy = vy / magnitude;

          //Use the unit vector and newMagnitude to figure out the x/y
          //position of the next point in this loop iteration
          var x = spriteOne.centerX + dx * newMagnitude,
              y = spriteOne.centerY + dy * newMagnitude;

          //The getIndex function converts x/y coordinates into
          //map array index positon numbers
          var getIndex = function getIndex(x, y, tilewidth, tileheight, mapWidthInTiles) {

            //Convert pixel coordinates to map index coordinates
            var index = {};
            index.x = Math.floor(x / tilewidth);
            index.y = Math.floor(y / tileheight);

            //Return the index number
            return index.x + index.y * mapWidthInTiles;
          };

          //Find the map index number that this x and y point corresponds to
          var index = _this6.getIndex(x, y, world.tilewidth, world.tileheight, world.widthInTiles);

          //Push the point into the `arrayOfPoints`
          arrayOfPoints.push({
            x: x, y: y, index: index
          });
        }

        //Return the array
        return arrayOfPoints;
      };

      //The tile-based collision test.
      //The `noObstacles` function will return `true` if all the tile
      //index numbers along the vector are `0`, which means they contain
      //no walls. If any of them aren't 0, then the function returns
      //`false` which means there's a wall in the way
      var noObstacles = points().every(function (point) {
        return mapArray[point.index] === emptyGid;
      });

      //Restrict the line of sight to right angles only (we don't want to
      //use diagonals)
      var validAngle = function validAngle() {

        //Find the angle of the vector between the two sprites
        var angle = Math.atan2(vy, vx) * 180 / Math.PI;

        //If the angle matches one of the valid angles, return
        //`true`, otherwise return `false`
        if (angles.length !== 0) {
          return angles.some(function (x) {
            return x === angle;
          });
        } else {
          return true;
        }
      };

      //Return `true` if there are no obstacles and the line of sight
      //is at a 90 degree angle
      if (noObstacles === true && validAngle() === true) {
        return true;
      } else {
        return false;
      }
    }

    /*
    surroundingCrossCells
    ---------------------
     Returns an array of index numbers matching the cells that are orthogonally 
    adjacent to the center `index` cell
     */

  }, {
    key: "surroundingCrossCells",
    value: function surroundingCrossCells(index, widthInTiles) {
      return [index - widthInTiles, index - 1, index + 1, index + widthInTiles];
    }

    /*
    surroundingDiagonalCells
    ---------------------
     Returns an array of index numbers matching the cells that touch the
    4 corners of the center the center `index` cell
     */

  }, {
    key: "surroundingDiagonalCells",
    value: function surroundingDiagonalCells(index, widthInTiles) {
      return [index - widthInTiles - 1, index - widthInTiles + 1, index + widthInTiles - 1, index + widthInTiles + 1];
    }

    /*
    validDirections
    ---------------
     Returns an array with the values "up", "down", "left" or "right"
    that represent all the valid directions in which a sprite can move
    The `validGid` is the grid index number for the "walkable" part of the world
    (such as, possibly, `0`.)
    */

  }, {
    key: "validDirections",
    value: function validDirections(sprite, mapArray, validGid, world) {

      //Get the sprite's current map index position number
      var index = g.getIndex(sprite.x, sprite.y, world.tilewidth, world.tileheight, world.widthInTiles);

      //An array containing the index numbers of tile cells
      //above, below and to the left and right of the sprite
      var surroundingCrossCells = function surroundingCrossCells(index, widthInTiles) {
        return [index - widthInTiles, index - 1, index + 1, index + widthInTiles];
      };

      //Get the index position numbers of the 4 cells to the top, right, left
      //and bottom of the sprite
      var surroundingIndexNumbers = surroundingCrossCells(index, world.widthInTiles);

      //Find all the tile gid numbers that match the surrounding index numbers
      var surroundingTileGids = surroundingIndexNumbers.map(function (index) {
        return mapArray[index];
      });

      //`directionList` is an array of 4 string values that can be either
      //"up", "left", "right", "down" or "none", depending on
      //whether there is a cell with a valid gid that matches that direction.
      var directionList = surroundingTileGids.map(function (gid, i) {

        //The possible directions
        var possibleDirections = ["up", "left", "right", "down"];

        //If the direction is valid, choose the matching string
        //identifier for that direction. Otherwise, return "none"
        if (gid === validGid) {
          return possibleDirections[i];
        } else {
          return "none";
        }
      });

      //We don't need "none" in the list of directions
      //(it's just a placeholder), so let's filter it out
      var filteredDirectionList = directionList.filter(function (direction) {
        return direction != "none";
      });

      //Return the filtered list of valid directions
      return filteredDirectionList;
    }

    /*
    canChangeDirection
    ------------------
     Returns `true` or `false` depending on whether a sprite in at a map
    array location in which it able to change its direction
    */

  }, {
    key: "canChangeDirection",
    value: function canChangeDirection() {
      var validDirections = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

      //Is the sprite in a dead-end (cul de sac.) This will be true if there's only
      //one element in the `validDirections` array
      var inCulDeSac = validDirections.length === 1;

      //Is the sprite trapped? This will be true if there are no elements in
      //the `validDirections` array
      var trapped = validDirections.length === 0;

      //Is the sprite in a passage? This will be `true` if the the sprite
      //is at a location that contain the values
      //“left” or “right” and “up” or “down”
      var up = validDirections.find(function (x) {
        return x === "up";
      }),
          down = validDirections.find(function (x) {
        return x === "down";
      }),
          left = validDirections.find(function (x) {
        return x === "left";
      }),
          right = validDirections.find(function (x) {
        return x === "right";
      }),
          atIntersection = (up || down) && (left || right);

      //Return `true` if the sprite can change direction or
      //`false` if it can't
      return trapped || atIntersection || inCulDeSac;
    }

    /*
    randomDirection
    ---------------
     Randomly returns the values "up", "down", "left" or "right" based on
    valid directions supplied. If the are no valid directions, it returns "trapped"
     
    */

  }, {
    key: "randomDirection",
    value: function randomDirection(sprite) {
      var validDirections = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];

      //The `randomInt` helper function returns a random integer between a minimum
      //and maximum value
      var randomInt = function randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      };

      //Is the sprite trapped?
      var trapped = validDirections.length === 0;

      //If the sprite isn't trapped, randomly choose one of the valid
      //directions. Otherwise, return the string "trapped"
      if (!trapped) {
        return validDirections[randomInt(0, validDirections.length - 1)];
      } else {
        return "trapped";
      }
    }

    /*
    closestDirection
    ----------------
     Tells you the closes direction to `spriteTwo` from `spriteOne` based on
    supplied validDirections. The function returns any of these 
    4 values: "up", "down", "left" or "right"
     */

  }, {
    key: "closestDirection",
    value: function closestDirection(spriteOne, spriteTwo) {
      var validDirections = arguments.length <= 2 || arguments[2] === undefined ? [] : arguments[2];

      //A helper function to find the closest direction
      var closest = function closest() {

        //Plot a vector between spriteTwo and spriteOne
        var vx = spriteTwo.centerX - spriteOne.centerX,
            vy = spriteTwo.centerY - spriteOne.centerY;

        //If the distance is greater on the X axis...
        if (Math.abs(vx) >= Math.abs(vy)) {

          //Try left and right
          if (vx <= 0) {
            return "left";
          } else {
            return "right";
          }
        }

        //If the distance is greater on the Y axis...
        else {

            //Try up and down
            if (vy <= 0) {
              return "up";
            } else {
              return "down";
            }
          }
      };
    }
  }]);

  return TileUtilities;
})();
//# sourceMappingURL=tileUtilities.js.map