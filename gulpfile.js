global.errorMessage = '';

var gulp            = require('gulp'),
    shell           = require('gulp-shell'),
    clean           = require('gulp-clean'),
    yuidoc          = require('gulp-yuidoc'),
    stripDomComment = require('gulp-strip-react-dom-comment'),
    sloc            = require('gulp-sloc');

gulp.task('clean', function() {
  return gulp.src(['./doc'], {read: false}).pipe(clean());
});

gulp.task('docs', ['clean'], function() {
  gulp.src(['./lib/*.js', './lib/*.jsx'])  // todo wrong
    .pipe(stripDomComment())
    .pipe(yuidoc())
    .pipe(gulp.dest('./doc'));
});

gulp.task('vows',   shell.task("vows test/* --spec -s"));
gulp.task('eslint', shell.task("eslint test/enforce-tests.js -c node_modules/sc-eslint/sc-eslint-config.json"));

gulp.task('build',  ['test','docs']);
gulp.task('test',   ['vows', 'eslint']);

gulp.task('sloc', ['build'], function(){
  gulp.src(['gulpfile.js', 'lib/*.js', 'lib/*.jsx', 'test/*.js'])
    .pipe(sloc({tolerant: true}));
});

gulp.task('default', ['sloc','test']);
