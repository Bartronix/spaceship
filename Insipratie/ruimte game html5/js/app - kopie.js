// A cross-browser requestAnimationFrame
// See https://hacks.mozilla.org/2011/08/animating-with-javascript-from-setinterval-to-requestanimationframe/
var requestAnimFrame = (function(){
    return window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function(callback){
            window.setTimeout(callback, 1000 / 60);
        };
})();

// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 600;
canvas.height = 360;
document.body.appendChild(canvas);

var bgX = 0;
var bgY = 0;

var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "img/bg.png";

function update(val){	
	
}

var render = function () {
	bgY -= 1;	
	document.getElementById("a").innerHTML = bgY;
	if (bgReady) {
		ctx.drawImage(bgImage, bgX, bgY);
		
		ctx.drawImage(bgImage, bgX, bgY + 360);

		// If the image scrolled off the screen, reset
		if (bgY <= -360){			
			bgY = 0;
		}			
	}
	
	ctx.fillStyle="#ffffff";
    ctx.fillRect(bgY + 100, 50, 50, 50);
}

// The main game loop
var lastTime;
function main() {
    var now = Date.now();
    var dt = (now - lastTime) / 1000.0;

    update(dt);
    render();

    lastTime = now;
    requestAnimFrame(main);
};

function init() {
    //reset();
    lastTime = Date.now();
    main();
}

init();