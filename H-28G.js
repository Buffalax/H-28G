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

function Game() {
	var rings = [];
	var canvas = document.getElementById("canvas");
	var context = canvas.getContext('2d');

	var WIDTH = canvas.width;
	var HEIGHT = canvas.height;
	var center = new Point(WIDTH / 2, HEIGHT / 2);
	var MAX_SIDE = Math.max(center.x, center.y);

	var RING_SPAWN_RATE = 1000;
	var RING_INITIAL_RADIUS = 10;

	var RING_MAX_ROTATION = 1;

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
