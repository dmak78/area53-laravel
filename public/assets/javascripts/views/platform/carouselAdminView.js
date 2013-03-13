/*jslint browser: true, indent: 2, nomen: true */
/*global define */

/*
  Carousel admin view.
*/
define([
// Libs
  'jquery',
  'underscore',
  'backbone',

// Base views.
  'baseviews/hpBaseView',

//js libs
  'libs/carousel-admin'
], function ($, _, Backbone, HpBaseView) {
    'use strict';

    return HpBaseView.extend({
        initialize: function () {
            console.log('carouselAdminView loaded');        
            
        },
        render: function () {
            return this;
        }
    });
});