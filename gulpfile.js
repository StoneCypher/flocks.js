


global.errorMessage = '';

var gulp            = require('gulp'),
    shell           = require('gulp-shell'),
    clean           = require('gulp-clean'),
    yuidoc          = require('gulp-yuidoc'),
    stripDomComment = require('gulp-strip-react-dom-comment'),
    sloc            = require('gulp-sloc'),
    eslint_task     = require('sc-eslint/estask.js');

gulp.task('clean', function() {
  return gulp.src(['./doc'], {read: false}).pipe(clean());
});

gulp.task('docs', ['clean'], function() {
  gulp.src(['./lib/*.js', './lib/*.jsx'])  // todo wrong
    .pipe(stripDomComment())
    .pipe(yuidoc())
    .pipe(gulp.dest('./doc'));
});

var lintconfig = { target: "gulpfile.js test/enforce-tests.js" };
gulp.task('lint', eslint_task(lintconfig));

gulp.task('vows', shell.task("vows test/* --spec -s"));

gulp.task('build',  ['test','docs']);
gulp.task('test',   ['vows', 'eslint']);

gulp.task('sloc', ['build'], function(){
  gulp.src(['gulpfile.js', 'lib/*.js', 'lib/*.jsx', 'test/*.js'])
    .pipe(sloc({tolerant: true}));
});

gulp.task('default', ['sloc','test']);
