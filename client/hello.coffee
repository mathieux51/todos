console.log "Hello from CoffeeScript! Test"

Vue = require 'vue'
vm = new Vue {
  el: '#root'
  data:
    message: "Hello world!"
    todos: [
      { text: 'Learn JavaScript' }
      { text: 'Learn Vue.js' }
      { text: 'Build Something Awesome' }
    ]
}

