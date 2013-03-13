/*jslint browser: true, indent: 2, nomen: true */
/*global define */

/*
  Feedback page view.
*/
define([
  // Libs.
  'jquery',
  
  // Base views.
  'baseviews/hpBaseView'
], function ($, HpBaseView) {
  'use strict';
  
  return HpBaseView.extend({
    events: {
      'click .cancel': 'clearTextarea'
    },
    
    initialize: function () {
    },
    
    /**
     * Clear the extra input textarea input when cancelling.
     *
     * event  - Event object from the click.
     *
     * Returns this.
     */
    clearTextarea: function (event) {
      $(event.target).siblings('.extra-input').val('');
      return this;
    }
  });
});