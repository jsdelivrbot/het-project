export default (ctx, vWidth) => {
	let width, height, scale;

	return { 
		onResize: (w, h) => {
			width = w;
			height = h;
			scale = w < h ? w / vWidth : (w / 2) / vWidth;
		},
		render: (drawables) => {
			ctx.clearRect(0, 0, width, height);
			for (var i = 0; i < drawables.length; i++) {
				drawables[i].draw(ctx, scale);
			}
		}
	}
}