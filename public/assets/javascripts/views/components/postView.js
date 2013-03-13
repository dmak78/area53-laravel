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

  'components/postFormView',

// Templates
  'text!templates/post.html'
], function ($, _, Backbone, HpBaseView, CommentView, CommentCollection, CommentModel, PostFormView, PostTemplateText) {
    'use strict';

    return HpBaseView.extend({

        tagName: "article",
        className: "status-update",

        postTemplate: _.template(PostTemplateText),

        showAllComments: false,

        events: {
            'click a.showMoreComments': 'toggleComments',
            'click .like': 'toggleLiked',
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

            this.commentCollection = new CommentCollection();
            this.commentCollection.parentView = this;
            this.commentCollection.on('reset', this.renderComments, this);
            this.commentCollection.on('add', this.renderComment, this);

            this.commentForm = new PostFormView();
            this.commentForm.on('post', this.addComment, this);

            this.model.bind('destroy', this.remove, this);
            this.model.on('likeUp', this.likeUp, this);
            this.model.on('likeDown', this.likeDown, this);
        },

        /**
        * Render.
        *
        * Returns this.
        */
        render: function () {

            this.$el.html(this.postTemplate(this.model.toJSON()));
            // this.$commentList = this.$el.find('ul.status-comments');
            // this.$likeButton = this.$el.find('.like');
            // this.$flagButton = this.$el.find('.post.flag');
            // this.$pinButton = this.$el.find('.pin');
            // this.$likePeople = this.$el.find('.likePeople');
            // this.$likeCount = this.$el.find('.likeCount');
            // this.$tagList = this.$el.find('ul.tag-list');
            // this.$likePeopleModal = this.$el.find('a.likePeopleModal');
            $("abbr.timeago").timeago();
           
            return this;
        },
        renderComments: function () {
            if (this.showAllComments === true) {
                this.$commentList.html('');
                var that = this;
                _.each(this.commentCollection.models, function (comment, index) {
                    var commentView = new CommentView({
                        model: comment
                    });
                    that.$commentList.append(commentView.render().el);

                }, this);
            }
            else {
                var that = this;
                this.$commentList.html('');
                _.each(this.commentCollection.models, function (comment, index) {
                    if (index > this.commentCollection.models.length - 3) {
                        var commentView = new CommentView({
                            model: comment
                        });
                        that.$commentList.append(commentView.render().el);
                    }
                }, this);
            }
            this.$el.find('abbr.timeago').timeago();
            return this;
        },
        renderComment: function (comment) {
            var commentView = new CommentView({
                model: comment
            });
            this.$commentList.append(commentView.render().el);
            this.$el.find('abbr.timeago').timeago();

            return this;
        },
        toggleLiked: function (event) {
            event.preventDefault();

            var text = this.$likeButton.text() == 'Like' ? 'Liked' : 'Like';
            this.$likeButton.text(text).toggleClass('liked');

            this.model.toggleLiked();

            return this;
        },
        likeUp: function () {
            var currentCount = parseInt(this.model.get('LikeCount'));
            if (currentCount > 1) {
                this.$likePeople.text("people like");
                this.$likeCount.text(currentCount);
            }
            else {
                this.$likePeople.text("person likes");
                this.$likeCount.text(currentCount);
            }

            this.$likePeopleModal.fadeIn('fast');

            return this;
        },
        likeDown: function () {
            var currentCount = parseInt(this.model.get('LikeCount'));
            if (currentCount == 0) {
                this.$likePeopleModal.fadeOut('fast');
            }
            else if (currentCount == 1) {
                this.$likePeople.text("person likes");
                this.$likeCount.text(currentCount);
            }
            else {
                this.$likePeople.text("people like");
                this.$likeCount.text(currentCount);
            }
            return this;
        },
        toggleFlagged: function (event) {
            event.preventDefault();

            this.$flagButton.toggleClass('active');

            this.model.toggleFlagged();
        },
        togglePinned: function (event) {
            event.preventDefault();
            console.log(this.postId);
            if ($(event.target).hasClass('active')) {
                callWebMethod(WALL_SERVICE, 'TogglePin', { postId: this.postId }, function (result) {
                    $(event.target).removeClass('active');
                    var that = this;
                    $('#hot-topics article.status-update').each(function (index) {
                        if ($(this).data('postid') == that.postId) {
                            $(this).fadeOut('fast', function () { $(this).remove(); });
                        }
                    });
                    $("article.status-update").each(function (index) {
                        if ($(this).data('postid') == that.postId) {
                            $(this).find('.hot-topic').removeClass('active');
                        }
                    });
                }, this);
            }
            else {
                callWebMethod(WALL_SERVICE, 'TogglePin', { postId: this.postId }, function (result) {
                    var that = this;
                    $("article.status-update").each(function (index) {
                        if ($(this).data('postid') == that.postId) {
                            $(this).find('.hot-topic').addClass('active');
                        }
                    });

                }, this);
            }
        },
        addComment: function (data) {
            this.commentCollection.create({ parentPostId: this.postId, originalMessage: data.content }, { wait: true });

            return this;
        },
        toggleComments: function (event) {
            event.preventDefault();
            this.showAllComments = !this.showAllComments;
            $(event.target).hide();
            this.renderComments();
            console.log($(this.commentForm.el));
            this.scrollToCommentForm($(this.commentForm.el));
            //this.commentForm.$el.find('textarea').data('wysihtml5').editor.focus();
        },
        assignCommentForm: function () {
            this.assign({
                '.post-comment-form': this.commentForm
            });
        },
        clear: function (event) {
            event.preventDefault();
            this.model.destroy();
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
            event.preventDefault();
            this.$el.find('.snip-post').hide(); ;
            this.$el.find('.full-post').show();
            this.$el.find('.view-all-post').hide();

            return this;
        },
        showLikeModal: function (event) {
            event.preventDefault();
            callWebMethod(WALL_SERVICE, "GetPostLikes", { postId: this.postId }, this.populateLikeModal);

        },
        populateLikeModal: function (result) {
            var that = this;
            var $profileList = $('#like-people-modal .modal-content ul');
            $profileList.empty();
            _.each(result.d.Profiles, function (profile, index) {
                $profileList.append('<li><div class="avatar small"><img src="' + profile.ProfileImage + '"/></div><a href="' + profile.ProfileUrl + '" class="user-name">' + profile.DisplayName + '</a></li>');

            }, this);

            $('#like-people-modal').modal('show');
        },
        removeMention: function (event) {
            var $targetTag = $(event.target).closest('li');
            event.preventDefault();
            var mentionUserId = $targetTag.data("userid");
            var grpId = 0;

            if (this.profileType == "HPGroupProfile") {
                grpId = this.profileId;
            }
            callWebMethod(WALL_SERVICE, "RemoveMention", { 'postId': this.postId, 'mentionUserId': mentionUserId, 'groupId': grpId }, function (result) {
                if (result.d.Value == "OK") {
                    $targetTag.fadeOut('fast', function () { $(this).remove(); });

                }
            }, this);

            return this;
        }
    });
});