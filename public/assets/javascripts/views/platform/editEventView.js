/*jslint browser: true, indent: 2, nomen: true */
/*global define */

/*
  Edit event view.
  
  Extends the create event view.
*/
define([
  // Base Views.
  'views/platform/createEventView'
], function (CreateEventView) {
  'use strict';

  return CreateEventView.extend({
    /**
     * Initialize.
     */
    initialize: function () {
        // Call the super method.
        console.log('editEventView loaded');
      CreateEventView.prototype.initialize();
    }
  });
});