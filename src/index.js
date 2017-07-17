import getFrameRenderer from "./frame-renderer";
import getResizeListeners from "./resize-listeners";
import initViewPort from "./viewport";
import getEventListeners from "./event-listeners";
import Marble from "./marble";
import Bar from "./bar";
import getColliders from "./colliders";
import { addBar, removeBar, getBars } from "./bars";
import { addMarble, removeMarble, getMarbles } from "./marbles";

const getEventHandlers = (ev, scale) => ({
	touchstart: (ev, scale) => console.log("touchstart is impl", scale)
})

const can = document.getElementById("can");
const ctx = can.getContext('2d');
const textCan = document.getElementById("text-can");
const textCtx = textCan.getContext('2d');
const eventListeners = getEventListeners(
	["touchstart", "touchend"],
	(key, ev, scale) => 
		(getEventHandlers()[key] || 
			function() { console.warn(`event ${key} not registered`)})(ev, scale) ,
	380);
const frameRenderer = getFrameRenderer(ctx, 380);
const textRenderer = getFrameRenderer(textCtx, 380);

const colliders = getColliders(getBars, getMarbles);

const renderLoop = () => {
	frameRenderer.render(getMarbles().concat(getBars()));
	requestAnimationFrame(renderLoop);
};

initViewPort(getResizeListeners([can, textCan],
	frameRenderer.onResize, textRenderer.onResize, 
	eventListeners.onResize));
renderLoop();



textRenderer.drawText("bla", {
	fill: "green", 
	timeout: 1000,
	shade: "rgba(0,0,0,0.2)",
	shadeDistance: 2
});

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
	collidesWithMarble: colliders.marbleCollidesWithMarble,
};


addMarble([

	new Marble({...baseMarbleOpts, x: 120}),
	new Marble({...baseMarbleOpts, x: 132, y: 10}),
	new Marble({...baseMarbleOpts, x: 220}),
	new Marble({...baseMarbleOpts, x: 232, y: 10}),
	new Marble({...baseMarbleOpts, x: 132, y: 10}),
]);


window.setTimeout(function() { removeBar(0) }, 3000);
window.setTimeout(function() { removeBar(0) }, 5000);

window.setInterval(function() {
	const marbles = getMarbles();
	for (var i = 0; i < marbles.length; i++) {
		marbles[i].accelerate();
	}
}, 10);

