import uuid from "uuid";

const maxAcc = 3;
const rad90 = 90 * (Math.PI / 180);
const rad180 = Math.PI;
const rad360 = 360 * (Math.PI / 180);

class Marble {

	constructor({ x, y, angle,  radius, 
			collidesWithBar, collidesWithMarble }) {
		this._id = uuid();
		this._x = x;
		this._y = y;
		this.x1 = x; 
		this.y1 = y;
		this.acc = 0;
		this.ang = angle;
		this.collidesWithBar = collidesWithBar;
		this.collidesWithMarble = collidesWithMarble;
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
		
		const collision = this.collidesWithBar(this, rad90);
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
		

		this.collidesWithMarble(this);

	};

	bounceAwayFrom(otherMarble, distance) {
		const amount = (this.radius + otherMarble.radius) - distance;

		this._x = otherMarble._x < this._x ? 
			otherMarble._x + otherMarble.radius + this.radius :
			otherMarble._x - otherMarble.radius - this.radius;

		this.x1 = parseInt(Math.ceil(this._x), 10);

	}

	draw(ctx) {
		ctx.beginPath();
		ctx.fillStyle = "red";
		ctx.strokeStyle = "rgba(255,255,255,0.5)";
		ctx.strokeWidth = 1;
		ctx.arc(
			this.x1, this.y1,
			this.radius - 0.1,  0, 2 * Math.PI, false
		)
		ctx.stroke();
		ctx.fill();
	};
}

export default Marble;