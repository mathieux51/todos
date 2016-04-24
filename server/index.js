import fs from 'fs'

import express from 'express'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import nunjucks from 'nunjucks'

import './gulp'
import Db from './db'

// Database
const db = new Db('db.json')
// db.drop('todos')

// Server App
const app = express()
app.use(morgan('dev'))
app.use(require('connect-livereload')());
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: false}))

nunjucks.configure('server/views', {
  autoescape: true,
  express: app
})

// Web Application (Server Side)
app.get('/todos', function(req, res) {
  res.render('todos.html', {todos: db.all('todos')})
})
app.post('/todos', function(req, res) {
  db.add('todos', req.body.todo)
  res.redirect('/todos')
})

// Json API
app.get('/todos.json', function(req, res) {
  res.setHeader('Content-Type', 'application/json')
  res.send({todos: db.all('todos')})
})

app.listen(3000, () => {
  console.log("Listening on port 3000")
  // livereload.reload()
})
