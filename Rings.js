var RING_MAX_LINE_WIDTH = 20;
var canvas = document.getElementById("canvas");
var MAX_SIDE = Math.max(canvas.width, canvas.height);

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
	this.draw = function(aContext) {
		aContext.lineWidth = RING_MAX_LINE_WIDTH * (this.radius / MAX_SIDE);
		aContext.strokeStyle = '#000000';

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

	//this.concaveRectangle = [new Point(0, 0), new Point(0, 0), new Point(0, 0), new Point(0, 0)];

	this.rectangle = new ReverseRectangle(new Point(0, 0), 0, 0, 0);

	this.rescale = function() {

		this.rectangle.rescale(
			//new Point(this.center.x, this.center.y),
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
	this.draw = function(aContext) {
		aContext.lineWidth = RING_MAX_LINE_WIDTH * (this.radius / MAX_SIDE);
		aContext.strokeStyle = '#000000';
		aContext.fillStyle = '#CCCCCC';

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

	//calculations
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
	this.draw = function(aContext) {
		aContext.lineWidth = RING_MAX_LINE_WIDTH * (this.radius / MAX_SIDE);
		aContext.strokeStyle = '#000000';
		aContext.fillStyle = '#CCCCCC';

		var currentAngle = this.angle * (Math.PI / 180);
		//console.log((radStartAngle + currentAngle) + "==" + (radEndAngle + currentAngle));
		console.log(this.angle + " " + currentAngle);
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