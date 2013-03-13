/*jslint browser: true, indent: 2, nomen: true */
/*global define */

/*
  Tweets View
*/
define([
  // Libs
  // Libs
  'jquery',
  'underscore',
  'backbone',

  // Base views.
  'baseviews/hpBaseView',
  'components/tweetView'
], function ($, _, Backbone, HpBaseView, TweetView) {
  'use strict';

  return HpBaseView.extend({

    initialize : function (options){
      this.collection.on("add", this.renderTweet, this);
    },

    render : function() {
      return this;
    },
    renderTweet : function (model){

        var tweetView = new TweetView({
          model: model
        });
       this.$el.prepend(tweetView.render().el);
    }
  });
});