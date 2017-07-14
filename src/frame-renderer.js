export default (ctx) => {
	let width, height;

	return { 
		onResize: (w, h) => {
			width = w;
			height = h;
		},
		render: (drawables) => {
			ctx.clearRect(0, 0, width, height);
			for (var i = 0; i < drawables.length; i++) {
				drawables[i].draw(ctx);
			}
		}
	}
}