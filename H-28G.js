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

function Point(aX, aY) {
	this.x = aX;
	this.y = aY;
}

function Game() {
	var rings = [];
	var canvas = document.getElementById("canvas");
	var context = canvas.getContext('2d');

	var WIDTH = canvas.width;
	var HEIGHT = canvas.height;
	var center = new Point(WIDTH / 2, HEIGHT / 2);
	var MAX_SIDE = Math.max(center.x, center.y);

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
	}

	function emptyRing(aRadius, aCenter) {
		context.beginPath();
		context.arc(aCenter.x, aCenter.y, aRadius, 0, 2 * Math.PI, false);
		context.lineWidth = RING_MAX_LINE_WIDTH * (aRadius / MAX_SIDE);
		context.strokeStyle = '#000000';
		context.stroke();
	}

	function Ring() {
		this.radius = RING_INITIAL_RADIUS;
		this.center = center;

		this.draw = function() {
			emptyRing(this.radius, this.center);
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
