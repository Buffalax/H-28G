function Map() {
	var MAP_SCALE = 0.2;

	var size;
	var center;
	var position;
	var innerRadius;
	var outerRadius;

	this.resize = function(aDimensions, aMouseRadius) {
		size = aDimensions.multiply(MAP_SCALE);
		position = new Vector2(10, aDimensions.height - size.y - 10);
		center = position.translate(size.x / 2, size.y / 2);
		innerRadius = aMouseRadius * MAP_SCALE;

		// 		Math.min(size.x, size.y)?
		outerRadius = (Math.min(aDimensions.width, aDimensions.height) / 2) * MAP_SCALE;
	};

	this.act = Util.noop;

	this.draw = function(aEngine, aMouse) {
		var context = aEngine.context;

		context.strokeStyle = 'red';
		context.lineWidth = 1;

		context.beginPath();
		context.rect(position.x, position.y, size.x, size.y);
		context.closePath();
		context.stroke();

		context.beginPath();
		context.arc(center.x, center.y, outerRadius, 0, Util.PI2);
		context.closePath();
		context.stroke();

		var indicator = position.translate(aMouse.x * MAP_SCALE, aMouse.y * MAP_SCALE);
		context.beginPath();
		context.arc(indicator.x, indicator.y, 3, 0, Util.PI2);
		context.closePath();
		context.stroke();

		context.lineWidth = 3;
		context.strokeStyle = "rgba(255,0,0,0.4)";
		context.beginPath();
		context.arc(center.x, center.y, innerRadius, 0, Util.PI2);
		context.closePath();
		context.stroke();
	};
}
