/*jslint browser: true, indent: 2, nomen: true */
/*global require, define */

/*
  Dropdown view.

  Dropdown menu, mostly for touch devices.

  Releated Sass files
    - modules/menus
*/
define([
  // Libs
  'jquery',
  'underscore',
  'backbone',

  // Base views
  'baseviews/hpBaseView'
], function ($, _, Backbone, HpBaseView) {
  'use strict';

  return HpBaseView.extend({
    events: {
      'touchstart': 'toggleMenu'
    },

    /**
     * Toggle menu state.
     *
     * event  - Event object.
     *
     * Returns this.
     */
    toggleMenu: function (event) {
      event.preventDefault();

      if (this.$el.hasClass('dropdown') || this.$el.parent().hasClass('dropdown')) {
        this.$el.toggleClass('active');
      } else if (this.$el.get(0).nodeName === 'A') {
        window.location.href = $target.attr('href');
      }

      return this;
    }
  });
});