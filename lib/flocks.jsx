/** @jsx React.DOM */
/* jshint node: true, browser: true, newcap: false */

'use strict';

if (typeof React === 'undefined') {
    var React = require('react');
}





var clone = function(obj) {

        if ((null === obj) || ('object' != typeof obj)) { return obj; }

        var copy = obj.constructor();
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) { copy[attr] = obj[attr]; }
        }

        return copy;

    }, // oh, javascript :|





    flContextTypes = {
        flocks_updater : React.PropTypes.object,
        flocks_context : React.PropTypes.object
    },

    Mixin = {

        contextTypes      : flContextTypes,
        childContextTypes : flContextTypes,

        componentWillMount: function() {
            this.fctx = function() { return clone(this.context.flocks_context); };
            this.fset = function() { return this.context.flocks_updater.set; };
            this.fupd = function() { return this.context.flocks_updater; };
        },

        getChildContext: function() {

            var defaultingContext = {};

            // updater in props overrides contexts
            if (typeof this.props.flocks_context !== 'undefined') {
                defaultingContext.flocks_context = this.props.flocks_context;
                delete defaultingContext.flocks_context.flocks_context;
            }

            if (typeof this.props.flocks_updater !== 'undefined') {
                defaultingContext.flocks_updater = this.props.flocks_updater;
            }

            return defaultingContext;

        }
    },





    isArray = function(maybeArray) {
        return (Object.prototype.toString.call(maybeArray) === '[object Array]');
    },





    isNonArrayObject = function(maybeArray) {
        if (typeof maybeArray !== 'object')                                  { return false; }
        if (Object.prototype.toString.call(maybeArray) === '[object Array]') { return false; }
        return true;
    },





    enforceString = function(On, Label) {
        if (typeof On !== 'string') {
            throw Label;
        }
    },





    enforceArray = function(On, Label) {
        if (!(isArray(On))) {
            throw Label;
        }
    },





    enforceNonArrayObject = function(On, NonObjLabel, ArrayLabel) {
        if (typeof On !== 'object') {
            throw NonObjLabel;
        }
        if (isArray(On)) {
            throw ( ArrayLabel || NonObjLabel );
        }
    },





    create = function(Options) {

        var currentData      = {},
            prevData         = {},
            updatesBlocked   = 0,
            dirty            = false,

            handler          = Options.before || function(C,P) { return true; },
            finalizer        = Options.after  || function(C,P) { return null; },
            TargetTag        = Options.target,
            RenderDescriptor = Options.control,

            updateIfWanted = function() {

                if (updatesBlocked) {
                    dirty = true;
                    return null;
                } else {

                    if (!(handler(currentData, prevData))) {
                        currentData = prevData;
                        return false;
                    }

                    var cdata                = clone(currentData);
                        cdata.flocks_context = currentData;

                    finalizer(currentData, prevData);

                    prevData             = clone(currentData);

                    React.renderComponent(RenderDescriptor(cdata), TargetTag);
                    dirty                = false;
                    return true;

                }
            },

            pathDive = function(CurPath, CurTgt) {
                var parent = CurTgt;

                for (var i = 0; i < CurPath.length-1; i += 1) {
                    parent = parent[CurPath[i]];
                }

                return parent[CurPath[CurPath.length-1]];
            },

            pathSet = function(CurPath, Val) {

                var parent = currentData;

                if (CurPath.length === 1) {
                    parent[CurPath[0]] = Val;
                } else {
                    for (var i = 0; i < CurPath.length-1; i += 1) {
                        parent = parent[CurPath[i]];
                    }
                }

                parent[CurPath[CurPath.length-1]] = Val;
                return updateIfWanted();
            },

            setByObject = function(NaObject) {
                enforceNonArrayObject(NaObject, 'Flocks.bulk_set takes an object', 'Flocks.bulk_set takes a non-array object');
                if (handler(NaObject)) {
                    currentData = NaObject;
                }
                return updateIfWanted();
            },

            setByPath = function(Path, Value) {
                enforceArray(Path, 'Flock.path_set must take an array for its path');
                return pathSet(Path, Value);
            },

            setByKey = function(Key, Value) {
                enforceString(Key, 'Flock.member_set must take a string for its key');

                var toHandle  = {};     // ... damnit json :|
                toHandle[Key] = Value;

                if (handler(toHandle)) {
                    currentData[Key] = Value;
                }

                return updateIfWanted();
            };

        if (typeof TargetTag        === 'undefined') { throw 'flocks fatal error: must set a target'; }
        if (typeof RenderDescriptor === 'undefined') { throw 'flocks fatal error: must set a control'; }

        // todo whargarbl what're docs lol

        return {

            // need to honor Handler
            // need set_path and get_path
            // need announce

            member_set: setByKey,

            set: function(Key, MaybeValue) {

                if      (typeof Key === 'string') { setByKey(Key, MaybeValue); }
                else if (isArray(Key))            { setByPath(Key, MaybeValue); }
                else if (isNonArrayObject(Key))   { setByObject(Key); }
                else                              { throw 'Flocks.set/2 key must be a string or an array'; }

            },

            init: function(InitObj) {
                InitObj.flocks_context = clone(InitObj);
                this.set(InitObj);
                this.set('flocks_updater', this);
            },

            // get isn't subject to handling
            // todo whargarbl need path version
            // todo whargarbl need argument type guards
            get: function(What) {
                return (What === undefined)? currentData : currentData[What];
            },

            bulk_set: setByObject,

            bulk_update: function(request) {
                enforceNonArrayObject(request, 'Flocks.bulk_update takes an object', 'Flocks.bulk_update takes a non-array object');

                if (handler(request)) {
                    var currentBase = currentData;
                    for (var i in request.keys()) {
                        currentBase[i] = request[i];
                    }

                    if (handler(currentBase)) {
                        currentData = currentBase;
                    }
                }

                return updateIfWanted();

            },

            clear: function() {
                if (handler({})) {
                    currentData = {};
                }
                return updateIfWanted();
            },

            // lock and unlock aren't subject to handling
            lock: function() {
                updatesBlocked += 1;
                return true;
            },

            // lock and unlock aren't subject to handling
            unlock: function() {
                updatesBlocked -= 1;
                return (updatesBlocked > 0)? updateIfWanted() : false;
            }

        };

    };





var exports = {

    member                : Mixin,
    create                : create,
    clone                 : clone,
    isArray               : isArray,
    isNonArrayObject      : isNonArrayObject,
    enforceString         : enforceString,
    enforceArray          : enforceArray,
    enforceNonArrayObject : enforceNonArrayObject

};





if (typeof module !== 'undefined') {
    module.exports = exports;
} else {
    window.flocksjs = exports;
}