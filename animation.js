// Frank Poth 12/23/2017

/* This example will show you how to do custom sprite animation in JavaScript.
It uses an Animation class that handles updating and changing a sprite's current
frame, and a sprite_sheet object to hold the source image and the different animation
frame sets. */

(function() { "use strict";

  /* Each sprite sheet tile is 16x16 pixels in dimension. */
  const SPRITE_SIZE = 16;

  /* The Animation class manages frames within an animation frame set. The frame
  set is an array of values that correspond to the location of sprite images in
  the sprite sheet. For example, a frame value of 0 would correspond to the first
  sprite image / tile in the sprite sheet. By arranging these values in a frame set
  array, you can create a sequence of frames that make an animation when played in
  quick succession. */
  var Animation = function(frame_set, delay) {

    this.count = 0;// Counts the number of game cycles since the last frame change.
    this.delay = delay;// The number of game cycles to wait until the next frame change.
    this.frame = 0;// The value in the sprite sheet of the sprite image / tile to display.
    this.frame_index = 0;// The frame's index in the current animation frame set.
    this.frame_set = frame_set;// The current animation frame set that holds sprite tile values.

  };

  Animation.prototype = {

    /* This changes the current animation frame set. For example, if the current
    set is [0, 1], and the new set is [2, 3], it changes the set to [2, 3]. It also
    sets the delay. */
    change:function(frame_set, delay = 15) {

      if (this.frame_set != frame_set) {// If the frame set is different:

        this.count = 0;// Reset the count.
        this.delay = delay;// Set the delay.
        this.frame_index = 0;// Start at the first frame in the new frame set.
        this.frame_set = frame_set;// Set the new frame set.
        this.frame = this.frame_set[this.frame_index];// Set the new frame value.

      }

    },

    /* Call this on each game cycle. */
    update:function() {

      this.count ++;// Keep track of how many cycles have passed since the last frame change.

      if (this.count >= this.delay) {// If enough cycles have passed, we change the frame.

        this.count = 0;// Reset the count.
        /* If the frame index is on the last value in the frame set, reset to 0.
        If the frame index is not on the last value, just add 1 to it. */
        this.frame_index = (this.frame_index == this.frame_set.length - 1) ? 0 : this.frame_index + 1;
        this.frame = this.frame_set[this.frame_index];// Change the current frame value.

      }

    }

  };

  var buffer, controller, display, loop, player, cops, render, resize, cops_sprite_sheet, sprite_sheet, band, band_sprite_sheet;

  buffer = document.createElement("canvas").getContext("2d");
  display = document.querySelector("canvas").getContext("2d");

  /* I made some changes to the controller object. */
  controller = {

    /* Now each key object knows its physical state as well as its active state.
    When a key is active it is used in the game logic, but its physical state is
    always recorded and never altered for reference. */
    left:  { active:false, state:false },
    right: { active:false, state:false },
    up:    { active:false, state:false },
    down:  { active:false, state:false }, 
    a:  { active:false, state:false }, 
    e:  { active:false, state:false }, 
    n:  { active:false, state:false }, 
    space_bar:  { active:false, state:false }, 

    keyUpDown:function(event) {

      /* Get the physical state of the key being pressed. true = down false = up*/
      var key_state = (event.type == "keydown") ? true : false;

      switch(event.keyCode) {

        case 37:// left key

          /* If the virtual state of the key is not equal to the physical state
          of the key, we know something has changed, and we must update the active
          state of the key. By doing this it prevents repeat firing of keydown events
          from altering the active state of the key. Basically, when you are jumping,
          holding the jump key down isn't going to work. You'll have to hit it every
          time, but only if you set the active key state to false when you jump. */
          if (controller.left.state != key_state) controller.left.active = key_state;
          controller.left.state  = key_state;// Always update the physical state.

        break;
        case 38:// up key

          if (controller.up.state != key_state) controller.up.active = key_state;
          controller.up.state  = key_state;

        break;
        case 39:// right key

          if (controller.right.state != key_state) controller.right.active = key_state;
          controller.right.state  = key_state;

        break;
        case 40:// down key

        if (controller.down.state != key_state) controller.down.active = key_state;
        controller.down.state  = key_state;

        break;
        //TODO: add character select - done! @00:35am Monday 11th May 2020
        case 65:// a key
          
        if (controller.a.state != key_state) controller.a.active = key_state;
        controller.a.state  = key_state;
          
        break;
        case 69:// e key
          
        if (controller.e.state != key_state) controller.e.active = key_state;
        controller.e.state  = key_state;
          
        break;
        case 78:// n key
          
        if (controller.n.state != key_state) controller.n.active = key_state;
        controller.n.state  = key_state;
          
        break;
        case 32:// space bar
          
        if (controller.space_bar.state != key_state) controller.space_bar.active = key_state;
        controller.space_bar.state  = key_state;
          
        break;
      }

      //console.log("left:  " + controller.left.state + ", " + controller.left.active + "\nright: " + controller.right.state + ", " + controller.right.active + "\nup:    " + controller.up.state + ", " + controller.up.active);

    }

  };

  /* The player object is just a rectangle with an animation object. */
  player = {

    animation: new Animation(),// You don't need to setup Animation right away.
    jumping: true,
    height: 16,    width: 16,
    x:20,          y: 40 - 18,
    x_velocity: 0, y_velocity: 0

  };

  cops = {

    animation: new Animation(),// You don't need to setup Animation right away.
    jumping: false,
    height: 16,    width: 16,
    x: 0,          y: 40 - 18,
    x_velocity: 0, y_velocity: 0

  };

  band = {

    animation: new Animation(),// You don't need to setup Animation right away.
    jumping: false,
    height: 16,    width: 16,
    x: 40,          y: 40 - 18,
    x_velocity: 0, y_velocity: 0

  };

  //TODO: add some good ol' NYC COPS

  /* The sprite sheet object holds the sprite sheet graphic and some animation frame
  sets. An animation frame set is just an array of frame values that correspond to
  each sprite image in the sprite sheet, just like a tile sheet and a tile map. */
  sprite_sheet = {

    frame_sets:[[0, 1], [2, 3], [4, 5]],// standing still, walk right, walk left
    image: new Image(),

  };

  cops_sprite_sheet = {

    frame_sets:[[0, 1], [2, 3], [4, 5]],// standing still, walk right, walk left
    image: new Image(),

  };

  band_sprite_sheet = {

    frame_sets:[[0, 1], [2, 3], [4, 5]],// standing still, walk right, walk left
    image: new Image(),

  };
    
  loop = function(time_stamp) {

    if (controller.up.active && !player.jumping) {

      controller.up.active = false;
      player.jumping = true;
      player.y_velocity -= 7;

    }

    if (controller.down.active) {
      /* To change the animation, all you have to do is call animation.change. */
      player.animation.change(sprite_sheet.frame_sets[1], 15);
      player.x_velocity -= 0.00;

    }

    if (controller.left.active) {

      /* To change the animation, all you have to do is call animation.change. */
      player.animation.change(sprite_sheet.frame_sets[2], 15);
      player.x_velocity -= 0.075;

    }

    if (controller.right.active) {

      player.animation.change(sprite_sheet.frame_sets[1], 15);
      player.x_velocity += 0.075;

    }

    /* If you're just standing still, change the animation to standing still. */
    if (!controller.left.active && !controller.right.active) {

      player.animation.change(sprite_sheet.frame_sets[0], 20);

    }

    /* If you're just standing still, change the animation to standing still. */
    if (controller.space_bar.active) {
      player.animation.change(sprite_sheet.frame_sets[1], 15);

    }
    
    if (controller.e.active) {
      player.animation.change(sprite_sheet.image.src = "espen.png");
      
    } 
    
    if (controller.a.active) {
      player.animation.change(sprite_sheet.image.src = "aske-t.png");
      
    } 
    
    if (controller.n.active) {
      player.animation.change(sprite_sheet.image.src = "nils.png");
      
    } 
    
    if (!controller.a.active && !controller.e.active && !controller.n.active){


    player.y_velocity += 0.25;

    player.x += player.x_velocity;
    player.y += player.y_velocity;
    player.x_velocity *= 0.9;
    player.y_velocity *= 0.9;

    if (player.y + player.height > buffer.canvas.height - 2) {

      player.jumping = false;
      player.y = buffer.canvas.height - 2 - player.height;
      player.y_velocity = 0.5;

    }

    if (player.x + player.width < 0) {

      player.x = buffer.canvas.width;

    } else if (player.x > buffer.canvas.width) {

      player.x = - player.width;

    }
    //cops are walking
    cops.animation.change(sprite_sheet.frame_sets[0], 15);
    cops.x_velocity -= 0.05;
    cops.y = buffer.canvas.height - 2 - cops.height;
    cops.y_velocity = 0.5;

    //cops are walking
    band.animation.change(sprite_sheet.frame_sets[0], 15);
    band.x_velocity -= 0.05;
    band.y = buffer.canvas.height - 2 - band.height;
    band.y_velocity = 0.5;

    player.animation.update();
    cops.animation.update();
    band.animation.update();

    render();

    window.requestAnimationFrame(loop);
  }

  };

  render = function() {

    /* Draw the background. */
    var background = new Image();
    background.src = "./pixel-background.jpg";
    buffer.fillStyle = "#333";
    buffer.fillRect(0, 0, buffer.canvas.width, buffer.canvas.height);
    buffer.stroke();
    buffer.fillStyle = "#212121";
    buffer.fillRect(0, 78, buffer.canvas.width, 4);

    /* When you draw your sprite, just use the animation frame value to determine
    where to cut your image from the sprite sheet. It's the same technique used
    for cutting tiles out of a tile sheet. Here I have a very easy implementation
    set up because my sprite sheet is only a single row. */

    /* 02/07/2018 I added Math.floor to the player's x and y positions to eliminate
    antialiasing issues. Take out the Math.floor to see what I mean. */
    buffer.drawImage(sprite_sheet.image, player.animation.frame * SPRITE_SIZE, 0, SPRITE_SIZE, SPRITE_SIZE, Math.floor(player.x), Math.floor(player.y), SPRITE_SIZE, SPRITE_SIZE);
    buffer.drawImage(cops_sprite_sheet.image, cops.animation.frame * SPRITE_SIZE, 0, SPRITE_SIZE, SPRITE_SIZE, Math.floor(cops.x), Math.floor(cops.y), SPRITE_SIZE, SPRITE_SIZE);
    buffer.drawImage(band_sprite_sheet.image, band.animation.frame * SPRITE_SIZE, 0, SPRITE_SIZE, SPRITE_SIZE, Math.floor(band.x), Math.floor(band.y), SPRITE_SIZE, SPRITE_SIZE);
  
    // Make sure the image is loaded first otherwise nothing will draw.
  
    display.drawImage(buffer.canvas, 0, 0, buffer.canvas.width, buffer.canvas.height, 0, 0, display.canvas.width, display.canvas.height);

  };

  resize = function() {

    display.canvas.width = document.documentElement.clientWidth - 32;

    if (display.canvas.width > document.documentElement.clientHeight) {

      display.canvas.width = document.documentElement.clientHeight;

    }

    display.canvas.height = display.canvas.width * 0.5;

    display.imageSmoothingEnabled = false;

  };

      ////////////////////
    //// INITIALIZE ////
  ////////////////////

  buffer.canvas.width = 160;
  buffer.canvas.height = 80;

  window.addEventListener("resize", resize);

  window.addEventListener("keydown", controller.keyUpDown);
  window.addEventListener("keyup", controller.keyUpDown);

  resize();

  sprite_sheet.image.addEventListener("load", function(event) {// When the load event fires, do this:

    window.requestAnimationFrame(loop);// Start the game loop.

  });

      sprite_sheet.image.src = "espen.png"// Start loading the image.
      cops_sprite_sheet.image.src = "aske-t.png"// Start loading the image.
      band_sprite_sheet.image.src = "nils.png"// Start loading the image.

})();
