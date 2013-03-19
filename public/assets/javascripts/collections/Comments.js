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

        initialize: function (models, options) {
            this.setSort('date', 'asc');
            this.post = options.post;
        },

        url: function (){
            return this.post.url() + '/comments';
        },

        parse: function (data){
            console.log(data);
            return data;
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
            return new Date(model.get('created_at')).getTime() * -1;
        }

    });
});