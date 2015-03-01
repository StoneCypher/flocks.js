
/* jshint node: true */
/* eslint-env node, browser */

"use strict";





var gulp            = require("gulp"),
    lint            = require("sc-eslint/estask.js"),
    shell           = require("gulp-shell"),
    clean           = require("gulp-clean"),
    yuidoc          = require("gulp-yuidoc"),
    stripDomComment = require("gulp-strip-react-dom-comment"),
    jsx             = require("gulp-jsx"),
    sloc            = require("gulp-sloc");





gulp.task("clean", function() {
  return gulp.src(["./doc", "./dist"], {"read" : false}).pipe(clean());
});





gulp.task("docs", ["clean"], function() {
  gulp.src(["./lib/*.js", "./lib/*.jsx"])
    .pipe(stripDomComment())
    .pipe(yuidoc())
    .pipe(gulp.dest("./doc"));
});





lint.gulpreg(gulp, {
  "targets" : "gulpfile.js lib/flocks.jsx dist/flocks.js"
});





gulp.task("transpile", ["clean"], function() {
  return gulp.src('lib/flocks.jsx')
    .pipe(jsx())
    .pipe(gulp.dest('dist'));
});





gulp.task("vows", shell.task("npm test"));

gulp.task("test",   ["transpile", "vows", "lint"]);




gulp.task("build",  ["test", "docs"]);





gulp.task("sloc", ["build"], function() {
  gulp.src(["gulpfile.js", "lib/*.js", "lib/*.jsx", "test/*.js"])
    .pipe(sloc({"tolerant" : true}));
});





gulp.task("default", ["test", "sloc"]);
