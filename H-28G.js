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
	//var MAX_SIDE = Math.max(center.x, center.y) / 4;

	var RING_SPAWN_RATE = 2000;
	var RING_INITIAL_RADIUS = 10;

	var RING_MAX_ROTATION = 180;

	var INITIAL_SPEED = 10;
	var SPEED = INITIAL_SPEED;
	//var SPEED_INCREMENT = 0.0005;
	var PAUSE_TRESHOLD = 3000;

	var INITIAL_DISTANCE = 1000;
	var ACCELERATION = 0.1;

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
		//currently the rings always spawn far away in the distance
		rings.unshift(new Ring(INITIAL_DISTANCE));
	}

	function action(aDelta) {
		//first convert the elapsed time from milliseconds to seconds
		var delta = aDelta /= 1000;
		//calculating dinstance travelled between the last and current seconds
		var distanceTravelled = SPEED * delta + (ACCELERATION * delta * delta ) / 2;
		for (var i = 0; i < rings.length; i++) {
			//the rings should calculate their new position on the z axis and if necessary do collision checks + destroy + spawn
			rings[i].act(distanceTravelled, delta);
		}
		//now that the rings have moved according to the elapsed time we can calculate the base speed for the next frame
		SPEED += ACCELERATION * aDelta;
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

	function Ring(aZ) {
		// the z field holds the distance between the object and the camera (camera is at 0)
		this.z = aZ;
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

		this.act = function(aDistanceTravelled, aDelta) {
			//calculate new z-position
			this.z -= aDistanceTravelled;
			//if the ring is beyond the camera - destroy it
			if (this.z < 100) {
				rings.pop();
			}
			this.radius = ((MAX_SIDE/2) / INITIAL_DISTANCE) * (INITIAL_DISTANCE - this.z);
			this.angle += this.angleIncrement * aDelta;
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
//Test