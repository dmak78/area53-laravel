/*jslint browser: true, indent: 2, nomen: true */
/*global define */

/*
  About page view.
*/
define([
// Libs.
  'jquery',

// Base views.
  'baseviews/hpBaseView'
], function ($, HpBaseView) {
    'use strict';

    return HpBaseView.extend({

        initialize: function () {
            console.log("aboutView loaded");
        },

        render: function () {
            return this;
        }

    });
});