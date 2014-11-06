
/* jshint node: true */
/* eslint-env node, browser */
"use strict";

var gulp            = require("gulp"),
    shell           = require("gulp-shell"),
    clean           = require("gulp-clean"),
    yuidoc          = require("gulp-yuidoc"),
    stripDomComment = require("gulp-strip-react-dom-comment"),
    sloc            = require("gulp-sloc"),
    linttask        = require("sc-eslint/estask.js");

global.errorMessage = "";

gulp.task("clean", function() {
  return gulp.src(["./doc"], {"read" : false}).pipe(clean());
});

gulp.task("docs", ["clean"], function() {
  gulp.src(["./lib/*.js", "./lib/*.jsx"])
    .pipe(stripDomComment())
    .pipe(yuidoc())
    .pipe(gulp.dest("./doc"));
});

gulp.task("lint", linttask({
  "targets" : "gulpfile.js lib/flocks.js test/enforce-tests.js"
}));

gulp.task("vows", shell.task("vows test/* --spec -s"));

gulp.task("build",  ["test", "docs"]);
gulp.task("test",   ["vows", "lint"]);

gulp.task("sloc", ["build"], function() {
  gulp.src(["gulpfile.js", "lib/*.js", "lib/*.jsx", "test/*.js"])
    .pipe(sloc({"tolerant" : true}));
});

gulp.task("default", ["sloc", "test"]);
