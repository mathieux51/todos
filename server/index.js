import fs from 'fs';

import express from 'express';
import bodyParser from 'body-parser';
import nunjucks from 'nunjucks';

import gulp from 'gulp';
import gutil from 'gulp-util';
import chalk from 'chalk';
import sass from 'gulp-sass';
import livereload from 'gulp-livereload';

gulp.on('task_start', (e) => {
  gutil.log(`Starting ${chalk.cyan(e.task)}...`);
});
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
gulp.start('watch');

function db() {
  const json = fs.readFileSync('./server/db.json', 'utf8');
  return JSON.parse(json);
}

var app = express();

app.use('/', express.static('public'));

nunjucks.configure('server/views', {
  autoescape: true,
  express: app
});
app.get('/todos', function(req, res) {
  res.render('todos.html', db());
});

app.use(bodyParser.urlencoded({ extended: false }));
/*app.use(function (req, res) {
  res.setHeader('Content-Type', 'text/plain')
  res.write('you posted:\n')
  res.end(JSON.stringify(req.body, null, 2))
});*/
app.post('/todos', function(req, res) {
  res.render('todos.html', db());
});

 

app.get('/todos.json', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.send({todos: db().todos});
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
  // livereload.reload();
});
