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
		},

		clamp: function(aX, aMin, aMax) {
			return Math.min(aMax, Math.max(aMin, aX));
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

function penta(aX) {
	return aX * aX * aX * aX * aX;
}

function Tunnel(aContext, aCenter) {
	var kx;
	var ky;
	var rays = 6;
	var offset = 0;
	var delta = Util.degToRad(2);
	var speed = Util.degToRad(0.5);
	var rayAngle = 2 * Math.PI / rays;

	var center = new Point(aContext.canvas.width / 2, aContext.canvas.height / 2);
	var outerRadius = Math.max(aContext.canvas.height, aContext.canvas.width);
	var innerRadius = outerRadius / 20;

	this.act = function(aKX, aKY) {
		kx = aKX;
		ky = aKY;

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

			var outerPoint1 = angle1Point.multiply(outerRadius).translate(aCenter.x + outerRadius * kx, aCenter.y + outerRadius * ky);
			var outerPoint2 = angle2Point.multiply(outerRadius).translate(aCenter.x + outerRadius * kx, aCenter.y + outerRadius * ky);

			var innerPoint1 = angle1Point.multiply(innerRadius).translate(aCenter.x + innerRadius * kx, aCenter.y + innerRadius * ky);
			var innerPoint2 = angle2Point.multiply(innerRadius).translate(aCenter.x + innerRadius * kx, aCenter.y + innerRadius * ky);

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
	var mousePosition = center.translate();
	var tunnel = new Tunnel(context, center);
	var MAX_SIDE = Math.max(center.x, center.y);

	var RING_INITIAL_RADIUS = 10;

	var RING_MAX_ROTATION = 60;

	var FIELD_OF_VIEW_CONSTANT = 400;

	var INITIAL_SPEED = 60;
	var SPEED = INITIAL_SPEED;

	var INITIAL_DISTANCE = 1000;
	var ACCELERATION = 5;

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

	function spawnRing(aDistance) {
		//currently the rings always spawn far away in the distance
		rings.push(new Ring(aDistance));
	}

	function action(aDelta) {
		//first convert the elapsed time from milliseconds to seconds
		var delta = aDelta / 1000;

		//calculating dinstance travelled between the last and current seconds
		var distanceTravelled = SPEED * delta + (ACCELERATION * delta * delta ) / 2;

		var w = WIDTH / 2;
		var kx = Util.clamp((w - mousePosition.x) / w, -0.7, 0.7);

		var h = HEIGHT / 2;
		var ky = Util.clamp((h - mousePosition.y) / h, -0.7, 0.7);

		for (var i = 0, len = rings.length; i < len; i++) {
			//the rings should calculate their new position on the z axis and if necessary do collision checks + destroy + spawn
			rings[i].act(distanceTravelled, delta, kx, ky);
		}
		if (rings.length > 4) {
			rings = rings.slice(rings.length - 4, rings.length);
		}
		tunnel.act(kx, ky);

		//now that the rings have moved according to the elapsed time we can calculate the base speed for the next frame
		SPEED += ACCELERATION * delta;
	}

	function drawBgr() {
		context.rect(0, 0, WIDTH, HEIGHT);
		context.fillStyle = '#FFFFFF';
		context.fill();
	}

	function draw() {
		drawBgr();
		tunnel.draw();

		for (var i = rings.length - 1; i >= 0; i--) {
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

		var ACUTAL_RADIUS = 20;

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

		this.act = function(aDistanceTravelled, aDelta, aKX, aKY) {
			//if the ring is beyond the camera - create a new ring to replace this one
			if (this.z < 0) {
				spawnRing(INITIAL_DISTANCE + this.z);
			}

			//calculate new z-position
			this.z -= aDistanceTravelled;
			this.radius = FIELD_OF_VIEW_CONSTANT * ( ACUTAL_RADIUS / Math.max(this.z, 1));
			this.angle += this.angleIncrement * aDelta;

			if (this.angle >= 360) {
				this.angle -= 360;
			} else if (this.angle < 0) {
				this.angle += 360;
			}

			this.type.radius = this.radius;
			this.type.angle = this.angle;

			this.type.center = center.translate(aKX * this.type.radius, aKY * this.type.radius);
			this.type.rescale();
		};
	}

	var lastTick = +Date.now();

	function render() {
		var now = +Date.now();

		var delta = now - lastTick;

		lastTick = now;
		fpsCounter.update(now);

		action(delta);
		draw();
	}

	var loop = function() {
		ticker(loop);
		render();
	};

	function mouseMoveListener(aEvent) {
		mousePosition.x = aEvent.clientX;
		mousePosition.y = aEvent.clientY;
	}

	function init() {
		spawnRing(750);
		spawnRing(1000);
		spawnRing(1250);
		spawnRing(1500);
	}

	this.start = Util.singleRun(function() {
		canvas.addEventListener('mousemove', mouseMoveListener, false);

		init();
		loop();
	});

	this.destroy = function() {
		canvas.removeEventListener('mousemove', mouseMoveListener, false);
		loop = Util.noop;
	};
}

new Game().start();
