var RING_MAX_LINE_WIDTH = 20;
var canvas = document.getElementById("canvas");
var MAX_SIDE = Math.max(canvas.width, canvas.height);

function intensity255(aColor255, aIntensity) {
	return Math.round(aColor255 + (255 - aColor255) * (1 - aIntensity));
};

function EmptyRing(aRadius, aCenter, aAngle) {
	this.radius = aRadius;
	this.center = aCenter;
	this.angle = aAngle;

	this.DECORATION_HEIGHT = 0.2;

	this.lineTop = new Line(new Point(0, 0), new Point(0, 0));
	this.lineBottom = new Line(new Point(0, 0), new Point(0, 0));
	this.lineLeft = new Line(new Point(0, 0), new Point(0, 0));
	this.lineRight = new Line(new Point(0, 0), new Point(0, 0));

	this.rescale = function() {
		this.lineTop.p1.x = this.center.x;
		this.lineTop.p1.y = this.center.y - this.radius;
		this.lineTop.p2.x = this.lineTop.p1.x;
		this.lineTop.p2.y = this.lineTop.p1.y + this.radius * this.DECORATION_HEIGHT;

		this.lineBottom.p1.x = this.center.x;
		this.lineBottom.p1.y = this.center.y + this.radius;
		this.lineBottom.p2.x = this.lineBottom.p1.x;
		this.lineBottom.p2.y = this.lineBottom.p1.y - this.radius * this.DECORATION_HEIGHT;

		this.lineLeft.p1.x = this.center.x - this.radius;
		this.lineLeft.p1.y = this.center.y;
		this.lineLeft.p2.x = this.lineLeft.p1.x + this.radius * this.DECORATION_HEIGHT;
		this.lineLeft.p2.y = this.lineLeft.p1.y;

		this.lineRight.p1.x = this.center.x + this.radius;
		this.lineRight.p1.y = this.center.y;
		this.lineRight.p2.x = this.lineRight.p1.x - this.radius * this.DECORATION_HEIGHT;
		this.lineRight.p2.y = this.lineRight.p1.y;
		this.rotate();
	};

	this.rotate = function() {
		this.lineTop.rotate(this.angle, this.center);
		this.lineBottom.rotate(this.angle, this.center);
		this.lineLeft.rotate(this.angle, this.center);
		this.lineRight.rotate(this.angle, this.center);

	};
	this.translate = function() {

	};

	this.collisionCheck = function() {

	};
	this.draw = function(aContext, aIntensity) {
		aContext.lineWidth = RING_MAX_LINE_WIDTH * (this.radius / MAX_SIDE);
		var black = intensity255(0, aIntensity);
		aContext.strokeStyle = 'rgba(' + black + ',' + black + ',' + black + ',1)';

		aContext.beginPath();
		aContext.arc(this.center.x, this.center.y, this.radius, 0, 2 * Math.PI, false);

		this.lineTop.draw(aContext);
		this.lineBottom.draw(aContext);
		this.lineLeft.draw(aContext);
		this.lineRight.draw(aContext);

		aContext.closePath();
		aContext.stroke();
	};

	this.rescale();
}

function RectangleRingSingle(aRadius, aCenter, aAngle) {
	this.radius = aRadius;
	this.center = aCenter;
	this.angle = aAngle;

	this.RECTANGLE_WIDTH = 0.8;
	this.RECTANGLE_HEIGHT = 1.6;

	this.rectangle = new ReverseRectangle(new Point(0, 0), 0, 0, 0);

	this.rescale = function() {

		this.rectangle.rescale(
			new Point(this.center.x - this.radius * (this.RECTANGLE_WIDTH / 2), this.center.y - this.radius * (this.RECTANGLE_HEIGHT / 2)),
			this.RECTANGLE_WIDTH * this.radius,
			this.RECTANGLE_HEIGHT * this.radius
		);
		this.rotate();
	};

	this.rotate = function() {
		this.rectangle.rotate(this.angle, this.center);
	};
	this.translate = function() {

	};

	this.collisionCheck = function() {

	};
	this.draw = function(aContext, aIntensity) {
		aContext.lineWidth = RING_MAX_LINE_WIDTH * (this.radius / MAX_SIDE);
		var black = intensity255(0, aIntensity);
		var grey = intensity255(204, aIntensity);
		aContext.strokeStyle = 'rgba(' + black + ',' + black + ',' + black + ',1)';
		aContext.fillStyle = 'rgba(' + grey + ',' + grey + ',' + grey + ',1)';

		aContext.beginPath();
		aContext.arc(this.center.x, this.center.y, this.radius, 0, 2 * Math.PI, false);
		this.rectangle.draw(aContext);
		aContext.closePath();

		aContext.fill();
		aContext.stroke();
	};

	this.rescale();
}

