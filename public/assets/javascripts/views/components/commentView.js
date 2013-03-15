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

// Templates
  'text!templates/comment.html'

], function ($, _, Backbone, HpBaseView, CommentTemplateText) {
    'use strict';

    return HpBaseView.extend({

        tagName: "li",
        className: "status-update",

        events: {
            'click .delete': 'clear',
            'click .flag': 'toggleFlagged',
            'click .view-all-comment': 'showFullMessage'
        },

        commentTemplate: _.template(CommentTemplateText),

        /**
        * Initialize.
        */
        initialize: function (options) {
            this.model.bind('destroy', this.remove, this);

        },

        /**
        * Render.
        *
        * Returns this.
        */
        render: function () {
            this.userId = $("input[name$=hdnUserId]").val();
            this.$el.html(this.commentTemplate(this.model.toJSON()));
            if (this.model.attributes.OwnerId != this.userId && commentControls.indexOf("allDelete") == -1) {
                this.$el.find('.subcomment.delete').remove();
            }
            return this;
        },
        clear: function (event) {
            event.preventDefault();
            this.model.destroy({wait:true});
        },
        remove: function () {
            this.$el.slideUp('fast', function () { $(this).remove(); });
        },
        toggleFlagged: function (event) {
            event.preventDefault();
            var $target = $(event.target);
            if ($target.hasClass('active')) {
                $target.removeClass('active');
            }
            else {
                $target.addClass('active');
            }

            this.model.toggleFlag();
        },
        showFullMessage: function (event) {
            event.preventDefault();
            this.$el.find('.snip-comment').hide(); ;
            this.$el.find('.full-comment').show();
            this.$el.find('.view-all-comment').hide();
        }
    });
});