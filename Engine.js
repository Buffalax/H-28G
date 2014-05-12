function Engine() {
	var self = this;

	var fpsCounter = new FPSCounter();

	/* TODO: make these events */
	var draw;
	var resize;
	var action;
	var mouseMove;

	/*
	  self.canvas : CanvasElement
	  self.context : Canvas2dContext
	  self.dimensions : Vector2
	  self.mouse : Vector2
	*/

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

	function updateCanvas() {
		self.canvas.width = self.dimensions.width;
		self.canvas.height = self.dimensions.height;
		self.context = self.canvas.getContext && self.canvas.getContext('2d');
	}

	function resizeListener() {
		self.dimensions = new Vector2(window.innerWidth, window.innerHeight);
		self.center = self.dimensions.multiply(0.5);

		if (self.canvas) {
			updateCanvas();
		}

		resize(self.dimensions);
	}

	function createCanvas() {
		self.canvas = document.createElement('canvas');
		self.canvas.innerHTML = 'This browser doesnt support HTML5';

		updateCanvas();
		document.body.appendChild(self.canvas);

		if (!self.context) {
			delete self.context;
			delete self.canvas;
		}

		return !!self.context;
	}

	function mouseMoveListener(event) {
		self.mouse.x = event.pageX;
		self.mouse.y = event.pageY;
	}

	var lastTick = +Date.now();
	function render() {
		var now = +Date.now();
		var delta = now - lastTick;

		lastTick = now;
		fpsCounter.update(now);

		// TODO: add object queue
		action(delta);
		draw();
	}

	var loop = function() {
		ticker(loop);
		render();
	};

	this.init = Util.singleRun(function(aFoV, aDraw, aResize, aAction) {
		draw = aDraw;
		resize = aResize;
		action = aAction;

		// add DOM listeners and init DOM mirrors
		resizeListener();
		window.addEventListener('resize', resizeListener, false);

		if (!createCanvas()) {
			// canvas creation failed...
			return false;
		}

		self.FIELD_OF_VIEW = aFoV;
		self.mouse = self.dimensions.multiply(0.5);
		self.canvas.addEventListener('mousemove', mouseMoveListener, false);

		return true;
	});

	this.start = function() {
		resize();
		loop();
	};

	this.destroy = function() {
		if (!self) {
			// already destroyed;
			return;
		}

		// remove DOM listeners
		window.removeEventListener('resize', resizeListener, false);
		self.canvas.removeEventListener('mousemove', mouseMoveListener, false);

		document.body.removeChild(self.canvas);

		self = null;
		loop = Util.noop;
	};
}