function DoorLockRing(aRadius, aCenter, aAngle) {
	this.radius = aRadius;
	this.center = aCenter;
	this.angle = aAngle;

	this.CIRCLE_RADIUS = 0.3;
	this.ANGLE = 60;

	var s, c, circleRadius,
		xOffsetSmall, yOffsetSmall, xOffsetBig, yOffsetBig,
		radAngle, radStartAngle, radEndAngle, angleTo90;

	angleTo90 = 90 - this.ANGLE;

	radAngle = Math.PI * (angleTo90 / 180);
	s = Math.sin(radAngle);
	c = Math.cos(radAngle);

	radStartAngle = Math.PI / 2;
	radEndAngle = Math.PI * ( angleTo90 / 180);

	var topPointLeft = new Point(0, 0),
		midPointLeft = new Point(0, 0),
		bottomPointLeft = new Point(0, 0),
		topPointRight = new Point(0, 0);

	this.rescale = function() {
		circleRadius = this.radius * this.CIRCLE_RADIUS;
		xOffsetSmall = c * circleRadius; //b
		yOffsetSmall = s * circleRadius; //a
		xOffsetBig = c * this.radius; //b
		yOffsetBig = s * this.radius; //a

		topPointLeft.x = this.center.x;
		topPointLeft.y = this.center.y + circleRadius;

		midPointLeft.x = this.center.x;
		midPointLeft.y = topPointLeft.y + (this.radius - circleRadius) / 2;

		bottomPointLeft.x = this.center.x;
		bottomPointLeft.y = this.center.y + this.radius;

		topPointRight.x = this.center.x + xOffsetSmall;
		topPointRight.y = this.center.y + yOffsetSmall;
		this.rotate();
	};

	this.rotate = function() {
		topPointLeft.rotate(this.angle, this.center);
		midPointLeft.rotate(this.angle, this.center);
		bottomPointLeft.rotate(this.angle, this.center);
		topPointRight.rotate(this.angle, this.center);
	};
	this.translate = function() {

	};

	this.collisionCheck = function() {

	};
	this.draw = function(aContext, aIntensity) {
		aContext.lineWidth = RING_MAX_LINE_WIDTH * (this.radius / MAX_SIDE);
		var black = intensity255(0, aIntensity);
		var grey = intensity255(204, aIntensity);
		aContext.strokeStyle = 'rgba(' + black + ',' + black + ',' + black + ',1)';
		aContext.fillStyle = 'rgba(' + grey + ',' + grey + ',' + grey + ',1)';

		var currentAngle = this.angle * (Math.PI / 180);
		aContext.beginPath();
		aContext.moveTo(midPointLeft.x, midPointLeft.y);
		aContext.lineTo(bottomPointLeft.x, bottomPointLeft.y);
		aContext.arc(this.center.x, this.center.y, this.radius, radStartAngle + currentAngle, radEndAngle + currentAngle, false);
		aContext.lineTo(topPointRight.x, topPointRight.y);
		aContext.arc(this.center.x, this.center.y, circleRadius, radEndAngle + currentAngle, radStartAngle + currentAngle, true);
		aContext.lineTo(midPointLeft.x, midPointLeft.y);
		aContext.closePath();

		aContext.fill();
		aContext.stroke();
	};
	this.rescale();
}

function FanRing(aRadius, aCenter, aAngle) {
	this.radius = aRadius;
	this.center = aCenter;
	this.angle = aAngle;

	this.CIRCLE_RADIUS = 0.3;

	var topMidPoint = new Point(0, 0),
		topHighPoint = new Point(0, 0),
		rightLowPoint = new Point(0, 0),
		bottomHighPoint = new Point(0, 0),
		leftLowPoint = new Point(0, 0);

	var circleRadius;

	this.rescale = function() {
		circleRadius = this.radius * this.CIRCLE_RADIUS;
		topMidPoint.x = this.center.x;
		topMidPoint.y = this.center.y - circleRadius;
		topHighPoint.x = this.center.x;
		topHighPoint.y = this.center.y - this.radius;
		rightLowPoint.x = this.center.x + circleRadius;
		rightLowPoint.y = this.center.y;
		bottomHighPoint.x = this.center.x;
		bottomHighPoint.y = this.center.y + this.radius;
		leftLowPoint.x = this.center.x - circleRadius;
		leftLowPoint.y = this.center.y;

		this.rotate();
	};

	this.rotate = function() {
		topMidPoint.rotate(this.angle, this.center);
		topHighPoint.rotate(this.angle, this.center);
		rightLowPoint.rotate(this.angle, this.center);
		bottomHighPoint.rotate(this.angle, this.center);
		leftLowPoint.rotate(this.angle, this.center);
	};
	this.translate = function() {

	};

	this.collisionCheck = function() {

	};
	this.draw = function(aContext, aIntensity) {
		aContext.lineWidth = RING_MAX_LINE_WIDTH * (this.radius / MAX_SIDE);
		var black = intensity255(0, aIntensity);
		var grey = intensity255(204, aIntensity);
		aContext.strokeStyle = 'rgba(' + black + ',' + black + ',' + black + ',1)';
		aContext.fillStyle = 'rgba(' + grey + ',' + grey + ',' + grey + ',1)';

		var currentAngle = this.angle * (Math.PI / 180);

		aContext.beginPath();

		aContext.moveTo(topMidPoint.x, topMidPoint.y);
		aContext.lineTo(topHighPoint.x, topHighPoint.y);
		aContext.arc(this.center.x, this.center.y, this.radius, Math.PI * (3 / 2) + currentAngle, 0 + currentAngle, false);
		aContext.lineTo(rightLowPoint.x, rightLowPoint.y);
		aContext.arc(this.center.x, this.center.y, circleRadius, 0 + currentAngle, Math.PI * (1 / 2) + currentAngle, false);
		aContext.lineTo(bottomHighPoint.x, bottomHighPoint.y);
		aContext.arc(this.center.x, this.center.y, this.radius, Math.PI * (1 / 2) + currentAngle, Math.PI + currentAngle, false);
		aContext.lineTo(leftLowPoint.x, leftLowPoint.y);
		aContext.arc(this.center.x, this.center.y, circleRadius, Math.PI + currentAngle, Math.PI * (3 / 2) + currentAngle, false);
		aContext.lineTo(topMidPoint.x, topMidPoint.y);
		aContext.closePath();

		aContext.fill();
		aContext.stroke();
	};

	this.rescale();
}

