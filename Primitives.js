function Point(aX, aY) {
	this.x = aX;
	this.y = aY;
	this.rotate = function(aAngle, aPoint) {
		if (aPoint.x !== this.x || aPoint.y !== this.y) {
			this.x -= aPoint.x;
			this.y -= aPoint.y;
			var radAngle = (Math.PI * 2) * (aAngle / 360);
			var s = Math.sin(radAngle);
			var c = Math.cos(radAngle);

			var newX = this.x * c - this.y * s;
			var newY = this.x * s + this.y * c;

			this.x = newX + aPoint.x;
			this.y = newY + aPoint.y;
		}
	};
}

function Line(aP1, aP2) {
	this.p1 = aP1;
	this.p2 = aP2;
	this.rotate = function(aAngle, aPoint) {
		this.p1.rotate(aAngle, aPoint);
		this.p2.rotate(aAngle, aPoint);
	};
	this.draw = function(aContext) {
		aContext.moveTo(this.p1.x, this.p1.y);
		aContext.lineTo(this.p2.x, this.p2.y);
	};
}

function ReverseRectangle(aBeginning, aWidth, aHeight, aAngle) {

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