var Game = {};
var audioPlayer = document.getElementById('audioplayer');

(function (Game) {	
	Game.then = Date.now();
	Game.canvas = document.getElementById("game");
	Game.ctx = Game.canvas.getContext("2d");
	Game.fps = 10;
	Game.interval = 1000/Game.fps;
	Game.recAF = undefined;
	Game.settings = {
		finish: false,
		backgroundImageReady: false,		
		gamestatus: "start"
	}
	Game.counter = 0;
	//background
	Game.backgroundTotalSeconds = 0;
	Game.backgroundVx = 50;
	Game.backgroundNumImages = Math.ceil(Game.canvas.height / 600) + 1;
	Game.backgroundYpos = 0;
	Game.imgHeight = 0;
	Game.backgroundSpeed = 5;
	Game.backgroundImage = new Image();
	Game.backgroundImage.onload = function () {	
		Game.settings.backgroundImageReady = true;
	};
	Game.backgroundImage.src = "images/space.jpg";

	//characters
	Game.ship = new Character("images/ship.png");
	Game.ship.cImage.onload = function () {
		Game.ship.ready = true;
	}	
		
	Game.ufo = new Character("images/ufo.png");
	Game.ufo.cImage.onload = function () {
		Game.ufo.ready = true;
	}

	Game.missile = new Character("images/missile.png");
	Game.missile.cImage.onload = function () {
		Game.missile.ready = true;		
	}
	Game.explosion = new Character("images/explosion.png");
	Game.explosion.cImage.onload = function () {
		Game.explosion.ready = true;
	}
	Game.ufoBomb = new Character("images/ufobomb.png");
	Game.ufoBomb.cImage.onload = function () {
		Game.ufoBomb.ready = true;
	}
	//sounds
	Game.sounds = {"tune": new Audio("sounds/tune.m4a")};	

	Game.initcontroller = (function () {
		'use strict';
		
		function init() {
			Game.settings.gamestatus = "start";
			Game.ship.x = (Game.canvas.width / 2) - 70;
			Game.ship.y = Game.canvas.height - 120;
			Game.ufo.x = (Game.canvas.width / 2) - 70;
			Game.ufo.y = Game.canvas.height - 500;
			Game.ufo.moveDirection = "right";
			Game.ufo.action = undefined;
			Game.missile.x = Game.ship.x;
			Game.missile.y = Game.ship.y;
			Game.ufoBomb.x = Game.ufo.x;
			Game.ufoBomb.y = -100;
			Game.ship.action = undefined;
			Game.ship.moveDirection = "right";
			Game.settings.finish = false;			
		}
		
		function main(){			
			var now = Date.now();
			var delta = now - Game.then;

			Game.gamecontroller.update(delta / 1000);
			Game.gamecontroller.render();

			Game.then = now - (delta % Game.interval);			
			
			console.log(Game.settings.finish);
			if(!Game.settings.finish) {
				Game.recAF = requestAnimationFrame(main);				
			} else {
				cancelAnimationFrame(Game.recAF)
			}			
		}   
		
		return {			
			init: init,
			main: main
		};
	}());
	
	Game.gamecontroller = (function () {
		'use strict';
		
		function update(delta) {
			//background
			if(Game.settings.gamestatus == "start") {
				if(Game.ship.moveDirection == "right") {					
					Game.ship.x += 40 * delta;
					if(Game.ship.x > 700) {
						Game.ship.x = 700;
					}
				}
				
				if(Game.ship.moveDirection == "left") {
					Game.ship.x -= 40 * delta;					
					if(Game.ship.x < 0) {
						Game.ship.x = 0;
					}
				}
				
				if(Game.ufo.x <= (Game.canvas.width) && Game.ufo.moveDirection == "right") {
					Game.ufo.x += 5;
					if((Game.ufo.x + 100) % Game.canvas.width == 0) {						
						Game.ufo.y = Game.ufo.y + 20;
						Game.ufo.moveDirection = "left";
					}
				}

				if(Game.ufo.x <= (Game.canvas.width) && Game.ufo.moveDirection == "left") {
					Game.ufo.x -= 5;
					if(Game.ufo.x <= 0) {						
						Game.ufo.y = Game.ufo.y + 20;						
						Game.ufo.moveDirection = "right";
					}
				}
				
				if(Game.ship.action == "shoot") {
					Game.missile.y -= 10;
				}								
		
				if(Game.ship.action == "shoot") {
					if((Game.missile.x >= Game.ufo.x) && (Game.missile.x <= (Game.ufo.x + 100)) && (Game.missile.y < Game.ufo.y)) {
						Game.ship.action = undefined;
						Game.ufo.action = "exploding";
						Game.settings.finish = true;
					}
				}
				
				if(Game.missile.y < 0) {
					Game.ship.action = undefined;
					Game.missile.y = Game.ship.y;
					Game.missile.x = Game.ship.x;
				}
				
				Game.counter++;
				
				if(Game.counter % 100 == 0) {
					Game.ufoBomb.action = "drop";
					Game.ufoBomb.x = Game.ufo.x;
					Game.ufoBomb.y = Game.ufo.y;
				}
				
				if(Game.ufoBomb.action == "drop") {					
					Game.ufoBomb.y += 10;
					
					if((Game.ufoBomb.x >= Game.ship.x) && (Game.ufoBomb.x <= (Game.ship.x + 100)) && (Game.ufoBomb.y > Game.ship.y)) {		
						Game.ship.action = "exploding";
						Game.settings.finish = true;
					}
				}
				console.log(Game.ufo.y + " en " + (Game.canvas.height - 150));
				if(Game.ufo.y > Game.canvas.height - 150) {
					Game.ship.action = "exploding";
					Game.settings.finish = true;
				}
			}
		}
		
		function render() {
			Game.ctx.clearRect(0, 0, 800, 600);
			//background
			if (Game.settings.backgroundImageReady) {
				Game.ctx.drawImage(Game.backgroundImage, 0, Game.imgHeight);
				Game.ctx.drawImage(Game.backgroundImage, 0, Game.imgHeight - 600);
				Game.imgHeight += Game.backgroundSpeed;
				if (Game.imgHeight == 600)
					Game.imgHeight = 0;
			}
			
			if(Game.ship.ready) {
				Game.ctx.drawImage(Game.ship.cImage, Game.ship.x, Game.ship.y);
			}
			
			if(Game.ufo.ready) {
				Game.ctx.drawImage(Game.ufo.cImage, Game.ufo.x, Game.ufo.y);
			}
			
			if(Game.ship.action == "shoot" && Game.missile.ready) {
				Game.ctx.drawImage(Game.missile.cImage, Game.missile.x, Game.missile.y);
			}
			
			if(Game.ufo.action == "exploding") {
				Game.ctx.drawImage(Game.explosion.cImage, Game.ufo.x, Game.ufo.y);				
				Game.ctx.font = "30px Comic Sans MS";
				Game.ctx.fillStyle = "red";
				Game.ctx.textAlign = "center";
				Game.ctx.fillText("YOU WON!", Game.canvas.width/2, Game.canvas.height/2);
				Game.ctx.fillText("Click to restart", Game.canvas.width/2, Game.canvas.height/2 + 40);				
			}
			
			if(Game.ufoBomb.ready && Game.ufoBomb.action == "drop") {
				Game.ctx.drawImage(Game.ufoBomb.cImage, Game.ufoBomb.x, Game.ufoBomb.y);	
			}
			
			if(Game.ship.action == "exploding") {
				Game.ctx.drawImage(Game.explosion.cImage, Game.ship.x, Game.ship.y);				
				Game.ctx.font = "30px Comic Sans MS";
				Game.ctx.fillStyle = "red";
				Game.ctx.textAlign = "center";
				Game.ctx.fillText("GAME OVER", Game.canvas.width/2, Game.canvas.height/2);
				Game.ctx.fillText("Click to restart", Game.canvas.width/2, Game.canvas.height/2 + 40);				
			}
		}		
		
		return {
			update: update,
			render: render,
		};
	}());
}(Game));

function start() {
	Game.initcontroller.init();
	Game.initcontroller.main();
	audioPlayer.play();
}

var keysDown = {};
addEventListener("keydown", function (e) {
	if(e.keyCode == 37) {
		Game.ship.moveDirection = "left";
	}
	if(e.keyCode == 39) {
		Game.ship.moveDirection = "right";
	}	
	if(e.keyCode == 32) {
		if(Game.ship.action == undefined) {
			Game.missile.x = Game.ship.x;		
		}
		Game.ship.action = "shoot";
	}
}, false);

addEventListener('click', function(event) {
	if(Game.recAF) {	
		cancelAnimationFrame(Game.recAF);
	}
	start();
}, false);

Game.ctx.clearRect(0, 0, Game.canvas.width, Game.canvas.height);
Game.ctx.fillStyle = 'rgba(0,0,0,0.5)';
Game.ctx.fillRect(0,0,Game.canvas.width, Game.canvas.height);
Game.ctx.font = "30px Comic Sans MS";
Game.ctx.fillStyle = "red";
Game.ctx.textAlign = "center";
Game.ctx.fillText("START", Game.canvas.width/2, Game.canvas.height/2);