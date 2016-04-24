import fs from 'fs';

import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import nunjucks from 'nunjucks';

import gulp from 'gulp';
import gutil from 'gulp-util';
import chalk from 'chalk';
import sass from 'gulp-sass';
import livereload from 'gulp-livereload';

// Gulp
function onError(err) {
  console.log(err.message);
  this.emit('end')
}
gulp.task('sass', () => {
  gulp.src(['./client/**/*.scss', '!./client/**/_*.scss'])
  .pipe(sass())
    .on('error', onError)
  .pipe(gulp.dest('./public'))
  .pipe(livereload());
});
gulp.task('watch', () => {
  livereload.listen();
  livereload.reload();
  gulp.watch(['./client/**/*.scss', './client/**/_*.scss'], ['sass']);
});

gulp.on('task_start', (e) => {
  gutil.log(`Starting ${chalk.cyan(e.task)}...`);
});
gulp.start('watch');

// Database
class Database {
  constructor(file) {
    const json = fs.readFileSync('./server/db.json', 'utf8');
    this.data = JSON.parse(json);
  }
  all(table) {
    return {table: this.data[table]};
  }
  add(table, record) {
    this.data[table].push(record);
    const json = JSON.stringify(this.data);
    fs.writeFileSync('./server/db.json', json, 'utf8');
    return all(table);   
  }
}
const db = new Database('./server/db.json');
// console.log(db.get('todos'));

// function db() {
//   const json = fs.readFileSync('./server/db.json', 'utf8');
//   return JSON.parse(json);
// }
// function getTodos() {
//   return {todos: db().todos};
// }
// function addTodo(todo) {
//   const _db = db();
//   _db.todos.push(todo);
//
//   const json = JSON.stringify(_db);
//   fs.writeFileSync('./server/db.json', json, 'utf8');
// }

// App
const app = express();
app.use(morgan('dev'));
app.use('/', express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

nunjucks.configure('server/views', {
  autoescape: true,
  express: app
});

app.get('/todos', function(req, res) {
  res.render('todos.html', db.all('todos'));
});
app.post('/todos', function(req, res) {
  db.add('todos', req.body.todo);
  res.render('todos.html', db.all('todos'));
});

app.get('/todos.json', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.send(db.all('todos'));
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
  // livereload.reload();
});
