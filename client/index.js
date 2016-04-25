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
