/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _frameRenderer = __webpack_require__(1);

	var _frameRenderer2 = _interopRequireDefault(_frameRenderer);

	var _resizeListeners = __webpack_require__(2);

	var _resizeListeners2 = _interopRequireDefault(_resizeListeners);

	var _viewport = __webpack_require__(3);

	var _viewport2 = _interopRequireDefault(_viewport);

	var _eventListeners = __webpack_require__(4);

	var _eventListeners2 = _interopRequireDefault(_eventListeners);

	var _marble = __webpack_require__(5);

	var _marble2 = _interopRequireDefault(_marble);

	var _bar = __webpack_require__(11);

	var _bar2 = _interopRequireDefault(_bar);

	var _colliders = __webpack_require__(12);

	var _colliders2 = _interopRequireDefault(_colliders);

	var _bars = __webpack_require__(14);

	var _marbles = __webpack_require__(15);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var eventListeners = (0, _eventListeners2.default)(380);

	var can = document.getElementById("can");
	var ctx = can.getContext('2d');
	var textCan = document.getElementById("text-can");
	var textCtx = textCan.getContext('2d');
	var frameRenderer = (0, _frameRenderer2.default)(ctx, 380);
	var textRenderer = (0, _frameRenderer2.default)(textCtx, 380);

	var colliders = (0, _colliders2.default)(_bars.getBars, _marbles.getMarbles);

	var renderLoop = function renderLoop() {
		frameRenderer.render((0, _marbles.getMarbles)().concat((0, _bars.getBars)()));
		requestAnimationFrame(renderLoop);
	};

	(0, _viewport2.default)((0, _resizeListeners2.default)([can, textCan], frameRenderer.onResize, textRenderer.onResize, eventListeners.onResize));

	renderLoop();

	var game = function game(onFinish) {
		var leftSide = parseInt(Math.random() * 9, 10) + 1;
		var rightSide = parseInt(Math.random() * (10 - leftSide), 10) + 1;
		var textOpts = { y: 40, fill: "green", font: "bold 26px sans-serif" };

		var clearLeftText = textRenderer.drawText(leftSide, _extends({}, textOpts, {
			x: 20 }));
		var clearRightText = textRenderer.drawText(rightSide, _extends({}, textOpts, {
			x: 200 }));
		var clearPlus = textRenderer.drawText("+", _extends({}, textOpts, {
			x: 110 }));
		var clearEquals = textRenderer.drawText("=", _extends({}, textOpts, {
			x: 290 }));
		var sumCount = 0,
		    sumTextClear = function sumTextClear() {};

		var baseMarbleOpts = {
			y: 70,
			angle: 0,
			radius: 10,
			collidesWithBar: colliders.marbleCollidesWithBar,
			collidesWithMarble: colliders.marbleCollidesWithMarble
		};

		for (var i = 0; i < leftSide; i++) {
			var x = 10 + i * 20;
			(0, _marbles.addMarble)(new _marble2.default(_extends({}, baseMarbleOpts, { x: x })));
		}

		for (var _i = 0; _i < rightSide; _i++) {
			var _x = 200 + _i * 20;
			(0, _marbles.addMarble)(new _marble2.default(_extends({}, baseMarbleOpts, { x: _x })));
		}

		(0, _bars.addBar)([new _bar2.default(140, 150, 150, 5, 4), new _bar2.default(240, 200, 150, 175, 4), new _bar2.default(100, 300, 100, 5, 4), new _bar2.default(190, 370, 250, 0, 4)]);

		eventListeners.clear();

		eventListeners.add("touchstart", function (name, ev, scale) {
			var _ev$touches$ = ev.touches[0],
			    clientX = _ev$touches$.clientX,
			    clientY = _ev$touches$.clientY;

			var x = clientX / scale;
			var y = clientY / scale;
			var foundMarble = (0, _marbles.getMarbles)().find(function (marble, idx) {
				return x > marble._x - marble.radius && x < marble._x + marble.radius && y > marble._y - marble.radius && y < marble._y + marble.radius;
			});

			if (foundMarble) {
				foundMarble.active = true;
			}
		});

		var interval = window.setInterval(function () {
			(0, _marbles.getMarbles)().filter(function (m) {
				return m.active;
			}).forEach(function (m) {
				m.accelerate();
				if (m._y > 358 && !m.done) {
					m.done = true;
					m.fill = "green";
					sumTextClear();
					sumTextClear = textRenderer.drawText(++sumCount, _extends({}, textOpts, { x: 340,
						fill: sumCount === leftSide + rightSide ? "green" : "red" }));
					if (sumCount === leftSide + rightSide) {
						window.setTimeout(finishGame, 2000);
					}
				}
			});
		}, 5);

		function finishGame() {
			window.clearInterval(interval);
			(0, _marbles.clearMarbles)();
			(0, _bars.clearBars)();
			clearPlus();
			clearLeftText();
			clearEquals();
			clearRightText();
			sumTextClear();
			onFinish();
		}
	};

	var startGame = function startGame() {
		return game(startGame);
	};

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

