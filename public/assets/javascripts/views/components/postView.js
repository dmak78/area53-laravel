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

  'components/commentView',

  'collections/Comments',

  'models/Comment',

  'components/commentFormView',

// Templates
  'text!templates/post.html'
], function ($, _, Backbone, HpBaseView, CommentView, CommentCollection, CommentModel, CommentFormView, PostTemplateText) {
    'use strict';

    return HpBaseView.extend({

        tagName: "article",
        className: "status-update",

        postTemplate: _.template(PostTemplateText),

        showAllComments: true,

        events: {
            'click a.showMoreComments': 'toggleComments',
            'click .like:not(.liked)': 'addLike',
            'click .like.liked': 'removeLike',
            'click .post.flag': 'toggleFlagged',
            'click .hot-topic': 'togglePinned',
            'click .post.delete': 'clear',
            'click .view-all-post': 'showFullMessage',
            'click .likePeopleModal': 'showLikeModal',
            'click a.tagit-close': 'removeMention'
        },

        /**
        * Initialize.
        */
        initialize: function (options) {

            this.commentForm = new CommentFormView();
            this.commentForm.on('postComment', this.addNewComment, this);

            this.model.bind('destroy', this.remove, this);
            this.model.on('sync', this.render, this);

            this.model.comments.on('reset', this.renderComments, this);
            this.model.comments.on('add', this.renderComment, this);
        },

        /**
        * Render.
        *
        * Returns this.
        */
        render: function () {
            this.$el.html(this.postTemplate(this.model.toJSON()));
            this.$commentList = this.$el.find('ul.status-comments');    
            this.assign({
                '.post-comment' : this.commentForm
            });
            this.$el.find("abbr.timeago").timeago();
            return this;
        },
        renderUpdate: function (){
            this.$el.html(this.postTemplate(this.model.toJSON()));
        },
        renderComments: function () {
            this.model.comments.each(this.renderComment, this);
        },
        renderComment: function (comment) {
            var commentView = new CommentView({
                model: comment
            });
            this.$commentList.append(commentView.render().el);
        },
        addLike: function (event) {
            event.preventDefault();
            this.model.set('is_liked', true);
            this.model.save({wait:true});
        },
        removeLike: function (event){
            event.preventDefault();
            this.model.set('is_liked', false);
            this.model.save({wait:true});
        },
        likeUp: function () {

        },
        likeDown: function () {

        },
        toggleFlagged: function (event) {

        },
        togglePinned: function (event) {

        },
        addNewComment: function (data) {
            // this.commentCollection.create({ body: data.body }, { wait: true });
            // return this;
            this.model.addComment(data.body);
            return this;
        },
        toggleComments: function (event) {

        },
        assignCommentForm: function () {
            this.assign({
                '.post-comment-form': this.commentForm
            });
        },
        clear: function (event) {
            event.preventDefault();
            this.model.destroy({wait:true});
        },
        remove: function () {
            this.$el.slideUp('fast', function () { $(this).remove(); });
        },
        scrollToCommentForm: function ($commentForm) {
            window.setTimeout(function () {
                $('html, body').animate({
                    scrollTop: $commentForm.offset().top - 300
                }, 300, function () {
                    var originalTextarea = $commentForm.find("textarea");
                    originalTextarea.trigger("click");

                });

            }, 100);
        },
        showFullMessage: function (event) {

        },
        showLikeModal: function (event) {
            event.preventDefault();
            _.each(this.model.attributes.likes, function(like){
                console.log(like.user.username);
            }, this);

        },
        populateLikeModal: function (result) {

        },
        removeMention: function (event) {

        }
    });
});