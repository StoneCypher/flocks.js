
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
 * @event clean
 */

gulp.task("clean", function() {
  return gulp.src(["./doc", "./dist", "./reports"], {"read" : false}).pipe(clean());
});





/**
 * <tt>gulp docs</tt> will generate the documentation through <tt>yuidoc</tt>.
 *
 * <tt>docs</tt> will invoke <tt>clean</tt> and <tt>bump</tt>.
 *
 * @event docs
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
 * @event lint
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
 * @event minify
 */

gulp.task("minify", ["clean","transpile"], function() {
  return gulp.src("dist/flocks.js")
    .pipe(closureCompiler({
      "compilerPath"  : "bower_components/closure-compiler/compiler.jar",
      "fileName"      : "./dist/flocks.min.js",
      "compilerFlags" : { "compilation_level" : "ADVANCED_OPTIMIZATIONS" }
    }))
    .pipe(gulp.dest("."));
});





/**
 * <tt>gulp transpile</tt> will use <tt>gulp-jsx</tt> to convert the flocks
 * library <tt>flocks.jsx</tt> file to its <tt>flocks.js</tt> form for
 * publishing on the CDN.
 *
 * <tt>transpile</tt> will invoke <tt>clean</tt>.
 *
 * @event transpile
 */

gulp.task("transpile", ["clean"], function() {

  return gulp.src("lib/flocks.jsx")
    .pipe(jsx())
    .pipe(rename("flocks.js"))
    .pipe(gulp.dest("dist"));

});





/**
 * <tt>gulp vows</tt> will uses <tt>gulp-shell</tt> to issue the
 * command <tt>npm test</tt> to run the <tt>vows</tt> tests on gulp.  This is
 * done with an <tt>npm</tt> script so that other tooling will pick it up
 * automatically.
 *
 * This is a support task; you should <tt>gulp test</tt> instead.
 *
 * <tt>vows</tt> has no dependencies.
 *
 * @event vows
 */

gulp.task("vows", shell.task("npm test"));





/**
 * <tt>gulp test</tt> invokes <tt>build</tt>, <tt>vows</tt>, and <tt>lint</tt>.
 *
 * @event test
 */

gulp.task("test", ["build", "vows", "lint"]);





/**
 * <tt>gulp build</tt> invokes <tt>minify</tt>.  Other build steps will be here
 * soon.
 *
 * @event build
 */

gulp.task("build",  ["minify"]);





/**
 * <tt>gulp bump</tt> uses <tt>gulp-bump</tt> to set the version number of
 * the <tt>package.json</tt> and <tt>bower.json</tt> files to match the version
 * number emitted by the library.
 *
 * <tt>bump</tt> has no dependencies.
 *
 * @event bump
 */

gulp.task("bump", function() {

  gulp.src(["./bower.json", "./package.json"])
    .pipe(bump({
      "version" : flocks.version
    }))
    .pipe(gulp.dest("./"));

});





/**
 * <tt>gulp sloc</tt> runs the <tt>gulp-sloc</tt> plugin twice - once to show
 * the sloc report, and once to dump it to disk in <tt>./reports</tt>.
 *
 * <tt>sloc</tt> will invoke <tt>build</tt>.
 *
 * @event sloc
 */

gulp.task("sloc", ["build", "clean"], function() {

  gulp.src(["gulpfile.js", "bower.json", "package.json", "lib/flocks.jsx", "test/specs/*.js"])
    .pipe(sloc({"tolerant" : true}));

  gulp.src(["gulpfile.js", "bower.json", "package.json", "lib/flocks.jsx", "test/specs/*.js"])
    .pipe(sloc({
      "tolerant"   : true,
      "reportType" : "json"
    }))
    .pipe(gulp.dest("./reports"));

});





/**
 * <tt>gulp default</tt> (or just <tt>gulp</tt>) will invoke <tt>test</tt>, <tt>docs</tt>,
 * and <tt>sloc</tt>.
 *
 * @event default
 */

gulp.task("default", ["test", "docs", "sloc"]);





/**
 * <tt>gulp publish</tt> invokes <tt>default</tt>, <tt>tag</tt>, and <tt>push</tt>.
 *
 * @event publish
 */

gulp.task("publish", ["default", "tag", "push"], function() {

  shell("npm publish");

});





/**
 * <tt>gulp add</tt> manually adds the <tt>./lib</tt>, the <tt>./dist</tt>,
 * the <tt>./reports</tt>, and the <tt>./test</tt> trees, as well as the
 * files <tt>gulpfile.js</tt>, <tt>bower.json</tt>, <tt>package.json</tt>,
 * and the standard <tt>README</tt> and <tt>LICENSE</tt>.
 *
 * The reason for these monkeyshines, instead of an <tt>add .</tt> with an
 * exclusion, is that the NPM path depth bug prevents the exclusion from working
 * correctly on windows (gee thanks node.)
 *
 * <tt>gulp add</tt> invokes <tt>default</tt>.
 *
 * @event add
 */

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





/**
 * <tt>gulp tag</tt> issues a <tt>git tag</tt> matching the current <tt>flocks</tt>
 * version, in order to support the auto-update scripts for <tt>cdnjs</tt>.
 *
 * <tt>gulp tag</tt> invokes <tt>default</tt> and <tt>add</tt>.
 *
 * @event tag
 */

gulp.task("tag", ["default", "add"], function() {

  var version = flocks.version,
      message = argv.m;

  return gulp.src("./git-test/*")
    .pipe(git.commit("Version " + version + ": " + message))
    .pipe(git.tag(version, version + ": " + message, function(error) { if (error) { throw error; } }));

});





/**
 * <tt>gulp push</tt> pushes <tt>origin</tt> to <tt>master</tt> on github.
 *
 * <tt>gulp push</tt> invokes <tt>tag</tt>.
 *
 * @event push
 */

gulp.task("push", ["tag"], function() {

  git.push("origin", "master", {"args" : "--tags"}, function(error) { if (error) { throw error; } });

});
