const maxAcc = 3;
const rad90 = 90 * (Math.PI / 180);
const rad180 = Math.PI;
const rad360 = 360 * (Math.PI / 180);

class Marble {

	constructor({ x, y, angle, collidesWithBar, radius }) {
		this._x = x;
		this._y = y;
		this.x1 = x; 
		this.y1 = y;
		this.acc = 0;
		this.ang = angle;
		this.collidesWithBar = collidesWithBar;
		this.radius = radius;
	}
	
	gravAcceleration() {
		return  this.ang > rad90
			? (rad180 - this.ang) * 0.008
			: this.ang * 0.008;
	}


	accelerate() {
		this.acc += this.gravAcceleration();
		this._y += Math.sin(this.ang) * this.acc;
		this._x += Math.cos(this.ang) * this.acc;
		this.x1 = parseInt(Math.ceil(this._x), 10);
		this.y1 = parseInt(Math.ceil(this._y), 10);
		
		var collision = this.collidesWithBar(this, rad90);
		if (collision.collides) {
			this.ang = collision.angle;
			if (collision.angle === rad180 || collision.angle === 0) {
				this.acc = 0;
			}
		} else {
			if (this.ang < rad90) {
				this.ang += 0.1;
			} else if (this.ang > rad90) {
				this.ang -= 0.1;
			}
		}
		

	};

	draw(ctx) {
		ctx.beginPath();
		ctx.fillStyle = "red";
		ctx.arc(
			this.x1, this.y1,
			this.radius - 1,  0, 2 * Math.PI, false
		)
		ctx.fill();
	};
}

export default Marble;