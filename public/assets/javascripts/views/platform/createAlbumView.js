/*jslint browser: true, indent: 2, maxlen: 80, nomen: true, plusplus: true */
/*global define, LiveValidation, Validate */

/*
  Create album page view.
*/
define([
  // Libs.
  'jquery',
  'underscore',

  // Base views.
  'baseviews/hpBaseView',

  // Components
  'components/formView',
  'components/addPhotosView'
], function ($, _, HpBaseView, FormView, AddPhotosView) {
  'use strict';

  return HpBaseView.extend({
    events: {
    },

    /**
     * Initialize.
     */
    initialize: function () {
      // Init child views.
      this.form = new FormView();
      this.addPhotos = new AddPhotosView();
    },

    /**
     * Render.
     *
     * Returns this.
     */
    render: function () {
      // Render child views.
      this.assign({
        '.create-new-album': this.form,
        '.add-photos': this.addPhotos
      });

      this.form.addValidations({
        'title': new LiveValidation('album-title').add(Validate.Presence)
      });

      return this;
    }
  });
});