/*jslint browser: true, indent: 2, nomen: true */
/*global define */

/*
  Edit Group page view.
*/
define([
// Libs.
  'jquery',

// Base views.
  'baseviews/hpBaseView',

// Child views.
  'components/formView'
], function ($, HpBaseView, FormView) {
    'use strict';

    return HpBaseView.extend({

        initialize: function () {
            console.log('editGroupView loaded');
            this.form = new FormView();
        },

        render: function () {
            // Setup tags.
            this.setupTagit('input[id$=txtInterests]');

            this.assign({
                '.edit-group-form' : this.form
            });
            return this;
        }
    });
});