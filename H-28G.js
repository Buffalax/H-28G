var rings = [];
var canvas = document.getElementById("canvas");
var context = canvas.getContext('2d');
var WIDTH = canvas.width;
var HEIGHT = canvas.height;
var CENTER_X = WIDTH / 2;
var CENTER_Y = HEIGHT / 2;
var MAX_SIDE = Math.max(WIDTH, HEIGHT);
var MAX_LINE_WIDTH = 20;
var RING_SPAWN_RATE = 1000;
var FPS = 60;

var INITIAL_SPEED = 1;
var SPEED = INITIAL_SPEED;
var SPEED_INCREMENT = 0;

spawnRing = function () {
    rings.unshift(new Ring());
};

action = function () {
    for (var i = 0, len = rings.length; i < len; i++) {
        rings[i].act();
    }
};

drawBgr = function () {
    context.rect(0, 0, WIDTH, HEIGHT);
    context.fillStyle = '#FFFFFF';
    context.fill();
};

draw = function () {
    drawBgr();
    for (var i = 0, len = rings.length; i < len; i++) {
        rings[i].draw();
    }
};

loop = function () {
    action();
    draw();
    SPEED += SPEED_INCREMENT;
};

function Ring() {
    this.radius = 0;
    this.draw = function () {
        emptyRing(this.radius);
    };
    this.act = function () {
        if (this.radius > MAX_SIDE) {
            rings.pop();
        }
        this.radius += SPEED;
    };
}

emptyRing = function (radius) {
    context.beginPath();
    context.arc(CENTER_X, CENTER_Y, radius, 0, 2 * Math.PI, false);
    context.lineWidth = MAX_LINE_WIDTH * (radius / MAX_SIDE);
    context.strokeStyle = '#000000';
    context.stroke();
};


initGame = function () {
    setInterval(spawnRing, RING_SPAWN_RATE);
    setInterval(loop, 1000 / FPS);
};

initGame();