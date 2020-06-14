// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "images/background.png";

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
	heroReady = true;
};
heroImage.src = "images/hero.png";

// Chest image
var chest1Ready, chest2Ready, chest3Ready = false;
var chestImage = new Image();
chestImage.onload = function () {
	chest1Ready = true;
	chest2Ready = true;
	chest3Ready = true;
};
chestImage.src = "images/chest.png";

// vertical trees
var vert5Ready = false;
var vert5Image = new Image();
vert5Image.onload = function () {
	vert5Ready = true;
};
vert5Image.src = "images/5V.png";

var vert3Ready = false;
var vert3Image = new Image();
vert3Image.onload = function () {
	vert3Ready = true;
};
vert3Image.src = "images/3V.png";

// horizontal trees
var hor5Ready = false;
var hor5Image = new Image();
hor5Image.onload = function () {
	hor5Ready = true;
};
hor5Image.src = "images/5H.png";

var hor3Ready = false;
var hor3Image = new Image();
hor3Image.onload = function () {
	hor3Ready = true;
};
hor3Image.src = "images/3H.png";

// Game objects
var hero = {
	speed: 256 // movement in pixels per second
};

var chest1 = {};
var chest2 = {};
var chest3 = {};

//store all the walls (tree images)
var allWalls = [];

// background walls
var leftWall = {x: 0, y: 0, width: 40, height: 600};
var downWall = {x: 0, y: 560, width: 600, height: 40};
var rightWall = {x: 560, y: 0, width: 40, height: 600}
var upWall = {x: 0, y: 0, width: 600, height: 40};
allWalls.push(leftWall);
allWalls.push(rightWall);
allWalls.push(upWall);
allWalls.push(downWall);

// vertical walls
allWalls.push({x: 110, y: 395, width: 35, height: 201, image: vert5Image});	
allWalls.push({x: 375, y: 395, width: 35, height: 201, image: vert5Image});	
allWalls.push({x: 375, y: 195, width: 35, height: 201, image: vert5Image});
allWalls.push({x: 230, y: 277, width: 35, height: 201, image: vert5Image});
allWalls.push({x: 115, y: 155, width: 35, height: 121, image: vert3Image});
	
// horizontal walls
allWalls.push({x: 40,  y: 275, width: 187, height: 44, image: hor5Image});	
allWalls.push({x: 335, y: 350, width: 187, height: 44, image: hor5Image});
allWalls.push({x: 380, y: 100, width: 187, height: 44, image: hor5Image});
allWalls.push({x: 230, y: 100, width: 187, height: 44, image: hor5Image});
allWalls.push({x: 455, y: 440, width: 108, height: 40, image: hor3Image});

// interaction with page is needed before audio
var interaction = false;
var timeRunning = false;

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
	if(!interaction){
		timeRunning = true;
		new sound("audio/epic.mp3").play();
		interaction = true;
	}
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

var setup = function () {
	hero.x = 60;
	hero.y = 520;
	hero.width = 32;
	hero.height = 32;

	// setup the chests
	chest1.x = 525;
    chest1.y = 500;
    
    chest2.x = 525;
    chest2.y = 55;
    
    chest3.x = 60;
	chest3.y = 235;
};


// Update game objects position
var update = function (modifier) {
	
	
	if (38 in keysDown) { // Player holding up
		var new_x = hero.x;
		var new_y = hero.y - (hero.speed * modifier);
		if(withinBoundaries(new_x,new_y)) {
			hero.y -= hero.speed * modifier;
		}
	}
	if (40 in keysDown) { // Player holding down
		var new_x = hero.x;
		var new_y = hero.y + (hero.speed * modifier);
		if(withinBoundaries(new_x,new_y)) {
			hero.y += hero.speed * modifier;
		}
	}
	if (37 in keysDown) { // Player holding left
		var new_x = hero.x - (hero.speed * modifier);
		var new_y = hero.y;
		if(withinBoundaries(new_x,new_y)) {
			hero.x -= hero.speed * modifier;
		}	
	}
	if (39 in keysDown) { // Player holding right
		var new_x = hero.x + (hero.speed * modifier);
		var new_y = hero.y;
		if(withinBoundaries(new_x,new_y)) {
			hero.x += hero.speed * modifier;
		}
	}

	// Are they touching?
	if (
		hero.x <= (chest1.x + 32)
		&& chest1.x <= (hero.x + 32)
		&& hero.y <= (chest1.y + 32)
        && chest1.y <= (hero.y + 32) 
		) {
			console.log("opened chest1");
			chest1Ready = false;
			chest1.x = 0;
			chest1.y = 0;
			
		}  
	else if (
			hero.x <= (chest2.x + 32)
			&& chest2.x <= (hero.x + 32)
			&& hero.y <= (chest2.y + 32)
			&& chest2.y <= (hero.y + 32) 
			)
		{
			console.log("opened chest2");
			chest2.x = 0;
			chest2.y = 0;
			chest2Ready = false;
		} 
	else if ( 
			hero.x <= (chest3.x + 32)
			&& chest3.x <= (hero.x + 32)
			&& hero.y <= (chest3.y + 32)
			&& chest3.y <= (hero.y + 32)
			)
		{
			// var cl = new canvasLightning(canvas, canvas.width, canvas.height);				
			// cl.init();
			console.log("opened treasure");
			chest3Ready = false;
			chest3.x = 0;
			chest3.y = 0;
		}	
};

