function FPSCounter(aUpdateInterval) {
	var X;
	var Y;
	var count = 0;
	var fps = '...';
	var time = +new Date();

	var updateInterval = aUpdateInterval || 1000;
	var modifier = 1000 / updateInterval;

	this.resize = function(aDimensions) {
		X = aDimensions.width - 50;
		Y = aDimensions.height - 10;
	};

	this.update = function(aTime) {
		var diff = aTime - time;

		++count;
		if (diff > updateInterval) {
			fps = 'FPS: ' + Math.floor(count * modifier);

			count = 0;
			time = aTime;
		}
	};

	this.draw = function(aEngine) {
		var context = aEngine.context;

		context.fillStyle = 'red';
		context.font = '10px Verdana';
		context.fillText(fps, X, Y);
	};
}
