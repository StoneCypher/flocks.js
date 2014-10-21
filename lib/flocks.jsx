/** @jsx React.DOM */
/* jshint node: true */

'use strict';

var React   = require('react'),

    flContextTypes = {
        root    : React.PropTypes.object,
        depth   : React.PropTypes.number,
        updater : React.PropTypes.object
    },

    Mixin = {

        contextTypes      : flContextTypes,
        childContextTypes : flContextTypes,

        getChildContext: function() {

            var defaultingContext = {};
            for (var i in flContextTypes) {
                // root is a special case; so is depth
                if ((i !== 'root') && (i !== 'depth')) {
                    defaultingContext[i] = (this.props[i] !== undefined)? this.props[i] : this.context[i];
                }
            }

            // root auto-handles self-if-no-parent
            defaultingContext.root = ((this.context.root === undefined)? this : this.context.root);

            // root auto-handles depth too
            defaultingContext.depth = ((this.context.depth === undefined)? 0 : this.context.depth + 1);

            // updater in props overrides contexts
            if (typeof this.props.updater !== 'undefined') {
                defaultingContext.updater = this.props.updater;
            }

            return defaultingContext;

        }
    },

    alwaysTrue = function() { return true; },
    noOp       = function() { return; },

    create = function(Options) {

        var currentData      = {},
            updatesBlocked   = false,
            dirty            = false,

            handler          = Options.before || this.alwaysTrue,
            finalizer        = Options.after  || this.noOp,
            TargetTag        = Options.target,
            RenderDescriptor = Options.control,

            isArray = function(maybeArray) {
                return (Object.prototype.toString.call(maybeArray) === "[object Array]");
            },

            isNonArrayObject = function(maybeArray) {
                if (typeof maybeArray !== 'object')                                  { return false; }
                if (Object.prototype.toString.call(maybeArray) === "[object Array]") { return false; }
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

            updateIfWanted = function() {
                if (updatesBlocked) {
                    dirty = true;
                } else {
                    React.renderComponent(RenderDescriptor(currentData), TargetTag);
                    dirty = false;
                }
            },

            pathDive = function(CurPath, CurTgt) {
                var parent = CurTgt;

                for (var i = 0; i < CurPath.length-1; i += 1) {
                    parent = parent[CurPath[i]];
                }

                return parent[CurPath[CurPath.length-1]];
            },

            pathSet = function(CurPath, CurTgt, Val) {
                var parent = CurTgt;

                for (var i = 0; i < CurPath.length-1; i += 1) {
                    parent = parent[CurPath[i]];
                }

                parent[CurPath[CurPath.length-1]] = Val;
                updateIfWanted();
            },

            setByObject = function(NaObject) {
                enforceNonArrayObject(NaObject, 'Flocks.bulk_set takes an object', 'Flocks.bulk_set takes a non-array object');
                if (handler(NaObject)) {
                    currentData = NaObject;
                }
                updateIfWanted();
            },

            setByPath = function(Path, Value) {
                enforceArray(Path, 'Flock.path_set must take an array for its path');
                return pathSet(Path, currentData, Value);
            },

            setByKey = function(Key, Value) {
                enforceString(Key, 'Flock.member_set must take a string for its key');

                var toHandle  = {};     // ... damnit json :|
                toHandle[Key] = Value;

                if (handler(toHandle)) {
                    currentData[Key] = Value;
                }

                updateIfWanted();
                return;
            };

        if (typeof target  === 'undefined') { throw 'flocks fatal error: must set a target'; }
        if (typeof control === 'undefined') { throw 'flocks fatal error: must set a control'; }

        // todo whargarbl what're docs lol

        return {

            // need to honor Handler
            // need set_path and get_path
            // need announce

            member_set: setByKey,

            set: function(Key, Value) {

                if      (typeof Key === 'string') { setByKey(Key, Value); }
                else if (isArray(Key))            { setByPath(Key, Value); }
                else if (isNonArrayObject(Key))   { setByObject(Key); }
                else                              { throw "Flocks.set/2 key must be a string or an array"; }

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

                updateIfWanted();

            },

            clear: function() {
                if (handler({})) {
                    currentData = {};
                }
                updateIfWanted();
                return;
            },

            // lock and unlock aren't subject to handling
            lock: function() {
                updatesBlocked = true;
                return;
            },

            unlock: function() {
                updatesBlocked = false;
                updateIfWanted();
                return;
            }

        };

    };





var exports = {

    member: Mixin,
    create: create

};





module.exports = exports;