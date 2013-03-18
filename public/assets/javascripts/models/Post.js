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

        parse: function (data) {
          if(typeof(data.created_at) == 'object'){
            data.created_at = data.created_at.date;
          }
            return data;
        },
        toggleLiked: function () {
           
        },
        toggleFlagged: function () {
          
        }
    });
});
