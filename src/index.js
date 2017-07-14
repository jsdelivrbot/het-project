import Marble from "./marble";
import Bar from "./bar";
import collidersMaker from "./colliders";
import frameRendererMaker from "./frame-renderer";

const can = document.getElementById("can");
const ctx = can.getContext('2d');


let bars = [
	new Bar(140, 50, 30, 0, 2),
	new Bar(240, 50, 30, 0, 2),
	new Bar(140, 150, 150, 5, 4),
	new Bar(240, 250, 150, 175, 4)
];

const colliders = collidersMaker(bars);

const baseMarbleOpts = {
	y: 10, 
	angle: 0, 
	radius: 8,
	collidesWithBar: colliders.marbleCollidesWithBar
};

let marbles = [
	new Marble({...baseMarbleOpts, x: 120}),
	new Marble({...baseMarbleOpts, x: 140}),
	new Marble({...baseMarbleOpts, x: 220}),
	new Marble({...baseMarbleOpts, x: 240}),
];

const frameRenderer = frameRendererMaker(ctx);

window.setTimeout(function() { bars.shift(); }, 3000);
window.setTimeout(function() { bars.shift(); }, 2000);
window.setTimeout(function() { marbles.shift(); }, 6000);
window.setTimeout(function() { marbles.shift(); }, 6100);
window.setTimeout(function() { marbles.shift(); }, 6200);
window.setTimeout(function() { marbles.shift(); }, 6300);



window.setInterval(function() {
	for (var i = 0; i < marbles.length; i++) {
		marbles[i].accelerate();
	}
	frameRenderer.render(marbles.concat(bars));
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