/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	exports.default = function (ctx, vWidth) {
		var width = void 0,
		    height = void 0,
		    scale = void 0;

		return {
			onResize: function onResize(w, h) {
				width = w;
				height = h;
				scale = w < h ? w / vWidth : w / 2 / vWidth;
			},
			render: function render(drawables) {
				ctx.clearRect(0, 0, width, height);
				for (var i = 0; i < drawables.length; i++) {
					drawables[i].draw(ctx, scale);
				}
			},
			drawText: function drawText(txt, _ref) {
				var _ref$x = _ref.x,
				    x = _ref$x === undefined ? 50 : _ref$x,
				    _ref$y = _ref.y,
				    y = _ref$y === undefined ? 50 : _ref$y,
				    _ref$timeout = _ref.timeout,
				    timeout = _ref$timeout === undefined ? null : _ref$timeout,
				    _ref$fill = _ref.fill,
				    fill = _ref$fill === undefined ? null : _ref$fill,
				    _ref$font = _ref.font,
				    font = _ref$font === undefined ? null : _ref$font,
				    _ref$shade = _ref.shade,
				    shade = _ref$shade === undefined ? false : _ref$shade,
				    _ref$shadeDistance = _ref.shadeDistance,
				    shadeDistance = _ref$shadeDistance === undefined ? null : _ref$shadeDistance;

				var _x = parseInt(Math.ceil(x * scale), 10);
				var _y = parseInt(Math.ceil(y * scale), 10);
				ctx.font = font || "bold 12px sans-serif";
				if (shade) {
					ctx.fillStyle = shade;
					ctx.fillText(txt, _x + (shadeDistance || 2), _y + (shadeDistance || 2));
				}
				ctx.fillStyle = fill || "#a00";
				ctx.fillText(txt, _x, _y);
				var width = ctx.measureText(txt).width;
				var doClear = function doClear() {
					return ctx.clearRect(_x, _y - 27, width + 5, 32);
				};
				if (timeout) {
					setTimeout(doClear, timeout || 500);
				}
				return doClear;
			}
		};
	};

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	exports.default = function (canvases) {
		for (var _len = arguments.length, listeners = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
			listeners[_key - 1] = arguments[_key];
		}

		function rescaleGame(width, height) {
			canvases.forEach(function (canvas) {
				canvas.width = width;
				canvas.height = height;
			});
		}

		return [rescaleGame].concat(listeners);
	};

/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	exports.default = function (listeners) {
		function onResize() {
			listeners.forEach(function (listener) {
				listener(window.innerWidth, window.innerHeight);
			});
		}

		onResize();
		window.addEventListener("resize", onResize);
	};

