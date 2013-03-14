/*jslint browser: true, indent: 2, maxlen: 80, nomen: true, plusplus: true */
/*global define */

/*
  Comment Collection.

*/
define([
// Libs
  'backbone',
  'underscore',

  'models/Comment'

], function (Backbone, _, CommentModel) {
    'use strict';

    return Backbone.Collection.extend({

        model: CommentModel,

        url: function (){
            return '/api/v1/posts/' + this.parentView.model.attributes.id + '/comments/';
        },

        initialize: function (options) {
            this.setSort('date', 'asc');
        },

        setSort: function (property, direction) {
            var fn = this['sortBy' + property.charAt(0).toUpperCase() +
               property.slice(1)];

            // Set the sort order.
            direction = direction || this.sortOrder;

            // Set the comparator function.
            this.comparator = fn;

            // Change the output of the comparator for `asc` results.
            if (direction === 'asc') {
                this.comparator = function (model) {
                    var value = fn(model);
                    return value * -1;
                };
            }

            // Sort the collection
            this.sort({ silent: true });
            return this;
        },

        sortByDate: function (model) {
            return new Date(model.get('Iso8601TimeStamp')).getTime() * -1;
        }

    });
});