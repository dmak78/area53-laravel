/*jslint browser: true, indent: 2, nomen: true */
/*global define */

/*
  Edit album view.
*/
define([
// Libs
  'jquery',
  'underscore',

// Base views.
  'baseviews/hpBaseView',

// Child views.
  'components/formView',
  'components/addPhotosView',

// Templates
  'text!templates/photo-list-item.html'
], function ($, _, HpBaseView, FormView, AddPhotosView, itemTemplate) {
    'use strict';

    return HpBaseView.extend({
        events: {

        },



        /**
        * Initialize.
        */
        initialize: function () {
            console.log('editAlbumView loaded');
            this.form = new FormView();

            // Child views.
            this.addPhotos = new AddPhotosView();
        },

        /**
        * Render.
        *
        * Returns this.
        */
        render: function () {
            // Render the child view.
            this.assign({
                '.edit-album-form': this.form,
                '.add-photos': this.addPhotos
            });

            return this;
        }

     

    });
});