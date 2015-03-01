
/* jshint node: true */
/* eslint vars-on-top:0 */
/* eslint-env node, browser */

"use strict";





require("node-jsx").install({
  "extension" : ".jsx",
  "harmony"   : true
});

var gulp            = require("gulp"),
    bump            = require("gulp-bump"),
    lint            = require("sc-eslint/estask.js"),
    shell           = require("gulp-shell"),
    clean           = require("gulp-clean"),
    yuidoc          = require("gulp-yuidoc"),
    stripDomComment = require("gulp-strip-react-dom-comment"),
    jsx             = require("gulp-jsx"),
    closureCompiler = require("gulp-closure-compiler"),
    sloc            = require("gulp-sloc"),
    rename          = require("gulp-rename"),
    flocks          = require("./lib/flocks.jsx");





gulp.task("clean", function() {
  return gulp.src(["./doc", "./dist"], {"read" : false}).pipe(clean());
});





gulp.task("docs", ["clean"], function() {
  gulp.src(["./lib/*.js", "./lib/*.jsx"])
    .pipe(stripDomComment())
    .pipe(yuidoc()
    .pipe(gulp.dest("./doc")));
});





lint.gulpreg(gulp, {
  "targets" : "gulpfile.js lib/flocks.jsx dist/flocks.js"
});





gulp.task("minify", ["clean","transpile"], function() {
  return gulp.src("dist/flocks.js")
    .pipe(closureCompiler({
      "compilerPath" : "bower_components/closure-compiler/compiler.jar",
      "fileName"     : "./dist/flocks.min.js"
    }))
    .pipe(gulp.dest("."));
});





gulp.task("transpile", ["clean"], function() {
  return gulp.src("lib/flocks.jsx")
    .pipe(jsx())
    .pipe(rename("flocks.js"))
    .pipe(gulp.dest("dist"));
});





gulp.task("vows", shell.task("npm test"));

gulp.task("test", ["minify", "vows", "lint"]);





gulp.task("build",  ["test", "docs"]);





gulp.task("bump", function() {

  gulp.src(["./bower.json", "./package.json"])
    .pipe(bump({
      "version" : flocks.version
    }))
    .pipe(gulp.dest("./"));

});




gulp.task("sloc", ["build"], function() {
  gulp.src(["gulpfile.js", "lib/*.js", "lib/*.jsx", "test/*.js"])
    .pipe(sloc({"tolerant" : true}));
});





gulp.task("default", ["test", "sloc"]);
