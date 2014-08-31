/** @jsx React.DOM */
/* jshint node: true */

'use strict';

var React = require('react'),

    flContextTypes = {
        root : React.PropTypes.object,
        depth : React.PropTypes.number,
        updateFunc: React.PropTypes.func.isRequired
    },

    Mixin = {

        contextTypes: flContextTypes,
        childContextTypes: flContextTypes,

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

    create = function(TargetTag, RenderDescriptor) {

        var CurrentData    = {},
            UpdatesBlocked = false,

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
                console.log('typeof TargetTag ' + typeof TargetTag);
                React.renderComponent(RenderDescriptor(CurrentData), TargetTag);
            };

        // todo whargarbl what're docs lol

        return {

            set: function(Key, Value) {
                enforceString(Key, 'Flock.to must take a string for its key');
                CurrentData[Key] = Value;
                updateIfWanted();
                return;
            },

            get: function(What) {
                return (What === undefined)? CurrentData : CurrentData[What];
            },

            bulk: function(Request) {
                enforceNonArrayObject(Request, 'Flocks.bulk takes an object', 'Flocks.bulk takes a non-array object');

                for (var i in Request.keys()) {
                    CurrentData[i] = Request[i];
                }

                updateIfWanted();

            },

            clear: function() {
                CurrentData = {};
                updateIfWanted();
                return;
            },

            lock: function() {
                UpdatesBlocked = true;
                return;
            },

            unlock: function() {
                UpdatesBlocked = false;
                updateIfWanted();
                return;
            }

        };

    };



module.exports = {

    member: Mixin,
    create: create

};