/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	exports.default = function (vWidth) {
		var width = void 0,
		    height = void 0,
		    scale = void 0;
		var registered = [];

		return {
			onResize: function onResize(w, h) {
				width = w;
				height = h;
				scale = w < h ? w / vWidth : w / 2 / vWidth;
			},
			add: function add(eventName, onEvent) {
				var fn = function fn(ev) {
					return onEvent(eventName, ev, scale);
				};

				registered.push({ eventName: eventName, fn: fn });
				window.addEventListener(eventName, fn);
			},
			clear: function clear() {
				registered.forEach(function (_ref) {
					var eventName = _ref.eventName,
					    fn = _ref.fn;
					return window.removeEventListener(eventName, fn);
				});
			}
		};
	};

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _uuid = __webpack_require__(6);

	var _uuid2 = _interopRequireDefault(_uuid);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var maxAcc = 3;
	var rad90 = 90 * (Math.PI / 180);
	var rad180 = Math.PI;
	var rad360 = 360 * (Math.PI / 180);

	var Marble = function () {
		function Marble(_ref) {
			var x = _ref.x,
			    y = _ref.y,
			    angle = _ref.angle,
			    radius = _ref.radius,
			    collidesWithBar = _ref.collidesWithBar,
			    collidesWithMarble = _ref.collidesWithMarble;

			_classCallCheck(this, Marble);

			this._id = (0, _uuid2.default)();
			this._x = x;
			this._y = y;
			this.x1 = x;
			this.y1 = y;
			this.acc = 0;
			this.ang = angle;
			this.collidesWithBar = collidesWithBar;
			this.collidesWithMarble = collidesWithMarble;
			this.radius = radius;
			this.active = false;
			this.fill = "red";
		}

		_createClass(Marble, [{
			key: "gravAcceleration",
			value: function gravAcceleration() {
				return this.ang > rad90 ? (rad180 - this.ang) * 0.008 : this.ang * 0.008;
			}
		}, {
			key: "accelerate",
			value: function accelerate() {
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

				this.collidesWithMarble(this);
			}
		}, {
			key: "bounceAwayFrom",
			value: function bounceAwayFrom(otherMarble, distance) {
				var amount = this.radius + otherMarble.radius - distance;

				this._x = otherMarble._x < this._x ? otherMarble._x + otherMarble.radius + this.radius : otherMarble._x - otherMarble.radius - this.radius;

				this.x1 = parseInt(Math.ceil(this._x), 10);
			}
		}, {
			key: "draw",
			value: function draw(ctx, scale) {
				ctx.beginPath();
				ctx.fillStyle = this.fill;
				ctx.strokeStyle = "rgba(255,255,255,0.5)";
				ctx.strokeWidth = 1;
				ctx.arc(this.x1 * scale, this.y1 * scale, this.radius * scale, 0, 2 * Math.PI, false);
				ctx.stroke();
				ctx.fill();
			}
		}]);

		return Marble;
	}();

	exports.default = Marble;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var v1 = __webpack_require__(7);
	var v4 = __webpack_require__(10);

	var uuid = v4;
	uuid.v1 = v1;
	uuid.v4 = v4;

	module.exports = uuid;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var rng = __webpack_require__(8);
	var bytesToUuid = __webpack_require__(9);

	// **`v1()` - Generate time-based UUID**
	//
	// Inspired by https://github.com/LiosK/UUID.js
	// and http://docs.python.org/library/uuid.html

	// random #'s we need to init node and clockseq
	var _seedBytes = rng();

	// Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
	var _nodeId = [
	  _seedBytes[0] | 0x01,
	  _seedBytes[1], _seedBytes[2], _seedBytes[3], _seedBytes[4], _seedBytes[5]
	];

	// Per 4.2.2, randomize (14 bit) clockseq
	var _clockseq = (_seedBytes[6] << 8 | _seedBytes[7]) & 0x3fff;

	// Previous uuid creation time
	var _lastMSecs = 0, _lastNSecs = 0;

	// See https://github.com/broofa/node-uuid for API details
	function v1(options, buf, offset) {
	  var i = buf && offset || 0;
	  var b = buf || [];

	  options = options || {};

	  var clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq;

	  // UUID timestamps are 100 nano-second units since the Gregorian epoch,
	  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
	  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
	  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.
	  var msecs = options.msecs !== undefined ? options.msecs : new Date().getTime();

	  // Per 4.2.1.2, use count of uuid's generated during the current clock
	  // cycle to simulate higher resolution clock
	  var nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1;

	  // Time since last uuid creation (in msecs)
	  var dt = (msecs - _lastMSecs) + (nsecs - _lastNSecs)/10000;

	  // Per 4.2.1.2, Bump clockseq on clock regression
	  if (dt < 0 && options.clockseq === undefined) {
	    clockseq = clockseq + 1 & 0x3fff;
	  }

	  // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
	  // time interval
	  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
	    nsecs = 0;
	  }

	  // Per 4.2.1.2 Throw error if too many uuids are requested
	  if (nsecs >= 10000) {
	    throw new Error('uuid.v1(): Can\'t create more than 10M uuids/sec');
	  }

	  _lastMSecs = msecs;
	  _lastNSecs = nsecs;
	  _clockseq = clockseq;

	  // Per 4.1.4 - Convert from unix epoch to Gregorian epoch
	  msecs += 12219292800000;

	  // `time_low`
	  var tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
	  b[i++] = tl >>> 24 & 0xff;
	  b[i++] = tl >>> 16 & 0xff;
	  b[i++] = tl >>> 8 & 0xff;
	  b[i++] = tl & 0xff;

	  // `time_mid`
	  var tmh = (msecs / 0x100000000 * 10000) & 0xfffffff;
	  b[i++] = tmh >>> 8 & 0xff;
	  b[i++] = tmh & 0xff;

	  // `time_high_and_version`
	  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version
	  b[i++] = tmh >>> 16 & 0xff;

	  // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)
	  b[i++] = clockseq >>> 8 | 0x80;

	  // `clock_seq_low`
	  b[i++] = clockseq & 0xff;

	  // `node`
	  var node = options.node || _nodeId;
	  for (var n = 0; n < 6; ++n) {
	    b[i + n] = node[n];
	  }

	  return buf ? buf : bytesToUuid(b);
	}

	module.exports = v1;


