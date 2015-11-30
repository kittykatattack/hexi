/*
Learn how to use `walkPath` or `walkCurve` to make a sprite follow a
path between a series of connected waypoints.
*/

//Create a new Hexi instance, and start it.
let g = hexi(512, 600, setup, ["images/animals.json"]);
g.start();

//Set the background color and scale the canvas
//g.backgroundColor = "black";
g.scaleToWindow();

//The `setup` function to initialize your application
function setup() {

  //The cat sprite
  let cat = g.sprite("cat.png"); 
  cat.setPosition(32, 32);

  //Use `walkPath` to make the cat follow a straight path 
  //between a series of connected waypoints. Here's how to use it:

  let catPath = g.walkPath(
    cat,                   //The sprite

    //An array of x/y waypoints to connect in sequence
    [
      [32, 32],            //First x/y point
      [32, 128],           //Next x/y point
      [300, 128],          //Next x/y point
      [300, 32],           //Next x/y point
      [32, 32]             //Last x/y point
    ], 

    300,                   //Total duration, in frames
    "smoothstep",          //Easing type
    true,                  //Should the path loop?
    true,                  //Should the path reverse?
    1000                   //Delay in milliseconds between segments
  ); 

  //The hedgehog sprite
  let hedgehog = g.sprite("hedgehog.png"); 
  hedgehog.setPosition(32, 256);

  //Use `walkCurve` to make the hedgehog follow a curved path 
  //between a series of connected waypoints. Here's how to use it:

  let hedgehogPath = g.walkCurve(
    hedgehog,              //The sprite

    //An array of Bezier curve points that 
    //you want to connect in sequence
    [
      [[hedgehog.x, hedgehog.y],[75, 500],[200, 500],[300, 300]],
      [[300, 300],[250, 100],[100, 100],[hedgehog.x, hedgehog.y]]
    ],

    300,                   //Total duration, in frames
    "smoothstep",          //Easing type
    true,                  //Should the path loop?
    true,                  //Should the path yoyo?
    1000                   //Delay in milliseconds between segments
  );

  //Tweens are updated independently in Hexi's internal 
  //game engine loop, so there's no need to update them in
  //your own `play` state to make them work.
}


