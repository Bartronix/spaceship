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

var speed = 100;
var counter = 1;
var explosionTime = 0;

// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 600;
canvas.height = 360;
document.body.appendChild(canvas);

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	console.log("up");
	delete keysDown[e.keyCode];
}, false);

//enemy
var e = new Enemy();
var enemyReady = false;
var enemyImage = new Image();
enemyImage.onload = function () {
	enemyReady = true;
};
enemyImage.src = "img/enemy.png";

//player
var player = new Player();
var playerReady = false;
var playerImage = new Image();
playerImage.onload = function () {
	playerReady = true;
};
playerImage.src = "img/jet.png";

//background
var b = new Background();
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "img/bg.png";

//obstacle
var o = new Obstacle();
var obstacleReady = false;
var obstacleImage = new Image();
obstacleImage.onload = function () {
	obstacleReady = true;
};
obstacleImage.src = "img/rock.png";

//explosion
var explosion = new Explosion();
var explosionReady = false;
var explosionImage = new Image();
explosionImage.onload = function () {
	explosionReady = true;	
};
explosionImage.src = "img/explosion.png";

var update = function (modifier) {
	
	/*if (32 in keysDown) {		
	}*/
	
	if (37 in keysDown) { //left
		player.x -= speed * modifier;
	}
	if (39 in keysDown) { //right
		player.x += speed * modifier;
	}
	
	//background
	b.y -= ((speed/2)  * modifier);	
	if (b.y <= -360){
		b.y = 0;
	}
	//obstacle
	o.x += ((speed/2) * modifier);
	//enemy
	if(e.reverse){
		e.x -= (speed * modifier);
	}else{
		e.x += (speed * modifier);
	}     
	if(e.x >= 520){
		e.reverse = true;
	}
	if(e.x <= 0){
		e.reverse = false;
	}
		
	//collision with obstacle(s)
	if(e.shootY >= o.y){
		console.log("Y colision");
		if((e.shootX >= o.x) && (e.shootX <= (o.x + 50))){
			console.log("BOOM");
			explosion.x = player.x + 10;
			explosion.y = player.y + 10;
		}
	}
	//collision with player
	if(e.shootY >= player.y){
		console.log("Y colision");
		if((e.shootX >= player.x) && (e.shootX <= (player.x + 50))){
			console.log("BOOM");
			explosion.x = e.shootX;
			explosion.y = e.shootY;
		}
	}
};

function Background() {
    this.x = 0;
    this.y = 0;
    this.draw = function() {
        if (bgReady) {
            ctx.drawImage(bgImage, this.x, this.y);            
            ctx.drawImage(bgImage, this.x, this.y + 360);            		
        }    
    };
}

function Obstacle(){
	this.x = 20;
	this.y = 200;
	this.draw = function() {
        if (obstacleReady) {			
            ctx.drawImage(obstacleImage, this.x, this.y);			
        }    
    };
}

function Explosion(){
	this.x = 0;
	this.y = 0;
	this.draw = function() {
        if (explosionReady) {
            ctx.drawImage(explosionImage, this.x, this.y);			
        }    
    };
}

function Player(){
	this.x = 0;
	this.y = 0;
	this.draw = function() {
		ctx.drawImage(playerImage, this.x, this.y);
    };
}

function Enemy(){
	this.x = 0;
	this.y = 10;
	this.shoot = false;
	this.reverse = false;
	this.shootX = 0;
	this.shootY = 30;
	this.draw = function() {
        if (enemyReady) {
            ctx.drawImage(enemyImage, this.x, this.y);			
        }
		if(this.shoot){
			ctx.fillStyle = "#990000";			
			this.shootY += 1;			
			if(this.shootX == 0){
				this.shootX = this.x + 30;
			}
			ctx.fillRect(this.shootX, this.shootY, 2, 20);
			if(this.shootY >= 400){
				this.shoot = false;
			}		
		}
    };
}

var render = function () {	
	document.getElementById("a").innerHTML = e.x;	
	ctx.fillStyle = "#ffffff";
    ctx.fillRect(b.y + 100, 50, 50, 50);	
	b.draw();
	e.draw();
	o.draw();
	player.draw();
	if(explosion.x > 0 && explosion.y > 0){
		explosion.draw();
		explosionTime += 1;
		e.shoot = false;
		if(explosionTime == 20){
			explosion.x = 0;
			explosion.y = 0;
		}
	}
}

// The main game loop
var lastTime;
function main() {
    var now = Date.now();
    var dt = (now - lastTime) / 1000.0;
    update(dt);
	counter++;
	if(counter == 100){
		e.shoot = true;
	}
    render();	
    lastTime = now;
    requestAnimFrame(main);
};

function init() {
    //reset();
    lastTime = Date.now();
	
	player.x = (canvas.width / 2) - 37.5;
	player.y = canvas.height - 75;
	
	
    main();
}

init();