/***/ },
/* 8 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {// Unique ID creation requires a high quality random # generator.  In the
	// browser this is a little complicated due to unknown quality of Math.random()
	// and inconsistent support for the `crypto` API.  We do the best we can via
	// feature-detection
	var rng;

	var crypto = global.crypto || global.msCrypto; // for IE 11
	if (crypto && crypto.getRandomValues) {
	  // WHATWG crypto RNG - http://wiki.whatwg.org/wiki/Crypto
	  var rnds8 = new Uint8Array(16); // eslint-disable-line no-undef
	  rng = function whatwgRNG() {
	    crypto.getRandomValues(rnds8);
	    return rnds8;
	  };
	}

	if (!rng) {
	  // Math.random()-based (RNG)
	  //
	  // If all else fails, use Math.random().  It's fast, but is of unspecified
	  // quality.
	  var rnds = new Array(16);
	  rng = function() {
	    for (var i = 0, r; i < 16; i++) {
	      if ((i & 0x03) === 0) r = Math.random() * 0x100000000;
	      rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
	    }

	    return rnds;
	  };
	}

	module.exports = rng;

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 9 */
/***/ function(module, exports) {

	/**
	 * Convert array of 16 byte values to UUID string format of the form:
	 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
	 */
	var byteToHex = [];
	for (var i = 0; i < 256; ++i) {
	  byteToHex[i] = (i + 0x100).toString(16).substr(1);
	}

	function bytesToUuid(buf, offset) {
	  var i = offset || 0;
	  var bth = byteToHex;
	  return bth[buf[i++]] + bth[buf[i++]] +
	          bth[buf[i++]] + bth[buf[i++]] + '-' +
	          bth[buf[i++]] + bth[buf[i++]] + '-' +
	          bth[buf[i++]] + bth[buf[i++]] + '-' +
	          bth[buf[i++]] + bth[buf[i++]] + '-' +
	          bth[buf[i++]] + bth[buf[i++]] +
	          bth[buf[i++]] + bth[buf[i++]] +
	          bth[buf[i++]] + bth[buf[i++]];
	}

	module.exports = bytesToUuid;


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var rng = __webpack_require__(8);
	var bytesToUuid = __webpack_require__(9);

	function v4(options, buf, offset) {
	  var i = buf && offset || 0;

	  if (typeof(options) == 'string') {
	    buf = options == 'binary' ? new Array(16) : null;
	    options = null;
	  }
	  options = options || {};

	  var rnds = options.random || (options.rng || rng)();

	  // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
	  rnds[6] = (rnds[6] & 0x0f) | 0x40;
	  rnds[8] = (rnds[8] & 0x3f) | 0x80;

	  // Copy bytes to buffer, if provided
	  if (buf) {
	    for (var ii = 0; ii < 16; ++ii) {
	      buf[i + ii] = rnds[ii];
	    }
	  }

	  return buf || bytesToUuid(rnds);
	}

	module.exports = v4;


/***/ },
/* 11 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Bar = function () {
		function Bar(x, y, radius, rotation, thickness) {
			_classCallCheck(this, Bar);

			this.x = x;
			this.y = y;
			this.radius = radius;
			this.rotation = rotation;
			this.thickness = thickness;
			this.setRotation(rotation);
		}

		_createClass(Bar, [{
			key: "setRotation",
			value: function setRotation(rot) {
				this.ang = rot * (Math.PI / 180);
				this.ly = parseInt(Math.ceil(this.y - Math.sin(this.ang) * this.radius), 10);
				this.lx = parseInt(Math.ceil(this.x - Math.cos(this.ang) * this.radius), 10);
				this.rx = parseInt(Math.ceil(this.x + Math.cos(this.ang) * this.radius), 10);
				this.ry = parseInt(Math.ceil(this.y + Math.sin(this.ang) * this.radius), 10);
			}
		}, {
			key: "draw",
			value: function draw(ctx, scale) {
				ctx.beginPath();
				ctx.lineWidth = this.thickness * scale;
				ctx.strokeStyle = "rgb(128,128,0)";
				ctx.moveTo(this.lx * scale, this.ly * scale);
				ctx.lineTo(this.rx * scale, this.ry * scale);
				ctx.stroke();
			}
		}, {
			key: "getLineVector",
			value: function getLineVector() {
				return [this.lx, this.ly, this.rx, this.ry];
			}
		}, {
			key: "getAngle",
			value: function getAngle() {
				return this.ang;
			}
		}]);

		return Bar;
	}();

	exports.default = Bar;

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _linesIntersect = __webpack_require__(13);

	var _linesIntersect2 = _interopRequireDefault(_linesIntersect);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = function (getBars, getMarbles) {
		return {
			marbleCollidesWithBar: function marbleCollidesWithBar(marble, _ang) {
				var bars = getBars();
				for (var i = 0; i < bars.length; i++) {
					var collides = (0, _linesIntersect2.default)(bars[i].getLineVector(), [marble._x - Math.cos(_ang) * (marble.radius + 1), marble._y - Math.cos(_ang) * (marble.radius + 1), marble._x + Math.cos(_ang) * (marble.radius + 1), marble._y + Math.sin(_ang) * (marble.radius + 1)]);
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
			},
			marbleCollidesWithMarble: function marbleCollidesWithMarble(marble) {
				return getMarbles().filter(function (m) {
					return m._id !== marble._id;
				}).map(function (m) {
					return {
						distance: Math.sqrt(Math.pow(m._x - marble._x, 2) + Math.pow(m._y - marble._y, 2)),
						m: m
					};
				}).filter(function (obj) {
					return obj.distance < marble.radius + obj.m.radius;
				}).forEach(function (obj) {
					obj.m.bounceAwayFrom(marble, obj.distance);
				});
			}
		};
	};

/***/ },
/* 13 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	// TODO: attribute
	exports.default = function (lineA, lineB) {
		var A = { X: lineA[0], Y: lineA[1] },
		    B = { X: lineA[2], Y: lineA[3] },
		    C = { X: lineB[0], Y: lineB[1] },
		    D = { X: lineB[2], Y: lineB[3] },
		    CmP = { X: C.X - A.X, Y: C.Y - A.Y },
		    r = { X: B.X - A.X, Y: B.Y - A.Y },
		    s = { X: D.X - C.X, Y: D.Y - C.Y },
		    CmPxr = CmP.X * r.Y - CmP.Y * r.X,
		    CmPxs = CmP.X * s.Y - CmP.Y * s.X,
		    rxs = r.X * s.Y - r.Y * s.X;

		if (CmPxr === 0) {
			return C.X - A.X < 0 != C.X - B.X < 0 || C.Y - A.Y < 0 != C.Y - B.Y < 0;
		}

		if (rxs == 0) {
			return false;
		}
		var rxsr = 1 / rxs,
		    t = CmPxs * rxsr,
		    u = CmPxr * rxsr;

		return t >= 0 && t <= 1 && u >= 0 && u <= 1;
	};

/***/ },
/* 14 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var bars = [];

	var addBar = function addBar() {
		var toAdd = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

		bars = bars.concat(toAdd);
		return bars.length - 1;
	};

	var clearBars = function clearBars() {
		return bars = [];
	};

	var getBars = function getBars() {
		return bars;
	};

	exports.addBar = addBar;
	exports.clearBars = clearBars;
	exports.getBars = getBars;

/***/ },
/* 15 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var marbles = [];

	var addMarble = function addMarble() {
		var toAdd = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

		marbles = marbles.concat(toAdd);
		return marbles.length - 1;
	};

	var clearMarbles = function clearMarbles() {
		return marbles = [];
	};

	var getMarbles = function getMarbles() {
		return marbles;
	};

	exports.addMarble = addMarble;
	exports.clearMarbles = clearMarbles;
	exports.getMarbles = getMarbles;

/***/ }
/******/ ]);