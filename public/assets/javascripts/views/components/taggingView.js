/*jslint browser: true, indent: 2, nomen: true */
/*global define */

/*
  Tagging interface view.

  See: _tagging-interface.scss
*/
define([
  // Libs.
  'jquery',
  'underscore',

  // Base views.
  'baseviews/hpBaseView'
], function ($, _, HpBaseView) {
  'use strict';

  return HpBaseView.extend({
    events: {

    },

    // Data source for the typeahead.
    source: 'api/v1/users',

    // Cache the data from the source.
    data: null,

    // Track tags.
    tags: [],

    /**
    * Initialize.
    */
    initialize: function () {
      // Listen for when the data gets set.
      this.on('reset', this.initTypeahead, this);
    },

    /**
     * Render.
     *
     * Returns this.
     */
    render: function () {
      // Get the data.
      this.setSource();

      // Element references.
      this.$input = this.$el.find('.add-tag-typeahead');
      this.$list = this.$el.find('.tag-list');
    

      return this;
    },

    /**
     * Set the data source.
     *
     * url - URL to fetch data from.
     *
     * Returns this.
     */
    setSource: function (url) {
      this.data = null;
      this.source = url || this.source;

      // Get and cache the data.
      $.getJSON(this.source, _.bind(function (response) {
        this.data = response.users;
        this.trigger('reset');
      }, this));

      return this;
    },

    /**
     * Start up the typeahead plugin.
     *
     * Returns this.
     */
    initTypeahead: function () {
      // Init the typeahead plugin.
      this.$input.typeahead({
        source: _.pluck(this.data, 'username'),
        matcher: _.bind(function (item) {
          // Don't show items already tagged.
          return $.inArray(item, this.tags) === -1 ? true : false;
        }, this),
        updater: _.bind(function (item) {
          this.tags.push(item);
          // Append the tag.
          this.$list.append('<li><a href="#" class="tag">' + item + '</a></li>');

          // Don't add the item to the input.
          return '';
        }, this)
      });
      
      return this;
    },
  
    /**
     * Get the tags.
     *
     * Returns the array of tags.
     */
    getTags: function () {
      return this.tags;
    }
  });
});