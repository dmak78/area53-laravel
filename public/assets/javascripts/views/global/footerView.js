/*jslint browser: true, indent: 2, nomen: true */
/*global require, define */


define([
  // Libs.
  'jquery',
  'underscore',
  'backbone',

  // Base views.
  'baseviews/hpBaseView',
  'text!templates/layouts/footer.html'
], function ($, _, Backbone, HpBaseView, FooterTemplate) {
  'use strict';

  return HpBaseView.extend({

    template: _.template(FooterTemplate),

    /**
     * Initialize.
     */
    initialize: function () {
      this.$el.append(this.template());
    },

    events: {

    },

    /**
     * Render.
     *
     * Returns this.
     */
    render: function () {      
      return this;
    }
  });
});