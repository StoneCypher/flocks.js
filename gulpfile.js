global.errorMessage = '';

var gulp      = require('gulp'),
    clean     = require('gulp-clean'),
    yuidoc    = require('gulp-yuidoc'),
    sloc      = require('gulp-sloc');

gulp.task('clean', function() {
  return gulp.src(['./doc'], {read: false}).pipe(clean());
});

gulp.task('docs', ['clean'], function() {
  gulp.src('./lib/*.js')  // todo wrong
    .pipe(yuidoc())
    .pipe(gulp.dest('./doc'));
});

gulp.task('vows', function() {
  // todo whargarbl
});

gulp.task('build',  ['test','docs']);
gulp.task('test',   ['vows']);

gulp.task('sloc', ['build'], function(){
  gulp.src(['gulpfile.js', 'lib/*.js', 'lib/*.jsx', 'test/*.js'])
    .pipe(sloc());
});

gulp.task('default', ['sloc','test']);
