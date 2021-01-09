//          88""Yb 88""Yb  dP"Yb  888888 88  88 888888 88""Yb .dP"Y8     
//          88__dP 88__dP dP   Yb   88   88  88 88__   88__dP `Ybo."     
//          88""Yb 88"Yb  Yb   dP   88   888888 88""   88"Yb  o.`Y8b     
//          88oodP 88  Yb  YbodP    88   88  88 888888 88  Yb 8bodP' 

// --------------------------------------------------------------------------------- //

//                8b    d8  dP"Yb  Yb    dP 88 88b 88  dP""b8 
//                88b  d88 dP   Yb  Yb  dP  88 88Yb88 dP   `" 
//                88YbdP88 Yb   dP   YbdP   88 88 Y88 Yb  "88 
//                88 YY 88  YbodP     YP    88 88  Y8  YboodP
                                                       

// Orignally based on the sprite template by Frank Poth 12/23/2017

// I then modified this simple one sprite animation and used as a boilerplate to add *everything* else -  Chris Woolf started around October 2020

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

  var buffer, controller, display, loop, player, aske, render, resize, aske_sprite_sheet, sprite_sheet, nils, nils_sprite_sheet, truck_sprite, truck, cop, cop_sprite_sheet, scene_0;

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

  aske = {

    animation: new Animation(),// You don't need to setup Animation right away.
    jumping: false,
    height: 16,    width: 16,
    x: 0,          y: 40 - 18,
    x_velocity: 0, y_velocity: 0

  };

  nils = {

    animation: new Animation(),// You don't need to setup Animation right away.
    jumping: false,
    height: 16,    width: 16,
    x: 40,          y: 40 - 18,
    x_velocity: 0, y_velocity: 0

  };

  cop = {

    animation: new Animation(),// You don't need to setup Animation right away.
    jumping: true,
    height: 16,    width: 16,
    x: 195,          y: 80 - 18,
    x_velocity: 0, y_velocity: 0

  };

  truck = {
    animation: new Animation(),// You don't need to setup Animation right away.
    jumping: false,
    height: 32,    width: 32,
    x: 0,          y: 75 - 34,
    x_velocity: 0, y_velocity: 0

  };

  //TODO: add some good ol' NYC Cops - done CW Friday 25thd December 06:18am - see git log 08a99b10bcf6c0e3a83f0252843783a50710ac29

  /* The sprite sheet object holds the sprite sheet graphic and some animation frame
  sets. An animation frame set is just an array of frame values that correspond to
  each sprite image in the sprite sheet, just like a tile sheet and a tile map. */
  sprite_sheet = {

    frame_sets:[[0, 1], [2, 3], [4, 5], [6, 7]],// standing still, walk right, walk left
    image: new Image(),

  };

  aske_sprite_sheet = {

    frame_sets:[[0, 1], [2, 3], [4, 5], [6, 7]],// standing still, walk right, walk left
    image: new Image(),

  };

  nils_sprite_sheet = {

    frame_sets:[[0, 1], [2, 3], [4, 5], [6, 7]],// standing still, walk right, walk left
    image: new Image(),

  };

  cop_sprite_sheet = {

    frame_sets:[[0, 1], [2, 3], [4, 5], [6, 7]],// standing still, walk right, walk left
    image: new Image(),

  };

  truck_sprite = {

    frame_sets:[[0,1], [2,3], [4,5]],// standing still, walk right, walk left
    image: new Image(),

  };

  scene_0 = {

    image0: new Image(),
    image1: new Image(),

  };
    
  loop = function(time_stamp) {

    if (controller.up.active && !player.jumping) {

      controller.up.active = false;
      player.jumping = true;
      player.y_velocity -= 7;

    }

    if (controller.down.active) {
      /* To change the animation, all you have to do is call animation.change. */
      player.animation.change(sprite_sheet.frame_sets[3], 15);

    }

    if (controller.left.active) {
      /* To change the animation, all you have to do is call animation.change. */
      player.animation.change(sprite_sheet.frame_sets[2], 15);
      player.x_velocity -= 0.095;

    }

    if (controller.right.active) {
      player.animation.change(sprite_sheet.frame_sets[1], 15);
      player.x_velocity += 0.095; 
    }

    /* If you're just standing still, change the animation to standing still. */
    if (!controller.left.active && !controller.right.active) {
      player.animation.change(sprite_sheet.frame_sets[0], 20);
    }

    /* Space Bar super power thing */
    if (controller.space_bar.active) {
      player.animation.change(sprite_sheet.frame_sets[3], 15);
      player.x_velocity = 0.0;
    }
    
    if (controller.e.active) {
      player.animation.change(sprite_sheet.image.src = "espen-1.png");
      aske_sprite_sheet.image.src = "aske-t.png";
      nils_sprite_sheet.image.src = "nils.png";
      player_sprite_sheet.image.src = "espen-1.png";
    } 
    
    if (controller.a.active) {
      player.animation.change(sprite_sheet.image.src = "aske-t.png")
      aske_sprite_sheet.image.src = "espen-1.png";
      nils_sprite_sheet.image.src = "nils.png";
      player_sprite_sheet.image.src = "aske-t.png";
      
    } 
    
    if (controller.n.active) {
      player.animation.change(sprite_sheet.image.src = "nils.png");
      nils_sprite_sheet.image.src = "espen-1.png";
      aske_sprite_sheet.image.src = "aske-t.png";
      player_sprite_sheet.image.src = "nils.png";
      
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
    
    //aske is jamming a solo
    aske.animation.change(sprite_sheet.frame_sets[0], 15);
    aske.x_velocity -= 0.05;
    aske.y = buffer.canvas.height - 2 - aske.height;
    aske.y_velocity = 0.5;

    //nils is killing it on bass
    nils.animation.change(sprite_sheet.frame_sets[0], 15);
    nils.x_velocity -= 0.05;
    nils.y = buffer.canvas.height - 2 - nils.height;
    nils.y_velocity = 0.5;

    //Truuuuuck ! - Big wheels keep on turning
    truck.animation.change(sprite_sheet.frame_sets[0], 30);

    
    //trucks are driving
    truck.x = truck.x - 1;
    if (truck.x == -200) {
      truck.x = 150;
    }

    
    //cops are walking
    cop.animation.change(cop_sprite_sheet.frame_sets[2], 40);
    cop.x = cop.x - 0.2;
    if (cop.x == -200) {
      cop.x = 150;
    }

    // var position = null;
    // position =  player.x;

    // if (cop.x === position) {
    //   alert('contact!');
    // }
    
    player.animation.update();
    aske.animation.update();
    nils.animation.update();
    cop.animation.update();
    truck.animation.update();

    render();

    window.requestAnimationFrame(loop);
  }

  };

  render = function() {

    /* Draw the background. */
    var background = new Image();
    // background.src = "./pixel-background.jpg";
    buffer.fillStyle = "#202830";
    buffer.fillRect(0, 0, buffer.canvas.width, buffer.canvas.height);
    buffer.stroke();
    buffer.fillStyle = "#202830";
    buffer.fillRect(0, 78, buffer.canvas.width, 4);

    buffer.lineWidth='50';
    buffer.strokeStyle='#202850';
    buffer.beginPath();
    buffer.moveTo(175,50);
    buffer.lineTo(0,50);
    buffer.stroke();

    buffer.lineWidth='9';
    buffer.strokeStyle='#212121';
    buffer.lineCap='square';
    buffer.beginPath();
    buffer.moveTo(0,77);
    buffer.lineTo(200,77);
    buffer.stroke();

    /* Draw the pavement */
    buffer.lineWidth='12';
    buffer.strokeStyle='gray';
    buffer.lineCap='square';
    buffer.beginPath();
    buffer.moveTo(0,80);
    buffer.lineTo(200,80);
    buffer.stroke();

    
    // buffer.lineWidth='8';
    // /* Draw the trains */
    // buffer.strokeStyle='#f5e8a6';
    // buffer.beginPath();
    // buffer.moveTo(0,60);
    // buffer.lineTo(0,70);
    // buffer.stroke();

    // buffer.beginPath();
    // buffer.moveTo(10,65);
    // buffer.lineTo(10,70);
    // buffer.stroke();

    // buffer.lineWidth='12';
    // buffer.beginPath();
    // buffer.moveTo(75,50);
    // buffer.lineTo(0,80);
    // buffer.stroke();
    // buffer.beginPath();
    // buffer.strokeStyle='gray';
    // buffer.lineCap='square';
    // buffer.moveTo(0,50);
    // buffer.lineTo(200,50);
    // buffer.stroke();

    
    
    // TITLE (and such)
// change font and font-size for better visibilty   
// buffer.font = "bold 15px Arial";    
// buffer.fillStyle = "red"; 
// buffer.textAlign = "center";   
// buffer.fillText( "BROTHERS", 80, 18 );

// buffer.font = "italic 15px Times"; 
// buffer.fillStyle = "yellow"; 
// buffer.textAlign = "center"; 
// buffer.fillText( "Moving", 80, 30 );

// draw each string with same X value but different alignment   
// buffer.textAlign = "start";   
// buffer.fillText( "start", 80, 30 );    
   
// buffer.textAlign = "end";   
// buffer.fillText( "BROTHERS", 90, 30 );    
   
// buffer.textAlign = "left";   
// buffer.fillText( "left", 80, 90 );    
   
// buffer.textAlign = "right";   
// buffer.fillText( "right", 80, 120 );    




/* When you draw your sprite, just use the animation frame value to determine
where to cut your image from the sprite sheet. It's the same technique used
for cutting tiles out of a tile sheet. Here I have a very easy implementation
set up because my sprite sheet is only a single row. */

/* 02/07/2018 I added Math.floor to the player's x and y positions to eliminate
antialiasing issues. Take out the Math.floor to see what I mean. */
buffer.drawImage(truck_sprite.image, truck.animation.frame * 32, 0, 32, 32, Math.floor(truck.x), Math.floor(truck.y), 32, 32);


// Scenes Level-0 (wrap all of this in an if conditional)
buffer.drawImage(scene_0.image0, 35, 60);
// buffer.drawImage(scene_0.image1, 0, 0, 731, 256, 0, 0, 185, 55);

buffer.drawImage(sprite_sheet.image, player.animation.frame * SPRITE_SIZE, 0, SPRITE_SIZE, SPRITE_SIZE, Math.floor(player.x), Math.floor(player.y), SPRITE_SIZE, SPRITE_SIZE);
buffer.drawImage(aske_sprite_sheet.image, aske.animation.frame * SPRITE_SIZE, 0, SPRITE_SIZE, SPRITE_SIZE, Math.floor(aske.x), Math.floor(aske.y), SPRITE_SIZE, SPRITE_SIZE);
buffer.drawImage(nils_sprite_sheet.image, nils.animation.frame * SPRITE_SIZE, 0, SPRITE_SIZE, SPRITE_SIZE, Math.floor(nils.x), Math.floor(nils.y), SPRITE_SIZE, SPRITE_SIZE);
buffer.drawImage(cop_sprite_sheet.image, cop.animation.frame * SPRITE_SIZE, 0, SPRITE_SIZE, SPRITE_SIZE, Math.floor(cop.x), Math.floor(cop.y), SPRITE_SIZE, SPRITE_SIZE);


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

      truck_sprite.image.src = "truck.png"// Start loading the image.
      sprite_sheet.image.src = "espen-1.png"// Start loading the image.
      aske_sprite_sheet.image.src = "aske-t.png"// Start loading the image.
      nils_sprite_sheet.image.src = "nils.png"// Start loading the image.
      cop_sprite_sheet.image.src = "cop.png"// Start loading the image.

      // Scenes - Level 0
      scene_0.image0.src = "./levels/0/scene-0.png"// Start loading the image.
      scene_0.image1.src = "./levels/0/scene-0-bkdrop.png"// Start loading the image.
      // title.image.src = "title-text.png"// Start loading the image.

})();
