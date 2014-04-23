/*global window, document*/
/*jshint laxbreak:true*/

var Util = (function() {
	var PI2 = Math.PI * 2;

	return {
		PI2: PI2,

		singleRun: function(aFunction) {
			var started = false;

			return function() {
				if (!started) {
					started = true;
					aFunction.apply(this, arguments);
				}
			};
		},

		noop: function() {
		},

		degToRad: function(aDegrees) {
			return aDegrees * Math.PI / 180;
		},

		normalizeAngle: function(aAngle) {
			while (aAngle < 0) {
				aAngle += PI2;
			}

			return aAngle % PI2;
		},

		normalizeAngleSimple: function(aAngle) {
			if (aAngle < 0) {
				return aAngle + PI2;
			}

			return (aAngle > PI2) ? (aAngle - PI2) : aAngle;
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

function Tunnel(aContext, aCenter) {
	var rays = 6;
	var offset = 0;
	var delta = Util.degToRad(2);
	var speed = Util.degToRad(0.5);
	var rayAngle = 2 * Math.PI / rays;

	var center = new Point(aContext.canvas.width / 2, aContext.canvas.height / 2);
	var outerRadius = Math.max(aContext.canvas.height, aContext.canvas.width);
	var innerRadius = outerRadius / 20;

	this.act = function() {
		offset = Util.normalizeAngleSimple(offset + speed);
	};

	this.draw = function() {
		aContext.lineWidth = 1;
		aContext.fillStyle = 'purple';

		var i;
		for (i = 0; i < rays; ++i) {
			var angle = offset + (i * rayAngle);

			var angle1Point = Point.singularCirclePoint(angle);
			var angle2Point = Point.singularCirclePoint(angle + delta);

			var outerPoint1 = angle1Point.multiply(outerRadius).translate(aCenter.x, aCenter.y);
			var outerPoint2 = angle2Point.multiply(outerRadius).translate(aCenter.x, aCenter.y);

			var innerPoint1 = angle1Point.multiply(innerRadius).translate(aCenter.x, aCenter.y);
			var innerPoint2 = angle2Point.multiply(innerRadius).translate(aCenter.x, aCenter.y);

			aContext.beginPath();

			aContext.moveTo(outerPoint1.x, outerPoint1.y);
			aContext.lineTo(innerPoint1.x, innerPoint1.y);
			aContext.lineTo(innerPoint2.x, innerPoint2.y);
			aContext.lineTo(outerPoint2.x, outerPoint2.y);

			aContext.closePath();

			aContext.fill();
		}
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
	var tunnel = new Tunnel(context, center);
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
		tunnel.act();

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
		tunnel.draw();

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
				this.angle += 360;
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

	var loop = function() {
		ticker(loop);
		render();
	};

	function mouseMoveListener(aEvent) {
		center.x = WIDTH - aEvent.clientX;
		center.y = HEIGHT - aEvent.clientY;
	}

	this.start = Util.singleRun(function() {
		canvas.addEventListener('mousemove', mouseMoveListener, false);
		loop();
	});

	this.destroy = function() {
		canvas.removeEventListener('mousemove', mouseMoveListener, false);
		loop = Util.noop;
	};
}

new Game().start();
