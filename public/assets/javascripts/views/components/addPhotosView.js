/*jslint browser: true, indent: 2, nomen: true */
/*global require, define */

/*
  Add Photos view.

  Small control used to add photos to a form.

  Uses an include: includes/form-element-add-photos.php
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
      'click .add-more-photos': 'addAnotherPhoto',
      'touchend .add-more-photos': 'addAnotherPhoto'
    },

    /**
     * Initialize.
     *
     * options   - Options object passed in from init (standard Backbone functionality).
     *             This object should contain a photo jQuery object, or else it will try
     *             and find the closest form.
     *
     * Returns this.
     */
    initialize: function (options) {
      options = options || {};
      this.$form = options.$form || false;
    },

    /**
     * Render.
     *
     * Returns this.
     */
    render: function () {
      if (!this.$form) {
        this.$form = this.$el.closest('.onehp-form');
      }

      return this;
    },

    /**
     * Add another photo chooser control.
     *
     * event - Event object from the click.
     *
     * Returns this.
     */
    addAnotherPhoto: function (event) {
//      var $photoList = this.$el.find('.add-photos-list');

//      event.preventDefault();

//      $photoList.append(
//        $photoList.find('li').first().clone().val('')
        //      );

        var uploadControls = $("li.new-image");
        uploadControls.filter(function () { return $(this).css('display') == 'none'; }).first().css("display", "block");
        var enabledUploadCount = uploadControls.filter(function () { return $(this).css('display') == 'block'; }).length;
        var maxUploadCount = Math.min(uploadControls.length, $("input[id$=imageUploadCount]").val());
        if (enabledUploadCount >= maxUploadCount) {
            $("a[id$=aAddMorePhotos]").css("display", "none");
        }

      return this;
    }
  });
});