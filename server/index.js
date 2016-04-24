import fs from 'fs'

import express from 'express'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import nunjucks from 'nunjucks'

import gulp from 'gulp'
import gutil from 'gulp-util'
import chalk from 'chalk'
import sass from 'gulp-sass'
import livereload from 'gulp-livereload'

// Gulp
function onError(err) {
  console.log(err.message)
  this.emit('end')
}
gulp.task('sass', () => {
  gulp.src(['./client/**/*.scss', '!./client/**/_*.scss'])
  .pipe(sass())
    .on('error', onError)
  .pipe(gulp.dest('./public'))
  .pipe(livereload())
})
gulp.task('watch', () => {
  livereload.listen()
  livereload.reload()
  gulp.watch(['./client/**/*.scss', './client/**/_*.scss'], ['sass'])
})

gulp.on('task_start', (e) => {
  gutil.log(`Starting ${chalk.cyan(e.task)}...`)
})
gulp.start('watch')

// Database
class Database {
  constructor(file) {
    this.file = file
    if(fs.existsSync(this.file)) {
      const json = fs.readFileSync(this.file, 'utf8')
      this.data = JSON.parse(json)
    }
    else {
      this.data = {}
    }
  }
  all(table) {
    return this.data[table]
  }
  add(table, record) {
    this.data[table] = [...this.data[table] || [], record]
    this.write()
    return this.all(table)
  }
  drop(table) {
    this.data[table] = []
    this.write()
  }
  // Private
  write() {
    const json = JSON.stringify(this.data)
    fs.writeFileSync(this.file, json, 'utf8')
  }
}
const db = new Database('./server/db.json')
// db.drop('todos')

// Server App
const app = express()
app.use(morgan('dev'))
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
