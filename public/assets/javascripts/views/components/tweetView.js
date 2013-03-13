/*jslint browser: true, indent: 2, nomen: true */
/*global define */

/*
  Single Tweet View
*/
define([
  // Libs
  // Libs
  'jquery',
  'underscore',
  'backbone',

  // Base views.
  'baseviews/hpBaseView'
], function ($, _, Backbone, HpBaseView) {
  'use strict';

  return HpBaseView.extend({
    tagName : "li",
    className : "status-update",

    render : function() {
      this.$el.html(this.model.get("text"));
    return this;
  }
  });
});