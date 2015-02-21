
/* eslint-env node */

"use strict";

var vows   = require("vows"),
    assert = require("assert"),
    flocks = require("../../lib/flocks.jsx");





function negify(func, reqResult, argList) {

    var Res = {};

    Object.keys(argList).map(function (AK) {
        Res[AK] = function() {
            assert.throws(function() { func(argList[AK]); }, reqResult);
        };
    });

    return Res;

}





function posify(func, argList) {

    var Res = {};

    Object.keys(argList).map(function (AK) {
        Res[AK] = function() {
            assert.doesNotThrow(function() { func(argList[AK]); }, "whargarbl");
        };
    });

    return Res;

}





vows.describe("Enforcement clauses").addBatch({

    "enforceString"         : {
        "working normally" : posify(flocks.enforceString, {
            "hello world"  : "hello world",
            "empty string" : "",
            "unicode"      : "\u62b5\u5f92"
        }),

        "catching"         : negify(
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
        "working normally" : posify(flocks.enforceArray, {
            "[1,2,3]"         : [1,2,3],
            "empty array"     : [],
            "[1,\"2\",false]" : [1,"2",false]
        }),

        "catching"         : negify(flocks.enforceArray, "Argument must be an array", {
            "throws neg for strings"   : "string",
            "throws neg for booleans"  : true,
            "throws neg for integers"  : 123,
            "throws neg for floats"    : 12.3,
            "throws neg for objects"   : { "a" : 1 },
            "throws neg for null"      : null,
            "throws neg for undefined" : undefined,
            "throws neg for functions" : function() { return 2; }
        })
    }





/* whargarbl
    "enforceNonArrayObject" : {
        "working normally" : posify(flocks.enforceNonArrayObject, {
            "{hello:\"world\"}" : { "hello" : "world" },
            "empty object"      : {},
            "null"              : null
        }),

        "catching"         : negify(flocks.enforceNonArrayObject, "Argument must be a non-array object", {
            "throws neg for strings"   : "string",
            "throws neg for arrays"    : ["a",1],
            "throws neg for booleans"  : true,
            "throws neg for integers"  : 123,
            "throws neg for floats"    : 12.3,
            "throws neg for undefined" : undefined,
            "throws neg for functions" : function() { return 2; }
        })
    }
*/

}).export(module);
