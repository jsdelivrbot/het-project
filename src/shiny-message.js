export default function(txt, txtCtx, options) {
		var opts = options || {};
		var x = opts.x || (grid.getGhost().x * 10) / settings.scaleFactor;
		var y = opts.y || (grid.getGhost().y * 10) / settings.scaleFactor;

		txtCtx.font = opts.font || "bold 12px sans-serif";
		if(opts.shade) {
			txtCtx.fillStyle = opts.shade;
			txtCtx.fillText(txt, x + (opts.shadeDistance || 2), y + (opts.shadeDistance || 2));
		}
		txtCtx.fillStyle = opts.fill || "#a00";
		txtCtx.fillText(txt, x, y);
		var width = txtCtx.measureText(txt).width;
		setTimeout(function() {
			txtCtx.clearRect(x, y - 27, width + 5, 32);
		}, opts.timeout || 500);
};