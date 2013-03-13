/*jslint browser: true, indent: 2, maxlen: 80, nomen: true, plusplus: true */
/*global define */

/*
  Story block collection.

  See ./models/storyBlockModel.js
*/
define([
  // Libs
  'backbone',

  // Models
  'models/storyBlockModel'
], function (Backbone, StoryBlockModel) {
  'use strict';

  return Backbone.Collection.extend({
    // Collection model.
    model: StoryBlockModel,

    // Resource location.
    url: 'json/stories_grid_prototype.json',

    // Default sort order, descending (newest first, highest first).
    sortOrder: 'desc',

    /**
     * Initialize.
     */
    initialize: function () {
      // Default sort is by date.
      this.setSort('date');
    },

    /**
     * Get data based on page and filter options.
     *
     * options  - Filter the data based on 
     *
     * Returns the filtered data.
     */
    getFilteredData: function (options) {
      var models = this.models,
        notEnough,
        start,
        end;

      options = options || {};

      // Select models that match the current category filter.
      if (options.filter && options.filter !== 'all') {
        models = this.filter(function (model) {
          if (model.get('category') === options.filter) {
            return model;
          }
        });
      }

      // Set up the pagination variables.
      end = options.page * options.count;
      start = end - options.count;

      // Test how much data is left.
      if (models.slice(end).length < options.count) {
        // This would be a good place to set a variable that tracks
        // if there is not enough data to display.
        notEnough = true;
      }

      // Return the set of items for this page.
      return models.slice(start, end);
    },

    /**
     * Set the comparator function for this collection.
     * See: http://backbonejs.org/#Collection-comparator
     *
     * Should this collection just create sortBy<property> functions
     * automatically? i.e. this['sortBy' + model.get(prop)] = function () {};
     *
     * property   - Name of the property to sort by. You should create a
     *              comparator function for each property to plan to
     *              sort by. They take the form `sortBy<Property>`.
     * direction  - Sort direction. Can be `asc` or `desc`. Defaults to
     *              this.sortOrder.
     *
     * Examples:
     *
     *  To sort by date:
     *    desc: this.setSort('date', 'desc');
     *    asc: this.setSort('date', 'asc');
     *
     * Returns this.
     */
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
      this.sort({silent: true});
      return this;
    },

    /**
     * Sort by date comparator function.
     *
     * model  - Model passed from this#comparator.
     *
     * Returns the data value.
     */
    sortByDate: function (model) {
      return new Date(model.get('date')).getTime() * -1;
    },

    /**
     * Sort by likes comparator function.
     *
     * model  - Model passed from this#comparator.
     *
     * Returns the like value.
     */
    sortByLikes: function (model) {
      return model.get('likes') * -1;
    },

    /**
     * Sort by title comparator function.
     *
     * model  - Model passed from this#comparator.
     *
     * Returns the title string.
     */
    sortByTitle: function (model) {
      return model.get('title').toLowerCase();
    },

    /**
     * Sort by author comparator function.
     *
     * model  - Model passed from this#comparator.
     *
     * Returns the author string.
     */
    sortByAuthor: function (model) {
      return model.get('author').toLowerCase();
    }
  });
});