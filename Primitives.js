function Vector2(aX, aY) {
	this.x = aX;
	this.y = aY;
}

Vector2.prototype = {
	get width() {
		return this.x;
	},
	
	get height() {
		return this.y;
	}
};

Vector2.singularCirclePoint = function(aAngle) {
	return new Vector2(Math.cos(aAngle), Math.sin(aAngle));
};

Vector2.prototype.multiply = function(aXMult, aYMult) {
	var yMult = (arguments.length == 2) ? aYMult : aXMult; 
	return new Vector2(this.x * aXMult, this.y * yMult);
};

Vector2.prototype.translate = function(aXDiff, aYDiff) {
	var xDiff = aXDiff || 0;
	var yDiff = aYDiff || 0;

	return new Vector2(this.x + xDiff, this.y + yDiff);
};

Vector2.prototype.rotate = function(aAngle, aPoint) {
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

Vector2.prototype.minValue = function() {
	return Math.min(this.x, this.y);
};

Vector2.prototype.maxValue = function() {
	return Math.max(this.x, this.y);
};

var Point = Vector2;

// http://jsperf.com/js-getter-vs-prop

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