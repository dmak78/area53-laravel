/*jslint browser: true, indent: 2, nomen: true */
/*global require, define */

/*
Newsfeed view.
*/
define([
// Libs
  'jquery',
  'underscore',
  'backbone',

// Base views.
  'baseviews/hpBaseView',

  'collections/Posts',
  'components/postView'

], function ($, _, Backbone, HpBaseView, PostCollection, PostView) {
    'use strict';

    return HpBaseView.extend({

        events: {
            'click #aMorePostsBtn': 'loadMorePosts'
        },

        /**
        * Initialize.
        */
        initialize: function () {
            this.postCollection = new PostCollection();
            this.on('reloadPosts', this.reloadPosts, this);
            this.postCollection.on("reset", this.renderPosts, this).fetch();
            this.postCollection.on("add", this.addPost, this);
            //setInterval(_.bind(this.postCollection.update, this.postCollection),3000);
        },

        /**
        * Render.
        *
        * Returns this.
        */
        render: function () {
            return this;
        },
        renderPosts: function () {
            this.$el.empty();
            this.postCollection.each(this.renderPost, this);

            return this;
        },
        renderPost: function (post) {
            var postView = new PostView({
                model: post
            });
            this.$el.prepend(postView.render().el);

            return this;
        },
        addPost: function (post) {

            var postView = new PostView({
                model: post
            });

            this.$el.prepend(postView.render().el);
            
            return this;
        },
        loadMorePosts: function (event) {

            return this;
        },
        reloadPosts: function () {

            return this;
        }
    });
});