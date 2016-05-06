'use strict';

var _vue = require('vue');

var _vue2 = _interopRequireDefault(_vue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

var vm = new _vue2.default({
  el: '#root',
  data: {
    message: "Hello world!",
    todos: [{ text: 'Learn JavaScript' }, { text: 'Learn JavaScript' }, { text: 'Build Something Awesome' }] }
});