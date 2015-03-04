
/* jshint node: true */
/* eslint vars-on-top:0 */
/* eslint-env node, browser */

/**
 * Flocks gulpfile.
 *
 * @module gulpfile
 * @main   gulp
 * @class  gulpfile
 */

"use strict";




/**
 * This unbound blockless step installs the node-jsx loader to convert statics.
 * This is not actually a method and cannot be called.
 *
 * @method requireNodeJsx
 */

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





/**
 * <tt>gulp clean</tt> will remove the <tt>./doc</tt>, <tt>./dist</tt>,
 * and <tt>./reports</tt> directories, in the expectation that they will be
 * remade by the gulp process.
 *
 * <tt>clean</tt> has no dependencies.
 *
 * @method clean
 */

gulp.task("clean", function() {
  return gulp.src(["./doc", "./dist", "./reports"], {"read" : false}).pipe(clean());
});





/**
 * <tt>gulp docs</tt> will generate the documentation through <tt>yuidoc</tt>.
 *
 * <tt>docs</tt> will invoke <tt>clean</tt> and <tt>bump</tt>.
 *
 * @method docs
 */

gulp.task("docs", ["clean", "bump"], function() {
  gulp.src(["./lib/*.js", "./lib/*.jsx", "./gulpfile.js"])
    .pipe(stripDomComment())
    .pipe(yuidoc())
    .pipe(gulp.dest("./doc"));
});





/**
 * <tt>gulp lint</tt> will run the linting engine on the <tt>gulpfile</tt>,
 * on <tt>lib/flocks.jsx</tt>, and on <tt>dist/flocks.js</tt>.  Obviously the
 * minified version is not linted.  <tt>:D</tt>
 *
 * <tt>lint</tt> has no dependencies.
 *
 * @method lint
 */

lint.gulpreg(gulp, {
  "targets" : "gulpfile.js lib/flocks.jsx dist/flocks.js"
});





/**
 * <tt>gulp minify</tt> will run post-transpiled <tt>flocks.js</tt>
 * through <tt>closure compiler</tt> to produce <tt>flocks.min.js</tt>.
 *
 * <tt>minify</tt> will invoke <tt>clean</tt> and <tt>transpile</tt>.
 *
 * @method minify
 */

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

  shell("npm publish");

});





gulp.task("add", ["default"], function() {

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





gulp.task("tag", ["default", "add"], function() {

  var version = flocks.version,
      message = argv.m;

  return gulp.src('./git-test/*')
    .pipe(git.commit("Version " + version + ": " + message))
    .pipe(git.tag(version, version + ": " + message, function(error) { if (error) { throw error; } }));

});





gulp.task("push", ["tag"], function() {

  git.push("origin", "master", {"args" : "--tags"}, function(error) { if (error) { throw error; } });

});
