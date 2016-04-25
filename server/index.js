import fs from 'fs'

import express from 'express'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import nunjucks from 'nunjucks'

import {reload} from './gulp'

import Db from './db'
const db = new Db('db.json')

// Configure Express
const app = express()
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
app.listen(3000, () => {
  console.log("Listening on port 3000")
  setTimeout(reload, 2000)
})
