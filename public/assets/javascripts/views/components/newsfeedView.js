/*jslint browser: true, indent: 2, nomen: true */
/*global require, define */

/*
  Newsfeed view.
*/
define([
// Libs
  'jquery',
  'backbone',

// Base views.
  'baseviews/hpBaseView',

// Components.
  'components/postFormView',
  'components/taggingView',
  'components/activityFeedView',
  'models/Post'
], function ($, Backbone, HpBaseView, PostFormView, TaggingView, ActivityFeedView, PostModel) {
    'use strict';

    return HpBaseView.extend({
        events: {
            'click .add-tag': 'toggleTaggingInterface',
            'click .newsfeed-tabs li:not(.active) a': 'reloadPosts'
        },

        /**
        * Initialize.
        */
        initialize: function () {
            // Init child views.
            this.postForm = new PostFormView();
            this.taggingInterface = new TaggingView();
            this.activityFeedAll = new ActivityFeedView();
            this.activityFeedSub = new ActivityFeedView();
            this.activityFeedHot = new ActivityFeedView();

            this.postForm.on('post', this.createNewPost, this);
        },

        /**
        * Render.
        *
        * Returns this.
        */
        render: function () {
            // Render child views.
            this.assign({
                '.post-status': this.postForm,
                // Attach the post form to all comments forms in the newsfeed.
                '.tagging-interface': this.taggingInterface,
                '#newsfeed-all': this.activityFeedAll,
                '#newsfeed-profile': this.activityFeedSub,
                '#hot-topics': this.activityFeedHot
            });

            this.activeFeed = '#newsfeed-all';

            return this;
        },

        createNewPost: function (data){

            this.activityFeedAll.postCollection.create({
                body : data.body,
                mentions : data.tags
            }, {wait: true});

            this.taggingInterface.clearTags();
            if(this.taggingInterface.$el.is(':visible')){
               this.taggingInterface.$el['hide'].call(this.taggingInterface.$el);       
            }
            return this;
        },

        /**
        * Toggle the visibility of the tagging interface.
        *
        * Returns this.
        */
        toggleTaggingInterface: function (event) {
            var fn = this.taggingInterface.$el.is(':visible') ? 'hide' : 'show'
            event.preventDefault();
            this.taggingInterface.$el[fn].call(this.taggingInterface.$el);
            return this;
        },
        reloadPosts: function (event) {

            return this;
        }
    });
});