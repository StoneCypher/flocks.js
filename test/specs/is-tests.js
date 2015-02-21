
/* jshint node: true */
/* eslint-env node */

"use strict";

var th     = require("./_test_helper.js"),

    vows   = require("vows"),
    assert = require("assert"),
    flocks = require("../../lib/flocks.jsx");





vows.describe("Enforcement clauses").addBatch({

    "isArray" : {
        "working normally" : th.posify(flocks.enforceString, {
            "hello world"  : "hello world",
            "empty string" : "",
            "unicode"      : "\u62b5\u5f92"
        })
/*
        ,

        "catching"         : th.negify(
            flocks.enforceString, "Argument must be a string", {
                "throws neg for booleans"  : true,
                "throws neg for integers"  : 123,
                "throws neg for floats"    : 12.3,
                "throws neg for arrays"    : ["a",1],
                "throws neg for objects"   : {"a" : 1},
                "throws neg for null"      : null,
                "throws neg for undefined" : undefined,
                "throws neg for functions" : function() { return 2; }
            }
        )
*/
    },

}).export(module);
