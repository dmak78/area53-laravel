/*jslint browser: true, indent: 2, nomen: true */
/*global define */

/*
  Organization Chart widget.
*/
define([
  // Libs
  'jquery',
  'backbone',

  // Base views.
  'baseviews/hpBaseView'
], function ($, Backbone, HpBaseView) {
  'use strict';

  return HpBaseView.extend({
    events: {
      'click .toggle-chart': 'toggleChart',
      'touchstart .toggle-chart': 'toggleChart'
    },

    /**
     * Initialize.
     */
    initialize: function () {
      this.open = false;
    },

    /**
     * Render.
     */
    render: function () {
      this.$chart = this.$('.chart-list');
      
      // Get the max height.
      this.height = this.$chart.height();
      
      // Set the starting max-height to 0
      this.$chart.css({
        'max-height': 0,
        'position': 'relative'
      });
      
      // Show the thing.
      this.$el.css({'visibility': 'visible'});
    },

    /**
     * Open or close the organization chart.
     */
    toggleChart: function () {
      var newHeight = this.open ? 0 : this.height;
      
      this.$el.toggleClass('open');
      this.$chart.css('max-height', newHeight);
      
      this.open = !this.open;
    }
  });
});