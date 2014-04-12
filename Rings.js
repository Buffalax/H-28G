var RING_MAX_LINE_WIDTH = 20;
var canvas = document.getElementById("canvas");
var MAX_SIDE = Math.max(canvas.width, canvas.height);


function reverseRectangle(aBeginning, aWidth, aHeight, aAngle) {

	this.points = [new Point(0, 0), new Point(0, 0), new Point(0, 0), new Point(0, 0)];
	this.rescale = function(aBeginning, aWidth, aHeight) {
		this.points[0].x = aBeginning.x;
		this.points[0].y = aBeginning.y;

		this.points[1].x = aBeginning.x;
		this.points[1].y = aBeginning.y + aHeight;

		this.points[2].x = aBeginning.x + aWidth;
		this.points[2].y = this.points[1].y;

		this.points[3].x = this.points[2].x;
		this.points[3].y = this.points[0].y;
	};
	this.rotate = function(aAngle, aPoint) {
		for (var i = 0, len = this.points.length; i < len; i++) {
			this.points[i].rotate(aAngle, aPoint);
		}
	};
	this.draw = function(aContext) {
		aContext.moveTo(this.points[0].x, this.points[0].y);
		aContext.lineTo(this.points[1].x, this.points[1].y);
		aContext.lineTo(this.points[2].x, this.points[2].y);
		aContext.lineTo(this.points[3].x, this.points[3].y);
	}

	this.rescale(aBeginning, aWidth, aHeight);
	this.rotate(aAngle, this.points[0]);
}

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
		aContext.closePath();
		aContext.stroke();

		this.lineTop.draw(aContext);
		this.lineBottom.draw(aContext);
		this.lineLeft.draw(aContext);
		this.lineRight.draw(aContext);
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

	this.rectangle = new reverseRectangle(new Point(0, 0), 0, 0, 0);

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
