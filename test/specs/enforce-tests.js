
/* jshint node: true */
/* eslint-env node */

"use strict";

var th     = require("./_test_helper.js"),

    vows   = require("vows"),
    flocks = require("../../lib/flocks.jsx");





vows.describe("Enforcement clauses").addBatch({

    "enforceString"         : {
        "working normally" : th.posify(flocks.enforceString, {
            "hello world"  : "hello world",
            "empty string" : "",
            "unicode"      : "\u62b5\u5f92"
        }),

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
    },





    "enforceArray"          : {
        "working normally" : th.posify(flocks.enforceArray, {
            "[1,2,3]"         : [1,2,3],
            "empty array"     : [],
            "[1,\"2\",false]" : [1,"2",false]
        }),

        "catching"         : th.negify(flocks.enforceArray, "Argument must be an array", {
            "throws neg for strings"   : "string",
            "throws neg for booleans"  : true,
            "throws neg for integers"  : 123,
            "throws neg for floats"    : 12.3,
            "throws neg for objects"   : { "a" : 1 },
            "throws neg for null"      : null,
            "throws neg for undefined" : undefined,
            "throws neg for functions" : function() { return 2; }
        })
    },





    "enforceNonArrayObject" : {
        "working normally" : th.posify(flocks.enforceNonArrayObject, {
            "{hello:\"world\"}" : { "hello" : "world" },
            "empty object"      : {},
            "null"              : null
        }),

        "catching"         : th.negify(flocks.enforceNonArrayObject, "Argument must be a non-array object", {
            "throws neg for strings"   : "string",
            "throws neg for arrays"    : ["a",1],
            "throws neg for booleans"  : true,
            "throws neg for integers"  : 123,
            "throws neg for floats"    : 12.3,
            "throws neg for undefined" : undefined,
            "throws neg for functions" : function() { return 2; }
        })
    }

}).export(module);
