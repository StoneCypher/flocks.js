
/* jshint node: true */
/* eslint-env node, browser */

/**
 * Wraps the JSX control for NPM
 *
 * @module Wrapper
 */

require("node-jsx").install({"extension" : ".jsx"});

module.exports = require("./flocks.jsx");
