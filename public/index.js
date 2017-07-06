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
/***/ function(module, exports) {

	"use strict";

	var ws = new WebSocket("ws://localhost:4567");

	ws.onopen = function () {
	    ws.onmessage = function (ev) {
	        console.log(ev.data);
	    };

	    var userId = "";

	    window.fbAsyncInit = function () {
	        var handleLoginStatus = function handleLoginStatus(_ref) {
	            var status = _ref.status;

	            if (status === 'connected') {
	                document.querySelector("#login-container").style.display = "none";
	                document.querySelector("#user-info").style.display = "block";
	                FB.api('/me', { fields: 'first_name' }, function (_ref2) {
	                    var id = _ref2.id,
	                        first_name = _ref2.first_name;

	                    document.querySelector("#username").innerHTML = "Ingelogd als " + first_name;
	                    userId = id;
	                    ws.send(JSON.stringify({
	                        operation: "registerFrameListener",
	                        id: id
	                    }));
	                });
	            } else {
	                document.querySelector("#login-container").style.display = "block";
	                document.querySelector("#user-info").style.display = "none";
	            }
	        };

	        FB.Event.subscribe('auth.authResponseChange', handleLoginStatus);
	        FB.getLoginStatus();
	    };

	    (function (d, s, id) {
	        var js,
	            fjs = d.getElementsByTagName(s)[0];
	        if (d.getElementById(id)) return;
	        js = d.createElement(s);
	        js.id = id;
	        js.src = "//connect.facebook.net/nl_NL/sdk.js#xfbml=1&version=v2.9&appId=456085871089952";
	        fjs.parentNode.insertBefore(js, fjs);
	    })(document, 'script', 'facebook-jssdk');

	    document.querySelector("#logout-button").addEventListener('click', function () {
	        FB.logout();
	        ws.send(JSON.stringify({
	            operation: "removeFrameListener",
	            id: userId
	        }));
	    });

	    window.addEventListener('beforeunload', function () {
	        ws.send(JSON.stringify({
	            operation: "removeFrameListener",
	            id: userId
	        }));
	    });
	};

/***/ }
/******/ ]);