// Knowing the size of the hero
function withinBoundaries(new_x, new_y) {
	for (var i = 0; i < allWalls.length; i++){
		var wall = allWalls[i];	 
		if (
			// new top left corner
			(new_x >= wall.x && new_x <= (wall.x+wall.width) && new_y >= wall.y && new_y <= (wall.y+wall.height)) ||
			// new bottom left corner
			(new_x >= wall.x && new_x <= (wall.x+wall.width) && new_y+hero.height >= wall.y && new_y+hero.height <= (wall.y+wall.height)) ||
			// new top right corner
			(new_x + hero.width >= wall.x && new_x + hero.width <= (wall.x+wall.width) && new_y >= wall.y && new_y <= (wall.y+wall.height)) ||
			// new bottom right corner
			(new_x + hero.width >= wall.x && new_x + hero.width <= (wall.x+wall.width) && new_y+hero.height >= wall.y && new_y+hero.height <= (wall.y+wall.height))
		   )
		{
			return false;
		}
	}
	// sound effect
	return true;
}


document.addEventListener('DOMContentLoaded', (event) => {
	// Create the canvas
	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");
	canvas.width = 600;
	canvas.height = 600;

	
	// Game Timer
	var timeleft = 10;
	var message = "";
	var gameTimer = setInterval(function(){
		if(timeleft <= 0){
			clearInterval(gameTimer);
			document.getElementById("countdown").innerHTML = "You lost !";
			message = "YOU LOST";
		} else {
			document.getElementById("countdown").innerHTML = timeleft + " seconds remaining";
			
			message = "Time left: " + timeleft + " s";
		}
		if(timeRunning) {
		  timeleft -= 1;
		}

	}, 1000);

	
	// Draw everything
	var render = function () {
		
		if (bgReady) {
			ctx.drawImage(bgImage, 0, 0);
		}

		if (heroReady) {
			ctx.drawImage(heroImage, hero.x, hero.y);
		}

		if (chest1Ready) {
			ctx.drawImage(chestImage, chest1.x, chest1.y);
		}
		if (chest2Ready) {
			ctx.drawImage(chestImage, chest2.x, chest2.y);
		}
		if (chest3Ready) {
			ctx.drawImage(chestImage, chest3.x, chest3.y);
		}
		
		// draw all walls
		if( hor5Ready && hor3Ready && vert3Ready && vert5Ready){
			for(var i in allWalls) {
				if(allWalls[i].image != null) {
					ctx.drawImage(allWalls[i].image, allWalls[i].x, allWalls[i].y);
				}
			}
		}

		// Timer
		//if(timeRunning){
			ctx.fillStyle = "rgb(250, 250, 250)";
			ctx.font = "24px Helvetica";
			ctx.textAlign = "left";
			ctx.textBaseline = "top";
			ctx.fillText(message, 40, 40);	
		//}	
	};

	// The main game loop
	var main = function () {
		var now = Date.now();
		var delta = now - then;

		update(delta / 1000);
		render();

		then = now;

		// Request to do this again ASAP
		requestAnimationFrame(main);
	};

	// Cross-browser support for requestAnimationFrame
	var w = window;
	requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

	// Let's play this game!
	var then = Date.now();
	console.log(then);
	setup();
	main();
});

function sound(src) {
	this.sound = document.createElement("audio");
	this.sound.src = src;
	this.sound.setAttribute("preload", "auto");
	this.sound.setAttribute("muted", "muted");
	this.sound.setAttribute("controls", "none");
	this.sound.style.display = "none";
	document.body.appendChild(this.sound);
	this.play = function(){
	  this.sound.play();
	}
	this.stop = function(){
	  this.sound.pause();
	}
  }





















