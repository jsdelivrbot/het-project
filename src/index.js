import Marble from "./marble";
import Bar from "./bar";
import collidersMaker from "./colliders";
import frameRendererMaker from "./frame-renderer";
import { addBar, removeBar, getBars } from "./bars";
import { addMarble, removeMarble, getMarbles } from "./marbles";

const can = document.getElementById("can");
const ctx = can.getContext('2d');


const colliders = collidersMaker(getBars, getMarbles);

addBar([
	new Bar(140, 50, 30, 0, 2),
	new Bar(240, 50, 30, 0, 2),
	new Bar(140, 150, 150, 5, 4),
	new Bar(240, 250, 150, 175, 4),
	new Bar(140, 300, 150, 5, 4),
	new Bar(240, 350, 150, 0, 4),
]);

const baseMarbleOpts = {
	y: 41, 
	angle: 0, 
	radius: 8,
	collidesWithBar: colliders.marbleCollidesWithBar,
	collidesWithMarble: colliders.marbleCollidesWithMarble
};

addMarble([

	new Marble({...baseMarbleOpts, x: 120}),
	new Marble({...baseMarbleOpts, x: 132, y: 10}),
	new Marble({...baseMarbleOpts, x: 220}),
	new Marble({...baseMarbleOpts, x: 232, y: 10}),
	new Marble({...baseMarbleOpts, x: 132, y: 10}),
]);

const frameRenderer = frameRendererMaker(ctx);

window.setTimeout(function() { removeBar(0) }, 3000);
window.setTimeout(function() { removeBar(0) }, 5000);
/*window.setTimeout(function() { removeMarble(0); }, 6000);
window.setTimeout(function() { removeMarble(0); }, 6100);
window.setTimeout(function() { removeMarble(0); }, 6200);
window.setTimeout(function() { removeMarble(0); }, 6300);
*/


window.setInterval(function() {
	const marbles = getMarbles();
	for (var i = 0; i < marbles.length; i++) {
		marbles[i].accelerate();
	}
	frameRenderer.render(getMarbles().concat(getBars()));
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
