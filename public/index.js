'use strict';

var socket = new WebSocket('ws://localhost:3000');

socket.onopen = function (event) {
			socket.send('something');
			socket.onmessage = function (event) {
						console.log('received: ' + event.data);
			};
			socket.onclose = function (event) {
						console.log('server closed: ' + event);
			};
			//socket.close()
};