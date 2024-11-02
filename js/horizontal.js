var Game = {};

Game.then = Date.now();
Game.canvas = document.getElementById("game");
Game.ctx = Game.canvas.getContext("2d");
Game.fps = 30;
Game.interval = 1000/Game.fps;
Game.recAF = undefined;
Game.settings = {
	finish: false,
	gameover: false,
	backgroundImageReady: false,
	gamestatus: "start",

}
//background
Game.backgroundTotalSeconds = 0;
Game.backgroundVx = 5;
Game.backgroundNumImages = Math.ceil(Game.canvas.width / 3500) + 1;
Game.backgroundXpos = 0;

//background
Game.backgroundImage = new Image();
Game.backgroundImage.onload = function () {	
	Game.settings.backgroundImageReady = true;
};
Game.backgroundImage.src = "images/clouds.jpg";

(function (Game) {
	Game.initcontroller = (function () {
		'use strict';

		function update(delta) {
			//background
			if(Game.settings.gamestatus == "start") {
				Game.backgroundTotalSeconds += delta;	
				Game.backgroundXpos = Game.backgroundTotalSeconds * Game.backgroundVx % 3500;
			}
		}   
		
		function render() {
			Game.ctx.clearRect(0, 0, 800, 600);			
			//background	
			Game.ctx.drawImage(Game.backgroundImage, 0, 0);
			if (Game.settings.backgroundImageReady && Game.settings.gamestatus == "start") {
				Game.ctx.save();
				Game.ctx.translate(-Game.backgroundXpos, 0);
				for (var i = 0; i < Game.backgroundNumImages; i++) {
					Game.ctx.drawImage(Game.backgroundImage, i * 3500, 0);
				}
				Game.ctx.restore();
			}
		}
		
		function main(){			
			var now = Date.now();
			var delta = now - Game.then;

			Game.initcontroller.update(delta / 1000);
			Game.initcontroller.render();

			Game.then = now - (delta % Game.interval);
			
			
			if(!Game.settings.finish && !Game.settings.gameover) {
				Game.recAF = requestAnimationFrame(main);	
			} else {
				cancelAnimationFrame(Game.recAF)
			}	
			
		}   
		
		return {
			main: main,
			render: render,
			update: update
		};
	}());

}(Game));

Game.initcontroller.main();