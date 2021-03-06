import gulp from 'gulp'
import gutil from 'gulp-util'
import chalk from 'chalk'
import sass from 'gulp-sass'
import babel from 'gulp-babel'
import livereload from 'gulp-livereload'

import db from './db'

function onError(err) {
  console.log(err.message)
  this.emit('end')
}
gulp.task('sass', () => {
  gulp.src(['./client/**/*.scss', '!./client/**/_*.scss'])
  .pipe(sass()).on('error', onError)
  .pipe(gulp.dest('./public'))
  .pipe(livereload())
})

gulp.task('js', () => {
  gulp.src('./client/**/*.js')
  .pipe(babel()).on('error', onError)
  .pipe(gulp.dest('./public'))
  .pipe(livereload())
})
// NOTE: This is terrible. It's making webpack reload
// But for the wrong reasons: Coping the raw file triggers the reload
// And this is not synced and has not relation to webpack...!

gulp.task('html', () => {
  gulp.src('./client/**/*.html')
  .pipe(gulp.dest('./public'))
  .pipe(livereload())
})
gulp.task('watch', () => {
  livereload.listen()
  gulp.watch(['client/**/*.html'], ['html'])
  gulp.watch(['client/**/*.scss'], ['sass'])
  gulp.watch(['client/**/*.js'], ['js'])
  gulp.watch(['server/views/*.html'], _ => livereload.reload())
  // gulp.watch(['public/**/*.js'], () => {
  //   livereload.reload()
  // })
  gulp.watch(['db.json'], () => {
    db.read()
    livereload.reload()
  })
})

gulp.on('task_start', event => gutil.log(`Starting ${chalk.cyan(event.task)}...`))
gulp.start('watch')

export function reload() {
  livereload.reload()
}
export function close() {
  livereload.server.close()
}