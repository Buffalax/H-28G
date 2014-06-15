function Tunnel() {
	var kx;
	var ky;
	var rays = 6;
	var offset = 0;
	var delta = Util.degToRad(2);
	var speed = Util.degToRad(0.5);
	var rayAngle = Util.PI2 / rays;

	var center;
	var outerRadius;
	var innerRadius;

	this.act = function(aKX, aKY) {
		kx = aKX;
		ky = aKY;

		offset = Util.normalizeAngleSimple(offset + speed);
	};

	this.resize = function(aDimensions) {
		center = aDimensions.multiply(0.5);
		outerRadius = Math.min(center.x, center.y) * 4;
		innerRadius = outerRadius / 50;
	};

	this.draw = function(aEngine) {
		var context = aEngine.context;

		var dOuterX = aEngine.center.x + outerRadius * kx;
		var dOuterY = aEngine.center.y + outerRadius * ky;

		var dInnerX = aEngine.center.x + innerRadius * kx;
		var dInnerY = aEngine.center.y + innerRadius * ky;

		context.lineWidth = 1;
		context.fillStyle = 'purple';

		var i;
		for (i = 0; i < rays; ++i) {
			var angle = offset + (i * rayAngle);

			var angle1Point = Point.singularCirclePoint(angle);
			var angle2Point = Point.singularCirclePoint(angle + delta);

			var outerPoint1 = angle1Point.multiply(outerRadius).translate(dOuterX, dOuterY);
			var outerPoint2 = angle2Point.multiply(outerRadius).translate(dOuterX, dOuterY);

			var innerPoint1 = angle1Point.multiply(innerRadius).translate(dInnerX, dInnerY);
			var innerPoint2 = angle2Point.multiply(innerRadius).translate(dInnerX, dInnerY);

			context.beginPath();

			context.moveTo(outerPoint1.x, outerPoint1.y);
			context.lineTo(innerPoint1.x, innerPoint1.y);
			context.lineTo(innerPoint2.x, innerPoint2.y);
			context.lineTo(outerPoint2.x, outerPoint2.y);

			context.closePath();

			context.fill();
		}
	};
}
