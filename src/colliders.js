import linesIntersect from "./lines-intersect";

export default (bars) => {
	return {
		marbleCollidesWithBar: (marble, _ang) => {
			for (var i = 0; i < bars.length; i++) {
				var collides = linesIntersect(
					bars[i].getLineVector(),
					[
						marble._x, marble._y, 
						marble._x + Math.cos(_ang) * (marble.radius + 1),
						marble._y + Math.sin(_ang) * (marble.radius + 1)
					]
				);
				if (collides) {
					return {
						collides: true,
						angle: bars[i].getAngle()
					};
				}
			}
			return {
				collides: false
			};		
		}
	}
}