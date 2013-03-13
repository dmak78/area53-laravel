/*jslint browser: true, indent: 2, maxlen: 80, nomen: true, plusplus: true */
/*global define */

var self;

define([
// Libs
   'jquery',
  'underscore',
  'backbone',

  'models/Tweet'

], function ($, _, Backbone, TweetModel) {
    'use strict';

    return Backbone.Collection.extend({

        initialize : function(models, options) {
          this.query = options.query;
          self = this;
        },
        url : function() {
          return "http://search.twitter.com/search.json?q=" + this.query + "&callback=?";
        },
        parse : function(data) {
          // note that the original result contains tweets inside of a 'results' array, not at 
          // the root of the response.
          return data.results;
        },

        liveUpdate: function(){
          self.fetch({
            add: true
          })
          setTimeout(self.liveUpdate, 3000);
          return this;
        }    
  });
});