function HalfRing(aRadius, aCenter, aAngle) {
	this.radius = aRadius;
	this.center = aCenter;
	this.angle = aAngle;

	this.rescale = function() {

	};

	this.rotate = function() {

	};


	this.translate = function() {

	};

	this.collisionCheck = function() {

	};
	this.draw = function(aContext, aIntensity) {
		aContext.lineWidth = RING_MAX_LINE_WIDTH * (this.radius / MAX_SIDE);
		var black = intensity255(0, aIntensity);
		var grey = intensity255(204, aIntensity);
		aContext.strokeStyle = 'rgba(' + black + ',' + black + ',' + black + ',1)';
		aContext.fillStyle = 'rgba(' + grey + ',' + grey + ',' + grey + ',1)';

		var currentAngle = this.angle * (Math.PI / 180);

		aContext.beginPath();
		aContext.arc(this.center.x, this.center.y, this.radius, 0 + currentAngle, Math.PI + currentAngle, false);
		aContext.closePath();

		aContext.fill();
		aContext.stroke();
	};

	this.rescale();
}

function HoleRing(aRadius, aCenter, aAngle, aHoles, aHoleRadiusRatio, aDistanceFormCenterRatio) {
	this.radius = aRadius;
	this.center = aCenter;
	this.angle = aAngle;
	this.holes = aHoles;
	this.holeRadiusRatio = aHoleRadiusRatio;

	this.distanceFromCenterRatio = aDistanceFormCenterRatio;

	var centerPoints = [];
	for (var i = 0; i < this.holes; i++) {
		centerPoints[i] = new Point(0, 0);
	}
	var distanceFormCenter, holeAngle, holeRadius;

	this.rescale = function() {
		distanceFormCenter = this.radius * this.distanceFromCenterRatio;
		holeAngle = 360 / this.holes;
		centerPoints[0].x = this.center.x + distanceFormCenter;
		centerPoints[0].y = this.center.y;
		centerPoints[0].rotate(this.angle, this.center);
		for (var i = 1, len = centerPoints.length; i < len; i++) {
			centerPoints[i].x = centerPoints[i - 1].x;
			centerPoints[i].y = centerPoints[i - 1].y;
			centerPoints[i].rotate(holeAngle, this.center);

		}
		holeRadius = this.radius * this.holeRadiusRatio;
	};

	this.rotate = function() {

	};


	this.translate = function() {

	};

	this.collisionCheck = function() {

	};
	this.draw = function(aContext, aIntensity) {
		aContext.lineWidth = RING_MAX_LINE_WIDTH * (this.radius / MAX_SIDE);
		var black = intensity255(0, aIntensity);
		var grey = intensity255(204, aIntensity);
		aContext.strokeStyle = 'rgba(' + black + ',' + black + ',' + black + ',1)';
		aContext.fillStyle = 'rgba(' + grey + ',' + grey + ',' + grey + ',1)';

		aContext.beginPath();
		aContext.arc(this.center.x, this.center.y, this.radius, 0, Math.PI * 2, false);
		for (var i = 0, len = centerPoints.length; i < len; i++) {
			aContext.moveTo(centerPoints[i].x + holeRadius, centerPoints[i].y);
			aContext.arc(centerPoints[i].x, centerPoints[i].y, holeRadius, 0, Math.PI * 2, true);
		}
		aContext.closePath();
		//aContext.clip();
		aContext.fill();
		aContext.stroke();
	};

	this.rescale();
}