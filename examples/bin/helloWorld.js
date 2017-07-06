"use strict";

//Create a new Hexi instance, and start it.
var g = hexi(256, 256, setup);
g.start();

//A `setup` function that will run only once.
//Use it for initialization tasks
function setup() {
  console.log("setup");

  //Add some text
  g.text("Hello World!");

  //Change the state to `play`
  g.state = play;
}

//The `play` function will run in a loop
function play() {
  console.log("play");
}
//# sourceMappingURL=helloWorld.js.map