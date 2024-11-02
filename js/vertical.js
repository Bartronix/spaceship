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
Game.backgroundVx = 20;
Game.backgroundNumImages = Math.ceil(Game.canvas.height / 600) + 1;
Game.imgHeight = 0;
Game.backgroundSpeed = 10;

//background
Game.backgroundImage = new Image();
Game.backgroundImage.onload = function () {	
	Game.settings.backgroundImageReady = true;
};
Game.backgroundImage.src = "images/space.jpg";

(function (Game) {
	Game.initcontroller = (function () {
		'use strict';

		function update(delta) {
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