var RING_MAX_LINE_WIDTH = 20;
var canvas = document.getElementById("canvas");
var MAX_SIDE = Math.max(canvas.width, canvas.height);


function EmptyRing(aRadius, aCenter, aAngle) {
	this.radius = aRadius;
	this.center = aCenter;
	this.angle = aAngle;

	this.lineTop = new Line(new Point(0, 0), new Point(0, 0));
	this.lineBottom = new Line(new Point(0, 0), new Point(0, 0));
	this.lineLeft = new Line(new Point(0, 0), new Point(0, 0));
	this.lineRight = new Line(new Point(0, 0), new Point(0, 0));

	this.rescale = function() {
		this.lineTop.p1.x = this.center.x;
		this.lineTop.p1.y = this.center.y - this.radius;
		this.lineTop.p2.x = this.lineTop.p1.x;
		this.lineTop.p2.y = this.lineTop.p1.y + this.radius * 0.2;

		this.lineBottom.p1.x = this.center.x;
		this.lineBottom.p1.y = this.center.y + this.radius;
		this.lineBottom.p2.x = this.lineBottom.p1.x;
		this.lineBottom.p2.y = this.lineBottom.p1.y - this.radius * 0.2;

		this.lineLeft.p1.x = this.center.x - this.radius;
		this.lineLeft.p1.y = this.center.y;
		this.lineLeft.p2.x = this.lineLeft.p1.x + this.radius * 0.2;
		this.lineLeft.p2.y = this.lineLeft.p1.y;

		this.lineRight.p1.x = this.center.x + this.radius;
		this.lineRight.p1.y = this.center.y;
		this.lineRight.p2.x = this.lineRight.p1.x - this.radius * 0.2;
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