var canvasLightning = function(c, cw, ch){
  
	/*=============================================================================*/  
	/* Initialize
	/*=============================================================================*/
	  this.init = function(){
		this.loop();
	  };    
	  
	/*=============================================================================*/  
	/* Variables
	/*=============================================================================*/
	  var _this = this;
	  this.c = c;
	  this.ctx = c.getContext('2d');
	  this.cw = cw;
	  this.ch = ch;
	  this.mx = 0;
	  this.my = 0;
	  
	  this.lightning = [];
	  this.lightTimeCurrent = 0;
	  this.lightTimeTotal = 50;
	  
	/*=============================================================================*/  
	/* Utility Functions
	/*=============================================================================*/        
	this.rand = function(rMi, rMa){return ~~((Math.random()*(rMa-rMi+1))+rMi);};
	this.hitTest = function(x1, y1, w1, h1, x2, y2, w2, h2){return !(x1 + w1 < x2 || x2 + w2 < x1 || y1 + h1 < y2 || y2 + h2 < y1);};
	  
	/*=============================================================================*/	
	/* Create Lightning
	/*=============================================================================*/
	  this.createL= function(x, y, canSpawn){					
		this.lightning.push({
		  x: x,
		  y: y,
		  xRange: this.rand(5, 30),
		  yRange: this.rand(5, 25),
		  path: [{
			x: x,
			y: y	
		  }],
		  pathLimit: this.rand(10, 35),
		  canSpawn: canSpawn,
		  hasFired: false
		});
	  };
	  
	/*=============================================================================*/	
	/* Update Lightning
	/*=============================================================================*/
	  this.updateL = function(){
		var i = this.lightning.length;
		while(i--){
		  var light = this.lightning[i];						
		  
		  
		  light.path.push({
			x: light.path[light.path.length-1].x + (this.rand(0, light.xRange)-(light.xRange/2)),
			y: light.path[light.path.length-1].y + (this.rand(0, light.yRange))
		  });
		  
		  if(light.path.length > light.pathLimit){
			this.lightning.splice(i, 1)
		  }
		  light.hasFired = true;
		};
		
	  };
	  
	/*=============================================================================*/	
	/* Render Lightning
	/*=============================================================================*/
	  this.renderL = function(){
		var i = this.lightning.length;
		while(i--){
		  var light = this.lightning[i];
		  
		  this.ctx.strokeStyle = 'hsla(0, 100%, 100%, '+this.rand(10, 100)/100+')';
		  this.ctx.lineWidth = 1;
		  if(this.rand(0, 30) == 0){
			this.ctx.lineWidth = 2;	
		  }
		  if(this.rand(0, 60) == 0){
			this.ctx.lineWidth = 3;	
		  }
		  if(this.rand(0, 90) == 0){
			this.ctx.lineWidth = 4;	
		  }
		  if(this.rand(0, 120) == 0){
			this.ctx.lineWidth = 5;	
		  }
		  if(this.rand(0, 150) == 0){
			this.ctx.lineWidth = 6;	
		  }	
		  
		  this.ctx.beginPath();
		  
		  var pathCount = light.path.length;
		  this.ctx.moveTo(light.x, light.y);
		  for(var pc = 0; pc < pathCount; pc++){	
			
			this.ctx.lineTo(light.path[pc].x, light.path[pc].y);
			
			if(light.canSpawn){
			  if(this.rand(0, 100) == 0){
				light.canSpawn = false;
				this.createL(light.path[pc].x, light.path[pc].y, false);
			  }	
			}
		  }
		  
		  if(!light.hasFired){
			this.ctx.fillStyle = 'rgba(255, 255, 255, '+this.rand(4, 12)/100+')';
			this.ctx.fillRect(0, 0, this.cw, this.ch);	
		  }
		  
		  if(this.rand(0, 30) == 0){
			this.ctx.fillStyle = 'rgba(255, 255, 255, '+this.rand(1, 3)/100+')';
			this.ctx.fillRect(0, 0, this.cw, this.ch);	
		  }	
		  this.ctx.stroke();
		};
	
	  };
	  
	/*=============================================================================*/	
	/* Lightning Timer
	/*=============================================================================*/
	  this.lightningTimer = function(){
		this.lightTimeCurrent++;
		if(this.lightTimeCurrent >= this.lightTimeTotal){
		  var newX = this.rand(100, cw - 100);
		  var newY = this.rand(0, ch / 2); 
		  var createCount = this.rand(1, 3);
		  while(createCount--){							
			this.createL(newX, newY, true);
		  }
		  this.lightTimeCurrent = 0;
		  this.lightTimeTotal = this.rand(30, 100);
		}
	  }
		
	/*=============================================================================*/	
	/* Clear Canvas
	/*=============================================================================*/
		this.clearCanvas = function(){
		  this.ctx.globalCompositeOperation = 'destination-out';
		  this.ctx.fillStyle = 'rgba(0,0,0,'+this.rand(1, 30)/100+')';
		  this.ctx.fillRect(0,0,this.cw,this.ch);
		  this.ctx.globalCompositeOperation = 'source-over';
		  
		};
	  
	/*=============================================================================*/	
	/* Resize on Canvas on Window Resize
	/*=============================================================================*/
	$(window).on('resize', function(){
	  _this.cw = _this.c.width = window.innerWidth;
	  _this.ch = _this.c.height = window.innerHeight;  
	});
		
	/*=============================================================================*/	
	/* Animation Loop
	/*=============================================================================*/
	  this.loop = function(){
		  	
			var loopIt = function(){				
				_this.clearCanvas();
				_this.updateL();
				_this.lightningTimer();
				_this.renderL();	
		};
		loopIt();					
	};
	  
};