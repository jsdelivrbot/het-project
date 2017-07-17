export default (events, onEvent, vWidth) => {
	let width, height, scale;
	events.forEach(eventName => 
		window.addEventListener(eventName, ev =>
			onEvent(eventName, ev, scale)));

	return {
		onResize: (w, h) => {
			width = w;
			height = h;
			scale = w < h ? w / vWidth : (w / 2) / vWidth;
		}
	}

};