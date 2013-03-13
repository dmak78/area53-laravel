/*jslint browser: true, indent: 2, nomen: true */
/*global define */

/*
  View all subscriptions you share page.
*/
define([
  // Base views
  'baseviews/hpBaseView'
], function (HpBaseView) {
  'use strict';

  return HpBaseView.extend({
    /**
     * Initialize.
     */
    initialize: function () {
      // Setup tooltips.
      this.tooltip({
        '.subscribe': {placement: 'left', title: 'Receive updates in your newsfeed'}
      });
    },

    /**
     * Render.
     */
    render: function () {
    }
  });
});