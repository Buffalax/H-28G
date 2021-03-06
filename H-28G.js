/*global window, document*/
/*jshint laxbreak:true*/

// FIX ME: hack to make ring.act work
var Game = new (function() {
	var CLAMP_RATIO = 0.8;

	var ACCELERATION = 0.5;
	var INITIAL_SPEED = 100;

	var rings = [];

	var map = new Map();
	var engine = new Engine();
	var tunnel = new Tunnel();

	var clampRadius;
	var rocketPosition;
	var speed = INITIAL_SPEED;

	var RING_TYPES = [
		/* 0 */ EmptyRing,
		/* 1 */ FanRing,
		/* 2 */ DoorLockRing,
		/* 3 */ RectangleRingSingle,
		/* 4 */ HalfRing,
		/* 5 */ function(aDistance) {
					return new HoleRing(aDistance, 3, 0.3, 0.6);
				},
		/* 6 */ function(aDistance) {
					return new HoleRing(aDistance, 2, 0.35, 0.55);
				},
		/* 7 */ function(aDistance) {
					return new HoleRing(aDistance, 1, 0.4, 0.5);
				}
	];

	function spawnRing(aDistance) {
		var ringId = Math.floor(Math.random() * RING_TYPES.length);
		var ring = new RING_TYPES[ringId](aDistance);

		ring.resize(engine.dimensions);

		//currently the rings always spawn far away in the distance
		rings.push(ring);
	}

	this.spawnRing = spawnRing;

	function updateRocketPosition() {
		var halfWidth = engine.center.x;
		var halfHeight = engine.center.y;

		var xside = Math.abs(engine.mouse.x - halfWidth);
		var yside = Math.abs(engine.mouse.y - halfHeight);

		//if the position is outside the circle
		if (xside * xside + yside * yside > clampRadius * clampRadius) {
			var centerAngle = Math.atan(yside / xside);

			rocketPosition.x = halfWidth + Math.cos(centerAngle) * clampRadius * Util.sign(engine.mouse.x - halfWidth);
			rocketPosition.y = halfHeight + Math.sin(centerAngle) * clampRadius * Util.sign(engine.mouse.y - halfHeight);
		} else {
			rocketPosition.x = engine.mouse.x;
			rocketPosition.y = engine.mouse.y;
		}
	}

	function updateRocketPosition2() {
		var dx = engine.mouse.x - engine.center.x;
		var dy = engine.mouse.y - engine.center.y;

		var radius = Math.sqrt(dx * dx + dy * dy);
		var ratio = (radius > clampRadius) ? clampRadius / radius : 1;

		rocketPosition.x = engine.center.x + (dx * ratio) | 0;
		rocketPosition.y = engine.center.y + (dy * ratio) | 0;
	}

	function action(aDelta) {
		//first convert the elapsed time from milliseconds to seconds
		var delta = aDelta / 1000;

		//calculating dinstance travelled between the last and current seconds
		var distanceTravelled = speed * delta + (ACCELERATION * delta * delta ) / 2;

		updateRocketPosition2();

		var deviation = engine.center.substract(rocketPosition);
		var kx = deviation.x / clampRadius * 0.7;
		var ky = deviation.y / clampRadius * 0.7;

		for (var i = 0; i < rings.length; i++) {
			//the rings should calculate their new position on the z axis and if necessary do collision checks + destroy + spawn
			rings[i].act(engine, distanceTravelled, delta, kx, ky);
		}
		if (rings.length > 4) {
			rings = rings.slice(-4);
		}
		tunnel.act(kx, ky);
		map.act(kx, ky);

		//now that the rings have moved according to the elapsed time we can calculate the base speed for the next frame
		speed += ACCELERATION * delta;
	}

	function resize() {
		center = engine.dimensions.multiply(0.5);
		rocketPosition = center.translate();
		clampRadius = center.minValue() * CLAMP_RATIO;

		tunnel.resize(engine.dimensions);
		map.resize(engine.dimensions, clampRadius);
		// fpsCounter.resize(engine.dimensions);
	}

	function drawBgr() {
		var context = engine.context;

		context.rect(0, 0, engine.dimensions.width, engine.dimensions.height);
		context.fillStyle = '#FFFFFF';
		context.fill();
	}

	function draw() {
		drawBgr();
		tunnel.draw(engine);

		for (var i = rings.length - 1; i >= 0; i--) {
			rings[i].draw(engine);
		}

		map.draw(engine, rocketPosition);
		drawDebugData(engine);
		// fpsCounter.draw(engine);
	}

	function drawDebugData() {
		var context = engine.context;
		var w = engine.dimensions.width;
		var h = engine.dimensions.height;

		context.fillStyle = 'red';
		context.font = '10px Verdana';

		context.fillText('W:' + window.innerWidth + ' H: ' + window.innerHeight, w - 125, h - 30);
		context.fillText('X:' + rocketPosition.x + ' Y: ' + rocketPosition.y, w - 125, h - 20);
		context.fillText('SPD: ' + speed.toFixed(3), w - 135, h - 10);
		context.fillText('FPS: ' + (engine.fpsCounter.fps || '...'), w - 50, h - 10);
	}

	function init() {
		spawnRing(750);
		spawnRing(1000);
		spawnRing(1250);
		spawnRing(1500);
	}

	this.start = Util.singleRun(function() {
		engine.init(400, draw, resize, action);

		init();

		engine.start();
	});

	this.destroy = function() {
		engine.destroy();
	};
});

Game.start();
