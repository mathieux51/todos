import gulp from 'gulp'
import gutil from 'gulp-util'
import chalk from 'chalk'
import sass from 'gulp-sass'
import babel from 'gulp-babel'
import livereload from 'gulp-livereload'

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
})

gulp.on('task_start', event => gutil.log(`Starting ${chalk.cyan(event.task)}...`))
gulp.start('watch')

export function reload() {
  livereload.reload()
}