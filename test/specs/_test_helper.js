
/* jshint node: true */
/* eslint-env node */

var assert = require("assert");





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





module.exports = {

    posify: posify,
    negify: negify

};