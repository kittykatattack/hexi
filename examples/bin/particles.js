"use strict";

/*
Create particles with a versatile method called function called
`createParticles`. It's all you'll need for most 2D action games.
Here's an example of how to use it to 
produce a starburst effect at the pointer's x and y position.

    g.createParticles(
      g.pointer.x,                             //The particle’s starting x position
      g.pointer.y,                             //The particle’s starting y position
      () => g.sprite("images/star.png"),       //Particle function
      g.stage,                                 //The container group to add it to
      20,                                      //Number of particles
      0.1,                                     //Gravity
      true,                                    //Random spacing
      0, 6.28,                                 //Min/max angle
      12, 24,                                  //Min/max size
      1, 2,                                    //Min/max speed
      0.005, 0.01,                             //Min/max scale speed
      0.005, 0.01,                             //Min/max alpha speed
      0.05, 0.1                                //Min/max rotation speed
    );

You can see that most of those arguments describe range between 
the minimum and maximum values that should be used to change 
the sprites’ speed, rotation, scale and alpha.
You can also assign the number of particles that should be created,
and add optional gravity. 

You can make particles using any sprites by customizing the third argument. 
Just supply a function that returns the kind of sprite you want to use for each particle:

    () => g.sprite("images/star.png"),

If you supply a sprite that has multiple frames, the `createParticles` 
method will automatically choose a random frame for each particle.

The minimum and maximum angle values are important for defining the 
circular spread of particles as they radiate out from the origin point. 
For a completely circular explosion effect, use a minimum angle 
of 0, and a maximum angle for 6.28.

    0, 6.28

(These numbers values are radians; the equivalent in degrees is 0 and 360.) 
0 starts at the 3 o’clock position, pointing directly to the right. 3.14 
is the 9 o’clock position, and 6.28 takes you around back to 0 again.

If you want to constrain the particles to a narrower angle range, just supply 
the minimum and maximum values that describe that range. Here are values 
you could use to constrain the angle to a pizza-slice with the crust pointing left.

2.4, 3.6

You could use a constrained angle range like this to create a particle stream, 
like a fountain or rocket engine flames. By carefully choosing the sprite for 
the particle and finely adjusting each parameter, you can use this 
all-purpose `createParticles` method to simulate everything from liquid to fire. 
*/

//Create a new Hexi instance, and start it.
//Load the texture atlas that inlcudes the animation frames you want
//to load
var g = hexi(256, 256, setup, ["images/star.png"]);
g.start();

//Set the background color and scale the canvas
g.backgroundColor = "black";
g.scaleToWindow();

//The `setup` function to initialize your application
function setup() {

  g.pointer.press = function () {
    g.createParticles(g.pointer.x, g.pointer.y, function () {
      return g.sprite("images/star.png");
    }, g.stage, 50);
  };

  //Add text instructions
  g.text("Tap to make stars", "14px Futura", "white", 6, 4);
}
//# sourceMappingURL=particles.js.map