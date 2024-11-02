'use strict';

var Character = function(imgSource) {
	this.cImage = new Image();
	this.cImage.src = imgSource;
	this.x = 0;
	this.y = 0;
	this.ready = false;
	this.action = undefined;
	this.moveDirection = undefined;
}