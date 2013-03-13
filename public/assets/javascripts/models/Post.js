/*jslint browser: true, indent: 2, maxlen: 80, nomen: true, plusplus: true */
/*global define */

/*
Post Model

*/
define([
// Libs
   'jquery',
  'underscore',
  'backbone'
], function ($, _, Backbone) {
    'use strict';

    return Backbone.Model.extend({

        sync: function (method, model, options) {

        },

        parse: function (data) {
            data.content = data.body;
            return data;
        },
        toggleLiked: function () {
           
        },
        toggleFlagged: function () {
          
        }
    });
});
