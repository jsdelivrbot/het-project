const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const uuid = require('uuid');
const app = express();

app.use(express.static('public'));

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const frameListeners = {};

const newScreen = (ws, frameSize) => ({
	id: uuid(),
	ws: ws,
	frameSize: frameSize
});

const operations = {
	registerFrameListener: ({ id, ws, frameSize = 50, pos = [0, 0] }) => {
		const screen = newScreen(ws, frameSize);

		frameListeners[id] = frameListeners[id] ? {
			pos: pos,
			screens: (frameListeners[id].screens || []).concat(screen)
		} : {
			pos: pos,
			screens: [screen]
		};
		ws.send(JSON.stringify({
			operation: "registerFrameListener",
			screenId: screen.id
		}));
	},
	removeFrameListener: ({id}) => {
		delete frameListeners[id];
	}
};

setInterval(() => {
	Object.keys(frameListeners).forEach(id => {
		console.log(frameListeners[id].screens.length);

		frameListeners[id].screens.forEach(screen => {
			screen.ws.send(`your id is ${id} and your screen id is ${screen.id}`, err => {});
		})
	});

}, 1000);

wss.on('connection', (ws) => {
	ws.on('message', (payload) => {
		const msg = JSON.parse(payload);
		const { operation } = msg;
		operations[operation](Object.assign({ws: ws}, msg));
	});
	ws.send('you are conned');
});

server.listen(4567, () => console.log(`Listening on ${server.address().port}`));

