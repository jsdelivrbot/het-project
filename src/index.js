import getFrameRenderer from "./frame-renderer";
import getResizeListeners from "./resize-listeners";
import initViewPort from "./viewport";
import getEventListeners from "./event-listeners";
import Marble from "./marble";
import Bar from "./bar";
import getColliders from "./colliders";
import { addBar, clearBars, getBars } from "./bars";
import { addMarble, clearMarbles, getMarbles } from "./marbles";


const eventListeners = getEventListeners(380);

const can = document.getElementById("can");
const ctx = can.getContext('2d');
const textCan = document.getElementById("text-can");
const textCtx = textCan.getContext('2d');
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

const game = (onFinish) => {
	const leftSide = parseInt(Math.random() * 9, 10) + 1;
	const rightSide = parseInt(Math.random() * (10 - leftSide), 10) + 1;
	const textOpts = {y: 40, fill: "green", font: "bold 26px sans-serif"};

	const clearLeftText = textRenderer.drawText(leftSide, {...textOpts,
		x: 20});
	const clearRightText = textRenderer.drawText(rightSide, {...textOpts,
		x: 200});
	const clearPlus = textRenderer.drawText("+", {...textOpts,
		x: 110});
	const clearEquals = textRenderer.drawText("=", {...textOpts,
		x: 290});
	let sumCount = 0, sumTextClear = () => {};

	const baseMarbleOpts = {
		y: 70, 
		angle: 0, 
		radius: 10,
		collidesWithBar: colliders.marbleCollidesWithBar,
		collidesWithMarble: colliders.marbleCollidesWithMarble,
	};


	for (let i = 0; i < leftSide; i++) {
		const x = 10 + i * 20
		addMarble(new Marble({...baseMarbleOpts, x: x}));
	}

	for (let i = 0; i < rightSide; i++) {
		const x = 200 + i * 20
		addMarble(new Marble({...baseMarbleOpts, x: x}));
	}

	addBar([
		new Bar(140, 150, 150, 5, 4),
		new Bar(240, 200, 150, 175, 4),
		new Bar(100, 300, 100, 5, 4),
		new Bar(190, 370, 250, 0, 4),
	]);


	eventListeners.clear();

	eventListeners.add("touchstart", (name, ev, scale) => {
		const {clientX, clientY} = ev.touches[0];
		const x = clientX / scale;
		const y = clientY / scale;
		const foundMarble = getMarbles()
			.find((marble, idx) => 
				x > marble._x - marble.radius &&
				x < marble._x + marble.radius &&
				y > marble._y - marble.radius &&
				y < marble._y + marble.radius
			);
		
		if (foundMarble) {
			foundMarble.active = true;
		}
	});


	const interval = window.setInterval(() => {
		getMarbles()
			.filter(m => m.active)
			.forEach(m => {
				m.accelerate();
				if (m._y > 358 && !m.done) {
					m.done = true;
					m.fill = "green";
					sumTextClear();
					sumTextClear = textRenderer.drawText(++sumCount, {
						...textOpts, x: 340, 
						fill: sumCount === leftSide + rightSide ? "green" : "red"});
					if (sumCount === leftSide + rightSide) {
						window.setTimeout(finishGame, 2000);
					}
				}
			})
	}, 5);

	function finishGame() {
		window.clearInterval(interval);
		clearMarbles();
		clearBars();
		clearPlus();
		clearLeftText();
		clearEquals();
		clearRightText();
		sumTextClear();
		onFinish();			
	}
};


const startGame = () =>
	game(startGame);

startGame();

/*

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

*/