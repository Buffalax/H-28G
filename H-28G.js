/*global window, document*/
/*jshint laxbreak:true*/

var Util = (function() {
	return {
		oncef: function(aFunction) {
			var started = false;

			return function() {
				if (!started) {
					started = true;
					aFunction.apply(this, arguments);
				}
			};
		}
	};
})();

function FPSCounter(aUpdateInterval, aContext) {
	var count = 0;
	var fps = '...';
	var time = +new Date();
	var modifier = 1000 / aUpdateInterval;

	var Y = aContext.canvas.height - 10;
	var X = aContext.canvas.width - 50;

	this.update = function(aTime) {
		var diff = aTime - time;

		++count;
		if (diff > aUpdateInterval) {
			fps = 'FPS: ' + Math.floor(count * modifier);

			count = 0;
			time = aTime;
		}
	};

	this.draw = function() {
		aContext.fillStyle = 'red';
		aContext.font = '10px Verdana';
		aContext.fillText(fps, X, Y);
	};
}

function Game() {
	var rings = [];
	var canvas = document.getElementById("canvas");
	var context = canvas.getContext('2d');
	var fpsCounter = new FPSCounter(1000, context);

	var WIDTH = canvas.width;
	var HEIGHT = canvas.height;
	var CENTER_X = WIDTH / 2;
	var CENTER_Y = HEIGHT / 2;
	var MAX_SIDE = Math.max(WIDTH, HEIGHT);

	var RING_MAX_LINE_WIDTH = 20;
	var RING_SPAWN_RATE = 1000;
	var RING_INITIAL_RADIUS = 10;

	var INITIAL_SPEED = 4;
	var SPEED = INITIAL_SPEED;
	var SPEED_INCREMENT = 0;

	var ticker = (function() {
		return window.requestAnimationFrame
			|| window.webkitRequestAnimationFrame
			|| window.mozRequestAnimationFrame
			|| window.msRequestAnimationFrame
			|| window.oRequestAnimationFrame
			|| function(callback) {
			window.setTimeout(callback, 1000 / 60);
		};
	})();

	function spawnRing() {
		rings.unshift(new Ring());
	}

	function action() {
		for (var i = 0, len = rings.length; i < len; i++) {
			rings[i].act();
		}
	}

	function drawBgr() {
		context.rect(0, 0, WIDTH, HEIGHT);
		context.fillStyle = '#FFFFFF';
		context.fill();
	}

	function draw() {
		drawBgr();

		for (var i = 0, len = rings.length; i < len; i++) {
			rings[i].draw();
		}

		fpsCounter.draw();
	}

	function emptyRing(radius) {
		context.beginPath();
		context.arc(CENTER_X, CENTER_Y, radius, 0, 2 * Math.PI, false);
		context.lineWidth = RING_MAX_LINE_WIDTH * (radius / MAX_SIDE);
		context.strokeStyle = '#000000';
		context.stroke();
	}

	function Ring() {
		this.radius = RING_INITIAL_RADIUS;
		this.centerX = CENTER_X;
		this.centerY = CENTER_Y;

		this.draw = function() {
			emptyRing(this.radius);
		};

		this.act = function() {
			if (this.radius > MAX_SIDE) {
				rings.pop();
			}
			this.radius += SPEED * (this.radius / MAX_SIDE);
		};
	}

	var lastSpawn = 0;
	function render() {
		var now = +Date.now();

		fpsCounter.update(now);
		if ((lastSpawn + RING_SPAWN_RATE) < now) {
			spawnRing();
			lastSpawn = lastSpawn ? (lastSpawn + RING_SPAWN_RATE) : now;
		}

		action();
		draw();
		SPEED += SPEED_INCREMENT;
	}

	function loop() {
		ticker(loop);
		render();
	}

	return {
		start: Util.oncef(loop)
	};
}

new Game().start();
