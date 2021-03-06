import fs from 'fs'

import express from 'express'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import nunjucks from 'nunjucks'

import {Server as WebSocketServer} from 'ws'

import webpack from 'webpack'
import config from '../webpack.config'
var compiler = webpack(config)

import {reload, close} from './gulp'

import db from './db'
db.connect({file: 'db.json'})

// Configure Express
var app = express()
app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}))
// NOTE: We need a callback when the webpack is rebuilt.
// Webpack does not reqrite the bundel file by default.

app.use(morgan('dev'))
app.use(require('connect-livereload')());
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: false}))
nunjucks.configure('server/views', {
  autoescape: true,
  express: app,
  noCache: true
})

// Web Application (Server Side Render)
app.get('/todos', function(req, res) {
  res.render('todos.html', {todos: db.all('todos')})
})
app.post('/todos', function(req, res) {
  db.add('todos', req.body.todo)
  res.redirect('/todos')
})

// Json API for Client Side Apps
app.get('/todos.json', function(req, res) {
  res.setHeader('Content-Type', 'application/json')
  res.send({todos: db.all('todos')})
})

// Bootup Server
var server = app.listen(3000, () => {
  console.log('Listening on port 3000')
  setTimeout(reload, 3000)
})

// Bootup WebSocketServer (Link it to Http Server)
const wss = new WebSocketServer({ server: server })
wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    console.log(`received: ${message}`)
  })
  ws.send('something');
})

// Handle shutdown from nodemon
process.once('SIGUSR2', () => {
  console.log('Writing database...')
  close()
  server.close()
  db.write()
  process.exit()
})

// Handle shutdown from ctrl-c
process.on('SIGINT', () => {
  console.log('Writing database...')
  db.write()
  process.exit()
})