/*jslint browser: true, indent: 2, nomen: true */
/*global define */

/*
  My stories page.
*/
define([
  // Libs
  'jquery',

  // Base views
  'baseviews/hpBaseView'
], function ($, HpBaseView) {
  'use strict';

  return HpBaseView.extend({
    events: {
      'click .edit-story': 'editStory',
      'click .delete-story': 'deleteStory',
      'click .remove-tag': 'deleteStory'
    },

    /**
     * Initialize.
     */
    initialize: function () {
    },

    /**
     * Edit a story.
     *
     * event  - Event object from the click.
     *
     * Return this.
     */
    editStory: function (event) {
      var $target = $(event.target),
        $story = $target.closest('li'),
        id = $story.data('id');

      event.preventDefault();
      return this;
    },

    /**
     * Delete a story.
     *
     * event  - Event object from the click.
     *
     * Return this.
     */
    deleteStory: function (event) {
      var $target = $(event.target),
        $story = $target.closest('li'),
        id = $story.data('id');

      event.preventDefault();
      
      // Remove the story.
      $story.fadeOut(function () {
        $(this).remove();
      });
      
      return this;
    }
  });
});