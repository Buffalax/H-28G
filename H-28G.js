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
	var center = new Point(WIDTH / 2, HEIGHT / 2);
	var MAX_SIDE = Math.max(center.x, center.y) / 4;

	var RING_SPAWN_RATE = 2000;
	var RING_INITIAL_RADIUS = 10;

	var RING_MAX_ROTATION = 1;

	var INITIAL_SPEED = 0.8;
	var SPEED = INITIAL_SPEED;
	var SPEED_INCREMENT = 0.0005;
	var PAUSE_TRESHOLD = 3000;

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

	function action(aDelta) {
		for (var i = 0; i < rings.length; i++) {
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

		drawSpeed();
		fpsCounter.draw();
	}

	function drawSpeed() {
		context.fillStyle = 'red';
		context.font = '10px Verdana';
		context.fillText('SPD: ' + SPEED.toFixed(3), WIDTH - 125, HEIGHT - 10);
	}

	function Ring() {
		this.radius = RING_INITIAL_RADIUS;
		this.center = center;
		this.angle = Math.random() * 360;
		this.angleIncrement = Math.random() * RING_MAX_ROTATION * (-1 + Math.round(Math.random()) * 2);

		switch (Math.floor(Math.random() * 8)) {
			case 0:
				this.type = new EmptyRing(this.radius, this.center, this.angle);
				break;
			case 1:
				this.type = new FanRing(this.radius, this.center, this.angle);
				break;
			case 2:
				this.type = new DoorLockRing(this.radius, this.center, this.angle);
				break;
			case 3:
				this.type = new RectangleRingSingle(this.radius, this.center, this.angle);
				break;
			case 4:
				this.type = new HalfRing(this.radius, this.center, this.angle);
				break;
			case 5:
				this.type = new HoleRing(this.radius, this.center, this.angle, 3, 0.3, 0.6);
				break;
			case 6:
				this.type = new HoleRing(this.radius, this.center, this.angle, 2, 0.3, 0.4);
				break;
			case 7:
				this.type = new HoleRing(this.radius, this.center, this.angle, 1, 0.4, 0.6);
				break;
		}

		this.draw = function() {
			this.type.draw(context);
		};

		this.act = function() {
			if (this.radius > MAX_SIDE * 4) {
				rings.pop();
			}
			this.radius += SPEED * (this.radius / MAX_SIDE);
			this.angle += this.angleIncrement;
			if (this.angle >= 360) {
				this.angle -= 360;
			} else if (this.angle < 0) {
				this.angle += 360
			}
			this.type.radius = this.radius;
			this.type.angle = this.angle;
			this.type.rescale();
		};
	}

	var lastTick = +Date.now();
	var lastSpawn = lastTick - RING_SPAWN_RATE;
	function render() {
		var now = +Date.now();

		var delta = now - lastTick;
		if (delta > PAUSE_TRESHOLD) {
			// triggerPause(delta, now, lastTick);
			lastSpawn += delta;
		}

		lastTick = now;
		fpsCounter.update(now);

		var spawnRate = RING_SPAWN_RATE * INITIAL_SPEED / SPEED;
		if ((lastSpawn + spawnRate) < now) {
			spawnRing();
			lastSpawn += spawnRate;
		}

		action(delta);
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
