// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "images/background.png";

// hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
	heroReady = true;
};
heroImage.src = "images/pirate.png";

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
vert5Image.src = "images/v5.png";

var vert3Ready = false;
var vert3Image = new Image();
vert3Image.onload = function () {
	vert3Ready = true;
};
vert3Image.src = "images/v3.png";

// horizontal trees
var hor5Ready = false;
var hor5Image = new Image();
hor5Image.onload = function () {
	hor5Ready = true;
};
hor5Image.src = "images/h5.png";

var hor3Ready = false;
var hor3Image = new Image();
hor3Image.onload = function () {
	hor3Ready = true;
};
hor3Image.src = "images/h3.png";

// all audio
var backgroundMusic = new sound("audio/epic.mp3", 0.1);
var wallBump = new sound("audio/bump.mp3", 0.3);
var thunder = new sound("audio/thunder.mp3", 1.0);
var monster = new sound("audio/haunted.mp3", 0.3);
var bonus = new sound("audio/bonus.mp3", 0.3);
var riddle = new sound("audio/riddle.mp3", 0.3);
var gameOver = new sound("audio/gameover.wav", 0.5);

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

// if player has not lost
var inPlay = true;
var won = false;

// answer to the riddle
var correctAnswer = "sky";
var winOrLose = "images/gameover.jpg"
var faillingPrompt = "<b>Orator</b>: And another one fell. Would someone ever obtain the island's secret power?...";
var winningPrompt = "<b>Orator</b>: Hooray. Now you can summon thunderstorms...";

// timer 
var timeleft = 40; 
var timeRunning = false;

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
	if(!interaction){
		timeRunning = true;			
		interaction = true;
		backgroundMusic.play();
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
			wallBump.play();
			return false;
		}
	}
	
	return true;
}


