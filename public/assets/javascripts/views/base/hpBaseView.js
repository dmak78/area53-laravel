/*jslint browser: true, indent: 2, maxlen: 80, nomen: true, plusplus: true */
/*global require, define */

/*
  OneHP base view.
*/
define([
  // Router
  'routers/router',
  // Libs.
  'underscore',
  'backbone'
], function (router, _, Backbone) {
  'use strict';

  return Backbone.View.extend({
    /**
     * Render, no-op.
     */
    render: function () {
      return this;
    },

    /**
     * Set up the tagit jQuery plugin.
     *
     * element  - CSS selector to init tag-it on.
     * extraSettings  - Object of extra settings to pass into tag-it.
     *                  See: https://github.com/aehlke/tag-it
     *
     * Returns this.
     */
    setupTagit: function (element, extraSettings) {
      var options = {},
        defaults = {
          allowSpaces: true,
          removeConfirmation: true
        };

      extraSettings = extraSettings || {};
      _.extend(options, defaults, extraSettings);

      // Require the tagit library.
      require(['libs/tag-it'], _.bind(function () {
        this.$el.find(element).tagit(options);
      }, this));

      return this;
    },

    pushStateNav: function (event) {
      var $target = $(event.target),
        href = $target.attr('href') || $target.closest('a').attr('href');
      if (window.history.pushState) {
        event.preventDefault();
        router.navigate(href, { trigger: true });
      }
    },

    /**
     * Convert a key, value pair to an object.
     *
     * key    - A valid object key value. If it's an object, it gets returned
     *          immediately.
     * value  - An object value.
     *
     * Returns an object.
     */
    convertToObject: function (key, value) {
      var object;

      if (_.isObject(key)) {
        object = key;
      } else {
        object = {};
        object[key] = value;
      }

      if (!object) {
        object = false;
      }

      return object;
    },

    /**
     * Use Twitter Bootstraps tooltip plugin.
     *
     * element  - A CSS selector string to find.
     * options  - Twitter Bootstrap tooltip options.
     *
     * Returns this.
     */
    tooltip: function (element, options) {
      var elements = this.convertToObject(element, options);

      _.each(elements, function (options, element) {
        this.$el.find(element).tooltip(options);
      }, this);

      return this;
    },

    /**
     * Public: Assign method for rendering subviews.
     * From: ianstormtaylor.com/assigning-backbone-subviews-made-even-cleaner/
     *
     * selector - A CSS selector to bind the view to.
     * view     - An instantiated Backbone view object.
     *
     * Returns this.
     */
    assign: function (selector, view) {
      var selectors = this.convertToObject(selector, view);

      _.each(selectors, function (view, selector) {
        view.setElement(this.$(selector)).render();
      }, this);

      return this;
    },

    /**
     * Parse a query string.
     *
     * string - Query string to parse.
     *
     * Returns an object with the parsed query string in key => value format.
     */
    parseQueryString: function (string) {
      var query = {};

      // Remove the '?'
      string = string.slice(1);

      _.each(string.split('&'), function (part) {
        var keyValue = part.split('=');
        query[keyValue[0]] = keyValue[1];
      }, this);

      return query;
    }
  });
});