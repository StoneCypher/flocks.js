/** @jsx React.DOM */
/* jshint node: true */

'use strict';

var React = require('react'),

    flContextTypes = {
        root       : React.PropTypes.object,
        depth      : React.PropTypes.number,
        updateFunc : React.PropTypes.func.isRequired
    },

    Mixin = {

        contextTypes      : flContextTypes,
        childContextTypes : flContextTypes,

        getChildContext: function() {

            var defaultingContext = {};
            for (var i in flContextTypes.keys()) {
                // root is a special case; so is depth
                if ((i !== 'root') && (i !== 'depth')) {
                    defaultingContext[i] = (this.props[i] !== undefined)? this.props[i] : this.context[i];
                }
            }

            // root auto-handles self-if-no-parent
            defaultingContext.root = ((this.context.root === undefined)? this : this.context.root);

            // root auto-handles depth too
            defaultingContext.depth = ((this.context.depth === undefined)? 0 : this.context.depth + 1);

            return defaultingContext;

        }
    },

    create = function(TargetTag, RenderDescriptor, ProvidedHandler) {

        var currentData    = {},
            updatesBlocked = false,
            dirty          = false,
            handler        = ProvidedHandler || function() { return true; },

            enforceString = function(On, Label) {
                if (typeof On !== 'string') {
                    throw Label;
                }
            },

            enforceNonArrayObject = function(On, NonObjLabel, ArrayLabel) {
                if (typeof On !== 'object') {
                    throw NonObjLabel;
                }
                if (Object.prototype.toString.call(On) === "[object Array]") {
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
            };

        // todo whargarbl what're docs lol

        return {

            // need to honor Handler
            // need set_path and get_path
            // need announce

            set: function(Key, Value) {
                enforceString(Key, 'Flock.to must take a string for its key');

                var toHandle  = {};     // ... damnit json :|
                toHandle[Key] = Value;

                if (handler(toHandle)) {
                    currentData[Key] = Value;
                }

                updateIfWanted();
                return;
            },

            get: function(What) {
                return (What === undefined)? currentData : currentData[What];
            },

            bulk_set: function(request) {
                enforceNonArrayObject(request, 'Flocks.bulk_set takes an object', 'Flocks.bulk_set takes a non-array object');

                if (handler(request)) {
                    currentData = request;
                }

                updateIfWanted();
            },

            bulk_update: function(request) {
                enforceNonArrayObject(request, 'Flocks.bulk_update takes an object', 'Flocks.bulk_update takes a non-array object');

                var currentBase = currentData;
                for (var i in request.keys()) {
                    currentBase[i] = request[i];
                }

                if (handler(currentBase)) {
                    currentData = currentBase;
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



module.exports = {

    member: Mixin,
    create: create

};