document.addEventListener('DOMContentLoaded', (event) => {
	var promptArea = document.getElementById("prompts");
	// Update game objects position
	var update = function (modifier) {
		if(inPlay){
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
				) 
				{
					bonus.play();
					var p = document.createElement("p");
					p.innerHTML = "<b>Orator</b>: You found a paper. It is written 'A deep blue...'. It might be helpful to remember.";
					promptArea.appendChild(p);
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
					
					backgroundMusic.stop();
					riddle.play();
					var p = document.createElement("p");
					p.innerHTML = "<b>Haunted Island</b>: Ah You found my secret chest? Your life ends here if you cannot answer my riddle. If you do before your time is up, you will get the power to summon lighting and thunderstorms.<br>"
								+ "Now Answer me: What is blue but not so blue?";
					promptArea.appendChild(p);
					
					var input = document.createElement("input");
					input.setAttribute("id", "riddleAnswer");
					promptArea.appendChild(input);

					var submitButton = document.createElement("button");
					submitButton.innerText = "Respond";
					submitButton.setAttribute("id", "riddleBtn");
					promptArea.appendChild(submitButton);
					submitButton.addEventListener("click", function(){
						var answer = "";
						var userInnput = document.getElementById("riddleAnswer");
						if (userInnput!=null) {
							answer = userInnput.value;
							userInnput.value = "";
						}

						if (inPlay) {
							if (answer === correctAnswer) {
								winOrLose = "images/youwin.png"
								won = true;
								timeleft = -1;
								// display thunder
							}
							else {
								faillingPrompt = "<b>Orator</b>: Oops that was not correct. You will be missed brave soul...";
								timeleft = -1;
							}
						}
					});

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
					
				var p = document.createElement("p");
				p.innerHTML = "<b>Orator</b>: You lost 10 seconds running away from a snake. <br> The island doesn't like your presence. Hurry up!";
				promptArea.appendChild(p);
				timeleft-=10;
				monster.play();
				chest3Ready = false;
				chest3.x = 0;
				chest3.y = 0;	
			}
		}	
	};

	// Create the canvas
	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");
	canvas.width = 600;
	canvas.height = 600;

	
	// Start Timer
	var message = "";
	var gameTimer = setInterval(function(){
		if(timeleft <= 0){
			clearInterval(gameTimer);
			inPlay = false;
			heroReady = false;
			backgroundMusic.stop();
			riddle.stop();
			promptArea.innerHTML = "";

			var img = document.createElement("img");
			img.src = winOrLose;
			promptArea.appendChild(img);

			var p = document.createElement("p");
			if(!won){
				message = "YOU LOST!";		
				p.innerHTML = faillingPrompt;
				promptArea.appendChild(p);
				gameOver.play();
			} else {
				message = "CONGRATULATIONS";
				p.innerHTML = winningPrompt;
				promptArea.appendChild(p);

				var img2 = document.createElement("img");
				img2.src = "images/bolt.png";
				promptArea.appendChild(img2);
				thunder.play();
			}		
		
		} else {
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
		if(hor5Ready && hor3Ready && vert3Ready && vert5Ready){
			for(var i in allWalls) {
				if(allWalls[i].image != null) {
					ctx.drawImage(allWalls[i].image, allWalls[i].x, allWalls[i].y);
				}
			}
		}

		// Show game status
		if(timeleft <= 10 && !won) {

			ctx.fillStyle = "rgb(255, 0, 0)";
		}
		else{
			ctx.fillStyle = "rgb(255, 255, 0)";
		}
		ctx.font = "24px Helvetica";
		ctx.textAlign = "left";
		ctx.textBaseline = "top";
		ctx.fillText(message, 40, 40);	
	};

	// Thunder code take from:  https://codepen.io/mcdorli/pen/AXgmPJ
	var size = 600;
	var c = document.getElementById("canvas");
	c.width = size;
	c.height = size;
	function createLightning() {
		var center = {x: size / 2, y: 20};
		var minSegmentHeight = 5;
		var groundHeight = size - 20;	
		var roughness = 2;
		var maxDifference = size / 5;
		var segmentHeight = groundHeight - center.y;
		var lightning = [];
		lightning.push({x: center.x, y: center.y});
		lightning.push({x: Math.random() * (size - 100) + 50, y: groundHeight + (Math.random() - 0.9) * 50});
		var currDiff = maxDifference;
		while (segmentHeight > minSegmentHeight) {
		  var newSegments = [];
		  for (var i = 0; i < lightning.length - 1; i++) {
			var start = lightning[i];
			var end = lightning[i + 1];
			var midX = (start.x + end.x) / 2;
			var newX = midX + (Math.random() * 2 - 1) * currDiff;
			newSegments.push(start, {x: newX, y: (start.y + end.y) / 2});
		  }
		  newSegments.push(lightning.pop());
		  lightning = newSegments;
		  
		  currDiff /= roughness;
		  segmentHeight /= 2;
		}
		return lightning;
	  }
	
	
	function renderThunder() {
		var ctx = c.getContext("2d");
		var color = "hsl(180, 80%, 80%)";
		ctx.globalCompositeOperation = "lighter";
		ctx.strokeStyle = color;
		ctx.shadowColor = color;
		ctx.fillStyle = color;
		ctx.fillStyle = "hsla(0, 0%, 10%, 0.2)";
		ctx.shadowBlur = 0;
		ctx.globalCompositeOperation = "source-over";
		ctx.fillRect(0, 0, size, size);
		ctx.globalCompositeOperation = "lighter";
		ctx.shadowBlur = 15;
		var lightning = createLightning();
		ctx.beginPath();
		for (var i = 0; i < lightning.length; i++) {
		  ctx.lineTo(lightning[i].x, lightning[i].y);
		}
		ctx.stroke();
		requestAnimationFrame(renderThunder);
	  }

	// The main game loop
	var main = function () {
		
		var now = Date.now();
		var delta = now - then;

		update(delta / 1500);
		render();
		
		then = now;

		// Request to do this again ASAP
		if(!won){
			requestAnimationFrame(main);
		} else {			
			requestAnimationFrame(renderThunder);		
		}
	};

	// Cross-browser support for requestAnimationFrame
	var w = window;
	requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

	var then = Date.now();
	setup();
	main();
	
});

function sound(src, volume) {
	this.sound = document.createElement("audio");
	this.sound.src = src;
	this.sound.volume = volume;
	this.sound.setAttribute("preload", "auto");
	//this.sound.setAttribute("volume", "0");
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

  
