import Marble from "./marble";
import Bar from "./bar";

var can = document.getElementById("can");
var ctx = can.getContext('2d');


var bars = [
	new Bar(140, 50, 30, 0, 2),
	new Bar(240, 50, 30, 0, 2),
	new Bar(140, 150, 150, 25, 4)
];

var marbles = [
	new Marble(120, 10, 0, bars, 8, ctx), 
	new Marble(140, 10, 0, bars, 8, ctx),
	new Marble(220, 10, 0, bars, 8, ctx), 
	new Marble(240, 10, 0, bars, 8, ctx),
];

window.setTimeout(function() { bars.shift(); }, 3000);

window.setTimeout(function() { bars.shift(); }, 2000);


var FrameRenderer = function(ctx) {
	var width, height;
	this.onResize = function(w, h) {
		width = w;
		height = h;
	};
	
	function render() {
		ctx.clearRect(0,0,width,height);
		for (var i = 0; i < bars.length; i++) {
			bars[i].draw(ctx);
		}
		for (var i = 0; i < marbles.length; i++) {
			marbles[i].draw(ctx);
		}
		requestAnimationFrame(render);
	}

	requestAnimationFrame(render);
	return this;
};

var frameRenderer = new FrameRenderer(ctx);

window.setInterval(function() {
	for (var i = 0; i < marbles.length; i++) {
		marbles[i].accelerate();
	}
}, 10);

var resizeListeners = (function(canvas) {
	function log() { console.log(arguments); }
	function rescaleGame(width, height) {
		canvas.width = width;
		canvas.height = height;
	}

	return [log, rescaleGame, frameRenderer.onResize];
})(can);

var viewPort = (function(listeners) {
	function onResize() {
		resizeListeners.forEach(function (listener) { 
			listener(window.innerWidth, window.innerHeight);
		});
	}
	
	onResize();
	window.addEventListener("resize", onResize);
	return this;
})(resizeListeners);
