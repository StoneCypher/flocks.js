
/* jshint node: true */
/* eslint vars-on-top:0 */
/* eslint-env node, browser */

"use strict";





require("node-jsx").install({
  "extension" : ".jsx",
  "harmony"   : true
});

var gulp            = require("gulp"),
    git             = require("gulp-git"),
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
    flocks          = require("./lib/flocks.jsx"),
    argv            = require("yargs").argv;





gulp.task("clean", function() {
  return gulp.src(["./doc", "./dist", "./reports"], {"read" : false}).pipe(clean());
});





gulp.task("docs", ["clean", "bump"], function() {
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

gulp.task("test", ["build", "vows", "lint"]);





gulp.task("build",  ["minify"]);





gulp.task("bump", function() {

  gulp.src(["./bower.json", "./package.json"])
    .pipe(bump({
      "version" : flocks.version
    }))
    .pipe(gulp.dest("./"));

});





gulp.task("sloc", ["build"], function() {

  gulp.src(["gulpfile.js", "bower.json", "package.json", "lib/flocks.jsx", "test/specs/*.js"])
    .pipe(sloc({"tolerant" : true}));

  gulp.src(["gulpfile.js", "bower.json", "package.json", "lib/flocks.jsx", "test/specs/*.js"])
    .pipe(sloc({
      "tolerant"   : true,
      "reportType" : "json"
    }))
    .pipe(gulp.dest("./reports"));

});





gulp.task("default", ["test", "docs", "sloc"]);





gulp.task("publish", ["default", "tag", "push"], function() {

  var version = flocks.version,
      message = "message";

  console.log("should publish -a " + version + " -m \"" + message + "\" here");

});





gulp.task("add", function() {

  return gulp.src([
      // can't just glob exclude because of node's broken depth nonsense
      "./gulpfile.js",
      "./bower.json",
      "./package.json",
      "./README.md",
      "./LICENSE",
      "./dist/**/*",
      "./lib/**/*",
      "./reports/**/*",
      "./test/**/*"
    ], {
      "read" : false
    })
    .pipe(git.add({"args" : "-A"}));

});





gulp.task("tag", ["default"], function() {

  var version = flocks.version,
      message = argv.m;

  git.commit("Version " + version + ": " + message);
  git.add(gulp.src);
  git.tag(version, version + ": " + message, function(error) { if (error) { throw error; } });

});





gulp.task("push", ["tag"], function() {

  git.push("origin", "master", {"args": "--tags"}, function(error) { if (error) { throw error; } });

});
