const socket = new WebSocket('ws://localhost:3000')

socket.onopen = function(event) {
	socket.send('something')
	socket.onmessage = (event) => {
    console.log(`received: ${event.data}`)
	}
	socket.onclose = (event) => {
    console.log(`server closed: ${event}`)
	}
	//socket.close()
}

import Vue from 'vue'

const vm = new Vue({
  el: '#root',
  data: {
    message: "Hello world!",
    todos: [
      { text: 'Learn JavaScript' },
      { text: 'Learn JavaScript' },
      { text: 'Build Something Awesome' }
    ]}
})

