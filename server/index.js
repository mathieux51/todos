import express from 'express';
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
  gulp.watch(['./client/**/*.scss', './client/**/_*.scss'], ['sass']);
});
gulp.start('watch');

const todos = [
  "Save Dr. Poopy Butthole.",
  "Get Blowjob.",
  "Confirm spelling of Dr. Poopy Butthole."
];

var app = express();

app.use(express.static('public'));

nunjucks.configure('server/views', {
  autoescape: true,
  express: app
});
app.get('/todos', function(req, res) {
  res.render('todos.html', {todos: todos});
});

app.get('/todos.json', function(req, res) {
  res.set('Content-Type', 'text/plain');
  res.send(todos);
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
  // livereload.reload();
});
